import { Icon } from "./icon";
import { Color } from "./utils";

export type IconTickFunction = (icon: Icon, icons: Icon[][], x: number, y: number) => unknown;

export abstract class Palette {
  abstract getBackgroundColor(): string;
  abstract getIconFont(): string;
  abstract getIconColor(): Color;
  abstract getRandomColor(): string;

  getIconTicks(): (
    IconTickFunction | {
      element: IconTickFunction;
      probability: number;
    }
  )[] {
    return [
      {
        element: (icon) => {
          const maxRotation = Math.PI / 2;
          const minRotation = -Math.PI / 2;
          const rotation = Math.random() * (maxRotation - minRotation) + minRotation;

          icon.setRotation(rotation);
        },
        probability: .25
      },
      {
        element: (icon, icons, x, y) => {
          const maxX = icons.length - 1;
          const maxY = icons[x].length - 1;

          const neighbours: [x: number, y: number][] = [];
          if (x > 1) neighbours.push([x - 1, y]);
          if (x < maxX - 1) neighbours.push([x + 1, y]);
          if (y > 1) neighbours.push([x, y - 1]);
          if (y < maxY - 1) neighbours.push([x, y + 1]);

          const rand = neighbours[Math.floor(Math.random() * neighbours.length)];

          if (rand) {
            const randomNeighbour = icons[rand[0]][rand[1]];
            const tempPos = icon.getPosition();
            icon.setPosition(randomNeighbour.getPosition());
            randomNeighbour.setPosition(tempPos);

            icons[rand[0]][rand[1]] = icon;
            icons[x][y] = randomNeighbour;
          }
        },
        probability: .5
      },
      (icon) => icon.setColor(this.getIconColor()),
    ];
  }
}


export class DefaultPalette extends Palette {
  getBackgroundColor() {
    return "#343434";
  }

  getIconFont() {
    return `900 64px "Line Awesome Free"`;
  }

  getIconColor() {
    if (Math.random() < .8) return "#777" as Color;

    return this.getRandomColor();
  }

  getRandomColor() {
    const minH = 0;
    const maxH = 360;
    const minS = 40;
    const maxS = 60;
    const minL = 60;
    const maxL = 90;

    return "hsl(" + (Math.floor(Math.random() * (maxH - minH)) + minH) + "," + (Math.floor(Math.random() * (maxS - minS)) + minS) + "%," + (Math.floor(Math.random() * (maxL - minL)) + minL) + "%)" as Color;
  }
}
