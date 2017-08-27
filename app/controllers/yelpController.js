'use strict'

var Yelp = require('yelp-api-v3')

var yelp = new Yelp({
  app_id: process.env.yelpClientId,
  app_secret: process.env.yelpClientSecret
})

function getBars (location, callback) {
  yelp.search({location: location, categories: 'bars'})
    .then(function (data) {
      data = JSON.parse(data)
      var barResults = []
      for (var i = 0; i < data.businesses.length; i++) {
        var name = data.businesses[i].name || null
        var rating = data.businesses[i].rating || null
        var price = data.businesses[i].price || null
        var url = data.businesses[i].url || null
        var imgUrl = data.businesses[i].image_url || null
        var yelpId = data.businesses[i].id || null
        var businessData = {
          name: name,
          rating: rating,
          price: price,
          url: url,
          imgUrl: imgUrl,
          yelpId: yelpId
        }
        barResults.push(businessData)
      }
      callback(null, barResults)
    })
    .catch(function (err) {
      callback(err)
    })
}

module.exports = getBars
