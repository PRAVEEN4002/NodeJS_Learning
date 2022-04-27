var http = require("http");
var url = require("url");

http
  .createServer((req, res) => {
    res.write("bandi praveen");

    res.end();
  })
  .listen(8900, "127.0.0.1", () => {
    console.log("server is running on port 8900");
  });
