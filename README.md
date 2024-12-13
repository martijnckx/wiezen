# Starter for CKX websites

This starter includes boilerplate code for Eleventy and Cloud Cannon with Bookshop, as well as a basic Cloudflare Function for an API contact route and an example contact form at `/contact`, and other Cloudflare Functions utilities.

## Site data

One of the first things to do for a new CKX site, is adding the site's general data to `/content/_data/site.json`. Before you do that, the site will not build by default.

## Social meta tags

This starter provides an easy way to facilitate consistent social sharing meta tags for all pages across some major standards (HTML5 native, Twitter, and Open Graph). To use it, include the `/content/_includes/socialMetaTags.liquid` file in the `head` of the page you want to use. A great way to do this, is adding it to the base template for your site. With Liquid templating, you can do that like so: add `{% include "socialMetaTags" %}` in the head of your layout.

By default, the `name`, `title`, `description`, and `socialShareImage` of your site data (`site.js`) will be used. These can also be set as environment variables, detailed in the Environment variables section below. You can overwrite that on a page-by-page basis by setting the `meta.title`, `meta.description`, and `meta.image` properties on that page. The easiest way to do that is by setting it as frontmatter:

```yml
meta:
    title: The page title
    description: The description of this very cool page
    image: https://example.com/shareimage.png
```

The `name` can't be overwritten, and will always be used as a suffix for your meta title. For example, if the meta title of your page is `The page title`, and the name of your site is `Example`, the generated title in the meta tags of your site will be `The page title | Example`.

 If you don't provide a meta image on a page, and also don't set a site-wide socialShareImage, a screenshot of the page will automatically be used as the share image. For this to work, you need to add the site's host to [Image.Social](https://image.social/). If you want to specifically use the generated screenshot even when there is a site-wide socialShareImage, use `"screenshot"` as the value for `meta.image` on a page.

## Cloudflare Functions

If you want to use Cloudflare functions for pages that are not under the `/api/*` path, you have to update the `/public/_routes.json` file accordingly. This file specifies all routes that should invoke functions. If the file is absent, all routes count as functions calls instead of static files which are served for free by Cloudflare Pages.

### Utilities

This starter comes with some helpful utilities in `/functions/_common/`. It includes generic utilities, and also helper functions for mails (currently sending with Postmark), Turnstile, and payments via Mollie. You can check out the example contact form function (`/functions/api/contact.js`) to see them in action.

## Environment variables

To successfully deploy a CKX website to Cloudflare Pages, make sure to set the relevant environment variables for the functionality that the site uses.

For local testing, create an `.env` file with the relevant environment variables. The fastest way to do that is `cp .env.example .env` whereafter you add the values.

If you want to locally store the environment variables used in production, you can do so in `.env.production`, which is already added to gitignore.

### Captchas

To work with Cloudflare Turnstile for robot detection, the utility function included in this repo looks for secret key in the `CF_TURNSTILE_SECRET` environment variable. To use this locally, the easiest way is to use [Turnstile's testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/). For example, set the environment variable to `1x0000000000000000000000000000000AA` to always make the server-side check pass. For the client side snippet, you can set your site key (`CF_TURNSTILE_SITE_KEY`) `1x00000000000000000000AA` for that to always pass. This is also what is used in the contact form example, and you are encouraged to also fetch this from the environment via `site.turnstile_site_key` when adding the client side Turnstile snippet.

- `CF_TURNSTILE_SITE_KEY`*: Cloudflare Turnstile site key.
- `CF_TURNSTILE_SECRET_KEY`*: Cloudflare Turnstile secret key.

### Emails

To enable contact form functionality, provide these environment variables:

- `MAIL_SENDER_ADDRESS`*: Email address that mails will be sent from. Should be a verified sender on Postmark.
- `MAIL_SENDER_NAME`: Optional. Name to be shown as the sender name for emails.
- `MAIL_RECEIVER_ADDRESS`*: Email address that contact form emails will be sent to.
- `MAIL_RECEIVER_NAME`: Optional. Name to be shown for the recipient of contact form emails.
- `MAIL_WEBMASTER_ADDRESS`*: Email address of the webmaster, for technical warnings to be sent to.
- `MAIL_WEBMASTER_NAME`: Optional. Name to be shown for webmaster.
- `MAIL_RECEIVER_OVERRIDE_ADDRESS`: Optional. Email address. If set, ALL outgoing mails will be sent to this address.
- `MAIL_RECEIVER_OVERRIDE_NAME`: Optional. If set in combination with `MAIL_RECEIVER_OVERRIDE_ADDRESS`, this is used as the recipient name for all outgoing mails.
- `POSTMARK_API_TOKEN`*: Postmark Server API token for a Server that has a Message Stream called `system-emails`.

### Payments

To allow for payments to be initiated, provide these environment variables:

- `MOLLIE_API_KEY`*: Mollie API key, must be a Live key in production

### Site data

You can configure site data as environment variables, in addition to adding them to `/content/_data/site.js`. This is especially useful for, well, environment-specific variables like hostname. These variables are available:

- `SITE_NAME`: Name of the business / organisation / site, preferably short. E.g. "CKX" or "The Web Shop".
- `SITE_META_TITLE`: Default meta title for the site, will be appended with the site's name by default as explained above in the social meta tags section. E.g. "The best websites for a great price".
- `SITE_META_DESCRIPTION`:  Default meta description for the site.
- `SITE_SOCIAL_SHARE_IMAGE_URL`: Absolute URL to the default social share image for this site. A fallback is available, explained above in the social meta tags section.
- `SITE_HOSTNAME`: Hostname where this site is deployed. E.g. "example.com" or "ckx.local" or "localhost:8000".