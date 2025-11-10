// Stub implementation for SessionManager

function getLoggedInUserId(session) {
  return session?.user?._id || null
}

function isUserLoggedIn(session) {
  return !!session?.user
}

function getSessionUser(session) {
  return session?.user || null
}

export default {
  getLoggedInUserId,
  isUserLoggedIn,
  getSessionUser,
}
