
const Admin = require('../models/Admin.model')
const JWT = require('jsonwebtoken')
const signatureToken = process.env.ADMIN_TOKEN || 'thisismytokensignatureforADMIN'

const auth = async (req, res, next) => {
    try {
        //const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.body.token
        if (!token) {
            throw new Error({ error: "token" })
        }

        const decode = JWT.verify(token, signatureToken)
        if (!decode) {
            throw new Error('you not have a valid token')
        }
        const admin = await Admin.findOne({ _id: decode._id, 'tokens.token': token })
        if (!admin) {
            throw new Error('you aren\'t an admin')
        }

        // to using in MWs 
        req.admin = admin
        req.token = token

        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate!' })
    }
}


module.exports = auth