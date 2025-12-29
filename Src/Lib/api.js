// ============================================================================
// ARCHETYPE API LAYER
// ============================================================================

import { API_CONFIG } from './constants';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export class APIError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}

// Check if API key is configured
export function checkAPIKey() {
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new APIError(
      'Gemini API key not configured',
      'MISSING_API_KEY',
      'Please add VITE_GEMINI_API_KEY to your .env file'
    );
  }
}

// Exponential backoff retry logic
async function retryWithBackoff(fn, retries = API_CONFIG.maxRetries) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      const delay = API_CONFIG.retryDelay * Math.pow(2, i);
      console.warn(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Fetch from Gemini API
export async function fetchGemini(prompt, isJson = true) {
  checkAPIKey();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${API_CONFIG.geminiModel}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: isJson ? { 
      responseMimeType: "application/json",
      temperature: 0.9,
      topP: 0.95
    } : {
      temperature: 0.9,
      topP: 0.95
    }
  };

  return retryWithBackoff(async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new APIError(
          'Rate limit exceeded',
          'RATE_LIMIT',
          'Please wait a moment before trying again'
        );
      }
      
      if (response.status === 403) {
        throw new APIError(
          'API key invalid or expired',
          'INVALID_KEY',
          'Please check your VITE_GEMINI_API_KEY'
        );
      }

      throw new APIError(
        `API request failed: ${response.status}`,
        'REQUEST_FAILED',
        errorData.error?.message || 'Unknown error'
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new APIError(
        'Invalid API response',
        'INVALID_RESPONSE',
        'No text content in response'
      );
    }

    return isJson ? JSON.parse(text) : text;
  });
}

