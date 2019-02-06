const request = require("request");
const cheerio = require("cheerio");
const _ = require("lodash");
const mongoose = require("mongoose");
const URLmodel = require("./models/URLmodel");

const setOfLinks = new Set();
setOfLinks.add("https://medium.com/");
let running = 0;
const limit = 2;

// connectiong DB
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("database connected"))
  .catch(er => console.log(err));

function processOne() {
  while (running < limit && setOfLinks.size > 0) {
    let it = setOfLinks.values();
    const url = it.next().value;
    setOfLinks.delete(url);
    // find if the url currently visiting exists in db
    URLmodel.findOne({ URL: url }).then(res => {
      if (!res) {
        // if URl doesn' exist
        const newURL = new URLmodel({ URL: url });
        // Add new URL
        newURL
          .save()
          .then(link => {
            // After the url is added to db emit the response to client
            // socket.emit("FromServer", link.URL);
            console.log("URL parsed", link.URL);
          })
          .catch(err => {});
      }
    });
    // getting callback after request
    request.get(url, (err, response, body) => {
      running--;
      if (!err) {
        const $ = cheerio.load(body);
        links = $("a");
        links.each((i, link) => {
          let linkHref = link.attribs.href;
          // remove '?' from link
          if (linkHref.includes("?")) {
            const pos = linkHref.indexOf("?");
            linkHref = linkHref.slice(0, pos);
          }

          if (_.startsWith(linkHref, "https://medium.com")) {
            setOfLinks.add(linkHref);
          } else if (_.startsWith(linkHref, "/")) {
            // if link starts with '/' connect it with url
            const newURL = url + linkHref.slice(1);
            if (newURL !== url) {
              setOfLinks.add(newURL);
            }
          }
        });
        console.log(setOfLinks.size);
        if (setOfLinks.size > 0) {
          processOne();
        }
        //   let val = 1;
        //   //while setOfLinks > 0
        //   while (val > 0) {
        //     processOne();
        //     val--;
        //   }
      }
      if (err) {
        console.log("error");
      }
    });
    running++;
  }
}

processOne();
