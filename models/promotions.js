const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// To load currency into mongoose
require('mongoose-currency').loadType(mongoose);
var currency = mongoose.Types.Currency;


var promoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    price: {
        type: currency,
        required: true,
        min: 0
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

var Promotion = mongoose.model('Promo', promoSchema);

module.exports = Promotion;