// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from '@sendgrid/mail';
import {get} from 'lodash';

export default async function sendEmail(
    {email, inviteId},
    {email: userEmail, name},
    {req}
) {
    let sgResponse;
    const host = get(req, 'headers.host', '');
    const http = host.includes('localhost') ? 'http://' : 'https://';
    const inviteLink = `${http}${host}/user-connections?invitation=${inviteId}`;
    const inviteText = `${name} would like to connect with you on the Lists Master application by The BEhive`;
    const msg = {
        to: email,
        from: 'ot@bsmithstudio.com',
        subject: `${name} has sent you an invitation`,
        text: `${inviteText}... ${inviteLink}`,
        html: `
            <div>
                <p>${inviteText}</p>
                <p>Connect with <a href="${inviteLink}">${name}</a></p>
                <p><a href="${inviteLink}">${inviteLink}</a></p>
            </div>
        `,
    };

    await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    try {
        sgResponse = sgMail.send(msg);
    } catch (error) {
        sgResponse = error;
    }

    return sgResponse;
}
