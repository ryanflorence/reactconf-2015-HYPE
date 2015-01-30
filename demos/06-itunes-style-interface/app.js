var Promise = require('bluebird')
var React = require('react')
var Router = require('react-router')
var Albums = require('./components/Albums')
var Album = require('./components/Album')
var { Route } = Router

var routes = (
  <Route name="albums" path="/" handler={Albums} ignoreScrollBehavior={true}>
    <Route name="album" path="album/:id" handler={Album}/>
  </Route>
)

var load = (routerState) => {
  return Promise.all(routerState.routes.filter((route) => {
    return route.handler.load
  }).map((route) => {
    return route.handler.load(routerState.params)
  }))
}

Router.run(routes, (Handler, state) => {
  load(state).then(() => {
    React.render(<Handler {...state}/>, document.body)
  })
})

