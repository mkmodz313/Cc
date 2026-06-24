/**
 * Web Audio API synthesizer for high-tech UI sounds and retro-cyber matrix feedback.
 * Zero external assets, completely generated on the fly.
 * Fine-tuned for premium, ultra-clean, elegant sci-fi digital acoustics.
 */

let audioCtx: AudioContext | null = null;
let currentHumOsc1: OscillatorNode | null = null;
let currentHumOsc2: OscillatorNode | null = null;
let currentHumGain: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundCore = {
  // Ultra-clean, light tactile interface tick (extremely elegant, like a high-end luxury clock)
  playTick() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") return;
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(3500, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.012);
      
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.02);
    } catch (e) {}
  },

  // Soft tactile premium wood keyboard click (satisfying keycap sound)
  playKeystroke() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") return;
      
      const now = ctx.currentTime;
      
      // Tone part (body)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const freq = 600 + Math.random() * 150;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.015);
      
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
      
      // Click part (transient)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = "triangle";
      clickOsc.frequency.setValueAtTime(4000, now);
      clickOsc.frequency.exponentialRampToValueAtTime(800, now + 0.005);
      
      clickGain.gain.setValueAtTime(0.008, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      
      osc.start();
      osc.stop(now + 0.03);
      clickOsc.start();
      clickOsc.stop(now + 0.01);
    } catch (e) {}
  },

  // Beautiful major-seventh chime sweep (magical, premium, high-end digital chime)
  playSuccessLaser() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") return;

      const now = ctx.currentTime;
      const notes = [1046.50, 1318.51, 1567.98, 1975.53, 2637.02]; // C6, E6, G6, B6, E7 (pure angelic crystal chime)
      
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + index * 0.04);
        
        // Gentle smooth envelope (fade in and exponential decay)
        gain.gain.setValueAtTime(0.0, now + index * 0.04);
        gain.gain.linearRampToValueAtTime(0.012, now + index * 0.04 + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.04 + 0.18);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + index * 0.04);
        osc.stop(now + index * 0.04 + 0.2);
      });
    } catch (e) {}
  },

  // Elegant dampened double-pulse thud (luxury warnings, not harsh)
  playAccessDenied() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") return;

      const now = ctx.currentTime;
      const pulses = [0, 0.12]; // Elegant double heartbeat warning
      
      pulses.forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(95, now + delay);
        osc.frequency.exponentialRampToValueAtTime(45, now + delay + 0.08);
        
        gain.gain.setValueAtTime(0.08, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } catch (e) {}
  },

  // Futuristic smooth digital sliding wipe (extremely satisfying)
  playLaserSweep() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") return;
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.2);
    } catch (e) {}
  },

  // Luxurious crystal-clear high-frequency soft ping
  playBeep(hz: number = 1200, durationSec: number = 0.08) {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") return;
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(hz, now);
      
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + durationSec + 0.02);
    } catch (e) {}
  },

  // Subtle ambient power hum (extremely low volume, pure sine blend, zero click/glitch)
  startSpaceHum() {
    try {
      const ctx = getAudioContext();
      if (currentHumOsc1) return; // Already humming
      
      currentHumOsc1 = ctx.createOscillator();
      currentHumOsc2 = ctx.createOscillator();
      currentHumGain = ctx.createGain();
      
      currentHumOsc1.type = "sine";
      currentHumOsc1.frequency.setValueAtTime(50, ctx.currentTime); // Deep European standard grid hum
      
      currentHumOsc2.type = "sine";
      currentHumOsc2.frequency.setValueAtTime(100, ctx.currentTime); // 1st Harmonic for rich premium texture
      
      // Extremely subtle gain to avoid noise complaints and browser lag
      currentHumGain.gain.setValueAtTime(0.002, ctx.currentTime);
      
      currentHumOsc1.connect(currentHumGain);
      currentHumOsc2.connect(currentHumGain);
      currentHumGain.connect(ctx.destination);
      
      currentHumOsc1.start();
      currentHumOsc2.start();
    } catch (e) {}
  },

  stopSpaceHum() {
    try {
      if (currentHumOsc1) {
        currentHumOsc1.stop();
        currentHumOsc1.disconnect();
        currentHumOsc1 = null;
      }
      if (currentHumOsc2) {
        currentHumOsc2.stop();
        currentHumOsc2.disconnect();
        currentHumOsc2 = null;
      }
      if (currentHumGain) {
        currentHumGain.disconnect();
        currentHumGain = null;
      }
    } catch (e) {}
  }
};
