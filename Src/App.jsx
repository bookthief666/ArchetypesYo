// ============================================================================
// ARCHETYPE - Main Application (FIXED FOR PRODUCTION)
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { ErrorBoundary, PixelButton, LoadingSpinner, ErrorMessage, ProgressBar } from './components/UI';
import { 
  Header, SideMenu, LandingView, RitualView, ScriptoriumView, 
  OracleView, CardDetailModal 
} from './components/Views';
import AudioController from './components/AudioController';
import SacredGeometry from './components/SacredGeometry';

// API & Utils
import {
  checkAPIKey,
  APIError,
  generateRitualDossier,
  generateCardData,
  generatePortrait,
  generateOracleReading
} from './lib/api';
import { ART_STYLES, TRADITIONS } from './lib/constants';
import {
  saveDeckProgress,
  loadDeckProgress,
  clearDeckProgress,
  trackEvent,
  shareContent,
  downloadFile,
  generateArchiveHTML,
  vibrate
} from './lib/utils';

// Hooks
import { useLocalStorage, useKeyboard, useLockScroll } from './hooks';

// Storage keys
const STORAGE_KEYS = {
  tutorialSeen: 'archetype_tutorial_seen'
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  // State
  const [view, setView] = useState('landing');
  const [author, setAuthor] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(ART_STYLES[0]);
  const [selectedTradition, setSelectedTradition] = useState(TRADITIONS[0]);
  const [isErotic, setIsErotic] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useLocalStorage(STORAGE_KEYS.tutorialSeen, false);

  // Deck data
  const [dossier, setDossier] = useState(null);
  const [deck, setDeck] = useState([]);
  const [portrait, setPortrait] = useState(null);
  const [focusedCard, setFocusedCard] = useState(null);

  // Oracle
  const [oracleQuestion, setOracleQuestion] = useState('');
  const [reading, setReading] = useState(null);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [archiveProgress, setArchiveProgress] = useState({ current: 0, total: 0 });
  const [isArchiving, setIsArchiving] = useState(false);

  // Lock scroll when modal open
  useLockScroll(isMenuOpen || focusedCard !== null || isArchiving);

  // Keyboard shortcuts
  useKeyboard({
    Escape: () => {
      if (focusedCard) setFocusedCard(null);
      else if (isMenuOpen) setIsMenuOpen(false);
      else if (view !== 'landing') setView('landing');
    }
  });

  // Load saved progress on mount
  useEffect(() => {
    try {
      checkAPIKey();
    } catch (err) {
      setError({
        title: 'Configuration Error',
        message: err.message,
        details: err.details
      });
    }

    const saved = loadDeckProgress();
    if (saved && saved.timestamp && Date.now() - saved.timestamp < 86400000) { // 24 hours
      const shouldRestore = window.confirm(
        `Found a saved deck for "${saved.author}". Restore it?`
      );
      if (shouldRestore) {
        setAuthor(saved.author);
        setDeck(saved.deck);
        setDossier(saved.dossier);
        setPortrait(saved.portrait);
        setSelectedTradition(saved.tradition);
        setSelectedStyle(saved.style);
        setView('scriptorium');
        trackEvent('deck_restored');
      }
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (deck.length > 0 && dossier) {
      saveDeckProgress(author, deck, dossier, portrait, selectedTradition, selectedStyle);
    }
  }, [deck, dossier, portrait, author, selectedTradition, selectedStyle]);

  // ============================================================================
  // RITUAL EXECUTION
  // ============================================================================

  const runRitual = async () => {
    if (!author.trim()) return;

    setView('ritual');
    setIsLoading(true);
    setLoadingMessage('INVOKING HIGH ARCANUM...');
    setError(null);

    try {
      trackEvent('ritual_started', { author, style: selectedStyle.id, tradition: selectedTradition.id });

      const result = await generateRitualDossier(author, selectedTradition, selectedStyle, isErotic);

      setDossier(result.dossier);
      setDeck(result.cards.map((name, i) => ({ id: i, name, imageUrl: null })));

      setLoadingMessage('MANIFESTING PORTRAIT...');
      const portraitUrl = await generatePortrait(author, selectedStyle, isErotic);
      setPortrait(portraitUrl);

      trackEvent('ritual_completed');
      setView('scriptorium');
    } catch (err) {
      console.error('Ritual error:', err);
      setError({
        title: err instanceof APIError ? err.code : 'Ritual Failed',
        message: err.message || 'The arcane connection has been severed',
        details: err.details || err.stack
      });
      trackEvent('ritual_failed', { error: err.code });
      setTimeout(() => setView('landing'), 5000);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // ============================================================================
  // CARD DETAIL GENERATION
  // ============================================================================

  const forgeCardDetail = async (card) => {
    if (card.exegesis && card.imageUrl) {
      setFocusedCard(card);
      return;
    }

    setFocusedCard(card);
    setIsLoading(true);

    try {
      trackEvent('card_forge_started', { card: card.name });
      const fullCard = await generateCardData(card, author, selectedTradition, selectedStyle, isErotic);

      setDeck(prev => prev.map(c => (c.id === card.id ? fullCard : c)));
      setFocusedCard(fullCard);
      trackEvent('card_forge_completed');
    } catch (err) {
      console.error('Card forge error:', err);
      setError({
        title: 'Forging Failed',
        message: err.message || 'Could not generate card details',
        details: err.details
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // ORACLE READING
  // ============================================================================

  const castOracle = async () => {
    if (!oracleQuestion.trim()) return;

    setIsLoading(true);
    vibrate([50, 100, 50]);

    try {
      const drawnIndices = new Set();
      while (drawnIndices.size < 3) {
        drawnIndices.add(Math.floor(Math.random() * deck.length));
      }

      let drawnCards = Array.from(drawnIndices).map(i => deck[i]);

      drawnCards = await Promise.all(
        drawnCards.map(async card => {
          if (!card.exegesis || !card.imageUrl) {
            try {
              const fullCard = await generateCardData(card, author, selectedTradition, selectedStyle, isErotic);
              setDeck(prev => prev.map(c => (c.id === fullCard.id ? fullCard : c)));
              return fullCard;
            } catch (err) {
              return card;
            }
          }
          return card;
        })
      );

      setReading({ cards: drawnCards, answer: 'COMMUNING WITH THE SECRET CHIEFS...' });

      const result = await generateOracleReading(
        oracleQuestion,
        drawnCards,
        author,
        selectedTradition,
        isErotic
      );

      setReading({ cards: drawnCards, answer: result.answer });
      trackEvent('oracle_cast');
    } catch (err) {
      console.error('Oracle error:', err);
      setError({
        title: 'Oracle Silent',
        message: err.message || 'The oracle could not be consulted',
        details: err.details
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // ARCHIVE COMPILATION
  // ============================================================================

  const compileArchive = async () => {
    setIsArchiving(true);
    setArchiveProgress({ current: 0, total: deck.length });

    try {
      const updatedDeck = [...deck];
      const missingIndices = updatedDeck
        .map((card, index) => (!card.exegesis ? index : -1))
        .filter(i => i !== -1);

      for (let i = 0; i < missingIndices.length; i++) {
        const idx = missingIndices[i];
        setArchiveProgress({ current: i + 1, total: missingIndices.length });

        try {
          const fullCard = await generateCardData(
            updatedDeck[idx],
            author,
            selectedTradition,
            selectedStyle,
            isErotic
          );
          updatedDeck[idx] = fullCard;
        } catch (err) {
          console.error(`Failed to generate card ${idx}:`, err);
        }
      }

      setDeck(updatedDeck);

      const html = generateArchiveHTML(
        author,
        updatedDeck,
        dossier,
        portrait,
        selectedTradition,
        selectedStyle,
        reading,
        oracleQuestion
      );

      const filename = `GRIMOIRE_${author.replace(/\s+/g, '_')}_${Date.now()}.html`;
      downloadFile(html, filename, 'text/html');

      trackEvent('archive_downloaded');
      vibrate([100, 50, 100]);
    } catch (err) {
      console.error('Archive error:', err);
      setError({
        title: 'Archive Failed',
        message: err.message,
        details: err.details
      });
    } finally {
      setIsArchiving(false);
      setArchiveProgress({ current: 0, total: 0 });
    }
  };

  // ============================================================================
  // SHARE & RESET
  // ============================================================================

  const shareDeck = async () => {
    const success = await shareContent(
      `ARCHETYPE: ${author}`,
      `I created a personalized Tarot deck for ${author} using AI and esoteric wisdom.`,
      window.location.href
    );

    if (success) {
      vibrate(50);
      trackEvent('deck_shared');
    }
  };

  const resetDeck = () => {
    if (window.confirm('Reset and start over? This will clear your current deck.')) {
      clearDeckProgress();
      setAuthor('');
      setDeck([]);
      setDossier(null);
      setPortrait(null);
      setReading(null);
      setOracleQuestion('');
      setFocusedCard(null);
      setView('landing');
      trackEvent('deck_reset');
      vibrate(100);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#1a0b2e] text-[#ffd700] font-mono selection:bg-[#ffd700] selection:text-[#1a0b2e] overflow-x-hidden">
        {/* Global Styles */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
          
          .font-header {
            font-family: 'Press Start 2P', cursive;
          }
          
          .font-body {
            font-family: 'VT323', monospace;
            font-size: 1.4rem;
            line-height: 1.5;
          }
          
          .pixelated {
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
          }

          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>

        <SacredGeometry accent="#ffd700" opacity={0.4} />
        <AudioController />

        <Header
          view={view}
          onMenuClick={() => setIsMenuOpen(true)}
          onOracleClick={() => setView('oracle')}
          onArchiveClick={compileArchive}
          onShareClick={shareDeck}
          onResetClick={resetDeck}
        />

        <SideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          isErotic={isErotic}
          onEroticChange={setIsErotic}
        />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"
            >
              <div className="max-w-2xl w-full">
                <ErrorMessage
                  title={error.title}
                  message={error.message}
                  onRetry={() => {
                    setError(null);
                    if (view === 'ritual') runRitual();
                  }}
                  onDismiss={() => {
                    setError(null);
                    setView('landing');
                  }}
                />
              </div>
            </motion.div>
          )}

          {view === 'landing' && (
            <LandingView
              author={author}
              onAuthorChange={setAuthor}
              selectedTradition={selectedTradition}
              onTraditionChange={setSelectedTradition}
              selectedStyle={selectedStyle}
              onSubmit={runRitual}
            />
          )}

          {view === 'ritual' && (
            <RitualView message={loadingMessage} />
          )}

          {view === 'scriptorium' && (
            <ScriptoriumView
              author={author}
              dossier={dossier}
              portrait={portrait}
              deck={deck}
              onCardClick={forgeCardDetail}
            />
          )}

          {view === 'oracle' && (
            <OracleView
              question={oracleQuestion}
              onQuestionChange={setOracleQuestion}
              reading={reading}
              onCast={castOracle}
              onNewReading={() => setReading(null)}
              onBack={() => setView('scriptorium')}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>

        <CardDetailModal
          card={focusedCard}
          onClose={() => setFocusedCard(null)}
          isForging={isLoading}
        />

        {isArchiving && (
          <div className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#1a0b2e] border-4 border-[#ffd700] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
              <h3 className="text-2xl font-header text-[#ffd700] mb-6 text-center">
                COMPILING GRIMOIRE
              </h3>
              <ProgressBar
                current={archiveProgress.current}
                total={archiveProgress.total}
                label="Inscribing Cards"
              />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
