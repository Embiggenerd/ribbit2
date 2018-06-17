const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  }
})

userSchema.pre('save', async function(next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(this.password, salt)

    this.password = hashedPass
    next()
  } catch (e) {
    next(e)
  }
})

userSchema.methods.isPassValid = async function(newPassword) {
  // Function to compare salt of pass at login vs original salt
  // at signup
  try {
    return await bcrypt.compare(newPassword, this.password)
  } catch (e) {
    throw new Error(e)
  }
}

const User = mongoose.model('user', userSchema)

module.exports = User
