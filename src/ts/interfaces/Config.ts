export interface Config
{
	color: string,
	width: number,
	clearBtn: string,
	undoBtn: string,
}

export const DefaultConfig: Config = {
	color: "#000",
	width: 3,
	clearBtn: "#clearRectAnnotate",
	undoBtn: "#undoRectAnnotate",
}
