import { iconCodes } from "./codes";
import { Color, Scheduler, Transition } from "./utils";

export interface RenderOptions {
  font: string;
  color: Color;
}

export interface Location {
  x: number;
  y: number;
  rotation: number;
}

const ANIMATION_DURATION = 1000;

export class Icon {
  protected x: Transition<number>;
  protected y: Transition<number>;
  protected rotation: Transition<number>;
  protected color: Transition<Color>;

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected name: string,
    protected renderOptions: RenderOptions,
    location: Location,
    protected buffer: number,
    protected scheduler: Scheduler
  ) {
    this.x = new Transition(location.x);
    this.y = new Transition(location.y);
    this.rotation = new Transition(location.rotation);
    this.color = new Transition<Color>(renderOptions.color);
  }

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;

    return this;
  }

  getColor() {
    return this.color.getTo();
  }
  setColor(color: Color, animate = true) {
    if (color !== this.color.getValue()) {
      this.scheduler.pushAnimation();
      this.color.animate(color, animate ? ANIMATION_DURATION : 0, this.scheduler.popAnimation.bind(this));
    }

    return this;
  }

  getRotation() {
    return this.rotation.getTo();
  }
  setRotation(rotation: number, animate = true) {
    if (rotation !== this.rotation.getValue()) {
      this.scheduler.pushAnimation();
      this.rotation.animate(rotation, animate ? ANIMATION_DURATION : 0, this.scheduler.popAnimation.bind(this));
    }

    return this;
  }

  setLocation(x: number, y: number, animate = true) {
    if (x !== this.x.getValue() || y !== this.y.getValue()) {
      this.scheduler.pushAnimation();
      this.scheduler.pushAnimation();
      this.x.animate(x, animate ? ANIMATION_DURATION : 0, this.scheduler.popAnimation.bind(this));
      this.y.animate(y, animate ? ANIMATION_DURATION : 0, this.scheduler.popAnimation.bind(this));
    }

    return this;
  }

  render() {
    document.fonts.load(this.renderOptions.font).then(this.draw.bind(this, this.x.getValue(), this.y.getValue(), this.rotation.getValue()));
  }

  protected draw(x: number, y: number, rotation: number) {
    const { font } = this.renderOptions;
    const color = this.color.getValue();

    this.ctx.save();
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);

    this.ctx.fillText(this.name, 0, 0);
    this.ctx.restore();
  }
}

// export class CircleIcon extends Icon {
//   constructor(
//     protected ctx: CanvasRenderingContext2D,
//     protected name: string,
//     protected font: string,
//     protected color: string,
//     protected x: number,
//     protected y: number,
//     protected buffer: number,
//     protected rotation: number,
//     protected backgroundColor: string
//   ) {
//     super(ctx, name, font, color, x, y, buffer, rotation);
//   }

//   draw() {
//     this.ctx.save();
//     this.ctx.beginPath();
//     this.ctx.arc(this.x, this.y, this.buffer / 2, 0, 2 * Math.PI);
//     this.ctx.fillStyle = this.backgroundColor;
//     this.ctx.fill();
//     this.ctx.restore();
//     super.draw();
//   }
// }

export function getRandomIconName() {
  return iconCodes[Math.floor(Math.random() * iconCodes.length)];
}
