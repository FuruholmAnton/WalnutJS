
(function() {
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
	 * @return {[type]} [description]
	 */
	function doDeviceHaveTouch() {
		return !!(("ontouchstart" in window) ||
				window.navigator && window.navigator.msPointerEnabled && window.MSGesture ||
				window.DocumentTouch && document instanceof DocumentTouch ||
				/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
	}

	window.requestAnimationFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame
	})();

	/**
	 * EventListener polyfill
	 * @param  {[type]} win [description]
	 * @param  {[type]} doc [description]
	 * @return {[type]}     [description]
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
	 * [resize description]
	 * @param  {Function} callback [description]
	 * @param  {[type]}   action   [description]
	 * @return {[type]}            [description]
	 */
	function resize(callback, action) {
		if(action === "remove") {
			window.removeEventListener('resize', callback, true);
			window.removeEventListener("orientationchange", callback);
		} else {
			window.addEventListener('resize', callback, true);
			window.addEventListener("orientationchange", callback);
		}
	}

	/**
	 * SVG init
	 * @type {String}
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
	 * @type {Object}
	 */
	var walnut = {

		init:function() {

			var path,
				pathArray,
				pathMiddle,
				newPathname,
				i,
				navigationButtons;

			this.CONTAINERS 	     	= walnut.getContainers();
			this.containerArray	     	= [];
			this.viewer 		     	= {};
			this.config 		     	= {};
			this.touchStart		     	= 0;
			this.touchEnd		     	= 0;
			this.allowedTouchDistance 	= 100;
			this.minTouchDistance 		= 20;

			path = walnut.getScriptSrc();

			path = path.replace("walnut.js", "");

			pathArray = path.split( '/' );

			newPathname = "";

			/* i = 3 because it skips "http://example.com/" */
			for (var i = 3; i < pathArray.length; i++) {

				if(i !== 3) {
					newPathname += "/";
				}

			  	newPathname += pathArray[i];
			}


			pathMiddle = location.pathname;
			if (pathMiddle.length > 1) {
				newPathname = newPathname.replace(pathMiddle, "/");
			}
			newPathname = "/" + newPathname;

			walnut.config.path = newPathname;

			this.addCSSLink();
			this.indexImages();
			this.buildViewer();



			if (doDeviceHaveTouch()) {
				walnut.viewer.wrapper.classList.add("walnut--is-touch");
			}

		},

		getContainers:function() {
			var elems = document.querySelectorAll('[walnut]');
			if (elems.length > 0) {
				return elems;
			} else {
				elems = document.querySelectorAll('.walnut');
				if (elems.length > 0) {
					return elems;
				} else {
					throw new Error("Couldn't find any containers for walnut.");
				}
			}
		},

		getScriptSrc:function() {
			var elem = document.querySelector('[walnut-script]');
			if (elem instanceof HTMLElement) {
				return elem.src;
			} else {
				elem = document.getElementById('scriptTag');
				if (elem instanceof HTMLElement) {
					return elem.src;
				} else {
					throw new Error("Couldn't find the script-tag for walnut with attribute walnut-script or id='walnutScript'");
				}
			}
		},

		initEvents:function() {
			walnut.viewer.wrapper.addEventListener("click", walnut.clickWrapper);
			walnut.viewer.closeBtn.addEventListener("click", walnut.closeViewer);
			walnut.viewer.fullscreenBtn.addEventListener("click", walnut.fullscreen);
			document.addEventListener("keyup", walnut.checkKeyPressed);
			resize(walnut.fixViewer);

			if (doDeviceHaveTouch()) {
				walnut.viewer.mainImage.addEventListener("touchstart", walnut.swipeStart);
				walnut.viewer.mainImage.addEventListener("touchend", walnut.swipeEnd);
				walnut.viewer.mainImage.addEventListener("touchmove", walnut.swipeMove);
			} else {
				walnut.viewer.nextBtn.addEventListener("click", walnut.nextImage);
				walnut.viewer.prevBtn.addEventListener("click", walnut.prevImage);
			}
		},
		deinitEvents:function() {
			walnut.viewer.wrapper.removeEventListener("click", walnut.clickWrapper);
			walnut.viewer.closeBtn.removeEventListener("click", walnut.closeViewer);
			walnut.viewer.fullscreenBtn.removeEventListener("click", walnut.fullscreen);
			document.removeEventListener("keyup", walnut.checkKeyPressed);
			resize(walnut.fixViewer, "remove");

			if (doDeviceHaveTouch()) {
				walnut.viewer.mainImage.removeEventListener("touchstart", walnut.swipeStart);
				walnut.viewer.mainImage.removeEventListener("touchend", walnut.swipeEnd);
				walnut.viewer.mainImage.removeEventListener("touchmove", walnut.swipeMove);
			} else {
				walnut.viewer.nextBtn.removeEventListener("click", walnut.nextImage);
				walnut.viewer.prevBtn.removeEventListener("click", walnut.prevImage);
			}
		},

		addCSSLink:function() {

			var fileref = document.createElement("link");

		    fileref.setAttribute("rel", "stylesheet");
	        fileref.setAttribute("type", "text/css");
	        fileref.setAttribute("href", walnut.config.path + "styles/walnut.css");

			document.getElementsByTagName("head")[0].appendChild(fileref);

		},

		indexImages:function(){
			for (var i = 0; i < this.CONTAINERS.length; i++) {
				this.containerArray.push({
					container: this.CONTAINERS[i],
					images: []
				});

				this.CONTAINERS[i].setAttribute("data-walnut-container", i);
				// debugger;
				var img = this.CONTAINERS[i].getElementsByTagName("img");
				var bgOld = this.CONTAINERS[i].getElementsByClassName("walnut-image");
				var bg = this.CONTAINERS[i].querySelectorAll('[walnut-image]');

				var images = [];
				if (bgOld) {
					for (var x = 0; x < bgOld.length; x++) {
						images.push(bgOld[x]);
					}
				}
				if (bg) {
					for (var x = 0; x < bg.length; x++) {
						images.push(bg[x]);
					}
				}

				if (img) {
					for (var x = 0; x < img.length; x++) {
						images.push(img[x]);
					}
				}


				for (var j = 0; j < images.length; j++) {

					images[j].addEventListener("click", walnut.openViewer);

					images[j].setAttribute("data-walnut-index", j);

					var src;

					if(images[j].src) {
						src = images[j].src
					} else {
						var style = images[j].currentStyle || window.getComputedStyle(images[j], false);
						src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
					}

					this.containerArray[i].images.push({
						elem: images[j],
						src: src,
						index: j
					});
				};
			};
		},

		buildViewer:function() {
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




			ul.className 					= "walnut__list";
			listContainer.className 		= "walnut__list-container";
			mainImage.className 			= "walnut__image";
			mainImageContainer.className 	= "walnut__image-container"
			box.className 					= "walnut__box";
			wrapper.className 				= "walnut__wrapper";
			nextBtn.className 				= "walnut__navigation walnut__navigation--next";
			prevBtn.className 				= "walnut__navigation walnut__navigation--prev";
			elDirectionArrow.className 		= "walnut__direction-arrow";
			elDirectionLine.className 		= "walnut__direction-line";

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


			// if
			if(!!isFullscreenEnabled()) {

				// var fullscreenBtn = document.createElement("img");
				// fullscreenBtn.className 		= "walnut__fullscreen";
				// fullscreenBtn.src 				= walnut.config.path + "images/button_fullscreen.svg";
				wrapper.appendChild(g_svgFullscreenBtn);
			}


			// Make variables global in walnut Object
			walnut.body 				 = bodyTag;
			walnut.viewer.closeBtn		 = g_svgCloseBtn;
			walnut.viewer.nextBtn 		 = nextBtn;
			walnut.viewer.prevBtn 		 = prevBtn;
			walnut.viewer.fullscreenBtn  = g_svgFullscreenBtn;
			walnut.viewer.mainImage 	 = mainImage;
			walnut.viewer.wrapper 		 = wrapper;
			walnut.viewer.list 			 = ul;
			walnut.viewer.directionArrow = elDirectionArrow;
			walnut.viewer.directionLine  = elDirectionLine;
			walnut.viewer.box 			 = box;


		},

		openViewer:function(e) {

			var containerIndex,
				index,
				container,
				listItem;


			container = findAncestor(e.target, "walnut")
			walnut.containerIndex = container.getAttribute("data-walnut-container");

			walnut.setImages();

			index = this.getAttribute("data-walnut-index");
			index = parseInt(index);

			var src;

			if(this.src) {
				src = this.src
			} else {
				var style = this.currentStyle || window.getComputedStyle(this, false);
				src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
			}

			walnut.viewer.mainImage.src = src;
			walnut.viewer.mainImage.setAttribute("data-walnut-index", index);


			walnut.body.classList.add("walnut--open");

			if(index === 0 && index === walnut.containerArray[walnut.containerIndex].images.length - 1) {
				walnut.viewer.prevBtn.style.display = "none";
				walnut.viewer.nextBtn.style.display = "none";
			} else if(index === 0) {
				walnut.viewer.prevBtn.style.display = "none";
				walnut.viewer.nextBtn.style.display = "";
			}else if(index === (walnut.containerArray[walnut.containerIndex].images.length - 1) ) {
				walnut.viewer.nextBtn.style.display = "none";
				walnut.viewer.prevBtn.style.display = "";
			} else {
				walnut.viewer.prevBtn.style.display = "";
				walnut.viewer.nextBtn.style.display = "";
			}

			walnut.initEvents();
			walnut.checkHeight();
			// walnut.fixList();

			walnut.viewer.wrapper.classList.add("walnut__wrapper--open");

		},

		setImages:function(e) {
			var img,
				li;

			walnut.viewer.list.innerHTML = "";

			if(this.containerArray[walnut.containerIndex].images.length > 1) {
				for (var i = 0; i < this.containerArray[walnut.containerIndex].images.length; i++) {
					li = document.createElement("li");
					li.className = "walnut__item";

					// img = document.createElement("div");
					// img.className = "walnut__source";
					li.style.backgroundImage = "url(" + walnut.containerArray[walnut.containerIndex].images[i].src + ")";
					li.setAttribute("data-walnut-source", walnut.containerArray[walnut.containerIndex].images[i].src);
					li.setAttribute("data-walnut-index", walnut.containerArray[walnut.containerIndex].images[i].index);


					li.addEventListener("click", function(){
						var src = this.getAttribute("data-walnut-source");
						walnut.changeImage(null,{
							source: src,
							index: this.getAttribute("data-walnut-index"),
							container: null
						});
					});

					walnut.viewer.list.appendChild(li);

				};
			}
		},

		fixList:function() {
			var listItem = document.querySelector(".walnut__item").offsetWidth;
			document.querySelector(".walnut__list").style.width = (walnut.containerArray[walnut.containerIndex].images.length *  listItem) + "px";
		},

		closeViewer:function() {
			walnut.viewer.mainImage.src = "";
			walnut.viewer.wrapper.classList.remove("walnut__wrapper--open");
			walnut.body.classList.remove("walnut--open");
			walnut.deinitEvents();
			walnut.fullscreen("exit");
		},

		changeImage:function(action, object) {
			"use strict";

			var newIndex = 0,
				index = 0;

			if(typeof action !== "undefined" && action !== null ){
				index = walnut.viewer.mainImage.getAttribute("data-walnut-index");
				index = parseInt(index);

				if(action === "next" && index < walnut.containerArray[walnut.containerIndex].images.length - 1){
					index = index + 1;
				}else if(action === "prev" && index > 0 ){
					index = index - 1;
				}else {
					return;
				}

				// TODO: find right array istead of 0
				if(walnut.containerArray[walnut.containerIndex].images[index]){
					walnut.viewer.mainImage.src = walnut.containerArray[walnut.containerIndex].images[index].src;
					walnut.viewer.mainImage.setAttribute("data-walnut-index", index);
				}


			} else if(typeof object !== "undefined"){
				index = parseInt(object.index);
				walnut.viewer.mainImage.src = object.source;
				walnut.viewer.mainImage.setAttribute("data-walnut-index", index);

			}

			if(index === 0 && index === walnut.containerArray[walnut.containerIndex].images.length - 1) {
				walnut.viewer.prevBtn.style.display = "none";
				walnut.viewer.nextBtn.style.display = "none";
			} else if(index === 0) {
				walnut.viewer.prevBtn.style.display = "none";
				walnut.viewer.nextBtn.style.display = "";
			}else if(index === (walnut.containerArray[walnut.containerIndex].images.length - 1) ) {
				walnut.viewer.nextBtn.style.display = "none";
				walnut.viewer.prevBtn.style.display = "";
			} else {
				walnut.viewer.prevBtn.style.display = "";
				walnut.viewer.nextBtn.style.display = "";
			}

			walnut.checkHeight();

		},

		fixViewer:function() {
			walnut.checkHeight();
			walnut.fixList();
		},

		checkHeight:function() {
			var viewerHeight = walnut.viewer.box.offsetHeight;

			if ( viewerHeight > window.innerHeight) {
				walnut.viewer.wrapper.classList.add("walnut--align-top");
			} else {
				walnut.viewer.wrapper.classList.remove("walnut--align-top");
			}
		},

		checkKeyPressed:function(e) {
			var key = e.keyCode;
			if( key === 37) {
				walnut.changeImage("prev");
			} else if(key === 39) {
				walnut.changeImage("next");
			} else if(key === 27) {
				walnut.closeViewer();
			}
		},

		clickWrapper:function(e) {
			e.stopPropagation(); // FIXME: stop event from bubbling
			e.preventDefault(); // FIXME: stop event from bubbling
			if (e.target !== this){
			    return;
			}
			walnut.closeViewer.call(this);
		},

		fullscreen:function(option) {
			var wrapper = document.querySelector(".walnut__wrapper");

			if(option === "exit") {
				exitFullscreen();
				walnut.viewer.fullscreenBtn.classList.remove("walnut__fullscreen--hidden");
			} else {

				launchIntoFullscreen(wrapper);
				walnut.viewer.fullscreenBtn.classList.add("walnut__fullscreen--hidden");
			}
		},

		nextImage:function() {
			walnut.changeImage.call(this, "next");
		},

		prevImage:function() {
			walnut.changeImage.call(this, "prev");
		},

		swipeStart:function(e) {
			var touchobj = e.changedTouches[0];
			walnut.touchStartX = parseInt(touchobj.clientX);
			walnut.touchStartY = parseInt(touchobj.clientY);
			e.preventDefault();
		},

		swipeMove:function(e) {
			var touchobj = e.changedTouches[0],
				touchMoveX = parseInt(touchobj.clientX),
				touchMoveY = parseInt(touchobj.clientY),
				index = walnut.viewer.mainImage.getAttribute("data-walnut-index"),
				distX,
				distY;

			distX = Math.abs(touchMoveX - walnut.touchStartX);
			distY = Math.abs(touchMoveY - walnut.touchStartY);

			// walnut.viewer.directionLine.style.transform = "scaleX(1." + distX + ")";
			walnut.viewer.directionLine.style.width = 40 + distX + "px";
			// requestAnimationFrame(walnut.viewer.directionLine.style.width = 40 + distX + "px");

			// Checks if you swipe right or left or if you swiped up or down more than allowed and checks if there is more pictures that way
			if(walnut.touchStartX > touchMoveX && distY < walnut.allowedTouchDistance  && index < walnut.containerArray[walnut.containerIndex].images.length - 1) {
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-left");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active-right");
				walnut.viewer.directionArrow.innerHTML = "";
				walnut.viewer.directionArrow.appendChild(g_svgBtnRight);

			} else if (walnut.touchStartX > touchMoveX && distY < walnut.allowedTouchDistance ) {
				// stop
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-left");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active-right");
				walnut.viewer.directionArrow.innerHTML = "";
				walnut.viewer.directionArrow.appendChild(g_svgCloseBtnFilled);

			} else if (walnut.touchStartX < touchMoveX && distY < walnut.allowedTouchDistance && index > 0) {
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-right");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active-left");
				walnut.viewer.directionArrow.innerHTML = "";
				walnut.viewer.directionArrow.appendChild(g_svgBtnLeft);

			} else if(walnut.touchStartX < touchMoveX && distY < walnut.allowedTouchDistance) {
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-right");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active-left");
				walnut.viewer.directionArrow.innerHTML = "";
				walnut.viewer.directionArrow.appendChild(g_svgCloseBtnFilled);

			} else {
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-left");
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-right");
			}
			e.preventDefault();
		},

		swipeEnd:function(e) {
			var touchobj   = e.changedTouches[0],
				touchMoveX = parseInt(touchobj.clientX),
				touchMoveY = parseInt(touchobj.clientY),
				distY = Math.abs(touchMoveY - walnut.touchStartY),
				distX = Math.abs(touchMoveX - walnut.touchStartX);

			walnut.touchEnd = touchMoveX;

			e.preventDefault();

			walnut.viewer.directionLine.classList.remove("walnut__direction-line--active");
			walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-left");
			walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-right");

			if (walnut.touchStartX > walnut.touchEnd &&
					distX > walnut.minTouchDistance &&
					distY < walnut.allowedTouchDistance ) {

				walnut.nextImage();
			} else if (walnut.touchStartX < walnut.touchEnd &&
					distX > walnut.minTouchDistance &&
					distY < walnut.allowedTouchDistance) {

				walnut.prevImage();
			}
		}
	};

	walnut.init();
})();
