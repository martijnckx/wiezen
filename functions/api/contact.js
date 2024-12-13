import { readRequestBody, buildStatusUrl } from "../_common/utils";
import { applyContactFormConfig, sendContactFormMail } from "../_common/mail";
import { verifyTurnstile } from "../_common/turnstile";

const statusRoute = '/contact/?status=%s';

const contactFormConfig = {
  useCfTurnstile: true,
  subject: "Contactformulier",
  nameKey: "name",
  emailKey: "email",
  messageKey: "message",
  otherKeys: [
    {
      key: "phone",
      title: "Telefoonnummer",
      required: false,
    },
  ],
  fallbackValueForOptionalKeys: "niet vermeld",
  sendConfirmationMailToUser: false,
};

export async function onRequestPost({ request, env }) {

  let body;
  const host = new URL(request.url).origin;

  try {
    body = await readRequestBody(request);
    body = applyContactFormConfig(body, contactFormConfig);
  } catch (error) {
    return Response.redirect(buildStatusUrl(`${host}${statusRoute}`, error.message), 302);
  }

  if (contactFormConfig.useCfTurnstile) {
    const token = body['cf-turnstile-response'];
    const ip = request.headers.get('CF-Connecting-IP');
    if (!await verifyTurnstile(token, ip, env))
      return Response.redirect(buildStatusUrl(`${host}${statusRoute}`, 'validation.robot'), 302);
  }

  try {
    await sendContactFormMail(body, contactFormConfig, env);
    return Response.redirect(buildStatusUrl(`${host}${statusRoute}`, 'success'), 302);
  } catch (error) {
    return Response.redirect(buildStatusUrl(`${host}${statusRoute}`, error.message), 302);
  }
}