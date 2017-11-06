'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

/**
 * Looks for the attribute first.
 * If no elements are found then tries with classList
 *
 * @export
 * @param {HTMLElement} el
 * @param {string} cls
 * @returns
 */
function findAncestor(el, cls) {
    let elem = el;
    while ((elem = elem.parentElement) && !elem.hasAttribute(cls))
        ;
    if (elem instanceof HTMLElement) {
        return elem;
    }
    else {
        elem = el;
        while ((elem = elem.parentElement) && !elem.classList.contains(cls))
            ;
        if (elem instanceof HTMLElement) {
            return elem;
        }
        else {
            return false;
        }
    }
}

let launchIntoFullscreen = undefined;
let exitFullscreen = undefined;


launchIntoFullscreen = function (element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};
exitFullscreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};
/**
 * [doDeviceHaveTouch description]
 */
function doDeviceHaveTouch() {
    var bool = false;
    if (('ontouchstart' in window) || window.DocumentTouch) {
        bool = true;
    }
    return bool;
}
/**
 * On ResizeEvent function
 */
function resizeEvent(callback, action = undefined) {
    if (action === "remove") {
        window.removeEventListener('resize', callback, true);
        window.removeEventListener("orientationchange", callback);
    }
    else {
        window.addEventListener('resize', callback, true);
        window.addEventListener("orientationchange", callback);
    }
}

// TODO: support background images
/**
 * Create a new instance of Walnut for every different scope of images.
 *
 * @export
 * @class Walnut
 */
class Walnut {
    /**
     * Creates an instance of Walnut.
     * @param {HTMLElement} images - Either a <img> or an element with background-image
     * @memberof Walnut
     */
    constructor(...images) {
        this.onDragPreviewList = this.onDragPreviewList.bind(this);
        this.onDragingPreviewList = this.onDragingPreviewList.bind(this);
        this.onDragEndPreviewList = this.onDragEndPreviewList.bind(this);
        this.nextImage = this.nextImage.bind(this);
        this.prevImage = this.prevImage.bind(this);

		this.initUI();

		for (let i = 0; i < images.length; i++) {
			if (Array.isArray(images[i])) {
				this.ui.images = this.ui.images.concat(images[i]);
			} else if (images[i] instanceof HTMLElement) {
				this.ui.images.push(images[i]);
			} else {
				throw 'Invalid element';
			}
        }

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

        this.initEvents();
	}

	initUI() {
		// REVIEW: change all classes to IDs ?
        const wrapper = document.getElementById('walnut-viewer').cloneNode(true);

        document.body.appendChild(wrapper);

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

		wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
			const target = e.target;

			if (target.isSameNode(wrapper)) {
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
				this.closeViewer.call(this);
			} else if (target.isSameNode(this.ui.fullscreenBtn)) {
				this.fullscreen.call(this);
			}
		}, false);


		document.addEventListener('keyup', this.checkKeyPressed, false);

		// ui.listHandle.addEventListener('drag', onDragingPreviewList);
		// ui.listHandle.addEventListener('dragstart', onDragPreviewList);
		// ui.listHandle.addEventListener('dragend', onDragEndPreviewList);

		this.ui.wrapper.addEventListener('mousemove', this.onDragingPreviewList);
		this.ui.wrapper.addEventListener('mousedown', this.onDragPreviewList);
		this.ui.wrapper.addEventListener('mouseup', this.onDragEndPreviewList);

		if (doDeviceHaveTouch()) {
			const mainImage = this.ui.mainImage;
			mainImage.addEventListener('touch.start', this.swipeStart);
			mainImage.addEventListener('touch.end', this.swipeEnd);
			mainImage.addEventListener('touchmove', this.swipeMove);
		} else {
			this.ui.nextBtn.addEventListener('click', this.nextImage);
			this.ui.prevBtn.addEventListener('click', this.prevImage);
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
			}
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

		let index = target.getAttribute('data-walnut-image');
		let mainImage = this.ui.mainImage;
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
		mainImage.setAttribute('data-walnut-index', index);


		document.body.classList.add('walnut--open');

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

		this.ui.wrapper.classList.add('walnut__wrapper--open');

		let stateObj = 'walnut';
		history.pushState(stateObj, 'walnut', '');
	}

	closeViewer() {
		this.ui.mainImage.src = '';
		this.ui.wrapper.classList.remove('walnut__wrapper--open');
		document.body.classList.remove('walnut--open');
		this.deinitFlexEvents();
		this.fullscreen('exit');
		if (history.state === 'walnut') {
			window.history.back();
		}
	}


	changeImage(action = undefined, object = undefined) {
		let index = 0;
		const prevBtn = this.ui.prevBtn;
		const nextBtn = this.ui.nextBtn;
		const mainImage = this.ui.mainImage;
		const images = this.ui.images;

		if (typeof action !== 'undefined' && action !== null) {
			index = parseInt(mainImage.getAttribute('data-walnut-index'));

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
				mainImage.setAttribute('data-walnut-index', index.toString());
			}
		} else if (object && object.source) {
			index = parseInt(object.index);
			mainImage.src = object.source;
			mainImage.setAttribute('data-walnut-index', index.toString());
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
		let index = parseInt(this.ui.mainImage.getAttribute('data-walnut-index'));
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

document.querySelectorAll('[walnut]').forEach((el) => {
    new Walnut([...el.getElementsByTagName('img')], [...el.querySelectorAll('.image')]);
});
//# sourceMappingURL=index.js.map
