
const router = require('express').Router();
const Hospital = require('../models/Hospital.model')
const authAdmin = require('../middleware/authAdmin')

router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({})
    res.status(200).send(hospitals)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.get('/get/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const hospital = await Hospital.findById(_id)
    if (!hospital) {
      return res.status(404).send()
    }
    res.status(200).send(hospital)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


// to get an hospital by name
router.get('/find', async (req, res) => {
  let searchBy = {}
  if (req.query.name) {
    searchBy.name = req.query.name
  }
  try {
    const hospital = await Hospital.find({ ...searchBy })
    if (!hospital) {
      res.status(404).send("hospital not found")
    }
    res.status(200).send(hospital)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


router.post('/',/* authAdmin, */ async (req, res) => {
  try {
    const hospital = new Hospital({ ...req.body })
    await hospital.save()
    res.status(200).send(hospital)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.patch('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'phone', 'pictureUrl', 'address', 'details']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    return res.status(404).send()
  }
  try {
    const hospital = await Hospital.findOne({ _id })
    if (!hospital) {
      return res.status(404).send()
    }
    updates.forEach(update => hospital[update] = req.body[update])
    await hospital.save()
    res.status(200).send(hospital)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.delete('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id;
  try {
    const hospital = await Hospital.findByIdAndDelete(_id)
    if (!hospital) {
      return res.status(404).send()
    }
    res.status(200).send(hospital)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


module.exports = router;