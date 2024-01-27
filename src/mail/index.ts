const endpoint = 'https://api.mailchannels.net/tx/v1/send';

export interface EmailTo {
    email: string;
    name: string;
}

export interface EmailPersonalization {
    to: EmailTo[];
}

export interface SenderData {
    email: string;
    name: string;
}

export interface EmailContent {
    type: string;
    value: string;
}

export interface Email {
    personalizations: EmailPersonalization[];
    from: SenderData;
    subject: string;
    content: EmailContent[];
}

export const sendEmail = async (to: string[], subject: string, content: EmailContent[], sender: SenderData) => {
    const email: Email = {
        personalizations: [
            {
                to: to.map((email) => ({
                    email,
                    name: email
                }))
            } 
        ],
        from: sender,
        subject,
        content
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
    } else if (response.status === 200) {
        return true;
    } else {
        throw new Error(`MailChannels API returned ${response.status} ${response.statusText}`);
    }
}