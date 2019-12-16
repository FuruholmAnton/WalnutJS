import {
	fullscreenEnabled,
	fullscreenElement,
	findAncestor,
	isFullscreenEnabled,
	doDeviceHaveTouch,
	resizeEvent,
	launchIntoFullscreen,
	exitFullscreen,
	once,
	getComputedTranslateY
} from './helper';

// TODO: support background images
/**
 * Create a new instance of Walnut for every different scope of images.
 * 
 * @export
 * @class Walnut
 */
export default class Walnut {

	ui: {
		images: Array<HTMLImageElement>,
		
		wrapper: HTMLElement,
		list: HTMLElement,
		listContainer: HTMLElement,
		listHandle: HTMLElement,
		box: HTMLElement,
		mainImageContainer: HTMLElement,
		fullscreenBtn: HTMLElement,
		directionArrow: HTMLElement,
		directionLine: HTMLElement,
		mainImage: HTMLImageElement,
		prevBtn: SVGSVGElement,
		nextBtn: SVGSVGElement,
		closeBtn: SVGSVGElement,
	}

	events: {
		
	}

	touch = {
		start: {},
		startX: 0,
		startY: 0,
		end: 0,
	}
	clickTarget: any;

	listContainer: {
		dragstartY: number,
		dragendY: number,
		lastY: number,
		draging: boolean,
		translatedY: number,
		dragCanceled: boolean
	} = {
		dragstartY: 0,
		dragendY: 0,
		lastY: 0,
		draging: false,
		translatedY: 0,
		dragCanceled: false
	}

	allowedTouchDistance: number = 100;
	minTouchDistance: number = 20;

	constructor(...images:any[]) {
		this.initUI();

		for (let i = 0; i < images.length; i++) {
			if (Array.isArray(images[i])) {
				this.ui.images.concat(images[i]);
			} else if (images[i] instanceof HTMLElement) {
				this.ui.images.push(images[i]);
			} else {
				throw 'Invalid element';
			}
		}

		this.init();
	}

	init() {
		this.ui.images.forEach((el) => {
			el.classList.add('walnut-image');
		});
		
		this.initEvents();
	}

	initUI() {
		// REVIEW: change all classes to IDs ? 
		const wrapper = document.getElementById('walnut-viewer');

		this.ui = {
			images: [],
			wrapper: <HTMLElement>wrapper,
			list: <HTMLElement>wrapper.getElementsByClassName("walnut__list")[0],
			listContainer: <HTMLElement>wrapper.getElementsByClassName("walnut__list-container")[0],
			listHandle: <HTMLElement>wrapper.getElementsByClassName("walnut__list-handle")[0],
			box: <HTMLElement>wrapper.getElementsByClassName("walnut__box")[0],
			mainImageContainer: <HTMLElement>wrapper.getElementsByClassName("walnut__image-container")[0],
			fullscreenBtn: <HTMLElement>wrapper.getElementsByClassName("walnut__fullscreen")[0],
			directionArrow: <HTMLElement>wrapper.getElementsByClassName("walnut__direction-arrow")[0],
			directionLine: <HTMLElement>wrapper.getElementsByClassName("walnut__direction-line")[0],
			mainImage: <HTMLImageElement>wrapper.getElementsByClassName("walnut__image")[0],
			prevBtn: <SVGSVGElement>wrapper.getElementsByClassName("walnut__navigation.walnut__navigation--prev")[0],
			nextBtn: <SVGSVGElement>wrapper.getElementsByClassName("walnut__navigation.walnut__navigation--next")[0],
			closeBtn: <SVGSVGElement>wrapper.getElementsByClassName("walnut-close")[0],
		}

	}

