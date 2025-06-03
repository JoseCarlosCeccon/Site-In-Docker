const mongoose = require('mongoose');

const beerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Beer name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Beer type is required'],
    trim: true
  },
  alcoholContent: {
    type: Number,
    required: [true, 'Alcohol content is required']
  },
  description: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: 'default-beer.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;
