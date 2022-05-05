import { getRandomIconName, Icon } from "./icon";
import type { Palette } from "./palette";
import { randomElement, Scheduler } from "./utils";

export class Wallpaper {
  protected ctx: CanvasRenderingContext2D;
  protected icons: Icon[][];
  private scheduler: Scheduler;

  constructor(protected canvas: HTMLCanvasElement, protected palette: Palette) {
    this.ctx = canvas.getContext("2d")!;
    this.scheduler = new Scheduler(this.render.bind(this));
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.setupIcons();
    this.render();
  }

  render() {
    this.renderBackground();
    this.renderIcons();
  }

  protected renderBackground() {
    this.ctx.fillStyle = this.palette.getBackgroundColor();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  protected setupIcons() {
    const minGap = 120;

    const size = 32;
    const xIcons = Math.floor(this.canvas.width / (size + minGap));
    const xGap = this.canvas.width / xIcons - size;

    const yIcons = Math.floor(this.canvas.height / (size + minGap));
    const yGap = this.canvas.height / yIcons - size;

    this.icons = [];
    for (let i = 0; i < xIcons; i++) {
      this.icons[i] = [];
      for (let j = 0; j < yIcons; j++) {
        const x = (i + .5) * (xGap + size);
        const y = (j + .5) * (yGap + size);
        const icon = this.generateRandomIcon(x, y, size + minGap / 2);
        // @ts-ignore
        window.icon = icon;
        this.icons[i][j] = icon;
      }
    }
  }

  protected renderIcons() {
    for (const row of this.icons) {
      for (const icon of row) {
        icon.render();
      }
    }
  }

  protected generateRandomIcon(x: number, y: number, buffer: number): Icon {
    let rotation = 0;
    if (Math.random() < .05) {
      const maxRotation = Math.PI / 8;
      const minRotation = -Math.PI / 8;
      rotation = Math.random() * (maxRotation - minRotation) + minRotation;
    }

    return new Icon(
      this.ctx,
      getRandomIconName(),
      {
        font: this.palette.getIconFont(),
        color: this.palette.getIconColor(),
      },
      {
        x,
        y,
        rotation
      },
      buffer,
      this.scheduler
    );
  }


  startTickTimer() {
    setTimeout(() => {
      this.tickRandomIcon();
      this.startTickTimer();
    }, Math.random() * 100);
  }

  protected tickRandomIcon() {
    const x = Math.floor(Math.random() * this.icons.length);
    const y = Math.floor(Math.random() * this.icons[x].length);
    const icon = this.icons[x][y];

    randomElement(this.palette.getIconTicks())(icon);
  }
}