	initEvents() {
		const wrapper = this.ui.wrapper;

		wrapper.addEventListener('click', (e) => {
			const target = <HTMLElement>e.target;

			if (target.isSameNode(wrapper)) {
				this.clickWrapper(e);

			} else if (target.matches('.walnut__item')) {
				let src = target.getAttribute("data-walnut-source");
				this.changeImage(null, {
					source: src,
					target: target,
					index: parseInt(target.getAttribute("data-walnut-index")),
					container: null
				});

			} else if (target.isSameNode(this.ui.closeBtn)) {
				this.closeViewer();

			} else if (target.isSameNode(this.ui.fullscreenBtn)) {
				this.fullscreen();
			}
		}, false);	


		document.addEventListener("keyup", this.checkKeyPressed, false);

		// ui.listHandle.addEventListener('drag', onDragingPreviewList);
		// ui.listHandle.addEventListener('dragstart', onDragPreviewList);
		// ui.listHandle.addEventListener('dragend', onDragEndPreviewList);

		this.ui.wrapper.addEventListener('mousemove', this.onDragingPreviewList);
		this.ui.wrapper.addEventListener('mousedown', this.onDragPreviewList);
		this.ui.wrapper.addEventListener('mouseup', this.onDragEndPreviewList);

		if (doDeviceHaveTouch()) {
			const mainImage = this.ui.mainImage;
			mainImage.addEventListener("touch.start", this.swipeStart);
			mainImage.addEventListener("touch.end", this.swipeEnd);
			mainImage.addEventListener("touchmove", this.swipeMove);
		} else {
			this.ui.nextBtn.addEventListener("click", this.nextImage);
			this.ui.prevBtn.addEventListener("click", this.prevImage);
		}
	}

	initFlexEvents() {
		document.addEventListener("keyup", this.checkKeyPressed);
		window.addEventListener("popstate", this.changeHistory);
		resizeEvent(this.fixViewer);
	}
	deinitFlexEvents() {
		document.removeEventListener("keyup", this.checkKeyPressed);
		window.removeEventListener("popstate", this.changeHistory);
		resizeEvent(this.fixViewer, "remove");
	}


	initOverviewList() {
		const list = this.ui.list;
		const images = this.ui.images;
		
		list.innerHTML = "";

		if (images.length > 1) {
			for (let i = 0; i < images.length; i++) {
				const li = document.createElement("li");
				li.className = "walnut__item";
				li.style.backgroundImage = `url(${images[i].src})`;
				li.setAttribute("data-walnut-source", images[i].src);
				// li.setAttribute("data-walnut-index", images[i].index);

				list.appendChild(li);

			};
		}
	}

	fixListWidth() {
		let elItem: any = document.getElementsByClassName("walnut__item")[0];
		let listItem: number = elItem.offsetWidth;
		let elList: any = document.getElementsByClassName("walnut__list")[0];
		elList.style.width = (this.ui.images.length * listItem) + "px";
	}

	openViewer(e: any) {	
		const target = e.target;
		if (typeof target == 'undefined') return;

		let index;
		let container;
		let listItem;
		let mainImage = this.ui.mainImage;
		let prevBtn = this.ui.prevBtn;
		let nextBtn = this.ui.nextBtn;
		let src;

		const style = window.getComputedStyle(target, null);
		
		/**
		 * Looks for the image source and if not found get the background image
		 */
		if (target.src) {
			src = target.src
		} else if (style.backgroundImage != "none") {
			src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
		} else {
			throw new Error("Couldn't find a image for element: " + target);
		}

		mainImage.src = src;
		mainImage.setAttribute("data-walnut-index", index);


		document.body.classList.add("walnut--open");

		// let length = containerArray[containerIndex].images.length;

		// if (index === 0 && index === length - 1) {
		// 	prevBtn.style.display = "none";
		// 	nextBtn.style.display = "none";
		// } else if (index === 0) {
		// 	prevBtn.style.display = "none";
		// 	nextBtn.style.display = "";
		// } else if (index === (length - 1)) {
		// 	nextBtn.style.display = "none";
		// 	prevBtn.style.display = "";
		// } else {
		// 	prevBtn.style.display = "";
		// 	nextBtn.style.display = "";
		// }

		this.initFlexEvents();
		this.fixViewer();

		this.ui.wrapper.classList.add("walnut__wrapper--open");

		let stateObj = "walnut";
		history.pushState(stateObj, "walnut", "");

	}

