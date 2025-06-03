const Beer = require('../models/beerModel');

// Get all beers
exports.getAllBeers = async (req, res) => {
  try {
    const beers = await Beer.find();
    res.status(200).json({
      status: 'success',
      results: beers.length,
      data: {
        beers
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single beer
exports.getBeer = async (req, res) => {
  try {
    const beer = await Beer.findById(req.params.id);
    
    if (!beer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Beer not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        beer
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new beer
exports.createBeer = async (req, res) => {
  try {
    const newBeer = await Beer.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        beer: newBeer
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update a beer
exports.updateBeer = async (req, res) => {
  try {
    const beer = await Beer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!beer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Beer not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        beer
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Delete a beer
exports.deleteBeer = async (req, res) => {
  try {
    const beer = await Beer.findByIdAndDelete(req.params.id);
    
    if (!beer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Beer not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
