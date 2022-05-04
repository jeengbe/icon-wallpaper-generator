
export class Icon {
  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected name: string,
    protected font: string,
    protected color: string,
    protected x: number,
    protected y: number,
    protected buffer: number
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

  fillBackground(color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.x - this.buffer / 2, this.y - this.buffer / 2, this.buffer, this.buffer);
  }

  draw() {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    document.fonts.load(this.font).then(() => {
      this.ctx.font = this.font;
      this.ctx.fillStyle = this.color;
      this.ctx.fillText(this.name, this.x, this.y);
    });
  }
}
