// ============================================================================
// AUDIO CONTROLLER - Generative Ambient Soundscape
// ============================================================================

import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLocalStorage } from '../hooks';
import { STORAGE_KEYS, FEATURE_FLAGS } from '../lib/constants';
import { vibrate } from '../lib/utils';

const AudioController = memo(() => {
  if (!FEATURE_FLAGS.enableAudio) return null;

  const [isPlaying, setIsPlaying] = useLocalStorage(STORAGE_KEYS.audioEnabled, false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const sequenceRef = useRef(null);
  const oscillatorsRef = useRef([]);

  // Mystical Dorian Mode scale (A Dorian)
  const scale = [
    440.00,  // A
    493.88,  // B
    523.25,  // C
    587.33,  // D
    659.25,  // E
    739.99,  // F#
    830.61,  // G#
    880.00,  // A (octave)
  ];

  const playNote = useCallback((frequency, duration, type = 'triangle', volume = 0.05) => {
    if (!audioCtxRef.current) return;

    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    
    // ADSR Envelope for smooth sound
    const now = audioCtxRef.current.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.1); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Decay/Release

    osc.connect(gain);
    gain.connect(gainNodeRef.current);
    
    osc.start();
    osc.stop(now + duration);

    oscillatorsRef.current.push(osc);
  }, []);

  const startSequence = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;

    let step = 0;

    const nextStep = () => {
      if (audioCtxRef.current?.state === 'running') {
        // Arpeggio pattern with occasional octave shifts and harmonics
        const noteIndex = step % scale.length;
        const frequency = scale[noteIndex];
        
        // Randomly shift octaves for depth
        const octave = Math.random() > 0.7 ? 0.5 : 1;
        
        // Main note
        playNote(frequency * octave, 2.0, 'triangle', 0.04);
        
        // Occasional harmonic (5th)
        if (Math.random() > 0.6) {
          const fifthIndex = (noteIndex + 4) % scale.length;
          playNote(scale[fifthIndex] * octave, 2.5, 'sine', 0.02);
        }

        step++;
        const tempo = 400 + Math.random() * 200; // Slight tempo variation
        sequenceRef.current = setTimeout(nextStep, tempo);
      }
    };

    nextStep();
  }, [playNote]);

  const stopSequence = useCallback(() => {
    if (sequenceRef.current) {
      clearTimeout(sequenceRef.current);
      sequenceRef.current = null;
    }

    // Stop all active oscillators
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator already stopped
      }
    });
    oscillatorsRef.current = [];
  }, []);

  const toggleAudio = useCallback(() => {
    vibrate(50);

    if (isPlaying) {
      stopSequence();
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    } else {
      // Initialize or resume audio context
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.value = 0.3; // Master volume
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      startSequence();
      setIsPlaying(true);
    }
  }, [isPlaying, setIsPlaying, startSequence, stopSequence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSequence();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [stopSequence]);

  return (
    <button
      onClick={toggleAudio}
      className="
        fixed bottom-6 right-6 z-[100]
        p-4 bg-[#2d1b4e] border-2 border-[#ffd700]
        text-[#ffd700]
        shadow-[4px_4px_0px_#000]
        hover:translate-y-1 hover:shadow-[2px_2px_0px_#000]
        transition-all
        active:bg-[#ffd700] active:text-[#2d1b4e]
      "
      aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
    >
      {isPlaying ? (
        <Volume2 size={24} className="animate-pulse" />
      ) : (
        <VolumeX size={24} />
      )}
    </button>
  );
});

AudioController.displayName = 'AudioController';

export default AudioController;