// Fetch from Imagen API
export async function fetchImagen(prompt) {
  checkAPIKey();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${API_CONFIG.imagenModel}:generateImages?key=${apiKey}`;

  const attemptGeneration = async (modifiedPrompt) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: modifiedPrompt,
        number_of_images: 1,
        aspect_ratio: "3:4",
        safety_filter_level: "block_some",
        person_generation: "allow_adult"
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new APIError(
        'Image generation failed',
        'IMAGE_GEN_FAILED',
        data.error.message
      );
    }

    if (!data.generated_images?.[0]?.image?.image_bytes) {
      throw new APIError(
        'No image in response',
        'NO_IMAGE',
        'Image generation returned empty result'
      );
    }

    return `data:image/png;base64,${data.generated_images[0].image.image_bytes}`;
  };

  return retryWithBackoff(async () => {
    try {
      // Try with full prompt first
      return await attemptGeneration(prompt);
    } catch (error) {
      // If blocked by safety filter, try simplified prompt
      if (error.details?.includes('BLOCKED') || error.details?.includes('safety')) {
        console.warn('Safety filter triggered, trying safer prompt...');
        const safePrompt = `16-bit pixel art style, mystical tarot card, symbolic imagery, ${prompt.split(',')[0]}`;
        return await attemptGeneration(safePrompt);
      }
      throw error;
    }
  });
}

// Generate ritual dossier and card list
export async function generateRitualDossier(author, tradition, style, isErotic = false) {
  const eroticContext = isErotic 
    ? "Focus on the esoteric nature of desire, the union of opposites, and the sacred erotic."
    : "";

  const prompt = `
Role: Supreme Adept of the ${tradition.name}.

Task: Synthesize the essence of "${author}" into a profound Tarot system.

Reference: Draw deeply from 'Secrets of the Thoth Tarot' by Marcus Katz, 'The Book of Thoth' by Aleister Crowley, '777', and the Golden Dawn materials.

Context: The visual style chosen is: ${style.name}.

Instructions:
1. Write a 200-word Academic & Esoteric Thesis (Dossier) analyzing the subject's spiritual weight, archetypal essence, and relationship to the Mysteries.
2. List 78 Card Names that fuse the subject's essence with traditional Tarot archetypes:
   - 22 Major Arcana (0-XXI)
   - 14 Suit of Wands (Ace through King)
   - 14 Suit of Cups (Ace through King)
   - 14 Suit of Swords (Ace through King)
   - 14 Suit of Disks/Pentacles (Ace through King)
3. Maintain scholarly, high-magic language. Avoid gaming or casual slang.
4. Ensure each card name is unique, evocative, and resonant with both the subject and Tarot tradition.

${eroticContext}

Return ONLY valid JSON in this exact format:
{
  "dossier": "string (200 words)",
  "cards": ["Card Name 1", "Card Name 2", ... ] (exactly 78 strings)
}
`;

  return await fetchGemini(prompt, true);
}

// Generate single card exegesis
export async function generateCardData(card, author, tradition, style, isErotic = false) {
  const eroticContext = isErotic
    ? "Explore the carnal and ecstatic aspects of this card."
    : "";
  
  const eroticPrompt = isErotic
    ? "erotic art, sensual, nudity, divine eros, intimacy"
    : "";

  const prompt = `
Role: Grand Master of ${tradition.name}.

Task: Provide a definitive esoteric exegesis for the Tarot card "${card.name}" as it relates to "${author}".

Sources: Thoth Tarot (Crowley/Harris), Hermetic Qabalah, Astrological correspondences, 'Secrets of the Thoth Tarot', Golden Dawn teachings.

Instructions:
- Exegesis: Write a 200-word profound analysis including:
  * The card's Formula (magical principle)
  * Path on the Tree of Life (if applicable)
  * Aeonic significance
  * Divinatory meanings (upright/reversed)
  * Relationship to ${author}'s essence
  
- Meta: Provide accurate correspondences:
  * Hebrew Letter (if Major Arcana)
  * Astrological Ruler/Decan (planet, sign, or decan)
  * Alchemical Stage (Nigredo, Albedo, Citrinitas, Rubedo, etc.)
  * Associated Daimon/Spirit/Intelligence from grimoire tradition
  * Gematria value (if applicable, otherwise use 0)
  
- Visual: Create a detailed visual description for art generation compatible with the ${style.name} aesthetic. Include composition, symbolism, colors, mood.

${eroticContext}

Return ONLY valid JSON:
{
  "exegesis": "string (200 words)",
  "meta": {
    "hebrew": "string or null",
    "planet": "string",
    "alchemical": "string",
    "daimon": "string",
    "gematria": number
  },
  "visual": "string (detailed visual description)"
}
`;

  const data = await fetchGemini(prompt, true);
  
  // Generate image
  const imagePrompt = `16-bit pixel art tarot card "${card.name}". ${data.visual}. ${style.prompt}. ${eroticPrompt}. Masterpiece, dramatic lighting, high detail.`;
  
  const imageUrl = await fetchImagen(imagePrompt);

  return {
    ...card,
    ...data,
    imageUrl
  };
}

// Generate portrait
export async function generatePortrait(author, style, isErotic = false) {
  const eroticPrompt = isErotic
    ? "sensual, artistic nude, divine eros"
    : "";

  const prompt = `16-bit pixel art portrait of ${author}. ${style.prompt}. ${eroticPrompt}. Masterpiece, dramatic lighting, detailed sprite work, mystical aura.`;
  
  return await fetchImagen(prompt);
}

// Generate oracle reading
export async function generateOracleReading(question, cards, author, tradition, isErotic = false) {
  const eroticContext = isErotic
    ? "Interpret through the lens of Sacred Eros and divine union."
    : "";

  const prompt = `
Role: The Oracle of ${author}, speaking through the ${tradition.name} tradition.

Query: "${question}"

Cards Drawn: ${cards.map(c => c.name).join(', ')}

Task: Synthesize a 300-word divinatory answer that:
- Addresses the question directly using the drawn cards
- Employs Elemental Dignities (how cards interact)
- References Qabalistic correspondences
- Provides practical guidance alongside mystical insight
- Maintains the voice and essence of ${author}

${eroticContext}

Return ONLY valid JSON:
{
  "answer": "string (300 words)"
}
`;

  return await fetchGemini(prompt, true);
}
