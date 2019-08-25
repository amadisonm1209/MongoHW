var express = require("express");
var logger = require("morgan");
var path = require("path");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;


// Middleware
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/scrapeRoutes")(app);

app.get("/", function (req, res) {
  db.Article.find({"saved": false}, function(error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("homepage", hbsObject);
  });
});


// Starting the server, syncing our models 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/coffeeScraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// Testing the port connection
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

