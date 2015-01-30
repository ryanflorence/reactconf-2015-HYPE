var jsonp = require('jsonp')
var API = 'https://api.discogs.com/releases'
var createStore = require('./createStore')
var Promise = require('bluebird')

module.exports = createStore((id) => {
  return new Promise((res, rej) => {
    jsonp(`${API}/${id}`, {}, (err, response) => {
      res(response.data)
    })
  })
  return inflight[id]
})

