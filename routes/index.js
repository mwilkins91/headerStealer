const express = require('express');
const router = express.Router();
//handles file uploads from html forms
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
//for managing file types AKA "mime types". tells us what type of file things are, lets us name them, etc.
const mime = require('mime');
//gives our server access to the file system
const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");



// Do work here
function getHtml(req, res, next) {
  let siteAddress = req.body.siteAddress;
  let selector = req.body.selector
  request({
        uri: siteAddress,
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    }, function(error, response, body) {
        // console.log(body);
        let massagedHTML;
        console.log(req.body.replaceAbsolute)
        if(req.body.replaceAbsolute === 'on') {
          massagedHTML = body.replace(/href="\//g, `href="${siteAddress}/`);
          massagedHTML = massagedHTML.replace(/href="#/g, `href="${siteAddress}#`);
        } else {
          massagedHTML = body;
        }

        const $ = cheerio.load(massagedHTML)
        // console.log();
        // console.log($('h1').html())
        req.burgledHtml = $.html($(selector));
        next();
    });
}

router.get('/', (req, res) => {
    // request({
    //     uri: "https://www.markwilkins.co",
    //     method: "GET",
    //     timeout: 10000,
    //     followRedirect: true,
    //     maxRedirects: 10
    // }, function(error, response, body) {
    //     // console.log(body);
    //     const $ = cheerio.load(body)
    //     // console.log();
    //     console.log($('h1').html())
    //     res.send($('h1').html())
    // });
    res.render('layout');
    // console.log(req.body)

});

router.post('/burgle', getHtml, (req, res) => {
  
  res.send(req.burgledHtml)
  // console.log(req.body)
})

module.exports = router;
