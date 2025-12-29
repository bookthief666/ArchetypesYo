# 🔮 ARCHETYPE

**AI-Powered Esoteric Tarot Deck Generator**

Generate personalized 78-card Tarot decks with custom artwork for any subject, author, or entity using Google's Gemini and Imagen APIs. Combines mystical traditions with cutting-edge generative AI.

![ARCHETYPE Preview](./preview.png)

## ✨ Features

- **Complete 78-Card Decks**: Major Arcana + 56 Minor Arcana with custom artwork
- **Multiple Art Styles**: 20+ styles from Renaissance to Cyberpunk to 16-bit pixel art
- **Tarot Traditions**: Thoth, Rider-Waite-Smith, Marseille, Hermetic Qabalah, Jungian Shadow
- **Oracle Readings**: 3-card spreads with AI-powered interpretations
- **Sacred Eros Mode**: Optional exploration of divine sensuality and mysticism
- **Export Options**: Download complete decks as HTML grimoires
- **Ambient Audio**: Generative mystical soundscapes using Web Audio API
- **Responsive Design**: Optimized for desktop and mobile (especially Samsung Fold)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one free](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone or download the project
cd archetype-production

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Production Build

```bash
npm run build
# Output will be in ./dist folder
```

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variable: `VITE_GEMINI_API_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Add `VITE_GEMINI_API_KEY` in Netlify dashboard → Site settings → Environment variables

### Other Platforms

The app is a static SPA - deploy the `dist` folder anywhere:
- GitHub Pages
- Cloudflare Pages  
- AWS S3 + CloudFront
- Your own hosting

## 🎨 Customization

### Add New Art Styles

Edit `src/lib/constants.js`:

```javascript
{
  id: 'my_style',
  name: 'My Custom Style',
  prompt: 'Detailed art style description for Imagen...'
}
```

### Modify Tarot Traditions

Edit `src/lib/constants.js` → `TRADITIONS` array

### Change Color Themes

Edit `src/styles/themes.js` for pixel art console themes

### Adjust API Behavior

Modify prompts in `src/lib/api.js` for different interpretations

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `VITE_ENABLE_EROS_MODE` | ❌ No | Enable Sacred Eros mode (default: true) |
| `VITE_ENABLE_AUDIO` | ❌ No | Enable ambient audio (default: true) |
| `VITE_MAX_DECK_SIZE` | ❌ No | Max cards to generate (default: 78) |

### API Limits

Google Gemini free tier:
- 15 requests per minute
- 1,500 requests per day
- Rate limiting UI warns users automatically

Consider upgrading to paid tier for production use.

## 📱 Mobile Optimization

Optimized for:
- Samsung Galaxy Z Fold5 (and other foldables)
- iPhone 14/15 series
- Android tablets
- Touch gestures and haptic feedback

## ♿ Accessibility

- Full keyboard navigation
- ARIA labels on all interactive elements
- Screen reader compatible
- Respects `prefers-reduced-motion`
- High contrast mode support

## 🐛 Troubleshooting

**"API key missing" error**
- Ensure `.env` file exists with valid `VITE_GEMINI_API_KEY`
- Restart dev server after adding environment variables

**Images not generating**
- Check API quota limits
- Verify network connection
- Some prompts may be filtered - app will retry with safer alternatives

**Slow performance**
- Enable virtualization for large decks (automatic for 78 cards)
- Clear browser cache
- Check Network tab for failed requests

## 📄 License

MIT License - See LICENSE file

## 🙏 Credits

- Tarot wisdom: Aleister Crowley, Arthur Edward Waite, Pamela Colman Smith
- AI: Google Gemini & Imagen
- Icons: Lucide React
- Animations: Framer Motion

## 🔮 Philosophy

> "Do what thou wilt shall be the whole of the Law. Love is the law, love under will."

ARCHETYPE bridges ancient mystical traditions with cutting-edge AI, allowing anyone to create personalized divinatory systems. Whether exploring Thelemic magick, Jungian archetypes, or your own unique spiritual framework, this tool empowers deep symbolic work.

---

**Made with 🖤 by Bookthief**

For support: [GitHub Issues](https://github.com/yourusername/archetype/issues)
