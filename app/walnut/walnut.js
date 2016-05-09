
var walnut = (function() {
	"use strict";

	/*
	* Looks for the attribute first.
	* If no elements are found then tries with classList
	*/
	function findAncestor (el, cls) {
		var elem = el;
	    while ((elem = elem.parentElement) && !elem.hasAttribute(cls));
	    if (elem instanceof HTMLElement) {
	    	return elem;
	    } else {
	    	elem = el;
	    	while ((elem = elem.parentElement) && !elem.classList.contains(cls));
	    	if (elem instanceof HTMLElement) {
	    		return elem;
	    	} else {
	    		throw new Error("Couldn't find any container with attribute or class 'walnut' of this element");
	    	}
	    }
	}

	function isFullscreenEnabled() {
		return document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled;
	}
	var launchIntoFullscreen,
		exitFullscreen;

	if (!!isFullscreenEnabled()) {

		var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

		launchIntoFullscreen = function (element) {
		  if(element.requestFullscreen) {
		    element.requestFullscreen();
		  } else if(element.mozRequestFullScreen) {
		    element.mozRequestFullScreen();
		  } else if(element.webkitRequestFullscreen) {
		    element.webkitRequestFullscreen();
		  } else if(element.msRequestFullscreen) {
		    element.msRequestFullscreen();
		  }
		};

		exitFullscreen = function () {
		  if(document.exitFullscreen) {
		    document.exitFullscreen();
		  } else if(document.mozCancelFullScreen) {
		    document.mozCancelFullScreen();
		  } else if(document.webkitExitFullscreen) {
		    document.webkitExitFullscreen();
		  }
		}
	}

	/**
	 * [doDeviceHaveTouch description]
	 */
	function doDeviceHaveTouch() {
		return !!(("ontouchstart" in window) ||
				window.navigator && window.navigator.msPointerEnabled && window.MSGesture ||
				window.DocumentTouch && document instanceof DocumentTouch ||
				/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
	}

	/**
	 * requestAnimationFrame Polyfill
	 */
	window.requestAnimationFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame
	})();

	/**
	 * EventListener polyfill
	 */
	!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
		WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
			var target = this;

			registry.unshift([target, type, listener, function (event) {
				event.currentTarget = target;
				event.preventDefault = function () { event.returnValue = false };
				event.stopPropagation = function () { event.cancelBubble = true };
				event.target = event.srcElement || target;

				listener.call(target, event);
			}]);

			this.attachEvent("on" + type, registry[0][3]);
		};

		WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
			for (var index = 0, register; register = registry[index]; ++index) {
				if (register[0] == this && register[1] == type && register[2] == listener) {
					return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
				}
			}
		};

		WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
			return this.fireEvent("on" + eventObject.type, eventObject);
		};
	})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);


	/**
	 * On ResizeEvent function
	 */
	function resizeEvent(callback, action) {
		if(action === "remove") {
			window.removeEventListener('resize', callback, true);
			window.removeEventListener("orientationchange", callback);
		} else {
			window.addEventListener('resize', callback, true);
			window.addEventListener("orientationchange", callback);
		}
	}

	/**
	 * Use SVG as inline JavaScript
	 */
	var svgCloseBtn = '<svg class="walnut-close" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"/><path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"/><path class="walnut-close__path" fill="#fff" d="M2.8 80.4L80.3 3l714.4 714.3-77.5 77.5z"/><path class="walnut-close__path" fill="#fff" d="M797.7 82.5L717.2 2 2.8 716.4 83.2 797z"/></svg>',
		svgCloseBtnFilled = '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path d="M400 7.2c219.4 0 397.6 176.3 397.6 393.5S619.4 794.3 400 794.3C180.6 794.3 2.4 618 2.4 400.7 2.4 183.5 180.6 7.2 400 7.2zm-48.2 389L153.2 595l50.2 50.2L402 446.5 599.4 644l48.4-48.5L450.5 398l199.2-199-50.2-50.4L400.2 348 201.5 149 153 197.6 352 396.3z" fill="#fff"/></svg>',
		svgFullscreenBtn = '<svg class="walnut__fullscreen" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path d="M3.4 15.4H0V24h8.6v-3.4H3.4v-5.2zM0 8.6h3.4V3.4h5.2V0H0v8.6zm20.6 12h-5.2V24H24v-8.6h-3.4v5.2zM15.4 0v3.4h5.2v5.2H24V0h-8.6z" fill="#fff" fill-rule="nonzero"/></svg>',
		svgBtnLeft = '<svg class="walnut__navigation-img" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41"><g fill="#fff" fill-rule="nonzero"><path d="M22.12 44.24c12.2 0 22.12-9.93 22.12-22.12C44.24 9.92 34.3 0 22.12 0 9.92 0 0 9.92 0 22.12c0 12.2 9.92 22.12 22.12 22.12zm0-42.74c11.37 0 20.62 9.25 20.62 20.62 0 11.37-9.25 20.62-20.62 20.62-11.37 0-20.62-9.25-20.62-20.62C1.5 10.75 10.75 1.5 22.12 1.5z"/><path d="M24.9 29.88c.2 0 .38-.07.52-.22.3-.3.3-.76 0-1.06l-6.8-6.8 6.8-6.8c.3-.3.3-.77 0-1.06-.3-.3-.76-.3-1.06 0l-7.32 7.33c-.3.3-.3.77 0 1.06l7.32 7.33c.15.15.34.22.53.22z"/></g></svg>',
		svgBtnRight = '<svg class="walnut__navigation-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.236 44.236"><g fill="#FFF"><path d="M22.12 44.24C9.92 44.24 0 34.3 0 22.12S9.92 0 22.12 0s22.12 9.92 22.12 22.12-9.93 22.12-22.12 22.12zm0-42.74C10.75 1.5 1.5 10.75 1.5 22.12c0 11.37 9.25 20.62 20.62 20.62 11.37 0 20.62-9.25 20.62-20.62 0-11.37-9.25-20.62-20.62-20.62z"/><path d="M19.34 29.88c-.2 0-.38-.07-.53-.22-.28-.3-.28-.76 0-1.06l6.8-6.8-6.8-6.8c-.28-.3-.28-.77 0-1.07.3-.3.78-.3 1.07 0l7.33 7.34c.3.3.3.77 0 1.06l-7.33 7.33c-.14.15-.34.22-.53.22z"/></g></svg>';

	var parser = new DOMParser(),
		g_svgCloseBtn = parser.parseFromString(svgCloseBtn, "image/svg+xml").documentElement,
		g_svgCloseBtnFilled = parser.parseFromString(svgCloseBtnFilled, "image/svg+xml").documentElement,
		g_svgFullscreenBtn = parser.parseFromString(svgFullscreenBtn, "image/svg+xml").documentElement,
		g_svgBtnLeft = parser.parseFromString(svgBtnLeft, "image/svg+xml").documentElement,
		g_svgBtnRight = parser.parseFromString(svgBtnRight, "image/svg+xml").documentElement;

	/**
	 * [walnut description]
	 */
	var walnut = (function() {

		var path,
			pathArray,
			pathMiddle,
			newPathname,
			i,
			navigationButtons,
			containerIndex,
			body;

		var CONTAINERS,
			containerArray	     	= [],
			viewer 		     		= {},
			config 		     		= {},
			touchStart		     	= 0,
			touchStartX		     	= 0,
			touchStartY		     	= 0,
			touchEnd		     	= 0,
			allowedTouchDistance 	= 100,
			minTouchDistance 		= 20;


		var utils = {
			getContainers:function() {
				var elems = document.querySelectorAll('[walnut]');
				if (elems.length > 0) {
					return elems;
				} else {
					elems = document.querySelectorAll('.walnut');
					if (elems.length > 0) {
						return elems;
					} else {
						throw new Error("Couldn't find any containers for ");
					}
				}
			},
			getScriptSrc:function() {
				var elem = document.querySelector('[walnut-script]');
				if (elem instanceof HTMLElement) {
					return elem.src;
				} else {
					elem = document.getElementById('walnutScript');
					if (elem instanceof HTMLElement) {
						return elem.src;
					} else {
						console.warn("Couldn't find the script-tag for walnut with attribute walnut-script or id='walnutScript'");
					}
				}
			},
			once:function(fn, context) {
				// function can only fire once
				var result;

				return function() {
					if(fn) {
						result = fn.apply(context || this, arguments);
						fn = null;
					}

					return result;
				};
			}
		}

		function init() {
			var newPath;

			CONTAINERS = utils.getContainers();

			path = utils.getScriptSrc();

			pathArray = path.split( '/' );
			pathArray.splice(pathArray.length-1, 0, "styles");
			newPath = pathArray.join("/");
			newPath = newPath.replace("walnut.js", "walnut.css");

			config.pathToCSS = newPath;

			addCSSLink();
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
		var initEvents = utils.once(function() {
			var mainImage = viewer.mainImage;
			viewer.wrapper.addEventListener("click", clickWrapper);
			viewer.closeBtn.addEventListener("click", closeViewer);
			viewer.fullscreenBtn.addEventListener("click", fullscreen);
			document.addEventListener("keyup", checkKeyPressed);

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
		 * Add the CSS Link in the document
		 * REVIEW: Have user do it himself to make it easy for customization?
		 */
		function addCSSLink() {

			var fileref = document.createElement("link");

		    fileref.setAttribute("rel", "stylesheet");
	        fileref.setAttribute("type", "text/css");
	        fileref.setAttribute("href", config.pathToCSS);

			document.getElementsByTagName("head")[0].appendChild(fileref);

		}

		/**
		 * Indexes as images so related images will show as thumbnails when opening the viewer
		 */
		function indexImages(){
			for (var i = 0; i < CONTAINERS.length; i++) {

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
				 * TODO: If one is chosen then use it and not the others
				 */
				var img = CONTAINERS[i].getElementsByTagName("img"),
					bgOld = CONTAINERS[i].getElementsByClassName("walnut-image"),
					bg = CONTAINERS[i].querySelectorAll('[walnut-image]'),
					images = [];

				if (bgOld.length) {
					for (var x = 0; x < bgOld.length; x++) {
						images.push(bgOld[x]);
					}
				}
				if (bg.length) {
					for (var x = 0; x < bg.length; x++) {
						images.push(bg[x]);
					}
				}
				if (!bgOld.length && !bg.length && img ) {
					for (var x = 0; x < img.length; x++) {
						images.push(img[x]);
					}
				}


				for (var j = 0; j < images.length; j++) {

					images[j].addEventListener("click", openViewer);

					images[j].setAttribute("data-walnut-index", j);

					var src;

					if(images[j].src) {
						src = images[j].src
					} else {
						var style = images[j].currentStyle || window.getComputedStyle(images[j], false);
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
			var ul 					= document.createElement("ul"),
				listContainer 		= document.createElement("div"),
				wrapper 			= document.createElement("div"),
				box  				= document.createElement("div"),
				mainImage 			= document.createElement("img"),
				mainImageContainer 	= document.createElement("div"),
				nextBtn 			= document.createElement("div"),
				prevBtn 			= document.createElement("div"),
				closeBtn 			= document.createElement("img"),
				bodyTag 			= document.getElementsByTagName("body")[0],
				elDirectionArrow    = document.createElement("div"),
				elDirectionLine    	= document.createElement("div");



			/**
			 * Add CSS classes to the elements
			 */
			ul.className 					= "walnut__list";
			listContainer.className 		= "walnut__list-container";
			mainImage.className 			= "walnut__image";
			mainImageContainer.className 	= "walnut__image-container"
			box.className 					= "walnut__box";
			wrapper.className 				= "walnut__wrapper";
			// wrapper.setAttribute("draggable", "true");
			nextBtn.className 				= "walnut__navigation walnut__navigation--next";
			prevBtn.className 				= "walnut__navigation walnut__navigation--prev";
			elDirectionArrow.className 		= "walnut__direction-arrow";
			elDirectionLine.className 		= "walnut__direction-line";

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
			box.appendChild(mainImageContainer);
			box.appendChild(listContainer);
			wrapper.appendChild(g_svgCloseBtn);
			wrapper.appendChild(box);
			bodyTag.appendChild(wrapper);


			/**
			 * Add Fullscreen button when not in fullscreen mode
			 */
			if(!!isFullscreenEnabled()) {
				wrapper.appendChild(g_svgFullscreenBtn);
			}

			/**
			 * Make variables global for walnut
			 */
			body 				 = bodyTag;
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
		function openViewer(e) {

			var index,
				container,
				listItem,
				mainImage = viewer.mainImage,
				prevBtn = viewer.prevBtn,
				nextBtn = viewer.nextBtn;


			container = findAncestor(e.target, "walnut")
			containerIndex = container.getAttribute("data-walnut-container");

			setImages(containerIndex);

			index = this.getAttribute("data-walnut-index");
			index = parseInt(index);

			var src;
			var style = this.currentStyle || window.getComputedStyle(this, false);

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


			body.classList.add("walnut--open");

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

			var stateObj = "walnut";
			history.pushState(stateObj, "walnut", "");

		}

		function setImages(containerIndex) {
			var img,
				li,
				list = viewer.list;

			list.innerHTML = "";

			if(containerArray[containerIndex].images.length > 1) {
				for (var i = 0; i < containerArray[containerIndex].images.length; i++) {
					li = document.createElement("li");
					li.className = "walnut__item";
					li.style.backgroundImage = "url(" + containerArray[containerIndex].images[i].src + ")";
					li.setAttribute("data-walnut-source", containerArray[containerIndex].images[i].src);
					li.setAttribute("data-walnut-index", containerArray[containerIndex].images[i].index);


					li.addEventListener("click", function(){
						var src = this.getAttribute("data-walnut-source");
						changeImage(null,{
							source: src,
							index: this.getAttribute("data-walnut-index"),
							container: null
						});
					});

					list.appendChild(li);

				};
			}
		}

		function fixListWidth() {
			var listItem = document.querySelector(".walnut__item").offsetWidth;
			document.querySelector(".walnut__list").style.width = (containerArray[containerIndex].images.length *  listItem) + "px";
		}

		function closeViewer() {
			viewer.mainImage.src = "";
			viewer.wrapper.classList.remove("walnut__wrapper--open");
			body.classList.remove("walnut--open");
			deinitFlexEvents();
			fullscreen("exit");
			if (history.state === "walnut") {
				window.history.back();
			}
		}

		function changeImage(action, object) {
			"use strict";

			var newIndex = 0,
				index = 0,
				prevBtn = viewer.prevBtn,
				nextBtn = viewer.nextBtn,
				mainImage = viewer.mainImage;

			if(typeof action !== "undefined" && action !== null ){
				index = mainImage.getAttribute("data-walnut-index");
				index = parseInt(index);

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


			} else if(typeof object !== "undefined"){
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
			if(document.querySelector(".walnut__item") instanceof HTMLElement) {
				fixListWidth();
			}
		}

		function checkHeight() {
			var viewerHeight = viewer.box.offsetHeight,
				wrapper = viewer.wrapper;

			if ( viewerHeight > window.innerHeight) {
				wrapper.classList.add("walnut--align-top");
			} else {
				wrapper.classList.remove("walnut--align-top");
			}
		}

		function checkKeyPressed(e) {
			var key = e.keyCode;
			if( key === 37) {
				changeImage("prev");
			} else if(key === 39) {
				changeImage("next");
			} else if(key === 27) {
				closeViewer();
			}
		}

		function clickWrapper(e) {
			e.stopPropagation(); // FIXME: stop event from bubbling
			e.preventDefault(); // FIXME: stop event from bubbling
			if (e.target !== this) {
			    return;
			}
			closeViewer.call(this);
		}

		function fullscreen(option) {
			var wrapper 		= viewer.wrapper,
				fullscreenBtn 	= viewer.fullscreenBtn;

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

		function swipeStart(e) {
			var touchobj = e.changedTouches[0];
			touchStartX = parseInt(touchobj.clientX);
			touchStartY = parseInt(touchobj.clientY);
			e.preventDefault();
		}

		function swipeMove(e) {
			var touchobj = e.changedTouches[0],
				touchMoveX = parseInt(touchobj.clientX),
				touchMoveY = parseInt(touchobj.clientY),
				index = viewer.mainImage.getAttribute("data-walnut-index"),
				directionLine = viewer.directionLine,
				directionArrow = viewer.directionArrow,
				distX,
				distY;

			distX = Math.abs(touchMoveX - touchStartX);
			distY = Math.abs(touchMoveY - touchStartY);

			directionLine.style.width = 40 + distX + "px";

			// Checks if you swipe right or left or if you swiped up or down more than allowed and checks if there is more pictures that way
			if(touchStartX > touchMoveX && distY < allowedTouchDistance  && index < containerArray[containerIndex].images.length - 1) {
				directionLine.classList.remove("walnut__direction-line--active-left");
				directionLine.classList.add("walnut__direction-line--active");
				directionLine.classList.add("walnut__direction-line--active-right");
				directionArrow.innerHTML = "";
				directionArrow.appendChild(g_svgBtnRight);

			} else if (touchStartX > touchMoveX && distY < allowedTouchDistance ) {
				// stop
				directionLine.classList.remove("walnut__direction-line--active-left");
				directionLine.classList.add("walnut__direction-line--active");
				directionLine.classList.add("walnut__direction-line--active-right");
				directionArrow.innerHTML = "";
				directionArrow.appendChild(g_svgCloseBtnFilled);

			} else if (touchStartX < touchMoveX && distY < allowedTouchDistance && index > 0) {
				directionLine.classList.remove("walnut__direction-line--active-right");
				directionLine.classList.add("walnut__direction-line--active");
				directionLine.classList.add("walnut__direction-line--active-left");
				directionArrow.innerHTML = "";
				directionArrow.appendChild(g_svgBtnLeft);

			} else if(touchStartX < touchMoveX && distY < allowedTouchDistance) {
				directionLine.classList.remove("walnut__direction-line--active-right");
				directionLine.classList.add("walnut__direction-line--active");
				directionLine.classList.add("walnut__direction-line--active-left");
				directionArrow.innerHTML = "";
				directionArrow.appendChild(g_svgCloseBtnFilled);

			} else {
				directionLine.classList.remove("walnut__direction-line--active");
				directionLine.classList.remove("walnut__direction-line--active-left");
				directionLine.classList.remove("walnut__direction-line--active-right");
			}
			e.preventDefault();
		}

		function swipeEnd(e) {
			var touchobj   = e.changedTouches[0],
				touchMoveX = parseInt(touchobj.clientX),
				touchMoveY = parseInt(touchobj.clientY),
				distY = Math.abs(touchMoveY - touchStartY),
				distX = Math.abs(touchMoveX - touchStartX),
				directionLine = viewer.directionLine;

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

		function changeHistory(event) {
			closeViewer();
		}

		return {
			init: init
		}
	}());

	return {
		init: walnut.init
	}
})();
