
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('email is not valid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  gender: {
    type: String,
    required: true,
    trim: true
  },
  pictureUrl: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  lastLogin: {
    type: Date,
    default: new Date()
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  dateOfBirth: {
    type: Date,
    default: new Date()
  }
}, {
  timestamps: true
});


// to hide some inforamtion
adminSchema.methods.toJSON = function () {
  const admin = this
  const adminObj = admin.toObject()

  delete adminObj.password
  delete adminObj.tokens

  return adminObj
}

// generate authentication token
adminSchema.methods.generateAuthToken = async function () {
  const admin = this
  const signatureToken = 'thisismytokensignatureforADMIN'
  const token = JWT.sign({ _id: admin._id.toString() }, signatureToken)
  admin.tokens = [...admin.tokens, { token }]
  await admin.save()
  return token
}

// to find the user by using his credentials
adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await adminModel.findOne({ email })
  if (!admin) {
    throw new Error('Unable to login!')
  }
  const isMatched = await bcrypt.compare(password, admin.password)
  if (!isMatched) {
    throw new Error('Unable to login!')
  }
  return admin
}

// convert the plain password into the hashed password
adminSchema.pre('save', async function (next) {
  const admin = this
  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 8)
  }
  next()
})


const adminModel = new mongoose.model('Admin', adminSchema)

module.exports = adminModel;