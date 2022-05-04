import { iconCodes } from "./codes";
import type { Palette } from "./palette";

export class Icon {
  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected name: string,
    protected font: string,
    protected color: string,
    protected x: number,
    protected y: number,
    protected buffer: number,
    protected rotation: number
  ) { }

  setName(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setColor(color: string) {
    this.color = color;
  }

  setRotation(rotation: number) {
    this.rotation = rotation;
  }

  fillBackground(color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.x - this.buffer / 2, this.y - this.buffer / 2, this.buffer, this.buffer);
  }

  update() {
    document.fonts.load(this.font).then(this.draw.bind(this));
  }

  protected draw() {
    this.ctx.save();
    this.ctx.font = this.font;
    this.ctx.fillStyle = this.color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.rotation);

    this.ctx.fillText(this.name, 0, 0);
    this.ctx.restore();
  }

  tick(palette: Palette): boolean {
    let action = false;
    if (Math.random() < .2) {
      this.setName(getRandomIcon());
      action = true;
    }

    if (Math.random() < .1) {
      const maxRotation = Math.PI / 8;
      const minRotation = -Math.PI / 8;
      const rotation = Math.random() * (maxRotation - minRotation) + minRotation;

      this.setRotation(rotation);
      action = true;
    }

    if (Math.random() < .8) {
      this.setColor(palette.getIconColor());
      action = true;
    }
    return action;
  }
}

export class CircleIcon extends Icon {
  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected name: string,
    protected font: string,
    protected color: string,
    protected x: number,
    protected y: number,
    protected buffer: number,
    protected rotation: number,
    protected backgroundColor: string
  ) {
    super(ctx, name, font, color, x, y, buffer, rotation);
  }

  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.buffer / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fill();
    this.ctx.restore();
    super.draw();
  }
}

export function getRandomIcon() {
  return iconCodes[Math.floor(Math.random() * iconCodes.length)];
}
