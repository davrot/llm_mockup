// Stub implementation for UserSessionsManager

function removeSessionsFromRedis(user, exclude, callback) {
  // Stub implementation
  if (callback) {
    callback()
  }
}

function getAllUserSessions(user, exclude, callback) {
  // Stub implementation
  callback(null, [])
}

export default {
  removeSessionsFromRedis,
  getAllUserSessions,
}
