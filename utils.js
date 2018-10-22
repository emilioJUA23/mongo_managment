const nodemailer = require('nodemailer');
const SHA256 = require('crypto-js/sha256');

class Utils{
    static sendEmail(to, subject, text, html){
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE , // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_AUTH_USER, // generated ethereal user
                pass: process.env.SMTP_AUTH_PASS // generated ethereal password
            }
        });
        let mailOptions = {
            from: '"No Contestar " <' + process.env.SMTP_AUTH_USER + '>', // sender address
            to,
            subject,
            text,
            html
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }
    
    
}

module.exports = Utils;