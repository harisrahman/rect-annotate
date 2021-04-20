import Image from "./Image";
import Rectangle from "./Rectangle";
import { Config } from "../interfaces/Config";

class Canvas
{
	element: HTMLCanvasElement;
	rectangles: Rectangle[];
	mousedown: boolean = false;
	current_rectangle?: Rectangle;

	constructor(public image: Image, private config: Config)
	{
		this.element = document.createElement("canvas");
		this.rectangles = [];

		this.setup();
	}

	setup()
	{
		this.addCanvas();
		this.addListeners();
		this.addLoaded();
	}

	// Rectangles added from load option in config object
	addLoaded()
	{
		if (!(this.config.load && Array.isArray(this.config.load) && this.config.load.length > 0)) return;

		let rect: Rectangle;

		this.config.load.forEach(element =>
		{
			if (element.length != 4) return;

			rect = new Rectangle(...element, this, this.config, true);
			rect.draw();
			rect.addToArray(this.rectangles);
		});

	}

	// Canvas is made of same dimensions as image and added body 
	addCanvas()
	{
		this.element.width = this.image.width;
		this.element.height = this.image.height;

		this.element.style.top = this.image.top + "px";
		this.element.style.left = this.image.left + "px";

		document.querySelector("body")!.append(this.element);
	}

	startPosition(X: number, Y: number)
	{
		this.current_rectangle = new Rectangle(X, Y, X, Y, this, this.config);
	}

	drag(toX: number, toY: number)
	{
		this.current_rectangle!.updateTo(toX, toY);
	}

	endPosition(X: number, Y: number)
	{
		if (this.current_rectangle)
		{
			this.current_rectangle.updateToNaturalCoords().addToArray(this.rectangles);
		}
	}

	addListeners()
	{
		this.element.addEventListener("mousedown", (e) =>
		{
			this.mousedown = true;
			this.startPosition(e.offsetX, e.offsetY);
		});

		this.element.addEventListener("mouseup", (e) =>
		{
			this.mousedown = false;
			this.endPosition(e.offsetX, e.offsetY);
		});

		this.element.addEventListener("mousemove", (e) =>
		{
			if (this.mousedown)
			{
				this.drag(e.offsetX, e.offsetY);
			}
		});

		if (this.config.clearBtn)
		{
			const clearBtn = document.querySelector(this.config.clearBtn);

			if (clearBtn)
			{
				clearBtn.addEventListener("click", () =>
				{
					if (this.rectangles.length > 0)
					{
						this.rectangles[0].clearAll(this.rectangles);
					}
				});
			}
		}

		if (this.config.undoBtn)
		{
			const undoBtn = document.querySelector(this.config.undoBtn);

			if (undoBtn)
			{
				undoBtn.addEventListener("click", () =>
				{
					if (this.rectangles.length > 0)
					{
						this.rectangles[0].clearLast(this.rectangles);
					}
				});
			}
		}
	}

}

export default Canvas;