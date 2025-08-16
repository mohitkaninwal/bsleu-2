# Environment Setup

## ⚠️ Important Security Notice

**NEVER commit `.env` files to version control!** They contain sensitive credentials.

## Setup Instructions

1. **Copy the environment template:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Fill in your actual credentials in `backend/.env`:**
   - Database credentials
   - SendGrid API key (starts with `SG.`)
   - JWT secrets (generate long, random strings)
   - Other API keys as needed

3. **Verify `.env` is in `.gitignore`:**
   - The `.env` file should never appear in `git status`
   - If it does, run: `git rm --cached backend/.env`

## Required Environment Variables

### Database
- `DB_NAME`: PostgreSQL database name
- `DB_USER`: Database username  
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host (usually `localhost`)
- `DB_PORT`: Database port (usually `5432`)

### Email (SendGrid)
- `SENDGRID_API_KEY`: Your SendGrid API key (must start with `SG.`)
- `FROM_EMAIL`: Verified sender email address

### Security
- `JWT_SECRET`: Secret for JWT tokens (generate a long random string)
- `JWT_REFRESH_SECRET`: Secret for refresh tokens
- `ADMIN_INVITE_SECRET`: Secret for admin registration

### Payment (Razorpay)
- `RAZORPAY_KEY_ID`: Your Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay secret key

## Security Best Practices

1. **Use different secrets for each environment** (development, staging, production)
2. **Generate long, random secrets** (at least 32 characters)
3. **Never share credentials** in chat, email, or documentation
4. **Rotate secrets regularly**
5. **Use environment-specific `.env` files**

## If You Accidentally Committed Secrets

1. **Remove from Git history:**
   ```bash
   git rm --cached backend/.env
   git commit -m "Remove .env file from tracking"
   ```

2. **Rotate all exposed credentials immediately**
3. **Push the fix:**
   ```bash
   git push origin main
   ```

## Development vs Production

- **Development**: Use `.env` file
- **Production**: Set environment variables directly on your server/hosting platform
- **Never deploy `.env` files** to production servers
