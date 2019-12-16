const path = require('path');
const mix = require('laravel-mix');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');

mix.disableNotifications();
mix.setPublicPath('docs');
mix.version();

mix.babelConfig({
  'presets': [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        forceAllTransforms: true,
      },
    ],
  ],
  'plugins': [
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    '@babel/plugin-proposal-optional-chaining',
  ],
});

mix.js('src/Walnut.class.js', 'docs/walnut.js');
mix.js('src/index.js', 'docs/index.js');

mix.sass('src/walnut.scss', 'docs/walnut.css');
mix.sass('src/index.scss', 'docs/index.css');


mix.sourceMaps();
mix.webpackConfig({
  resolve: {
    alias: {
      // JS: path.resolve(__dirname, './assets/js'),
    },

    extensions: ['.js', '.json'],
  },
  // output: {
  //     library: 'LIB',
  //     libraryTarget: 'var',
  // },
  // plugins: [
  //     new EsmWebpackPlugin(),
  // ],
});

// mix.browserSync('walnut.lan');

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.preact(src, output); <-- Identical to mix.js(), but registers Preact compilation.
// mix.coffee(src, output); <-- Identical to mix.js(), but registers CoffeeScript compilation.
// mix.ts(src, output); <-- TypeScript support. Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.test');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.babelConfig({}); <-- Merge extra Babel configuration (plugins, etc.) with Mix's default.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.extend(name, handler) <-- Extend Mix's API with your own components.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
