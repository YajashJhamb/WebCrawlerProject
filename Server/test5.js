const request = require("request");
const cheerio = require("cheerio");
const _ = require("lodash");

const setOfLinks = new Set();
setOfLinks.add("https://medium.com/");
function test5(socket) {
  async function processOne() {
    let it = setOfLinks.values();
    const url = it.next().value;
    setOfLinks.delete(url);
    await socket.emit("FromServer", url);
    request.get(url, (err, response, body) => {
      if (!err) {
        const $ = cheerio.load(body);
        links = $("a");
        links.each((i, link) => {
          let linkHref = link.attribs.href;
          if (linkHref.includes("?")) {
            const pos = linkHref.indexOf("?");
            linkHref = linkHref.slice(0, pos);
          }
          if (_.startsWith(linkHref, "https://medium.com")) {
            setOfLinks.add(linkHref);
          } else if (_.startsWith(linkHref, "/")) {
            const newURL = url + linkHref.slice(1);
            if (newURL !== url) {
              setOfLinks.add(newURL);
            }
          }
        });
        console.log(setOfLinks);
        let val = 1;
        while (val > 0) {
          processOne();
          val--;
        }
      }
      console.log(err);
    });
  }

  processOne();
}

module.exports = test5;
