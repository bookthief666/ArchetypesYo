// ============================================================================
// ARCHETYPE UTILITIES
// ============================================================================

import { STORAGE_KEYS } from './constants';

// ============================================================================
// LOCAL STORAGE
// ============================================================================

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
};

// Save deck progress
export function saveDeckProgress(author, deck, dossier, portrait, tradition, style) {
  return storage.set(STORAGE_KEYS.savedDeck, {
    author,
    deck,
    dossier,
    portrait,
    tradition,
    style,
    timestamp: Date.now()
  });
}

// Load deck progress
export function loadDeckProgress() {
  return storage.get(STORAGE_KEYS.savedDeck);
}

// Clear deck progress
export function clearDeckProgress() {
  return storage.remove(STORAGE_KEYS.savedDeck);
}

// ============================================================================
// ANALYTICS (Privacy-Friendly)
// ============================================================================

export function trackEvent(eventName, properties = {}) {
  try {
    // Plausible Analytics (if configured)
    if (window.plausible) {
      window.plausible(eventName, { props: properties });
    }

    // Console log in development
    if (import.meta.env.DEV) {
      console.log('📊 Event:', eventName, properties);
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

export function vibrate(pattern = 50) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    console.error('Vibrate error:', error);
  }
}

// ============================================================================
// SHARE API
// ============================================================================

export async function shareContent(title, text, url = window.location.href) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return true;
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${title}\n\n${text}\n\n${url}`);
      return true;
    }
  } catch (error) {
    console.error('Share error:', error);
    return false;
  }
}

// ============================================================================
// FILE DOWNLOAD
// ============================================================================

export function downloadFile(content, filename, mimeType = 'text/html') {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Download error:', error);
    return false;
  }
}

// ============================================================================
// HTML ARCHIVE GENERATION
// ============================================================================

export function generateArchiveHTML(author, deck, dossier, portrait, tradition, style, reading = null, oracleQuestion = null) {
  const cardHTML = deck.map(card => `
    <div class="card">
      <h3>${card.name}</h3>
      ${card.imageUrl ? `<img src="${card.imageUrl}" alt="${card.name}" />` : '<div class="placeholder">Image not generated</div>'}
      <p>${card.exegesis || 'Exegesis not inscribed.'}</p>
      ${card.meta ? `
        <div class="meta">
          ${Object.entries(card.meta).map(([key, value]) => `
            <div class="meta-item">
              <strong>${key}:</strong> ${value}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${author} - ARCHETYPE Grimoire</title>
  <style>
    * { box-sizing: border-box; }
    
    body {
      background: #1a0b2e;
      color: #ffd700;
      font-family: 'Courier New', monospace;
      padding: 40px 20px;
      max-width: 900px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    h1, h2, h3 {
      border-bottom: 3px solid #ffd700;
      padding-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    h1 {
      font-size: 3em;
      text-align: center;
      margin-bottom: 10px;
      text-shadow: 4px 4px 0px #000;
    }
    
    .header {
      text-align: center;
      margin-bottom: 60px;
      padding-bottom: 40px;
      border-bottom: 4px solid #ffd700;
    }
    
    .header p {
      opacity: 0.8;
      font-size: 1.1em;
    }
    
    .portrait {
      max-width: 400px;
      border: 6px solid #ffd700;
      image-rendering: pixelated;
      display: block;
      margin: 30px auto;
      box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.5);
    }
    
    .dossier {
      background: rgba(0, 0, 0, 0.3);
      border: 3px solid #ffd700;
      padding: 30px;
      margin: 40px 0;
      box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    }
    
    .oracle-section {
      background: rgba(45, 27, 78, 0.4);
      border: 3px solid #9b59b6;
      padding: 30px;
      margin: 40px 0;
      box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    }
    
    .oracle-section h2 {
      border-bottom-color: #9b59b6;
      color: #9b59b6;
    }
    
    .card {
      border: 2px solid #ffd700;
      padding: 30px;
      margin-bottom: 40px;
      background: rgba(0, 0, 0, 0.3);
      box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
    }
    
    .card h3 {
      font-size: 1.5em;
      margin-top: 0;
    }
    
    .card img, .placeholder {
      max-width: 100%;
      max-height: 500px;
      border: 4px solid #ffd700;
      image-rendering: pixelated;
      display: block;
      margin: 20px auto;
    }
    
    .placeholder {
      background: rgba(0, 0, 0, 0.5);
      padding: 40px;
      text-align: center;
      opacity: 0.5;
    }
    
    .meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #555;
    }
    
    .meta-item {
      background: rgba(255, 215, 0, 0.05);
      border: 1px solid rgba(255, 215, 0, 0.2);
      padding: 12px;
      font-size: 0.9em;
    }
    
    .meta-item strong {
      text-transform: uppercase;
      font-size: 0.8em;
      opacity: 0.7;
      display: block;
      margin-bottom: 5px;
    }
    
    .footer {
      text-align: center;
      margin-top: 80px;
      padding-top: 40px;
      border-top: 2px solid #ffd700;
      opacity: 0.6;
      font-size: 0.9em;
    }
    
    @media print {
      body { background: white; color: black; }
      .card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${author}</h1>
    <p>${style.name} // ${tradition.name}</p>
    <p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  ${portrait ? `<img src="${portrait}" alt="${author} Portrait" class="portrait" />` : ''}

  <h2>Dossier</h2>
  <div class="dossier">
    <p>${dossier}</p>
  </div>

  ${reading && oracleQuestion ? `
    <div class="oracle-section">
      <h2>Oracle Reading</h2>
      <p><strong>Question:</strong> ${oracleQuestion}</p>
      <p><strong>Cards:</strong> ${reading.cards.map(c => c.name).join(', ')}</p>
      <p>${reading.answer}</p>
    </div>
  ` : ''}

  <h2>Arcanum (${deck.length} Cards)</h2>
  ${cardHTML}

  <div class="footer">
    <p>ARCHETYPE • AI-Powered Tarot Generator</p>
    <p>Generated with Gemini & Imagen • ${new Date().getFullYear()}</p>
  </div>
</body>
</html>`;
}

// ============================================================================
// DEBOUNCE
// ============================================================================

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================================================
// FORMAT DATE
// ============================================================================

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// ============================================================================
// REDUCE MOTION CHECK
// ============================================================================

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
