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
 * Use SVG as inline JavaScript
 */
const svgCloseBtn = '<svg class="walnut-close" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"/><path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"/><path class="walnut-close__path" fill="#fff" d="M2.8 80.4L80.3 3l714.4 714.3-77.5 77.5z"/><path class="walnut-close__path" fill="#fff" d="M797.7 82.5L717.2 2 2.8 716.4 83.2 797z"/></svg>';
const svgCloseBtnFilled = '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path d="M400 7.2c219.4 0 397.6 176.3 397.6 393.5S619.4 794.3 400 794.3C180.6 794.3 2.4 618 2.4 400.7 2.4 183.5 180.6 7.2 400 7.2zm-48.2 389L153.2 595l50.2 50.2L402 446.5 599.4 644l48.4-48.5L450.5 398l199.2-199-50.2-50.4L400.2 348 201.5 149 153 197.6 352 396.3z" fill="#fff"/></svg>';
const svgFullscreenBtn = '<svg class="walnut__fullscreen" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path d="M3.4 15.4H0V24h8.6v-3.4H3.4v-5.2zM0 8.6h3.4V3.4h5.2V0H0v8.6zm20.6 12h-5.2V24H24v-8.6h-3.4v5.2zM15.4 0v3.4h5.2v5.2H24V0h-8.6z" fill="#fff" fill-rule="nonzero"/></svg>';
const svgBtnLeft = '<svg class="walnut__navigation-img" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41"><g fill="#fff" fill-rule="nonzero"><path d="M22.12 44.24c12.2 0 22.12-9.93 22.12-22.12C44.24 9.92 34.3 0 22.12 0 9.92 0 0 9.92 0 22.12c0 12.2 9.92 22.12 22.12 22.12zm0-42.74c11.37 0 20.62 9.25 20.62 20.62 0 11.37-9.25 20.62-20.62 20.62-11.37 0-20.62-9.25-20.62-20.62C1.5 10.75 10.75 1.5 22.12 1.5z"/><path d="M24.9 29.88c.2 0 .38-.07.52-.22.3-.3.3-.76 0-1.06l-6.8-6.8 6.8-6.8c.3-.3.3-.77 0-1.06-.3-.3-.76-.3-1.06 0l-7.32 7.33c-.3.3-.3.77 0 1.06l7.32 7.33c.15.15.34.22.53.22z"/></g></svg>';
const svgBtnRight = '<svg class="walnut__navigation-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.236 44.236"><g fill="#FFF"><path d="M22.12 44.24C9.92 44.24 0 34.3 0 22.12S9.92 0 22.12 0s22.12 9.92 22.12 22.12-9.93 22.12-22.12 22.12zm0-42.74C10.75 1.5 1.5 10.75 1.5 22.12c0 11.37 9.25 20.62 20.62 20.62 11.37 0 20.62-9.25 20.62-20.62 0-11.37-9.25-20.62-20.62-20.62z"/><path d="M19.34 29.88c-.2 0-.38-.07-.53-.22-.28-.3-.28-.76 0-1.06l6.8-6.8-6.8-6.8c-.28-.3-.28-.77 0-1.07.3-.3.78-.3 1.07 0l7.33 7.34c.3.3.3.77 0 1.06l-7.33 7.33c-.14.15-.34.22-.53.22z"/></g></svg>';

const parser = new DOMParser();
const g_svgCloseBtn = parser.parseFromString(svgCloseBtn, "image/svg+xml").documentElement;
const g_svgCloseBtnFilled = parser.parseFromString(svgCloseBtnFilled, "image/svg+xml").documentElement;
const g_svgFullscreenBtn = parser.parseFromString(svgFullscreenBtn, "image/svg+xml").documentElement;
const g_svgBtnLeft = parser.parseFromString(svgBtnLeft, "image/svg+xml").documentElement;
const g_svgBtnRight = parser.parseFromString(svgBtnRight, "image/svg+xml").documentElement;

/**
 * [walnut description]
 */
