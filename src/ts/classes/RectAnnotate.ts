import Image from "./Image";
import Canvas from "./Canvas";
import { Config, defaultConfig } from "../interfaces/Config";

class RectAnnotate
{
	image!: Image;
	config: Config;

	constructor(selector: string, config?: object)
	{
		this.config = config ? { ...defaultConfig, ...config } as Config : defaultConfig;

		// Only when dom has been loaded we do our stuff, to avoid 0 width and height of image element, and  other such problems
		this.loaded().then(() =>
		{
			this.image = new Image(selector, this.config);
			new Canvas(this.image, this.config);
		});
	}

	loaded(): Promise<string>
	{
		return new Promise<string>((resolve) =>
		{
			window.addEventListener("load", function ()
			{
				resolve("Loaded");
			});
		});
	}
}

export default RectAnnotate;
