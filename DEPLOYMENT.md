# 🚀 ARCHETYPE Deployment Guide

This guide will walk you through deploying ARCHETYPE to production. Choose your platform and follow the steps.

## 📋 Pre-Deployment Checklist

- [ ] Get Google Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Test locally with `npm run dev`
- [ ] Verify `.env` is in `.gitignore` (it is by default)
- [ ] Optional: Set up custom domain
- [ ] Optional: Configure analytics

---

## 🟢 Method 1: Vercel (Recommended - 5 minutes)

**Why Vercel?**
- Free tier available
- Automatic HTTPS
- Global CDN
- GitHub integration
- Zero config needed

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/archetype.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects Vite config
   - Add environment variable:
     - Key: `VITE_GEMINI_API_KEY`
     - Value: `your_actual_api_key_here`
   - Click **Deploy**

3. **Done!** Your app will be live at `https://your-project.vercel.app`

4. **Optional: Custom Domain**
   - Project Settings → Domains
   - Add your domain
   - Update DNS records as instructed

---

## 🔵 Method 2: Netlify (Alternative - 5 minutes)

### Steps:

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Add Environment Variables**
   - Site Settings → Environment Variables
   - Add `VITE_GEMINI_API_KEY`

4. **Or deploy via GitHub**
   - Connect your repo at https://app.netlify.com/
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable

---

## ☁️ Method 3: Cloudflare Pages (Free & Fast)

### Steps:

1. **Push to GitHub** (if not already)

2. **Deploy to Cloudflare Pages**
   - Go to https://dash.cloudflare.com/
   - Pages → Create a project
   - Connect GitHub repo
   - Build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Root directory: `/`
   - Environment variables:
     - `VITE_GEMINI_API_KEY`: your key

3. **Deploy** - Live in ~2 minutes!

---

## 🐙 Method 4: GitHub Pages (Free Hosting)

### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/archetype"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Repository Settings → Pages
   - Source: Deploy from branch `gh-pages`

**Note:** Environment variables must be hardcoded for GitHub Pages (not recommended for sensitive keys). Consider other options.

---

## 🔧 Method 5: Self-Hosted (Advanced)

### Requirements:
- VPS or server (DigitalOcean, AWS, etc.)
- Node.js 18+
- Nginx or Apache

### Steps:

1. **Build Production Bundle**
   ```bash
   npm run build
   ```

2. **Upload `dist` folder** to your server

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/archetype/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Enable gzip
       gzip on;
       gzip_types text/plain text/css application/json application/javascript;
   }
   ```

4. **SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

5. **Environment Variables**
   - Hardcode in build OR
   - Use server-side env injection

---

## 🌐 Environment Variables

All platforms need these environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `VITE_ENABLE_EROS_MODE` | ❌ No | Enable Sacred Eros (default: true) |
| `VITE_ENABLE_AUDIO` | ❌ No | Enable audio controller (default: true) |
| `VITE_MAX_DECK_SIZE` | ❌ No | Max cards to generate (default: 78) |

### ⚠️ Security Note

NEVER commit your `.env` file to Git. The `.gitignore` is already configured, but double-check:

```bash
git status
# .env should NOT appear in untracked files
```

---

## 📊 Analytics (Optional)

### Plausible Analytics (Privacy-Friendly)

1. Sign up at https://plausible.io
2. Add your domain
3. Update `index.html`:
   ```html
   <script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
   ```

### Google Analytics

```html
<!-- Add to index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎨 Custom Domain

### Vercel
1. Project Settings → Domains
2. Add domain
3. Update DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify
1. Domain Settings → Add custom domain
2. Update DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### Cloudflare
- Automatic if domain is on Cloudflare!

---

## 🐛 Troubleshooting

### "API key missing" error
- Ensure `VITE_GEMINI_API_KEY` is set in platform settings
- Restart build after adding env vars
- Check spelling (must start with `VITE_`)

### Images not loading
- Check API quota limits
- Verify network tab for 403/429 errors
- Ensure `https://` in all API calls

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on refresh (SPA routing)
- Ensure server redirects all routes to `/index.html`
- Vercel/Netlify handle this automatically
- For Nginx, use the config above

---

## 📈 Performance Optimization

### 1. Image Optimization
- Images are base64 (already optimized for storage)
- Consider CDN for heavy usage

### 2. Code Splitting
- Already configured in `vite.config.js`
- Chunks: React, Framer Motion, Lucide

### 3. Caching
```html
<!-- Add to index.html -->
<meta http-equiv="cache-control" content="public, max-age=31536000, immutable">
```

### 4. Lazy Loading
- Card images load on-demand
- Virtual scrolling for 78-card deck

---

## 🔐 Security Best Practices

1. **Never expose API keys client-side**
   - For production, consider proxy server
   - Or use Vercel Edge Functions / Netlify Functions

2. **Rate Limiting**
   - Built-in UI warnings for rate limits
   - Monitor API usage in Google Cloud Console

3. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' 'unsafe-inline' https://plausible.io; 
                  connect-src 'self' https://generativelanguage.googleapis.com;
                  img-src 'self' data: blob:;">
   ```

---

## 📱 PWA (Progressive Web App)

Already configured! Users can:
- Install to home screen
- Use offline (with cached data)
- Get app-like experience

To test:
1. Deploy to HTTPS domain
2. Open in Chrome
3. Address bar → Install icon

---

## 🎯 Production Checklist

- [ ] API key configured
- [ ] Test all features in production
- [ ] Custom domain added (optional)
- [ ] Analytics installed (optional)
- [ ] PWA tested on mobile
- [ ] Error monitoring set up (Sentry)
- [ ] Performance tested (Lighthouse)
- [ ] SEO meta tags verified
- [ ] Social sharing tested

---

## 🆘 Support

- **Issues:** https://github.com/yourusername/archetype/issues
- **Email:** your@email.com
- **Twitter:** @yourhandle

---

**Made with 🖤 by Bookthief**

*May your Tarot decks be ever esoteric and your API calls never rate-limited.* 🔮
