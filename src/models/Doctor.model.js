
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

const doctorSchema = new mongoose.Schema({
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
  clinicAddress: {
    type: String,
    required: true,
    trim: true
  },
  clinicName: {
    type: String,
    required: true,
    trim: true
  },
  workHours: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    default: 0
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  status:{
    type: Boolean,
    default: false
    // false is pending
    // true is a doctor
  }
}, {
  timestamps: true
});


// to hide some inforamtion
doctorSchema.methods.toJSON = function () {
  const doctor = this
  const doctorObj = doctor.toObject()

  delete doctorObj.password
  delete doctorObj.tokens

  return doctorObj
}

// generate authentication token
doctorSchema.methods.generateAuthToken = async function () {
  const doctor = this
  const signatureToken = 'thisismytokensignaturefordDOCTOR'
  const token = JWT.sign({ _id: doctor._id.toString() }, signatureToken)
  doctor.tokens = [...doctor.tokens, { token }]
  await doctor.save()
  return token
}

// to find the user by using his credentials
doctorSchema.statics.findByCredentials = async (email, password) => {
  const doctor = await doctorModel.findOne({ email })
  if (!doctor) {
    throw new Error('Unable to login!')
  }
  const isMatched = await bcrypt.compare(password, doctor.password)
  if (!isMatched) {
    throw new Error('Unable to login!')
  }
  return doctor
}

// convert the plain password into the hashed password
doctorSchema.pre('save', async function (next) {
  const doctor = this
  if (doctor.isModified('password')) {
    doctor.password = await bcrypt.hash(doctor.password, 8)
  }
  next()
})


const doctorModel = new mongoose.model('Doctor', doctorSchema)

module.exports = doctorModel;