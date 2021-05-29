const jwt   = require('jsonwebtoken')
const Doctor = require('../models/Doctor.model') 

const auth = async (req, res, next)=>{
    try{
        //const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.body.token
        if(!token){
            throw new Error({ error: "token" })
        }
        console.log(token);

        const decode = jwt.verify(token, 'thisismytokensignaturefordDOCTOR')
        if (!decode) {
            throw new Error('you not have a valid token')
        }
        const doctor = await Doctor.findOne({_id: decode._id, 'tokens.token': token})
        if(!doctor){
            throw new Error()
        }
        
        // to using in MWs 
        req.doctor = doctor
        req.token = token

        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate!' })
    }
}

module.exports = auth