	closeViewer() {
		this.ui.mainImage.src = "";
		this.ui.wrapper.classList.remove("walnut__wrapper--open");
		document.body.classList.remove("walnut--open");
		this.deinitFlexEvents();
		this.fullscreen("exit");
		if (history.state === "walnut") {
			window.history.back();
		}
	}


	changeImage(action: any = undefined, object: any = undefined) {
		
		let newIndex = 0;
		let index: number = 0;
		const prevBtn = this.ui.prevBtn;
		const nextBtn = this.ui.nextBtn;
		const mainImage = this.ui.mainImage;
		const images = this.ui.images;

		if (typeof action !== "undefined" && action !== null) {
			index = parseInt(mainImage.getAttribute("data-walnut-index"));

			if (action === "next" && index < images.length - 1) {
				index = index + 1;
			} else if (action === "prev" && index > 0) {
				index = index - 1;
			} else {
				return;
			}

			// TODO: find right array istead of 0
			if (images[index]) {
				mainImage.src = images[index].src;
				mainImage.setAttribute("data-walnut-index", index.toString());
			}


		} else if (object && object.source) {
			index = parseInt(object.index);
			mainImage.src = object.source;
			mainImage.setAttribute("data-walnut-index", index.toString());

		}

		if (index === 0 && index === images.length - 1) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "none";
		} else if (index === 0) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "";
		} else if (index === (images.length - 1)) {
			nextBtn.style.display = "none";
			prevBtn.style.display = "";
		} else {
			prevBtn.style.display = "";
			nextBtn.style.display = "";
		}

		this.checkHeight();
	}

	fixViewer() {
		this.checkHeight();
		if (document.getElementsByClassName(".walnut__item")[0] instanceof HTMLElement) {
			this.fixListWidth();
		}
	}

	checkHeight() {
		let viewerHeight = this.ui.box.offsetHeight;
		let wrapper = this.ui.wrapper;

		if (viewerHeight > window.innerHeight) {
			wrapper.classList.add("walnut--align-top");
		} else {
			wrapper.classList.remove("walnut--align-top");
		}
	}

	checkKeyPressed(e: any) {
		let key = e.keyCode;
		if (key === 37) {
			this.changeImage("prev");
		} else if (key === 39) {
			this.changeImage("next");
		} else if (key === 27) {
			this.closeViewer();
		}
	}

	clickWrapper(e: any) {
		e.stopPropagation(); // FIXME: stop event from bubbling
		e.preventDefault(); // FIXME: stop event from bubbling

		close.call(this);
	}

	fullscreen(option: string = '') {
		let wrapper = this.ui.wrapper;
		let fullscreenBtn = this.ui.fullscreenBtn;

		if (option === "exit") {
			exitFullscreen();
			fullscreenBtn.classList.remove("walnut__fullscreen--hidden");

		} else {
			launchIntoFullscreen(wrapper);
			fullscreenBtn.classList.add("walnut__fullscreen--hidden");
		}
	}

	nextImage() {
		this.changeImage.call(this, "next");
	}

	prevImage() {
		this.changeImage.call(this, "prev");
	}

	onDragPreviewList(e: any) {

		const target = e.target;
		this.clickTarget = target;
		if (target.matches('.walnut__list-handle')) {
			e.preventDefault();
			console.log('dragStart', e);
			this.listContainer.dragstartY = e.clientY;
			this.listContainer.draging = true;
		}
	}

	onDragingPreviewList(e: any) {
		e.preventDefault();
		let y: any = parseFloat(e.clientY);
		if (this.listContainer.draging && !this.listContainer.dragCanceled && (y > (this.listContainer.dragstartY + 1) ||
			y < (this.listContainer.dragstartY - 1))) {
			window.requestAnimationFrame(() => {
				let startY: number = this.listContainer.dragstartY;
				let translated: number = this.listContainer.translatedY;
				let newY: number = translated + (y - startY);
				if (newY < 0) {
					this.listContainer.dragCanceled = true;
					return;
				}
				newY = Math.min(100, newY); // TODO: change 100 to list height
				console.log('drag', newY);
				this.ui.listContainer.style.transform = `translate3d(0, ${newY}px, 0)`;
			});
		}
	}

	onDragEndPreviewList(e: any) {
		if (this.listContainer.draging) {
			// e.preventDefault();
			// e.stopPropagation();
			// let newY = (listContainer.translatedY + (e.clientY - listContainer.dragstartY));
			// newY = Math.max(0, newY);
			// newY = Math.min(100, newY);
			// listContainer.translatedY = newY;
			// listContainer.draging = false;
			// listContainer.dragCanceled = false;
			// console.log('dragEnd', listContainer.translatedY);
		}
	}

	swipeStart(e: any) {
		let touchobj = e.changedTouches[0];

		this.touch.startX = parseInt(touchobj.clientX);
		this.touch.startY = parseInt(touchobj.clientY);
		e.preventDefault();
	}

	swipeMove(e: any) {
		let touchobj = e.changedTouches[0];
		let touchMoveX = parseInt(touchobj.clientX);
		let touchMoveY = parseInt(touchobj.clientY);
		let index = parseInt(this.ui.mainImage.getAttribute("data-walnut-index"));
		let directionLine = this.ui.directionLine;
		let directionArrow = this.ui.directionArrow;
		let distX;
		let distY;

		distX = Math.abs(touchMoveX - this.touch.startX);
		distY = Math.abs(touchMoveY - this.touch.startY);

		directionLine.style.width = 40 + distX + "px";

		// Checks if you swipe right or left or if you swiped up or down more than allowed and checks if there is more pictures that way
		if (this.touch.startX > touchMoveX && distY < this.allowedTouchDistance && index < this.ui.images.length - 1) {
			directionLine.classList.remove("walnut__direction-line--active-left");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-right");
			directionArrow.innerHTML = ""; // TODO: instead of removing just hide

		} else if (this.touch.startX > touchMoveX && distY < this.allowedTouchDistance) {
			// stop
			directionLine.classList.remove("walnut__direction-line--active-left");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-right");
			directionArrow.innerHTML = "";

		} else if (this.touch.startX < touchMoveX && distY < this.allowedTouchDistance && index > 0) {
			directionLine.classList.remove("walnut__direction-line--active-right");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-left");
			directionArrow.innerHTML = "";

		} else if (this.touch.startX < touchMoveX && distY < this.allowedTouchDistance) {
			directionLine.classList.remove("walnut__direction-line--active-right");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-left");
			directionArrow.innerHTML = "";

		} else {
			directionLine.classList.remove("walnut__direction-line--active walnut__direction-line--active-left walnut__direction-line--active-right");
		}
		e.preventDefault();
	}

	swipeEnd(e: any) {
		let touchobj = e.changedTouches[0];
		let touchMoveX = parseInt(touchobj.clientX);
		let touchMoveY = parseInt(touchobj.clientY);
		let distY = Math.abs(touchMoveY - this.touch.startY);
		let distX = Math.abs(touchMoveX - this.touch.startX);
		let directionLine = this.ui.directionLine;

		this.touch.end = touchMoveX;

		e.preventDefault();

		directionLine.classList.remove("walnut__direction-line--active");
		directionLine.classList.remove("walnut__direction-line--active-left");
		directionLine.classList.remove("walnut__direction-line--active-right");

		if (this.touch.startX > this.touch.end &&
			distX > this.minTouchDistance &&
			distY < this.allowedTouchDistance) {
			this.nextImage();
		} else if (this.touch.startX < this.touch.end &&
			distX > this.minTouchDistance &&
			distY < this.allowedTouchDistance) {
				this.prevImage();
		} else if (distY > 200) {
			this.closeViewer();
		}
	}

	changeHistory(event: any) {
		this.closeViewer();
	}
}