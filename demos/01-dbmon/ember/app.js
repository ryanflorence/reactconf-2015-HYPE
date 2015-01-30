var start = Date.now();

var App, Database, _base, _base1;
var loadCount = 0;

Database = Ember.Object.extend({
  name: null,
  hostname: null,
  samples: null,
  latestSample: (function() {
    var samples;
    samples = this.get('samples');
    if ((samples == null) || samples.get('length') === 0) {
      return {};
    }
    return samples.objectAt(samples.get('length') - 1);
  }).property('samples.@each')
});

Database.reopenClass({
  _all: Ember.ArrayProxy.create({
    content: []
  }),
  find: function(name) {
    return this._all.findProperty('name', name);
  },
  findAll: function() {
    return this._all;
  },
  _get: function(name) {
    var cached, db;
    cached = this.find(name);
    if (cached) {
      return cached;
    }
    db = this.create({
      name: name,
      samples: Ember.ArrayProxy.create()
    });
    db.get('samples').set('content', []);
    this._all.pushObject(db);
    return db;
  },
  loadLatest: function() {
    var data, db, dbname, i, info, q, r, url, _i, _j, _ref, _results;
    data = {
      start_at: new Date().getTime() / 1000,
      databases: {}
    };
    for (i = _i = 1; _i <= ENV.rows; i = ++_i) {
      data.databases["cluster" + i] = {
        queries: []
      };
      data.databases["cluster" + i + "slave"] = {
        queries: []
      };
    }
    _ref = data.databases;
    _results = [];
    for (dbname in _ref) {
      info = _ref[dbname];
      r = Math.floor((Math.random() * 10) + 1);
      for (i = _j = 0; 0 <= r ? _j <= r : _j >= r; i = 0 <= r ? ++_j : --_j) {
        q = {
          canvas_action: null,
          canvas_context_id: null,
          canvas_controller: null,
          canvas_hostname: null,
          canvas_job_tag: null,
          canvas_pid: null,
          elapsed: Math.random() * 15,
          query: "SELECT blah FROM something",
          waiting: Math.random() < 0.5
        };
        if (Math.random() < 0.2) {
          q.query = "<IDLE> in transaction";
        }
        if (Math.random() < 0.1) {
          q.query = "vacuum";
        }
        info.queries.push(q);
      }
      info.queries = info.queries.sort(function(a, b) {
        return b.elapsed - a.elapsed;
      });
      db = this._get(dbname);
      _results.push(db.get('samples').pushObject({
        time: data.start_at,
        queries: info.queries
      }));
    }
    Ember.run.later(function() {
      loadCount++;
      Database.loadLatest();
    }, ENV.timeout);
  }
});

App = Ember.Application.create({
  rootElement: '#app'
});

App.Router.map(function() {
  return this.resource('database', {
    path: "/dbs/:name"
  });
});

App.DatabaseRoute = Ember.Route.extend({
  model: function(params) {
    return Database.find(params.name);
  }
});

App.ApplicationController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true
});

App.SampleController = Ember.ObjectController.extend({
  topFiveQueries: (function() {
    var ary;
    ary = this.get('content.queries').slice(0, 5);
    while (ary.length < 5) {
      ary.push({
        query: ""
      });
    }
    return ary;
  }).property('content.queries.@each'),
  queriesCountLabelClass: (function() {
    var count;
    count = this.get('content.queries.length');
    if (count >= 20) {
      return "label-important";
    }
    if (count >= 10) {
      return "label-warning";
    }
    return "label-success";
  }).property('content.queries.@each')
});

App.QueryController = Ember.ObjectController.extend({
  elapsedClass: (function() {
    var elapsed;
    elapsed = this.get('content.elapsed');
    if (elapsed >= 10.0) {
      return "warn_long";
    }
    if (elapsed >= 1.0) {
      return "warn";
    }
    return "short";
  }).property('content.elapsed'),
  vacuum: (function() {
    var query;
    query = this.get('query').toLowerCase();
    return query.indexOf('vacuum') > -1 || query.indexOf('reorg') > -1;
  }).property('content.query'),
  idle: (function() {
    return this.get('query').indexOf('<IDLE>') > -1;
  }).property('content.query')
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return Database.findAll();
  },
  activate: function() {
    //console.log("loading!");
    Database.loadLatest();
    //return this.interval = setInterval(function() {
      //Database.loadLatest();
    //}, 1000);
  },
  deactivate: function() {
    return clearInterval(this.interval);
  }
});

(_base = String.prototype).repeat || (_base.repeat = function(num) {
  return new Array(num + 1).join(this);
});

(_base1 = String.prototype).lpad || (_base1.lpad = function(padding, toLength) {
  return padding.repeat((toLength - this.length) / padding.length).concat(this);
});

Ember.Handlebars.registerBoundHelper('formatElapsed', function(value) {
  var comps, minutes, ms, seconds, str;
  str = parseFloat(value).toFixed(2);
  if (value > 60) {
    minutes = Math.floor(value / 60);
    comps = (value % 60).toFixed(2).split('.');
    seconds = comps[0].lpad('0', 2);
    ms = comps[1];
    str = "" + minutes + ":" + seconds + "." + ms;
  }
  return str;
});

App.ApplicationView = Ember.View.extend({
  didInsertElement: function() {
    console.log(Date.now() - start);
  }
});
