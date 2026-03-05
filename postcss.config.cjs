const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.html', './src/**/*.ts'],
  // Default extractor that handles Angular template syntax
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

const postcssImport = require('postcss-import');

// This configuration simply ensures imports are expanded.  We no longer run
// PurgeCSS as a PostCSS plugin because Angular's global style handling
// prevented bootstrap from being purged. Instead, a separate npm script
// (`build:purge`) runs the PurgeCSS CLI against the bundled stylesheet.

module.exports = {
  plugins: [
    postcssImport()
    // autoprefixer and other internal plugins are added by Angular
  ]
};
