
const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  pictureUrl: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true
})

const hospitalModel = new mongoose.model('Hospital', hospitalSchema)

module.exports = hospitalModel;