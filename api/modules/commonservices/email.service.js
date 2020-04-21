
var nodemailer = require('nodemailer');

import settings from '../../settings';

const config = require('../../config/' + settings.environment + '.config');
const emailConfig = config.default.email;

var transporter = nodemailer.createTransport(emailConfig);

let EmailService = {};

EmailService.SendEmail = async (from, to, subject, text) => {

    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error)
            } else {
                resolve(info)
            }
        })
    }).then((data) => {
        return data;
    }).catch((error) => {
        return error;
    });
}

export default EmailService;