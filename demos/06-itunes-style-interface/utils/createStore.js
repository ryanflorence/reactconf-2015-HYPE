var Promise = require('bluebird')

module.exports = (loadFn) => {
  var cache = {}
  var inflight = {}

  var load = (id) => {
    if (cache[id])
      return Promise.resolve(cache[id])
    if (inflight[id])
      return inflight[id]
    inflight[id] = loadFn(id).then((data) => {
      cache[id] = data
      delete inflight[id]
      return cache[id]
    })
    return inflight[id]
  }

  var get = (id) => cache[id]

  return { load, get:get }
}

