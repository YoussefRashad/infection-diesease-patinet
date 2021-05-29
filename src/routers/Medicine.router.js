
const router = require('express').Router();
const Medicine = require('../models/Medicine.model')
const authAdmin = require('../middleware/authAdmin')

router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find({})
    res.status(200).send(medicines)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.get('/get/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const medicine = await Medicine.findById(_id)
    if (!medicine) {
      return res.status(404).send()
    }
    res.status(200).send(medicine)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get a medicine by name
router.get('/find', async (req, res) => {
  let searchBy = {}
  if (req.query.name) {
    searchBy.name = req.query.name
  }
  try {
    const medicine = await Medicine.find({ ...searchBy })
    if (!medicine) {
      res.status(404).send("medicine not found")
    }
    res.status(200).send(medicine)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.post('/', /* authAdmin, */ async (req, res) => {
  try {
    const medicine = new Medicine({ ...req.body })
    await medicine.save()
    res.status(200).send(medicine)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.patch('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'manufacturer', 'pictureUrl', 'price', 'howToTake', 'diseaseName', 'description']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    return res.status(404).send()
  }
  try {
    const medicine = await Medicine.findOne({ _id })
    if (!medicine) {
      return res.status(404).send()
    }
    updates.forEach(update => medicine[update] = req.body[update])
    await medicine.save()
    res.status(200).send(medicine)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.delete('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id;
  try {
    const medicine = await Medicine.findByIdAndDelete(_id)
    if (!medicine) {
      return res.status(404).send()
    }
    res.status(200).send(medicine)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


module.exports = router;