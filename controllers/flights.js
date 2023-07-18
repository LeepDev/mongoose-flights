const Flight = require('../models/flight')

module.exports = {
    index,
    new: newFlight,
    create
}

async function index(req, res) {
    const flights = await Flight.find({}).sort({departs: -1});
    res.render('flights/index', {
        title: 'All Flights',
        flights
    })
}

async function newFlight(req, res) {
    const newFlight = new Flight();
    // Obtain the default date
    const dt = newFlight.departs;
    // Format the date for the value attribute of the input
    let departsDate = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
    departsDate += `-${dt.getDate().toString().padStart(2, '0')}T${dt.toTimeString().slice(0, 5)}`;
    res.render('flights/new', { title: 'Add Flight', departsDate });
}

async function create(req, res) {
    // remove any whitespace at start and end
    req.body.flightNo = req.body.flightNo.trim();
    try {
        await Flight.create(req.body);
        // Always redirect after CUDing data
        res.redirect('/flights');
      } catch (err) {
        // Typically some sort of validation error
        console.log(err);
        res.render('flights/new', { title: 'Add Flight', errorMsg: err.message });
      }
}