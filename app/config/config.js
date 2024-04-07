const { config } = require("dotenv");

config();

// Database Connection
const DATABASE_URI = process.env.MONGODB_REMOTE_URI || "";

// Resend API Key
const EMAIL_SENDER = process.env.EMAIL_SENDER || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "";

if (
  DATABASE_URI === undefined ||
  EMAIL_SENDER === undefined ||
  RECIPIENT_EMAIL === undefined ||
  RESEND_API_KEY === undefined
) {
  throw new Error("Config error: Set environment variables");
  process.exit(1);
}

module.exports = {
  mongoURI: DATABASE_URI,
  emailSender: EMAIL_SENDER,
  resendApiKey: RESEND_API_KEY,
  receipientEmail: RECIPIENT_EMAIL,
};
