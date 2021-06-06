
const router = require('express').Router()
const Patient = require('../models/Patient.model')
const authPatient = require('../middleware/authPatient')
const authAdmin = require('../middleware/authAdmin')
const { sendPasswordVerificationCode } = require('../emails/mailer')
const { generateToken } = require('../Utils/Helpers')


// to get all patients
router.get('/', /* authAdmin, */ async (req, res) => {
  try {
    const patients = await Patient.find()
    res.status(200).send(patients)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get an patient 
router.post('/me', authPatient, async (req, res) => {
  try {
    console.log(req.patient);
    res.status(200).send(req.patient)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get an patient 
router.get('/get/:id', async (req, res) => {
  const id = req.params.id
  try {
    const patient = await Patient.findById(id)
    if (!patient) {
      res.status(404).send("patient not found")
    }
    res.status(200).send(patient)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to add a new patient 
router.post('/signup', async (req, res) => {
  try {
    const exist = await Patient.findOne({ email: req.body.email })

    if (exist) {
      return res.status(400).json({
        error: 'this email already exists'
      })
    }
    const patient = new Patient({ ...req.body })
    const token = await patient.generateAuthToken()
    res.status(200).send({ patient, token })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to login as an patient
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const patient = await Patient.findByCredentials(email, password)
    console.log(patient)
    if(patient.isBlocked){
      throw new Error('you are blocked, contact with admins!')
    }
    patient.lastLogin = new Date()
    const token = await patient.generateAuthToken()
    console.log(token);
    res.status(200).send({ patient, token })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to edit an patient 
router.patch('/me', authPatient, async (req, res) => {
  if(req.patient.isBlocked){
    throw new Error('you are blocked, contact with admins!')
  }
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'gender', 'pictureUrl', 'address', 'city', 'phoneNumber', 'dateOfBirth', 'weight', 'height', 'bloodType']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    throw new Error()
  }
  try {
    updates.forEach(update => req.patient[update] = req.body[update])
    await req.patient.save()
    res.status(200).send(req.patient)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to delete an patient 
router.delete('/me', authPatient, async (req, res) => {
  if (req.patient.isBlocked) {
    throw new Error('you are blocked, contact with admins!')
  }
  try {
    await req.patient.remove()
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to delete an patient by admin
router.delete('/:id', /* authAdmin, */ async (req, res) => {
  const id = req.params.id
  try {
    const patient = await Patient.findById(id)
    if (!patient) {
      res.status(404).send("patient not found")
    }
    await patient.remove()
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


// to get an patient by name
router.get('/find', async (req, res) => {
  let searchBy = {}
  if (req.query.name) {
    searchBy.name = req.query.name
  }
  try {
    const patient = await Patient.find({ ...searchBy })
    if (!patient) {
      res.status(404).send("patient not found")
    }
    res.status(200).send(patient)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to block an patient by admin
router.post('/block-patient/:id', authAdmin, async (req, res) => {
  const id = req.params.id
  try {
    const patient = await Patient.findById(id)
    if (!patient) {
      res.status(404).send("patient not found")
    }
    patient.isBlocked = true
    await patient.save()
    res.status(200).send(patient)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to un-block an patient by admin
router.post('/un-block-patient/:id', authAdmin, async (req, res) => {
  const id = req.params.id
  try {
    const patient = await Patient.findById(id)
    if (!patient) {
      res.status(404).send("patient not found")
    }
    patient.isBlocked = false
    await patient.save()
    res.status(200).send(patient)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to logout from a device
router.post('/logout', authPatient, async (req, res) => {
  try {
    req.patient.tokens = req.patient.tokens.filter(token => req.token !== token.token)
    console.log("logout done")
    await req.patient.save()
    res.status(200).send({ msg: "the patient logged out" })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to logout from all devices
router.post('/logout-all', authPatient, async (req, res) => {
  try {
    req.patient.tokens = []
    await req.patient.save()
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})



router.post('/password/forget', async (req, res) => {
  const patient = await Patient.findOne({ email: req.body.email })
  if (!patient){
    return res.status(404).send("patient is not found")
  }
  if (patient.passwordResetToken) {
    sendPasswordVerificationCode(patient.email, patient.name, patient.passwordResetToken, 'patient')
  } else {
    const code = await generateToken()
    patient.passwordResetToken = code
    sendPasswordVerificationCode(patient.email, patient.name, code)
    await patient.save()
  }
  res.status(200).send()
})

router.get('/password/reset/:code', async (req, res) => {
  const code = req.params.code
  if (!code) {
    res.status(400).send("code error")
  }
  const patient = await Patient.findOne({ passwordResetToken: code })
  if (!patient) {
    res.status(400).send("not find patient")
  }
  patient.changePassword = true
  patient.passwordResetToken = undefined
  await patient.save()
  res.status(200).send()
})

// should send email, pass, confirm pass
router.post('/resetPassword', async (req, res) => {
  const { email, password, confirmPassword } = req.body
  const patient = await Patient.findOne({ email })
  if (!patient) {
    res.status(400).send("not find a patient")
  }
  if (!patient.changePassword) {
    res.status(400).send("forget req first")
  }
  if (password !== confirmPassword) {
    res.status(400).send("not matched")
  }
  patient.password = password
  patient.changePassword = false
  await patient.save()
  res.status(200).send()
})


module.exports = router