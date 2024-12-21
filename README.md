# Dutch scoreboard for Whist

This project is a scoreboard for the card game Whist. It follows the [rules](https://www.whistiwwa.com/_files/ugd/d0d088_06f8f8e9bffa4e828859b045cc88c57a.pdf) and [scoring tables](https://www.whistiwwa.com/_files/ugd/d0d088_2c9ac91443ab4b98ac7ad047e1f0ef59.pdf) of the International World Whist Association (IWWA). All copy on the pages is in Dutch.

## Development

This project is built with the SSG [Eleventy](https://www.11ty.dev/). Plain JavaScript is used in all script files. Markup is written in [Liquid](https://shopify.dev/docs/liquid), a simple templating language.

To run the project locally, follow these steps:

1. Clone the repo with (eg. `git clone git@github.com:martijnckx/wiezen.git`)
2. Run `npm install` to install the dependencies
3. Create and update the environment variables (`cp .env.example .env`)
4. Run `npm run dev` to start the development server
5. Open [http://localhost:8000](http://localhost:8000) in your browser

## Environment variables

Some of these environment variables are required for a build to succeed. These are marked with a `*` below.

- `SITE_NAME`* — used across the base template as alt tags, and as the main H1 of every page
- `SITE_META_TITLE`* — used as the `<title>` of every page, as well as OpenGraph and Twitter title tags
- `SITE_META_DESCRIPTION`* — used as the meta description of every page
- `SITE_SOCIAL_SHARE_IMAGE_URL` — used as the meta image of every page (unless overwritten by specific pages). If not set, the image will be generated from a screenshot of the specific page by [image.social](https://image.social). The domain should be added to your [image.social](https://image.social) account.
- `SITE_HOSTNAME`* — used generation of screenshots, canonical URLs, sitemap, robots.txt ...
- `PLAUSIBLE_DOMAIN_ID` — used for [Plausible Analytics](https://plausible.io/). If not set, the Plausible script will not be included. If set, the domain should be added to your Plausible account.

## Overview of directories

- `public/` contains static assets for the website
- `functions/tools/` contains Cloudflare Pages Functions that work as a proxy for Plausible Analytics
- `content/` contains the content for the website
    - `_includes/` contains shared Liquid templates for the website
    - `_data/` contains data for the website, used for SSG
- `_site/` is the output directory for Eleventy's build

## Important files

If you want to make changes to this project, you will most likely want to edit the following files:

- `content/*.liquid` are the basic pages for the website, with a script tag for page-specific client side logic at the bottom
- `content/add-round.liquid` contains the form for adding each round, based on the rounds data
- `content/_data/rounds.mjs` contains the Whist rounds with data like names, scoring tables, and more.
- `public/assets/game.js` contains logic for the game, point calculations, and players.
- `public/assets/style.css` contains the styling for the website.
- `.eleventy.js` contains build configuration
- `content/_data/site.mjs` contains the site data, including author information used in security.txt
- `public/humans.txt` contains information on [The humans responsible & technology colophon](http://humanstxt.org/)

## Deployment

This project is deployed with [Cloudflare Pages](https://pages.cloudflare.com/) at [wiezen.ckx.be](https://wiezen.ckx.be).

If you want to deploy a fork of the project, you can choose any server that can serve static files from the `_site` directory after a build. The only caveat: the Plausible Analytics proxy will not work outside of Cloudflare Pages.