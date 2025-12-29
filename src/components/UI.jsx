// ============================================================================
// ARCHETYPE UI COMPONENTS
// ============================================================================

import React from 'react';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { vibrate } from '../lib/utils';

// ============================================================================
// PIXEL BUTTON
// ============================================================================

export const PixelButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  icon: Icon,
  disabled = false,
  loading = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-[#ffd700] text-[#1a0b2e] hover:bg-white border-[#ffd700]',
    secondary: 'bg-[#2d1b4e] text-[#ffd700] hover:bg-[#3d2b5e] border-[#ffd700]',
    danger: 'bg-red-900 text-red-200 hover:bg-red-800 border-red-500',
    ghost: 'bg-transparent text-[#ffd700] hover:bg-[#ffd700]/10 border-[#ffd700]/30'
  };

  const handleClick = (e) => {
    if (!disabled && !loading) {
      vibrate(50);
      onClick?.(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        border-2 px-4 py-2 font-header text-xs uppercase
        transition-all
        shadow-[4px_4px_0px_#000]
        hover:translate-y-1 hover:shadow-[2px_2px_0px_#000]
        active:translate-y-2 active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        flex items-center gap-2 justify-center
        ${className}
      `}
      {...props}
    >
      {loading && <RefreshCw size={14} className="animate-spin" />}
      {Icon && !loading && <Icon size={14} />}
      {children}
    </button>
  );
};

// ============================================================================
// MODAL
// ============================================================================

export const Modal = ({ isOpen, onClose, children, title, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 z-50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`
                  ${sizes[size]} w-full
                  bg-[#1a0b2e] border-4 border-[#ffd700]
                  shadow-[8px_8px_0px_rgba(0,0,0,0.5)]
                  relative
                `}
              >
                <div className="flex items-center justify-between p-6 border-b-2 border-[#ffd700]/30">
                  <h2 className="text-2xl font-header text-[#ffd700] uppercase">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-[#ffd700] hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  {children}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// CARD
// ============================================================================

export const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#2d1b4e]/40 border-2 border-[#ffd700]/30
        backdrop-blur-sm
        shadow-[4px_4px_0px_rgba(0,0,0,0.3)]
        ${hover ? 'hover:border-[#ffd700] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.5)] transition-all cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ============================================================================
// LOADING SPINNER
// ============================================================================

export const LoadingSpinner = ({ size = 'md', text }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <RefreshCw 
        size={size === 'sm' ? 32 : size === 'md' ? 64 : 96} 
        className="text-[#ffd700] animate-spin" 
      />
      {text && (
        <p className="font-header text-[#ffd700] text-sm uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// SKELETON LOADER
// ============================================================================

export const Skeleton = ({ className = '', aspectRatio = 'auto' }) => {
  const aspects = {
    square: 'aspect-square',
    card: 'aspect-[2/3]',
    video: 'aspect-video',
    auto: ''
  };

  return (
    <div 
      className={`
        ${aspects[aspectRatio]}
        bg-[#ffd700]/10 
        animate-pulse 
        ${className}
      `}
    />
  );
};

// ============================================================================
// ERROR MESSAGE
// ============================================================================

export const ErrorMessage = ({ title, message, onRetry, onDismiss }) => {
  return (
    <Card className="p-6 border-red-500 bg-red-900/20">
      <div className="flex items-start gap-4">
        <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
        <div className="flex-1">
          <h3 className="font-header text-red-500 text-lg mb-2 uppercase">
            {title}
          </h3>
          <p className="text-red-200 font-body text-lg mb-4">
            {message}
          </p>
          <div className="flex gap-2">
            {onRetry && (
              <PixelButton variant="danger" onClick={onRetry} icon={RefreshCw}>
                Try Again
              </PixelButton>
            )}
            {onDismiss && (
              <PixelButton variant="ghost" onClick={onDismiss}>
                Dismiss
              </PixelButton>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <ErrorMessage
              title="Something went wrong"
              message={this.state.error?.message || 'An unexpected error occurred'}
              onRetry={() => window.location.reload()}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// PROGRESS BAR
// ============================================================================

export const ProgressBar = ({ current, total, label }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2 font-header text-xs text-[#ffd700]">
          <span>{label}</span>
          <span>{current} / {total}</span>
        </div>
      )}
      <div className="w-full h-8 border-4 border-[#ffd700] bg-black/50 p-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-[#ffd700]"
        />
      </div>
      <div className="mt-1 text-center font-header text-[10px] text-[#ffd700]/60">
        {percentage}%
      </div>
    </div>
  );
};

// ============================================================================
// TOOLTIP
// ============================================================================

export const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              absolute ${positions[position]} z-50
              bg-[#1a0b2e] border-2 border-[#ffd700]
              px-3 py-2 text-xs font-header text-[#ffd700]
              whitespace-nowrap
              shadow-[4px_4px_0px_rgba(0,0,0,0.5)]
              pointer-events-none
            `}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
