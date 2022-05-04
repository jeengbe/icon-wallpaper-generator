import { CircleIcon, getRandomIcon, Icon } from "./icon";
import type { Palette } from "./palette";

export class Wallpaper {
  protected ctx: CanvasRenderingContext2D;
  protected icons: Icon[][] = [];

  constructor(protected canvas: HTMLCanvasElement, protected palette: Palette) {
    this.ctx = canvas.getContext("2d")!;
  }

  render() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.setupIcons();
    this.fillBackground();
    this.drawIcons();
  }

  protected fillBackground() {
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

    for (let i = 0; i < xIcons; i++) {
      this.icons[i] = [];
      for (let j = 0; j < yIcons; j++) {
        const x = (i + .5) * (xGap + size);
        const y = (j + .5) * (yGap + size);
        const icon = this.randomIcon(x, y, size + minGap / 2);
        this.icons[i][j] = icon;
      }
    }
  }

  protected drawIcons() {
    for (const row of this.icons) {
      for (const icon of row) {
        icon.update();
      }
    }
  }

  protected randomIcon(x: number, y: number, buffer: number): Icon {
    let rotation = 0;
    if (Math.random() < .05) {
      const maxRotation = Math.PI / 8;
      const minRotation = -Math.PI / 8;
      rotation = Math.random() * (maxRotation - minRotation) + minRotation;
    }

    return new CircleIcon(this.ctx, getRandomIcon(), this.palette.getIconFont(), "#333", x, y, buffer, rotation, this.palette.getIconColor());
  }


  startRefreshTimer() {
    setTimeout(() => {
      this.updateOneIcon();
      this.startRefreshTimer();
    }, Math.random() * 10000);
  }

  protected updateOneIcon() {
    const x = Math.floor(Math.random() * this.icons.length);
    const y = Math.floor(Math.random() * this.icons[x].length);
    const icon = this.icons[x][y];
    if (icon.tick(this.palette)) {
      icon.fillBackground(this.palette.getBackgroundColor());
      icon.update();
    }
  }
}
