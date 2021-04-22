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
		this.element.width = Math.round(this.image.width);
		this.element.height = Math.round(this.image.height);

		const wrapper = document.createElement('div');
		wrapper.className = "rect-annotate-wrapper";
		this.image.element.parentNode!.insertBefore(wrapper, this.image.element);
		wrapper.appendChild(this.image.element);
		wrapper.append(this.element);
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

		new ResizeObserver((entries: ResizeObserverEntry[]) =>
		{
			const rect = entries[0].target.getBoundingClientRect()

			const imgVpWidth: number = Math.round(rect.width);
			const imgVpHeight: number = Math.round(rect.height);
			let changed: boolean = false;

			if (imgVpWidth != Math.round(this.element.width))
			{
				this.element.width = imgVpWidth;
				changed = true;
			}

			if (imgVpHeight != Math.round(this.element.height))
			{
				this.element.height = imgVpHeight;
				changed = true;
			}

			if (changed && Math.round(this.rectangles.length))
			{
				const oldViewToRealRelativeSizeFactor: number = this.image.viewToRealRelativeSizeFactor;
				this.image.setRelativeSizeFactor();

				this.rectangles[0].vpChanged(this.rectangles, oldViewToRealRelativeSizeFactor);
			}
		}).observe(this.image.element);

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