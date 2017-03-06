console.log(gQ.version() + '----------------------------------');

gQ.start = function () {
    // gQ('#msg').text('change my copy');
    // gQ('li').text("update me");
    // console.log(gQ('#msg').dom);

    var ticker = gQ.ticker();

    ticker.add(100, 4, function () {
        console.log("I'm called 4 times at 100 ms");
    });

    ticker.add(500, 2, function () {
        console.log("I'm called 2 times at 500 ms");
    });
};