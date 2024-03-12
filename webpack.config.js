// const swcDefaultConfig =
//   require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory()
//     .swcOptions;
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            sourceMaps: true,
            jsc: {
              parser: {
                syntax: 'typescript',
                decorators: true,
                dynamicImport: true,
              },
              baseUrl: path.resolve(__dirname, './'),
            },
            minify: false,
          },
        },
      },
    ],
  },
};
