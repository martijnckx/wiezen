import { escapeHtmlEntities, nl2br, validateEmail } from "./utils";
import { sendViaPostmark, sendViaPostmarkWithTemplate } from "./postmark";

/**
 * @typedef {Object} ContactFormConfig
 * @property {boolean} useCfTurnstile - Should this data include a the necessary Turnstile data?
 * @property {string} subject - The subject of the email.
 * @property {string} nameKey - The key that will contain the name of the person submitting the form.
 * @property {string} emailKey - The key that will contain the email address of the person submitting the form.
 * @property {string} messageKey - The key that will contain the main message body of the contact form.
 * @property {Array<{key: string, title: string, required: boolean}>} otherKeys - Other properties that are optional or required for the email.
 * @property {string} fallbackValueForOptionalKeys - The value to be used in place of a empty optional property.
 * @property {boolean} sendConfirmationMailToUser - Should a confirmation email be sent to the user?
 */

/**
 * applyContactFormConfig will parse the given data object following the config
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Object} data the incoming data to parse
 * @param {ContactFormConfig} config configuration object that specifies needed data for an email
 */
export function applyContactFormConfig(data, config) {
    let cleanedData = {};
    const requiredKeys = [
        config["nameKey"],
        config["emailKey"],
    ].concat(config.otherKeys.filter((x) => x.required).map((x) => x.key));
    if (config["messageKey"]) requiredKeys.push(config["messageKey"]);
    if (config.useCfTurnstile) requiredKeys.push('cf-turnstile-response');
    const optionalKeys = config.otherKeys
        .filter((x) => !x.required)
        .map((x) => x.key);

    for (const required of requiredKeys) {
        let cleaned;
        if (Array.isArray(data[required])) {
            if (data[required].length <= 0) {
                throw new Error(`validation.required-field-missing.${required}`);
            }
            cleaned = data[required].map((x) => x.trim()).join(" & ");
        } else {
            cleaned = data[required]?.trim();
        }
        if (!cleaned || cleaned.length <= 0) {
            throw new Error(`validation.required-field-missing.${required}`);
        }
        cleanedData[required] = cleaned;
    }

    if (!validateEmail(cleanedData[config["emailKey"]])) {
        throw new Error("validation.invalid-email-address");
    }

    for (const optional of optionalKeys) {
        let cleaned;
        if (Array.isArray(data[optional])) {
            if (data[optional].length <= 0) {
                cleaned = config.fallbackValueForOptional ?? '-';
            }
            cleaned = data[optional].map((x) => x.trim()).join(" & ");
        } else {
            cleaned =
                data[optional] && data[optional]?.trim().length > 0
                    ? data[optional]?.trim()
                    : (config.fallbackValueForOptionalKeys ?? "-");
        }
        cleanedData[optional] = cleaned;
    }

    return cleanedData;
}

function buildContactFormTemplateData(data, config) {
    const message = data[config["messageKey"]] ?? null;
    const htmlMessage = message ? nl2br(escapeHtmlEntities(message)) : null;
    const templateData = {
        "sender": {
            "name": data[config["nameKey"]],
            "mail": data[config["emailKey"]],
        },
        "fields": [],
        "body": {
            "text": message,
            "html": htmlMessage,
        },
    }

    for (const otherKey of config.otherKeys) {
        templateData.fields.push({
            "key": otherKey.title,
            "value": data[otherKey.key],
        });
    }

    return templateData;
}

function buildContactFormConfirmationTemplateData(data, config, env) {
    const message = data[config["messageKey"]] ?? null;
    const htmlMessage = message ? nl2br(escapeHtmlEntities(message)) : null;

    const templateData = {
        "company": env.SITE_NAME,
        "sender": data[config["nameKey"]],
        "fields": [],
        "body": {
            "text": message,
            "html": htmlMessage,
        },
    }

    for (const otherKey of config.otherKeys) {
        templateData.fields.push({
            "key": otherKey.title,
            "value": data[otherKey.key],
        });
    }

    return templateData;
}

