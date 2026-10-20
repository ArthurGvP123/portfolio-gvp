let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!sharedAudioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }

    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Web Audio API procedural haptic sound synthesis.
 * Generates an ultra-short, crisp mechanical ratchet click when interacting
 * with rotary dial items, theme buttons, or project cards.
 *
 * @param frequency Base frequency in Hz (defaults to 820Hz)
 */
export function playHapticClick(frequency = 820): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const audioCtx = getSharedAudioContext();
    if (!audioCtx) return;

    // Sanitize frequency against non-finite or non-positive hostile test inputs
    const safeFreq = Number.isFinite(frequency) && frequency > 0 ? frequency : 820;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Triangle or square waveform for mechanical tactile feel
    osc.type = "triangle";

    const now = audioCtx.currentTime;
    const duration = 0.025; // 25ms tactile click

    // Exponential pitch drop to mimic physical contact
    osc.frequency.setValueAtTime(safeFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(60, safeFreq * 0.15), now + duration);

    // Rapid gain envelope
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // AudioContext blocked before first user interaction
  }
}
