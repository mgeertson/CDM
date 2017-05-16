"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('cellphone-death-match/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _emberfireAdaptersFirebase) {
  exports['default'] = _emberfireAdaptersFirebase['default'].extend({});
});
define('cellphone-death-match/app', ['exports', 'ember', 'cellphone-death-match/resolver', 'ember-load-initializers', 'cellphone-death-match/config/environment'], function (exports, _ember, _cellphoneDeathMatchResolver, _emberLoadInitializers, _cellphoneDeathMatchConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _cellphoneDeathMatchConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _cellphoneDeathMatchConfigEnvironment['default'].podModulePrefix,
    Resolver: _cellphoneDeathMatchResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _cellphoneDeathMatchConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('cellphone-death-match/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'cellphone-death-match/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _cellphoneDeathMatchConfigEnvironment) {

  var name = _cellphoneDeathMatchConfigEnvironment['default'].APP.name;
  var version = _cellphoneDeathMatchConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('cellphone-death-match/controllers/index', ['exports', 'ember'], function (exports, _ember) {
  var iphoneprice = '739';
  var galaxyprice = '439';
  exports['default'] = _ember['default'].Controller.extend({
    ajax: _ember['default'].inject.service(),

    init: function init() {
      this.send("queryEbay");
    },

    actions: {

      iphoneQuery: function iphoneQuery() {
        var _this = this;

        return this.get('ajax').request('https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=BrianNuc-Cellphon-PRD-f69e2c47f-23e2c69e&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=iphone7&paginationInput.entriesPerPage=100&GLOBAL-ID=EBAY-US&siteid=0type=', {
          method: 'POST',
          dataType: "jsonp"
        }).then(function (result) {
          var resultsArray = result.findItemsByKeywordsResponse["0"].searchResult["0"].item;
          var averageprice = 0;
          for (var i = 0; i < resultsArray.length; i++) {
            averageprice += parseInt(resultsArray[i].sellingStatus["0"].currentPrice["0"].__value__);
          }
          var iphoneaverageprice = averageprice / resultsArray.length;
          iphoneprice = iphoneaverageprice;
          _this.store.createRecord('iphone', { averageprice: parseFloat(iphoneaverageprice) }).save();
          return iphoneaverageprice;
        });
      },

      galaxyQuery: function galaxyQuery() {
        var _this2 = this;

        var yup = this.get('ajax').request('https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=BrianNuc-Cellphon-PRD-f69e2c47f-23e2c69e&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=Galaxy,S7&paginationInput.entriesPerPage=100&GLOBAL-ID=EBAY-US&siteid=0type=', {
          method: 'POST',
          dataType: "jsonp"
        }).then(function (result) {
          var resultsArray = result.findItemsByKeywordsResponse["0"].searchResult["0"].item;
          var averageprice = 0;
          for (var i = 0; i < resultsArray.length; i++) {
            averageprice += parseInt(resultsArray[i].sellingStatus["0"].currentPrice["0"].__value__);
          }
          var galaxyaverageprice = averageprice / resultsArray.length;
          galaxyprice = galaxyaverageprice;
          _this2.store.createRecord('galaxy', { averageprice: parseFloat(galaxyaverageprice) }).save();
          _this2.set("averageprice", parseFloat(galaxyaverageprice));
          return galaxyaverageprice;
        });
      },

      myChart: function myChart() {
        console.log("Galaxy Price: " + galaxyprice);
        console.log("Iphone Price: " + iphoneprice);
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
          type: 'line',
          responsive: true,
          maintainAspectRatio: false,
          data: {
            labels: ["March 2016", "April 2016", "May 2016", "June 2016", "July 2016", "August 2016", "September 2016", "October 2016", "November 2016", "December 2016", "January 2017", "February 2017", "March 2017", "April 2017", "May 2017"],
            datasets: [{
              label: "Samsung Galaxy S7 - 32GB",
              backgroundColor: "rgba(220,220,220,0.5)",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#419CF1",
              data: [659, 869, 650, 595, 620, 600, 565, 555, 535, 635, 600, 378, 500, 479, galaxyprice]
            }, {
              label: "Apple iPhone 7 - 128GB",
              backgroundColor: "rgba(151,187,205,0.5)",
              fillColor: "rgba(151,187,205,0.5)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              data: [0, 0, 0, 0, 0, 0, 1250, 898, 840, 900, 589, 700, 725, 739, iphoneprice]
            }]

          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      },

      queryEbay: function queryEbay() {
        this.send('iphoneQuery');
        this.send('galaxyQuery');
        this.send('myChart');
        var self = this;
        _ember['default'].run.later(function () {
          self.send('queryEbay');
        }, 10000);
      }
    }
  });
});
define('cellphone-death-match/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('cellphone-death-match/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('cellphone-death-match/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'cellphone-death-match/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _cellphoneDeathMatchConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_cellphoneDeathMatchConfigEnvironment['default'].APP.name, _cellphoneDeathMatchConfigEnvironment['default'].APP.version)
  };
});
define('cellphone-death-match/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('cellphone-death-match/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('cellphone-death-match/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/index'], function (exports, _emberDataSetupContainer, _emberDataIndex) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('cellphone-death-match/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfireInitializersEmberfire) {
  exports['default'] = _emberfireInitializersEmberfire['default'];
});
define('cellphone-death-match/initializers/export-application-global', ['exports', 'ember', 'cellphone-death-match/config/environment'], function (exports, _ember, _cellphoneDeathMatchConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_cellphoneDeathMatchConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _cellphoneDeathMatchConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_cellphoneDeathMatchConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('cellphone-death-match/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('cellphone-death-match/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('cellphone-death-match/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("cellphone-death-match/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('cellphone-death-match/models/galaxy', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    averageprice: _emberData['default'].attr('number')
  });
});
define('cellphone-death-match/models/iphone', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    averageprice: _emberData['default'].attr('number')
  });
});
define('cellphone-death-match/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('cellphone-death-match/router', ['exports', 'ember', 'cellphone-death-match/config/environment'], function (exports, _ember, _cellphoneDeathMatchConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _cellphoneDeathMatchConfigEnvironment['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;
});
define('cellphone-death-match/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return _ember['default'].RSVP.hash({
        galaxy: this.store.findAll('galaxy'),
        iphone: this.store.findAll('iphone')
      });
    },

    setupController: function setupController(controller, models) {
      controller.set('galaxy', models.galaxy);
      controller.set('iphone', models.iphone);
    }
  });
});
define('cellphone-death-match/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('cellphone-death-match/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _emberfireServicesFirebaseApp) {
  exports['default'] = _emberfireServicesFirebaseApp['default'];
});
define('cellphone-death-match/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _emberfireServicesFirebase) {
  exports['default'] = _emberfireServicesFirebase['default'];
});
define("cellphone-death-match/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type"]
        },
        "revision": "Ember@2.4.6",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "cellphone-death-match/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("cellphone-death-match/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": false,
        "revision": "Ember@2.4.6",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "cellphone-death-match/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Index Page");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define('cellphone-death-match/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _emberfireToriiProvidersFirebase) {
  exports['default'] = _emberfireToriiProvidersFirebase['default'];
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('cellphone-death-match/config/environment', ['ember'], function(Ember) {
  var prefix = 'cellphone-death-match';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("cellphone-death-match/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"cellphone-death-match","version":"0.0.0+"});
}

/* jshint ignore:end */
//# sourceMappingURL=cellphone-death-match.map
