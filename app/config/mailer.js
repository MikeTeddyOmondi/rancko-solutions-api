const path = require("path");
const Transporter = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Send email to Admin's inbox
async function sendMail(mail_body) {
	try {
		const oAuth2Client = new OAuth2(
			process.env.CLIENT_ID, // ClientID
			process.env.CLIENT_SECRET, // Client Secret
			"https://developers.google.com/oauthplayground", // Redirect URL
		);

		oAuth2Client.setCredentials({
			refresh_token: process.env.REFRESH_TOKEN,
		});

		const senderMail = process.env.SENDER_EMAIL;
		const recipientMail = process.env.RECIPIENT_EMAIL;

		let message_body = "";

		if (mail_body.message) {
			const body = `
            <h5>${mail_body.firstname} sent an inquiry message from the contact form of your website</h5>
            <br>
            <p>You can contact ${mail_body.firstname} using the below additional contact</p>
            <ul>
                <li>Email: ${mail_body.email} </li>
            </ul>
            <br>
            <p>${mail_body.firstname}'s inquiry message is: </p>
            <h5>${mail_body.message}</h5>
            <br>
            <p>Regards,</p>
            <h5>Rancko Solutions LLC</h5> 
            `;
			message_body = body;
		} else {
			const body = `
            <h5>${mail_body.firstname} subscribed to your newsletters from your website</h5>
            <br>
            <p>You can contact ${mail_body.firstname} using the below additional contact</p>
            <ul>
                <li>Email: ${mail_body.email} </li>
            </ul>
            <br>
            <p>Regards,</p>
            <h5>Rancko Solutions LLC</h5> 
            `;
			message_body = body;
		}

		const accessToken = await oAuth2Client.getAccessToken();

		const transporter = Transporter.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: senderMail,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: senderMail,
			to: recipientMail,
			subject: "New Notification | Rancko Solutions LLC.",
			text: `Hi, ${message_body}`,
			html: `Hi, ${message_body}`,
		};

		const emailSent = await transporter.sendMail(mailOptions);
		return emailSent;
	} catch (err) {
		console.log(`Error occurred while sending the email: ${err.message}`);
		console.log(err);
	}
}

// Send email to Contact User's inbox
async function autoContactMail(mail_body) {
	try {
		const oAuth2Client = new OAuth2(
			process.env.CLIENT_ID, // ClientID
			process.env.CLIENT_SECRET, // Client Secret
			"https://developers.google.com/oauthplayground", // Redirect URL
		);

		oAuth2Client.setCredentials({
			refresh_token: process.env.REFRESH_TOKEN,
		});

		const senderMail = process.env.SENDER_EMAIL;
		const recipientMail = mail_body.email;

		let message_body = "";

		const body = `
            <h5>Hi ${mail_body.firstname},</h5>
            <p>Thank you for contacting us. Your inquiry message has truly been received.</p>
			<p>Please find the attached questionnaire and fill it with all the information required.</p>
			<p>You will receive the agreement and the full quotation as soon as you email us a scanned copy of your fully-filled response.</p>
            <br>
            <p>Regards,</p>
            <h5>Mike Teddy Omondi - CEO & Founder</h5>
            <h5>Rancko Solutions LLC</h5>
            `;
		message_body = body;

		const accessToken = await oAuth2Client.getAccessToken();

		const transporter = Transporter.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: senderMail,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: senderMail,
			to: recipientMail,
			subject: "Thanks for Contacting | Rancko Solutions LLC.",
			text: `${message_body}`,
			html: `${message_body}`,
			attachments: [
				{
					filename:
						"Client_Questionnaire-Web_Design_Development-Rancko_Solutions_LLC.pdf",
					path: path.join(
						__dirname,
						"../downloads/documents/Client_Questionnaire-Web_Design_Development-Rancko_Solutions_LLC.pdf",
					),
					contentType: "application/pdf",
				},
			],
		};

		const emailSent = await transporter.sendMail(mailOptions);
		return emailSent;
	} catch (err) {
		console.log(`Error occurred while sending the email: ${err.message}`);
		console.log(err);
	}
}

// Send email to Subscribing User's inbox
async function autoSubscribeMail(mail_body) {
	try {
		const oAuth2Client = new OAuth2(
			process.env.CLIENT_ID, // ClientID
			process.env.CLIENT_SECRET, // Client Secret
			"https://developers.google.com/oauthplayground", // Redirect URL
		);

		oAuth2Client.setCredentials({
			refresh_token: process.env.REFRESH_TOKEN,
		});

		const senderMail = process.env.SENDER_EMAIL;
		const recipientMail = mail_body.email;

		let message_body = "";

		const body = `
            <h5>Hi ${mail_body.name},</h5>
            <br>
            <p>Thank you for subscribing to our newsletters.</p>
            <p>You'll always be notified on scheduled posts yet to be published and blogs that are already published courtesy of joining my community.</p>
            <br>
            <p>Regards,</p>
            <h5>Mike Teddy Omondi - CEO & Founder</h5>
            <h5>Rancko Solutions LLC</h5>
            `;
		message_body = body;

		const accessToken = await oAuth2Client.getAccessToken();

		const transporter = Transporter.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: senderMail,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: senderMail,
			to: recipientMail,
			subject: "Thanks for Subscribing | Rancko Solutions LLC.",
			text: `${message_body}`,
			html: `${message_body}`,
		};

		const emailSent = await transporter.sendMail(mailOptions);
		return emailSent;
	} catch (err) {
		console.log(`Error occurred while sending the email: ${err.message}`);
	}
}

// Send email to Unsubscribing User's inbox
async function unSubscribeMail(mail_body) {
	try {
		const oAuth2Client = new OAuth2(
			process.env.CLIENT_ID, // ClientID
			process.env.CLIENT_SECRET, // Client Secret
			"https://developers.google.com/oauthplayground", // Redirect URL
		);

		oAuth2Client.setCredentials({
			refresh_token: process.env.REFRESH_TOKEN,
		});

		const senderMail = process.env.SENDER_EMAIL;
		const recipientMail = mail_body.email;

		let message_body = "";

		const body = `
            <h5>Hi ${mail_body.name},</h5>
            <br>
            <p>Thank you for being a part of our newsletter community.</p>
            <p>You've unsubscribed from our email list. You won't be notified anymore on any newsletters from now on.</p>
            <p>Thank you once again.</p>
            <br>
            <p>Regards,</p>
            <h5>Mike Teddy Omondi - CEO & Founder</h5>
            <h5>Rancko Solutions LLC</h5>
            `;
		message_body = body;

		const accessToken = await oAuth2Client.getAccessToken();

		const transporter = Transporter.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: senderMail,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: senderMail,
			to: recipientMail,
			subject: "Unsubscribing from Newsletters | Rancko Solutions LLC.",
			text: `${message_body}`,
			html: `${message_body}`,
		};

		const emailSent = await transporter.sendMail(mailOptions);
		return emailSent;
	} catch (err) {
		console.log(`Error occurred while sending the email: ${err.message}`);
	}
}

module.exports = {
	sendMail,
	autoContactMail,
	autoSubscribeMail,
	unSubscribeMail,
};
