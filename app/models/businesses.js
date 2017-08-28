'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Business = new Schema({
  yelpId: String,
  rsvpCount: {type: Number, default: 0}
}, { collection: 'fccNightlifeBusinesses' })

module.exports = mongoose.model('Business', Business)
