const fs = require('fs');

const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`breed:${data}`);

  superagent
    .get(`https://dog.ceo/api/breeds/image/random  `)
    .end((err, res) => {
      console.log(res.body);
      fs.writeFile(`${__dirname}/info.txt`, res.body.message, (err, data) => {
        if (err) return console.log('err occured');
        console.log('random image stored to the file');
      });
    });
});
