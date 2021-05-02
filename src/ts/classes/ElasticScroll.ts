import Rectangle from "./Rectangle";

class ElasticScroll
{
	screenHeight: number;
	screenWidth: number;
	xScrollThresholdReducePercentage: number = 10;
	yScrollThresholdReducePercentage: number = 10;
	xScrollThresholdReduceBy: number;
	yScrollThresholdReduceBy: number;
	baseScrollDistance: number = 50;

	constructor(private rectangle: Rectangle)
	{
		this.screenWidth = document.documentElement.clientWidth;
		this.screenHeight = document.documentElement.clientHeight;
		this.xScrollThresholdReduceBy = document.documentElement.clientWidth / this.xScrollThresholdReducePercentage;
		this.yScrollThresholdReduceBy = document.documentElement.clientHeight / this.yScrollThresholdReducePercentage;

		window.addEventListener("resize", () =>
		{
			this.screenHeight = document.documentElement.clientHeight;
			this.screenWidth = document.documentElement.clientWidth;
		});
	}

	setRectangle(rectangle: Rectangle)
	{
		this.rectangle = rectangle;
	}

	private calculateScrollBy(mousePosition: number, axisY: boolean, toBottomOrRight: boolean): number
	{
		const screen = axisY ? this.screenHeight : this.screenWidth;
		const reduceBy = axisY ? this.yScrollThresholdReduceBy : this.xScrollThresholdReduceBy;
		const usableScreen = screen - reduceBy;

		if (toBottomOrRight)
		{
			return ((mousePosition - usableScreen) / reduceBy) * this.baseScrollDistance;

		}
		else
		{
			return -((1 - (mousePosition / reduceBy)) * this.baseScrollDistance);
		}
	}

	private hasReachedScrollMax(element: HTMLElement, axisY: boolean, toBottomOrRight: boolean): boolean
	{
		if (axisY && !toBottomOrRight) return element.scrollTop === 0;
		if (!axisY && !toBottomOrRight) return element.scrollLeft === 0;

		if (axisY) return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= 3.0;

		return Math.abs(element.scrollWidth - element.scrollLeft - element.clientWidth) <= 3.0;
	}

	private findScrollElment(axisY: boolean)
	{
		let scrollElement;

		if (
			(
				axisY &&
				document.documentElement.scrollHeight > document.documentElement.clientHeight
			) ||
			(
				!axisY &&
				document.documentElement.scrollWidth > document.documentElement.clientWidth
			)
		)
		{
			scrollElement = document.documentElement;
		}
		else if (
			(
				axisY &&
				document.body.scrollHeight > document.body.clientHeight
			) ||
			(
				!axisY &&
				document.body.scrollWidth > document.body.clientWidth
			)
		)
		{
			scrollElement = document.body;
		}
		else
		{
			scrollElement = document.body;
		}

		return scrollElement;
	}

	private doScroll(element: HTMLElement, by: number, axisY: boolean)
	{
		const top = axisY ? by : 0;
		const left = axisY ? 0 : by;

		element.scrollBy({ top: top, left: left, behavior: 'smooth' });
	}

	private calculateThenScroll(mousePosition: number, axisY: boolean, toBottomOrRight: boolean)
	{
		const element = this.findScrollElment(axisY);

		if (this.hasReachedScrollMax(element, axisY, toBottomOrRight)) return;

		const by = this.calculateScrollBy(mousePosition, axisY, toBottomOrRight);


		this.doScroll(element, by, axisY);

	}

	scrollIfNeeded(clientX: number, clientY: number)
	{
		if (
			(this.screenHeight - this.yScrollThresholdReduceBy) < clientY &&
			this.rectangle!.drawingFromTopToBottom
		)
		{
			this.calculateThenScroll(clientY, true, true);

		}
		else if (
			(clientY - this.yScrollThresholdReduceBy) < 0 &&
			!this.rectangle!.drawingFromTopToBottom
		)
		{
			this.calculateThenScroll(clientY, true, false);
		}

		if (
			(this.screenWidth - this.xScrollThresholdReduceBy) < clientX &&
			this.rectangle!.drawingFromLeftToRight
		)
		{
			this.calculateThenScroll(clientX, false, true);
		}
		else if (
			(clientX - this.xScrollThresholdReduceBy) < 0 &&
			!this.rectangle!.drawingFromLeftToRight
		)
		{
			this.calculateThenScroll(clientX, false, false);
		}
	}
}

export default ElasticScroll;