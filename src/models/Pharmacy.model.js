
const mongoose = require('mongoose')

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  pictureUrl: {
    type: String,
    required: true,
    trim: true,
  },
  numberOfBranches: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  facebookUrl: {
    type: String,
    required: true,
    trim: true,
  },
  websiteUrl: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true
})

const pharmacyModel = new mongoose.model('Pharmacy', pharmacySchema)

module.exports = pharmacyModel;