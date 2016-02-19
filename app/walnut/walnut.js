
(function() {
	"use strict";

	function findAncestor (el, cls) {
	    while ((el = el.parentElement) && !el.classList.contains(cls));
	    return el;
	}
	function doDeviceHaveTouch() {
		return !!(("ontouchstart" in window) || window.navigator && window.navigator.msPointerEnabled && window.MSGesture || window.DocumentTouch && document instanceof DocumentTouch);
	}
	// shim layer with setTimeout fallback
	window.requestAnimationFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

	function resize(callback) {
		// resize
		window.addEventListener('resize', callback, true);
		// orientation
		window.addEventListener("orientationchange", callback);
	}

	var walnut = {

		init:function() {

			this.CONTAINERS 	      = document.getElementsByClassName("walnut");
			this.containerArray	      = [];
			this.viewer 		      = {};
			this.config 		      = {};
			this.touchStart		      = 0;
			this.touchEnd		      = 0;
			this.allowedTouchDistance = 100;

			sessionStorage.countTouch = 0;

			var path,
				pathArray,
				newPathname,
				i,
				navigationButtons;

			path = document.getElementById("walnutScript").src;
			path = path.replace("walnut.js", "");
			
			pathArray = path.split( '/' );

			newPathname = "";

			// i = 3 because it skips "http://example.com/""
			for (var i = 3; i < pathArray.length; i++) {

				if(i !== 3) {
					newPathname += "/";
				}
			  
			  	newPathname += pathArray[i];
			}
			walnut.config.path = newPathname;
			
			this.indexImages();
			this.buildViewer();

			this.addCSSLink();

			if (doDeviceHaveTouch()) {
				walnut.viewer.wrapper.classList.add("walnut--is-touch");				
			}

		},

		fixViewer:function() {
			walnut.checkHeight();
			walnut.fixList();
		},

		initEvents:function() {
			walnut.viewer.wrapper.addEventListener("click", walnut.clickWrapper);
			walnut.viewer.closeBtn.addEventListener("click", walnut.closeViewer);
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
			document.removeEventListener("keyup", walnut.checkKeyPressed);

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
				nextBtnImg  		= document.createElement("img"),
				prevBtn 			= document.createElement("div"),
				prevBtnImg  		= document.createElement("img"),
				closeBtn 			= document.createElement("img"),
				bodyTag 			= document.getElementsByTagName("body")[0],
				elDirectionArrow    = document.createElement("img"),
				elDirectionLine    = document.createElement("div");

			
			
			
			ul.className 					= "walnut__list";
			listContainer.className 		= "walnut__list-container";
			mainImage.className 			= "walnut__image";
			mainImageContainer.className 	= "walnut__image-container"
			box.className 					= "walnut__box";
			wrapper.className 				= "walnut__wrapper";
			closeBtn.className 				= "walnut__close";
			closeBtn.src 					= walnut.config.path + "images/button_close.svg";
			nextBtn.className 				= "walnut__navigation walnut__navigation--next";
			nextBtnImg.src 					= walnut.config.path + "images/button_to_right.svg";
			nextBtnImg.className 			= "walnut__navigation-img";
			prevBtn.className 				= "walnut__navigation walnut__navigation--prev";
			prevBtnImg.src 					= walnut.config.path + "images/button_to_left.svg";
			prevBtnImg.className 			= "walnut__navigation-img";
			elDirectionArrow.className 		= "walnut__direction-arrow";
			elDirectionLine.className 		= "walnut__direction-line";

			nextBtn.appendChild(nextBtnImg);
			prevBtn.appendChild(prevBtnImg);
			elDirectionLine.appendChild(elDirectionArrow);
			mainImageContainer.appendChild(mainImage);
			mainImageContainer.appendChild(nextBtn);
			mainImageContainer.appendChild(prevBtn);
			mainImageContainer.appendChild(elDirectionLine);
			listContainer.appendChild(ul);
			box.appendChild(mainImageContainer);
			box.appendChild(listContainer);
			box.appendChild(closeBtn);
			wrapper.appendChild(box);
			bodyTag.appendChild(wrapper);


			// Make variables global in walnut
			walnut.body 				 = bodyTag;
			walnut.viewer.closeBtn		 = closeBtn;
			walnut.viewer.nextBtn 		 = nextBtn;
			walnut.viewer.prevBtn 		 = prevBtn;
			walnut.viewer.mainImage 	 = mainImage;
			walnut.viewer.wrapper 		 = wrapper;
			walnut.viewer.list 			 = ul;
			walnut.viewer.directionArrow = elDirectionArrow;
			walnut.viewer.directionLine  = elDirectionLine;
			walnut.viewer.box 			 = box;
			
			
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

		openViewer:function(e) {

			var containerIndex,
				index,
				container,
				listItem;

			// for (var i = 0; i < e.path.length; i++) {

			// 	if(e.path[i].className !== ""  && e.path[i].className) {

			// 		if( e.path[i].className.indexOf("walnut") > -1) {
			// 			walnut.containerIndex = e.path[i].getAttribute("data-walnut-container");
			// 		}
			// 	}
			// };

			container = findAncestor(e.target, "walnut")

			if(container) {
				walnut.containerIndex = container.getAttribute("data-walnut-container");
			}

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
			
			walnut.viewer.wrapper.classList.add("walnut__wrapper--open");
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
			walnut.fixList();
			
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
		swipeEnd:function(e) {
			var touchobj   = e.changedTouches[0],
				touchMoveX = parseInt(touchobj.clientX),
				touchMoveY = parseInt(touchobj.clientY),
				distY = Math.abs(touchMoveY - walnut.touchStartY);

			walnut.touchEnd = touchMoveX;

			e.preventDefault();

			walnut.viewer.directionLine.classList.remove("walnut__direction-line--active");
			walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-left");
			walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-right");

			if (walnut.touchStartX > walnut.touchEnd && distY < walnut.allowedTouchDistance) {
				walnut.nextImage();
			} else if (walnut.touchStartX < walnut.touchEnd && distY < walnut.allowedTouchDistance) {
				walnut.prevImage();
			}
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
				walnut.viewer.directionArrow.src = walnut.config.path + "images/button_to_right.svg";

			} else if (walnut.touchStartX > touchMoveX && distY < walnut.allowedTouchDistance ) {
				// stop
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-left");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active-right");
				walnut.viewer.directionArrow.src = walnut.config.path + "images/button_close_filled.svg";

			} else if (walnut.touchStartX < touchMoveX && distY < walnut.allowedTouchDistance && index > 0) {
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-right");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active-left");
				walnut.viewer.directionArrow.src = walnut.config.path + "images/button_to_left.svg";

			} else if(walnut.touchStartX < touchMoveX && distY < walnut.allowedTouchDistance) {
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-right");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.add("walnut__direction-line--active-left");
				walnut.viewer.directionArrow.src = walnut.config.path + "images/button_close_filled.svg";

			} else {
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active");
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-left");
				walnut.viewer.directionLine.classList.remove("walnut__direction-line--active-right");
			}
			e.preventDefault();
		}
	};

	walnut.init();
})();

// var walnut = walnut || {};
// walnut.init = function(object) {
// 	walnut.config = {
// 		path : object.pathToWalnutFolder
// 	};
// 	walnut.process();
// };

