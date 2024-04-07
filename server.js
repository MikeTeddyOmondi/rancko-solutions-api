const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("cookie-session");
const favicon = require("serve-favicon");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const apiRouter = require("./app/routes/api/api");
const userRouter = require("./app/routes/users");
const indexRouter = require("./app/routes/index");
const articleRouter = require("./app/routes/articles");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const app = express();

// Environment variables
require("dotenv").config();

app.enable("trust proxy");
app.use(cors());
app.use(express.json());
app.use(methodOverride("_method"));
app.use(favicon(path.join(__dirname, "public", "img", "favicon.ico")));

// Passport Config
require("./app/config/passport")(passport);

// DB Config
const db = require("./app/config/config").mongoURI;

// Express body parser | Url-Encoded
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: true,
  })
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

// Connect flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Views
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("layout", "layouts/mainLayout");

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/api/v1", apiRouter);
app.use("/users", userRouter);
app.use("/articles", articleRouter);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log("_________________________________________");
    console.log("Database server connection initiated...");
    console.log("_________________________________________");
    console.log("Database server connection success!");
  })
  .then(() => {
    app.listen(PORT, (err) => {
      if (!err) {
        console.log(`_________________________________________`);
        console.log(`Backend services initiated on port: ${PORT}`);
        console.log("_________________________________________");
      } else throw err;
    });
  })
  .catch((err) => {
    {
      console.log(`_________________________________________`);
      console.log(`Error occured while starting application server: ${err}`);
      console.log(`_________________________________________`);
    }
  });
