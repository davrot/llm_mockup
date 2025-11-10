// Stub implementation for UserEmailsController
import { expressify } from '@overleaf/promise-utils'

async function list(req, res) {
  // Stub implementation
  res.json({ emails: [] })
}

async function showConfirm(req, res) {
  // Stub implementation
  res.render('user/confirm-email')
}

async function confirm(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function sendExistingEmailConfirmationCode(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function resendExistingSecondaryEmailConfirmationCode(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function checkExistingEmailConfirmationCode(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function primaryEmailCheckPage(req, res) {
  // Stub implementation
  res.render('user/primary-email-check')
}

async function primaryEmailCheck(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function remove(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function setDefault(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function endorse(req, res) {
  // Stub implementation
  res.json({ success: true })
}

async function addSecondaryEmailPage(req, res) {
  // Stub implementation
  res.render('user/add-secondary-email')
}

async function confirmSecondaryEmailPage(req, res) {
  // Stub implementation
  res.render('user/confirm-secondary-email')
}

export default {
  list: expressify(list),
  showConfirm: expressify(showConfirm),
  confirm: expressify(confirm),
  sendExistingEmailConfirmationCode: expressify(sendExistingEmailConfirmationCode),
  resendExistingSecondaryEmailConfirmationCode: expressify(resendExistingSecondaryEmailConfirmationCode),
  checkExistingEmailConfirmationCode: expressify(checkExistingEmailConfirmationCode),
  primaryEmailCheckPage: expressify(primaryEmailCheckPage),
  primaryEmailCheck: expressify(primaryEmailCheck),
  remove: expressify(remove),
  setDefault: expressify(setDefault),
  endorse: expressify(endorse),
  addSecondaryEmailPage: expressify(addSecondaryEmailPage),
  confirmSecondaryEmailPage: expressify(confirmSecondaryEmailPage),
}
