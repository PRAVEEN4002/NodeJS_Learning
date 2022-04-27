const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'tour name must be less than or equls to 40'],
      minlength: [4, 'A tour length must be greater than or equal to 4'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'it should be between easy, medium and dificult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must haved a price'],
    },
    ratingsAverage: {
      default: 4.5,
      type: Number,
      min: [1.0, 'ratings must be between 1.0 and 5.0'],
      max: [5.0, 'ratings must be between 1.0 and 5.0'],
    },
    ratingsQuantity: {
      default: 0,
      type: Number,
    },
    priceDiscount: {
      type: Number,
      // validate: function (val) {
      //   return val < this.price;
      // },
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price({VALUE}) should be less than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary'],
    },
    slug: String,
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
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Virtual Properties
tourSchema.virtual('durationinWeeks').get(function () {
  return this.duration / 7;
});
// tourSchema.virtual('Your Pocket Money').get(function () {
//   return ((this.price * 60) / 100) * this.duration;
// });
//DOCUMENT MIDDLEWARE RUNS before .save and create command but not before insertMany
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { upper: true });
//   next();
// });
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start}`);
  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
