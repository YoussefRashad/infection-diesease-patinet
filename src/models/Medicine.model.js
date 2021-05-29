
const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true,
  },
  pictureUrl: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  howToTake: {
    type: String,
    required: true,
    trim: true,
  },
  diseaseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true
})

const medicineModel = new mongoose.model('Medicine', medicineSchema)

module.exports = medicineModel;