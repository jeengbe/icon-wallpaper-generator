import mix from "mix-css-color";

export type Color = string & { __color: true; };

export class Transition<T extends number | Color> {
  private from: T;
  private to: T;
  private value: T;
  #isAnimating: boolean;
  private easing: (progress: number) => number;
  private start: number;
  private duration: number;
  private onDone?: () => unknown;

  private morph(from: T, to: T, progress: number): T {
    if (typeof from === "number" || typeof to === "number") {
      return <number>from + (<number>to - <number>from) * progress as T;
    } else {
      try {
        return mix(from, to, 100 * (1 - progress)).hex as T;
      } catch (e) {
        console.error(e);
        return from;
      }
    }
  }

  constructor(from: T) {
    this.from = from;
    this.to = from;
    this.value = from;
    this.#isAnimating = false;
    this.easing = x => 1 - (1 - x) * (1 - x);
    this.start = 0;
    this.duration = 0;
  }

  isAnimating() {
    return this.#isAnimating;
  }

  getValue(now: number) {
    if (this.#isAnimating) this.update(now);
    return this.value;
  }

  getTo() {
    return this.to;
  }

  animate(to: T, duration: number, onDone?: () => unknown) {
    if (this.#isAnimating) this.onDone?.();
    this.from = this.value;
    this.to = to;
    this.duration = duration;
    this.start = performance.now();
    this.#isAnimating = true;
    this.onDone = onDone;
  }

  private update(now: number) {
    const progress = (now - this.start) / this.duration;
    if (progress >= 1) {
      this.from = this.to;
      this.value = this.to;
      this.#isAnimating = false;
      this.onDone?.();
    } else {
      this.value = this.morph(this.from, this.to, this.easing(progress));
    }
  }
}

export class Scheduler {
  private jobs = 0;
  private raf?: number;

  constructor(
    private render: (now: number) => void
  ) { }

  start() {
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
    if (this.jobs <= 0) this.stop();
  }

  private tick() {
    this.render(performance.now());
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
