const express = require("express");
const Draft = require("../models/Drafts");
const Trash = require("../models/Trash");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();

// All Posts
router.get("/posts", ensureAuthenticated, async (req, res) => {
	const articles = await Draft.find().sort({ createdAt: "desc" });
	res.render("articles/posts", {
		title: "Draft Posts",
		user: req.user,
		articles: articles,
		layout: "./layouts/sidebarLayout",
	});
});

// All Published Posts
router.get("/published", ensureAuthenticated, async (req, res) => {
	const articles = await Draft.find().sort({ createdAt: "desc" });
	res.render("articles/published", {
		title: "Published Posts",
		user: req.user,
		articles: articles,
		layout: "./layouts/sidebarLayout",
	});
});

// Trash | Posts
router.get("/trash", ensureAuthenticated, async (req, res) => {
	const deletedArticles = await Trash.find().sort({ createdAt: "desc" });
	res.render("articles/trash", {
		title: "Deleted Posts",
		user: req.user,
		articles: deletedArticles,
		layout: "./layouts/sidebarLayout",
	});
});

// GET | New Post
router.get("/new", ensureAuthenticated, (req, res) => {
	res.render("articles/new", {
		article: new Draft(),
		user: req.user,
		title: "New Post",
		layout: "./layouts/sidebarLayout",
	});
});

// GET | Edit Post
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
	const article =
		(await Draft.findById(req.params.id)) ||
		(await Trash.findById(req.params.id));
	res.render("articles/edit", {
		article: article,
		user: req.user,
		title: "Edit",
		layout: "./layouts/sidebarLayout",
	});
});

// Show | Single Post
router.get("/:slug", ensureAuthenticated, async (req, res) => {
	const article =
		(await Draft.findOne({ slug: req.params.slug })) ||
		(await Trash.findOne({ slug: req.params.slug }));
	if (article == null) res.redirect("/");
	res.render("articles/show", {
		article: article,
		user: req.user,
		title: `${req.params.slug}`,
		layout: "./layouts/sidebarLayout",
	});
});

// POST | New Post
router.post(
	"/",
	ensureAuthenticated,
	async (req, res, next) => {
		req.article = new Draft();
		next();
	},
	saveArticleAndRedirect("new"),
);

// PUT | Edit Post
router.put(
	"/:id",
	ensureAuthenticated,
	async (req, res, next) => {
		req.article =
			(await Draft.findById(req.params.id)) ||
			(await Trash.findById(req.params.id));
		next();
	},
	saveArticleAndRedirect("edit"),
);

// POST | Restore Post
router.post(
	"/restore/:id",
	ensureAuthenticated,
	async (req, res, next) => {
		req.article = await Trash.findById(req.params.id);
		next();
	},
	restoreArticle(),
);

//  DELETE | Single POST | Save to Trash
router.delete("/:id", ensureAuthenticated, async (req, res, next) => {
	let article = await Draft.findById(req.params.id);
	try {
		let articleToTrash = new Trash({
			_id: article._id,
			createdAt: article.createdAt,
			title: article.title,
			description: article.description,
			markdown: article.markdown,
		});
		await articleToTrash.save();
		await Draft.findByIdAndDelete(article);
		req.flash(
			"success_msg",
			"You deleted the draft post successfully to the trash...",
		);
		res.redirect("/articles/posts");
	} catch (err) {
		req.flash(
			"error_msg",
			"An error occurred while deleting that post to the trash...",
		);
		console.log(`Error occured while deleting the post to the trash:${err}`);
	}
});

//  DELETE | Single POST | Permanent
router.delete("/delete/:id", ensureAuthenticated, async (req, res, next) => {
	let article = await Trash.findById(req.params.id);
	try {
		await Trash.findByIdAndDelete(article);
		req.flash("success_msg", "You deleted the post permanently...");
		res.redirect("/articles/trash");
	} catch (err) {
		req.flash(
			"error_msg",
			"An error occurred while deleting that post permanently...",
		);
		console.log(
			`Error occured while deleting the post permanently:${err.message}`,
		);
	}
});

function saveArticleAndRedirect(path) {
	return async (req, res) => {
		let article = req.article;
		article.title = req.body.title;
		article.description = req.body.description;
		article.markdown = req.body.markdown;

		try {
			article = await article.save();
			if (path === "new") {
				req.flash("success_msg", "Great! You drafted a new post...");
			} else {
				req.flash("success_msg", "You edited the draft post successfully...");
			}
			res.redirect(`/articles/${article.slug}`);
		} catch (err) {
			console.log(err);
			req.flash("error_msg", "An error occurred while saving that blog...");
			res.render(`articles/${path}`, {
				article: article,
				user: req.user,
				title: `${path}`,
				layout: "./layouts/sidebarLayout",
			});
		}
	};
}

function restoreArticle() {
	return async (req, res) => {
		let article = req.article;

		const restoredArticle = new Draft({
			_id: article._id,
			title: article.title,
			description: article.description,
			markdown: article.markdown,
			createdAt: article.createdAt,
		});

		try {
			savedArticle = await restoredArticle.save();
			await Trash.findByIdAndDelete(article);
			req.flash("success_msg", "You restored the post successfully...");

			res.redirect(`/articles/${savedArticle.slug}`);
		} catch (err) {
			console.log(err);
			req.flash("error_msg", "An error occurred while restoring the blog...");
			res.render(`articles/trash`);
		}
	};
}

module.exports = router;
