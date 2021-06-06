const sgMail = require('@sendgrid/mail')
const BASE_URL = 'http://localhost:3500'

sgMail.setApiKey('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')

// boda.010003@gmail.com
// mohamedhussein8465@gmail.com
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const acceptDoctorEmail = (name) => {
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Dear Doctor ${name}, Thank you for registering on our site. You have been accepted by the admin to be a member of our distinguished family of doctors. We have and we hope that you will be happy with us.  congratulations`
    })
}

const rejectDoctorEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Thanks for your request!',
        text: `Dear Doctor ${name}, We are sorry for not accepting your request at the moment because we have enough doctors, so we are sorry and we promise to put him in another upcoming appointment.`
    })
}

const sendPasswordVerificationCode = (email, name, code, type)=>{
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Forget Password!',
        text: `Hello ${name}, press here to reset ur password ${BASE_URL}/user/${type}/password/reset/${code}`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendPasswordVerificationCode,
    acceptDoctorEmail,
    rejectDoctorEmail
}