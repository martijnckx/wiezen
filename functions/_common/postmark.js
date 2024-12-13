const PostmarkRequestType = {
    MANUAL: 'manual',
    TEMPLATE: 'template',
}

function buildMaildata(content, subject, from, to, replyTo) {
    const maildata = {
        "From": from.name ? `${from.name}<${from.email}>` : from.email,
        "To": to.name ? `${to.name}<${to.email}>` : to.email,
        "Subject": subject,
        "MessageStream": "system-emails",
    };

    if (replyTo?.email) {
        maildata['ReplyTo'] = replyTo.name ? `${replyTo.name}<${replyTo.email}>` : replyTo.email;
    }

    if (content?.plain) {
        maildata['TextBody'] = content.plain;
    }
    if (content?.html) {
        maildata['HtmlBody'] = content.html;
    }

    if (!content?.plain && !content?.html) {
        throw new Error('mail.no-content');
    }

    return maildata;
}

function buildMaildataForTemplate(templateAlias, templateData, from, to, replyTo) {
    const maildata = {
        "From": from.name ? `${from.name}<${from.email}>` : from.email,
        "To": to.name ? `${to.name}<${to.email}>` : to.email,
        "MessageStream": "system-emails",
    };

    if (replyTo?.email) {
        maildata['ReplyTo'] = replyTo.name ? `${replyTo.name}<${replyTo.email}>` : replyTo.email;
    }

    if (!templateAlias || templateAlias.length <= 0) {
        throw new Error('mail.no-template-alias');
    }

    if (!templateData || typeof templateData !== 'object') {
        throw new Error('mail.no-template-data');
    }

    maildata['TemplateAlias'] = templateAlias;
    maildata['TemplateModel'] = templateData;

    return maildata;
}

async function sendPostmarkRequest(type, data, env) {
    const opts = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Postmark-Server-Token': env.POSTMARK_API_TOKEN,
        },
        body: JSON.stringify(data),
    };

    return fetch(`https://api.postmarkapp.com/email${type === PostmarkRequestType.TEMPLATE ? '/withTemplate' : ''}`, opts);
}

/**
 * Sends a transactional email via Postmark.
 *
 * @param {Object} content - The content of the mail message. The object must include plain and/or html values.
 * @param {string} subject - The subject of the mail message.
 * @param {Object} from - Data about the sender. The object must include the email property and may also include the name property.
 * @param {Object} to - Data about the recipient. The object must include the email property and may also include the name property.
 * @param {Object} [replyTo] - Optional. Where the recipient will reply to. If included, The object must include email and may include name.
 * @param {Object} env - Data about the environment variables. This should include POSTMARK_API_TOKEN.
 * @returns {Promise} - You can await this Promise so the mail is actually sent.
 * @throws {Error} - Throws an error if unable to send a request or error response received.
 */
export async function sendViaPostmark(content, subject, from, to, replyTo, env) {

    const data = buildMaildata(content, subject, from, to, replyTo);

    console.log(data);

    let response;

    try {
        console.log(data);
        response = await sendPostmarkRequest(PostmarkRequestType.MANUAL, data, env);
        console.log(response);
    }
    catch (e) {
        console.log(e);
        throw new Error('postmark.unable-to-send-request');
    }

    if (!response.ok) {
        let jsonResponse;
        try {
            jsonResponse = await response.json();
            console.log("Postmark response was not OK");
            console.log(jsonResponse);
            console.log(`Postmark error: ${jsonResponse.ErrorCode}, ${jsonResponse.Message}`);
        } catch (e) {
            console.log("No response body available for postmark response");
        }
        if (jsonResponse) {
            throw new Error(`postmark.error-status-code.${jsonResponse.ErrorCode}`);
        } 
        throw new Error('postmark.error-http-response.without-body');
    }

    const jsonResponse = await response.json(); 

    if (jsonResponse.ErrorCode !== 0) {
        console.log(`Postmark error: ${jsonResponse.ErrorCode}, ${jsonResponse.Message}`);
        throw new Error(`postmark.error-status-code.${jsonResponse.ErrorCode}`);
    }
}

/**
 * Sends a transactional email via Postmark.
 *
 * @param {string} templateAlias - Valid Postmark template alias that exists in the relevant Server.
 * @param {Object} templateData - Data that will be used to populate the template.
 * @param {Object} from - Data about the sender. The object must include the email property and may also include the name property.
 * @param {Object} to - Data about the recipient. The object must include the email property and may also include the name property.
 * @param {Object} [replyTo] - Optional. Where the recipient will reply to. If included, The object must include email and may include name.
 * @param {Object} env - Data about the environment variables. This should include POSTMARK_API_TOKEN.
 * @returns {Promise} - You can await this Promise so the mail is actually sent.
 * @throws {Error} - Throws an error if unable to send a request or error response received.
 */
export async function sendViaPostmarkWithTemplate(templateAlias, templateData, from, to, replyTo, env) {

    const data = buildMaildataForTemplate(templateAlias, templateData, from, to, replyTo);

    let response;

    try {
        console.log(data);
        response = await sendPostmarkRequest(PostmarkRequestType.TEMPLATE, data, env);
        console.log(response);
    }
    catch (e) {
        console.log(e);
        throw new Error('postmark.unable-to-send-request');
    }

    if (!response.ok) {
        let jsonResponse;
        try {
            jsonResponse = await response.json();
            console.log("Postmark response was not OK");
            console.log(jsonResponse);
            console.log(`Postmark error: ${jsonResponse.ErrorCode}, ${jsonResponse.Message}`);
        } catch (e) {
            console.log("No response body available for postmark response");
        }
        if (jsonResponse) {
            throw new Error(`postmark.error-status-code.${jsonResponse.ErrorCode}`);
        } 
        throw new Error('postmark.error-http-response.without-body');
    }

    const jsonResponse = await response.json(); 

    if (jsonResponse.ErrorCode !== 0) {
        console.log(`Postmark error: ${jsonResponse.ErrorCode}, ${jsonResponse.Message}`);
        throw new Error(`postmark.error-status-code.${jsonResponse.ErrorCode}`);
    }
}