const APP_NAME = "TradeFlow";
const APP_URL = "https://stock-market-dev.vercel.app/";
const COMPANY_YEAR = "2026";


export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to ${APP_NAME}</title>
</head>

<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 20px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:10px;border:1px solid #30333A;padding:40px;">

<tr>
<td>
<h1 style="color:#FDD458;margin-bottom:20px;">
Welcome to ${APP_NAME}, {{name}} 👋
</h1>

{{intro}}

<p style="color:#CCDADC;margin-top:25px;">
Here’s what you can do right now:
</p>

<ul style="color:#CCDADC;">
<li>Set up your watchlist</li>
<li>Create price & volume alerts</li>
<li>Track daily market news</li>
</ul>

<div style="text-align:center;margin:35px 0;">
<a href="${APP_URL}" 
style="background:#E8BA40;color:#000;padding:14px 30px;
text-decoration:none;border-radius:8px;font-weight:600;">
Go to Dashboard
</a>
</div>

<p style="color:#6b7280;font-size:14px;text-align:center;margin-top:40px;">
© ${COMPANY_YEAR} ${APP_NAME} <br/>
<a href="${APP_URL}" style="color:#CCDADC;">Visit ${APP_NAME}</a>
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>`;


export const NEWS_SUMMARY_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${APP_NAME} Market News Summary</title>
</head>

<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 20px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:10px;border:1px solid #30333A;padding:40px;">

<tr>
<td>

<h1 style="color:#FDD458;margin-bottom:10px;">
📈 Daily Market Brief
</h1>

<p style="color:#6b7280;margin-bottom:30px;">
{{date}}
</p>

<div style="color:#CCDADC;">
{{newsContent}}
</div>

<div style="text-align:center;margin:35px 0;">
<a href="${APP_URL}" 
style="background:#E8BA40;color:#000;padding:14px 30px;
text-decoration:none;border-radius:8px;font-weight:600;">
Open ${APP_NAME}
</a>
</div>

<p style="color:#6b7280;font-size:14px;text-align:center;margin-top:40px;">
You're receiving this because you subscribed to ${APP_NAME} updates.<br/>
© ${COMPANY_YEAR} ${APP_NAME}
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>c
</body>
</html>`;
