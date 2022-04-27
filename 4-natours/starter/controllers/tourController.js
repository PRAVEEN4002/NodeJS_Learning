// const tours = require('../models/tourModel');
const fs = require('fs');
// const { tours } = require('../models/tourModel');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );
const Tour = require('../Model/tourModel');
const Apifeatures = require('../utils/apiFeatures');
// exports.checkId = (req, res, next, val) => {
//   console.log(`tour id is ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (req.body.name === undefined || req.body.price === undefined) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'bad request',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,price,summary,maxGroupSize,ratingsAverage';
  next();
};

exports.getalltours = async (req, res) => {
  try {
    //advance filtering
    // let queryObj = { ...req.query };
    // const excludedField = ['sort', 'page', 'limit', 'fields'];
    // excludedField.forEach((item) => {
    //   delete queryObj[item];
    // });
    // queryObj = JSON.stringify(queryObj);
    // queryObj = queryObj.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // queryObj = JSON.parse(queryObj);

    // console.log('req.query', req.query);
    // console.log('queryObj', queryObj);
    // let query = Tour.find(queryObj);

    //sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log('sortBy', sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    //projection -- field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }
    //pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 5;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const totalResults = await Tour.countDocuments();
    //   // const tours = await Tour.find();
    //   // const totalResults = tours;
    //   if (totalResults <= skip) {
    //     throw new Error('this page does not exist');
    //   }
    // }

    // const tours = await Tour.find()
    //   .where('difficulty')
    //   .equals('easy')
    //   .where('duration')
    //   .equals(5);
    const features = new Apifeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .projection()
      .paginate();
    const tours = await features.query;
    // const tours = await query;
    res.status(200).json({
      staus: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'failure',
      Error: err,
    });
  }

  // res.status(200).json({
  //   staus: 'success',
  //   data: {
  //     tours: tours,
  //   },
  // });
};
exports.gettour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    //it is a short cut for Tours.find({_id:id}).then().catch();

    res.status(200).json({
      staus: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'failure',
      Error: err,
    });
  }
};
exports.posttour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      Erroe: err,
    });
  }
};
exports.updatetour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      staus: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'failed',
      Error: err,
    });
  }
};
exports.deletetour = async (req, res) => {
  try {
    const id = req.params.id;
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      staus: 'the tour deleted',
    });
  } catch (err) {
    res.status(404).json({
      message: 'failed',
      Error: err,
    });
  }
};

exports.getTourStates = async (req, res) => {
  try {
    ///mongodb aggregation
    const states = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: `$difficulty`,
          _id: `$ratingsAverage`,

          numTours: { $sum: 1 },
          avgRating: { $avg: `$ratingsAverage` },
          numRatings: { $sum: `$ratingsQuantity` },
          avgPrice: { $avg: `$price` },
          minPrice: { $min: `$price` },
          maxPrice: { $max: `$price` },
        },
      },
    ]);
    const statistics = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: `$difficulty` },
          avgRating: { $avg: `$ratingsAverage` },
          avgPrice: { $avg: `$price` },
          numTours: { $sum: 1 },
          minPrice: { $min: `$price` },
          maxPrice: { $max: `$price` },
        },
      },
      {
        $sort: {
          numTours: 1,
        },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);
    res.status(200).json({
      message: 'success',
      results: statistics,
    });
  } catch (e) {
    res.status(404).json({
      message: 'error',
      Error: e,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const statistics = await Tour.aggregate([
      {
        $unwind: `$startDates`,
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: `$startDates` },
          numTours: { $sum: 1 },
          tours: { $push: `$name` },
        },
      },
      {
        $addFields: {
          month: `$_id`,
          KeerthiTravelers: `$tours`,
        },
      },
      {
        $sort: { numTours: -1 },
      },
      {
        $project: {
          _id: 0,
          tours: 0,
        },
      },
    ]);
    const states = await Tour.aggregate([
      {
        $unwind: `$startDates`,
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: `$startDates` },
          numTours: { $sum: 1 },
          tours: { $push: `$name` },
        },
      },
      {
        $addFields: {
          month: '$_id',
          BBTraverllers: '$tours',
        },
      },
      {
        $project: {
          _id: 0,
          tours: 0,
        },
      },
      {
        $sort: {
          numTours: -1,
        },
      },
      {
        $limit: 2,
      },
    ]);
    res.status(200).json({
      message: 'success',
      results: states,
    });
  } catch (e) {
    res.status(404).json({
      message: 'error',
      Error: e,
    });
  }
  const year = req.query.year;
};
