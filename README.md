# SwiftLoan Uganda — website starter

A responsive website template for an independent Uganda-focused lending business. It is **not affiliated with Numida** and must not be presented as Numida's official website. Use another brand only if you are authorized to represent that company.

## Included
- `index.html` — responsive landing page, loan enquiry form, UGX examples and Uganda +256 phone placeholder
- `netlify/functions/submit-loan.js` — server-side Telegram notification handler
- `netlify.toml` — Netlify configuration

## Publish the website
1. Download and extract this ZIP.
2. Create a private GitHub repository and upload the extracted files while preserving their folders.
3. Sign in at https://www.netlify.com/ and choose **Add new site → Import an existing project**.
4. Connect your GitHub repository and deploy. Netlify will publish the site and make the serverless form endpoint available.
5. Before public launch, replace the sample business name and support email, and add verified business details, a real privacy notice, terms, accurate rates/fees, and any disclosures required in Uganda.

## Connect the form to Telegram
1. Open your Telegram bot and send `/start`.
2. Obtain the destination chat ID for your private chat or group. For a group, add the bot to the group and use the correct group chat ID.
3. In Netlify, open **Site configuration → Environment variables** and add:
   - `TELEGRAM_BOT_TOKEN` = token from @BotFather
   - `TELEGRAM_CHAT_ID` = your destination chat ID
4. Redeploy the site after setting the variables.
5. Test with fake/sample data and confirm the notification arrives in Telegram.

## Security and compliance
- Never put the bot token in `index.html`, GitHub, or any public client-side code. If exposed, revoke it through @BotFather and generate a new one.
- Telegram notifications may expose applicant details to everyone with access to the destination chat. Keep the chat private, limit access, and consider whether Telegram is appropriate for personal data under applicable Ugandan privacy law.
- Do not collect national ID images, bank credentials, passwords, or card details through this starter form.
- Add spam protection/rate limiting, a retention/deletion process, and access controls before accepting real submissions.
- This template is not a legal opinion or confirmation that a business is licensed. Verify the applicable lending authorization and consumer/data-protection requirements in Uganda before offering loans or advertising rates.
