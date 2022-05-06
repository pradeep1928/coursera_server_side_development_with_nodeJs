const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// To load currency into mongoose
require('mongoose-currency').loadType(mongoose);
var currency = mongoose.Types.Currency;

// Defining Schema 
var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    price: {
        type: currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        required: true
    },
    comments: [commentSchema]
},
    { usePushEach: true },
    { timestamps: true }
);

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;