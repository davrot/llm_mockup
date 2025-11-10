// Stub implementation for UserController
import { expressify } from '@overleaf/promise-utils'

async function updateUserSettings(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function changePassword(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function logout(req, res) {
  // Stub implementation
  req.session.destroy(() => {
    res.redirect('/')
  })
}

async function clearSessions(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function unsubscribe(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function subscribe(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function tryDeleteUser(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function expireDeletedUsersAfterDuration(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function expireDeletedUser(req, res) {
  // Stub implementation
  res.json({ success: true })
}

export default {
  updateUserSettings: expressify(updateUserSettings),
  changePassword: expressify(changePassword),
  logout,
  clearSessions: expressify(clearSessions),
  unsubscribe: expressify(unsubscribe),
  subscribe: expressify(subscribe),
  tryDeleteUser: expressify(tryDeleteUser),
  expireDeletedUsersAfterDuration: expressify(expireDeletedUsersAfterDuration),
  expireDeletedUser: expressify(expireDeletedUser),
}
