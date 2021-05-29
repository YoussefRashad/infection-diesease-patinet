
const router = require('express').Router()
const Doctor = require('../models/Doctor.model')
const authDoctor = require('../middleware/authDoctor')
const authAdmin = require('../middleware/authAdmin')

// to get all doctors 
router.get('/', /* authAdmin, */ async (req, res) => {
  try {
    const doctors = await Doctor.find({status:true})
    res.status(200).send(doctors)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get all requests
router.get('/request', /* authAdmin, */ async (req, res) => {
  try {
    const doctors = await Doctor.find({status:false})
    res.status(200).send(doctors)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get an doctor 
router.post('/me', authDoctor, async (req, res) => {
  try {
    res.status(200).send(req.doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get an doctor 
router.get('/get/:id', async (req, res) => {
  const id = req.params.id
  try {
    const doctor = await Doctor.findById(id)
    if(!doctor){
      res.status(404).send("doctor not found")
    }
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get an doctor by name/specialization
router.get('/find', async (req, res) => {
  let searchBy = {}
  if (req.query.name) {
    searchBy.name = req.query.name
  }
  if (req.query.specialization) {
    searchBy.specialization = req.query.specialization
  }
  try {
    const doctor = await Doctor.find({ ...searchBy })
    if (!doctor) {
      res.status(404).send("doctor not found")
    }
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.get('/get-pending', authAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: false })
    res.status(200).send(doctors)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.post('/activate-status/:id',/* authAdmin, */ async (req, res) => {
  const id = req.params.id
  try {
    const doctor = await Doctor.update({_id: id}, { status: true })
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to add a new doctor 
router.post('/signup', async (req, res) => {
  try {
    const exist = await Doctor.findOne({ email: req.body.email })

    if (exist) {
      return res.status(400).json({
        error: 'this email already exists'
      })
    }
    const doctor = new Doctor({ ...req.body/* , status: false */ })
    const token = await doctor.generateAuthToken()
    res.status(200).send({ doctor, token })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to login as an doctor
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const doctor = await Doctor.findByCredentials(email, password)
    doctor.lastLogin = new Date()
    const token = await doctor.generateAuthToken()

    res.status(200).send({ doctor, token })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to edit an doctor 
router.patch('/:id',/* authDoctor, */ async (req, res) => {
  /*
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'gender', 'pictureUrl', 'address', 'city', 'phoneNumber', 'dateOfBirth', 'clinicAddress', 'clinicName', 'clinicPhone', 'workHours', 'rate', 'specialization']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    throw new Error()
  }
  try {
    updates.forEach(update => req.doctor[update] = req.body[update])
    await req.doctor.save()
    res.status(200).send(req.doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
  */

  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'gender', 'pictureUrl', 'address', 'phoneNumber', 'clinicAddress', 'clinicName', 'workHours', 'rate', 'specialization']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    return res.status(404).send()
  }
  try {
    const doctor = await Doctor.findOne({ _id })
    if (!doctor) {
      return res.status(404).send()
    }
    updates.forEach(update => doctor[update] = req.body[update])
    await doctor.save()
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to delete an doctor 
router.delete('/:id', /* authDoctor, */ async (req, res) => {
  const { id } = req.params
  try {
    //await req.doctor.remove()
    await Doctor.findByIdAndDelete(id)
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to logout from a device
router.post('/logout', authDoctor, async (req, res) => {
  try {
    req.doctor.tokens = req.doctor.tokens.filter(token => req.token !== token.token)
    await req.doctor.save()
    res.status(200).send({ msg: "the doctor logged out" })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to logout from all devices
router.post('/logout-all', authDoctor, async (req, res) => {
  try {
    req.doctor.tokens = []
    await req.doctor.save()
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})



module.exports = router