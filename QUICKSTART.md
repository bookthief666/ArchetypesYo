# 🚀 QUICK START - ARCHETYPE

Get ARCHETYPE running in 3 minutes!

## Step 1: Install Dependencies

```bash
cd archetype-production
npm install
```

## Step 2: Configure API Key

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your Gemini API key
# Get one FREE at: https://aistudio.google.com/app/apikey
```

Your `.env` should look like:
```
VITE_GEMINI_API_KEY=AIzaSyC...your_actual_key_here
```

## Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

---

## 🎯 First Time Using?

1. Enter a subject (e.g., "David Bowie", "Quantum Physics", "Your Name")
2. Select a Tarot tradition
3. Browse art styles in the menu
4. Click "INITIATE RITUAL"
5. Wait ~30 seconds for AI generation
6. Explore your personalized 78-card deck!

---

## 📦 Build for Production

```bash
npm run build
```

The `dist/` folder contains your production build.

---

## 🌐 Deploy to Vercel (Easiest)

1. Push to GitHub
2. Go to https://vercel.com/new
3. Import your repo
4. Add `VITE_GEMINI_API_KEY` environment variable
5. Deploy!

See DEPLOYMENT.md for detailed guides for all platforms.

---

## 🎨 Customization

- **Art Styles:** Edit `src/lib/constants.js` → `ART_STYLES`
- **Traditions:** Edit `src/lib/constants.js` → `TRADITIONS`
- **Colors:** Edit `src/index.css` and `tailwind.config.js`
- **Prompts:** Edit `src/lib/api.js`

---

## ⚙️ Features

✅ 78-card complete Tarot decks  
✅ 20+ art styles (Renaissance to Cyberpunk)  
✅ Multiple Tarot traditions  
✅ 3-card Oracle readings  
✅ Sacred Eros mode (optional)  
✅ Ambient generative audio  
✅ Export as HTML grimoires  
✅ Mobile-optimized (Samsung Fold, iPhone)  
✅ Keyboard shortcuts (Esc, ?)  
✅ Auto-save progress  
✅ Share functionality  
✅ PWA support  

---

## 📁 Project Structure

```
archetype-production/
├── src/
│   ├── components/          # React components
│   │   ├── UI.jsx          # Reusable UI components
│   │   ├── Views.jsx       # App views/screens
│   │   ├── AudioController.jsx
│   │   └── SacredGeometry.jsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core logic
│   │   ├── api.js         # Gemini/Imagen API
│   │   ├── constants.js   # Config & data
│   │   └── utils.js       # Utilities
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry
│   └── index.css          # Global styles
├── public/                # Static assets
├── .env.example          # Environment template
├── package.json          # Dependencies
├── vite.config.js        # Build config
└── README.md             # Full documentation
```

---

## 🐛 Troubleshooting

**"API key missing" error?**
- Make sure `.env` file exists
- Verify `VITE_GEMINI_API_KEY` is set
- Restart dev server: `npm run dev`

**Images not generating?**
- Check API quota (15 requests/min, 1500/day free tier)
- Wait a moment and try again
- Check browser console for errors

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🆘 Need Help?

- 📖 Full docs: `README.md`
- 🚀 Deployment: `DEPLOYMENT.md`
- 🐛 Issues: Create GitHub issue
- 📧 Email: your@email.com

---

**You're ready to go! May your decks be mystical.** 🔮✨
