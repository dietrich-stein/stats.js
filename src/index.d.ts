declare class Stats {
  constructor(config? : {
    maxFps? : number,
    maxMb? : number,
    drawInterval? : number,
    containerStyle? : string,
    canvasStyle? : string
    showFps? : boolean,
    showMs? : boolean,
    showMb? : boolean
    frameColor? : string,
    graphColor? : string,
    fpsColor? : string,
    fpsTextColor? :  string,
    msColor? : string,
    msTextColor? : string,
    mbColor? : string,
    mbTextColor? : string,
  });
	
  dom: HTMLDivElement;

  getFps(): number;
  getMs(): number;
  getMb(): number;
  begin(): void;
  end(): number;
  update(): void;
}

declare module '@dietrich-stein/stats.js' {
  export = Stats;
}
