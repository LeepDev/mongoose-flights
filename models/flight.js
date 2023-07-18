const mongoose = require('mongoose');
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const flightSchema = new mongoose.Schema({
    airline: {
        type: String,
        enum: ['American','Southwest','United']
    },
    airport: {
        type: String,
        enum: ['AUS','DFW','DEV','LAX','SAN'],
        default: function() {
            return 'DEN';
        }
    },
    flightNo: {
        type: Number,
        required: true,
        min: 10,
        max: 9999
    },
    departs: {
        type: Date,
        default: function() {
            let date = new Date();
            date.setFullYear(date.getFullYear()+1);
            return date;
        }
    }
}, {
  timestamps: true
});

// Compile the schema into a model and export it
module.exports = mongoose.model('Flight', flightSchema);