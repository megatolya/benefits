module.exports = function (req, res) {
    req.getKey().then(function(key) {
        res.json({key: key});
    }).fail(function() {
        res.end();
    });
};
