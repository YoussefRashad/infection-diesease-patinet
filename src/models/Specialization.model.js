
const mongoose = require('mongoose')

const specializationSchema = new mongoose.Schema({
  specializationName: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true
})

const specializationModel = new mongoose.model('Specialization', specializationSchema)

module.exports = specializationModel;