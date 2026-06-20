declare module "simpleheat" {
  export interface SimpleHeat {
    data(data: [number, number, number][]): SimpleHeat;
    max(max: number): SimpleHeat;
    radius(radius: number, blur?: number): SimpleHeat;
    gradient(gradient: Record<number, string>): SimpleHeat;
    resize(): SimpleHeat;
    draw(minOpacity?: number): SimpleHeat;
  }

  export default function simpleheat(canvas: HTMLCanvasElement): SimpleHeat;
}
