module.exports = function (grunt) {
    var options = {
        outputDir: 'out'
    };

    require('./Gruntfile-firefox')(grunt, options);
};
