import type { Tone } from './machine/signals';

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  ctx ??= new AudioContext();
  return ctx;
}

function beep(freq: number, start: number, dur: number, gain: number) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.frequency.value = freq;
  osc.type = 'sine';
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.01);
  g.gain.linearRampToValueAtTime(0, ac.currentTime + start + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

/**
 * Three distinct tones, distinguishable by pitch AND rhythm, so they work
 * for people with partial hearing loss in a loud facility:
 *  - confirm: two rising notes
 *  - attention: two equal mid notes
 *  - stop: three low, long pulses
 */
export function playTone(tone: Tone, opts: { reduced: boolean }) {
  const vol = opts.reduced ? 0.04 : 0.15;
  if (tone === 'confirm') { beep(660, 0, 0.12, vol); beep(880, 0.14, 0.14, vol); }
  if (tone === 'attention') { beep(740, 0, 0.15, vol); beep(740, 0.25, 0.15, vol); }
  if (tone === 'stop') {
    // Safety stop is never reduced below an audible floor.
    const stopVol = Math.max(vol, 0.12);
    beep(330, 0, 0.35, stopVol); beep(330, 0.45, 0.35, stopVol); beep(330, 0.9, 0.35, stopVol);
  }
}

export function vibrate(pattern?: number[]) {
  if (pattern && typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
}

export function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  window.speechSynthesis.speak(u);
}
