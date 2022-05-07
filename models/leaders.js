const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// To load currency into mongoose
require('mongoose-currency').loadType(mongoose);
var currency = mongoose.Types.Currency;


var leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true 
    },
    featured: {
        type: Boolean,
        required: true
    }
},
    { usePushEach: true },
    { timestamps: true }
);

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;