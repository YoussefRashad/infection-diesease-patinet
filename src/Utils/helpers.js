
const crypto = require('crypto')

const generateToken = async (length = 64) => {
  let token = await crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, length); // return required number of characters
  return token
}

module.exports = {
  generateToken
}