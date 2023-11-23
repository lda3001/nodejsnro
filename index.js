const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const config = require("./config");
const bodyParser = require("body-parser");
const middleware = require("./middleware/index");
const app = express();
const port = config.port;
const path = require("path")
const cookieParser = require('cookie-parser')
const minifyHTML = require('express-minify-html');
const htmlMinifier = require('html-minifier');
const relateURL = require('relateurl');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.set("views", __dirname + "/views"); // Make sure the path is correct
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/views")));
app.use(express.static(path.join(__dirname, "/views/assets")));
app.use(express.static(path.join(__dirname, "/views/images")));
app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    useShortDoctype: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
    minifyURLs: true
  }
}));
app.use((req, res, next) => {
  const originalRender = res.render;

  res.render = function (view, options, callback) {
    originalRender.call(this, view, options, (err, html) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error rendering template');
      }

      const minifiedHtml = htmlMinifier.minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        caseSensitive: true,
        customAttrAssign: true,
        minifyCSS: true
      });

      res.send(minifiedHtml);
    });
  };

  next();
});

const connection = mysql.createConnection(config.database);
connection.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối đến cơ sở dữ liệu:", err);
    return;
  }
  console.log("Kết nối thành công đến cơ sở dữ liệu MySQL");
});


global.sql = connection;

app.listen(port, async () => {
  middleware({ app, sql: connection });
  console.log(`SERVER LISTEN PORT : ${port}`);
});
