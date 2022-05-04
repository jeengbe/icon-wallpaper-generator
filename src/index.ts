import { DefaultPalette } from "./palette";
import "./style.scss";
import { Wallpaper } from "./wallpaper";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const wallpaper = new Wallpaper(canvas, new DefaultPalette());
window.addEventListener("resize", wallpaper.render.bind(wallpaper));
wallpaper.render();
wallpaper.startRefreshTimer();
