function getData() {
  // generate some dummy data
  var data = {
    start_at: new Date().getTime() / 1000,
    databases: {}
  };
  
  for (var i = 1; i <= ENV.rows; i++) {
    data.databases["cluster" + i] = {
      queries: []
    };
    
    data.databases["cluster" + i + "slave"] = {
      queries: []
    };
  }

  Object.keys(data.databases).forEach(function(dbname) {
    var info = data.databases[dbname];
    
    var r = Math.floor((Math.random() * 10) + 1);
    for (var i = 0; i < r; i++) {
      var q = { 
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
  });
  
  return data;
}

if (!String.prototype.lpad) {
  String.prototype.lpad = function (padding, toLength) {
    return padding.repeat((toLength - this.length) / padding.length).concat(this);
  };
}

angular.module('app', [])
  .filter('formatElapsed', function () {
    return function (value) {
      if (!value) return '';
      var str = parseFloat(value).toFixed(2);
      if (value > 60) {
        var minutes = Math.floor(value / 60);
        var comps = (value % 60).toFixed(2).split('.');
        var seconds = comps[0].lpad('0', 2);
        var ms = comps[1];
        str = minutes + ":" + seconds + "." + ms;
      }
      return str;
    };
  })
  .factory('RenderService', function () {
    function getLastSample(db) {
      return db.samples[db.samples.length - 1];
    }
  
    function getTopFiveQueries(db) {
      var arr = getLastSample(db).queries.slice(0, 5);
      while (arr.length < 5) {
        arr.push({ query: '' });
      }
      return arr;
    }
  
    function getCountClassName(db) {
      var count = getLastSample(db).queries.length;
      var className = 'label';
      if (count >= 20) {
        className += ' label-important';
      }
      else if (count >= 10) {
        className += ' label-warning';
      }
      else {
        className += ' label-success';
      }
      return className;
    }
  
    function getElapsedClassName(elapsed) {
      var className = 'Query elapsed';
      if (elapsed >= 10.0) {
        className += ' warn_long';
      }
      else if (elapsed >= 1.0) {
        className += ' warn';
      }
      else {
        className += ' short';
      }
      return className;
    }
  
    return {
      getLastSample: getLastSample,
      getTopFiveQueries: getTopFiveQueries,
      getCountClassName: getCountClassName,
      getElapsedClassName: getElapsedClassName
    };
  })
  .controller('DBMonCtrl', function ($scope, $timeout, RenderService) {
    $scope.databases = {};
    $scope.helper = RenderService;
    $scope.topFiveQueries = {};

    var load = function() {
      var newData = getData();

      Object.keys(newData.databases).forEach(function(dbname) {
        var sampleInfo = newData.databases[dbname];

        if (!$scope.databases[dbname]) {
          $scope.databases[dbname] = {
            name: dbname,
            samples: []
          };
        }

        var samples = $scope.databases[dbname].samples;
        samples.push({
          time: newData.start_at,
          queries: sampleInfo.queries
        });
        
        if (samples.length > 5) {
          samples.splice(0, samples.length - 5);      
        }
        
        $scope.topFiveQueries[dbname] = RenderService.getTopFiveQueries($scope.databases[dbname]);
      });
      $timeout(load, ENV.timeout);
    };

    load();
  });
