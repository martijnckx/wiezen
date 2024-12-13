module.exports = function () {
    return {
        "name": process.env.SITE_NAME || "",
        "metaTitleSuffix": process.env.SITE_META_TITLE_SUFFIX || process.env.SITE_NAME || "",
        "title": process.env.SITE_META_TITLE || "",
        "description": process.env.SITE_META_DESCRIPTION || "",
        "socialShareImage": process.env.SITE_SOCIAL_SHARE_IMAGE_URL || "",
        "author": {
            "name": "CKX",
            "url": "https://ckx.be",
            "email": "martijn@ckx.be"
        },
        "host": process.env.SITE_HOSTNAME || "",
        "plausible_domain_id": process.env.PLAUSIBLE_DOMAIN_ID || "",
        "turnstile_site_key": process.env.CF_TURNSTILE_SITE_KEY || "",
    };
};