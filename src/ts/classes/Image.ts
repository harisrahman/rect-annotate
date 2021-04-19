import { Config } from "../interfaces/Config";

class Image
{
	element: HTMLImageElement;
	top: number;
	bottom: number;
	left: number;
	right: number;
	height: number;
	width: number;
	realToViewRelativeSizeFactor: number = 1;
	viewToRealRelativeSizeFactor: number = 1;

	constructor(private selector: string, private config: Config)
	{
		const element = document.querySelector(selector) as HTMLImageElement;

		if (element && element.tagName == 'IMG')
		{
			this.element = element;

			const rect = element.getBoundingClientRect();

			this.top = rect.top;
			this.bottom = rect.bottom;
			this.left = rect.left;
			this.right = rect.right;
			this.height = rect.height;
			this.width = rect.width;

			this.setRelativeSizeFactor();
		}
		else
		{
			throw "Invalid selector";
		}
	}

	setRelativeSizeFactor()
	{
		if (this.config.actualImageSizeInCoords)
		{
			const realWidth = this.element.naturalWidth;
			const viewWidth = this.element.width;

			this.realToViewRelativeSizeFactor = realWidth / viewWidth;
			this.viewToRealRelativeSizeFactor = viewWidth / realWidth;
		}
	}

}

export default Image;