'use strict'
var mongoose = require('mongoose')
var User = require('../models/users')
var Business = require('../models/businesses')

function rsvp (userId, businessId, callback) {
  User.findOne({_id: userId}, function (error, user) {
    if (error) return callback(error)
    if (!user) return callback(new Error('User not found'))
    // check if user already has a matching rsvp
    for (let i = 0; i < user.rsvps.length; i++) {
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

function cancelrsvp (userId, businessId, callback) {
  User.findOne({_id: userId}, function (error, user) {
    if (error) return callback(error)
    if (!user) return callback(new Error('User not found'))
    let rsvpFlag = false
    for (let i = 0; i < user.rsvps.length; i++) {
      if (user.rsvps[i].yelpId == businessId) {
        // remove RSVP from the user
        user.rsvps.splice(i, 1)
        rsvpFlag = true
      }
    }
    if (rsvpFlag === false) {
      return callback(new Error('User does not have an RSVP for ' + businessId))
    }
    // check if business exists in db
    Business.findOne({yelpId: businessId}, function (error, business) {
      if (business) {
        business.rsvpCount--
      }
      user.save()
      business.save()
      return callback(null)
    })
  })
}

function processBusinesses (businesses, userId, callback) {
  let busCallbackCount = 0
  let userCallbackCount = 0
  for (let i = 0; i < businesses.length; i++) {
    businesses[i].rsvpCount = 0
    // find business in db
    Business.findOne({yelpId: businesses[i].yelpId}, function (error, dbBusiness) {
      // if exists, set rsvps to value
      if (dbBusiness) {
        businesses[i].rsvpCount = dbBusiness.rsvpCount
      }
      busCallbackCount++
      if (busCallbackCount === userCallbackCount && userCallbackCount === businesses.length) {
        return callback(null, businesses)
      }
    })
  }

  if (userId) {
    for (let i = 0; i < businesses.length; i++) {
      businesses[i].isRSVPed = false
      User.findOne({_id: userId}, function (error, dbUser) {
        if (dbUser) {
          for (let j = 0; j < dbUser.rsvps.length; j++) {
            if (dbUser.rsvps[j].yelpId == businesses[i].yelpId) {
              businesses[i].isRSVPed = true
            }
          }
        }
        userCallbackCount++
        if (busCallbackCount === userCallbackCount && userCallbackCount === businesses.length) {
          return callback(null, businesses)
        }
      })
    }
  } else {
    userCallbackCount = businesses.length
  }
}

module.exports = {
  rsvp: rsvp,
  cancelrsvp: cancelrsvp,
  processBusinesses: processBusinesses
}
