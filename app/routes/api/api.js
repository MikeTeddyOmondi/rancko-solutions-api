const express = require("express");
const router = express.Router();
const Article = require("../../models/Drafts");
const Contact = require("../../models/Contact");
const Subscriber = require("../../models/Subscriber");
const {
	sendMail,
	autoContactMail,
	autoSubscribeMail,
} = require("../../config/mailer");

//const paginatedResults = require('../../config/pagination')

// API - Get All Blogs
router.get("/blogs", async (req, res) => {
	try {
		const articles = await Article.find().sort({ createdAt: "desc" });
		res.status(200).json(articles);
	} catch (error) {
		console.log(error.message);
		res.status(404).json({ Error: "Not Found" });
	}
});

// API - Get Specific Blog
router.get("/blogs/:id", async (req, res) => {
	let { id } = req.params;
	try {
		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			const article = await Article.findById({ _id: id });
			console.log(article);
			res.status(200).json(article);
		} else {
			console.log(`Bad request | Blog id > ${id} was not found`);
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ Error: error });
	}
});

// API - Post Contacts
router.post("/contacts", async (req, res) => {
	let mail_body = req.body;

	//console.log(mail_body);

	const { firstname, lastname, email, subject, message } = mail_body;
	const contact = new Contact({
		firstname,
		lastname,
		email,
		subject,
		message,
	});

	contact
		.save()
		.then((contact) => {
			res.status(200).json({
				success: `Saved a new contact: ${contact}`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: `Error occurred: ${err.message}`,
			});
		});

	sendMail(mail_body)
		.then((emailSent) => {
			console.log("Administration email sent to:", emailSent.envelope.to);
		})
		.catch((error) =>
			console.log(
				`Error occurred while sending the contact email to the administration: ${error.message}`,
			),
		);

	autoContactMail(mail_body)
		.then((emailSent) => {
			console.log("Automatic contact email sent to:", emailSent.envelope.to);
		})
		.catch((error) =>
			console.log(
				`Error occurred while sending the automatic email to the subscriber: ${error.message}`,
			),
		);
});

// API - Post Subscribers
router.post("/subscribers", async (req, res) => {
	let mail_body = req.body;

	//console.log(mail_body)

	const { name, email } = mail_body;
	const subscriber = new Subscriber({
		name,
		email,
	});

	subscriber
		.save()
		.then((subscriber) => {
			res.status(200).json({
				success: `Saved a new subscriber: ${subscriber}`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: `Error occurred while saving a subscriber: ${err.message}`,
			});
		});

	sendMail(mail_body)
		.then((emailSent) => {
			console.log("Administration email sent to:", emailSent.envelope.to);
		})
		.catch((error) =>
			console.log(
				`Error occurred while sending the subscriber email: ${error.message}`,
			),
		);

	autoSubscribeMail(mail_body)
		.then((emailSent) => {
			console.log("Automatic contact email sent to:", emailSent.envelope.to);
		})
		.catch((error) =>
			console.log(
				`Error occurred while sending the automatic email to the subscriber: ${error.message}`,
			),
		);
});

module.exports = router;
