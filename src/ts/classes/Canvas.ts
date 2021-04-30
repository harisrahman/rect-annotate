import Image from "./Image";
import Rectangle from "./Rectangle";
import { Config } from "../interfaces/Config";

class Canvas
{
	element: HTMLCanvasElement;
	rectangles: Rectangle[];
	mousedown: boolean = false;
	current_rectangle?: Rectangle;
	live?: HTMLImageElement;
	screenHeight: number;
	screenHeightReduceByInScrollThreshold: number = 100;
	scrollByOnReachingThreshold: number = 100;

	constructor(public image: Image, private config: Config)
	{
		this.element = document.createElement("canvas");
		this.screenHeight = document.documentElement.clientHeight;
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
		const wrapper = document.createElement('div');
		wrapper.className = "rect-annotate-wrapper";
		this.image.element.parentNode!.insertBefore(wrapper, this.image.element);
		wrapper.appendChild(this.image.element);
		wrapper.append(this.element);

		this.updatePosAndDimensions();
	}

	updatePosAndDimensions()
	{
		this.image.updateDimensions();

		this.element.width = Math.round(this.image.width);
		this.element.height = Math.round(this.image.height);
		this.element.style.top = Math.round(this.image.offsetY) + "px";
		this.element.style.left = Math.round(this.image.offsetX) + "px";
	}

	startPosition(X: number, Y: number)
	{
		this.current_rectangle = new Rectangle(X, Y, X, Y, this, this.config);
	}

	drag(toX: number, toY: number, clientX: number, clientY: number)
	{
		if (this.screenHeight - this.screenHeightReduceByInScrollThreshold < clientY) this.doScroll();

		this.current_rectangle!.updateTo(toX, toY);
	}

	endPosition(X: number, Y: number)
	{
		if (this.current_rectangle)
		{
			this.current_rectangle.updateToNaturalCoords().addToArray(this.rectangles);
		}
	}

	undo()
	{
		if (this.rectangles.length > 0)
		{
			this.rectangles[0].clearLast(this.rectangles);
		}
	}

	clearAll()
	{
		if (this.rectangles.length > 0)
		{
			this.rectangles[0].clearAll(this.rectangles);
		}
	}

	doScroll()
	{
		let scrollElement;

		if (document.body.scrollHeight > document.body.clientHeight)
		{
			scrollElement = document.body;
		}
		else if (document.documentElement.scrollHeight > document.documentElement.clientHeight)
		{
			scrollElement = document.documentElement;
		}

		if (scrollElement)
		{
			scrollElement.scrollBy(0, this.scrollByOnReachingThreshold);
		}
		else
		{
			window.scrollBy(0, this.scrollByOnReachingThreshold);
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
				this.drag(e.offsetX, e.offsetY, e.clientX, e.clientY);
			}
		});

		if (this.config.keyboardShortcuts)
		{
			window.addEventListener("keydown", (e) =>
			{
				if (e.key == "z" && e.ctrlKey)
				{
					this.undo();
				}
				if (e.key == "b" && e.ctrlKey)
				{
					this.clearAll();
				}
			});
		}


		window.addEventListener("resize", () =>
		{
			this.screenHeight = document.documentElement.clientHeight;
			const oldViewToRealRelativeSizeFactor: number = this.image.viewToRealRelativeSizeFactor;

			this.updatePosAndDimensions();

			if (this.rectangles.length)
			{
				this.rectangles[0].vpChanged(this.rectangles, oldViewToRealRelativeSizeFactor);
			}
		});

		if (this.config.clearBtn)
		{
			const clearBtn = document.querySelector(this.config.clearBtn);

			if (clearBtn)
			{
				clearBtn.addEventListener("click", () =>
				{
					this.clearAll();
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
					this.undo();
				});
			}
		}
	}
}

export default Canvas;