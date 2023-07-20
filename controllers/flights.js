const Flight = require('../models/flight')
const Ticket = require('../models/ticket')
const _ = require('lodash');

module.exports = {
    index,
    new: newFlight,
    create,
    show
}

async function show(req, res) {
  const flight = await Flight.findById(req.params.id).populate('destinations');
  const tickets = await Ticket.find({ flight: flight._id });
  flight.destinations = _.sortBy(flight.destinations, 'arrival');
  const selectList = ['AUS', 'DFW', 'DEV', 'LAX' , 'SAN'];
  let idx = selectList.findIndex(port => port === flight.airport);
  if(idx !== -1)
      selectList.splice(idx, 1);
  flight.destinations.forEach(destination => {
    idx = selectList.findIndex(port => port === destination.airport);
    if(idx !== -1)
      selectList.splice(idx, 1);
  });
  res.render('flights/show', { title: 'Flight Detail', flight, tickets, selectList });
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