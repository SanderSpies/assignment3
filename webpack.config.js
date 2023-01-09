const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: { import: './src/Example.bs.js', dependOn: 'react' },
        react: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: 'build.js',
        filename: '[name].js'

    },
};