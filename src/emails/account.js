const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Welcome to the app',
        text: `Thank you for joining in, ${name}. Let me know how you get along with the app.`
    })
}

const sendDeleteEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Account deletion',
        text: `We are sorry to see you go, ${name}. Please help us improve by telling where we went wrong.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}