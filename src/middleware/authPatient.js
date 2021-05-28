const jwt   = require('jsonwebtoken')
const Patient = require('../models/Patient.model') 

const auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        if(!token){
            throw new Error({ error: "token" })
        }

        const decode = jwt.verify(token, 'thisismytokensignaturefordPATIENT')
        if (!decode) {
            throw new Error('you not have a valid token')
        }
        const patient = await Patient.findOne({_id: decode._id, 'tokens.token': token})
        if(!patient){
            throw new Error()
        }
        
        // to using in MWs 
        req.patient = patient
        req.token = token

        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate!' })
    }
}

module.exports = auth