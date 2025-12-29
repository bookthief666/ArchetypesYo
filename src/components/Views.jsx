// ============================================================================
// ARCHETYPE VIEW COMPONENTS
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Download, Menu, Share, RotateCcw, Gamepad2, RefreshCw, X, Heart
} from 'lucide-react';
import { PixelButton, Card, LoadingSpinner } from './UI';
import { ART_STYLES, TRADITIONS, FEATURE_FLAGS } from '../lib/constants';

// ============================================================================
// HEADER
// ============================================================================

export const Header = ({
  view,
  onMenuClick,
  onOracleClick,
  onArchiveClick,
  onShareClick,
  onResetClick
}) => {
  return (
    <nav className="fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-4 bg-[#1a0b2e]/90 border-b-4 border-[#ffd700] backdrop-blur-md">
      <button
        onClick={onResetClick}
        className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Go to home"
      >
        <div className="w-8 h-8 bg-[#ffd700] flex items-center justify-center text-[#1a0b2e] font-header font-bold text-xs">
          A
        </div>
        <span className="hidden sm:block text-xs font-header uppercase">
          ARCHETYPE
        </span>
      </button>

      <div className="flex items-center gap-2">
        {view === 'scriptorium' && (
          <>
            <PixelButton
              onClick={onOracleClick}
              icon={Eye}
              variant="secondary"
              className="hidden sm:flex"
            >
              Oracle
            </PixelButton>
            <PixelButton onClick={onShareClick} icon={Share} variant="ghost" className="hidden md:flex">
              Share
            </PixelButton>
            <PixelButton onClick={onArchiveClick} icon={Download} variant="secondary">
              <span className="hidden sm:inline">Save</span>
            </PixelButton>
          </>
        )}
        <PixelButton onClick={onMenuClick} icon={Menu} variant="secondary">
          <span className="sr-only">Menu</span>
        </PixelButton>
      </div>
    </nav>
  );
};

// ============================================================================
// SIDE MENU
// ============================================================================

