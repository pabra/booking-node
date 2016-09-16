module.exports = {
    entry: './src_www/js/index.js',
    output: {
        path: './srv_www/js',
        publicPath: 'js/',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css!' },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime'],
                    cacheDirectory: '/tmp',
                },
            },
        ],
    },
};
