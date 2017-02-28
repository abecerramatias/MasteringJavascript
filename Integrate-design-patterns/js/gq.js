(function (scope, isForgiving) {
    var version = 1.0003;
    var doc = scope.document;

    var gQ = function (selector, context) {
        return q.query(selector, context);
    };

    gQ.loadJS = function (path, callback) {
        var js = doc.createElement('script');
        js.src = path;
        js.type = 'text/javascript';
        js.onload = function () {
            callback();
            this.onload = this.onreadystatechange = null;
        };

        js.onreadystatechange = function () {
            if (this.readyState == 'complete') {
                this.onload();
            }
        };

        doc.getElementsByTagName('head')[0].appendChild(js);
    };

    gQ.ready = function (fun) {
        var last = scope.onload;
        var isReady = false;

        if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', function () {
                console.log("DOM is loaded");
                isReady = true;
                fun();
            });
        }

        scope.onload = function () {
            if (last) last();
            if (isReady) fun();
        }
    };

    gQ.toArray = function (item) {
        var len = item.length;
        var out = [];

        if (len > 0) {
            for (var i = 0; i < len; i++) {
                out[i] = item[i];
            }
        } else {
            out[0] = item;
        }

        return out;
    };

    gQ.start = function () {
    };

    gQ.version = function () {
        return version;
    };

    gQ.ready(function () {
        if ('jQuery' in scope) {
            q = QueryFacade.create(JQueryAdapter, scope.jQuery, doc);
            gQ.start();
        } else if (doc.querySelectorAll && doc.querySelectorAll('body:first-of-type')) {
            q = QueryFacade.create(NativeQuery, null, doc);
            gQ.start();
        } else {
            gQ.loadJS('js/sizzle.min.js', function () {
                q = QueryFacade.create(SizzleAdapter, Sizzle, doc);
                gQ.start();
            });
        }
    });

    QueryFacade = function (adapter) {
        var dom = function () {
                return adapter.context;
            },
            query = function (selector, context) {
                return QueryFacade(adapter.query(selector, context));
            },
            text = function (value) {
                return adapter.text(value);
            };

        return {dom: dom, query: query, text: text};
    };

    QueryFacade.create = function (adapter, lib, context) {
        return new QueryFacade(new adapter(lib, context));
    };

    NativeQuery = function (lib, context) {
        this.context = context;
    };

    NativeQuery.prototype.query = function (selector, context) {
        context = context || this.context;
        console.log("NativeQuery:");
        return new NativeQuery(gQ.toArray(context.querySelectorAll(selector)));
    };

    NativeQuery.prototype.text = function (value) {
        innerText = (this.context[0].innerText === undefined) ? 'textContent' : 'innerText';

        for (var item in this.context) {
            this.context[item][innerText] = value;
        }
        return value;
    };

    SizzleAdapter = function (lib) {
        this.lib = lib;
    };
    SizzleAdapter.prototype.query = function (selector, context) {
        context = context || doc;
        console.log("SizzleAdapter:");
        return gQ.toArray(this.lib(selector, context));
    };

    JQueryAdapter = function (lib, context) {
        this.lib = lib;
        this.context = context;
        this.target = lib(context);
    };
    JQueryAdapter.prototype.query = function (selector, context) {
        context = context || doc;
        console.log("JQueryAdapter:");
        return new JQueryAdapter(this.lib, this.lib(selector, context).get());
    };
    JQueryAdapter.prototype.text = function (value) {
        return this.target.text(value);
    };

    var Ticker = (function () {
        var instance;

        function create() {
            var intervalID,
                currentInterval = 0,
                maxInterval = 0,
                index = 0,
                sensitivity = 100,
                methods = {};

            //public methods
            function add(interval, times, callback, name) {
                var realInterval = interval - interval % sensitivity;
                maxInterval = Math.max(realInterval, maxInterval);
                name = name || (++index);
                //TBD issue: the new name already exists.

                if (methods[interval]) {
                    methods[interval] = {};
                }

                methods[realInterval][name] = {times:times,
                                            callback:callback,
                                            interval:interval};

                start();
            }

            //private methods
            function start() {
                if (intervalID) {
                    intervalID = setInterval(runInterval, sensitivity);
                }
            }
            
            function runInterval() {
                currentInterval = currentInterval % maxInterval;
                currentInterval += sensitivity;
            }

            return {add: add};
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = create();
                }

                return instance;
            }
        }
    })();

    Ticker.getInstance();

    if (!scope.gQ) {
        scope.gQ = gQ;
    } else {
        if (isForgiving && scope.gQ.version) {
            scope.gQ = scope.gQ.version() > version ? scope.gQ : gQ;
        } else {
            throw new Error("The variable scope.gQ already exists!");
        }
    }
}(window, true));