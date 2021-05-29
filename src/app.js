
const express = require('express')
const cors = require('cors')
const app = express()
require('./DB/connection')

app.use(express.json())

const URL = "https://infection-disease.netlify.app/"
// Access Api
// https://msp-tech-club-egypt.netlify.app
// origin:['http://localhost:3000','http://127.0.0.1:3000']
app.use(cors({
    origin: [URL, URL],
    credentials: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', URL);
    res.header('Access-Control-Allow-Headers', true);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
})


// Routers
const adminRouter = require('./routers/Admin.router')
const doctorRouter = require('./routers/Doctor.router')
const patientRouter = require('./routers/Patient.router')
const hospitalRouter = require('./routers/Hospital.router')
const medicineRouter = require('./routers/Medicine.router')
const pharmacyRouter = require('./routers/Pharmacy.router')
const specializationRouter = require('./routers/Specialization.router')
const diseaseRouter = require('./routers/Disease.router')
const feedbackRouter = require('./routers/Feedback.router')


app.use('/user/admin', adminRouter)
app.use('/user/doctor', doctorRouter)
app.use('/user/patient', patientRouter)
app.use('/hospital', hospitalRouter)
app.use('/medicine', medicineRouter)
app.use('/pharmacy', pharmacyRouter)
app.use('/specialization', specializationRouter)
app.use('/disease', diseaseRouter)
app.use('/feedback', feedbackRouter)

app.use((req, res)=>{
    res.status(400).send()
})


const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`server is up on port ${PORT}`))