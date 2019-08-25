var cheerio = require("cheerio");
var db = require("../models");
var axios = require("axios");

module.exports = function (app) {

  // A GET route for scraping Sprudge
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://sprudge.com/category/wire").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Save an empty result object
      var result = {};
      // grab blog-entry-title
      $(".index-post-content").each(function (i, element) {

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).find(".blog-entry-title").find("h2").find("a").text();
        result.link = $(element).find(".blog-entry-title").find("h2").find("a").attr("href");
        result.summary = $(element).find(".post-index-text").text().trim();

        //save to the database
        db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      });
    });
    res.redirect("/");
  });

  app.get("/saved/:id", function (req, res) {
    });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      })
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findById(req.params.id)
      .populate("note")
      .then(function (dbArticles) {
        res.json(dbArticles)
      })
      .catch(function (err) {
        res.json(err)
      })
  });

  // Route for saving/updating an Article's associated Note
  app.get("/articles/:id", function (req, res) {

    Article.findOne({ "_id": req.params.id })

      .populate("note");

    // save the new note that gets posted to the Notes collection
    db.Note.create(req.body)
      // then find an article from the req.params.id
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
      })
      // and update it's "note" property with the _id of the new note
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err)
      })
  })
}