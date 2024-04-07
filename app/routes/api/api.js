const express = require("express");
const router = express.Router();
const Article = require("../../models/Drafts");
const Contact = require("../../models/Contact");
const Subscriber = require("../../models/Subscriber");
const {
  automatedMail,
  sendContactMail,
  subscribeMail,
  unsubscribeMail,
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

  if (!firstname || !lastname || !email || !subject || !message) {
    res.status(400).json({
      success: false,
      message: "Please provide firstname, lastname, email, subject & message",
    });
    return;
  }

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
        success: true,
        message: `Saved a new contact: ${contact.email}`,
      });
    })
    .then(async () => {
      const context = {
        title: "Thank you for contacting us.",
        firstname: `${firstname}`,
        lastname: `${lastname}`,
      };

      const data = {
        subject,
        recipientEmail: email,
        template: "contact",
        context,
      };

      await sendContactMail(data)
        .then(() => {
          console.log("[#] Contact email sent to:", data.recipientEmail);
        })
        .catch((error) => {
          throw new Error(
            `[!] Error occurred while sending the contact email to the contact: ${error.message}`
          );
        });

      return data;
    })
    .then(async (prevData) => {
      // console.log({ prevData });

      const {
        subject,
        context: { firstname },
      } = prevData;

      const data = {
        subject,
        template: "autoContact",
        context: {
          title: "Contact [Notification] | Rancko Solutions",
          firstname,
          email: mail_body.email,
          message: mail_body.message,
        },
      };

      await automatedMail(data)
        .then(() => {
          console.log("[#] Automatic contact email notification sent");
        })
        .catch((error) => {
          throw new Error(
            `[!] Error occurred while sending the automatic email to the administration: ${error.message}`
          );
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: `Error occurred: ${err.message}`,
      });
    });
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
        success: `[#] Saved a new subscriber: ${subscriber.name}`,
      });
    })
    .then(() => {
      const context = {
        title: "Thank you for subscribing!",
        firstname: `${firstname}`,
        lastname: `${lastname}`,
      };

      const data = {
        subject: "Thank you for subscribing!",
        recipientEmail: email,
        template: "subscribe",
        context,
      };

      subscribeMail(data)
        .then(() => {
          console.log("[#] Subscription email sent to:", data.recipientEmail);
        })
        .catch((error) => {
          throw new Error(
            `[!] Error occurred while sending the contact email to the subscriber: ${error.message}`
          );
        });

      return data;
    })
    .then((prevData) => {
      console.log({ prevData });

      const data = {
        recipientEmail: "",
        template: "autoContact",
        context: {
          title: "Mail List Subscription [Notification] | Rancko Solutions",
        },
        ...prevData,
      };

      automatedMail(data)
        .then(() => {
          console.log("[#] Automatic subscription email notification sent");
        })
        .catch((error) => {
          // console.log(
          //   `Error occurred while sending the automatic email to the administration: ${error.message}`
          // );
          throw new Error(
            `[!] Error occurred while sending the automatic email to the administration: ${error.message}`
          );
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: `[!] Error occurred while saving a subscriber: ${err.message}`,
      });
    });
});

module.exports = router;
