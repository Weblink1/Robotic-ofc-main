"use client"

/**
 * Hybrid Audio Snippet Player
 * - Plays uploaded/external MP3/WAV/M4A files via HTML5 <audio>
 * - Or generates a signature 35-second Afro-Tech / Deep Electronic groove preview
 *   for built-in seed tracks ("synth:*") so every track is audible out-of-the-box.
 */

export interface SnippetPlaybackState {
  isPlaying: boolean
  currentTime: number
  duration: number
  ended: boolean
}

type StateListener = (state: SnippetPlaybackState) => void

class AudioSnippetEngine {
  private audioEl: HTMLAudioElement | null = null
  private audioCtx: AudioContext | null = null
  private synthTimer: number | null = null
  private progressTimer: number | null = null
  private currentUrl: string | null = null
  private startTime = 0
  private pausedAt = 0
  private duration = 35
  private isPlaying = false
  private listeners: Set<StateListener> = new Set()
  private masterGain: GainNode | null = null

  subscribe(listener: StateListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(ended = false) {
    const currentTime = this.getCurrentTime()
    const state: SnippetPlaybackState = {
      isPlaying: this.isPlaying,
      currentTime,
      duration: this.duration,
      ended,
    }
    this.listeners.forEach((fn) => fn(state))
  }

  getCurrentTime(): number {
    if (!this.currentUrl) return 0
    if (!this.currentUrl.startsWith("synth:")) {
      return this.audioEl ? this.audioEl.currentTime : 0
    }
    if (!this.isPlaying || !this.audioCtx) return this.pausedAt
    return Math.min(this.duration, this.audioCtx.currentTime - this.startTime)
  }

  async play(url: string | undefined, fallbackId = 1) {
    const targetUrl = url && url.trim() !== "" ? url : `synth:track-${fallbackId}`

    if (this.currentUrl && this.currentUrl !== targetUrl) {
      this.stop()
    }

    this.currentUrl = targetUrl

    if (!targetUrl.startsWith("synth:")) {
      // Real HTML5 Audio File (MP3, WAV, M4A, or Data URL)
      if (!this.audioEl) {
        this.audioEl = new Audio()
        this.audioEl.preload = "metadata"
        this.audioEl.addEventListener("loadedmetadata", () => {
          if (this.audioEl && isFinite(this.audioEl.duration) && this.audioEl.duration > 0) {
            this.duration = Math.min(45, this.audioEl.duration)
            this.emit()
          }
        })
        this.audioEl.addEventListener("timeupdate", () => {
          if (!this.audioEl) return
          if (this.audioEl.currentTime >= 45) {
            this.audioEl.pause()
            this.audioEl.currentTime = 0
            this.isPlaying = false
            this.emit(true)
            return
          }
          this.emit()
        })
        this.audioEl.addEventListener("ended", () => {
          this.isPlaying = false
          this.emit(true)
        })
      }

      if (this.audioEl.src !== targetUrl) {
        this.audioEl.src = targetUrl
        this.duration = 35
      }

      try {
        await this.audioEl.play()
        this.isPlaying = true
        this.emit()
      } catch (err) {
        console.warn("Audio playback fallback to synth preview:", err)
        this.playSynth(`synth:track-${fallbackId}`)
      }
      return
    }

    this.playSynth(targetUrl)
  }

  private playSynth(seedKey: string) {
    if (typeof window === "undefined") return
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass()
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume()
    }

    this.duration = 35
    this.startTime = this.audioCtx.currentTime - this.pausedAt
    this.isPlaying = true

    if (this.masterGain) {
      try {
        this.masterGain.disconnect()
      } catch {}
    }
    this.masterGain = this.audioCtx.createGain()
    this.masterGain.gain.value = 0.28
    this.masterGain.connect(this.audioCtx.destination)

    // Derive unique BPM & root note from seedKey
    let hash = 0
    for (let i = 0; i < seedKey.length; i++) {
      hash = (hash * 31 + seedKey.charCodeAt(i)) % 1000
    }
    const bpm = 120 + (hash % 6) // 120-125 BPM Afro-Tech
    const stepMs = (60 / bpm / 4) * 1000 // 16th note
    const roots = [55, 58.27, 61.74, 65.41, 49, 51.91]
    const rootFreq = roots[hash % roots.length]

    let step = 0
    const triggerStep = () => {
      if (!this.isPlaying || !this.audioCtx || !this.masterGain) return
      const now = this.audioCtx.currentTime
      const elapsed = now - this.startTime
      if (elapsed >= this.duration) {
        this.stop(true)
        return
      }

      // 4-on-the-floor deep kick (steps 0, 4, 8, 12)
      if (step % 4 === 0) {
        const osc = this.audioCtx.createOscillator()
        const gain = this.audioCtx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(125, now)
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.14)
        gain.gain.setValueAtTime(0.85, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start(now)
        osc.stop(now + 0.29)
      }

      // Afro-tech syncopated percussive bass pluck (steps 2, 3, 6, 10, 11, 14)
      if ([2, 3, 6, 10, 11, 14].includes(step % 16)) {
        const osc = this.audioCtx.createOscillator()
        const filter = this.audioCtx.createBiquadFilter()
        const gain = this.audioCtx.createGain()
        const noteMult = step % 16 === 6 || step % 16 === 14 ? 1.5 : step % 16 === 11 ? 1.2 : 1
        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(rootFreq * noteMult, now)
        filter.type = "lowpass"
        filter.frequency.setValueAtTime(420, now)
        filter.frequency.exponentialRampToValueAtTime(95, now + 0.16)
        gain.gain.setValueAtTime(0.26, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain)
        osc.start(now)
        osc.stop(now + 0.19)
      }

      // Crisp off-beat shaker / hat
      if (step % 4 === 2 || step % 8 === 7) {
        const bufferSize = this.audioCtx.sampleRate * 0.05
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1
        }
        const noise = this.audioCtx.createBufferSource()
        noise.buffer = buffer
        const filter = this.audioCtx.createBiquadFilter()
        filter.type = "highpass"
        filter.frequency.setValueAtTime(6500, now)
        const gain = this.audioCtx.createGain()
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        noise.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain)
        noise.start(now)
      }

