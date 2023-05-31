declare class Stats {
	constructor(config? : {
		maxFPS? : number,
		maxMem? : number,
		customGraphConf? : {color : string, max: number}[],
		drawInterval? : number,
		containerStyle? : string,
		canvasStyle? : string
		showFPS? : boolean,
		showMS? : boolean,
		showMB? : boolean
	});
	
	dom: HTMLDivElement;
	getFps(): number;
	getMs(): number;
	getMem(): number;

	setText(text: string) : void;

	begin(): void;
	end(customGraphValue?: number[]): number;
	update(customGraphValue?: number[]): void;
}

declare module '@drecom/stats.js' {
	export = Stats;
}
