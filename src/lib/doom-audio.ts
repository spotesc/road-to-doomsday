type Param = AudioParam;

const LOOKAHEAD = 0.12;
const WAKE_MS = 25;

function envelope(param: Param, at: number, attack: number, peak: number, decay: number) {
  param.setValueAtTime(0.0001, at);
  param.exponentialRampToValueAtTime(Math.max(peak, 0.0002), at + attack);
  param.exponentialRampToValueAtTime(0.0001, at + attack + decay);
}

export class DoomAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private wet: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private brown: AudioBuffer | null = null;
  private loops: AudioScheduledSourceNode[] = [];
  private timer: number | null = null;
  private suspendTimer: number | null = null;
  private lastSecond = 0;
  private nextTension = 0;
  private tensionKind = 0;
  private target = Number.POSITIVE_INFINITY;
  private volume = 0.6;
  private muted = false;
  private running = false;

  setTarget(ms: number) {
    this.target = ms;
    this.updateDrone(false);
  }

  async start(volume: number) {
    this.volume = volume;
    this.muted = false;
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    this.cancelSuspend();
    if (ctx.state !== "running") await ctx.resume();

    this.running = true;
    this.lastSecond = Math.floor(Date.now() / 1000);
    this.nextTension = ctx.currentTime + 20 + Math.random() * 15;

    const gain = this.master!.gain;
    gain.cancelScheduledValues(ctx.currentTime);
    gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.setTargetAtTime(this.level(), ctx.currentTime + 0.05, 0.9);
    this.updateDrone(true);

    if (this.timer === null) this.timer = window.setInterval(this.schedule, WAKE_MS);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (!this.ctx || this.muted) return;
    this.master!.gain.setTargetAtTime(this.level(), this.ctx.currentTime, 0.06);
  }

  async setMuted(muted: boolean) {
    this.muted = muted;
    const ctx = this.ctx;
    if (!ctx) return;
    if (muted) {
      this.master!.gain.cancelScheduledValues(ctx.currentTime);
      this.master!.gain.setTargetAtTime(0, ctx.currentTime, 0.015);
      this.cancelSuspend();
      this.suspendTimer = window.setTimeout(() => ctx.suspend(), 250);
    } else {
      this.cancelSuspend();
      this.lastSecond = Math.floor(Date.now() / 1000);
      if (ctx.state !== "running") await ctx.resume();
      this.master!.gain.setTargetAtTime(this.level(), ctx.currentTime, 0.35);
    }
  }

  destroy() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    this.cancelSuspend();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.running = false;
    for (const source of this.loops) {
      try {
        source.stop();
      } catch {}
    }
    this.loops = [];
    this.ctx?.close();
    this.ctx = null;
  }

  private level() {
    return 0.9 * this.volume * this.volume;
  }

  private cancelSuspend() {
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    this.suspendTimer = null;
  }

  private onVisibility = () => {
    const ctx = this.ctx;
    if (!ctx || !this.running) return;
    if (document.hidden) {
      ctx.suspend();
    } else if (!this.muted) {
      this.lastSecond = Math.floor(Date.now() / 1000);
      ctx.resume();
    }
  };

  private build() {
    const ctx = new AudioContext({ latencyHint: "interactive" });
    this.ctx = ctx;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 10;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.3;

    const master = ctx.createGain();
    master.gain.value = 0.0001;
    const bus = ctx.createGain();

    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(2.4);
    const wet = ctx.createGain();
    wet.gain.value = 0.3;
    const darken = ctx.createBiquadFilter();
    darken.type = "lowpass";
    darken.frequency.value = 2400;

    bus.connect(compressor);
    wet.connect(reverb).connect(darken).connect(compressor);
    compressor.connect(master).connect(ctx.destination);

    this.master = master;
    this.bus = bus;
    this.wet = wet;
    this.noise = this.whiteNoise(2);
    this.brown = this.brownNoise(4);
    this.buildDrone();
  }

  private buildDrone() {
    const ctx = this.ctx!;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.0001;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 130;
    filter.Q.value = 0.9;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.031;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 45;
    lfo.connect(lfoDepth).connect(filter.frequency);

    const tones: [OscillatorType, number, number][] = [
      ["sawtooth", 41.2, 0.5],
      ["sawtooth", 41.2 * 1.0045, 0.5],
      ["sine", 61.7, 0.35],
    ];
    for (const [type, freq, level] of tones) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g).connect(filter);
      osc.start();
      this.loops.push(osc);
    }

    const bed = ctx.createBufferSource();
    bed.buffer = this.brown;
    bed.loop = true;
    const bedFilter = ctx.createBiquadFilter();
    bedFilter.type = "lowpass";
    bedFilter.frequency.value = 320;
    const bedGain = ctx.createGain();
    bedGain.gain.value = 0.6;
    bed.connect(bedFilter).connect(bedGain).connect(droneGain);
    bed.start();

    filter.connect(droneGain);
    droneGain.connect(this.bus!);
    const droneSend = ctx.createGain();
    droneSend.gain.value = 0.4;
    droneGain.connect(droneSend).connect(this.wet!);

    lfo.start();
    this.loops.push(lfo, bed);
    this.droneGain = droneGain;
  }

  private updateDrone(slowly: boolean) {
    const ctx = this.ctx;
    if (!ctx || !this.droneGain || !this.running) return;
    const days = Number.isFinite(this.target) ? (this.target - Date.now()) / 86_400_000 : 30;
    const closeness = Math.min(1, Math.max(0, 1 - days / 30));
    const level = 0.03 + 0.06 * closeness;
    this.droneGain.gain.setTargetAtTime(level, ctx.currentTime, slowly ? 9 : 3);
  }

  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx || !this.running || this.muted || ctx.state !== "running") return;

    let contextTime = ctx.currentTime;
    let wall = Date.now();
    if (typeof ctx.getOutputTimestamp === "function") {
      const stamp = ctx.getOutputTimestamp();
      if (stamp.contextTime && stamp.performanceTime) {
        contextTime = stamp.contextTime;
        wall = Date.now() - (performance.now() - stamp.performanceTime);
      }
    }

    for (let second = Math.max(this.lastSecond + 1, Math.floor(wall / 1000) + 1); ; second++) {
      const delta = (second * 1000 - wall) / 1000;
      if (delta > LOOKAHEAD) break;
      this.lastSecond = second;
      const at = contextTime + delta;
      if (at <= ctx.currentTime || second * 1000 > this.target) continue;
      this.tick(at, second);
    }

    if (ctx.currentTime + 0.25 >= this.nextTension) {
      this.tension(Math.max(this.nextTension, ctx.currentTime + 0.05));
      this.nextTension = ctx.currentTime + 26 + Math.random() * 24;
    }
  };

  private tick(at: number, second: number) {
    const ctx = this.ctx!;
    const remaining = Math.round(this.target / 1000) - second;
    const strike = Number.isFinite(this.target) && remaining % 60 === 0;
    const tock = second % 2 === 1;
    const drift = 1 + (Math.random() - 0.5) * 0.025;
    const body = (tock ? 0.93 : 1) * drift;
    const weight = 1 + (Math.random() - 0.5) * 0.12;

    const thump = ctx.createOscillator();
    thump.type = "sine";
    const f = 94 * body;
    thump.frequency.setValueAtTime(f * 1.7, at);
    thump.frequency.exponentialRampToValueAtTime(f, at + 0.014);
    thump.frequency.exponentialRampToValueAtTime(f * 0.48, at + 0.18);
    const thumpGain = ctx.createGain();
    envelope(thumpGain.gain, at, 0.002, (strike ? 0.95 : 0.62) * weight, strike ? 0.75 : 0.28);
    thump.connect(thumpGain).connect(this.bus!);
    thump.start(at);
    thump.stop(at + 1.2);

    this.click(at, 1180 * body, 0.85, 0.42 * weight, 0.055, 0.5);

    const base = 196 * body;
    const partials: [number, number, number][] = [
      [1, 0.11, 0.85],
      [2.76, 0.055, 0.55],
      [5.4, 0.028, 0.32],
      [8.93, 0.012, 0.2],
    ];
    for (const [ratio, amp, decay] of partials) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = base * ratio;
      const g = ctx.createGain();
      envelope(g.gain, at + 0.001, 0.003, amp * (strike ? 1.7 : 1) * weight, decay * (strike ? 1.9 : 1));
      osc.connect(g);
      g.connect(this.bus!);
      g.connect(this.wet!);
      osc.start(at);
      osc.stop(at + decay * 2 + 0.1);
    }

    this.click(at + 0.14, 2350 * drift, 1.4, 0.06, 0.03, 0.2);

    if (strike) this.boom(at, 0.7, 1.9);
  }

  private click(at: number, freq: number, q: number, peak: number, decay: number, send: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = freq;
    band.Q.value = q;
    const soften = ctx.createBiquadFilter();
    soften.type = "lowpass";
    soften.frequency.value = 4200;
    const g = ctx.createGain();
    envelope(g.gain, at, 0.0015, peak, decay);
    src.connect(band).connect(soften).connect(g);
    g.connect(this.bus!);
    const s = ctx.createGain();
    s.gain.value = send;
    g.connect(s).connect(this.wet!);
    src.start(at, Math.random() * 1.5, decay + 0.05);
  }

  private boom(at: number, peak: number, decay: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(48, at);
    osc.frequency.exponentialRampToValueAtTime(29, at + decay);
    const g = ctx.createGain();
    envelope(g.gain, at, 0.02, peak, decay);
    osc.connect(g);
    g.connect(this.bus!);
    g.connect(this.wet!);
    osc.start(at);
    osc.stop(at + decay + 0.2);
  }

  private tension(at: number) {
    const ctx = this.ctx!;
    this.tensionKind = (this.tensionKind + 1) % 2;

    if (this.tensionKind === 0) {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const low = ctx.createBiquadFilter();
      low.type = "lowpass";
      low.frequency.value = 95;
      const g = ctx.createGain();
      envelope(g.gain, at, 0.03, 0.55, 3.4);
      src.connect(low).connect(g);
      g.connect(this.bus!);
      g.connect(this.wet!);
      src.start(at, Math.random(), 3.6);
      this.boom(at, 0.25, 3);
      return;
    }

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 7;
    band.frequency.setValueAtTime(260, at);
    band.frequency.exponentialRampToValueAtTime(1500, at + 3.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.09, at + 3);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 3.5);
    src.connect(band).connect(g);
    const quiet = ctx.createGain();
    quiet.gain.value = 0.35;
    g.connect(quiet).connect(this.bus!);
    g.connect(this.wet!);
    src.start(at, Math.random(), 3.6);
  }

  private whiteNoise(seconds: number) {
    const ctx = this.ctx!;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private brownNoise(seconds: number) {
    const ctx = this.ctx!;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.2;
    }
    return buffer;
  }

  private impulse(seconds: number) {
    const ctx = this.ctx!;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let smooth = 0;
      for (let i = 0; i < length; i++) {
        const t = i / length;
        const raw = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.2);
        smooth += 0.22 * (raw - smooth);
        data[i] = smooth * 1.8;
      }
    }
    return buffer;
  }
}
