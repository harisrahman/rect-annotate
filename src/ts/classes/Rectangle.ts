import Canvas from "./Canvas";
import { Config } from "../interfaces/Config";

class Rectangle
{
	public height!: number;
	public width!: number;
	private ctx: CanvasRenderingContext2D;
	private form?: HTMLFormElement;
	private coordTypes = ["fromX", "fromY", "toX", "toY", "width", "height"] as const;

	constructor(
		public fromX: number,
		public fromY: number,
		public toX: number,
		public toY: number,
		private canvas: Canvas,
		private config: Config,
		private isLoadedFromConfig: boolean = false
	)
	{
		this.ctx = this.canvas.element.getContext("2d") as CanvasRenderingContext2D;
		this.adaptMeasurementsAndCoords();

		if (config.form)
		{
			this.form = document.querySelector(config.form) as HTMLFormElement;
		}
	}

	adaptMeasurementsAndCoords()
	{
		if (this.isLoadedFromConfig)
		{
			this.fromX = Number(this.fromX);
			this.fromY = Number(this.fromY);
			this.toX = Number(this.toX);
			this.toY = Number(this.toY);

			this.toCoordsAreActuallyMeasurements();
		}
		else
		{
			this.addMeasurements();
		}
	}

	toCoordsAreActuallyMeasurements()
	{
		this.width = this.toX;
		this.height = this.toY;

		this.toX = this.fromX + this.width;
		this.toY = this.fromY + this.height;

		this.coordTypes.forEach(coordType =>
		{
			this[coordType] = this[coordType] * this.canvas.image.viewToRealRelativeSizeFactor;
		});
	}

	addMeasurements(): Rectangle
	{
		this.width = (this.toX - this.fromX);
		this.height = (this.toY - this.fromY);

		return this;
	}

	clearLast(rectangles: Rectangle[]): Rectangle[]
	{
		if (rectangles.length < 1) return rectangles;

		this.removeFromForm(rectangles.length - 1);
		rectangles[rectangles.length - 1].clear();
		rectangles.pop();

		this.redrawAll(rectangles);

		return rectangles;
	}

	clearAll(rectangles: Rectangle[], removeFromArray: boolean = true, removeFromForm: boolean = true): Rectangle[]
	{
		this.ctx.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

		if (removeFromForm) this.removeAllFromForm();

		if (removeFromArray) rectangles.length = 0;

		return rectangles;
	}

	addAll(rectangles: Rectangle[], addToForm: boolean = true): Rectangle[]
	{
		rectangles.forEach((rectangle: Rectangle, index: number) =>
		{
			rectangle.draw();
			if (addToForm) rectangle.addToForm(index);
		});

		return rectangles;
	}

	updateTo(toX: number, toY: number): Rectangle
	{
		this.clear();

		this.toX = toX;
		this.toY = toY;

		return this.addMeasurements().draw();
	}

	calculateClearCoords(): [number, number, number, number]
	{
		let fromX: number;
		let fromY: number;
		let width: number;
		let height: number;

		if (this.width < 0)
		{
			fromX = this.fromX + this.config.strokeWidth;
			width = this.width - (this.config.strokeWidth * 2);
		}
		else
		{
			fromX = this.fromX - this.config.strokeWidth;
			width = this.width + (this.config.strokeWidth * 2);
		}

		if (this.height > 0)
		{
			fromY = this.fromY - this.config.strokeWidth;
			height = this.height + (this.config.strokeWidth * 2);
		}
		else
		{
			fromY = this.fromY + this.config.strokeWidth;
			height = this.height - (this.config.strokeWidth * 2);
		}

		return [fromX, fromY, width, height];
	}

