
const router = require('express').Router();
const Specialization = require('../models/Specialization.model')
const authAdmin = require('../middleware/authAdmin')

router.get('/', async (req, res) => {
  try {
    const specializations = await Specialization.find({})
    res.status(200).send(specializations)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.get('/get/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const specialization = await Specialization.findById(_id)
    if (!specialization) {
      return res.status(404).send()
    }
    res.status(200).send(specialization)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get a specialization by name
router.get('/find', async (req, res) => {
  let searchBy = {}
  if (req.query.specializationName) {
    searchBy.specializationName = req.query.specializationName
  }
  try {
    const specialization = await Specialization.find({ ...searchBy })
    if (!specialization) {
      res.status(404).send("specialization not found")
    }
    res.status(200).send(specialization)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.post('/', /* authAdmin, */ async (req, res) => {
  try {
    const specialization = new Specialization({ ...req.body })
    await specialization.save()
    res.status(200).send(specialization)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.patch('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['specializationName']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    return res.status(404).send()
  }
  try {
    const specialization = await Specialization.findOne({ _id })
    if (!specialization) {
      return res.status(404).send()
    }
    updates.forEach(update => specialization[update] = req.body[update])
    await specialization.save()
    res.status(200).send(specialization)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.delete('/:id',/* authAdmin, */ async (req, res) => {
  const _id = req.params.id;
  try {
    const specialization = await Specialization.findByIdAndDelete(_id)
    if (!specialization) {
      return res.status(404).send()
    }
    res.status(200).send(specialization)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


module.exports = router;