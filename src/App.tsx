import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FlipText } from './components/FlipText';
import { TextReel } from './components/TextReel';
import { DraggableMarquee } from './components/DraggableMarquee';
import { Calculator } from './calculator';

// We manage the Three.js scene outside of React to ensure high performance
declare global {
  interface Window {
    threeSceneUpdate: (processing: boolean, progress: number) => void;
  }
}

const easterEggMessages = [
  "THERMAL LOAD: 0.00001%",
  "CPU UTILIZATION: 0.0000003%",
  "THREAT LEVEL: NONE",
  "CALCULATION IMPORTANCE: ABSOLUTELY CRITICAL",
  "NASA CLEARANCE: UNNECESSARY",
  "ESTIMATED HUMAN LIFETIME SAVED: 0.0004 seconds",
  "WARNING: CALCULATION MAY BE TOO POWERFUL",
  "QUANTUM FLUX: NOMINAL",
  "REDUNDANCY LEVEL: 99.9999%",
  "ERROR CORRECTION: ACTIVE"
];

export default function App() {
  const calcRef = useRef(new Calculator());
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[LOG] TERMINAL CONNECTED...', '[LOG] AWAITING INPUT...']);
  const [marqueeText, setMarqueeText] = useState('SYSTEM STATUS: NOMINAL • NO THREAT DETECTED • ');

  const updateLogs = (newLog: string) => {
    setLogs(prev => [...prev.slice(-10), newLog]);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (isProcessing && key !== 'C') return;

    if (key === 'C') {
      calcRef.current.equation = '';
      setEquation('');
      setResult('0');
      setIsProcessing(false);
      setLogs(['[LOG] TERMINAL CONNECTED...', '[LOG] AWAITING INPUT...']);
      if (window.threeSceneUpdate) window.threeSceneUpdate(false, 0);
      return;
    }

    if (key === '←') {
      calcRef.current.equation = calcRef.current.equation.slice(0, -1);
      setEquation(calcRef.current.equation);
      setResult(calcRef.current.equation || '0');
      return;
    }

    if (key === '=') {
      if (!calcRef.current.equation) return;
      startCinematicSequence();
      return;
    }

    calcRef.current.equation += key;
    setEquation(calcRef.current.equation);
    setResult(calcRef.current.equation);
  }, [isProcessing]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      let key: string | null = null;
      switch(e.key) {
        case 'Escape': case 'c': case 'C': key = 'C'; break;
        case 'Backspace': key = '←'; break;
        case '%': key = '%'; break;
        case '/': key = '/'; break;
        case '*': key = '*'; break;
        case '-': key = '-'; break;
        case '+': key = '+'; break;
        case '.': key = '.'; break;
        case 'Enter': case '=': key = '='; break;
        default:
          if (/^[0-9]$/.test(e.key)) key = e.key;
          break;
      }
      if (key) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress]);

  const startCinematicSequence = () => {
    setIsProcessing(true);
    setLogs(['[LOG] INITIALIZING COMPUTATION...']);
    
    if (Math.random() < 0.3) {
      setMarqueeText(easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)] + ' • ');
    } else {
      setMarqueeText('PROCESSING OVERDRIVE ENGAGED • ALLOCATING QUANTUM CORES • ');
    }

    const startTime = performance.now();
    const duration = 4000 + Math.random() * 2000;
    
    const logStages = [
      'ESTABLISHING NUMERICAL LINK...',
      'ALLOCATING MEMORY...',
      'CALIBRATING ARITHMETIC ENGINE...',
      'SYNCHRONIZING PROCESSING CORES...',
      'CROSS-CHECKING RESULT...',
      'PERFORMING REDUNDANT VERIFICATION...'
    ];
    let currentStage = 0;

    const animateProgress = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (window.threeSceneUpdate) {
        window.threeSceneUpdate(true, progress);
      }

      const expectedStage = Math.floor(progress * logStages.length);
      if (expectedStage > currentStage && expectedStage < logStages.length) {
        updateLogs(`[LOG] ${logStages[expectedStage]}`);
        currentStage = expectedStage;
      }

      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      } else {
        completeCalculation();
      }
    };
    
    requestAnimationFrame(animateProgress);
  };

  const completeCalculation = () => {
    const calcResult = calcRef.current.press('=');
    setEquation(calcResult.equation);
    setResult(calcResult.result);
    setLogs(prev => [...prev, '[LOG] COMPUTATION COMPLETE.']);
    setIsProcessing(false);
    setMarqueeText('SYSTEM STATUS: IDLE • READY FOR INPUT • ');
    if (window.threeSceneUpdate) window.threeSceneUpdate(false, 0);
  };

  const renderKey = (val: string) => (
    <button 
      onClick={() => handleKeyPress(val)}
      className="bg-[var(--ui-panel-dark)] border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)] hover:text-black text-2xl font-bold py-4 transition-all duration-150 rounded shadow-[0_0_10px_rgba(0,242,255,0.1)] active:scale-95"
    >
      {val}
    </button>
  );

  return (
    <div id="ui-overlay" className="absolute inset-0 pointer-events-none flex flex-col items-center p-8 z-10 w-full h-full overflow-hidden">
      
      {isProcessing && (
        <DraggableMarquee text={marqueeText} className="absolute top-10 w-full bg-[#FF3E00]/20 text-[#FF3E00] text-xl border-y border-[#FF3E00] tracking-widest uppercase pointer-events-auto shadow-[0_0_20px_#FF3E00] z-50 py-3" speed={15} />
      )}

      <div id="diagnostic-panel" className="absolute top-8 left-8 w-80 bg-[var(--ui-panel)] border border-[var(--text-dim)] p-4 text-xs font-mono rounded pointer-events-auto h-48 flex flex-col shadow-lg backdrop-blur-sm">
        <div className={`mb-2 font-bold ${isProcessing ? 'text-[#FF3E00]' : 'text-[var(--accent-primary)]'}`}>
          {isProcessing ? 'SYSTEM STATUS: PROCESSING' : 'SYSTEM STATUS: IDLE'}
        </div>
        <TextReel logs={logs} className="flex-1" />
      </div>

      <div id="calculator" className="relative mt-auto mb-10 w-full max-w-sm bg-[var(--ui-panel)] border border-[var(--accent-primary)]/50 rounded-lg p-6 pointer-events-auto shadow-2xl backdrop-blur-md">
        
        <div id="display" className="bg-black/80 border-2 border-[var(--accent-primary)] rounded p-4 mb-6 text-right break-all flex flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] min-h-[120px] justify-between">
          <div className="text-[var(--text-dim)] text-lg min-h-[1.75rem]">{equation}</div>
          <div className="text-[var(--text-bright)] text-5xl font-bold font-mono tracking-wider overflow-hidden">
            <FlipText>{result}</FlipText>
          </div>
        </div>

        <div id="keypad" className="grid grid-cols-4 gap-3">
          {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(renderKey)}
        </div>
      </div>
    </div>
  );
}
