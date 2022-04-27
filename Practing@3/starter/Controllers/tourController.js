const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.chekId = (req, res, next, val) => {
  console.log(`id is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Inavlid Id',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(402).json({
      status: 'failed',
      message: 'Missing name or Price',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    message: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);
  // res.send('done');

  var newId = tours[tours.length - 1].id + 1;
  var newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.getTour = (req, res) => {
  console.log(req.params.id);
  const tour = tours.find((item) => item.id === Number(req.params.id));
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated></updated>',
    },
  });
};
exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Delted></Delted>',
    },
  });
};
