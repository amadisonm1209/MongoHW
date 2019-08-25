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

      $(".index-post-content").each(function (i, element) {

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).find(".blog-entry-title").find("h2").find("a").text();
        result.link = $(element).find(".blog-entry-title").find("h2").find("a").attr("href");
        result.summary = $(element).find(".post-index-text").text().trim();

        //save to the database
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
    });
    res.redirect("/");
  });

  //GET route for showing all the saved articles
  app.get("/saved", function (req, res) {
    db.Article.find({ saved: true })
      //if there are notes, populate them
      .populate("note")

      .then(function (dbArticle) {
        var hbsObject = {
          article: dbArticle
        };
        res.render("saved", hbsObject);
      })
      .catch(function (err) {
        res.json(err);
      })
  });

  // route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    db.Article.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      })
  });

  // route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    db.Article.findById(req.params.id)
      .populate("note")
      .then(function (dbArticles) {
        res.json(dbArticles)
      })
      .catch(function (err) {
        res.json(err)
      })
  });
  // route for saving an article 
  app.post("/articles/save/:id", function (req, res) {
    //update the saved boolean
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      })
  });
  // route for deleting a saved article and its notes
  app.post("/articles/delete/:id", function (req, res) {
    //update the saved boolean
    db.Article.findOneAndRemove({ "_id": req.params.id }, { "saved": false, "note": [] })
      .then(function (data) {
        res.json(data);
        console.log("Deleted!")
      })
      .catch(function (err) {
        res.json(err);
      })
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {

    // save the new note that gets posted to the Notes collection
    db.Note.create(req.body)
      // then find an article from the req.params.id
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ "_id": req.params.id }, { note: dbNote._id }, { new: true })
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err)
      })
  });

  // route for deleting a note
  app.delete("/notes/:id", function (req, res){
    db.Note.findOneAndRemove({ "_id": req.params.id }, function (err, dbNote) {
      if (err) {
        console.log(err);
      } else {
        return db.Article.findOneAndUpdate({ "_id": req.params.id}, {$pull: {"note": req.params.note_id}});
      }
    })
  });
}