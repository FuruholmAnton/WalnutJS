/**
 * TODO:
 * - support background images
 * - Get bigger image form srcset or attribute
 */

import {
	findAncestor,
	doDeviceHaveTouch,
	resizeEvent,
	launchIntoFullscreen,
	exitFullscreen,
	bind,
	getParent,
} from './helper';

import './walnut.scss';

/**
 * Create a new instance of Walnut for every different scope of images.
 *
 * @export
 * @class Walnut
 */
export default class Walnut {
    /**
     * Creates an instance of Walnut.
     * @param {HTMLElement} images - Either a <img> or an element with background-image
     * @memberof Walnut
     */
    constructor(images) {
		bind(this,
			'onDragPreviewList',
			'onDragingPreviewList',
			'onDragEndPreviewList',
			'nextImage',
			'prevImage',
			'fixViewer',
			'fullscreen',
			'initFlexEvents',
			'deinitFlexEvents',
			'handleWrapperClick',
		);


		this.initUI();

		this.ui.images = images;

        this.touch = {
            start: {},
            startX: 0,
            startY: 0,
            end: 0,
        };

        this.listContainer = {
            dragstartY: 0,
            dragendY: 0,
            lastY: 0,
            draging: false,
            translatedY: 0,
            dragCanceled: false,
        };

        this.allowedTouchDistance = 100;
        this.minTouchDistance = 20;

        for (let i = 0; i < this.ui.images.length; i++) {
            const el = this.ui.images[i];
            el.classList.add('walnut-image');
            el.setAttribute('data-walnut-image', i);
            el.addEventListener('click', (e) => {
                this.openViewer(e);
            });
        }
	}

	initUI() {
        const wrapper = document.getElementById('walnut-viewer');

		this.ui = {
			images: [],
			wrapper: wrapper,
			list: wrapper.getElementsByClassName('walnut__list')[0],
			listContainer: wrapper.getElementsByClassName('walnut__list-container')[0],
			listHandle: wrapper.getElementsByClassName('walnut__list-handle')[0],
			box: wrapper.getElementsByClassName('walnut__box')[0],
			mainImageContainer: wrapper.getElementsByClassName('walnut__image-container')[0],
			fullscreenBtn: wrapper.getElementsByClassName('walnut__fullscreen')[0],
			directionArrow: wrapper.getElementsByClassName('walnut__direction-arrow')[0],
			directionLine: wrapper.getElementsByClassName('walnut__direction-line')[0],
			mainImage: wrapper.getElementsByClassName('walnut__image')[0],
			prevBtn: wrapper.querySelector('.walnut__navigation.walnut__navigation--prev'),
			nextBtn: wrapper.querySelector('.walnut__navigation.walnut__navigation--next'),
			closeBtn: wrapper.getElementsByClassName('walnut-close')[0],
		};
	}

	initEvents() {
		const wrapper = this.ui.wrapper;


		document.addEventListener('keyup', this.checkKeyPressed, false);

		// ui.listHandle.addEventListener('drag', onDragingPreviewList);
		// ui.listHandle.addEventListener('dragstart', onDragPreviewList);
		// ui.listHandle.addEventListener('dragend', onDragEndPreviewList);

		// wrapper.addEventListener('mousemove', this.onDragingPreviewList);
		// wrapper.addEventListener('mousedown', this.onDragPreviewList);
		// wrapper.addEventListener('mouseup', this.onDragEndPreviewList);

		if (doDeviceHaveTouch()) {
			const mainImage = this.ui.mainImage;
			mainImage.addEventListener('touch.start', this.swipeStart);
			mainImage.addEventListener('touch.end', this.swipeEnd);
			mainImage.addEventListener('touchmove', this.swipeMove);
		} else {
			this.ui.nextBtn.addEventListener('click', this.nextImage);
			this.ui.prevBtn.addEventListener('click', this.prevImage);
		}

		wrapper.addEventListener('click', this.handleWrapperClick, false);
	}

	deinitEvents() {
		document.removeEventListener('keyup', this.checkKeyPressed, false);
		if (doDeviceHaveTouch()) {
			const mainImage = this.ui.mainImage;
			mainImage.removeEventListener('touch.start', this.swipeStart);
			mainImage.removeEventListener('touch.end', this.swipeEnd);
			mainImage.removeEventListener('touchmove', this.swipeMove);
		} else {
			this.ui.nextBtn.removeEventListener('click', this.nextImage);
			this.ui.prevBtn.removeEventListener('click', this.prevImage);
		}

		this.ui.wrapper.removeEventListener('click', this.handleWrapperClick, false);
	}

	handleWrapperClick(e) {
		e.stopPropagation();
		e.preventDefault();
		const target = e.target;

		if (target.isSameNode(this.ui.wrapper)) {
			this.clickWrapper(e);
		} else if (target.matches('.walnut__item')) {
			let src = target.getAttribute('data-walnut-source');
			this.changeImage(null, {
				source: src,
				target: target,
				index: parseInt(target.getAttribute('data-walnut-index')),
				container: null,
			});
		} else if (target.isSameNode(this.ui.closeBtn) || findAncestor(target, 'walnut-close')) {
			this.closeViewer();
		} else if (target.isSameNode(this.ui.fullscreenBtn) || getParent(target, '.walnut__fullscreen')) {
			this.fullscreen();
		}
	}

