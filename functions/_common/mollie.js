function buildRequestBody(price, description, urls, data) {
    return JSON.stringify({
        amount: {
            currency: "EUR",
            value: `${price.toFixed(2)}`,
        },
        description: description,
        cancelUrl: urls.cancel,
        redirectUrl: urls.redirect,
        webhookUrl: urls.webhook,
        locale: 'nl_BE',
        metadata: data,
    });
}

/**
 * Represents the URLs for Mollie payment.
 *
 * @typedef {Object} MollieUrls
 * @property {string} cancelUrl - The URL to redirect the user to when the payment is canceled.
 * @property {string} redirectUrl - The URL to redirect the user to when the payment is successful.
 * @property {string} webhookUrl - The URL to receive to webhook notifications.
 */

/**
 * The most important properties of Mollie's response to a payment initiation.
 *
 * @typedef {Object} MolliePaymentResponseSummary
 * @property {string} id - The URL to redirect the user to when the payment is canceled.
 * @property {string} createdAt - The URL to redirect the user to when the payment is successful.
 * @property {string} checkoutUrl - The URL to receive to webhook notifications.
 */

/**
 * Initiate a payment through Mollie.
 *
 * @param {Object} price - The price of the payment in EUR.
 * @param {string} description - The description that will appear on the bank statement of the payer.
 * @param {MollieUrls} urls - Data about the sender. The object must include the email property and may also include the name property.
 * @param {Object} data - Metadata you want to store with the payment.
 * @param {Object} env - Data about the environment variables. This should include MOLLIE_API_KEY.
 * @returns {Promise<MolliePaymentResponseSummary>} You can await this Promise to wait for the confirmation summary.
 * @throws {Error} - Throws an error if unable to send a request or error response received.
 */
export async function initiateMolliePayment(price, description, urls, data, env) {
    const mollieBody = buildRequestBody(price, description, urls, data);
    console.log(mollieBody);
    const mollieResponse = await fetch('https://api.mollie.com/v2/payments', {
        method: 'post',
        body: mollieBody,
        headers: {
            "Content-type": 'application/json',
            "Authorization": `Bearer ${env.MOLLIE_API_KEY}`,
        },
    });

    const mollieData = await mollieResponse.json();

    console.log(mollieData);

    if (!mollieResponse.ok) {
        throw new Error(`mollie.cannot-initiate-payment.${mollieData.title}`);
    }

    const mollieSummary = {
        id: mollieData.id,
        createdAt: mollieData.createdAt,
        checkoutUrl: mollieData._links.checkout.href,
    }

    return mollieSummary;
}

export async function fetchPaymentStatus(id, env) {
    const mollieResponse = await fetch(`https://api.mollie.com/v2/payments/${id}`, {
        headers: {
            "Authorization": `Bearer ${env.MOLLIE_API_KEY}`,
        },
    });

    return await mollieResponse.json();
}