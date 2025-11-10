// Stub implementation for UserGetter
import { User } from '../../models/User.js'

const promises = {
  async getUser(userId, projection = {}) {
    return await User.findById(userId, projection)
  }
}

function getUser(userId, projection, callback) {
  promises.getUser(userId, projection)
    .then(user => callback(null, user))
    .catch(err => callback(err))
}

export default {
  promises,
  getUser,
}
