'use strict'
var mongoose = require('mongoose')
var User = require('../models/users')
var Business = require('../models/businesses')

function rsvp (userId, businessId, callback) {
  User.findOne({_id: userId}, function (error, user) {
    if (error) return callback(error)
    if (!user) return callback(new Error('User not found'))
    // check if user already has a matching rsvp
    for (var i = 0; i < user.rsvps.length; i++) {
      if (user.rsvps[i].yelpId == businessId) {
        return callback(new Error('User already has an RSVP for this business'))
      }
    }
    // add rsvp to the user
    user.rsvps.push({yelpId: businessId})
    // check if business exists in db
    Business.findOne({yelpId: businessId}, function (error, business) {
      if (business) {
        business.rsvpCount++
      } else {
        business = new Business({yelpId: businessId, rsvpCount: 1})
      }
      user.save()
      business.save()
      return callback(null)
    })
  })
}

module.exports = rsvp