      // Atmospheric pad chord on bar start
      if (step % 16 === 0) {
        ;[2, 2.4, 3].forEach((harm) => {
          if (!this.audioCtx || !this.masterGain) return
          const pad = this.audioCtx.createOscillator()
          const padGain = this.audioCtx.createGain()
          pad.type = "triangle"
          pad.frequency.setValueAtTime(rootFreq * harm, now)
          padGain.gain.setValueAtTime(0.001, now)
          padGain.gain.linearRampToValueAtTime(0.045, now + 0.4)
          padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)
          pad.connect(padGain)
          padGain.connect(this.masterGain)
          pad.start(now)
          pad.stop(now + 1.85)
        })
      }

      step++
    }

    triggerStep()
    if (this.synthTimer) window.clearInterval(this.synthTimer)
    this.synthTimer = window.setInterval(triggerStep, stepMs)

    if (this.progressTimer) window.clearInterval(this.progressTimer)
    this.progressTimer = window.setInterval(() => {
      if (!this.isPlaying) return
      const elapsed = this.getCurrentTime()
      if (elapsed >= this.duration) {
        this.stop(true)
      } else {
        this.emit()
      }
    }, 150)

    this.emit()
  }

  pause() {
    this.isPlaying = false
    if (this.currentUrl && !this.currentUrl.startsWith("synth:")) {
      this.audioEl?.pause()
    } else if (this.audioCtx) {
      this.pausedAt = Math.min(this.duration, this.audioCtx.currentTime - this.startTime)
    }
    if (this.synthTimer) {
      window.clearInterval(this.synthTimer)
      this.synthTimer = null
    }
    if (this.progressTimer) {
      window.clearInterval(this.progressTimer)
      this.progressTimer = null
    }
    this.emit()
  }

  seek(seconds: number) {
    const clamped = Math.max(0, Math.min(this.duration, seconds))
    if (this.currentUrl && !this.currentUrl.startsWith("synth:")) {
      if (this.audioEl) {
        this.audioEl.currentTime = clamped
      }
    } else {
      this.pausedAt = clamped
      if (this.audioCtx) {
        this.startTime = this.audioCtx.currentTime - clamped
      }
    }
    this.emit()
  }

  stop(ended = false) {
    this.isPlaying = false
    this.pausedAt = 0
    if (this.audioEl) {
      this.audioEl.pause()
      this.audioEl.currentTime = 0
    }
    if (this.synthTimer) {
      window.clearInterval(this.synthTimer)
      this.synthTimer = null
    }
    if (this.progressTimer) {
      window.clearInterval(this.progressTimer)
      this.progressTimer = null
    }
    this.emit(ended)
  }
}

export const snippetEngine = new AudioSnippetEngine()

export function formatSnippetTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec || 0))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${rem < 10 ? "0" : ""}${rem}`
}
