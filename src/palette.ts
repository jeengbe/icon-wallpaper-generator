export abstract class Palette {
  abstract getBackgroundColor(): string;
  abstract getIconFont(): string;
  abstract getIconColor(): string;
  abstract getRandomColor(): string;
}


export class DefaultPalette extends Palette {
  getBackgroundColor() {
    return "#343434";
  }

  getIconFont() {
    return `900 64px "Line Awesome Free"`;
  }

  getIconColor() {
    if (Math.random() < .8) return "#777";

    return this.getRandomColor();
  }

  getRandomColor() {
    const minH = 0;
    const maxH = 360;
    const minS = 40;
    const maxS = 60;
    const minL = 60;
    const maxL = 90;

    return "hsl(" + (Math.floor(Math.random() * (maxH - minH)) + minH) + "," + (Math.floor(Math.random() * (maxS - minS)) + minS) + "%," + (Math.floor(Math.random() * (maxL - minL)) + minL) + "%)";
  }
}
