'use strict'

var path = process.cwd()
var getBars = require(path + '/app/controllers/yelpController.js')
var rsvp = require(path + '/app/controllers/rsvp.js')
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js')

module.exports = function (app, passport) {
  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/login')
    }
  }

  var clickHandler = new ClickHandler()

  app.route('/')
		.get(function (req, res) {
  var location = req.session.location || null
  if (location) {
    getBars(location, function (error, data) {
      if (error) return res.end(error.toString())
      res.render('index', {location: location, businesses: data})
    })
  } else {
    res.render('index', {location: location, businesses: null})
  }
})
    .post(function (req, res) {
      getBars(req.body.location, function (error, data) {
        if (error) return res.end(error.toString())
        req.session.location = req.body.location
        res.render('index', {location: req.body.location, businesses: data})
      })
    })
  app.route('/rsvp/:barId')
		.get(isLoggedIn, function (req, res) {
  var barId = req.params.barId
  rsvp(req.user.id, barId, function (error) {
    if (error) return res.end(error.toString())
    res.redirect('/')
  })
})

  app.route('/login')
		.get(function (req, res) {
  res.sendFile(path + '/public/login.html')
})

  app.route('/logout')
		.get(function (req, res) {
  req.logout()
  res.redirect('/login')
})

  app.route('/profile')
		.get(isLoggedIn, function (req, res) {
  res.sendFile(path + '/public/profile.html')
})

  app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
  res.json(req.user.github)
})

  app.route('/auth/github')
		.get(passport.authenticate('github'))

  app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

  app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks)
}
