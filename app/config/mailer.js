const path = require("path");
const Transporter = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

// Resend Config
const { emailSender, receipientEmail, resendApiKey } = require("./config");

// Transporter instance
const transporter = Transporter.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465, // 587,
  auth: {
    user: "resend",
    pass: resendApiKey,
  },
});

// Handlebar Options
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.join(__dirname, "..", "email"),
    defaultLayout: false,
  },
  viewPath: path.join(__dirname, "..", "email"),
  extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Send email to Contact User's inbox
async function automatedMail({
  subject,
  recipientEmail = receipientEmail,
  template,
  context,
}) {
  // console.log({ subject, recipientEmail, template, context });

  // Mail Options
  const mailOptions = {
    from: `Rancko Solutions <${emailSender}>`,
    to: recipientEmail,
    subject,
    template,
    context: {
      title: context.title,
      firstname: capitalize(context.firstname),
      email: context.email,
      message: context.message,
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log(`[#] Email sent: ${info.response}`);
  } catch (err) {
    console.log(`[!] Error occurred while sending email: ${err}`);
  }
}

// Send email to Subscribing User's inbox
async function subscribeMail({ subject, recipientEmail, template, context }) {
  // Mail Options
  const mailOptions = {
    from: emailSender,
    to: recipientEmail,
    subject,
    template,
    context: {
      title: context.title,
      firstname: capitalize(context.firstname),
      // url: context.url,
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[#] Email sent: ${info.response}`);
  } catch (err) {
    console.log(`[!] Error occurred while sending email: ${err}`);
  }
}

// Send email to Unsubscribing User's inbox
async function unsubscribeMail({ subject, recipientEmail, template, context }) {
  // Mail Options
  const mailOptions = {
    from: emailSender,
    to: recipientEmail,
    subject,
    template,
    context: {
      title: context.title,
      firstname: capitalize(context.firstname),
      // url: context.url,
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[#] Email sent: ${info.response}`);
  } catch (err) {
    console.log(`[!] Error occurred while sending email: ${err}`);
  }
}

async function sendContactMail({ subject, recipientEmail, template, context }) {
  // Mail Options
  const mailOptions = {
    from: `Rancko Solutions <${emailSender}>`,
    to: recipientEmail,
    subject,
    template,
    context: {
      title: context.title,
      firstname: capitalize(context.firstname),
      // url: context.url,
    },
    attachments: [
      {
        filename:
          "Client_Questionnaire-Web_Design_Development-Rancko_Solutions_LLC.pdf",
        path: path.join(
          __dirname,
          "../downloads/documents/Client_Questionnaire-Web_Design_Development-Rancko_Solutions.pdf"
        ),
        contentType: "application/pdf",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log(`[#] Email sent: ${info.response}`);
  } catch (err) {
    console.log(`[!] Error occurred while sending email: ${err}`);
  }
}

module.exports = {
  automatedMail,
  subscribeMail,
  sendContactMail,
  unsubscribeMail,
};
