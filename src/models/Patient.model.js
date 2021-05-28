
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

const patientSchema = new mongoose.Schema({
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
  },
  weight: {
    type: Number,
    required: true,
    trim: true
  },
  height: {
    type: Number,
    required: true,
    trim: true
  },
  bloodType: {
    type: String,
    required: true,
    trim: true
  },
  isBlocked:{
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});


// to hide some inforamtion
patientSchema.methods.toJSON = function () {
  const patient = this
  const patientObj = patient.toObject()

  delete patientObj.password
  delete patientObj.tokens

  return patientObj
}

// generate authentication token
patientSchema.methods.generateAuthToken = async function () {
  const patient = this
  const signatureToken = 'thisismytokensignaturefordPATIENT'
  const token = JWT.sign({ _id: patient._id.toString() }, signatureToken)
  patient.tokens = [...patient.tokens, { token }]
  await patient.save()
  return token
}

// to find the user by using his credentials
patientSchema.statics.findByCredentials = async (email, password) => {
  const patient = await patientModel.findOne({ email })
  if (!patient) {
    throw new Error('Unable to login!')
  }
  const isMatched = await bcrypt.compare(password, patient.password)
  if (!isMatched) {
    throw new Error('Unable to login!')
  }
  return patient
}

// convert the plain password into the hashed password
patientSchema.pre('save', async function (next) {
  const patient = this
  if (patient.isModified('password')) {
    patient.password = await bcrypt.hash(patient.password, 8)
  }
  next()
})


const patientModel = new mongoose.model('Patient', patientSchema)

module.exports = patientModel;