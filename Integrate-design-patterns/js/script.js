console.log(gQ.version() + '----------------------------------');

gQ.start = function () {
    console.log('start...');
    gQ('#msg').text('change my copy');
    gQ('li').text("update me");
};