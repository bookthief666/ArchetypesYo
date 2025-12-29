// ============================================================================
// ARCHETYPE CONSTANTS & CONFIGURATION
// ============================================================================

export const ART_STYLES = [
  // CLASSICAL
  {
    id: 'ren_allegory',
    name: 'Renaissance Allegory',
    category: 'classical',
    prompt: 'Renaissance allegorical painting style with idealized human proportions, divine geometry, soft natural light, balanced symmetry, classical drapery, calm sacred expressions, timeless mythic realism.'
  },
  {
    id: 'baroque',
    name: 'High Baroque',
    category: 'classical',
    prompt: 'High Baroque mystical painting style with dramatic chiaroscuro lighting, deep shadows, radiant illumination, emotional intensity, sacred drama, fate-laden atmosphere.'
  },
  {
    id: 'dore',
    name: 'Gustave Doré',
    category: 'classical',
    prompt: 'Monochrome engraved illustration style with epic scale, apocalyptic symbolism, biblical gravity, dramatic contrasts, towering mythic figures, visionary intensity.'
  },
  {
    id: 'medieval',
    name: 'Illuminated Manuscript',
    category: 'classical',
    prompt: 'Medieval illuminated manuscript style with flat sacred perspective, symbolic hierarchy, gold accents, ornamental patterns, devotional clarity.'
  },

  // ESOTERIC
  {
    id: 'hermetic',
    name: 'Hermetic Alchemical',
    category: 'esoteric',
    prompt: 'Hermetic alchemical illustration style with symbolic vessels, celestial correspondences, allegorical figures, sacred geometry, arcane manuscript aesthetics.'
  },
  {
    id: 'crowley',
    name: 'Thelemic / Crowley',
    category: 'esoteric',
    prompt: 'Modern occult symbolism style with bold color fields, abstract sacred forms, erotic mysticism, magical intensity, ritual power.'
  },
  {
    id: 'spare',
    name: 'Austin Osman Spare',
    category: 'esoteric',
    prompt: 'Automatic drawing style with sigil-like linework, subconscious symbolism, raw gestural marks, chaotic yet intentional forms.'
  },

  // 16-BIT / RETRO
  {
    id: 'pixel',
    name: '16-Bit Sovereign',
    category: 'retro',
    prompt: '16-bit pixel art masterpiece, SNES RPG style, deep color palette, isometric perspective, magical aura, detailed sprite work.'
  },
  {
    id: 'zelda',
    name: 'Hylian Legend',
    category: 'retro',
    prompt: 'Fantasy rpg style, cel-shaded pixel art, bright magical colors, golden triangles, ancient ruins, forest atmosphere.'
  },
  {
    id: 'metroid',
    name: 'Biome Alien',
    category: 'retro',
    prompt: 'Sci-fi horror pixel art, Metroid aesthetic, dark alien biology, neon greens and deep blacks, claustrophobic atmosphere.'
  },
  {
    id: 'earthbound',
    name: 'Psychedelic RPG',
    category: 'retro',
    prompt: 'Earthbound style, trippy pixel art, abstract backgrounds, vibrant distorted colors, surreal enemies, quirkiness.'
  },
  {
    id: 'souls',
    name: 'Dark Souls Pixel',
    category: 'retro',
    prompt: 'Dark fantasy pixel art, decaying kingdom, bonfire lighting, heavy armor, muted colors, melancholy atmosphere.'
  },
  {
    id: 'blasphemous',
    name: 'Penitent One',
    category: 'retro',
    prompt: 'Spanish religious horror pixel art, Blasphemous style, intricate gore, gold ornamentation, suffering, high contrast.'
  },
  {
    id: 'chrono',
    name: 'Time Trigger',
    category: 'retro',
    prompt: '90s JRPG masterpiece style, vibrant character sprites, time travel visual effects, steampunk elements, Akira Toriyama influence.'
  },

  // MODERN / SURREAL
  {
    id: 'cyber',
    name: 'Cyber-Occult',
    category: 'modern',
    prompt: 'Cyberpunk tarot card, neon green and purple, glitch artifacts, CRT monitor texture, digital deity, high tech mysticism.'
  },
  {
    id: 'vapor',
    name: 'Vaporwave 95',
    category: 'modern',
    prompt: 'Vaporwave aesthetic, pixelated greek statues, windows 95 UI elements, pastel pink and teal, surreal digital void.'
  },
  {
    id: 'eldritch',
    name: 'Cosmic Horror',
    category: 'modern',
    prompt: 'Lovecraftian pixel art, forbidden colors, non-euclidean geometry, madness, dithering darkness, tentacle motifs.'
  },
  {
    id: 'glitch',
    name: 'Glitch Occultism',
    category: 'modern',
    prompt: 'Digital glitch occult style with corrupted symbols, ritual error, broken reality aesthetics.'
  },
  {
    id: 'fractal',
    name: 'Fractal Geometry',
    category: 'modern',
    prompt: 'Fractal geometry style with infinite recursion, sacred mathematics, archetypal emergence.'
  },
  {
    id: 'sacred_eros',
    name: 'Sacred Eros',
    category: 'esoteric',
    prompt: 'Sacred geometry fused with subtle erotic mysticism, divine sensuality, spiritual embodiment, ritual intimacy.'
  }
];

