(function (scope){
    var version = 1.0001;
    console.log("version is: " + version);

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

    }
}(window));