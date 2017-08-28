'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = new Schema({
  github: {
    id: String,
    displayName: String,
    username: String,
    publicRepos: Number
  },
  nbrClicks: {
    clicks: Number
  },
  rsvps: [
    {yelpId: String}
  ]
}, { collection: 'fccNightlifeUser' })

module.exports = mongoose.model('User', User)