export const TRADITIONS = [
  {
    id: 'thoth',
    name: 'Book of Thoth',
    desc: 'Crowley & Harris - High Magick',
    color: '#ffd700'
  },
  {
    id: 'rws',
    name: 'Rider-Waite-Smith',
    desc: 'Golden Dawn Standard',
    color: '#9b59b6'
  },
  {
    id: 'marseille',
    name: 'Tarot de Marseille',
    desc: 'Traditional Iconography',
    color: '#e74c3c'
  },
  {
    id: 'hermetic',
    name: 'Hermetic Qabalah',
    desc: 'Tree of Life & Pathworking',
    color: '#3498db'
  },
  {
    id: 'shadow',
    name: 'Jungian Shadow',
    desc: 'Depth Psychology',
    color: '#2c3e50'
  }
];

export const PIXEL_THEMES = {
  gameboy: {
    id: 'gameboy',
    name: 'Game Boy',
    bg: 'bg-[#8bab1e]',
    accent: '#0f380f',
    border: 'border-[#306230]',
    text: 'text-[#0f380f]',
    uiBg: 'bg-[#9bbc0f]/90',
    glow: 'shadow-[4px_4px_0px_#306230]'
  },
  virtual: {
    id: 'virtual',
    name: 'Virtual Boy',
    bg: 'bg-[#000000]',
    accent: '#ff0000',
    border: 'border-[#ff0000]/50',
    text: 'text-red-600',
    uiBg: 'bg-red-950/40',
    glow: 'shadow-[4px_4px_0px_#ff000033]'
  },
  arcade: {
    id: 'arcade',
    name: 'Arcade',
    bg: 'bg-[#0f0524]',
    accent: '#f0abfc',
    border: 'border-fuchsia-500/40',
    text: 'text-fuchsia-300',
    uiBg: 'bg-fuchsia-950/40',
    glow: 'shadow-[4px_4px_0px_#f0abfc33]'
  },
  nes: {
    id: 'nes',
    name: 'NES',
    bg: 'bg-[#2038ec]',
    accent: '#ffffff',
    border: 'border-white/40',
    text: 'text-white',
    uiBg: 'bg-white/10',
    glow: 'shadow-[4px_4px_0px_#ffffff33]'
  }
};

export const TAROT_STRUCTURE = {
  major: 22,
  wands: 14,
  cups: 14,
  swords: 14,
  disks: 14
};

export const API_CONFIG = {
  geminiModel: 'gemini-2.0-flash-exp',
  imagenModel: 'imagen-3.0-generate-001',
  maxRetries: 3,
  retryDelay: 1000,
  rateLimitPerMinute: 15,
  rateLimitPerDay: 1500
};

export const FEATURE_FLAGS = {
  enableErosMode: import.meta.env.VITE_ENABLE_EROS_MODE !== 'false',
  enableAudio: import.meta.env.VITE_ENABLE_AUDIO !== 'false',
  maxDeckSize: parseInt(import.meta.env.VITE_MAX_DECK_SIZE) || 78
};

export const STORAGE_KEYS = {
  tutorialSeen: 'archetype_tutorial_seen',
  savedDeck: 'archetype_deck',
  preferences: 'archetype_preferences',
  audioEnabled: 'archetype_audio_enabled'
};
