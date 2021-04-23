export interface Config
{
	color: string,
	strokeWidth: number,
	minHeight: number,
	minWidth: number,
	clearBtn: string,
	undoBtn: string,
	form: string | null,
	inputName: string,
	actualImageSizeInCoords: boolean,
	allowOverlap: boolean,
	keyboardShortcuts: boolean,
	load: Array<[number, number, number, number]> | null
}

export const defaultConfig: Config = {
	color: "#000",
	strokeWidth: 3,
	minHeight: 5,
	minWidth: 5,
	clearBtn: "#clearRectAnnotate",
	undoBtn: "#undoRectAnnotate",
	form: "#rectAnnotateForm",
	inputName: "coords",
	actualImageSizeInCoords: true,
	allowOverlap: false,
	keyboardShortcuts: true,
	load: null
}
