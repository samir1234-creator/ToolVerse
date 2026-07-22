import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { Volume2, VolumeX } from 'lucide-react';
import { snackbar } from '@/components/ui/Snackbar';

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
};

const REVERSE_MORSE_MAP = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

export default function MorseCodeTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [playing, setPlaying] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return '';

    if (mode === 'encode') {
      return input
        .toUpperCase()
        .split('')
        .map(char => MORSE_MAP[char] || char)
        .join(' ');
    } else {
      return input
        .trim()
        .split(/\s+/)
        .map(code => REVERSE_MORSE_MAP[code] || code)
        .join('');
    }
  }, [input, mode]);

  const playSound = async () => {
    if (playing || !output) return;
    setPlaying(true);
    haptics.medium();

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dotDuration = 0.08;
      const dashDuration = dotDuration * 3;
      const intraCharSpace = dotDuration;
      const interCharSpace = dotDuration * 3;

      let timeOffset = audioCtx.currentTime;

      const queueTone = (duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(700, timeOffset);
        gainNode.gain.setValueAtTime(0, timeOffset);
        gainNode.gain.linearRampToValueAtTime(0.3, timeOffset + 0.005);
        gainNode.gain.setValueAtTime(0.3, timeOffset + duration - 0.005);
        gainNode.gain.linearRampToValueAtTime(0, timeOffset + duration);

        osc.start(timeOffset);
        osc.stop(timeOffset + duration);
        timeOffset += duration;
      };

      const codes = mode === 'encode' ? output.split(' ') : input.trim().split(/\s+/);

      for (let word of codes) {
        for (let symbol of word) {
          if (symbol === '.') {
            queueTone(dotDuration);
            timeOffset += intraCharSpace;
          } else if (symbol === '-') {
            queueTone(dashDuration);
            timeOffset += intraCharSpace;
          }
        }
        timeOffset += interCharSpace;
      }

      const totalTimeMs = (timeOffset - audioCtx.currentTime) * 1000;
      setTimeout(() => {
        setPlaying(false);
        audioCtx.close();
      }, Math.max(100, totalTimeMs));

    } catch {
      setPlaying(false);
      snackbar('Audio context failed to load');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Morse Code" subtitle="Convert text to Morse code signals & sound" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                haptics.light();
                setMode(m);
              }}
              className={`rounded-xl py-2.5 text-sm font-medium capitalize transition-colors ${mode === m ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Type text to encode, e.g. SOS...' : 'Paste Morse code to decode, e.g. ... --- ...'}
          rows={5}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        <div className="flex gap-2">
          <CopyField label="Output" value={output} />
          {output && (
            <button
              onClick={playSound}
              disabled={playing}
              className={`rounded-2xl p-4 flex items-center justify-center border transition-all ${playing ? 'bg-[var(--color-danger-soft)]/20 border-[var(--color-danger)] text-[var(--color-danger)]' : 'bg-[var(--color-accent-soft)] border-[var(--color-accent)]/30 text-[var(--color-accent)] active:bg-[var(--color-line)]'} self-end h-[50px] w-[50px]`}
            >
              {playing ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
