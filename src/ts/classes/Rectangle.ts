import { Config, DefaultConfig } from "../interfaces/Config";

class Rectangle
{
	public height!: number;
	public width!: number;

	constructor(
		public fromX: number,
		public fromY: number,
		public toX: number,
		public toY: number,
		private ctx: CanvasRenderingContext2D,
		private config: Config
	)
	{
		this.updateDimensions();
	}

	updateDimensions(): Rectangle
	{
		this.width = (this.toX - this.fromX);
		this.height = (this.toY - this.fromY);

		return this;
	}

	clearLast(rectangles: Rectangle[]): Rectangle[]
	{
		if (rectangles.length < 1) return rectangles;

		rectangles[rectangles.length - 1].clear();
		rectangles.pop();

		return rectangles;
	}

	clearAll(rectangles: Rectangle[]): Rectangle[]
	{
		rectangles.forEach(rectangle =>
		{
			rectangle.clear();
		});

		let empty: Rectangle[] = [];

		return empty;
	}

	updateTo(toX: number, toY: number): Rectangle
	{
		this.toX = toX;
		this.toY = toY;

		return this.clear().updateDimensions().draw();
	}

	clear(): Rectangle
	{
		this.ctx.clearRect(this.fromX, this.fromY, this.width, this.height);
		return this;
	}

	draw(): Rectangle
	{
		this.ctx.strokeStyle = this.config.color;
		this.ctx.lineWidth = this.config.width;
		this.ctx.strokeRect(this.fromX, this.fromY, this.width, this.height);
		return this;
	}

}

export default Rectangle;