// Utility function to get meta tags from the page
export default function getMeta(name: string, fallback?: any): any {
  // In a real implementation, this would read from meta tags in the HTML
  // For now, return a stub implementation
  const metaData: Record<string, any> = {
    'ol-ExposedSettings': {
      hasAffiliationsFeature: false,
    },
    'ol-isExternalAuthenticationSystemUsed': false,
    'ol-shouldAllowEditingDetails': true,
  }
  
  return metaData[name] ?? fallback
}
