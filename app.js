//jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const date = require(__dirname + '/date.js');
const https = require('https');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const day = date.getDate();

const authKey = process.env.API_KEY;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/success.html", function(req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.get("/failure.html", function(req, res) {
  res.sendFile(__dirname + "/failure.html");
});

app.get("/success", function(req, res) {
  res.redirect("/success.html");
});

app.get("/failure", function(req, res) {
  res.redirect("/failure.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;



  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = process.env.API_URL;
  const options = {
    method: "post",
    auth: authKey
  };


  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {

      console.log(JSON.parse(data));

      if (JSON.parse(data).error_count == 0) {
        res.sendFile(__dirname + "/success.html");
        console.log("Success");
      } else {
        res.sendFile(__dirname + "/failure.html");
        console.log(__dirname + "/failure.html");
      }

    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server is running");
});