	// When a rectangle is done in reverse from left to right, width and height are caluclated to be negetive,
	// and to coords are actually from coords and vice versa. So these are corrected as other functions don't
	// expect this to happen
	updateToNaturalCoords(): Rectangle
	{
		const width = this.toX - this.fromX;
		const height = this.toY - this.fromY;

		if (width < 0)
		{
			const newToX = this.fromX;

			this.fromX = this.toX;
			this.toX = newToX;

			this.width = Math.abs(width);
		}

		if (height < 0)
		{
			const newToY = this.fromY;

			this.fromY = this.toY;
			this.toY = newToY;

			this.height = Math.abs(height);
		}

		return this;
	}

	clear(): Rectangle
	{
		this.ctx.clearRect(...this.calculateClearCoords());

		return this;
	}

	draw(): Rectangle
	{
		this.ctx.strokeStyle = this.config.color;
		this.ctx.lineWidth = this.config.strokeWidth;
		this.ctx.strokeRect(this.fromX, this.fromY, this.width, this.height);

		return this;
	}

	addToForm(index: number): Rectangle
	{
		if (this.form === undefined) return this;

		let input, value;

		const formInputNames = ["fromX", "fromY", "width", "height"] as const;

		formInputNames.forEach(key =>
		{
			value = this[key];
			value = Math.round(value * this.canvas.image.realToViewRelativeSizeFactor);

			input = document.createElement("input");
			input.type = "hidden";
			input.name = `${this.config.inputName}[${index}][${key}]`;
			input.value = value.toString();

			this.form!.append(input);
		});
		return this;
	}

	removeAllFromForm(): Rectangle
	{
		if (this.form === undefined) return this;

		this.form.querySelectorAll(`input[name*='${this.config.inputName}[']`).forEach(el => el.remove());

		return this;
	}

	removeFromForm(index: number): Rectangle
	{
		if (this.form === undefined) return this;

		this.form.querySelectorAll(`input[name*='${this.config.inputName}[${index}]']`).forEach(el => el.remove());

		return this;
	}

	// Current (this) rectangle overlaps with any of the rectangles given in array
	hasOverlap(rectangles: Rectangle[]): boolean
	{
		let overlap = false;

		rectangles.forEach((rectangle: Rectangle, i: number) =>
		{
			if (
				this.fromX <= rectangle.toX &&
				this.toX >= rectangle.fromX &&
				this.fromY <= rectangle.toY &&
				this.toY >= rectangle.fromY
			)
			{
				overlap = true;
			}
		});

		return overlap;
	}

	// Logger
	logPoints(identifier: string = "")
	{
		if (identifier) identifier = identifier + " : ";

		console.log(`${identifier} X = ${this.fromX} => ${this.toX}, Y = ${this.fromY} => ${this.toY}, Width = ${this.width}, Height = ${this.height}`);
	}

	redrawAll(rectangles: Rectangle[]): Rectangle
	{
		this.clearAll(rectangles, false);
		this.addAll(rectangles);

		return this;
	}


	addToArray(rectangles: Rectangle[]): Rectangle[]
	{
		// If smaller than minimum or rectangle overlaps then don't add/draw
		if (!
			(
				Math.abs(this.width) < this.config.minHeight ||
				Math.abs(this.height) < this.config.minWidth ||
				(rectangles.length > 0 && this.hasOverlap(rectangles))
			)
		)
		{
			rectangles.push(this);
			this.addToForm(rectangles.length - 1);
		}

		// Clearing and adding again to avoid broken (cut) rectangles
		this.redrawAll(rectangles);

		return rectangles;
	}

	//Viewport changed so adapt 
	vpChanged(rectangles: Rectangle[], oldViewToRealRelativeSizeFactor: number): Rectangle[]
	{
		rectangles.forEach(rectangle =>
		{
			this.coordTypes.forEach(coordType =>
			{
				rectangle[coordType] = (rectangle[coordType] * this.canvas.image.viewToRealRelativeSizeFactor) / oldViewToRealRelativeSizeFactor;
			});
		});

		this.clearAll(rectangles, false, false);
		this.addAll(rectangles, false);
		return rectangles;
	}
}

export default Rectangle;