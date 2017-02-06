(function (scope){
    var version = 1.0001;

    var gQ = function (selector, context) {

    };

    gQ.loadJS = function () {

    };

    gQ.version = function () {
        return version;
    };

    if(!window.gQ){
        window.gQ = gQ;
    }else{
        if(isForgiving && window.gQ.version){
            window.gQ = window.gQ.version() > version ? window.gQ : gQ
        }
    }
}(window));