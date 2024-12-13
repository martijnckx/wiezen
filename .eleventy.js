require('dotenv').config();

const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');
const pluginBookshop = require("@bookshop/eleventy-bookshop");
const markdownItEleventyImg = require("markdown-it-eleventy-img");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");

const IMAGE_OPTIONS = {
	widths: [260, 350, 400, 450, 510, 540, 690, 700, 800, 1600],
	formats: ["avif", "webp", "jpeg", "svg"],
	outputDir: "./_site/assets/img/optimised/",
	urlPath: "/assets/img/optimised/",
	// svgCompressionSize: "br",
};

module.exports = function (eleventyConfig) {

  eleventyConfig.addWatchTarget("./_component-library/");

  eleventyConfig.setServerOptions({
	showAllHosts: true,
  });

  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  const cacheBusterOptions = {};
  eleventyConfig.addPlugin(cacheBuster(cacheBusterOptions));

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(pluginBookshop({
    bookshopLocations: ["_component-library"],
  }));

  eleventyConfig.addShortcode("assertIsNotEmpty", function(value, message) {
	if (value === undefined || value === null || value === "") {
	  throw new Error(`Value is empty: ${message}`);
	}
  });

  eleventyConfig.addFilter("image", async (srcFilePath, alt, sizes) => {
		let before = Date.now();
		let inputFilePath = srcFilePath;
		let metadata = await Image(inputFilePath, Object.assign({
			svgShortCircuit: "size",
		}, IMAGE_OPTIONS));
		console.log(`[11ty/eleventy-img] ${Date.now() - before}ms: ${inputFilePath}`);

		return Image.generateHTML(metadata, {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		});
	});

  eleventyConfig.addFilter("eagerImage", async (srcFilePath, alt, sizes) => {
		let before = Date.now();
		let inputFilePath = srcFilePath;
		let metadata = await Image(inputFilePath, Object.assign({
			svgShortCircuit: "size",
		}, IMAGE_OPTIONS));
		console.log(`[11ty/eleventy-img] ${Date.now() - before}ms: ${inputFilePath}`);

		return Image.generateHTML(metadata, {
			alt,
			sizes,
			loading: "eager",
			decoding: "async",
		});
	});

  // Enable eleventy-img when parsing markdown
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(markdownItEleventyImg, {
    imgOptions: IMAGE_OPTIONS,
    globalAttributes: {
      class: "markdown-image",
      decoding: "async",
      loading: "lazy",
      sizes: "(max-width: 575px) 100vw, (max-width: 767px) 478px, (max-width: 991px) 658px, (max-width: 1199px) 578px, 698px"
    }
  }));

  // Ignores
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("content/_schemas/*");

  return {
    dir: {
      input: 'content'
    },
    pathPrefix: "/",
  };

};
