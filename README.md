# Autoflare

Autoflare is a declarative lightweight library for dynamic error-driven SQL schema synchronization, and automatic management and implementations of various Cloudflare services and features.

## Installation

To install Autoflare, run the following command in your terminal:

```sh
npm install autoflare
```

## Usage

### Declarative Schema Error-driven Synchronization (Note: Can only create)

```ts
import { AutoFlareD1, SQLColumn, SQLTable, CURRENT_TIMESTAMP } from "autoflare/d1";

let db: AutoFlareD1 = new AutoFlareD1(YOUR_D1_BINDING);

db.tables.set("user", new SQLTable("user", [
    new SQLColumn("id").integer().primaryKey().autoIncrement(),
    new SQLColumn("uid").binary(16).notNull().unique().index(),
    new SQLColumn("username").varchar(32).notNull().unique().index(),
    new SQLColumn("email").varchar(64).notNull().unique().index(),
    new SQLColumn("display_name").varchar(64).notNull(),
    new SQLColumn("hashed_password").varchar(64).notNull(),
    new SQLColumn("email_verified").bit().notNull().default(0),
    new SQLColumn("updated_at").datetime().notNull().default(CURRENT_TIMESTAMP),
    new SQLColumn("created_at").datetime().notNull().default(CURRENT_TIMESTAMP)
]));

const res = await db.exec('SELECT * FROM user WHERE username = ?', [ 'anon' ]);
// Table doesn't exist? It'll be created automatically!
console.log(res.success); // true
```

### Easy MailChannels

```ts
import { sendEmail, type EmailContent, Recipient } from "autoflare";

const htmlContent: EmailContent = {
    type: "text/html", // or "text/plain"
    value: `
        <p>Hi, ${name}!</p>
        <p>We've come to talk to you about your car's extended warranty.</p>
        <p>Just kidding, we're just testing out MailChannels!</p>
        <p>Have a nice day!</p>
    `
};
return await sendEmail(
    [ new Recipient(email, name) ],
    "MailChannels Test Email",
    [ htmlContent ],
    { email: "noreply@your_app.com", name: "YOUR_APP" }
);
```