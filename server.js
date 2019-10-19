var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.port || 8080;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://caseybeaulac:&pwmlab9@ds235658.mlab.com:35658/heroku_clf6bv2h", { useNewUrlParser: true });
var databaseUrl = "newsflashdb";
var collections = ["nhlarticles"];


var count = 0;
app.get("/scrape", function (req, res) {
  axios.get("https://www.nhl.com/news").then(function (response) {

    var $ = cheerio.load(response.data);

    $("article").each(function (i, element) {
      //console.log($(this))
      var result = {};

      result.title = $(this)
        .children(".article-item__top")
        .children("h1")
        .text();
      result.summary = $(this)
        .children(".article-item__top")
        .children("h2")
        .text();
      result.url = $(this)
        .children(".article-item__bottom")
        .children("a")
        .attr("href");

      console.log(result);

      db.Article.create(result)
        .then(function (foundArticle) {
          console.log(foundArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send("Been Scraped")
  });
});

app.get("/articles", function (req, res) {

  db.Article.find({})
    .then(function (foundArticle) {

      res.json(foundArticle);
    })
    .catch(function (err) {

      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {

  db.Article.findOne({ _id: req.params.id })

    .populate("comment")
    .then(function (foundArticle) {

      res.json(foundArticle);
    })
    .catch(function (err) {

      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {

  db.Comment.create(req.body)
    .then(function (foundComment) {

      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: foundComment._id }, { new: true });
    })
    .then(function (foundArticle) {

      res.json(foundArticle);
    })
    .catch(function (err) {

      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});