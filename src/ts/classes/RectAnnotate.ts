import Image from "./Image";
import Canvas from "./Canvas";
import { Config, DefaultConfig } from "../interfaces/Config";


class RectAnnotate
{
	image!: Image;
	config: Config;

	constructor(selector: string, config?: object)
	{
		this.config = config ? { ...DefaultConfig, config } as Config : DefaultConfig;

		this.loaded().then(() =>
		{
			this.image = new Image(selector);
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
