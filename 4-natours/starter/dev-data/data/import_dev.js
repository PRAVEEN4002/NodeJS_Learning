const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const fs = require('fs');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ' a tour must have a name'],
    unique: true,
  },
  duration: {
    type: String,
    required: [true, 'A tour must have a durations'],
  },
  maxGroupSize: {
    type: String,
    required: [true, 'A tour must have a maxGroupSize'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  ratingsAverage: {
    default: 4.5,
    type: Number,
  },
  ratingsQuantity: {
    default: 0,
    type: Number,
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, ' A tour must have cover image'],
  },
  images: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));

const PORT = 8786;

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((success) => {
    console.log('mongodb is connected');
  });

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded successfully');
  } catch (err) {
    console.log('Error', err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    console.log('data deleted successfully');
  } catch (err) {
    console.log('Error', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  console.log(process.argv[2]);
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
  console.log(process.argv[2]);
}