	initFlexEvents() {
		document.addEventListener('keyup', this.checkKeyPressed);
		window.addEventListener('popstate', this.changeHistory);
		resizeEvent(this.fixViewer);
	}
	deinitFlexEvents() {
		document.removeEventListener('keyup', this.checkKeyPressed);
		window.removeEventListener('popstate', this.changeHistory);
		resizeEvent(this.fixViewer, 'remove');
	}


	initOverviewList() {
		const list = this.ui.list;
		const images = this.ui.images;

		list.innerHTML = '';

		if (images.length > 1) {
			for (let i = 0; i < images.length; i++) {
				const li = document.createElement('li');
				li.className = 'walnut__item';
				li.style.backgroundImage = `url(${images[i].src})`;
				li.setAttribute('data-walnut-source', images[i].src);
				// li.setAttribute("data-walnut-index", images[i].index);

				list.appendChild(li);
			};
		}
	}

	fixListWidth() {
		let elItem = document.getElementsByClassName('walnut__item')[0];
		let listItem = elItem.offsetWidth;
		let elList = document.getElementsByClassName('walnut__list')[0];
		elList.style.width = (this.ui.images.length * listItem) + 'px';
	}

	openViewer(e) {
		const target = e.target;
		if (typeof target == 'undefined') return;

		let index = parseInt(target.getAttribute('data-walnut-image'));
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
			src = target.src;
		} else if (style.backgroundImage != 'none') {
			src = style.backgroundImage.slice(4, -1).replace(/"/g, '');
		} else {
			throw new Error('Couldn\'t find a image for element: ' + target);
		}

		mainImage.src = src;
		// mainImage.setAttribute('data-walnut-index', index);
		this.activeIndex = index;

		document.body.classList.add('walnut--open');


		let length = this.ui.images.length;

		if (index === 0 && index === length - 1) {
			prevBtn.style.display = 'none';
			nextBtn.style.display = 'none';
		} else if (index === 0) {
			prevBtn.style.display = 'none';
			nextBtn.style.display = '';
		} else if (index === (length - 1)) {
			nextBtn.style.display = 'none';
			prevBtn.style.display = '';
		} else {
			prevBtn.style.display = '';
			nextBtn.style.display = '';
		}

        this.initEvents();
		this.initFlexEvents();
		this.fixViewer();

		this.ui.wrapper.classList.add('walnut__wrapper--open');

		let stateObj = 'walnut';
		history.pushState(stateObj, 'walnut', '');
	}

	closeViewer() {
		this.activeIndex = 0;
		this.ui.mainImage.src = '';
		this.ui.wrapper.classList.remove('walnut__wrapper--open');

		document.body.classList.remove('walnut--open');
		this.deinitEvents();
		this.deinitFlexEvents();
		this.fullscreen('exit');
		if (history.state === 'walnut') {
			window.history.back();
		}
	}


