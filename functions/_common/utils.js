export function buildStatusUrl(template, status) {
    return template.replace('%s', encodeURIComponent(status));
}

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export function nl2br(str) {
    if (typeof str === "undefined" || str === null) {
        return "";
    }
    var breakTag = "<br>";
    return (str + "").replace(
        /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
        "$1" + breakTag + "$2"
    );
}

/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
export async function readRequestBody(request) {
    const { headers } = request;
    const contentType = headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return await request.json();
    } else if (contentType.includes("application/text")) {
        return request.text();
    } else if (contentType.includes("text/html")) {
        return request.text();
    } else if (contentType.includes("form")) {

        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
            const [key, value] = entry;
            if (key.endsWith("[]")) {
                const propertyName = key.slice(0, -2);
                if (!body[propertyName]) {
                    body[propertyName] = [];
                }
                body[propertyName].push(value);
            } else {
                body[key] = value;
            }
        }
        return body;
    } else {
        // Perhaps some other type of data was submitted in the form
        // like an image, or some other binary data.
        return "a file";
    }
}

export function escapeHtmlEntities(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function uuid() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}

export function getUrlParams(request) {
    const params = {};
    const url = new URL(request.url);
    const queryString = url.search.slice(1).split('&');

    queryString.forEach(item => {
        if (item) {
            const kv = item.split('=');
            const key = decodeURIComponent(kv[0]);
            const value = kv[1] ? decodeURIComponent(kv[1]) : true;
            if (key) params[key] = value;
        }
    });

    return params;
}