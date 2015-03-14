module.exports = function (req, res, next) {
    console.log('path >>>', req.path);
    next();
};
