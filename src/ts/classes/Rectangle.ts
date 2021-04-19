import Canvas from "./Canvas";
import { Config } from "../interfaces/Config";

class Rectangle
{
	public height!: number;
	public width!: number;
	private ctx: CanvasRenderingContext2D;
	private form?: HTMLFormElement;

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
		this.addDimensions();

		if (config.form)
		{
			this.form = document.querySelector(config.form) as HTMLFormElement;
		}
	}

	addDimensions(): Rectangle
	{
		if (this.isLoadedFromConfig)
		{
			this.width = this.toX;
			this.height = this.toY;

			this.toX = this.fromX + this.width;
			this.toY = this.fromY + this.height;

			const coordTypes = ["fromX", "fromY", "toX", "toY", "width", "height"] as const;

			coordTypes.forEach(coordType =>
			{
				this[coordType] = Math.round(this[coordType] * this.canvas.image.viewToRealRelativeSizeFactor);
			});
		}
		else
		{
			this.width = (this.toX - this.fromX);
			this.height = (this.toY - this.fromY);
		}

		return this;
	}

	clearLast(rectangles: Rectangle[]): Rectangle[]
	{
		if (rectangles.length < 1) return rectangles;

		this.removeFromForm(rectangles.length - 1);
		rectangles[rectangles.length - 1].clear();
		rectangles.pop();

		return rectangles;
	}

	clearAll(rectangles: Rectangle[]): Rectangle[]
	{
		this.ctx.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

		this.removeAllFromForm();

		rectangles.length = 0;

		return rectangles;
	}

	updateTo(toX: number, toY: number): Rectangle
	{
		this.clear();

		this.toX = toX;
		this.toY = toY;

		return this.addDimensions().draw();
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

	addToArray(rectangles: Rectangle[]): Rectangle[]
	{
		if (Math.abs(this.width) > this.config.minHeight && Math.abs(this.height) > this.config.minWidth)
		{
			rectangles.push(this);
			this.addToForm(rectangles.length - 1);
		}
		else
		{
			this.clear();
		}

		return rectangles;
	}
}

export default Rectangle;