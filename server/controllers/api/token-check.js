module.exports = function (req, res, next) {
    res.json({auth: req.authorized});
};