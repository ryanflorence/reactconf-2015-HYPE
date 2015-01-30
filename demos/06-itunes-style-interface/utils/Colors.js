var Promise = require('bluebird')
var ColorThief = require('./color-thief')
var Color = require('color')
var createStore = require('./createStore')

module.exports = createStore((id) => {
  return new Promise((resolve, reject) => {
    var img = new Image()
    img.onload = () => {
      var thief = new ColorThief()
      var [ r, g, b ] = thief.getColor(img)
      var bg = `rgb(${r}, ${g}, ${b})`
      var fg = Color().light(bg) ? '#000' : '#fff'
      resolve({ bg, fg })
    }
    img.src = BOB[id]
  })
})

