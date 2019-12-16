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

/**
 * TODO: have the user include the html on his own
 * Easier for hen to change svg etc
 */
const walnut = (function walnut() {
	"use strict";

	this.ui = {};
	
	const self = this;

	/* Globals within walnut */
	let path;
	let pathArray;
	let pathMiddle;
	let newPathname;
	let i;
	let navigationButtons;
	let containerIndex: string;

	let containerArray: any = [];
	let viewer: any = {};
	let config: any = {};

	const touch = {
		start: {},
		startX: 0,
		startY: 0,
		end: 0,
	}

	let clickTarget: any;

	const externalUI = {
		containers: [],
	}


	let listContainer: {
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

	const allowedTouchDistance: number = 100;
	const minTouchDistance: number = 20;


	function getContainers() {
		let elems = document.querySelectorAll('[walnut]') || document.getElementsByClassName('walnut');
		if (elems.length > 0) {
			return Array.from(elems);
		} else {
			console.warn("Couldn't find any containers for ");
			return false;
		}
	}

	function init() {
		externalUI.containers = getContainers();

		indexImages();
		getViewer();
		initEvents();

		if (doDeviceHaveTouch()) self.ui.wrapper.classList.add("walnut--is-touch");
	}


	/**
	 * Adds and removes event on open and close
	 * REVIEW: Add once and dont remove. preformance benefits?
	 */
	const initEvents = once(function () {

		self.ui.wrapper.addEventListener("click", clickWrapper, false);
		self.ui.closeBtn.addEventListener("click", closeViewer, false);
		self.ui.fullscreenBtn.addEventListener("click", fullscreen, false);

		document.addEventListener("keyup", checkKeyPressed, false);

		// ui.listHandle.addEventListener('drag', onDragingPreviewList);
		// ui.listHandle.addEventListener('dragstart', onDragPreviewList);
		// ui.listHandle.addEventListener('dragend', onDragEndPreviewList);

		self.ui.wrapper.addEventListener('mousemove', onDragingPreviewList);
		self.ui.wrapper.addEventListener('mousedown', onDragPreviewList);
		self.ui.wrapper.addEventListener('mouseup', onDragEndPreviewList);

		if (doDeviceHaveTouch()) {
			const mainImage = self.ui.mainImage;
			mainImage.addEventListener("touch.start", swipeStart);
			mainImage.addEventListener("touch.end", swipeEnd);
			mainImage.addEventListener("touchmove", swipeMove);
		} else {
			self.ui.nextBtn.addEventListener("click", nextImage);
			self.ui.prevBtn.addEventListener("click", prevImage);
		}
	});

	function initFlexEvents() {
		document.addEventListener("keyup", checkKeyPressed);
		window.addEventListener("popstate", changeHistory);
		resizeEvent(fixViewer);
	}
	function deinitFlexEvents() {
		document.removeEventListener("keyup", checkKeyPressed);
		window.removeEventListener("popstate", changeHistory);
		resizeEvent(fixViewer, "remove");
	}

	/**
	 * Indexes as images so related images will show as thumbnails when opening the viewer
	 */
	function indexImages() {
		for (let i = 0; i < externalUI.containers.length; i++) {

			containerArray.push({
				container: externalUI.containers[i],
				images: []
			});

			externalUI.containers[i].setAttribute("data-walnut-container", i);


			/**
			 * Puts images in a array. Finds all images with either:
			 * CLASS or ATTRIBUTE with "walnut-image"
			 * If neither is found then it will look for all <img> tags
			 *
			 */
			let img = externalUI.containers[i].getElementsByTagName("img");
			let bgOld = externalUI.containers[i].getElementsByClassName("walnut-image");
			let bg = externalUI.containers[i].querySelectorAll('[walnut-image]');
			let images = [];

			if (bgOld.length) {
				for (let x = 0; x < bgOld.length; x++) {
					images.push(bgOld[x]);
				}
			}
			if (bg.length) {
				for (let x = 0; x < bg.length; x++) {
					images.push(bg[x]);
				}
			}
			if (!bgOld.length && !bg.length && img) {
				for (let x = 0; x < img.length; x++) {
					images.push(img[x]);
				}
			}


			for (let j = 0; j < images.length; j++) {

				images[j].addEventListener("click", openViewer);

				images[j].setAttribute("data-walnut-index", j);

				let src;

				if (images[j].src) {
					src = images[j].src
				} else {
					let style = images[j].currentStyle || window.getComputedStyle(images[j], null);
					src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
				}

				containerArray[i].images.push({
					elem: images[j],
					src: src,
					index: j
				});
			};
		};
	}

	/**
	 * Gets elements that builds up the viewer
	 */
	function getViewer() {
		self.ui.wrapper = document.querySelector(".walnut__wrapper");
		self.ui.list = self.ui.wrapper.querySelector(".walnut__list");
		self.ui.listContainer = self.ui.wrapper.querySelector(".walnut__list-container");
		self.ui.listHandle = self.ui.wrapper.querySelector(".walnut__list-handle");
		self.ui.box = self.ui.wrapper.querySelector(".walnut__box");
		self.ui.mainImage = self.ui.wrapper.querySelector(".walnut__image");
		self.ui.mainImageContainer = self.ui.wrapper.querySelector(".walnut__image-container");
		self.ui.nextBtn = self.ui.wrapper.querySelector(".walnut__navigation.walnut__navigation--next");
		self.ui.prevBtn = self.ui.wrapper.querySelector(".walnut__navigation.walnut__navigation--prev");
		self.ui.closeBtn = self.ui.wrapper.querySelector(".walnut-close");
		self.ui.directionArrow = self.ui.wrapper.querySelector(".walnut__direction-arrow");
		self.ui.directionLine = self.ui.wrapper.querySelector(".walnut__direction-line");
	}


	/**
	 * Opens Viewer and
	 */
	function openViewer(e: any) {

		let index;
		let container;
		let listItem;
		let mainImage = self.ui.mainImage;
		let prevBtn = self.ui.prevBtn;
		let nextBtn = self.ui.nextBtn;
		let src;
		let style;

		container = findAncestor(e.target, "walnut")
		if (!container) throw new Error("Couldn't find any container with attribute or class 'walnut' of this element");
		
		containerIndex = container.getAttribute("data-walnut-container");

		setImages(containerIndex);

		index = parseInt(this.getAttribute("data-walnut-index"));


		style = this.currentStyle || window.getComputedStyle(this, null);

		/**
		 * Looks for the image source and if not found get the background image
		 */
		if (this.src) {
			src = this.src
		} else if (style.backgroundImage != "none") {
			src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
		} else {
			throw new Error("Couldn't find a image for element: " + this);
		}

		mainImage.src = src;
		mainImage.setAttribute("data-walnut-index", index);


		document.body.classList.add("walnut--open");

		let length = containerArray[containerIndex].images.length;

		if (index === 0 && index === length - 1) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "none";
		} else if (index === 0) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "";
		} else if (index === (length - 1)) {
			nextBtn.style.display = "none";
			prevBtn.style.display = "";
		} else {
			prevBtn.style.display = "";
			nextBtn.style.display = "";
		}

		initFlexEvents();
		fixViewer();

		self.ui.wrapper.classList.add("walnut__wrapper--open");

		let stateObj = "walnut";
		history.pushState(stateObj, "walnut", "");

	}
	/**
	 * 
	 * 
	 * @param {*} containerIndex 
	 */
	function setImages(containerIndex: any) {
		const list = self.ui.list;

		list.innerHTML = "";

		if (containerArray[containerIndex].images.length > 1) {
			for (let i = 0; i < containerArray[containerIndex].images.length; i++) {
				let li = document.createElement("li");
				li.className = "walnut__item";
				li.style.backgroundImage = "url(" + containerArray[containerIndex].images[i].src + ")";
				li.setAttribute("data-walnut-source", containerArray[containerIndex].images[i].src);
				li.setAttribute("data-walnut-index", containerArray[containerIndex].images[i].index);


				li.addEventListener("click", function () {
					let src = this.getAttribute("data-walnut-source");
					changeImage(null, {
						source: src,
						index: parseInt(this.getAttribute("data-walnut-index")),
						container: null
					});
				});

				list.appendChild(li);

			};
		}
	}

	function fixListWidth() {
		let elItem: any = document.getElementsByClassName("walnut__item")[0];
		let listItem: number = elItem.offsetWidth;
		let elList: any = document.getElementsByClassName("walnut__list")[0];
		elList.style.width = (containerArray[containerIndex].images.length * listItem) + "px";
	}

	function closeViewer() {
		self.ui.mainImage.src = "";
		self.ui.wrapper.classList.remove("walnut__wrapper--open");
		document.body.classList.remove("walnut--open");
		deinitFlexEvents();
		fullscreen("exit");
		if (history.state === "walnut") {
			window.history.back();
		}
	}

	function changeImage(action: any = undefined, object: any = undefined) {

		let newIndex = 0;
		let index: number = 0;
		let prevBtn = self.ui.prevBtn;
		let nextBtn = self.ui.nextBtn;
		let mainImage = self.ui.mainImage;

		if (typeof action !== "undefined" && action !== null) {
			index = parseInt(mainImage.getAttribute("data-walnut-index"));

			if (action === "next" && index < containerArray[containerIndex].images.length - 1) {
				index = index + 1;
			} else if (action === "prev" && index > 0) {
				index = index - 1;
			} else {
				return;
			}

			// TODO: find right array istead of 0
			if (containerArray[containerIndex].images[index]) {
				mainImage.src = containerArray[containerIndex].images[index].src;
				mainImage.setAttribute("data-walnut-index", index);
			}


		} else if (object && object.source) {
			index = parseInt(object.index);
			mainImage.src = object.source;
			mainImage.setAttribute("data-walnut-index", index);

		}

		if (index === 0 && index === containerArray[containerIndex].images.length - 1) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "none";
		} else if (index === 0) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "";
		} else if (index === (containerArray[containerIndex].images.length - 1)) {
			nextBtn.style.display = "none";
			prevBtn.style.display = "";
		} else {
			prevBtn.style.display = "";
			nextBtn.style.display = "";
		}

		checkHeight();
	}

	function fixViewer() {
		checkHeight();
		if (document.getElementsByClassName(".walnut__item")[0] instanceof HTMLElement) {
			fixListWidth();
		}
	}

	function checkHeight() {
		let viewerHeight = self.ui.box.offsetHeight;
		let wrapper = self.ui.wrapper;

		if (viewerHeight > window.innerHeight) {
			wrapper.classList.add("walnut--align-top");
		} else {
			wrapper.classList.remove("walnut--align-top");
		}
	}

	function checkKeyPressed(e: any) {
		let key = e.keyCode;
		if (key === 37) {
			changeImage("prev");
		} else if (key === 39) {
			changeImage("next");
		} else if (key === 27) {
			closeViewer();
		}
	}

	function clickWrapper(e: any) {
		e.stopPropagation(); // FIXME: stop event from bubbling
		e.preventDefault(); // FIXME: stop event from bubbling
		if (e.target !== this || clickTarget !== self.ui.wrapper) {
			return;
		}
		close.call(this);
	}

	function fullscreen(option: string) {
		let wrapper = self.ui.wrapper;
		let fullscreenBtn = self.ui.fullscreenBtn;

		if (option === "exit") {
			exitFullscreen();
			fullscreenBtn.classList.remove("walnut__fullscreen--hidden");

		} else {
			launchIntoFullscreen(wrapper);
			fullscreenBtn.classList.add("walnut__fullscreen--hidden");
		}
	}

	function nextImage() {
		changeImage.call(this, "next");
	}

	function prevImage() {
		changeImage.call(this, "prev");
	}

	function onDragPreviewList(e: any) {

		const target = e.target;
		clickTarget = target;
		if (target.matches('.walnut__list-handle')) {
			e.preventDefault();
			console.log('dragStart', e);
			listContainer.dragstartY = e.clientY;
			listContainer.draging = true;
		}
	}

	function onDragingPreviewList(e: any) {
		e.preventDefault();
		let y: any = parseFloat(e.clientY);
		if (listContainer.draging && !listContainer.dragCanceled && (y > (listContainer.dragstartY + 1) ||
			y < (listContainer.dragstartY - 1))) {
			window.requestAnimationFrame(() => {
				let startY: number = listContainer.dragstartY;
				let translated: number = listContainer.translatedY;
				let newY: number = translated + (y - startY);
				if (newY < 0) {
					listContainer.dragCanceled = true;
					return;
				}
				newY = Math.min(100, newY); // TODO: change 100 to list height
				console.log('drag', newY);
				self.ui.listContainer.style.transform = `translate3d(0, ${newY}px, 0)`;
			});
		}
	}

	function onDragEndPreviewList(e: any) {
		if (listContainer.draging) {
			e.preventDefault();
			e.stopPropagation();
			let newY = (listContainer.translatedY + (e.clientY - listContainer.dragstartY));
			newY = Math.max(0, newY);
			newY = Math.min(100, newY);
			listContainer.translatedY = newY;
			listContainer.draging = false;
			listContainer.dragCanceled = false;
			console.log('dragEnd', listContainer.translatedY);
		}
	}

	function swipeStart(e: any) {
		let touchobj = e.changedTouches[0];

		touch.startX = parseInt(touchobj.clientX);
		touch.startY = parseInt(touchobj.clientY);
		e.preventDefault();
	}

	function swipeMove(e: any) {
		let touchobj = e.changedTouches[0];
		let touchMoveX = parseInt(touchobj.clientX);
		let touchMoveY = parseInt(touchobj.clientY);
		let index = self.ui.mainImage.getAttribute("data-walnut-index");
		let directionLine = self.ui.directionLine;
		let directionArrow = self.ui.directionArrow;
		let distX;
		let distY;

		distX = Math.abs(touchMoveX - touch.startX);
		distY = Math.abs(touchMoveY - touch.startY);

		directionLine.style.width = 40 + distX + "px";

		// Checks if you swipe right or left or if you swiped up or down more than allowed and checks if there is more pictures that way
		if (touch.startX > touchMoveX && distY < allowedTouchDistance && index < containerArray[containerIndex].images.length - 1) {
			directionLine.classList.remove("walnut__direction-line--active-left");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-right");
			directionArrow.innerHTML = ""; // TODO: instead of removing just hide

		} else if (touch.startX > touchMoveX && distY < allowedTouchDistance) {
			// stop
			directionLine.classList.remove("walnut__direction-line--active-left");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-right");
			directionArrow.innerHTML = "";

		} else if (touch.startX < touchMoveX && distY < allowedTouchDistance && index > 0) {
			directionLine.classList.remove("walnut__direction-line--active-right");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-left");
			directionArrow.innerHTML = "";

		} else if (touch.startX < touchMoveX && distY < allowedTouchDistance) {
			directionLine.classList.remove("walnut__direction-line--active-right");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-left");
			directionArrow.innerHTML = "";

		} else {
			directionLine.classList.remove("walnut__direction-line--active walnut__direction-line--active-left walnut__direction-line--active-right");
		}
		e.preventDefault();
	}

	function swipeEnd(e: any) {
		let touchobj = e.changedTouches[0];
		let touchMoveX = parseInt(touchobj.clientX);
		let touchMoveY = parseInt(touchobj.clientY);
		let distY = Math.abs(touchMoveY - touch.startY);
		let distX = Math.abs(touchMoveX - touch.startX);
		let directionLine = self.ui.directionLine;

		touch.end = touchMoveX;

		e.preventDefault();

		directionLine.classList.remove("walnut__direction-line--active");
		directionLine.classList.remove("walnut__direction-line--active-left");
		directionLine.classList.remove("walnut__direction-line--active-right");

		if (touch.startX > touch.end &&
			distX > minTouchDistance &&
			distY < allowedTouchDistance) {
			nextImage();
		} else if (touch.startX < touch.end &&
			distX > minTouchDistance &&
			distY < allowedTouchDistance) {
			prevImage();
		} else if (distY > 200) {
			closeViewer();
		}
	}

	function changeHistory(event: any) {
		closeViewer();
	}

	return {
		init: init
	}
}());

(<any>window).walnut = walnut

