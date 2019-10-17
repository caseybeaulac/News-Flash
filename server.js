var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsflashdb", { useNewUrlParser: true });
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

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});