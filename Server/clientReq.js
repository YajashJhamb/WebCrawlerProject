const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const request = require("request");
const cheerio = require("cheerio");
const _ = require("lodash");
const mongoose = require("mongoose");
const URLmodel = require("./models/URLmodel");

const setOfLinks = new Set();
setOfLinks.add("https://medium.com/");

// connectiong DB
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("database connected"))
  .catch(er => console.log(err));

const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

// Creating server
const server = http.createServer(app);
// connecting socket to server for real time response
const io = socketIo(server);
//setting timeout for socket if nothing is emitted for 25 sec
io.set("heartbeat timeout", 25000);

// starting the socket event
io.on("connection", socket => {
  //received from client
  socket.on("startEvent", () => {
    function processOne() {
      let it = setOfLinks.values();
      const url = it.next().value;
      setOfLinks.delete(url);
      // find if the url currently visiting exists
      URLmodel.findOne({ URL: url }).then(res => {
        if (!res) {
          // if URl doesn' exist
          const newURL = new URLmodel({ URL: url });
          // Add new URL
          newURL
            .save()
            .then(link => {
              // After the url is added to db emit the response to client
              socket.emit("FromServer", link.URL);
            })
            .catch(err => {});
        }
      });
      // getting callback after request
      request.get(url, (err, response, body) => {
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
          console.log(setOfLinks);
          let val = 1;
          //while setOfLinks > 0
          while (val > 0) {
            processOne();
            val--;
          }
        }
        if (err) {
          console.log("error");
        }
      });
    }

    processOne();
  });
  socket.on("disconnect", () => console.log("client disconnected"));
});

//listening to server
server.listen(port, () => console.log(`Server running on port ${port}`));
