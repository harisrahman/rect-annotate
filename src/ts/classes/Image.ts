import { Config } from "../interfaces/Config";

class Image
{
	element: HTMLImageElement;
	top!: number;
	bottom!: number;
	left!: number;
	right!: number;
	height!: number;
	width!: number;
	offsetX!: number
	offsetY!: number;
	realToViewRelativeSizeFactor: number = 1;
	viewToRealRelativeSizeFactor: number = 1;

	constructor(private selector: string, private config: Config)
	{
		const element = document.querySelector(selector) as HTMLImageElement;

		if (element && element.tagName == 'IMG')
		{
			this.element = element;
			this.updateDimensions();
		}
		else
		{
			throw "Invalid selector";
		}
	}

	updateDimensions()
	{
		const rect = this.element.getBoundingClientRect();

		this.top = rect.top;
		this.bottom = rect.bottom;
		this.left = rect.left;
		this.right = rect.right;
		this.height = rect.height;
		this.width = rect.width;
		this.offsetX = this.element.offsetLeft;
		this.offsetY = this.element.offsetTop;

		this.setRelativeSizeFactor();
	}

	// Actual mage size relative to size currently showing on viewport and vice versa 
	setRelativeSizeFactor(): Image
	{
		if (this.config.actualImageSizeInCoords)
		{
			const realWidth = this.element.naturalWidth;
			const viewWidth = this.element.width;

			this.realToViewRelativeSizeFactor = realWidth / viewWidth;
			this.viewToRealRelativeSizeFactor = viewWidth / realWidth;
		}

		return this;
	}

}

export default Image;