import Image from "./Image";
import Rectangle from "./Rectangle";
import { Config } from "../interfaces/Config";

class Canvas
{
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	rectangles: Rectangle[];
	mousedown: boolean = false;
	current_rectangle?: Rectangle;

	constructor(private image: Image, private config: Config)
	{
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
		this.rectangles = [];

		this.setup();
	}

	setup()
	{
		this.addCanvas();
		this.addListeners();
	}

	addCanvas()
	{
		this.canvas.width = this.image.width;
		this.canvas.height = this.image.height;

		this.canvas.style.top = this.image.top + "px";
		this.canvas.style.left = this.image.left + "px";

		document.querySelector("body")!.append(this.canvas);
	}

	startPosition(X: number, Y: number)
	{
		this.current_rectangle = new Rectangle(X, Y, X, Y, this.ctx, this.config);
	}

	drag(toX: number, toY: number)
	{
		this.current_rectangle?.updateTo(toX, toY);
	}

	endPosition(X: number, Y: number)
	{
		if (this.current_rectangle)
		{
			if (Math.abs(this.current_rectangle.width) > 5 && Math.abs(this.current_rectangle.height) > 5)
			{
				this.rectangles.push(this.current_rectangle);
			}
			else
			{
				this.current_rectangle.clear();
			}
		}
	}

	addListeners()
	{
		this.canvas.addEventListener("mousedown", (e) =>
		{
			this.mousedown = true;
			this.startPosition(e.offsetX, e.offsetY);
		});

		this.canvas.addEventListener("mouseup", (e) =>
		{
			this.mousedown = false;
			this.endPosition(e.offsetX, e.offsetY);
		});

		this.canvas.addEventListener("mousemove", (e) =>
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
				clearBtn.addEventListener("click", (e) =>
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
				undoBtn.addEventListener("click", (e) =>
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