	changeImage(action = undefined, object = {}) {
		let index = 0;
		const prevBtn = this.ui.prevBtn;
		const nextBtn = this.ui.nextBtn;
		const mainImage = this.ui.mainImage;
		const images = this.ui.images;

		if (typeof action !== 'undefined' && action !== null) {
			index = this.activeIndex;

			if (action === 'next' && index < images.length - 1) {
				index = index + 1;
			} else if (action === 'prev' && index > 0) {
				index = index - 1;
			} else {
				return;
			}

			// TODO: find right array istead of 0
			if (images[index]) {
                let src = '';
                if (images[index].src) {
                    src = images[index].src;
                } else if (images[index].style.backgroundImage != 'none') {
                    src = images[index].style.backgroundImage.slice(4, -1).replace(/"/g, '');
                }
				mainImage.src = src;
				this.activeIndex = index;
			}
		} else if (object && object.source) {
			index = parseInt(object.index);
			mainImage.src = object.source;
			this.activeIndex = index;
		}

		if (index === 0 && index === images.length - 1) {
			prevBtn.style.display = 'none';
			nextBtn.style.display = 'none';
		} else if (index === 0) {
			prevBtn.style.display = 'none';
			nextBtn.style.display = '';
		} else if (index === (images.length - 1)) {
			nextBtn.style.display = 'none';
			prevBtn.style.display = '';
		} else {
			prevBtn.style.display = '';
			nextBtn.style.display = '';
		}

		this.checkHeight();
	}

	fixViewer() {
		this.checkHeight();
		if (document.getElementsByClassName('.walnut__item')[0] instanceof HTMLElement) {
			this.fixListWidth();
		}
	}

	checkHeight() {
		let viewerHeight = this.ui.box.offsetHeight;
		let wrapper = this.ui.wrapper;

		if (viewerHeight > window.innerHeight) {
			wrapper.classList.add('walnut--align-top');
		} else {
			wrapper.classList.remove('walnut--align-top');
		}
	}

	checkKeyPressed(e) {
		let key = e.keyCode;
		if (key === 37) {
			this.changeImage('prev');
		} else if (key === 39) {
			this.changeImage('next');
		} else if (key === 27) {
			this.closeViewer();
		}
	}

	clickWrapper(e) {
		e.stopPropagation(); // FIXME: stop event from bubbling
		e.preventDefault(); // FIXME: stop event from bubbling

		this.closeViewer(this);
	}

	fullscreen(option = '') {
		let wrapper = this.ui.wrapper;
		let fullscreenBtn = this.ui.fullscreenBtn;

		if (option === 'exit') {
			exitFullscreen();
			fullscreenBtn.classList.remove('walnut__fullscreen--hidden');
		} else {
			launchIntoFullscreen(wrapper);
			fullscreenBtn.classList.add('walnut__fullscreen--hidden');
		}
	}

	nextImage() {
		this.changeImage('next');
	}

	prevImage() {
		this.changeImage('prev');
	}

	onDragPreviewList(e) {
		const target = e.target;
		this.clickTarget = target;
		if (target.matches('.walnut__list-handle')) {
			e.preventDefault();
			console.log('dragStart', e);
			this.listContainer.dragstartY = e.clientY;
			this.listContainer.draging = true;
		}
	}

	onDragingPreviewList(e) {
		e.preventDefault();
		let y = parseFloat(e.clientY);
		if (this.listContainer.draging && !this.listContainer.dragCanceled && (y > (this.listContainer.dragstartY + 1) ||
			y < (this.listContainer.dragstartY - 1))) {
			window.requestAnimationFrame(() => {
				let startY = this.listContainer.dragstartY;
				let translated = this.listContainer.translatedY;
				let newY = translated + (y - startY);
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

	onDragEndPreviewList(e) {
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

	swipeStart(e) {
		let touchobj = e.changedTouches[0];

		this.touch.startX = parseInt(touchobj.clientX);
		this.touch.startY = parseInt(touchobj.clientY);
		e.preventDefault();
	}

	swipeMove(e) {
		let touchobj = e.changedTouches[0];
		let touchMoveX = parseInt(touchobj.clientX);
		let touchMoveY = parseInt(touchobj.clientY);
		// let index = parseInt(this.ui.mainImage.getAttribute('data-walnut-index'));
		let index = this.activeIndex;
		let directionLine = this.ui.directionLine;
		let directionArrow = this.ui.directionArrow;
		let distX;
		let distY;

		distX = Math.abs(touchMoveX - this.touch.startX);
		distY = Math.abs(touchMoveY - this.touch.startY);

		directionLine.style.width = 40 + distX + 'px';

		// Checks if you swipe right or left or if you swiped up or down more than allowed and checks if there is more pictures that way
		if (this.touch.startX > touchMoveX && distY < this.allowedTouchDistance && index < this.ui.images.length - 1) {
			directionLine.classList.remove('walnut__direction-line--active-left');
			directionLine.classList.add('walnut__direction-line--active walnut__direction-line--active-right');
			directionArrow.innerHTML = ''; // TODO: instead of removing just hide
		} else if (this.touch.startX > touchMoveX && distY < this.allowedTouchDistance) {
			// stop
			directionLine.classList.remove('walnut__direction-line--active-left');
			directionLine.classList.add('walnut__direction-line--active walnut__direction-line--active-right');
			directionArrow.innerHTML = '';
		} else if (this.touch.startX < touchMoveX && distY < this.allowedTouchDistance && index > 0) {
			directionLine.classList.remove('walnut__direction-line--active-right');
			directionLine.classList.add('walnut__direction-line--active walnut__direction-line--active-left');
			directionArrow.innerHTML = '';
		} else if (this.touch.startX < touchMoveX && distY < this.allowedTouchDistance) {
			directionLine.classList.remove('walnut__direction-line--active-right');
			directionLine.classList.add('walnut__direction-line--active walnut__direction-line--active-left');
			directionArrow.innerHTML = '';
		} else {
			directionLine.classList.remove('walnut__direction-line--active walnut__direction-line--active-left walnut__direction-line--active-right');
		}
		e.preventDefault();
	}

	swipeEnd(e) {
		let touchobj = e.changedTouches[0];
		let touchMoveX = parseInt(touchobj.clientX);
		let touchMoveY = parseInt(touchobj.clientY);
		let distY = Math.abs(touchMoveY - this.touch.startY);
		let distX = Math.abs(touchMoveX - this.touch.startX);
		let directionLine = this.ui.directionLine;

		this.touch.end = touchMoveX;

		e.preventDefault();

		directionLine.classList.remove('walnut__direction-line--active');
		directionLine.classList.remove('walnut__direction-line--active-left');
		directionLine.classList.remove('walnut__direction-line--active-right');

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

	changeHistory(event) {
		this.closeViewer();
	}
}
