import mix from "mix-css-color";

export type Color = string & { __color: true; };

export class Transition<T extends number | Color> {
  private from: T;
  private to: T;
  private value: T;
  private isAnimating: boolean;
  private easing: (progress: number) => number;
  private start: number;
  private duration: number;
  private onDone?: () => unknown;

  private morph(from: T, to: T, progress: number): T {
    if (typeof from === "number" || typeof to === "number") {
      return <number>from + (<number>to - <number>from) * progress as T;
    } else {
      return mix(from, to, 100 * (1 - progress)).hex as T;
    }
  }

  constructor(from: T) {
    this.from = from;
    this.to = from;
    this.value = from;
    this.isAnimating = false;
    this.easing = x => 1 - (1 - x) * (1 - x);
    this.start = 0;
    this.duration = 0;
  }

  getValue() {
    if (this.isAnimating) this.update();
    return this.value;
  }

  getTo() {
    return this.to;
  }

  animate(to: T, duration: number, onDone?: () => unknown) {
    if (this.isAnimating) this.onDone?.();
    this.from = this.value;
    this.to = to;
    this.duration = duration;
    this.start = Date.now();
    this.isAnimating = true;
    this.onDone = onDone;
    return to;
  }

  private update() {
    const progress = (Date.now() - this.start) / this.duration;
    if (progress >= 1) {
      this.from = this.value = this.to;
      this.isAnimating = false;
      this.onDone?.();
    } else {
      this.value = this.morph(this.from, this.to, this.easing(progress));
    }
  }
}

export class Scheduler {
  private jobs = 0;
  private lastFrame = 0;
  private raf?: number;

  constructor(
    private render: () => void,
    private fps = 144
  ) { }

  start() {
    this.jobs = 0;
    this.tick();
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  pushAnimation() {
    this.jobs++;
    if (this.jobs === 1) this.start();
  }

  popAnimation() {
    this.jobs--;
    if (this.jobs === 0) this.stop();
  }

  private tick() {
    const now = Date.now();
    const delta = now - this.lastFrame;
    if (delta > 1000 / this.fps) {
      this.render();
    }
    this.raf = requestAnimationFrame(this.tick.bind(this));
  }
}

export function randomElement<T>(elements: (T | {
  probability: number;
  element: T;
})[]): T {
  let sum = 0;
  for (const element of elements) {
    sum += "probability" in element ? element.probability : 1;
  }

  let value = Math.random() * sum;
  for (const element of elements) {
    value -= "probability" in element ? element.probability : 1;
    if (value < 0) return "element" in element ? element.element : element;
  }
  const element = elements[elements.length - 1];
  return "element" in element ? element.element : element;
}