export async function sendContactFormMail(data, config, env) {
    const to = {
        name: env.MAIL_RECEIVER_NAME,
        email: env.MAIL_RECEIVER_ADDRESS,
    }

    if (!validateEmail(to.email)) {
        const siteName = env.SITE_NAME ?? "some CKX";
        await sendMailToWebmaster({plain: `${siteName} website has a broken contact form. Recipient address is set to "${to.email}", and that is not a valid email address.`}, `Broken contact form on ${siteName} website`, env)
        throw new Error("validation.invalid-receiver-email-address");
    }

    const replyTo = {
        name: data[config["nameKey"]],
        email: data[config["emailKey"]],
    }

    const templateData = buildContactFormTemplateData(data, config);
    const confirmationTemplateData = buildContactFormConfirmationTemplateData(data, config, env);
    await sendMailWithTemplate('contact-form', templateData, to, replyTo, env);
    // replyTo and to are swapped here because the confirmation mail is sent to the user
    if (config.sendConfirmationMailToUser) {
        await sendMailWithTemplate('contact-form-confirmation', confirmationTemplateData, replyTo, to, env);
    }
}

export async function sendMailToWebmaster(content, subject, env) {
    if (!validateEmail(env.MAIL_WEBMASTER_ADDRESS)) {
        throw new Error("validation.invalid-webmaster-email-address");
    }

    const webmaster = {
        name: env.MAIL_WEBMASTER_NAME || null,
        email: env.MAIL_WEBMASTER_ADDRESS,
    }

    return sendMail(content, subject, webmaster, null, env);
}

/**
 * Sends a transactional email.
 *
 * @param {Object} content - The content of the mail message. The object must include plain and/or html values.
 * @param {string} subject - The subject of the mail message.
 * @param {Object} to - Data about the recipient. The object must include the email property and may also include the name property.
 * @param {Object} [replyTo] - Optional. Where the recipient will reply to. If included, The object must include email and may include name.
 * @param {Object} env - Data about the environment variables. This should include POSTMARK_API_TOKEN.
 * @returns {Promise} - You can await this Promise so the mail is actually sent.
 * @throws {Error} - Throws an error if unable to send a request or error response received.
 */
export async function sendMail(content, subject, to, replyTo, env) {

    let recipient = { ...to };

    if (env.MAIL_RECEIVER_OVERRIDE_ADDRESS) {
        recipient.name = env.MAIL_RECEIVER_OVERRIDE_NAME || null;
        recipient.email = env.MAIL_RECEIVER_OVERRIDE_ADDRESS;
    }

    if (!validateEmail(recipient.email)) {
        throw new Error("validation.invalid-receiver-email-address");
    }

    const from = {
        name: env.MAIL_SENDER_NAME,
        email: env.MAIL_SENDER_ADDRESS,
    };

    console.log(content);

    await sendViaPostmark(content, subject, from, recipient, replyTo, env);
}

/**
 * Sends a transactional email using a template.
 *
 * @param {string} templateAlias - Valid template alias that exists.
 * @param {Object} templateData - Data that will be used to populate the template.
 * @param {Object} to - Data about the recipient. The object must include the email property and may also include the name property.
 * @param {Object} [replyTo] - Optional. Where the recipient will reply to. If included, The object must include email and may include name.
 * @param {Object} env - Data about the environment variables. This should include POSTMARK_API_TOKEN.
 * @returns {Promise} - You can await this Promise so the mail is actually sent.
 * @throws {Error} - Throws an error if unable to send a request or error response received.
 */
export async function sendMailWithTemplate(templateAlias, templateData, to, replyTo, env) {

    let recipient = { ...to };

    if (env.MAIL_RECEIVER_OVERRIDE_ADDRESS) {
        recipient.name = env.MAIL_RECEIVER_OVERRIDE_NAME || null;
        recipient.email = env.MAIL_RECEIVER_OVERRIDE_ADDRESS;
    }

    if (!validateEmail(recipient.email)) {
        throw new Error("validation.invalid-receiver-email-address");
    }

    const from = {
        name: env.MAIL_SENDER_NAME,
        email: env.MAIL_SENDER_ADDRESS,
    };

    await sendViaPostmarkWithTemplate(templateAlias, templateData, from, recipient, replyTo, env);
}