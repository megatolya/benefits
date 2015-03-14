module.exports = function (req, res, next) {
    console.log('hello');
    res.json({hello: 'world'});
    res.end();
};
