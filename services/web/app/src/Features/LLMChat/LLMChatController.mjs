import logger from '@overleaf/logger'
import fetch from 'node-fetch'
import { AbortController } from 'abort-controller'

// Helper function to remove <think> tags
function stripThinkTags(content) {
  return content.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trim()
}

// Parse available models from environment variable
// Format: "model1,model2,model3" or just "model1"
function getAvailableModels() {
  const modelsEnv = process.env.LLM_AVAILABLE_MODELS || process.env.LLM_MODEL_NAME || 'qwen3-32b'
  const models = modelsEnv.split(',').map(m => m.trim()).filter(m => m.length > 0)
  
  // Return array of model objects
  return models.map((id, index) => ({
    id: id,
    name: id.replace(/-/g, ' ').toUpperCase(), // Simple formatting
    isDefault: index === 0 // First model is default
  }))
}

async function getModels(req, res) {
  try {
    const models = getAvailableModels()
    logger.info({ modelCount: models.length }, '[LLMChat] Returning available models')
    res.json({ models })
  } catch (error) {
    logger.error({ err: error }, '[LLMChat] Error getting models')
    res.status(500).json({ error: 'Failed to get models' })
  }
}

async function chat(req, res) {
  const { messages, model } = req.body // Now accepting model parameter
  const projectId = req.params.Project_id
  const userId = req.session?.user?._id

  logger.info({ 
    projectId, 
    userId,
    model: model || 'default',
    messageCount: messages?.length 
  }, '[LLMChat] Received chat request')

  if (!messages || !Array.isArray(messages)) {
    logger.error({ projectId }, '[LLMChat] Invalid messages format')
    return res.status(400).json({ error: 'Invalid messages format' })
  }

  if (!process.env.LLM_API_URL || !process.env.LLM_API_KEY) {
    logger.error('[LLMChat] Missing LLM_API_URL or LLM_API_KEY environment variables')
    return res.status(500).json({ error: 'LLM service not configured' })
  }

  // Validate model if provided
  const availableModels = getAvailableModels()
  const selectedModel = model || availableModels[0].id
  
  if (!availableModels.find(m => m.id === selectedModel)) {
    logger.error({ projectId, userId, selectedModel }, '[LLMChat] Invalid model selected')
    return res.status(400).json({ error: 'Invalid model selected' })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 300000) // 5 minutes (300 seconds) - well under the 10 min proxy timeout

  try {
    const llmApiUrl = `${process.env.LLM_API_URL}/chat/completions`
    
    logger.info({ 
      projectId,
      userId,
      url: llmApiUrl,
      model: selectedModel,
      messageCount: messages.length 
    }, '[LLMChat] Sending request to LLM API')

    const requestBody = {
      model: selectedModel,
      messages: messages,
      max_tokens: 8192,
      temperature: 0.7
    }

    const startTime = Date.now()
    
    const response = await fetch(llmApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LLM_API_KEY}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeout)
    const duration = Date.now() - startTime

    logger.info({ 
      projectId,
      userId,
      model: selectedModel,
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`
    }, '[LLMChat] Received response from LLM API')

    if (!response.ok) {
      const errorText = await response.text()
      logger.error({ 
        projectId,
        userId,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        duration: `${duration}ms`
      }, '[LLMChat] LLM API error response')
      
      return res.status(response.status).json({
        error: 'LLM API error',
        details: errorText,
        status: response.status
      })
    }

    const data = await response.json()
    
    // Strip <think> tags from the response content
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      const originalContent = data.choices[0].message.content
      const cleanedContent = stripThinkTags(originalContent)
      data.choices[0].message.content = cleanedContent
      
      logger.debug({
        projectId,
        userId,
        originalLength: originalContent.length,
        cleanedLength: cleanedContent.length
      }, '[LLMChat] Stripped think tags from response')
    }
    
    logger.info({ 
      projectId,
      userId,
      model: selectedModel,
      hasChoices: !!data.choices,
      choiceCount: data.choices?.length,
      duration: `${duration}ms`
    }, '[LLMChat] Successfully parsed LLM response')
    
    res.json(data)
  } catch (error) {
    clearTimeout(timeout)
    
    if (error.name === 'AbortError') {
      logger.error({ 
        projectId,
        userId,
        err: error 
      }, '[LLMChat] Request timeout')
      return res.status(504).json({ 
        error: 'LLM service timeout',
        details: 'The LLM API did not respond within 50 seconds'
      })
    }
    
    logger.error({ 
      projectId,
      userId,
      err: error,
      errorName: error.name,
      errorMessage: error.message
    }, '[LLMChat] Error communicating with LLM service')
    
    res.status(500).json({ 
      error: 'Failed to communicate with LLM service',
      details: error.message,
      type: error.name
    })
  }
}

export default {
  chat,
  getModels
}
