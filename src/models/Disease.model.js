
const mongoose = require('mongoose')

const pharmacySchema = new mongoose.Schema({
  diseaseName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  pictureUrl: {
    type: String,
    required: true,
    trim: true,
  },
  specializationName: {
    type: String,
    required: true,
  },
  Symptoms:{
    type:String
  },
  prevention:{
    type:String
  },
  Treatment:{
    type:String
  }
}, {
  timestamps: true
})

const pharmacyModel = new mongoose.model('Disease', pharmacySchema)

module.exports = pharmacyModel;