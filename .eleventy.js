require('dotenv').config();

const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');

module.exports = function (eleventyConfig) {

  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  eleventyConfig.on('beforeBuild', () => {
    const fs = require('fs');
    const content = fs.readFileSync('content/_data/rounds.mjs', 'utf8');
    const modified = content.replace(/^export default[\s\S]*$/m, '');

    if (!fs.existsSync('_site/assets')) {
      fs.mkdirSync('_site/assets', { recursive: true });
    }

    fs.writeFileSync('_site/assets/rounds.js', modified);
  });

  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  if (process.env.ENVIRONMENT === "development") {
    eleventyConfig.addPassthroughCopy({ public: '/' });
  } else {
    const cacheBusterOptions = {};
    eleventyConfig.addPlugin(cacheBuster(cacheBusterOptions));
  }

  eleventyConfig.addShortcode("assertIsNotEmpty", function (value, message) {
    if (value === undefined || value === null || value === "") {
      throw new Error(`Value is empty: ${message}`);
    }
  });

  eleventyConfig.ignores.add("README.md");

  return {
    dir: {
      input: 'content'
    },
    pathPrefix: "/",
  };

};
