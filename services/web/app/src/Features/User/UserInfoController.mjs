// Stub implementation for UserInfoController
import { expressify } from '@overleaf/promise-utils'

async function getLoggedInUsersPersonalInfo(req, res) {
  // Stub implementation
  res.json({})
}

async function getPersonalInfo(req, res) {
  // Stub implementation
  res.json({})
}

async function getUserFeatures(req, res) {
  // Stub implementation
  res.json({})
}

export default {
  getLoggedInUsersPersonalInfo: expressify(getLoggedInUsersPersonalInfo),
  getPersonalInfo: expressify(getPersonalInfo),
  getUserFeatures: expressify(getUserFeatures),
}
