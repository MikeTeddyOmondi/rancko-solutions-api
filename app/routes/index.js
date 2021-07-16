const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) =>
	res.render("welcome", {
		title: "Rancko Solutions LLC - CMS",
	}),
);

// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
	let current_user = req.user;
	req.flash("success_msg", `Welcome ${current_user.name}!...`);
	res.render("admin/dashboard", {
		title: "Dashboard",
		user: current_user,
		layout: "./layouts/sidebarLayout",
	});
});

// Profile
router.get("/profile", ensureAuthenticated, async (req, res) => {
	let current_user = req.user;
	res.render("admin/profile", {
		title: "Profile",
		user: current_user,
		layout: "./layouts/sidebarLayout",
	});
});

// Messages
router.get("/messages", ensureAuthenticated, async (req, res) => {
	let current_user = req.user;
	res.render("admin/messages", {
		title: "Messages",
		user: current_user,
		layout: "./layouts/sidebarLayout",
	});
});

// Messages | Compose
router.get("/messages/compose", ensureAuthenticated, async (req, res) => {
	let current_user = req.user;
	res.render("admin/message-compose", {
		title: "Compose Message",
		user: current_user,
		layout: "./layouts/sidebarLayout",
	});
});

// Messages | Read
router.get("/messages/read", ensureAuthenticated, async (req, res) => {
	let current_user = req.user;
	res.render("admin/message-read", {
		title: "Read Message",
		user: current_user,
		layout: "./layouts/sidebarLayout",
	});
});

// Notifications
router.get("/notifications", ensureAuthenticated, async (req, res) => {
	let current_user = req.user;
	res.render("admin/notifications", {
		title: "Notifications",
		user: current_user,
		layout: "./layouts/sidebarLayout",
	});
});

// Settings
router.get("/settings", ensureAuthenticated, async (req, res) => {
	let current_user = req.user;
	res.render("admin/settings", {
		title: "Settings",
		user: current_user,
		layout: "./layouts/sidebarLayout",
	});
});

module.exports = router;
