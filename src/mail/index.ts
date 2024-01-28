const endpoint = 'https://api.mailchannels.net/tx/v1/send';

export class Recipient {
    constructor(public email: string, public name?: string) { }
}

export interface EmailPersonalization {
    to: Recipient[];
}

export interface SenderData {
    email: string;
    name: string;
}

export interface EmailContent {
    type: string; // Example: "text/plain" or "text/html"
    value: string;
}

export interface Email {
    personalizations: EmailPersonalization[];
    from: SenderData;
    subject: string;
    content: EmailContent[];
}

export interface EmailDKIM {
    dkim_domain: string;
    dkim_private_key: string;
    dkim_selector: string;
}

export const sendEmail = async (to: Recipient[], subject: string, content: EmailContent[], sender: SenderData, dkimConfig?: EmailDKIM) => {
    const email: Email = {
        personalizations: [
            {
                to: to
            } 
        ],
        from: sender,
        subject: subject,
        content: content
    };
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            /* No need for Authorization since we're sending from a verified sender: Cloudflare */
        },
        body: JSON.stringify(email)
    });

    if (response.status === 401) {
        throw new Error(`MailChannels API returned 401 Unauthorized. Are you sending from a Cloudflare IP?`);
    } else if (response.status >= 200 && response.status < 300) {
        return true;
    } else {
        throw new Error(`MailChannels API returned ${response.status} ${response.statusText}`);
    }
}

export const sendSingleEmail = async (to: Recipient, subject: string, content: EmailContent[], sender: SenderData, dkimConfig?: EmailDKIM) => {
    return await sendEmail([to], subject, content, sender, dkimConfig);
}