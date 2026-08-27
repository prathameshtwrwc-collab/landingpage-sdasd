# Resend Setup Steps

## Step 1: Verify Domain in Resend

1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter `sdasdhealth.com`
4. Add the DNS records provided by Resend to your domain's DNS settings (through your domain registrar or DNS provider)
5. Wait for verification (usually a few minutes to a few hours)

## Step 2: Update Environment Variables

Set these variables in your production environment (e.g. Vercel):

```
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=no-reply@sdasdhealth.com
RESEND_FROM_NAME=Chronotype Sleep Wellness
```

- `RESEND_API_KEY` — your Resend API key
- `RESEND_FROM_EMAIL` — must use an email from your verified domain (`sdasdhealth.com`)
- `RESEND_FROM_NAME` — display name for outgoing emails

## Step 3: Redeploy

Push the latest code and redeploy your site so the new environment variables take effect.
