const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const SESConfig = require("../config/amazonSES");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

const sendMail = async (req, res) => {
  const templateData = {
    email: req.data.email,
    full_name: req.data.full_name,
  };

  const templatePath = path.join(
    __dirname,
    `../views/templates/emails/${req.template}` //Path to email template
  );
  const source = fs.readFileSync(templatePath, { encoding: "utf-8" });
  const template = handlebars.compile(source);
  const html = template(templateData);

  const params = {
    Source: `${process.env.COMPANY_NAME} <${process.env.AWS_SES_FROM_EMAIL}>`,
    Destination: {
      ToAddresses: [`${templateData.full_name} <${templateData.email}>`],
    },
    ReplyToAddresses: [
      `${process.env.COMPANY_NAME} <${process.env.AWS_SES_FROM_EMAIL}>`,
      "Joseph MondragÃ³n <joseph@picnic.pe>",
    ],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html, // HTML Format of the email
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: req.subject,
      },
    },
  };

  const sendSES = await new AWS.SES(SESConfig)
    .sendEmail(params)
    .promise()
    .then((res) => {
      return res;
    });
  return sendSES;
};
module.exports = {
  sendMail,
};
