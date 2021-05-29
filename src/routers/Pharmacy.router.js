
const router = require('express').Router();
const Pharmacy = require('../models/Pharmacy.model')
const authAdmin = require('../middleware/authAdmin')

router.get('/', async (req, res) => {
  try {
    const pharmacys = await Pharmacy.find({})
    res.status(200).send(pharmacys)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.get('/get/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const pharmacy = await Pharmacy.findById(_id)
    if (!pharmacy) {
      return res.status(404).send()
    }
    res.status(200).send(pharmacy)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get a pharmacy by name
router.get('/find', async (req, res) => {
  let searchBy = {}
  if (req.query.name) {
    searchBy.name = req.query.name
  }
  try {
    const pharmacy = await Pharmacy.findBy({ ...searchBy })
    if (!pharmacy) {
      res.status(404).send("pharmacy not found")
    }
    res.status(200).send(pharmacy)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.post('/', /* authAdmin, */ async (req, res) => {
  try {
    const pharmacy = new Pharmacy({ ...req.body })
    await pharmacy.save()
    res.status(200).send(pharmacy)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.patch('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'phoneNumber', 'pictureUrl', 'numberOfBranches', 'email', 'facebookUrl', 'websiteUrl']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    return res.status(404).send()
  }
  try {
    const pharmacy = await Pharmacy.findOne({ _id })
    if (!pharmacy) {
      return res.status(404).send()
    }
    updates.forEach(update => pharmacy[update] = req.body[update])
    await pharmacy.save()
    res.status(200).send(pharmacy)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.delete('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id;
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(_id)
    if (!pharmacy) {
      return res.status(404).send()
    }
    res.status(200).send(pharmacy)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


module.exports = router;