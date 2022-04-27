const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

const port = process.env.PORT || 4000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((success) => console.log(`mongodb Connected`))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