const walnut = (function() {
	"use strict";

	/* Globals within walnut */
	let path;
	let pathArray;
	let pathMiddle;
	let newPathname;
	let i;
	let navigationButtons;
	let containerIndex: string;

	let CONTAINERS: any = [];
	let containerArray: any = [];
	let viewer: any = {};
	let config: any = {};
	let touchStart: number = 0;
	let touchStartX: number = 0;
	let touchStartY: number = 0;
	let touchEnd: number = 0;

	let clickTarget: any;

	let listContainer : {
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
		let elems = document.querySelectorAll('[walnut]');
		if (elems.length > 0) {
			return elems;
		} else {
			elems = document.getElementsByClassName('walnut');
			if (elems.length > 0) {
				return elems;
			} else {
				console.warn("Couldn't find any containers for ");
			}
		}
	}

	function init() {
		let newPath;

		CONTAINERS = getContainers();

		indexImages();
		buildViewer();

		if (doDeviceHaveTouch()) {
			viewer.wrapper.classList.add("walnut--is-touch");
		}
	}


	/**
	 * Adds and removes event on open and close
	 * REVIEW: Add once and dont remove. preformance benefits?
	 */
	const initEvents = once(function() {
		const mainImage = viewer.mainImage;
		viewer.wrapper.addEventListener("click", clickWrapper, false);
		viewer.closeBtn.addEventListener("click", closeViewer, false);
		viewer.fullscreenBtn.addEventListener("click", fullscreen, false);
		document.addEventListener("keyup", checkKeyPressed, false);

		// viewer.listHandle.addEventListener('drag', onDragingPreviewList);
		// viewer.listHandle.addEventListener('dragstart', onDragPreviewList);
		// viewer.listHandle.addEventListener('dragend', onDragEndPreviewList);

		viewer.wrapper.addEventListener('mousemove', onDragingPreviewList);
		viewer.wrapper.addEventListener('mousedown', onDragPreviewList);
		viewer.wrapper.addEventListener('mouseup', onDragEndPreviewList);

		if (doDeviceHaveTouch()) {
			mainImage.addEventListener("touchstart", swipeStart);
			mainImage.addEventListener("touchend", swipeEnd);
			mainImage.addEventListener("touchmove", swipeMove);
		} else {
			viewer.nextBtn.addEventListener("click", nextImage);
			viewer.prevBtn.addEventListener("click", prevImage);
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
	function indexImages(){
		for (let i = 0; i < CONTAINERS.length; i++) {

			containerArray.push({
				container: CONTAINERS[i],
				images: []
			});

			CONTAINERS[i].setAttribute("data-walnut-container", i);


			/**
			 * Puts images in a array. Finds all images with either:
			 * CLASS or ATTRIBUTE with "walnut-image"
			 * If neither is found then it will look for all <img> tags
			 *
			 */
			let img = CONTAINERS[i].getElementsByTagName("img");
			let bgOld = CONTAINERS[i].getElementsByClassName("walnut-image");
			let bg = CONTAINERS[i].querySelectorAll('[walnut-image]');
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
			if (!bgOld.length && !bg.length && img ) {
				for (let x = 0; x < img.length; x++) {
					images.push(img[x]);
				}
			}


			for (let j = 0; j < images.length; j++) {

				images[j].addEventListener("click", openViewer);

				images[j].setAttribute("data-walnut-index", j);

				let src;

				if(images[j].src) {
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
	 * Creates Elements that builds up the viewer
	 */
	function buildViewer() {
		const ul: HTMLElement 					= document.createElement("ul");
		const listContainer: HTMLElement 		= document.createElement("div");
		const listHandle: HTMLElement 			= document.createElement("div");
		const wrapper: HTMLElement 				= document.createElement("div");
		const box: HTMLElement  				= document.createElement("div");
		const mainImage: HTMLElement 			= document.createElement("img");
		const mainImageContainer: HTMLElement 	= document.createElement("div");
		const nextBtn: HTMLElement 				= document.createElement("div");
		const prevBtn: HTMLElement 				= document.createElement("div");
		const closeBtn: HTMLElement 			= document.createElement("img");
		const elDirectionArrow: HTMLElement    	= document.createElement("div");
		const elDirectionLine: HTMLElement    	= document.createElement("div");

		/**
		 * Add CSS classes to the elements
		 */
		ul.className 					= "walnut__list";
		listContainer.className 		= "walnut__list-container";
		listHandle.className 			= "walnut__list-handle";
		mainImage.className 			= "walnut__image";
		mainImageContainer.className 	= "walnut__image-container"
		box.className 					= "walnut__box";
		wrapper.className 				= "walnut__wrapper";
		nextBtn.className 				= "walnut__navigation walnut__navigation--next";
		prevBtn.className 				= "walnut__navigation walnut__navigation--prev";
		elDirectionArrow.className 		= "walnut__direction-arrow";
		elDirectionLine.className 		= "walnut__direction-line";

		/**
		 * Set attributes
		 */
		// listContainer.setAttribute('draggable', 'true');

		/**
		 * Connects the Elements and creates the structure
		 */
		nextBtn.appendChild(g_svgBtnRight);
		prevBtn.appendChild(g_svgBtnLeft);
		elDirectionLine.appendChild(elDirectionArrow);
		mainImageContainer.appendChild(mainImage);
		mainImageContainer.appendChild(nextBtn);
		mainImageContainer.appendChild(prevBtn);
		mainImageContainer.appendChild(elDirectionLine);
		listContainer.appendChild(ul);
		listContainer.appendChild(listHandle);
		box.appendChild(mainImageContainer);
		wrapper.appendChild(listContainer);
		wrapper.appendChild(g_svgCloseBtn);
		wrapper.appendChild(box);
		document.body.appendChild(wrapper);


		/**
		 * Add Fullscreen button when not in fullscreen mode
		 */
		if(!!isFullscreenEnabled()) {
			wrapper.appendChild(g_svgFullscreenBtn);
		}

		/**
		 * Make variables global for walnut
		 */
		viewer.listHandle 	= listHandle;
		viewer.listContainer = listContainer;
		viewer.closeBtn		 = g_svgCloseBtn;
		viewer.nextBtn 		 = nextBtn;
		viewer.prevBtn 		 = prevBtn;
		viewer.fullscreenBtn  = g_svgFullscreenBtn;
		viewer.mainImage 	 = mainImage;
		viewer.wrapper 		 = wrapper;
		viewer.list 			 = ul;
		viewer.directionArrow = elDirectionArrow;
		viewer.directionLine  = elDirectionLine;
		viewer.box 			 = box;


		initEvents();
	}


	/**
	 * Opens Viewer and
	 */
	function openViewer(e: any) {

		let index;
		let container;
		let listItem;
		let mainImage = viewer.mainImage;
		let prevBtn = viewer.prevBtn;
		let nextBtn = viewer.nextBtn;
		let src;
		let style;

		container = findAncestor(e.target, "walnut")
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

		if(index === 0 && index === containerArray[containerIndex].images.length - 1) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "none";
		} else if(index === 0) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "";
		}else if(index === (containerArray[containerIndex].images.length - 1) ) {
			nextBtn.style.display = "none";
			prevBtn.style.display = "";
		} else {
			prevBtn.style.display = "";
			nextBtn.style.display = "";
		}

		initFlexEvents();
		fixViewer();

		viewer.wrapper.classList.add("walnut__wrapper--open");

		let stateObj = "walnut";
		history.pushState(stateObj, "walnut", "");

	}

	function setImages(containerIndex: any) {
		let img;
		let li;
		let list = viewer.list;

		list.innerHTML = "";

		if(containerArray[containerIndex].images.length > 1) {
			for (let i = 0; i < containerArray[containerIndex].images.length; i++) {
				li = document.createElement("li");
				li.className = "walnut__item";
				li.style.backgroundImage = "url(" + containerArray[containerIndex].images[i].src + ")";
				li.setAttribute("data-walnut-source", containerArray[containerIndex].images[i].src);
				li.setAttribute("data-walnut-index", containerArray[containerIndex].images[i].index);


				li.addEventListener("click", function(){
					let src = this.getAttribute("data-walnut-source");
					changeImage(null,{
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
		elList.style.width = (containerArray[containerIndex].images.length *  listItem) + "px";
	}

	function closeViewer() {
		viewer.mainImage.src = "";
		viewer.wrapper.classList.remove("walnut__wrapper--open");
		document.body.classList.remove("walnut--open");
		deinitFlexEvents();
		fullscreen("exit");
		if (history.state === "walnut") {
			window.history.back();
		}
	}

	function changeImage(action: any = undefined, object: any = undefined) {
		"use strict";

		let newIndex = 0;
		let index: number = 0;
		let prevBtn = viewer.prevBtn;
		let nextBtn = viewer.nextBtn;
		let mainImage = viewer.mainImage;

		if(typeof action !== "undefined" && action !== null ){
			index = parseInt(mainImage.getAttribute("data-walnut-index"));

			if(action === "next" && index < containerArray[containerIndex].images.length - 1){
				index = index + 1;
			}else if(action === "prev" && index > 0 ){
				index = index - 1;
			}else {
				return;
			}

			// TODO: find right array istead of 0
			if(containerArray[containerIndex].images[index]){
				mainImage.src = containerArray[containerIndex].images[index].src;
				mainImage.setAttribute("data-walnut-index", index);
			}


		} else if(object && object.source){
			index = parseInt(object.index);
			mainImage.src = object.source;
			mainImage.setAttribute("data-walnut-index", index);

		}

		if(index === 0 && index === containerArray[containerIndex].images.length - 1) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "none";
		} else if(index === 0) {
			prevBtn.style.display = "none";
			nextBtn.style.display = "";
		}else if(index === (containerArray[containerIndex].images.length - 1) ) {
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
		if(document.getElementsByClassName(".walnut__item")[0] instanceof HTMLElement) {
			fixListWidth();
		}
	}

	function checkHeight() {
		let viewerHeight = viewer.box.offsetHeight;
		let wrapper = viewer.wrapper;

		if ( viewerHeight > window.innerHeight) {
			wrapper.classList.add("walnut--align-top");
		} else {
			wrapper.classList.remove("walnut--align-top");
		}
	}

	function checkKeyPressed(e: any) {
		let key = e.keyCode;
		if( key === 37) {
			changeImage("prev");
		} else if(key === 39) {
			changeImage("next");
		} else if(key === 27) {
			closeViewer();
		}
	}

	function clickWrapper(e: any) {
		e.stopPropagation(); // FIXME: stop event from bubbling
		e.preventDefault(); // FIXME: stop event from bubbling
		if (e.target !== this || clickTarget !== viewer.wrapper) {
		    return;
		}
		closeViewer.call(this);
	}

	function fullscreen(option: string) {
		let wrapper 		= viewer.wrapper;
		let fullscreenBtn 	= viewer.fullscreenBtn;

		if(option === "exit") {
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
					y < (listContainer.dragstartY - 1)))
		{
			window.requestAnimationFrame(() => {
				let startY: number = listContainer.dragstartY;
				let translated: number = listContainer.translatedY;
				let newY: number = translated + (y - startY);
				if (newY < 0 ) {
					listContainer.dragCanceled = true;
					return;
				}
				newY = Math.min(100, newY); // TODO: change 100 to list height
				console.log('drag', newY);
				viewer.listContainer.style.transform = `translate3d(0,${newY}px,0)`;
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

		touchStartX = parseInt(touchobj.clientX);
		touchStartY = parseInt(touchobj.clientY);
		e.preventDefault();
	}

	function swipeMove(e: any) {
		let touchobj = e.changedTouches[0];
		let touchMoveX = parseInt(touchobj.clientX);
		let touchMoveY = parseInt(touchobj.clientY);
		let index = viewer.mainImage.getAttribute("data-walnut-index");
		let directionLine = viewer.directionLine;
		let directionArrow = viewer.directionArrow;
		let distX;
		let distY;

		distX = Math.abs(touchMoveX - touchStartX);
		distY = Math.abs(touchMoveY - touchStartY);

		directionLine.style.width = 40 + distX + "px";

		// Checks if you swipe right or left or if you swiped up or down more than allowed and checks if there is more pictures that way
		if(touchStartX > touchMoveX && distY < allowedTouchDistance  && index < containerArray[containerIndex].images.length - 1) {
			directionLine.classList.remove("walnut__direction-line--active-left");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-right");
			directionArrow.innerHTML = ""; // TODO: instead of removing just hide
			directionArrow.appendChild(g_svgBtnRight);

		} else if (touchStartX > touchMoveX && distY < allowedTouchDistance ) {
			// stop
			directionLine.classList.remove("walnut__direction-line--active-left");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-right");
			directionArrow.innerHTML = "";
			directionArrow.appendChild(g_svgCloseBtnFilled);

		} else if (touchStartX < touchMoveX && distY < allowedTouchDistance && index > 0) {
			directionLine.classList.remove("walnut__direction-line--active-right");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-left");
			directionArrow.innerHTML = "";
			directionArrow.appendChild(g_svgBtnLeft);

		} else if(touchStartX < touchMoveX && distY < allowedTouchDistance) {
			directionLine.classList.remove("walnut__direction-line--active-right");
			directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-left");
			directionArrow.innerHTML = "";
			directionArrow.appendChild(g_svgCloseBtnFilled);

		} else {
			directionLine.classList.remove("walnut__direction-line--active walnut__direction-line--active-left walnut__direction-line--active-right");
		}
		e.preventDefault();
	}

	function swipeEnd(e: any) {
		let touchobj   = e.changedTouches[0];
		let touchMoveX = parseInt(touchobj.clientX);
		let touchMoveY = parseInt(touchobj.clientY);
		let distY = Math.abs(touchMoveY - touchStartY);
		let distX = Math.abs(touchMoveX - touchStartX);
		let directionLine = viewer.directionLine;

		touchEnd = touchMoveX;

		e.preventDefault();

		directionLine.classList.remove("walnut__direction-line--active");
		directionLine.classList.remove("walnut__direction-line--active-left");
		directionLine.classList.remove("walnut__direction-line--active-right");

		if (touchStartX > touchEnd &&
				distX > minTouchDistance &&
				distY < allowedTouchDistance ) {

			nextImage();
		} else if (touchStartX < touchEnd &&
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
