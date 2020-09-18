// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from '@sendgrid/mail';
import {get} from 'lodash';

export default async function sendEmail(
    {email, inviteId, groupName},
    {email: userEmail, name},
    {req}
) {
    let sgResponse;
    const host = get(req, 'headers.host', '');
    const http = host.includes('localhost') ? 'http://' : 'https://';
    const groupLink = `${http}${host}/join-group/${inviteId}`;
    const inviteText = `${name} is inviting you to join their group on the Lists Master application by The BEhive`;
    const msg = {
        to: email,
        from: 'ot@bsmithstudio.com',
        subject: `${name} has sent you an invitation`,
        text: `${inviteText}... ${groupLink}`,
        html: `
            <div>
                <p>${inviteText}</p>
                <p>Join the <a href="${groupLink}">${groupName} from ${name}</a></p>
                <p><a href="${groupLink}">${groupLink}</a></p>
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
