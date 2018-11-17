const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const SHA256 = require('crypto-js/sha256');
const xoauth2 = require('xoauth2');

class Utils{
    static sendEmail(to, subject, text, html){
        let objectTransport = { 
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            service: 'Gmail',
            auth: {
                 user: process.env.SMTP_AUTH_USER,
                  pass: process.env.SMTP_AUTH_PASS },
            tls: { 
                rejectUnauthorized: false } }

        let transporter = nodemailer.createTransport(smtpTransport(objectTransport));
    
        let mailOptions = {
            from: '"No Contestar " <' + process.env.SMTP_AUTH_USER + '>', 
            to,
            subject,
            text,
            html
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
        });
    }

    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }
    
    
}

module.exports = Utils;