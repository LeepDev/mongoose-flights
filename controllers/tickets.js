const Flight = require('../models/flight');
const Ticket = require('../models/ticket');

module.exports = {
  new: newTicket,
  create,
  delete: deleteTicket
};

async function newTicket(req, res) {
    const newTicket = new Ticket();
    const flight = await Flight.findById(req.params.id);
    res.render('tickets/new', { title: 'Add Ticket', flight });
}

async function create(req, res) {
    try {
        req.body.flight = req.params.id;
        await Ticket.create(req.body);
        // Always redirect after CUDing data
        res.redirect(`/flights/${req.params.id}`);
      } catch (err) {
        // Typically some sort of validation error
        console.log(err);
        res.render('tickets/new', { title: 'Add Ticket', errorMsg: err.message });
      }
}


async function deleteTicket(req, res) {
    const ticket = await Ticket.findById(req.params.id);
    await Ticket.deleteOne({_id: req.params.id});
    res.redirect(`/flights/${ticket.flight}`);
  }