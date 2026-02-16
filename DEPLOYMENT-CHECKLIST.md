# 🚀 Deployment Checklist for realdonaldtrump.ai

## Pre-Deployment

### API Keys
- [ ] Obtained Anthropic API key from https://console.anthropic.com/
- [ ] Have Kling API credentials ready (included in .env.local)
- [ ] **IMPORTANT**: Plan to rotate Kling keys after testing (they were shared publicly)

### Local Setup
- [ ] Node.js 18+ installed
- [ ] Ran `npm install` successfully
- [ ] Created `.env.local` with Anthropic API key
- [ ] Tested locally with `npm run dev`
- [ ] Confirmed web scraping works
- [ ] Confirmed Q&A works
- [ ] Confirmed video generation works (if you have Kling credits)

## Deployment to Vercel

### GitHub Setup
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Repository is accessible

### Vercel Setup
- [ ] Created Vercel account
- [ ] Imported project from GitHub
- [ ] Added all environment variables:
  - [ ] ANTHROPIC_API_KEY
  - [ ] KLING_ACCESS_KEY
  - [ ] KLING_SECRET_KEY
  - [ ] KLING_API_ENDPOINT
- [ ] First deployment successful
- [ ] Site is accessible via Vercel URL

### Domain Configuration
- [ ] Added `realdonaldtrump.ai` in Vercel Domains settings
- [ ] Updated DNS records at domain registrar
- [ ] SSL certificate issued (automatic)
- [ ] Site accessible via realdonaldtrump.ai

## Post-Deployment

### Security
- [ ] **ROTATED Kling API keys** (critical!)
- [ ] Updated environment variables with new Kling keys
- [ ] Tested all features with new keys
- [ ] Enabled Vercel password protection (optional, during beta)

### Testing
- [ ] Tested disclaimer screen
- [ ] Tested document upload
- [ ] Tested web scraping
- [ ] Tested Q&A conversations
- [ ] Tested video generation
- [ ] Tested on mobile devices
- [ ] Tested on different browsers

### Monitoring
- [ ] Set up budget alerts for Anthropic API usage
- [ ] Set up budget alerts for Kling API usage
- [ ] Reviewed Vercel analytics
- [ ] Set up error monitoring (optional: Sentry)

### Legal & Compliance
- [ ] Reviewed all disclaimers
- [ ] Confirmed sources are cited properly
- [ ] Verified educational purpose messaging is clear
- [ ] Consulted legal counsel if needed

## Launch

### Soft Launch
- [ ] Shared with small test group
- [ ] Gathered feedback
- [ ] Fixed any critical issues
- [ ] Monitored API costs

### Public Launch
- [ ] Announced on social media
- [ ] Prepared for traffic spike
- [ ] Monitoring costs closely
- [ ] Ready to scale if needed

## Ongoing Maintenance

### Weekly
- [ ] Check API usage and costs
- [ ] Review any error logs
- [ ] Test all features still working

### Monthly
- [ ] Review and update web sources
- [ ] Check for any security updates
- [ ] Rotate API keys (security best practice)
- [ ] Analyze usage patterns

### As Needed
- [ ] Update to latest dependencies
- [ ] Add new features based on feedback
- [ ] Expand to other candidates (optional)

---

## Emergency Contacts

- Vercel Support: https://vercel.com/support
- Anthropic Support: support@anthropic.com
- Your Kling API Provider: [Add contact info]

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel

# Check logs
vercel logs

# Pull latest from GitHub
git pull && npm install
```

---

**Date Completed**: _______________

**Deployed By**: _______________

**Production URL**: realdonaldtrump.ai

**Status**: [ ] In Development [ ] Testing [ ] Live
