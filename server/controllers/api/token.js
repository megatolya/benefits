module.exports = function (req, res) {
    req.getToken().then(function(token) {
        res.send(token);
    }).fail(function() {
        res.sendStatus(500);
        res.end();
    });
};
