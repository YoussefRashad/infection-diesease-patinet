
const router = require('express').Router();
const Disease = require('../models/Disease.model')
const authAdmin = require('../middleware/authAdmin')

router.get('/', async (req, res) => {
  try {
    const diseases = await Disease.find({})
    res.status(200).send(diseases)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.get('/get/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const disease = await Disease.findById(_id)
    if (!disease) {
      return res.status(404).send()
    }
    res.status(200).send(disease)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get a disease by name
router.get('/find', async (req, res) => {
  let searchBy = {}
  if (req.query.diseaseName) {
    searchBy.diseaseName = req.query.diseaseName
  }
  try {
    const disease = await Disease.find({ ...searchBy })
    if (!disease) {
      res.status(404).send("disease not found")
    }
    res.status(200).send(disease)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.post('/', /* authAdmin, */ async (req, res) => {
  try {
    const disease = new Disease({ ...req.body })
    await disease.save()
    res.status(200).send(disease)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.patch('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['diseaseName', 'description', 'pictureUrl', 'specializationName' , 'Symptoms' , 'prevention' , 'Treatment']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    return res.status(404).send()
  }
  try {
    const disease = await Disease.findOne({ _id })
    if (!disease) {
      return res.status(404).send()
    }
    updates.forEach(update => disease[update] = req.body[update])
    await disease.save()
    res.status(200).send(disease)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.delete('/:id', /* authAdmin, */ async (req, res) => {
  const _id = req.params.id;
  try {
    const disease = await Disease.findByIdAndDelete(_id)
    if (!disease) {
      return res.status(404).send()
    }
    res.status(200).send(disease)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


module.exports = router;