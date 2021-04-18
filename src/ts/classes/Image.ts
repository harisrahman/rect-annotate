class Image
{
	element: HTMLImageElement;
	top: number;
	bottom: number;
	left: number;
	right: number;
	height: number;
	width: number;

	constructor(private selector: string)
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
		}
		else
		{
			throw "Invalid selector";
		}
	}

}

export default Image;