export const SideMenu = ({
  isOpen,
  onClose,
  selectedStyle,
  onStyleChange,
  isErotic,
  onEroticChange
}) => {
  if (!isOpen) return null;

  const categories = {
    classical: ART_STYLES.filter(s => s.category === 'classical'),
    esoteric: ART_STYLES.filter(s => s.category === 'esoteric'),
    retro: ART_STYLES.filter(s => s.category === 'retro'),
    modern: ART_STYLES.filter(s => s.category === 'modern')
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 z-[60] backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#1a0b2e] border-l-4 border-[#ffd700] z-[70] overflow-y-auto shadow-2xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-[#ffd700]/30">
            <h2 className="text-xl font-header text-[#ffd700] uppercase">Codex</h2>
            <button
              onClick={onClose}
              className="text-[#ffd700] hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Eros Mode Toggle */}
          {FEATURE_FLAGS.enableErosMode && (
            <div className="p-4 border-2 border-red-500 bg-red-900/20 mb-8 flex items-center justify-between shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3">
                <Heart
                  size={20}
                  className={isErotic ? 'text-red-500 fill-red-500' : 'text-red-900'}
                />
                <span className="text-xs font-header text-red-500 uppercase">
                  Sacred Eros
                </span>
              </div>
              <button
                onClick={() => onEroticChange(!isErotic)}
                className={`
                  w-12 h-6 border-2 border-red-500 relative transition-colors
                  ${isErotic ? 'bg-red-500' : 'bg-transparent'}
                `}
                aria-label={`${isErotic ? 'Disable' : 'Enable'} Sacred Eros mode`}
              >
                <div
                  className={`
                    absolute top-0.5 bottom-0.5 w-4 bg-white transition-all
                    ${isErotic ? 'right-1' : 'left-1'}
                  `}
                />
              </button>
            </div>
          )}

          {/* Art Styles */}
          <div className="space-y-6">
            {Object.entries(categories).map(([category, styles]) => (
              <div key={category}>
                <h3 className="text-xs font-header text-[#ffd700]/60 uppercase mb-3 border-b border-[#ffd700]/20 pb-2">
                  {category}
                </h3>
                <div className="space-y-2">
                  {styles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => {
                        onStyleChange(style);
                        onClose();
                      }}
                      className={`
                        w-full text-left p-3 border-2 transition-all font-body text-lg
                        ${
                          selectedStyle.id === style.id
                            ? 'border-[#ffd700] bg-[#ffd700] text-[#1a0b2e]'
                            : 'border-[#ffd700]/30 text-[#ffd700]/80 hover:border-[#ffd700]/60'
                        }
                      `}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ============================================================================
// LANDING VIEW
// ============================================================================

export const LandingView = ({
  author,
  onAuthorChange,
  selectedTradition,
  onTraditionChange,
  selectedStyle,
  onSubmit
}) => {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 flex flex-col items-center justify-center p-6 text-center z-10 relative"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-header text-[#ffd700] mb-12 drop-shadow-[4px_4px_0px_#000]"
      >
        ARCHETYPE
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl bg-[#1a0b2e]/70 backdrop-blur-md border-4 border-[#ffd700] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] space-y-6"
      >
        {/* Tradition Selection */}
        <div>
          <label className="block text-xs font-header text-[#ffd700]/60 uppercase mb-3">
            Select Tradition
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRADITIONS.map(tradition => (
              <button
                key={tradition.id}
                onClick={() => onTraditionChange(tradition)}
                className={`
                  p-4 border-2 text-left transition-all
                  ${
                    selectedTradition.id === tradition.id
                      ? 'bg-[#ffd700] text-[#1a0b2e] border-[#ffd700]'
                      : 'border-[#ffd700]/30 text-[#ffd700]/80 hover:border-[#ffd700]/60'
                  }
                `}
              >
                <div className="text-sm font-header mb-1">{tradition.name}</div>
                <div className="text-xs opacity-70">{tradition.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Author Input */}
        <div>
          <label htmlFor="author-input" className="block text-xs font-header text-[#ffd700]/60 uppercase mb-3">
            Insert Subject
          </label>
          <input
            id="author-input"
            type="text"
            value={author}
            onChange={e => onAuthorChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            placeholder="Author, Entity, Concept..."
            className="
              w-full bg-black/40 border-2 border-[#ffd700]/50
              p-4 text-center font-header text-[#ffd700]
              focus:outline-none focus:border-[#ffd700]
              transition-colors
            "
            autoFocus
          />
        </div>

        {/* Submit Button */}
        <PixelButton onClick={onSubmit} variant="primary" className="w-full py-4 text-sm">
          INITIATE RITUAL
        </PixelButton>

        {/* Style Info */}
        <p className="font-body text-[#ffd700]/50 text-base uppercase pt-4 border-t border-[#ffd700]/20">
          Style: {selectedStyle.name}
        </p>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-xs font-header text-[#ffd700]/40 max-w-lg"
      >
        <p>Generate personalized 78-card Tarot decks with AI-powered artwork and esoteric wisdom</p>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// RITUAL VIEW (Loading Screen)
// ============================================================================

export const RitualView = ({ message }) => {
  return (
    <motion.div
      key="ritual"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 bg-[#1a0b2e] flex flex-col items-center justify-center p-6 text-center"
    >
      <Gamepad2 size={80} className="text-[#ffd700] mb-8 animate-bounce" />
      <h2 className="text-xl font-header text-[#ffd700] mb-8 animate-pulse max-w-md">
        {message || 'INVOKING...'}
      </h2>
      <div className="w-64 h-8 border-4 border-[#ffd700] p-1">
        <motion.div
          className="h-full bg-[#ffd700]"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

// ============================================================================
// SCRIPTORIUM VIEW (Deck Grid)
// ============================================================================

export const ScriptoriumView = ({ author, dossier, portrait, deck, onCardClick }) => {
  return (
    <motion.div
      key="scriptorium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 px-4 pb-48 max-w-[1600px] mx-auto z-10 relative"
    >
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16 items-center lg:items-start text-center lg:text-left">
        {/* Portrait */}
        <div className="w-64 h-64 flex-shrink-0 border-4 border-[#ffd700] bg-black shadow-[8px_8px_0px_#000] overflow-hidden relative group">
          {portrait ? (
            <img src={portrait} alt={`${author} portrait`} className="w-full h-full object-cover pixelated" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <RefreshCw size={64} className="animate-spin text-[#ffd700]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-header text-[#ffd700] leading-tight drop-shadow-[4px_4px_0px_#000]">
            {author}
          </h2>
          <Card className="p-6 border-[#ffd700]">
            <p className="font-body text-xl leading-relaxed text-[#ffd700]/90">
              {dossier}
            </p>
          </Card>
        </div>
      </header>

      {/* Deck Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {deck.map(card => (
          <motion.button
            key={card.id}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => onCardClick(card)}
            className="aspect-[2/3] bg-[#2d1b4e] border-4 border-[#ffd700] relative cursor-pointer group hover:border-white transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
            aria-label={`View ${card.name}`}
          >
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover pixelated"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <span className="text-[10px] sm:text-xs font-header text-[#ffd700]/50 text-center leading-tight">
                  {card.name}
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// ORACLE VIEW
// ============================================================================

export const OracleView = ({
  question,
  onQuestionChange,
  reading,
  onCast,
  onNewReading,
  onBack,
  isLoading
}) => {
  return (
    <motion.div
      key="oracle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 px-6 flex flex-col items-center max-w-5xl mx-auto z-20 relative pb-24"
    >
      <h2 className="text-4xl sm:text-6xl font-header text-[#ffd700] mb-12 drop-shadow-[4px_4px_0px_#000]">
        THE ORACLE
      </h2>

      {!reading ? (
        <div className="w-full space-y-8">
          <textarea
            value={question}
            onChange={e => onQuestionChange(e.target.value)}
            placeholder="INSCRIBE YOUR INQUIRY..."
            className="
              w-full bg-black/30 border-4 border-[#ffd700]
              p-8 text-xl min-h-[250px] font-body text-[#ffd700] uppercase
              focus:outline-none focus:border-white
              transition-colors resize-none
            "
            autoFocus
          />
          <div className="flex gap-4">
            <PixelButton
              onClick={onCast}
              variant="primary"
              className="flex-1 py-6 text-base"
              disabled={!question.trim()}
              loading={isLoading}
            >
              Cast Reading
            </PixelButton>
            <PixelButton onClick={onBack} variant="ghost" className="px-6">
              Return
            </PixelButton>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-12">
          {/* Cards */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            {reading.cards.map((card, i) => (
              <div
                key={i}
                className="w-40 sm:w-48 aspect-[2/3] border-4 border-[#ffd700] bg-black/40 shadow-[6px_6px_0px_rgba(0,0,0,0.5)] relative"
              >
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover pixelated"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <RefreshCw className="animate-spin text-[#ffd700]" size={32} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-center">
                  <p className="text-xs font-header text-[#ffd700]">{card.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Answer */}
          <Card className="p-8 border-[#ffd700] bg-[#1a0b2e]/70">
            <p className="text-xl leading-relaxed text-[#ffd700] font-body whitespace-pre-line">
              {reading.answer}
            </p>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <PixelButton onClick={onNewReading} variant="secondary">
              New Reading
            </PixelButton>
            <PixelButton onClick={onBack} variant="ghost">
              Return to Deck
            </PixelButton>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// CARD DETAIL MODAL
// ============================================================================

export const CardDetailModal = ({ card, onClose, isForging }) => {
  if (!card) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/95 z-[80] backdrop-blur-md"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[700px] bg-[#1a0b2e] border-l-4 border-[#ffd700] z-[90] overflow-y-auto p-6 md:p-10 shadow-[0_0_100px_rgba(212,175,55,0.1)]"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-10 pb-4 border-b-4 border-[#ffd700]/30">
          <h3 className="text-2xl sm:text-3xl font-header text-[#ffd700] leading-tight uppercase drop-shadow-[4px_4px_0px_#000] pr-4">
            {card.name}
          </h3>
          <button
            onClick={onClose}
            className="hover:text-white text-[#ffd700] transition-colors flex-shrink-0"
            aria-label="Close card detail"
          >
            <X size={32} />
          </button>
        </div>

        {/* Image */}
        <div className="aspect-[2/3] w-full bg-black border-4 border-[#ffd700] mb-12 relative overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover pixelated" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 animate-pulse">
              <RefreshCw size={48} className="text-[#ffd700]/40 animate-spin" />
              <span className="text-xs font-header text-[#ffd700]">
                {isForging ? 'FORGING ARCANUM...' : 'Image not generated'}
              </span>
            </div>
          )}
        </div>

        {/* Exegesis */}
        {isForging && !card.exegesis ? (
          <div className="text-center font-header text-[#ffd700] text-xs animate-pulse py-12">
            INSCRIBING TRUTH...
          </div>
        ) : (
          card.exegesis && (
            <div className="space-y-12 text-[#ffd700]/80 font-body leading-relaxed text-lg">
              <p className="whitespace-pre-line">{card.exegesis}</p>

              {/* Meta */}
              {card.meta && (
                <div className="grid grid-cols-2 gap-4 border-t-2 border-[#ffd700]/20 pt-8">
                  {Object.entries(card.meta).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-[#ffd700]/5 border-2 border-[#ffd700]/10"
                    >
                      <span className="text-[10px] uppercase text-[#ffd700] block mb-1 font-header opacity-50">
                        {key}
                      </span>
                      <span className="text-sm font-bold text-[#ffd700]">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </motion.div>
    </>
  );
};
