let path = require('path');

module.exports = function() {
    return [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.hbs/,
            loader: 'handlebars-loader',
            exclude: /(node_modules|bower_components)/
        },
        {
            test: /\.(jpe?g|png|gif|svg|)$/i,
            loader: 'file-loader?name=images/[hash].[ext]'
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'file-loader?name=fonts/[hash].[ext]'
        }
    ];
};
