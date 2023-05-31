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
    frameColor? : '#000022',
    graphColor? : '#112244',
    fpsColor? : '#ffffff',
    fpsTextColor? :  '#ffffff',
    msColor? : '#00ffff',
    msTextColor? : '#00ffff',
    mbColor? : '#ff00ff',
    mbTextColor? : '#ff00ff',
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
