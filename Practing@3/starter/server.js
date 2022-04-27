const port = 9877;
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app.js');

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
