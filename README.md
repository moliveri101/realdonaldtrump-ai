# realdonaldtrump.ai - Deployment Guide

Complete deployment package for the AI-powered political information tool.

## 📦 What's Included

- ✅ Next.js frontend + backend
- ✅ API routes for Claude AI, web scraping, and Kling video
- ✅ Trump portrait image
- ✅ Complete UI with disclaimers
- ✅ Production-ready code

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites

- Node.js 18+ installed
- Git installed
- Accounts:
  - Anthropic API (for Claude AI)
  - Kling API (already have credentials)
  - Vercel account (free)

### 2. Get Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys
4. Create new key
5. Copy the key (starts with `sk-ant-...`)

### 3. Setup Locally

```bash
# Navigate to the project folder
cd realdonaldtrump-ai-deploy

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and add your Anthropic API key
# (Kling keys are already filled in)
nano .env.local
```

Your `.env.local` should look like:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
KLING_ACCESS_KEY=ATHkKeFAmkbkPNG3PMhRhFetbbYJAkdQ
KLING_SECRET_KEY=Jn3HTtAJ3R99tP8DTyn4ENYK8DRtLBBC
KLING_API_ENDPOINT=https://api.klingai.com/v1
```

### 4. Test Locally

```bash
# Run development server
npm run dev

# Open browser to http://localhost:3000
```

Test all features:
- ✅ Web scraping should work
- ✅ Document upload should work
- ✅ Q&A should work
- ✅ Video generation should work

## 🌐 Deploy to Vercel (Production)

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/realdonaldtrump-ai.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Connect your GitHub
   - Select the repository
   - Click "Deploy"

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add each variable from `.env.local`:
     ```
     ANTHROPIC_API_KEY = sk-ant-your-key-here
     KLING_ACCESS_KEY = ATHkKeFAmkbkPNG3PMhRhFetbbYJAkdQ
     KLING_SECRET_KEY = Jn3HTtAJ3R99tP8DTyn4ENYK8DRtLBBC
     KLING_API_ENDPOINT = https://api.klingai.com/v1
     ```

4. **Redeploy**
   - Click "Deployments" → Latest deployment → "Redeploy"

5. **Done!** Your site is live

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts, then add environment variables in dashboard
```

## 🔧 Configure Custom Domain (realdonaldtrump.ai)

1. In Vercel dashboard → Settings → Domains
2. Add `realdonaldtrump.ai`
3. Follow DNS instructions to point your domain to Vercel
4. Wait for SSL certificate (automatic, ~1 minute)

## 🔐 Security Checklist

Before going live:

- [ ] **ROTATE Kling API Keys** (these were shared publicly in chat)
  - Go to your Kling provider
  - Generate new keys
  - Update in Vercel environment variables

- [ ] Set up rate limiting on Kling account
- [ ] Enable Vercel DDoS protection (automatic)
- [ ] Review Content Security Policy settings
- [ ] Test all features in production

## 📊 Monitoring & Costs

### Vercel Costs
- **Hobby Plan**: FREE
  - 100GB bandwidth/month
  - Unlimited deployments
  - Should be plenty for initial launch

### API Costs

**Anthropic (Claude AI)**
- ~$0.003 per 1K tokens input
- ~$0.015 per 1K tokens output
- Average Q&A: ~$0.02 per question

**Kling (Video Generation)**
- $0.125 - $0.80 per 5-second video
- Only charges when user clicks "Generate Video"

### Example Monthly Costs

**Low traffic** (100 users, 1000 questions, 50 videos):
- Anthropic: ~$20
- Kling: ~$6-40
- Total: ~$26-60/month

**Medium traffic** (1000 users, 10000 questions, 500 videos):
- Anthropic: ~$200
- Kling: ~$60-400
- Total: ~$260-600/month

## 🛠️ Troubleshooting

### Web Search Not Working
- Check Anthropic API key is correct
- Verify API key has web search access
- Check Vercel logs: Dashboard → Functions → Logs

### Video Generation Failing
- Verify Kling API keys are correct
- Check if Kling account has credits
- Kling API endpoint might have changed - update KLING_API_ENDPOINT

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 📝 File Structure

```
realdonaldtrump-ai-deploy/
├── pages/
│   ├── api/
│   │   ├── chat.js       # Claude AI conversations
│   │   ├── search.js     # Web scraping
│   │   └── video.js      # Kling video generation
│   ├── index.js          # Main app
│   └── _app.js           # Next.js app wrapper
├── public/
│   └── trump.jpg         # Avatar image
├── styles/
│   └── globals.css       # Global styles
├── .env.local            # Environment variables (local)
├── .env.example          # Environment template
├── package.json          # Dependencies
├── next.config.js        # Next.js config
└── README.md             # This file
```

## 🔄 Updating the App

```bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Test locally
npm run dev

# Deploy to production
git push
# (Vercel auto-deploys on push)
```

## 📞 Support

Common issues:
1. **API errors**: Check environment variables in Vercel
2. **Build fails**: Check Node version (needs 18+)
3. **Video not generating**: Check Kling credits

## 🎉 You're Done!

Your site should now be live at `realdonaldtrump.ai`

Next steps:
1. Test all features in production
2. Monitor usage and costs
3. Rotate Kling API keys
4. Consider adding Google Analytics
5. Set up error monitoring (Sentry)

---

## Advanced: Adding More Candidates

To create similar sites for other candidates:

1. Copy this deployment
2. Replace `trump.jpg` with candidate photo
3. Update text references to candidate name
4. Deploy to new domain

Same backend works for any political figure!
