export default function () {
    return {
        "name": process.env.SITE_NAME || "",
        "title": process.env.SITE_META_TITLE || "",
        "description": process.env.SITE_META_DESCRIPTION || "",
        "socialShareImage": process.env.SITE_SOCIAL_SHARE_IMAGE_URL || "",
        "author": {
            "name": "Martijn Luyckx",
            "url": "https://martijnluyckx.be",
            "email": "martijn@ckx.be"
        },
        "host": process.env.SITE_HOSTNAME || "",
        "plausible_domain_id": process.env.PLAUSIBLE_DOMAIN_ID || "",
    };
};