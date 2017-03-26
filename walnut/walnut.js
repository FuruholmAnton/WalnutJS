(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var walnut = (function (window) {
    "use strict";
    /*
    * Looks for the attribute first.
    * If no elements are found then tries with classList
    */
    function findAncestor(el, cls) {
        var elem = el;
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
                throw new Error("Couldn't find any container with attribute or class 'walnut' of this element");
            }
        }
    }
    function isFullscreenEnabled() {
        return document.fullscreenEnabled /*||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled*/;
    }
    var launchIntoFullscreen = undefined, exitFullscreen = undefined;
    if (!!isFullscreenEnabled()) {
        var fullscreenEnabled = document.fullscreenEnabled /*|| document.mozFullScreenEnabled || document.webkitFullscreenEnabled*/;
        var fullscreenElement = document.fullscreenElement /*|| document.mozFullScreenElement || document.webkitFullscreenElement*/;
        launchIntoFullscreen = function (element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } /*else if(element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
              element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
              element.msRequestFullscreen();
            }*/
        };
        exitFullscreen = function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } /*else if(document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }*/
        };
    }
    /**
     * [doDeviceHaveTouch description]
     */
    function doDeviceHaveTouch() {
        var bool = false;
        if (('ontouchstart' in window)) {
            bool = true;
        }
        return bool;
    }
    /**
     * On ResizeEvent function
     */
    function resizeEvent(callback, action) {
        if (action === void 0) { action = undefined; }
        if (action === "remove") {
            window.removeEventListener('resize', callback, true);
            window.removeEventListener("orientationchange", callback);
        }
        else {
            window.addEventListener('resize', callback, true);
            window.addEventListener("orientationchange", callback);
        }
    }
    /**
     * Use SVG as inline JavaScript
     */
    var svgCloseBtn = '<svg class="walnut-close" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"/><path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"/><path class="walnut-close__path" fill="#fff" d="M2.8 80.4L80.3 3l714.4 714.3-77.5 77.5z"/><path class="walnut-close__path" fill="#fff" d="M797.7 82.5L717.2 2 2.8 716.4 83.2 797z"/></svg>', svgCloseBtnFilled = '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path d="M400 7.2c219.4 0 397.6 176.3 397.6 393.5S619.4 794.3 400 794.3C180.6 794.3 2.4 618 2.4 400.7 2.4 183.5 180.6 7.2 400 7.2zm-48.2 389L153.2 595l50.2 50.2L402 446.5 599.4 644l48.4-48.5L450.5 398l199.2-199-50.2-50.4L400.2 348 201.5 149 153 197.6 352 396.3z" fill="#fff"/></svg>', svgFullscreenBtn = '<svg class="walnut__fullscreen" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path d="M3.4 15.4H0V24h8.6v-3.4H3.4v-5.2zM0 8.6h3.4V3.4h5.2V0H0v8.6zm20.6 12h-5.2V24H24v-8.6h-3.4v5.2zM15.4 0v3.4h5.2v5.2H24V0h-8.6z" fill="#fff" fill-rule="nonzero"/></svg>', svgBtnLeft = '<svg class="walnut__navigation-img" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41"><g fill="#fff" fill-rule="nonzero"><path d="M22.12 44.24c12.2 0 22.12-9.93 22.12-22.12C44.24 9.92 34.3 0 22.12 0 9.92 0 0 9.92 0 22.12c0 12.2 9.92 22.12 22.12 22.12zm0-42.74c11.37 0 20.62 9.25 20.62 20.62 0 11.37-9.25 20.62-20.62 20.62-11.37 0-20.62-9.25-20.62-20.62C1.5 10.75 10.75 1.5 22.12 1.5z"/><path d="M24.9 29.88c.2 0 .38-.07.52-.22.3-.3.3-.76 0-1.06l-6.8-6.8 6.8-6.8c.3-.3.3-.77 0-1.06-.3-.3-.76-.3-1.06 0l-7.32 7.33c-.3.3-.3.77 0 1.06l7.32 7.33c.15.15.34.22.53.22z"/></g></svg>', svgBtnRight = '<svg class="walnut__navigation-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.236 44.236"><g fill="#FFF"><path d="M22.12 44.24C9.92 44.24 0 34.3 0 22.12S9.92 0 22.12 0s22.12 9.92 22.12 22.12-9.93 22.12-22.12 22.12zm0-42.74C10.75 1.5 1.5 10.75 1.5 22.12c0 11.37 9.25 20.62 20.62 20.62 11.37 0 20.62-9.25 20.62-20.62 0-11.37-9.25-20.62-20.62-20.62z"/><path d="M19.34 29.88c-.2 0-.38-.07-.53-.22-.28-.3-.28-.76 0-1.06l6.8-6.8-6.8-6.8c-.28-.3-.28-.77 0-1.07.3-.3.78-.3 1.07 0l7.33 7.34c.3.3.3.77 0 1.06l-7.33 7.33c-.14.15-.34.22-.53.22z"/></g></svg>';
    var parser = new DOMParser(), g_svgCloseBtn = parser.parseFromString(svgCloseBtn, "image/svg+xml").documentElement, g_svgCloseBtnFilled = parser.parseFromString(svgCloseBtnFilled, "image/svg+xml").documentElement, g_svgFullscreenBtn = parser.parseFromString(svgFullscreenBtn, "image/svg+xml").documentElement, g_svgBtnLeft = parser.parseFromString(svgBtnLeft, "image/svg+xml").documentElement, g_svgBtnRight = parser.parseFromString(svgBtnRight, "image/svg+xml").documentElement;
    /**
     * [walnut description]
     */
    var walnut = (function () {
        var path, pathArray, pathMiddle, newPathname, i, navigationButtons, containerIndex, body;
        var CONTAINERS = [], containerArray = [], viewer = {}, config = {}, touchStart = 0, touchStartX = 0, touchStartY = 0, touchEnd = 0, allowedTouchDistance = 100, minTouchDistance = 20;
        var utils = {
            getContainers: function () {
                var elems = document.querySelectorAll('[walnut]');
                if (elems.length > 0) {
                    return elems;
                }
                else {
                    elems = document.querySelectorAll('.walnut');
                    if (elems.length > 0) {
                        return elems;
                    }
                    else {
                        throw new Error("Couldn't find any containers for ");
                    }
                }
            },
            getScriptSrc: function () {
                var elem = document.querySelector('[walnut-script]');
                if (elem instanceof HTMLScriptElement) {
                    return elem.src;
                }
                else {
                    elem = document.getElementById('walnutScript');
                    if (elem instanceof HTMLScriptElement) {
                        return elem.src;
                    }
                    else {
                        console.warn("Couldn't find the script-tag for walnut with attribute walnut-script or id='walnutScript'");
                    }
                }
            },
            once: function (fn, context) {
                if (context === void 0) { context = undefined; }
                // function can only fire once
                var result;
                return function () {
                    if (fn) {
                        result = fn.apply(context || this, arguments);
                        fn = null;
                    }
                    return result;
                };
            }
        };
        function init() {
            var newPath;
            CONTAINERS = utils.getContainers();
            path = utils.getScriptSrc();
            pathArray = path.split('/');
            pathArray.splice(pathArray.length - 1, 0, "styles");
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
        var initEvents = utils.once(function () {
            var mainImage = viewer.mainImage;
            viewer.wrapper.addEventListener("click", clickWrapper);
            viewer.closeBtn.addEventListener("click", closeViewer);
            viewer.fullscreenBtn.addEventListener("click", fullscreen);
            document.addEventListener("keyup", checkKeyPressed);
            if (doDeviceHaveTouch()) {
                mainImage.addEventListener("touchstart", swipeStart);
                mainImage.addEventListener("touchend", swipeEnd);
                mainImage.addEventListener("touchmove", swipeMove);
            }
            else {
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
         * REVIEW: Have user do it himself to make it easy for customization? from CDN ?
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
        function indexImages() {
            for (var i_1 = 0; i_1 < CONTAINERS.length; i_1++) {
                containerArray.push({
                    container: CONTAINERS[i_1],
                    images: []
                });
                CONTAINERS[i_1].setAttribute("data-walnut-container", i_1);
                /**
                 * Puts images in a array. Finds all images with either:
                 * CLASS or ATTRIBUTE with "walnut-image"
                 * If neither is found then it will look for all <img> tags
                 *
                 */
                var img = CONTAINERS[i_1].getElementsByTagName("img"), bgOld = CONTAINERS[i_1].getElementsByClassName("walnut-image"), bg = CONTAINERS[i_1].querySelectorAll('[walnut-image]'), images = [];
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
                if (!bgOld.length && !bg.length && img) {
                    for (var x = 0; x < img.length; x++) {
                        images.push(img[x]);
                    }
                }
                for (var j = 0; j < images.length; j++) {
                    images[j].addEventListener("click", openViewer);
                    images[j].setAttribute("data-walnut-index", j);
                    var src = void 0;
                    if (images[j].src) {
                        src = images[j].src;
                    }
                    else {
                        var style = images[j].currentStyle || window.getComputedStyle(images[j], null);
                        src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
                    }
                    containerArray[i_1].images.push({
                        elem: images[j],
                        src: src,
                        index: j
                    });
                }
                ;
            }
            ;
        }
        /**
         * Creates Elements that builds up the viewer
         */
        function buildViewer() {
            var ul = document.createElement("ul"), listContainer = document.createElement("div"), wrapper = document.createElement("div"), box = document.createElement("div"), mainImage = document.createElement("img"), mainImageContainer = document.createElement("div"), nextBtn = document.createElement("div"), prevBtn = document.createElement("div"), closeBtn = document.createElement("img"), bodyTag = document.getElementsByTagName("body")[0], elDirectionArrow = document.createElement("div"), elDirectionLine = document.createElement("div");
            /**
             * Add CSS classes to the elements
             */
            ul.className = "walnut__list";
            listContainer.className = "walnut__list-container";
            mainImage.className = "walnut__image";
            mainImageContainer.className = "walnut__image-container";
            box.className = "walnut__box";
            wrapper.className = "walnut__wrapper";
            // wrapper.setAttribute("draggable", "true");
            nextBtn.className = "walnut__navigation walnut__navigation--next";
            prevBtn.className = "walnut__navigation walnut__navigation--prev";
            elDirectionArrow.className = "walnut__direction-arrow";
            elDirectionLine.className = "walnut__direction-line";
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
            wrapper.appendChild(listContainer);
            wrapper.appendChild(g_svgCloseBtn);
            wrapper.appendChild(box);
            bodyTag.appendChild(wrapper);
            /**
             * Add Fullscreen button when not in fullscreen mode
             */
            if (!!isFullscreenEnabled()) {
                wrapper.appendChild(g_svgFullscreenBtn);
            }
            /**
             * Make variables global for walnut
             */
            body = bodyTag;
            viewer.closeBtn = g_svgCloseBtn;
            viewer.nextBtn = nextBtn;
            viewer.prevBtn = prevBtn;
            viewer.fullscreenBtn = g_svgFullscreenBtn;
            viewer.mainImage = mainImage;
            viewer.wrapper = wrapper;
            viewer.list = ul;
            viewer.directionArrow = elDirectionArrow;
            viewer.directionLine = elDirectionLine;
            viewer.box = box;
            initEvents();
        }
        /**
         * Opens Viewer and
         */
        function openViewer(e) {
            var index, container, listItem, mainImage = viewer.mainImage, prevBtn = viewer.prevBtn, nextBtn = viewer.nextBtn;
            container = findAncestor(e.target, "walnut");
            containerIndex = container.getAttribute("data-walnut-container");
            setImages(containerIndex);
            index = this.getAttribute("data-walnut-index");
            index = parseInt(index);
            var src;
            var style = this.currentStyle || window.getComputedStyle(this, null);
            /**
             * Looks for the image source and if not found get the background image
             */
            if (this.src) {
                src = this.src;
            }
            else if (style.backgroundImage != "none") {
                src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            }
            else {
                throw new Error("Couldn't find a image for element: " + this);
            }
            mainImage.src = src;
            mainImage.setAttribute("data-walnut-index", index);
            body.classList.add("walnut--open");
            if (index === 0 && index === containerArray[containerIndex].images.length - 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            }
            else if (index === 0) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "";
            }
            else if (index === (containerArray[containerIndex].images.length - 1)) {
                nextBtn.style.display = "none";
                prevBtn.style.display = "";
            }
            else {
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
            var img, li, list = viewer.list;
            list.innerHTML = "";
            if (containerArray[containerIndex].images.length > 1) {
                for (var i_2 = 0; i_2 < containerArray[containerIndex].images.length; i_2++) {
                    li = document.createElement("li");
                    li.className = "walnut__item";
                    li.style.backgroundImage = "url(" + containerArray[containerIndex].images[i_2].src + ")";
                    li.setAttribute("data-walnut-source", containerArray[containerIndex].images[i_2].src);
                    li.setAttribute("data-walnut-index", containerArray[containerIndex].images[i_2].index);
                    li.addEventListener("click", function () {
                        var src = this.getAttribute("data-walnut-source");
                        changeImage(null, {
                            source: src,
                            index: parseInt(this.getAttribute("data-walnut-index")),
                            container: null
                        });
                    });
                    list.appendChild(li);
                }
                ;
            }
        }
        function fixListWidth() {
            var elItem = document.getElementsByClassName(".walnut__item")[0], listItem = elItem.offsetWidth, elList = document.getElementsByClassName(".walnut__list")[0];
            elList.style.width = (containerArray[containerIndex].images.length * listItem) + "px";
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
            if (object === void 0) { object = undefined; }
            var newIndex = 0, index = 0, prevBtn = viewer.prevBtn, nextBtn = viewer.nextBtn, mainImage = viewer.mainImage;
            if (typeof action !== "undefined" && action !== null) {
                index = parseInt(mainImage.getAttribute("data-walnut-index"));
                if (action === "next" && index < containerArray[containerIndex].images.length - 1) {
                    index = index + 1;
                }
                else if (action === "prev" && index > 0) {
                    index = index - 1;
                }
                else {
                    return;
                }
                // TODO: find right array istead of 0
                if (containerArray[containerIndex].images[index]) {
                    mainImage.src = containerArray[containerIndex].images[index].src;
                    mainImage.setAttribute("data-walnut-index", index);
                }
            }
            else if (object && object.source) {
                index = parseInt(object.index);
                mainImage.src = object.source;
                mainImage.setAttribute("data-walnut-index", index);
            }
            if (index === 0 && index === containerArray[containerIndex].images.length - 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            }
            else if (index === 0) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "";
            }
            else if (index === (containerArray[containerIndex].images.length - 1)) {
                nextBtn.style.display = "none";
                prevBtn.style.display = "";
            }
            else {
                prevBtn.style.display = "";
                nextBtn.style.display = "";
            }
            checkHeight();
        }
        function fixViewer() {
            checkHeight();
            if (document.querySelector(".walnut__item") instanceof HTMLElement) {
                fixListWidth();
            }
        }
        function checkHeight() {
            var viewerHeight = viewer.box.offsetHeight, wrapper = viewer.wrapper;
            if (viewerHeight > window.innerHeight) {
                wrapper.classList.add("walnut--align-top");
            }
            else {
                wrapper.classList.remove("walnut--align-top");
            }
        }
        function checkKeyPressed(e) {
            var key = e.keyCode;
            if (key === 37) {
                changeImage("prev");
            }
            else if (key === 39) {
                changeImage("next");
            }
            else if (key === 27) {
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
            var wrapper = viewer.wrapper, fullscreenBtn = viewer.fullscreenBtn;
            if (option === "exit") {
                exitFullscreen();
                fullscreenBtn.classList.remove("walnut__fullscreen--hidden");
            }
            else {
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
            var touchobj = e.changedTouches[0], touchMoveX = parseInt(touchobj.clientX), touchMoveY = parseInt(touchobj.clientY), index = viewer.mainImage.getAttribute("data-walnut-index"), directionLine = viewer.directionLine, directionArrow = viewer.directionArrow, distX, distY;
            distX = Math.abs(touchMoveX - touchStartX);
            distY = Math.abs(touchMoveY - touchStartY);
            directionLine.style.width = 40 + distX + "px";
            // Checks if you swipe right or left or if you swiped up or down more than allowed and checks if there is more pictures that way
            if (touchStartX > touchMoveX && distY < allowedTouchDistance && index < containerArray[containerIndex].images.length - 1) {
                directionLine.classList.remove("walnut__direction-line--active-left");
                directionLine.classList.add("walnut__direction-line--active");
                directionLine.classList.add("walnut__direction-line--active-right");
                directionArrow.innerHTML = "";
                directionArrow.appendChild(g_svgBtnRight);
            }
            else if (touchStartX > touchMoveX && distY < allowedTouchDistance) {
                // stop
                directionLine.classList.remove("walnut__direction-line--active-left");
                directionLine.classList.add("walnut__direction-line--active");
                directionLine.classList.add("walnut__direction-line--active-right");
                directionArrow.innerHTML = "";
                directionArrow.appendChild(g_svgCloseBtnFilled);
            }
            else if (touchStartX < touchMoveX && distY < allowedTouchDistance && index > 0) {
                directionLine.classList.remove("walnut__direction-line--active-right");
                directionLine.classList.add("walnut__direction-line--active");
                directionLine.classList.add("walnut__direction-line--active-left");
                directionArrow.innerHTML = "";
                directionArrow.appendChild(g_svgBtnLeft);
            }
            else if (touchStartX < touchMoveX && distY < allowedTouchDistance) {
                directionLine.classList.remove("walnut__direction-line--active-right");
                directionLine.classList.add("walnut__direction-line--active");
                directionLine.classList.add("walnut__direction-line--active-left");
                directionArrow.innerHTML = "";
                directionArrow.appendChild(g_svgCloseBtnFilled);
            }
            else {
                directionLine.classList.remove("walnut__direction-line--active");
                directionLine.classList.remove("walnut__direction-line--active-left");
                directionLine.classList.remove("walnut__direction-line--active-right");
            }
            e.preventDefault();
        }
        function swipeEnd(e) {
            var touchobj = e.changedTouches[0], touchMoveX = parseInt(touchobj.clientX), touchMoveY = parseInt(touchobj.clientY), distY = Math.abs(touchMoveY - touchStartY), distX = Math.abs(touchMoveX - touchStartX), directionLine = viewer.directionLine;
            touchEnd = touchMoveX;
            e.preventDefault();
            directionLine.classList.remove("walnut__direction-line--active");
            directionLine.classList.remove("walnut__direction-line--active-left");
            directionLine.classList.remove("walnut__direction-line--active-right");
            if (touchStartX > touchEnd &&
                distX > minTouchDistance &&
                distY < allowedTouchDistance) {
                nextImage();
            }
            else if (touchStartX < touchEnd &&
                distX > minTouchDistance &&
                distY < allowedTouchDistance) {
                prevImage();
            }
            else if (distY > 200) {
                closeViewer();
            }
        }
        function changeHistory(event) {
            closeViewer();
        }
        return {
            init: init
        };
    }());
    return {
        init: walnut.init
    };
})(window);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvd2FsbnV0L3dhbG51dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLElBQU0sTUFBTSxHQUFHLENBQUMsVUFBUyxNQUFNO0lBQzlCLFlBQVksQ0FBQztJQUViOzs7TUFHRTtJQUNGLHNCQUF1QixFQUFlLEVBQUUsR0FBVztRQUNsRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO1lBQUMsQ0FBQztRQUMvRCxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNWLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO2dCQUFDLENBQUM7WUFDckUsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDYixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO1lBQ2pHLENBQUM7UUFDRixDQUFDO0lBQ0wsQ0FBQztJQUVEO1FBQ0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQzs7OzBDQUdILENBQUM7SUFDakMsQ0FBQztJQUNELElBQUksb0JBQW9CLEdBQVEsU0FBUyxFQUN4QyxjQUFjLEdBQVEsU0FBUyxDQUFDO0lBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FB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QUFFLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxDQUFDO1lBQ04sSUFBSSxFQUFFLElBQUk7U0FDVixDQUFBO0lBQ0YsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVMLE1BQU0sQ0FBQztRQUNOLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtLQUNqQixDQUFBO0FBQ0YsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jb25zdCB3YWxudXQgPSAoZnVuY3Rpb24od2luZG93KSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8qXG5cdCogTG9va3MgZm9yIHRoZSBhdHRyaWJ1dGUgZmlyc3QuXG5cdCogSWYgbm8gZWxlbWVudHMgYXJlIGZvdW5kIHRoZW4gdHJpZXMgd2l0aCBjbGFzc0xpc3Rcblx0Ki9cblx0ZnVuY3Rpb24gZmluZEFuY2VzdG9yIChlbDogSFRNTEVsZW1lbnQsIGNsczogc3RyaW5nKSB7XG5cdFx0bGV0IGVsZW0gPSBlbDtcblx0ICAgIHdoaWxlICgoZWxlbSA9IGVsZW0ucGFyZW50RWxlbWVudCkgJiYgIWVsZW0uaGFzQXR0cmlidXRlKGNscykpO1xuXHQgICAgaWYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXHQgICAgXHRyZXR1cm4gZWxlbTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdGVsZW0gPSBlbDtcblx0ICAgIFx0d2hpbGUgKChlbGVtID0gZWxlbS5wYXJlbnRFbGVtZW50KSAmJiAhZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2xzKSk7XG5cdCAgICBcdGlmIChlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0ICAgIFx0XHRyZXR1cm4gZWxlbTtcblx0ICAgIFx0fSBlbHNlIHtcblx0ICAgIFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGFueSBjb250YWluZXIgd2l0aCBhdHRyaWJ1dGUgb3IgY2xhc3MgJ3dhbG51dCcgb2YgdGhpcyBlbGVtZW50XCIpO1xuXHQgICAgXHR9XG5cdCAgICB9XG5cdH1cblxuXHRmdW5jdGlvbiBpc0Z1bGxzY3JlZW5FbmFibGVkKCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5mdWxsc2NyZWVuRW5hYmxlZCAvKnx8XG5cdFx0XHRkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRW5hYmxlZCB8fFxuXHRcdFx0ZG9jdW1lbnQubW96RnVsbFNjcmVlbkVuYWJsZWQgfHxcblx0XHRcdGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVuYWJsZWQqLztcblx0fVxuXHRsZXQgbGF1bmNoSW50b0Z1bGxzY3JlZW46IGFueSA9IHVuZGVmaW5lZCxcblx0XHRleGl0RnVsbHNjcmVlbjogYW55ID0gdW5kZWZpbmVkO1xuXG5cdGlmICghIWlzRnVsbHNjcmVlbkVuYWJsZWQoKSkge1xuXG5cdFx0bGV0IGZ1bGxzY3JlZW5FbmFibGVkID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVuYWJsZWQgLyp8fCBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRW5hYmxlZCB8fCBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRW5hYmxlZCovO1xuXHRcdGxldCBmdWxsc2NyZWVuRWxlbWVudCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IC8qfHwgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHwgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQqLztcblxuXHRcdGxhdW5jaEludG9GdWxsc2NyZWVuID0gZnVuY3Rpb24gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdFx0ICBpZihlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XG5cdFx0ICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH0gLyplbHNlIGlmKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcblx0XHQgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdCAgfSBlbHNlIGlmKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcblx0XHQgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdCAgfSBlbHNlIGlmKGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbikge1xuXHRcdCAgICBlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH0qL1xuXHRcdH07XG5cblx0XHRleGl0RnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcblx0XHQgIGlmKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XG5cdFx0ICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0ICB9IC8qZWxzZSBpZihkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG5cdFx0ICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcblx0XHQgIH0gZWxzZSBpZihkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xuXHRcdCAgICBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuXHRcdCAgfSovXG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFtkb0RldmljZUhhdmVUb3VjaCBkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIGRvRGV2aWNlSGF2ZVRvdWNoKCkge1xuXHRcdGxldCBib29sID0gZmFsc2U7XG5cdCAgICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykpIHtcblx0ICAgICAgYm9vbCA9IHRydWU7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gYm9vbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBPbiBSZXNpemVFdmVudCBmdW5jdGlvblxuXHQgKi9cblx0ZnVuY3Rpb24gcmVzaXplRXZlbnQoY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCwgYWN0aW9uOiBzdHJpbmcgPSB1bmRlZmluZWQpIHtcblx0XHRpZihhY3Rpb24gPT09IFwicmVtb3ZlXCIpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGNhbGxiYWNrKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgY2FsbGJhY2spO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBVc2UgU1ZHIGFzIGlubGluZSBKYXZhU2NyaXB0XG5cdCAqL1xuXHRsZXQgc3ZnQ2xvc2VCdG4gPSAnPHN2ZyBjbGFzcz1cIndhbG51dC1jbG9zZVwiIHZpZXdCb3g9XCIwIDAgODAwIDgwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxLjRcIj48cGF0aCBjbGFzcz1cIndhbG51dC1jbG9zZV9fcGF0aFwiIGZpbGw9XCIjZmZmXCIgZD1cIk0yMS42IDYxLjZsMzguOC0zOUw3NzUgNzM3LjNsLTM5IDM5elwiLz48cGF0aCBjbGFzcz1cIndhbG51dC1jbG9zZV9fcGF0aFwiIGZpbGw9XCIjZmZmXCIgZD1cIk0yMS42IDYxLjZsMzguOC0zOUw3NzUgNzM3LjNsLTM5IDM5elwiLz48cGF0aCBjbGFzcz1cIndhbG51dC1jbG9zZV9fcGF0aFwiIGZpbGw9XCIjZmZmXCIgZD1cIk0yLjggODAuNEw4MC4zIDNsNzE0LjQgNzE0LjMtNzcuNSA3Ny41elwiLz48cGF0aCBjbGFzcz1cIndhbG51dC1jbG9zZV9fcGF0aFwiIGZpbGw9XCIjZmZmXCIgZD1cIk03OTcuNyA4Mi41TDcxNy4yIDIgMi44IDcxNi40IDgzLjIgNzk3elwiLz48L3N2Zz4nLFxuXHRcdHN2Z0Nsb3NlQnRuRmlsbGVkID0gJzxzdmcgdmlld0JveD1cIjAgMCA4MDAgODAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEuNFwiPjxwYXRoIGQ9XCJNNDAwIDcuMmMyMTkuNCAwIDM5Ny42IDE3Ni4zIDM5Ny42IDM5My41UzYxOS40IDc5NC4zIDQwMCA3OTQuM0MxODAuNiA3OTQuMyAyLjQgNjE4IDIuNCA0MDAuNyAyLjQgMTgzLjUgMTgwLjYgNy4yIDQwMCA3LjJ6bS00OC4yIDM4OUwxNTMuMiA1OTVsNTAuMiA1MC4yTDQwMiA0NDYuNSA1OTkuNCA2NDRsNDguNC00OC41TDQ1MC41IDM5OGwxOTkuMi0xOTktNTAuMi01MC40TDQwMC4yIDM0OCAyMDEuNSAxNDkgMTUzIDE5Ny42IDM1MiAzOTYuM3pcIiBmaWxsPVwiI2ZmZlwiLz48L3N2Zz4nLFxuXHRcdHN2Z0Z1bGxzY3JlZW5CdG4gPSAnPHN2ZyBjbGFzcz1cIndhbG51dF9fZnVsbHNjcmVlblwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40XCI+PHBhdGggZD1cIk0zLjQgMTUuNEgwVjI0aDguNnYtMy40SDMuNHYtNS4yek0wIDguNmgzLjRWMy40aDUuMlYwSDB2OC42em0yMC42IDEyaC01LjJWMjRIMjR2LTguNmgtMy40djUuMnpNMTUuNCAwdjMuNGg1LjJ2NS4ySDI0VjBoLTguNnpcIiBmaWxsPVwiI2ZmZlwiIGZpbGwtcnVsZT1cIm5vbnplcm9cIi8+PC9zdmc+Jyxcblx0XHRzdmdCdG5MZWZ0ID0gJzxzdmcgY2xhc3M9XCJ3YWxudXRfX25hdmlnYXRpb24taW1nXCIgdmlld0JveD1cIjAgMCA0NSA0NVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxLjQxXCI+PGcgZmlsbD1cIiNmZmZcIiBmaWxsLXJ1bGU9XCJub256ZXJvXCI+PHBhdGggZD1cIk0yMi4xMiA0NC4yNGMxMi4yIDAgMjIuMTItOS45MyAyMi4xMi0yMi4xMkM0NC4yNCA5LjkyIDM0LjMgMCAyMi4xMiAwIDkuOTIgMCAwIDkuOTIgMCAyMi4xMmMwIDEyLjIgOS45MiAyMi4xMiAyMi4xMiAyMi4xMnptMC00Mi43NGMxMS4zNyAwIDIwLjYyIDkuMjUgMjAuNjIgMjAuNjIgMCAxMS4zNy05LjI1IDIwLjYyLTIwLjYyIDIwLjYyLTExLjM3IDAtMjAuNjItOS4yNS0yMC42Mi0yMC42MkMxLjUgMTAuNzUgMTAuNzUgMS41IDIyLjEyIDEuNXpcIi8+PHBhdGggZD1cIk0yNC45IDI5Ljg4Yy4yIDAgLjM4LS4wNy41Mi0uMjIuMy0uMy4zLS43NiAwLTEuMDZsLTYuOC02LjggNi44LTYuOGMuMy0uMy4zLS43NyAwLTEuMDYtLjMtLjMtLjc2LS4zLTEuMDYgMGwtNy4zMiA3LjMzYy0uMy4zLS4zLjc3IDAgMS4wNmw3LjMyIDcuMzNjLjE1LjE1LjM0LjIyLjUzLjIyelwiLz48L2c+PC9zdmc+Jyxcblx0XHRzdmdCdG5SaWdodCA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0X19uYXZpZ2F0aW9uLWltZ1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDQ0LjIzNiA0NC4yMzZcIj48ZyBmaWxsPVwiI0ZGRlwiPjxwYXRoIGQ9XCJNMjIuMTIgNDQuMjRDOS45MiA0NC4yNCAwIDM0LjMgMCAyMi4xMlM5LjkyIDAgMjIuMTIgMHMyMi4xMiA5LjkyIDIyLjEyIDIyLjEyLTkuOTMgMjIuMTItMjIuMTIgMjIuMTJ6bTAtNDIuNzRDMTAuNzUgMS41IDEuNSAxMC43NSAxLjUgMjIuMTJjMCAxMS4zNyA5LjI1IDIwLjYyIDIwLjYyIDIwLjYyIDExLjM3IDAgMjAuNjItOS4yNSAyMC42Mi0yMC42MiAwLTExLjM3LTkuMjUtMjAuNjItMjAuNjItMjAuNjJ6XCIvPjxwYXRoIGQ9XCJNMTkuMzQgMjkuODhjLS4yIDAtLjM4LS4wNy0uNTMtLjIyLS4yOC0uMy0uMjgtLjc2IDAtMS4wNmw2LjgtNi44LTYuOC02LjhjLS4yOC0uMy0uMjgtLjc3IDAtMS4wNy4zLS4zLjc4LS4zIDEuMDcgMGw3LjMzIDcuMzRjLjMuMy4zLjc3IDAgMS4wNmwtNy4zMyA3LjMzYy0uMTQuMTUtLjM0LjIyLS41My4yMnpcIi8+PC9nPjwvc3ZnPic7XG5cblx0bGV0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKSxcblx0XHRnX3N2Z0Nsb3NlQnRuID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdDbG9zZUJ0biwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudCxcblx0XHRnX3N2Z0Nsb3NlQnRuRmlsbGVkID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdDbG9zZUJ0bkZpbGxlZCwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudCxcblx0XHRnX3N2Z0Z1bGxzY3JlZW5CdG4gPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0Z1bGxzY3JlZW5CdG4sIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQsXG5cdFx0Z19zdmdCdG5MZWZ0ID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdCdG5MZWZ0LCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50LFxuXHRcdGdfc3ZnQnRuUmlnaHQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0J0blJpZ2h0LCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50O1xuXG5cdC8qKlxuXHQgKiBbd2FsbnV0IGRlc2NyaXB0aW9uXVxuXHQgKi9cblx0bGV0IHdhbG51dCA9IChmdW5jdGlvbigpIHtcblxuXHRcdGxldCBwYXRoLFxuXHRcdFx0cGF0aEFycmF5LFxuXHRcdFx0cGF0aE1pZGRsZSxcblx0XHRcdG5ld1BhdGhuYW1lLFxuXHRcdFx0aSxcblx0XHRcdG5hdmlnYXRpb25CdXR0b25zLFxuXHRcdFx0Y29udGFpbmVySW5kZXg6IHN0cmluZyxcblx0XHRcdGJvZHk6IEhUTUxFbGVtZW50O1xuXG5cdFx0bGV0IENPTlRBSU5FUlM6IGFueSA9IFtdLFxuXHRcdFx0Y29udGFpbmVyQXJyYXk6IGFueSA9IFtdLFxuXHRcdFx0dmlld2VyOiBhbnkgPSB7fSxcblx0XHRcdGNvbmZpZzogYW55ID0ge30sXG5cdFx0XHR0b3VjaFN0YXJ0OiBudW1iZXIgPSAwLFxuXHRcdFx0dG91Y2hTdGFydFg6IG51bWJlciA9IDAsXG5cdFx0XHR0b3VjaFN0YXJ0WTogbnVtYmVyID0gMCxcblx0XHRcdHRvdWNoRW5kOiBudW1iZXIgPSAwLFxuXHRcdFx0YWxsb3dlZFRvdWNoRGlzdGFuY2U6IG51bWJlciA9IDEwMCxcblx0XHRcdG1pblRvdWNoRGlzdGFuY2U6IG51bWJlciA9IDIwO1xuXG5cblx0XHRsZXQgdXRpbHMgPSB7XG5cdFx0XHRnZXRDb250YWluZXJzOmZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbd2FsbnV0XScpO1xuXHRcdFx0XHRpZiAoZWxlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtcztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53YWxudXQnKTtcblx0XHRcdFx0XHRpZiAoZWxlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1zO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGFueSBjb250YWluZXJzIGZvciBcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Z2V0U2NyaXB0U3JjOmZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZXQgZWxlbTogYW55ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW3dhbG51dC1zY3JpcHRdJyk7XG5cdFx0XHRcdGlmIChlbGVtIGluc3RhbmNlb2YgSFRNTFNjcmlwdEVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbS5zcmM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3YWxudXRTY3JpcHQnKTtcblx0XHRcdFx0XHRpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxTY3JpcHRFbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbS5zcmM7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihcIkNvdWxkbid0IGZpbmQgdGhlIHNjcmlwdC10YWcgZm9yIHdhbG51dCB3aXRoIGF0dHJpYnV0ZSB3YWxudXQtc2NyaXB0IG9yIGlkPSd3YWxudXRTY3JpcHQnXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG9uY2U6ZnVuY3Rpb24oZm46IGFueSwgY29udGV4dDogYW55ID0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIGZ1bmN0aW9uIGNhbiBvbmx5IGZpcmUgb25jZVxuXHRcdFx0XHRsZXQgcmVzdWx0OiBhbnk7XG5cblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmKGZuKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBmbi5hcHBseShjb250ZXh0IHx8IHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0XHRmbiA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0bGV0IG5ld1BhdGg7XG5cblx0XHRcdENPTlRBSU5FUlMgPSB1dGlscy5nZXRDb250YWluZXJzKCk7XG5cblx0XHRcdHBhdGggPSB1dGlscy5nZXRTY3JpcHRTcmMoKTtcblxuXHRcdFx0cGF0aEFycmF5ID0gcGF0aC5zcGxpdCggJy8nICk7XG5cdFx0XHRwYXRoQXJyYXkuc3BsaWNlKHBhdGhBcnJheS5sZW5ndGgtMSwgMCwgXCJzdHlsZXNcIik7XG5cdFx0XHRuZXdQYXRoID0gcGF0aEFycmF5LmpvaW4oXCIvXCIpO1xuXHRcdFx0bmV3UGF0aCA9IG5ld1BhdGgucmVwbGFjZShcIndhbG51dC5qc1wiLCBcIndhbG51dC5jc3NcIik7XG5cblx0XHRcdGNvbmZpZy5wYXRoVG9DU1MgPSBuZXdQYXRoO1xuXG5cdFx0XHRhZGRDU1NMaW5rKCk7XG5cdFx0XHRpbmRleEltYWdlcygpO1xuXHRcdFx0YnVpbGRWaWV3ZXIoKTtcblxuXHRcdFx0aWYgKGRvRGV2aWNlSGF2ZVRvdWNoKCkpIHtcblx0XHRcdFx0dmlld2VyLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcIndhbG51dC0taXMtdG91Y2hcIik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQgKiBBZGRzIGFuZCByZW1vdmVzIGV2ZW50IG9uIG9wZW4gYW5kIGNsb3NlXG5cdFx0ICogUkVWSUVXOiBBZGQgb25jZSBhbmQgZG9udCByZW1vdmUuIHByZWZvcm1hbmNlIGJlbmVmaXRzP1xuXHRcdCAqL1xuXHRcdGxldCBpbml0RXZlbnRzID0gdXRpbHMub25jZShmdW5jdGlvbigpIHtcblx0XHRcdGxldCBtYWluSW1hZ2UgPSB2aWV3ZXIubWFpbkltYWdlO1xuXHRcdFx0dmlld2VyLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrV3JhcHBlcik7XG5cdFx0XHR2aWV3ZXIuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlVmlld2VyKTtcblx0XHRcdHZpZXdlci5mdWxsc2NyZWVuQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdWxsc2NyZWVuKTtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBjaGVja0tleVByZXNzZWQpO1xuXG5cdFx0XHRpZiAoZG9EZXZpY2VIYXZlVG91Y2goKSkge1xuXHRcdFx0XHRtYWluSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgc3dpcGVTdGFydCk7XG5cdFx0XHRcdG1haW5JbWFnZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgc3dpcGVFbmQpO1xuXHRcdFx0XHRtYWluSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBzd2lwZU1vdmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmlld2VyLm5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5leHRJbWFnZSk7XG5cdFx0XHRcdHZpZXdlci5wcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcmV2SW1hZ2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gaW5pdEZsZXhFdmVudHMoKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgY2hlY2tLZXlQcmVzc2VkKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgY2hhbmdlSGlzdG9yeSk7XG5cdFx0XHRyZXNpemVFdmVudChmaXhWaWV3ZXIpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkZWluaXRGbGV4RXZlbnRzKCkge1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGNoZWNrS2V5UHJlc3NlZCk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGNoYW5nZUhpc3RvcnkpO1xuXHRcdFx0cmVzaXplRXZlbnQoZml4Vmlld2VyLCBcInJlbW92ZVwiKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBBZGQgdGhlIENTUyBMaW5rIGluIHRoZSBkb2N1bWVudFxuXHRcdCAqIFJFVklFVzogSGF2ZSB1c2VyIGRvIGl0IGhpbXNlbGYgdG8gbWFrZSBpdCBlYXN5IGZvciBjdXN0b21pemF0aW9uPyBmcm9tIENETiA/XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gYWRkQ1NTTGluaygpIHtcblxuXHRcdFx0bGV0IGZpbGVyZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRcdCAgICBmaWxlcmVmLnNldEF0dHJpYnV0ZShcInJlbFwiLCBcInN0eWxlc2hlZXRcIik7XG5cdCAgICAgICAgZmlsZXJlZi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dC9jc3NcIik7XG5cdCAgICAgICAgZmlsZXJlZi5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGNvbmZpZy5wYXRoVG9DU1MpO1xuXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoZmlsZXJlZik7XG5cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBJbmRleGVzIGFzIGltYWdlcyBzbyByZWxhdGVkIGltYWdlcyB3aWxsIHNob3cgYXMgdGh1bWJuYWlscyB3aGVuIG9wZW5pbmcgdGhlIHZpZXdlclxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGluZGV4SW1hZ2VzKCl7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IENPTlRBSU5FUlMubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHRjb250YWluZXJBcnJheS5wdXNoKHtcblx0XHRcdFx0XHRjb250YWluZXI6IENPTlRBSU5FUlNbaV0sXG5cdFx0XHRcdFx0aW1hZ2VzOiBbXVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRDT05UQUlORVJTW2ldLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWNvbnRhaW5lclwiLCBpKTtcblxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBQdXRzIGltYWdlcyBpbiBhIGFycmF5LiBGaW5kcyBhbGwgaW1hZ2VzIHdpdGggZWl0aGVyOlxuXHRcdFx0XHQgKiBDTEFTUyBvciBBVFRSSUJVVEUgd2l0aCBcIndhbG51dC1pbWFnZVwiXG5cdFx0XHRcdCAqIElmIG5laXRoZXIgaXMgZm91bmQgdGhlbiBpdCB3aWxsIGxvb2sgZm9yIGFsbCA8aW1nPiB0YWdzXG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRsZXQgaW1nID0gQ09OVEFJTkVSU1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKSxcblx0XHRcdFx0XHRiZ09sZCA9IENPTlRBSU5FUlNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIndhbG51dC1pbWFnZVwiKSxcblx0XHRcdFx0XHRiZyA9IENPTlRBSU5FUlNbaV0ucXVlcnlTZWxlY3RvckFsbCgnW3dhbG51dC1pbWFnZV0nKSxcblx0XHRcdFx0XHRpbWFnZXMgPSBbXTtcblxuXHRcdFx0XHRpZiAoYmdPbGQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBiZ09sZC5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goYmdPbGRbeF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYmcubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBiZy5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goYmdbeF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWJnT2xkLmxlbmd0aCAmJiAhYmcubGVuZ3RoICYmIGltZyApIHtcblx0XHRcdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGltZy5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goaW1nW3hdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgaW1hZ2VzLmxlbmd0aDsgaisrKSB7XG5cblx0XHRcdFx0XHRpbWFnZXNbal0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9wZW5WaWV3ZXIpO1xuXG5cdFx0XHRcdFx0aW1hZ2VzW2pdLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGopO1xuXG5cdFx0XHRcdFx0bGV0IHNyYztcblxuXHRcdFx0XHRcdGlmKGltYWdlc1tqXS5zcmMpIHtcblx0XHRcdFx0XHRcdHNyYyA9IGltYWdlc1tqXS5zcmNcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV0IHN0eWxlID0gaW1hZ2VzW2pdLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpbWFnZXNbal0sIG51bGwpO1xuXHRcdFx0XHRcdFx0c3JjID0gc3R5bGUuYmFja2dyb3VuZEltYWdlLnNsaWNlKDQsIC0xKS5yZXBsYWNlKC9cIi9nLCBcIlwiKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb250YWluZXJBcnJheVtpXS5pbWFnZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRlbGVtOiBpbWFnZXNbal0sXG5cdFx0XHRcdFx0XHRzcmM6IHNyYyxcblx0XHRcdFx0XHRcdGluZGV4OiBqXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgRWxlbWVudHMgdGhhdCBidWlsZHMgdXAgdGhlIHZpZXdlclxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGJ1aWxkVmlld2VyKCkge1xuXHRcdFx0bGV0IHVsIFx0XHRcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKSxcblx0XHRcdFx0bGlzdENvbnRhaW5lciBcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuXHRcdFx0XHR3cmFwcGVyIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdFx0Ym94ICBcdFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdFx0bWFpbkltYWdlIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKSxcblx0XHRcdFx0bWFpbkltYWdlQ29udGFpbmVyIFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuXHRcdFx0XHRuZXh0QnRuIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdFx0cHJldkJ0biBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0XHRcdGNsb3NlQnRuIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKSxcblx0XHRcdFx0Ym9keVRhZyBcdFx0XHQ9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSxcblx0XHRcdFx0ZWxEaXJlY3Rpb25BcnJvdyAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0XHRcdGVsRGlyZWN0aW9uTGluZSAgICBcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkIENTUyBjbGFzc2VzIHRvIHRoZSBlbGVtZW50c1xuXHRcdFx0ICovXG5cdFx0XHR1bC5jbGFzc05hbWUgXHRcdFx0XHRcdD0gXCJ3YWxudXRfX2xpc3RcIjtcblx0XHRcdGxpc3RDb250YWluZXIuY2xhc3NOYW1lIFx0XHQ9IFwid2FsbnV0X19saXN0LWNvbnRhaW5lclwiO1xuXHRcdFx0bWFpbkltYWdlLmNsYXNzTmFtZSBcdFx0XHQ9IFwid2FsbnV0X19pbWFnZVwiO1xuXHRcdFx0bWFpbkltYWdlQ29udGFpbmVyLmNsYXNzTmFtZSBcdD0gXCJ3YWxudXRfX2ltYWdlLWNvbnRhaW5lclwiXG5cdFx0XHRib3guY2xhc3NOYW1lIFx0XHRcdFx0XHQ9IFwid2FsbnV0X19ib3hcIjtcblx0XHRcdHdyYXBwZXIuY2xhc3NOYW1lIFx0XHRcdFx0PSBcIndhbG51dF9fd3JhcHBlclwiO1xuXHRcdFx0Ly8gd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJkcmFnZ2FibGVcIiwgXCJ0cnVlXCIpO1xuXHRcdFx0bmV4dEJ0bi5jbGFzc05hbWUgXHRcdFx0XHQ9IFwid2FsbnV0X19uYXZpZ2F0aW9uIHdhbG51dF9fbmF2aWdhdGlvbi0tbmV4dFwiO1xuXHRcdFx0cHJldkJ0bi5jbGFzc05hbWUgXHRcdFx0XHQ9IFwid2FsbnV0X19uYXZpZ2F0aW9uIHdhbG51dF9fbmF2aWdhdGlvbi0tcHJldlwiO1xuXHRcdFx0ZWxEaXJlY3Rpb25BcnJvdy5jbGFzc05hbWUgXHRcdD0gXCJ3YWxudXRfX2RpcmVjdGlvbi1hcnJvd1wiO1xuXHRcdFx0ZWxEaXJlY3Rpb25MaW5lLmNsYXNzTmFtZSBcdFx0PSBcIndhbG51dF9fZGlyZWN0aW9uLWxpbmVcIjtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDb25uZWN0cyB0aGUgRWxlbWVudHMgYW5kIGNyZWF0ZXMgdGhlIHN0cnVjdHVyZVxuXHRcdFx0ICovXG5cdFx0XHRuZXh0QnRuLmFwcGVuZENoaWxkKGdfc3ZnQnRuUmlnaHQpO1xuXHRcdFx0cHJldkJ0bi5hcHBlbmRDaGlsZChnX3N2Z0J0bkxlZnQpO1xuXHRcdFx0ZWxEaXJlY3Rpb25MaW5lLmFwcGVuZENoaWxkKGVsRGlyZWN0aW9uQXJyb3cpO1xuXHRcdFx0bWFpbkltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKG1haW5JbWFnZSk7XG5cdFx0XHRtYWluSW1hZ2VDb250YWluZXIuYXBwZW5kQ2hpbGQobmV4dEJ0bik7XG5cdFx0XHRtYWluSW1hZ2VDb250YWluZXIuYXBwZW5kQ2hpbGQocHJldkJ0bik7XG5cdFx0XHRtYWluSW1hZ2VDb250YWluZXIuYXBwZW5kQ2hpbGQoZWxEaXJlY3Rpb25MaW5lKTtcblx0XHRcdGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQodWwpO1xuXHRcdFx0Ym94LmFwcGVuZENoaWxkKG1haW5JbWFnZUNvbnRhaW5lcik7XG5cdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGxpc3RDb250YWluZXIpO1xuXHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChnX3N2Z0Nsb3NlQnRuKTtcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoYm94KTtcblx0XHRcdGJvZHlUYWcuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBZGQgRnVsbHNjcmVlbiBidXR0b24gd2hlbiBub3QgaW4gZnVsbHNjcmVlbiBtb2RlXG5cdFx0XHQgKi9cblx0XHRcdGlmKCEhaXNGdWxsc2NyZWVuRW5hYmxlZCgpKSB7XG5cdFx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoZ19zdmdGdWxsc2NyZWVuQnRuKTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBNYWtlIHZhcmlhYmxlcyBnbG9iYWwgZm9yIHdhbG51dFxuXHRcdFx0ICovXG5cdFx0XHRib2R5IFx0XHRcdFx0ID0gYm9keVRhZztcblx0XHRcdHZpZXdlci5jbG9zZUJ0blx0XHQgPSBnX3N2Z0Nsb3NlQnRuO1xuXHRcdFx0dmlld2VyLm5leHRCdG4gXHRcdCA9IG5leHRCdG47XG5cdFx0XHR2aWV3ZXIucHJldkJ0biBcdFx0ID0gcHJldkJ0bjtcblx0XHRcdHZpZXdlci5mdWxsc2NyZWVuQnRuICA9IGdfc3ZnRnVsbHNjcmVlbkJ0bjtcblx0XHRcdHZpZXdlci5tYWluSW1hZ2UgXHQgPSBtYWluSW1hZ2U7XG5cdFx0XHR2aWV3ZXIud3JhcHBlciBcdFx0ID0gd3JhcHBlcjtcblx0XHRcdHZpZXdlci5saXN0IFx0XHRcdCA9IHVsO1xuXHRcdFx0dmlld2VyLmRpcmVjdGlvbkFycm93ID0gZWxEaXJlY3Rpb25BcnJvdztcblx0XHRcdHZpZXdlci5kaXJlY3Rpb25MaW5lICA9IGVsRGlyZWN0aW9uTGluZTtcblx0XHRcdHZpZXdlci5ib3ggXHRcdFx0ID0gYm94O1xuXG5cblx0XHRcdGluaXRFdmVudHMoKTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCAqIE9wZW5zIFZpZXdlciBhbmRcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBvcGVuVmlld2VyKGU6IGFueSkge1xuXG5cdFx0XHRsZXQgaW5kZXgsXG5cdFx0XHRcdGNvbnRhaW5lcixcblx0XHRcdFx0bGlzdEl0ZW0sXG5cdFx0XHRcdG1haW5JbWFnZSA9IHZpZXdlci5tYWluSW1hZ2UsXG5cdFx0XHRcdHByZXZCdG4gPSB2aWV3ZXIucHJldkJ0bixcblx0XHRcdFx0bmV4dEJ0biA9IHZpZXdlci5uZXh0QnRuO1xuXG5cblx0XHRcdGNvbnRhaW5lciA9IGZpbmRBbmNlc3RvcihlLnRhcmdldCwgXCJ3YWxudXRcIilcblx0XHRcdGNvbnRhaW5lckluZGV4ID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWNvbnRhaW5lclwiKTtcblxuXHRcdFx0c2V0SW1hZ2VzKGNvbnRhaW5lckluZGV4KTtcblxuXHRcdFx0aW5kZXggPSB0aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpO1xuXHRcdFx0aW5kZXggPSBwYXJzZUludChpbmRleCk7XG5cblx0XHRcdGxldCBzcmM7XG5cdFx0XHRsZXQgc3R5bGUgPSB0aGlzLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLCBudWxsKTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBMb29rcyBmb3IgdGhlIGltYWdlIHNvdXJjZSBhbmQgaWYgbm90IGZvdW5kIGdldCB0aGUgYmFja2dyb3VuZCBpbWFnZVxuXHRcdFx0ICovXG5cdFx0XHRpZiAodGhpcy5zcmMpIHtcblx0XHRcdFx0c3JjID0gdGhpcy5zcmNcblx0XHRcdH0gZWxzZSBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICE9IFwibm9uZVwiKSB7XG5cdFx0XHRcdHNyYyA9IHN0eWxlLmJhY2tncm91bmRJbWFnZS5zbGljZSg0LCAtMSkucmVwbGFjZSgvXCIvZywgXCJcIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgaW1hZ2UgZm9yIGVsZW1lbnQ6IFwiICsgdGhpcyk7XG5cdFx0XHR9XG5cblx0XHRcdG1haW5JbWFnZS5zcmMgPSBzcmM7XG5cdFx0XHRtYWluSW1hZ2Uuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgaW5kZXgpO1xuXG5cblx0XHRcdGJvZHkuY2xhc3NMaXN0LmFkZChcIndhbG51dC0tb3BlblwiKTtcblxuXHRcdFx0aWYoaW5kZXggPT09IDAgJiYgaW5kZXggPT09IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHR9IGVsc2UgaWYoaW5kZXggPT09IDApIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9ZWxzZSBpZihpbmRleCA9PT0gKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkgKSB7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH1cblxuXHRcdFx0aW5pdEZsZXhFdmVudHMoKTtcblx0XHRcdGZpeFZpZXdlcigpO1xuXG5cdFx0XHR2aWV3ZXIud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X193cmFwcGVyLS1vcGVuXCIpO1xuXG5cdFx0XHRsZXQgc3RhdGVPYmogPSBcIndhbG51dFwiO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoc3RhdGVPYmosIFwid2FsbnV0XCIsIFwiXCIpO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0SW1hZ2VzKGNvbnRhaW5lckluZGV4OiBhbnkpIHtcblx0XHRcdGxldCBpbWcsXG5cdFx0XHRcdGxpLFxuXHRcdFx0XHRsaXN0ID0gdmlld2VyLmxpc3Q7XG5cblx0XHRcdGxpc3QuaW5uZXJIVE1MID0gXCJcIjtcblxuXHRcdFx0aWYoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuXHRcdFx0XHRcdGxpLmNsYXNzTmFtZSA9IFwid2FsbnV0X19pdGVtXCI7XG5cdFx0XHRcdFx0bGkuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2ldLnNyYyArIFwiKVwiO1xuXHRcdFx0XHRcdGxpLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LXNvdXJjZVwiLCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2ldLnNyYyk7XG5cdFx0XHRcdFx0bGkuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpXS5pbmRleCk7XG5cblxuXHRcdFx0XHRcdGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0bGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtc291cmNlXCIpO1xuXHRcdFx0XHRcdFx0Y2hhbmdlSW1hZ2UobnVsbCx7XG5cdFx0XHRcdFx0XHRcdHNvdXJjZTogc3JjLFxuXHRcdFx0XHRcdFx0XHRpbmRleDogcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKSksXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lcjogbnVsbFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRsaXN0LmFwcGVuZENoaWxkKGxpKTtcblxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZpeExpc3RXaWR0aCgpIHtcblx0XHRcdGxldCBlbEl0ZW06IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCIud2FsbnV0X19pdGVtXCIpWzBdLFxuXHRcdFx0XHRsaXN0SXRlbTogbnVtYmVyID0gZWxJdGVtLm9mZnNldFdpZHRoLFxuXHRcdFx0XHRlbExpc3Q6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCIud2FsbnV0X19saXN0XCIpWzBdO1xuXHRcdFx0ZWxMaXN0LnN0eWxlLndpZHRoID0gKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoICogIGxpc3RJdGVtKSArIFwicHhcIjtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjbG9zZVZpZXdlcigpIHtcblx0XHRcdHZpZXdlci5tYWluSW1hZ2Uuc3JjID0gXCJcIjtcblx0XHRcdHZpZXdlci53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX3dyYXBwZXItLW9wZW5cIik7XG5cdFx0XHRib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXQtLW9wZW5cIik7XG5cdFx0XHRkZWluaXRGbGV4RXZlbnRzKCk7XG5cdFx0XHRmdWxsc2NyZWVuKFwiZXhpdFwiKTtcblx0XHRcdGlmIChoaXN0b3J5LnN0YXRlID09PSBcIndhbG51dFwiKSB7XG5cdFx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGFuZ2VJbWFnZShhY3Rpb246IGFueSwgb2JqZWN0OiBhbnkgPSB1bmRlZmluZWQpIHtcblx0XHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0XHRsZXQgbmV3SW5kZXggPSAwLFxuXHRcdFx0XHRpbmRleDogbnVtYmVyID0gMCxcblx0XHRcdFx0cHJldkJ0biA9IHZpZXdlci5wcmV2QnRuLFxuXHRcdFx0XHRuZXh0QnRuID0gdmlld2VyLm5leHRCdG4sXG5cdFx0XHRcdG1haW5JbWFnZSA9IHZpZXdlci5tYWluSW1hZ2U7XG5cblx0XHRcdGlmKHR5cGVvZiBhY3Rpb24gIT09IFwidW5kZWZpbmVkXCIgJiYgYWN0aW9uICE9PSBudWxsICl7XG5cdFx0XHRcdGluZGV4ID0gcGFyc2VJbnQobWFpbkltYWdlLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpKTtcblxuXHRcdFx0XHRpZihhY3Rpb24gPT09IFwibmV4dFwiICYmIGluZGV4IDwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKXtcblx0XHRcdFx0XHRpbmRleCA9IGluZGV4ICsgMTtcblx0XHRcdFx0fWVsc2UgaWYoYWN0aW9uID09PSBcInByZXZcIiAmJiBpbmRleCA+IDAgKXtcblx0XHRcdFx0XHRpbmRleCA9IGluZGV4IC0gMTtcblx0XHRcdFx0fWVsc2Uge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRPRE86IGZpbmQgcmlnaHQgYXJyYXkgaXN0ZWFkIG9mIDBcblx0XHRcdFx0aWYoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpbmRleF0pe1xuXHRcdFx0XHRcdG1haW5JbWFnZS5zcmMgPSBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2luZGV4XS5zcmM7XG5cdFx0XHRcdFx0bWFpbkltYWdlLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGluZGV4KTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdH0gZWxzZSBpZihvYmplY3QgJiYgb2JqZWN0LnNvdXJjZSl7XG5cdFx0XHRcdGluZGV4ID0gcGFyc2VJbnQob2JqZWN0LmluZGV4KTtcblx0XHRcdFx0bWFpbkltYWdlLnNyYyA9IG9iamVjdC5zb3VyY2U7XG5cdFx0XHRcdG1haW5JbWFnZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiLCBpbmRleCk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYoaW5kZXggPT09IDAgJiYgaW5kZXggPT09IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHR9IGVsc2UgaWYoaW5kZXggPT09IDApIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9ZWxzZSBpZihpbmRleCA9PT0gKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkgKSB7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH1cblxuXHRcdFx0Y2hlY2tIZWlnaHQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmaXhWaWV3ZXIoKSB7XG5cdFx0XHRjaGVja0hlaWdodCgpO1xuXHRcdFx0aWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53YWxudXRfX2l0ZW1cIikgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXHRcdFx0XHRmaXhMaXN0V2lkdGgoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0hlaWdodCgpIHtcblx0XHRcdGxldCB2aWV3ZXJIZWlnaHQgPSB2aWV3ZXIuYm94Lm9mZnNldEhlaWdodCxcblx0XHRcdFx0d3JhcHBlciA9IHZpZXdlci53cmFwcGVyO1xuXG5cdFx0XHRpZiAoIHZpZXdlckhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuXHRcdFx0XHR3cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXQtLWFsaWduLXRvcFwiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dC0tYWxpZ24tdG9wXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrS2V5UHJlc3NlZChlOiBhbnkpIHtcblx0XHRcdGxldCBrZXkgPSBlLmtleUNvZGU7XG5cdFx0XHRpZigga2V5ID09PSAzNykge1xuXHRcdFx0XHRjaGFuZ2VJbWFnZShcInByZXZcIik7XG5cdFx0XHR9IGVsc2UgaWYoa2V5ID09PSAzOSkge1xuXHRcdFx0XHRjaGFuZ2VJbWFnZShcIm5leHRcIik7XG5cdFx0XHR9IGVsc2UgaWYoa2V5ID09PSAyNykge1xuXHRcdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsaWNrV3JhcHBlcihlOiBhbnkpIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIEZJWE1FOiBzdG9wIGV2ZW50IGZyb20gYnViYmxpbmdcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gRklYTUU6IHN0b3AgZXZlbnQgZnJvbSBidWJibGluZ1xuXHRcdFx0aWYgKGUudGFyZ2V0ICE9PSB0aGlzKSB7XG5cdFx0XHQgICAgcmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y2xvc2VWaWV3ZXIuY2FsbCh0aGlzKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmdWxsc2NyZWVuKG9wdGlvbjogc3RyaW5nKSB7XG5cdFx0XHRsZXQgd3JhcHBlciBcdFx0PSB2aWV3ZXIud3JhcHBlcixcblx0XHRcdFx0ZnVsbHNjcmVlbkJ0biBcdD0gdmlld2VyLmZ1bGxzY3JlZW5CdG47XG5cblx0XHRcdGlmKG9wdGlvbiA9PT0gXCJleGl0XCIpIHtcblx0XHRcdFx0ZXhpdEZ1bGxzY3JlZW4oKTtcblx0XHRcdFx0ZnVsbHNjcmVlbkJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19mdWxsc2NyZWVuLS1oaWRkZW5cIik7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxhdW5jaEludG9GdWxsc2NyZWVuKHdyYXBwZXIpO1xuXHRcdFx0XHRmdWxsc2NyZWVuQnRuLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2Z1bGxzY3JlZW4tLWhpZGRlblwiKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBuZXh0SW1hZ2UoKSB7XG5cdFx0XHRjaGFuZ2VJbWFnZS5jYWxsKHRoaXMsIFwibmV4dFwiKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBwcmV2SW1hZ2UoKSB7XG5cdFx0XHRjaGFuZ2VJbWFnZS5jYWxsKHRoaXMsIFwicHJldlwiKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzd2lwZVN0YXJ0KGU6IGFueSkge1xuXHRcdFx0bGV0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblx0XHRcdHRvdWNoU3RhcnRYID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCk7XG5cdFx0XHR0b3VjaFN0YXJ0WSA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFkpO1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN3aXBlTW92ZShlOiBhbnkpIHtcblx0XHRcdGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF0sXG5cdFx0XHRcdHRvdWNoTW92ZVggPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRYKSxcblx0XHRcdFx0dG91Y2hNb3ZlWSA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFkpLFxuXHRcdFx0XHRpbmRleCA9IHZpZXdlci5tYWluSW1hZ2UuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiksXG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUgPSB2aWV3ZXIuZGlyZWN0aW9uTGluZSxcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cgPSB2aWV3ZXIuZGlyZWN0aW9uQXJyb3csXG5cdFx0XHRcdGRpc3RYLFxuXHRcdFx0XHRkaXN0WTtcblxuXHRcdFx0ZGlzdFggPSBNYXRoLmFicyh0b3VjaE1vdmVYIC0gdG91Y2hTdGFydFgpO1xuXHRcdFx0ZGlzdFkgPSBNYXRoLmFicyh0b3VjaE1vdmVZIC0gdG91Y2hTdGFydFkpO1xuXG5cdFx0XHRkaXJlY3Rpb25MaW5lLnN0eWxlLndpZHRoID0gNDAgKyBkaXN0WCArIFwicHhcIjtcblxuXHRcdFx0Ly8gQ2hlY2tzIGlmIHlvdSBzd2lwZSByaWdodCBvciBsZWZ0IG9yIGlmIHlvdSBzd2lwZWQgdXAgb3IgZG93biBtb3JlIHRoYW4gYWxsb3dlZCBhbmQgY2hlY2tzIGlmIHRoZXJlIGlzIG1vcmUgcGljdHVyZXMgdGhhdCB3YXlcblx0XHRcdGlmKHRvdWNoU3RhcnRYID4gdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICAmJiBpbmRleCA8IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtcmlnaHRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkFycm93LmlubmVySFRNTCA9IFwiXCI7XG5cdFx0XHRcdGRpcmVjdGlvbkFycm93LmFwcGVuZENoaWxkKGdfc3ZnQnRuUmlnaHQpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHRvdWNoU3RhcnRYID4gdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICkge1xuXHRcdFx0XHQvLyBzdG9wXG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdDbG9zZUJ0bkZpbGxlZCk7XG5cblx0XHRcdH0gZWxzZSBpZiAodG91Y2hTdGFydFggPCB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgJiYgaW5kZXggPiAwKSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdCdG5MZWZ0KTtcblxuXHRcdFx0fSBlbHNlIGlmKHRvdWNoU3RhcnRYIDwgdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlKSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdDbG9zZUJ0bkZpbGxlZCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZVwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLWxlZnRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdH1cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzd2lwZUVuZChlOiBhbnkpIHtcblx0XHRcdGxldCB0b3VjaG9iaiAgID0gZS5jaGFuZ2VkVG91Y2hlc1swXSxcblx0XHRcdFx0dG91Y2hNb3ZlWCA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFgpLFxuXHRcdFx0XHR0b3VjaE1vdmVZID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSksXG5cdFx0XHRcdGRpc3RZID0gTWF0aC5hYnModG91Y2hNb3ZlWSAtIHRvdWNoU3RhcnRZKSxcblx0XHRcdFx0ZGlzdFggPSBNYXRoLmFicyh0b3VjaE1vdmVYIC0gdG91Y2hTdGFydFgpLFxuXHRcdFx0XHRkaXJlY3Rpb25MaW5lID0gdmlld2VyLmRpcmVjdGlvbkxpbmU7XG5cblx0XHRcdHRvdWNoRW5kID0gdG91Y2hNb3ZlWDtcblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblxuXHRcdFx0aWYgKHRvdWNoU3RhcnRYID4gdG91Y2hFbmQgJiZcblx0XHRcdFx0XHRkaXN0WCA+IG1pblRvdWNoRGlzdGFuY2UgJiZcblx0XHRcdFx0XHRkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICkge1xuXG5cdFx0XHRcdG5leHRJbWFnZSgpO1xuXHRcdFx0fSBlbHNlIGlmICh0b3VjaFN0YXJ0WCA8IHRvdWNoRW5kICYmXG5cdFx0XHRcdFx0ZGlzdFggPiBtaW5Ub3VjaERpc3RhbmNlICYmXG5cdFx0XHRcdFx0ZGlzdFkgPCBhbGxvd2VkVG91Y2hEaXN0YW5jZSkge1xuXG5cdFx0XHRcdHByZXZJbWFnZSgpO1xuXHRcdFx0fSBlbHNlIGlmIChkaXN0WSA+IDIwMCkge1xuXG5cdFx0XHRcdGNsb3NlVmlld2VyKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlSGlzdG9yeShldmVudDogYW55KSB7XG5cdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRpbml0OiBpbml0XG5cdFx0fVxuXHR9KCkpO1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogd2FsbnV0LmluaXRcblx0fVxufSkod2luZG93KTtcbiJdfQ==
