(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.walnut = (function (window) {
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
        return document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled;
    }
    var launchIntoFullscreen = undefined, exitFullscreen = undefined;
    if (!!isFullscreenEnabled()) {
        var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
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
    }
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
            var elItem = document.getElementsByClassName("walnut__item")[0], listItem = elItem.offsetWidth, elList = document.getElementsByClassName("walnut__list")[0];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvd2FsbnV0L3dhbG51dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NNLE1BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFTLE1BQU07SUFDdEMsWUFBWSxDQUFDO0lBRWI7OztNQUdFO0lBQ0Ysc0JBQXVCLEVBQWUsRUFBRSxHQUFXO1FBQ2xELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNYLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7WUFBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ1YsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsQ0FBQztZQUNyRSxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7WUFDakcsQ0FBQztRQUNGLENBQUM7SUFDTCxDQUFDO0lBRUQ7UUFDQyxNQUFNLENBQU8sUUFBUyxDQUFDLGlCQUFpQjtZQUNqQyxRQUFTLENBQUMsdUJBQXVCO1lBQ2pDLFFBQVMsQ0FBQyxvQkFBb0I7WUFDOUIsUUFBUyxDQUFDLG1CQUFtQixDQUFDO0lBQ3RDLENBQUM7SUFDRCxJQUFJLG9CQUFvQixHQUFR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KHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4oPGFueT53aW5kb3cpLndhbG51dCA9IChmdW5jdGlvbih3aW5kb3cpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Lypcblx0KiBMb29rcyBmb3IgdGhlIGF0dHJpYnV0ZSBmaXJzdC5cblx0KiBJZiBubyBlbGVtZW50cyBhcmUgZm91bmQgdGhlbiB0cmllcyB3aXRoIGNsYXNzTGlzdFxuXHQqL1xuXHRmdW5jdGlvbiBmaW5kQW5jZXN0b3IgKGVsOiBIVE1MRWxlbWVudCwgY2xzOiBzdHJpbmcpIHtcblx0XHRsZXQgZWxlbSA9IGVsO1xuXHQgICAgd2hpbGUgKChlbGVtID0gZWxlbS5wYXJlbnRFbGVtZW50KSAmJiAhZWxlbS5oYXNBdHRyaWJ1dGUoY2xzKSk7XG5cdCAgICBpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cdCAgICBcdHJldHVybiBlbGVtO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0ZWxlbSA9IGVsO1xuXHQgICAgXHR3aGlsZSAoKGVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQpICYmICFlbGVtLmNsYXNzTGlzdC5jb250YWlucyhjbHMpKTtcblx0ICAgIFx0aWYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXHQgICAgXHRcdHJldHVybiBlbGVtO1xuXHQgICAgXHR9IGVsc2Uge1xuXHQgICAgXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYW55IGNvbnRhaW5lciB3aXRoIGF0dHJpYnV0ZSBvciBjbGFzcyAnd2FsbnV0JyBvZiB0aGlzIGVsZW1lbnRcIik7XG5cdCAgICBcdH1cblx0ICAgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGlzRnVsbHNjcmVlbkVuYWJsZWQoKSB7XG5cdFx0cmV0dXJuICg8YW55PmRvY3VtZW50KS5mdWxsc2NyZWVuRW5hYmxlZCB8fFxuXHRcdFx0KDxhbnk+ZG9jdW1lbnQpLndlYmtpdEZ1bGxzY3JlZW5FbmFibGVkIHx8XG5cdFx0XHQoPGFueT5kb2N1bWVudCkubW96RnVsbFNjcmVlbkVuYWJsZWQgfHxcblx0XHRcdCg8YW55PmRvY3VtZW50KS5tc0Z1bGxzY3JlZW5FbmFibGVkO1xuXHR9XG5cdGxldCBsYXVuY2hJbnRvRnVsbHNjcmVlbjogYW55ID0gdW5kZWZpbmVkLFxuXHRcdGV4aXRGdWxsc2NyZWVuOiBhbnkgPSB1bmRlZmluZWQ7XG5cblx0aWYgKCEhaXNGdWxsc2NyZWVuRW5hYmxlZCgpKSB7XG5cblx0XHRsZXQgZnVsbHNjcmVlbkVuYWJsZWQgPSAoPGFueT5kb2N1bWVudCkuZnVsbHNjcmVlbkVuYWJsZWQgfHwgKDxhbnk+ZG9jdW1lbnQpLm1vekZ1bGxTY3JlZW5FbmFibGVkIHx8ICg8YW55PmRvY3VtZW50KS53ZWJraXRGdWxsc2NyZWVuRW5hYmxlZDtcblx0XHRsZXQgZnVsbHNjcmVlbkVsZW1lbnQgPSAoPGFueT5kb2N1bWVudCkuZnVsbHNjcmVlbkVsZW1lbnQgfHwgKDxhbnk+ZG9jdW1lbnQpLm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8ICg8YW55PmRvY3VtZW50KS53ZWJraXRGdWxsc2NyZWVuRWxlbWVudDtcblxuXHRcdGxhdW5jaEludG9GdWxsc2NyZWVuID0gZnVuY3Rpb24gKGVsZW1lbnQ6IGFueSkge1xuXHRcdCAgaWYoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge1xuXHRcdCAgICBlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0ICB9IGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuXHRcdCAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG5cdFx0ICB9IGVsc2UgaWYoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikge1xuXHRcdCAgICBlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0ICB9IGVsc2UgaWYoZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7XG5cdFx0ICAgIGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdCAgfVxuXHRcdH07XG5cblx0XHRleGl0RnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcblx0XHQgIGlmKCg8YW55PmRvY3VtZW50KS5leGl0RnVsbHNjcmVlbikge1xuXHRcdCAgICAoPGFueT5kb2N1bWVudCkuZXhpdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH0gZWxzZSBpZigoPGFueT5kb2N1bWVudCkubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuXHRcdCAgICAoPGFueT5kb2N1bWVudCkubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuXHRcdCAgfSBlbHNlIGlmKCg8YW55PmRvY3VtZW50KS53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xuXHRcdCAgICAoPGFueT5kb2N1bWVudCkud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogW2RvRGV2aWNlSGF2ZVRvdWNoIGRlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gZG9EZXZpY2VIYXZlVG91Y2goKSB7XG5cdFx0dmFyIGJvb2wgPSBmYWxzZTtcblx0ICAgIGlmICgoJ29udG91Y2hzdGFydCcgaW4gKDxhbnk+d2luZG93KSkgfHwgKDxhbnk+d2luZG93KS5Eb2N1bWVudFRvdWNoKSB7XG5cdCAgICAgIGJvb2wgPSB0cnVlO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGJvb2w7XG5cdH1cblxuXHQvKipcblx0ICogT24gUmVzaXplRXZlbnQgZnVuY3Rpb25cblx0ICovXG5cdGZ1bmN0aW9uIHJlc2l6ZUV2ZW50KGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIGFjdGlvbjogc3RyaW5nID0gdW5kZWZpbmVkKSB7XG5cdFx0aWYoYWN0aW9uID09PSBcInJlbW92ZVwiKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2FsbGJhY2ssIHRydWUpO1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBjYWxsYmFjayk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGNhbGxiYWNrKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVXNlIFNWRyBhcyBpbmxpbmUgSmF2YVNjcmlwdFxuXHQgKi9cblx0bGV0IHN2Z0Nsb3NlQnRuID0gJzxzdmcgY2xhc3M9XCJ3YWxudXQtY2xvc2VcIiB2aWV3Qm94PVwiMCAwIDgwMCA4MDBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40XCI+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMjEuNiA2MS42bDM4LjgtMzlMNzc1IDczNy4zbC0zOSAzOXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMjEuNiA2MS42bDM4LjgtMzlMNzc1IDczNy4zbC0zOSAzOXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMi44IDgwLjRMODAuMyAzbDcxNC40IDcxNC4zLTc3LjUgNzcuNXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNNzk3LjcgODIuNUw3MTcuMiAyIDIuOCA3MTYuNCA4My4yIDc5N3pcIi8+PC9zdmc+Jyxcblx0XHRzdmdDbG9zZUJ0bkZpbGxlZCA9ICc8c3ZnIHZpZXdCb3g9XCIwIDAgODAwIDgwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxLjRcIj48cGF0aCBkPVwiTTQwMCA3LjJjMjE5LjQgMCAzOTcuNiAxNzYuMyAzOTcuNiAzOTMuNVM2MTkuNCA3OTQuMyA0MDAgNzk0LjNDMTgwLjYgNzk0LjMgMi40IDYxOCAyLjQgNDAwLjcgMi40IDE4My41IDE4MC42IDcuMiA0MDAgNy4yem0tNDguMiAzODlMMTUzLjIgNTk1bDUwLjIgNTAuMkw0MDIgNDQ2LjUgNTk5LjQgNjQ0bDQ4LjQtNDguNUw0NTAuNSAzOThsMTk5LjItMTk5LTUwLjItNTAuNEw0MDAuMiAzNDggMjAxLjUgMTQ5IDE1MyAxOTcuNiAzNTIgMzk2LjN6XCIgZmlsbD1cIiNmZmZcIi8+PC9zdmc+Jyxcblx0XHRzdmdGdWxsc2NyZWVuQnRuID0gJzxzdmcgY2xhc3M9XCJ3YWxudXRfX2Z1bGxzY3JlZW5cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEuNFwiPjxwYXRoIGQ9XCJNMy40IDE1LjRIMFYyNGg4LjZ2LTMuNEgzLjR2LTUuMnpNMCA4LjZoMy40VjMuNGg1LjJWMEgwdjguNnptMjAuNiAxMmgtNS4yVjI0SDI0di04LjZoLTMuNHY1LjJ6TTE1LjQgMHYzLjRoNS4ydjUuMkgyNFYwaC04LjZ6XCIgZmlsbD1cIiNmZmZcIiBmaWxsLXJ1bGU9XCJub256ZXJvXCIvPjwvc3ZnPicsXG5cdFx0c3ZnQnRuTGVmdCA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0X19uYXZpZ2F0aW9uLWltZ1wiIHZpZXdCb3g9XCIwIDAgNDUgNDVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40MVwiPjxnIGZpbGw9XCIjZmZmXCIgZmlsbC1ydWxlPVwibm9uemVyb1wiPjxwYXRoIGQ9XCJNMjIuMTIgNDQuMjRjMTIuMiAwIDIyLjEyLTkuOTMgMjIuMTItMjIuMTJDNDQuMjQgOS45MiAzNC4zIDAgMjIuMTIgMCA5LjkyIDAgMCA5LjkyIDAgMjIuMTJjMCAxMi4yIDkuOTIgMjIuMTIgMjIuMTIgMjIuMTJ6bTAtNDIuNzRjMTEuMzcgMCAyMC42MiA5LjI1IDIwLjYyIDIwLjYyIDAgMTEuMzctOS4yNSAyMC42Mi0yMC42MiAyMC42Mi0xMS4zNyAwLTIwLjYyLTkuMjUtMjAuNjItMjAuNjJDMS41IDEwLjc1IDEwLjc1IDEuNSAyMi4xMiAxLjV6XCIvPjxwYXRoIGQ9XCJNMjQuOSAyOS44OGMuMiAwIC4zOC0uMDcuNTItLjIyLjMtLjMuMy0uNzYgMC0xLjA2bC02LjgtNi44IDYuOC02LjhjLjMtLjMuMy0uNzcgMC0xLjA2LS4zLS4zLS43Ni0uMy0xLjA2IDBsLTcuMzIgNy4zM2MtLjMuMy0uMy43NyAwIDEuMDZsNy4zMiA3LjMzYy4xNS4xNS4zNC4yMi41My4yMnpcIi8+PC9nPjwvc3ZnPicsXG5cdFx0c3ZnQnRuUmlnaHQgPSAnPHN2ZyBjbGFzcz1cIndhbG51dF9fbmF2aWdhdGlvbi1pbWdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA0NC4yMzYgNDQuMjM2XCI+PGcgZmlsbD1cIiNGRkZcIj48cGF0aCBkPVwiTTIyLjEyIDQ0LjI0QzkuOTIgNDQuMjQgMCAzNC4zIDAgMjIuMTJTOS45MiAwIDIyLjEyIDBzMjIuMTIgOS45MiAyMi4xMiAyMi4xMi05LjkzIDIyLjEyLTIyLjEyIDIyLjEyem0wLTQyLjc0QzEwLjc1IDEuNSAxLjUgMTAuNzUgMS41IDIyLjEyYzAgMTEuMzcgOS4yNSAyMC42MiAyMC42MiAyMC42MiAxMS4zNyAwIDIwLjYyLTkuMjUgMjAuNjItMjAuNjIgMC0xMS4zNy05LjI1LTIwLjYyLTIwLjYyLTIwLjYyelwiLz48cGF0aCBkPVwiTTE5LjM0IDI5Ljg4Yy0uMiAwLS4zOC0uMDctLjUzLS4yMi0uMjgtLjMtLjI4LS43NiAwLTEuMDZsNi44LTYuOC02LjgtNi44Yy0uMjgtLjMtLjI4LS43NyAwLTEuMDcuMy0uMy43OC0uMyAxLjA3IDBsNy4zMyA3LjM0Yy4zLjMuMy43NyAwIDEuMDZsLTcuMzMgNy4zM2MtLjE0LjE1LS4zNC4yMi0uNTMuMjJ6XCIvPjwvZz48L3N2Zz4nO1xuXG5cdGxldCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCksXG5cdFx0Z19zdmdDbG9zZUJ0biA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnQ2xvc2VCdG4sIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQsXG5cdFx0Z19zdmdDbG9zZUJ0bkZpbGxlZCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnQ2xvc2VCdG5GaWxsZWQsIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQsXG5cdFx0Z19zdmdGdWxsc2NyZWVuQnRuID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdGdWxsc2NyZWVuQnRuLCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50LFxuXHRcdGdfc3ZnQnRuTGVmdCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnQnRuTGVmdCwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudCxcblx0XHRnX3N2Z0J0blJpZ2h0ID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdCdG5SaWdodCwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudDtcblxuXHQvKipcblx0ICogW3dhbG51dCBkZXNjcmlwdGlvbl1cblx0ICovXG5cdGxldCB3YWxudXQgPSAoZnVuY3Rpb24oKSB7XG5cblx0XHRsZXQgcGF0aCxcblx0XHRcdHBhdGhBcnJheSxcblx0XHRcdHBhdGhNaWRkbGUsXG5cdFx0XHRuZXdQYXRobmFtZSxcblx0XHRcdGksXG5cdFx0XHRuYXZpZ2F0aW9uQnV0dG9ucyxcblx0XHRcdGNvbnRhaW5lckluZGV4OiBzdHJpbmcsXG5cdFx0XHRib2R5OiBIVE1MRWxlbWVudDtcblxuXHRcdGxldCBDT05UQUlORVJTOiBhbnkgPSBbXSxcblx0XHRcdGNvbnRhaW5lckFycmF5OiBhbnkgPSBbXSxcblx0XHRcdHZpZXdlcjogYW55ID0ge30sXG5cdFx0XHRjb25maWc6IGFueSA9IHt9LFxuXHRcdFx0dG91Y2hTdGFydDogbnVtYmVyID0gMCxcblx0XHRcdHRvdWNoU3RhcnRYOiBudW1iZXIgPSAwLFxuXHRcdFx0dG91Y2hTdGFydFk6IG51bWJlciA9IDAsXG5cdFx0XHR0b3VjaEVuZDogbnVtYmVyID0gMCxcblx0XHRcdGFsbG93ZWRUb3VjaERpc3RhbmNlOiBudW1iZXIgPSAxMDAsXG5cdFx0XHRtaW5Ub3VjaERpc3RhbmNlOiBudW1iZXIgPSAyMDtcblxuXG5cdFx0bGV0IHV0aWxzID0ge1xuXHRcdFx0Z2V0Q29udGFpbmVyczpmdW5jdGlvbigpIHtcblx0XHRcdFx0bGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3dhbG51dF0nKTtcblx0XHRcdFx0aWYgKGVsZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbXM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2FsbnV0Jyk7XG5cdFx0XHRcdFx0aWYgKGVsZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtcztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhbnkgY29udGFpbmVycyBmb3IgXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGdldFNjcmlwdFNyYzpmdW5jdGlvbigpIHtcblx0XHRcdFx0bGV0IGVsZW06IGFueSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1t3YWxudXQtc2NyaXB0XScpO1xuXHRcdFx0XHRpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxTY3JpcHRFbGVtZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0uc3JjO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2FsbnV0U2NyaXB0Jyk7XG5cdFx0XHRcdFx0aWYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MU2NyaXB0RWxlbWVudCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW0uc3JjO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJDb3VsZG4ndCBmaW5kIHRoZSBzY3JpcHQtdGFnIGZvciB3YWxudXQgd2l0aCBhdHRyaWJ1dGUgd2FsbnV0LXNjcmlwdCBvciBpZD0nd2FsbnV0U2NyaXB0J1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRvbmNlOmZ1bmN0aW9uKGZuOiBhbnksIGNvbnRleHQ6IGFueSA9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBmdW5jdGlvbiBjYW4gb25seSBmaXJlIG9uY2Vcblx0XHRcdFx0bGV0IHJlc3VsdDogYW55O1xuXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZihmbikge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gZm4uYXBwbHkoY29udGV4dCB8fCB0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRcdFx0Zm4gPSBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdGxldCBuZXdQYXRoO1xuXG5cdFx0XHRDT05UQUlORVJTID0gdXRpbHMuZ2V0Q29udGFpbmVycygpO1xuXG5cdFx0XHRwYXRoID0gdXRpbHMuZ2V0U2NyaXB0U3JjKCk7XG5cblx0XHRcdHBhdGhBcnJheSA9IHBhdGguc3BsaXQoICcvJyApO1xuXHRcdFx0cGF0aEFycmF5LnNwbGljZShwYXRoQXJyYXkubGVuZ3RoLTEsIDAsIFwic3R5bGVzXCIpO1xuXHRcdFx0bmV3UGF0aCA9IHBhdGhBcnJheS5qb2luKFwiL1wiKTtcblx0XHRcdG5ld1BhdGggPSBuZXdQYXRoLnJlcGxhY2UoXCJ3YWxudXQuanNcIiwgXCJ3YWxudXQuY3NzXCIpO1xuXG5cdFx0XHRjb25maWcucGF0aFRvQ1NTID0gbmV3UGF0aDtcblxuXHRcdFx0YWRkQ1NTTGluaygpO1xuXHRcdFx0aW5kZXhJbWFnZXMoKTtcblx0XHRcdGJ1aWxkVmlld2VyKCk7XG5cblx0XHRcdGlmIChkb0RldmljZUhhdmVUb3VjaCgpKSB7XG5cdFx0XHRcdHZpZXdlci53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXQtLWlzLXRvdWNoXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0ICogQWRkcyBhbmQgcmVtb3ZlcyBldmVudCBvbiBvcGVuIGFuZCBjbG9zZVxuXHRcdCAqIFJFVklFVzogQWRkIG9uY2UgYW5kIGRvbnQgcmVtb3ZlLiBwcmVmb3JtYW5jZSBiZW5lZml0cz9cblx0XHQgKi9cblx0XHRsZXQgaW5pdEV2ZW50cyA9IHV0aWxzLm9uY2UoZnVuY3Rpb24oKSB7XG5cdFx0XHRsZXQgbWFpbkltYWdlID0gdmlld2VyLm1haW5JbWFnZTtcblx0XHRcdHZpZXdlci53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja1dyYXBwZXIpO1xuXHRcdFx0dmlld2VyLmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZVZpZXdlcik7XG5cdFx0XHR2aWV3ZXIuZnVsbHNjcmVlbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVsbHNjcmVlbik7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgY2hlY2tLZXlQcmVzc2VkKTtcblxuXHRcdFx0aWYgKGRvRGV2aWNlSGF2ZVRvdWNoKCkpIHtcblx0XHRcdFx0bWFpbkltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHN3aXBlU3RhcnQpO1xuXHRcdFx0XHRtYWluSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHN3aXBlRW5kKTtcblx0XHRcdFx0bWFpbkltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgc3dpcGVNb3ZlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZpZXdlci5uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBuZXh0SW1hZ2UpO1xuXHRcdFx0XHR2aWV3ZXIucHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHJldkltYWdlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGZ1bmN0aW9uIGluaXRGbGV4RXZlbnRzKCkge1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGNoZWNrS2V5UHJlc3NlZCk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGNoYW5nZUhpc3RvcnkpO1xuXHRcdFx0cmVzaXplRXZlbnQoZml4Vmlld2VyKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gZGVpbml0RmxleEV2ZW50cygpIHtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBjaGVja0tleVByZXNzZWQpO1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBjaGFuZ2VIaXN0b3J5KTtcblx0XHRcdHJlc2l6ZUV2ZW50KGZpeFZpZXdlciwgXCJyZW1vdmVcIik7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQWRkIHRoZSBDU1MgTGluayBpbiB0aGUgZG9jdW1lbnRcblx0XHQgKiBSRVZJRVc6IEhhdmUgdXNlciBkbyBpdCBoaW1zZWxmIHRvIG1ha2UgaXQgZWFzeSBmb3IgY3VzdG9taXphdGlvbj8gZnJvbSBDRE4gP1xuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGFkZENTU0xpbmsoKSB7XG5cblx0XHRcdGxldCBmaWxlcmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0XHQgICAgZmlsZXJlZi5zZXRBdHRyaWJ1dGUoXCJyZWxcIiwgXCJzdHlsZXNoZWV0XCIpO1xuXHQgICAgICAgIGZpbGVyZWYuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvY3NzXCIpO1xuXHQgICAgICAgIGZpbGVyZWYuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBjb25maWcucGF0aFRvQ1NTKTtcblxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKGZpbGVyZWYpO1xuXG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogSW5kZXhlcyBhcyBpbWFnZXMgc28gcmVsYXRlZCBpbWFnZXMgd2lsbCBzaG93IGFzIHRodW1ibmFpbHMgd2hlbiBvcGVuaW5nIHRoZSB2aWV3ZXJcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBpbmRleEltYWdlcygpe1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBDT05UQUlORVJTLmxlbmd0aDsgaSsrKSB7XG5cblx0XHRcdFx0Y29udGFpbmVyQXJyYXkucHVzaCh7XG5cdFx0XHRcdFx0Y29udGFpbmVyOiBDT05UQUlORVJTW2ldLFxuXHRcdFx0XHRcdGltYWdlczogW11cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Q09OVEFJTkVSU1tpXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1jb250YWluZXJcIiwgaSk7XG5cblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogUHV0cyBpbWFnZXMgaW4gYSBhcnJheS4gRmluZHMgYWxsIGltYWdlcyB3aXRoIGVpdGhlcjpcblx0XHRcdFx0ICogQ0xBU1Mgb3IgQVRUUklCVVRFIHdpdGggXCJ3YWxudXQtaW1hZ2VcIlxuXHRcdFx0XHQgKiBJZiBuZWl0aGVyIGlzIGZvdW5kIHRoZW4gaXQgd2lsbCBsb29rIGZvciBhbGwgPGltZz4gdGFnc1xuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0bGV0IGltZyA9IENPTlRBSU5FUlNbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIiksXG5cdFx0XHRcdFx0YmdPbGQgPSBDT05UQUlORVJTW2ldLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3YWxudXQtaW1hZ2VcIiksXG5cdFx0XHRcdFx0YmcgPSBDT05UQUlORVJTW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t3YWxudXQtaW1hZ2VdJyksXG5cdFx0XHRcdFx0aW1hZ2VzID0gW107XG5cblx0XHRcdFx0aWYgKGJnT2xkLmxlbmd0aCkge1xuXHRcdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgYmdPbGQubGVuZ3RoOyB4KyspIHtcblx0XHRcdFx0XHRcdGltYWdlcy5wdXNoKGJnT2xkW3hdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGJnLmxlbmd0aCkge1xuXHRcdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgYmcubGVuZ3RoOyB4KyspIHtcblx0XHRcdFx0XHRcdGltYWdlcy5wdXNoKGJnW3hdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFiZ09sZC5sZW5ndGggJiYgIWJnLmxlbmd0aCAmJiBpbWcgKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBpbWcubGVuZ3RoOyB4KyspIHtcblx0XHRcdFx0XHRcdGltYWdlcy5wdXNoKGltZ1t4XSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGltYWdlcy5sZW5ndGg7IGorKykge1xuXG5cdFx0XHRcdFx0aW1hZ2VzW2pdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvcGVuVmlld2VyKTtcblxuXHRcdFx0XHRcdGltYWdlc1tqXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiLCBqKTtcblxuXHRcdFx0XHRcdGxldCBzcmM7XG5cblx0XHRcdFx0XHRpZihpbWFnZXNbal0uc3JjKSB7XG5cdFx0XHRcdFx0XHRzcmMgPSBpbWFnZXNbal0uc3JjXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldCBzdHlsZSA9IGltYWdlc1tqXS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaW1hZ2VzW2pdLCBudWxsKTtcblx0XHRcdFx0XHRcdHNyYyA9IHN0eWxlLmJhY2tncm91bmRJbWFnZS5zbGljZSg0LCAtMSkucmVwbGFjZSgvXCIvZywgXCJcIik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29udGFpbmVyQXJyYXlbaV0uaW1hZ2VzLnB1c2goe1xuXHRcdFx0XHRcdFx0ZWxlbTogaW1hZ2VzW2pdLFxuXHRcdFx0XHRcdFx0c3JjOiBzcmMsXG5cdFx0XHRcdFx0XHRpbmRleDogalxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBDcmVhdGVzIEVsZW1lbnRzIHRoYXQgYnVpbGRzIHVwIHRoZSB2aWV3ZXJcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBidWlsZFZpZXdlcigpIHtcblx0XHRcdGxldCB1bCBcdFx0XHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIiksXG5cdFx0XHRcdGxpc3RDb250YWluZXIgXHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdFx0d3JhcHBlciBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0XHRcdGJveCAgXHRcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0XHRcdG1haW5JbWFnZSBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiksXG5cdFx0XHRcdG1haW5JbWFnZUNvbnRhaW5lciBcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdFx0bmV4dEJ0biBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0XHRcdHByZXZCdG4gXHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuXHRcdFx0XHRjbG9zZUJ0biBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiksXG5cdFx0XHRcdGJvZHlUYWcgXHRcdFx0PSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0sXG5cdFx0XHRcdGVsRGlyZWN0aW9uQXJyb3cgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuXHRcdFx0XHRlbERpcmVjdGlvbkxpbmUgICAgXHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEFkZCBDU1MgY2xhc3NlcyB0byB0aGUgZWxlbWVudHNcblx0XHRcdCAqL1xuXHRcdFx0dWwuY2xhc3NOYW1lIFx0XHRcdFx0XHQ9IFwid2FsbnV0X19saXN0XCI7XG5cdFx0XHRsaXN0Q29udGFpbmVyLmNsYXNzTmFtZSBcdFx0PSBcIndhbG51dF9fbGlzdC1jb250YWluZXJcIjtcblx0XHRcdG1haW5JbWFnZS5jbGFzc05hbWUgXHRcdFx0PSBcIndhbG51dF9faW1hZ2VcIjtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5jbGFzc05hbWUgXHQ9IFwid2FsbnV0X19pbWFnZS1jb250YWluZXJcIlxuXHRcdFx0Ym94LmNsYXNzTmFtZSBcdFx0XHRcdFx0PSBcIndhbG51dF9fYm94XCI7XG5cdFx0XHR3cmFwcGVyLmNsYXNzTmFtZSBcdFx0XHRcdD0gXCJ3YWxudXRfX3dyYXBwZXJcIjtcblx0XHRcdC8vIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwidHJ1ZVwiKTtcblx0XHRcdG5leHRCdG4uY2xhc3NOYW1lIFx0XHRcdFx0PSBcIndhbG51dF9fbmF2aWdhdGlvbiB3YWxudXRfX25hdmlnYXRpb24tLW5leHRcIjtcblx0XHRcdHByZXZCdG4uY2xhc3NOYW1lIFx0XHRcdFx0PSBcIndhbG51dF9fbmF2aWdhdGlvbiB3YWxudXRfX25hdmlnYXRpb24tLXByZXZcIjtcblx0XHRcdGVsRGlyZWN0aW9uQXJyb3cuY2xhc3NOYW1lIFx0XHQ9IFwid2FsbnV0X19kaXJlY3Rpb24tYXJyb3dcIjtcblx0XHRcdGVsRGlyZWN0aW9uTGluZS5jbGFzc05hbWUgXHRcdD0gXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lXCI7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ29ubmVjdHMgdGhlIEVsZW1lbnRzIGFuZCBjcmVhdGVzIHRoZSBzdHJ1Y3R1cmVcblx0XHRcdCAqL1xuXHRcdFx0bmV4dEJ0bi5hcHBlbmRDaGlsZChnX3N2Z0J0blJpZ2h0KTtcblx0XHRcdHByZXZCdG4uYXBwZW5kQ2hpbGQoZ19zdmdCdG5MZWZ0KTtcblx0XHRcdGVsRGlyZWN0aW9uTGluZS5hcHBlbmRDaGlsZChlbERpcmVjdGlvbkFycm93KTtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChtYWluSW1hZ2UpO1xuXHRcdFx0bWFpbkltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKG5leHRCdG4pO1xuXHRcdFx0bWFpbkltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZCdG4pO1xuXHRcdFx0bWFpbkltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsRGlyZWN0aW9uTGluZSk7XG5cdFx0XHRsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcblx0XHRcdGJveC5hcHBlbmRDaGlsZChtYWluSW1hZ2VDb250YWluZXIpO1xuXHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChsaXN0Q29udGFpbmVyKTtcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoZ19zdmdDbG9zZUJ0bik7XG5cdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGJveCk7XG5cdFx0XHRib2R5VGFnLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkIEZ1bGxzY3JlZW4gYnV0dG9uIHdoZW4gbm90IGluIGZ1bGxzY3JlZW4gbW9kZVxuXHRcdFx0ICovXG5cdFx0XHRpZighIWlzRnVsbHNjcmVlbkVuYWJsZWQoKSkge1xuXHRcdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGdfc3ZnRnVsbHNjcmVlbkJ0bik7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogTWFrZSB2YXJpYWJsZXMgZ2xvYmFsIGZvciB3YWxudXRcblx0XHRcdCAqL1xuXHRcdFx0Ym9keSBcdFx0XHRcdCA9IGJvZHlUYWc7XG5cdFx0XHR2aWV3ZXIuY2xvc2VCdG5cdFx0ID0gZ19zdmdDbG9zZUJ0bjtcblx0XHRcdHZpZXdlci5uZXh0QnRuIFx0XHQgPSBuZXh0QnRuO1xuXHRcdFx0dmlld2VyLnByZXZCdG4gXHRcdCA9IHByZXZCdG47XG5cdFx0XHR2aWV3ZXIuZnVsbHNjcmVlbkJ0biAgPSBnX3N2Z0Z1bGxzY3JlZW5CdG47XG5cdFx0XHR2aWV3ZXIubWFpbkltYWdlIFx0ID0gbWFpbkltYWdlO1xuXHRcdFx0dmlld2VyLndyYXBwZXIgXHRcdCA9IHdyYXBwZXI7XG5cdFx0XHR2aWV3ZXIubGlzdCBcdFx0XHQgPSB1bDtcblx0XHRcdHZpZXdlci5kaXJlY3Rpb25BcnJvdyA9IGVsRGlyZWN0aW9uQXJyb3c7XG5cdFx0XHR2aWV3ZXIuZGlyZWN0aW9uTGluZSAgPSBlbERpcmVjdGlvbkxpbmU7XG5cdFx0XHR2aWV3ZXIuYm94IFx0XHRcdCA9IGJveDtcblxuXG5cdFx0XHRpbml0RXZlbnRzKCk7XG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQgKiBPcGVucyBWaWV3ZXIgYW5kXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gb3BlblZpZXdlcihlOiBhbnkpIHtcblxuXHRcdFx0bGV0IGluZGV4LFxuXHRcdFx0XHRjb250YWluZXIsXG5cdFx0XHRcdGxpc3RJdGVtLFxuXHRcdFx0XHRtYWluSW1hZ2UgPSB2aWV3ZXIubWFpbkltYWdlLFxuXHRcdFx0XHRwcmV2QnRuID0gdmlld2VyLnByZXZCdG4sXG5cdFx0XHRcdG5leHRCdG4gPSB2aWV3ZXIubmV4dEJ0bjtcblxuXG5cdFx0XHRjb250YWluZXIgPSBmaW5kQW5jZXN0b3IoZS50YXJnZXQsIFwid2FsbnV0XCIpXG5cdFx0XHRjb250YWluZXJJbmRleCA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1jb250YWluZXJcIik7XG5cblx0XHRcdHNldEltYWdlcyhjb250YWluZXJJbmRleCk7XG5cblx0XHRcdGluZGV4ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKTtcblx0XHRcdGluZGV4ID0gcGFyc2VJbnQoaW5kZXgpO1xuXG5cdFx0XHRsZXQgc3JjO1xuXHRcdFx0bGV0IHN0eWxlID0gdGhpcy5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcywgbnVsbCk7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogTG9va3MgZm9yIHRoZSBpbWFnZSBzb3VyY2UgYW5kIGlmIG5vdCBmb3VuZCBnZXQgdGhlIGJhY2tncm91bmQgaW1hZ2Vcblx0XHRcdCAqL1xuXHRcdFx0aWYgKHRoaXMuc3JjKSB7XG5cdFx0XHRcdHNyYyA9IHRoaXMuc3JjXG5cdFx0XHR9IGVsc2UgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAhPSBcIm5vbmVcIikge1xuXHRcdFx0XHRzcmMgPSBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2Uuc2xpY2UoNCwgLTEpLnJlcGxhY2UoL1wiL2csIFwiXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIGltYWdlIGZvciBlbGVtZW50OiBcIiArIHRoaXMpO1xuXHRcdFx0fVxuXG5cdFx0XHRtYWluSW1hZ2Uuc3JjID0gc3JjO1xuXHRcdFx0bWFpbkltYWdlLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGluZGV4KTtcblxuXG5cdFx0XHRib2R5LmNsYXNzTGlzdC5hZGQoXCJ3YWxudXQtLW9wZW5cIik7XG5cblx0XHRcdGlmKGluZGV4ID09PSAwICYmIGluZGV4ID09PSBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0fSBlbHNlIGlmKGluZGV4ID09PSAwKSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fWVsc2UgaWYoaW5kZXggPT09IChjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpICkge1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdGluaXRGbGV4RXZlbnRzKCk7XG5cdFx0XHRmaXhWaWV3ZXIoKTtcblxuXHRcdFx0dmlld2VyLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fd3JhcHBlci0tb3BlblwiKTtcblxuXHRcdFx0bGV0IHN0YXRlT2JqID0gXCJ3YWxudXRcIjtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKHN0YXRlT2JqLCBcIndhbG51dFwiLCBcIlwiKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNldEltYWdlcyhjb250YWluZXJJbmRleDogYW55KSB7XG5cdFx0XHRsZXQgaW1nLFxuXHRcdFx0XHRsaSxcblx0XHRcdFx0bGlzdCA9IHZpZXdlci5saXN0O1xuXG5cdFx0XHRsaXN0LmlubmVySFRNTCA9IFwiXCI7XG5cblx0XHRcdGlmKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcblx0XHRcdFx0XHRsaS5jbGFzc05hbWUgPSBcIndhbG51dF9faXRlbVwiO1xuXHRcdFx0XHRcdGxpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpXS5zcmMgKyBcIilcIjtcblx0XHRcdFx0XHRsaS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1zb3VyY2VcIiwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGxpLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXNbaV0uaW5kZXgpO1xuXG5cblx0XHRcdFx0XHRsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGxldCBzcmMgPSB0aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LXNvdXJjZVwiKTtcblx0XHRcdFx0XHRcdGNoYW5nZUltYWdlKG51bGwse1xuXHRcdFx0XHRcdFx0XHRzb3VyY2U6IHNyYyxcblx0XHRcdFx0XHRcdFx0aW5kZXg6IHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIikpLFxuXHRcdFx0XHRcdFx0XHRjb250YWluZXI6IG51bGxcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0bGlzdC5hcHBlbmRDaGlsZChsaSk7XG5cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmaXhMaXN0V2lkdGgoKSB7XG5cdFx0XHRsZXQgZWxJdGVtOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwid2FsbnV0X19pdGVtXCIpWzBdLFxuXHRcdFx0XHRsaXN0SXRlbTogbnVtYmVyID0gZWxJdGVtLm9mZnNldFdpZHRoLFxuXHRcdFx0XHRlbExpc3Q6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3YWxudXRfX2xpc3RcIilbMF07XG5cdFx0XHRlbExpc3Quc3R5bGUud2lkdGggPSAoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggKiAgbGlzdEl0ZW0pICsgXCJweFwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsb3NlVmlld2VyKCkge1xuXHRcdFx0dmlld2VyLm1haW5JbWFnZS5zcmMgPSBcIlwiO1xuXHRcdFx0dmlld2VyLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fd3JhcHBlci0tb3BlblwiKTtcblx0XHRcdGJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dC0tb3BlblwiKTtcblx0XHRcdGRlaW5pdEZsZXhFdmVudHMoKTtcblx0XHRcdGZ1bGxzY3JlZW4oXCJleGl0XCIpO1xuXHRcdFx0aWYgKGhpc3Rvcnkuc3RhdGUgPT09IFwid2FsbnV0XCIpIHtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoYW5nZUltYWdlKGFjdGlvbjogYW55LCBvYmplY3Q6IGFueSA9IHVuZGVmaW5lZCkge1xuXHRcdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHRcdGxldCBuZXdJbmRleCA9IDAsXG5cdFx0XHRcdGluZGV4OiBudW1iZXIgPSAwLFxuXHRcdFx0XHRwcmV2QnRuID0gdmlld2VyLnByZXZCdG4sXG5cdFx0XHRcdG5leHRCdG4gPSB2aWV3ZXIubmV4dEJ0bixcblx0XHRcdFx0bWFpbkltYWdlID0gdmlld2VyLm1haW5JbWFnZTtcblxuXHRcdFx0aWYodHlwZW9mIGFjdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhY3Rpb24gIT09IG51bGwgKXtcblx0XHRcdFx0aW5kZXggPSBwYXJzZUludChtYWluSW1hZ2UuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIikpO1xuXG5cdFx0XHRcdGlmKGFjdGlvbiA9PT0gXCJuZXh0XCIgJiYgaW5kZXggPCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpe1xuXHRcdFx0XHRcdGluZGV4ID0gaW5kZXggKyAxO1xuXHRcdFx0XHR9ZWxzZSBpZihhY3Rpb24gPT09IFwicHJldlwiICYmIGluZGV4ID4gMCApe1xuXHRcdFx0XHRcdGluZGV4ID0gaW5kZXggLSAxO1xuXHRcdFx0XHR9ZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVE9ETzogZmluZCByaWdodCBhcnJheSBpc3RlYWQgb2YgMFxuXHRcdFx0XHRpZihjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2luZGV4XSl7XG5cdFx0XHRcdFx0bWFpbkltYWdlLnNyYyA9IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXNbaW5kZXhdLnNyYztcblx0XHRcdFx0XHRtYWluSW1hZ2Uuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgaW5kZXgpO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0fSBlbHNlIGlmKG9iamVjdCAmJiBvYmplY3Quc291cmNlKXtcblx0XHRcdFx0aW5kZXggPSBwYXJzZUludChvYmplY3QuaW5kZXgpO1xuXHRcdFx0XHRtYWluSW1hZ2Uuc3JjID0gb2JqZWN0LnNvdXJjZTtcblx0XHRcdFx0bWFpbkltYWdlLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGluZGV4KTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZihpbmRleCA9PT0gMCAmJiBpbmRleCA9PT0gY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdH0gZWxzZSBpZihpbmRleCA9PT0gMCkge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH1lbHNlIGlmKGluZGV4ID09PSAoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKSApIHtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRjaGVja0hlaWdodCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZpeFZpZXdlcigpIHtcblx0XHRcdGNoZWNrSGVpZ2h0KCk7XG5cdFx0XHRpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhbG51dF9faXRlbVwiKSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cdFx0XHRcdGZpeExpc3RXaWR0aCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrSGVpZ2h0KCkge1xuXHRcdFx0bGV0IHZpZXdlckhlaWdodCA9IHZpZXdlci5ib3gub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0XHR3cmFwcGVyID0gdmlld2VyLndyYXBwZXI7XG5cblx0XHRcdGlmICggdmlld2VySGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG5cdFx0XHRcdHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcIndhbG51dC0tYWxpZ24tdG9wXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0LS1hbGlnbi10b3BcIik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tLZXlQcmVzc2VkKGU6IGFueSkge1xuXHRcdFx0bGV0IGtleSA9IGUua2V5Q29kZTtcblx0XHRcdGlmKCBrZXkgPT09IDM3KSB7XG5cdFx0XHRcdGNoYW5nZUltYWdlKFwicHJldlwiKTtcblx0XHRcdH0gZWxzZSBpZihrZXkgPT09IDM5KSB7XG5cdFx0XHRcdGNoYW5nZUltYWdlKFwibmV4dFwiKTtcblx0XHRcdH0gZWxzZSBpZihrZXkgPT09IDI3KSB7XG5cdFx0XHRcdGNsb3NlVmlld2VyKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2xpY2tXcmFwcGVyKGU6IGFueSkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTsgLy8gRklYTUU6IHN0b3AgZXZlbnQgZnJvbSBidWJibGluZ1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBGSVhNRTogc3RvcCBldmVudCBmcm9tIGJ1YmJsaW5nXG5cdFx0XHRpZiAoZS50YXJnZXQgIT09IHRoaXMpIHtcblx0XHRcdCAgICByZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjbG9zZVZpZXdlci5jYWxsKHRoaXMpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZ1bGxzY3JlZW4ob3B0aW9uOiBzdHJpbmcpIHtcblx0XHRcdGxldCB3cmFwcGVyIFx0XHQ9IHZpZXdlci53cmFwcGVyLFxuXHRcdFx0XHRmdWxsc2NyZWVuQnRuIFx0PSB2aWV3ZXIuZnVsbHNjcmVlbkJ0bjtcblxuXHRcdFx0aWYob3B0aW9uID09PSBcImV4aXRcIikge1xuXHRcdFx0XHRleGl0RnVsbHNjcmVlbigpO1xuXHRcdFx0XHRmdWxsc2NyZWVuQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2Z1bGxzY3JlZW4tLWhpZGRlblwiKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGF1bmNoSW50b0Z1bGxzY3JlZW4od3JhcHBlcik7XG5cdFx0XHRcdGZ1bGxzY3JlZW5CdG4uY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZnVsbHNjcmVlbi0taGlkZGVuXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG5leHRJbWFnZSgpIHtcblx0XHRcdGNoYW5nZUltYWdlLmNhbGwodGhpcywgXCJuZXh0XCIpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHByZXZJbWFnZSgpIHtcblx0XHRcdGNoYW5nZUltYWdlLmNhbGwodGhpcywgXCJwcmV2XCIpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN3aXBlU3RhcnQoZTogYW55KSB7XG5cdFx0XHRsZXQgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXHRcdFx0dG91Y2hTdGFydFggPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRYKTtcblx0XHRcdHRvdWNoU3RhcnRZID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSk7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc3dpcGVNb3ZlKGU6IGFueSkge1xuXHRcdFx0bGV0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXSxcblx0XHRcdFx0dG91Y2hNb3ZlWCA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFgpLFxuXHRcdFx0XHR0b3VjaE1vdmVZID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSksXG5cdFx0XHRcdGluZGV4ID0gdmlld2VyLm1haW5JbWFnZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKSxcblx0XHRcdFx0ZGlyZWN0aW9uTGluZSA9IHZpZXdlci5kaXJlY3Rpb25MaW5lLFxuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdyA9IHZpZXdlci5kaXJlY3Rpb25BcnJvdyxcblx0XHRcdFx0ZGlzdFgsXG5cdFx0XHRcdGRpc3RZO1xuXG5cdFx0XHRkaXN0WCA9IE1hdGguYWJzKHRvdWNoTW92ZVggLSB0b3VjaFN0YXJ0WCk7XG5cdFx0XHRkaXN0WSA9IE1hdGguYWJzKHRvdWNoTW92ZVkgLSB0b3VjaFN0YXJ0WSk7XG5cblx0XHRcdGRpcmVjdGlvbkxpbmUuc3R5bGUud2lkdGggPSA0MCArIGRpc3RYICsgXCJweFwiO1xuXG5cdFx0XHQvLyBDaGVja3MgaWYgeW91IHN3aXBlIHJpZ2h0IG9yIGxlZnQgb3IgaWYgeW91IHN3aXBlZCB1cCBvciBkb3duIG1vcmUgdGhhbiBhbGxvd2VkIGFuZCBjaGVja3MgaWYgdGhlcmUgaXMgbW9yZSBwaWN0dXJlcyB0aGF0IHdheVxuXHRcdFx0aWYodG91Y2hTdGFydFggPiB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgICYmIGluZGV4IDwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdCdG5SaWdodCk7XG5cblx0XHRcdH0gZWxzZSBpZiAodG91Y2hTdGFydFggPiB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgKSB7XG5cdFx0XHRcdC8vIHN0b3Bcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLWxlZnRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZVwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0Nsb3NlQnRuRmlsbGVkKTtcblxuXHRcdFx0fSBlbHNlIGlmICh0b3VjaFN0YXJ0WCA8IHRvdWNoTW92ZVggJiYgZGlzdFkgPCBhbGxvd2VkVG91Y2hEaXN0YW5jZSAmJiBpbmRleCA+IDApIHtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0J0bkxlZnQpO1xuXG5cdFx0XHR9IGVsc2UgaWYodG91Y2hTdGFydFggPCB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UpIHtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0Nsb3NlQnRuRmlsbGVkKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0fVxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN3aXBlRW5kKGU6IGFueSkge1xuXHRcdFx0bGV0IHRvdWNob2JqICAgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLFxuXHRcdFx0XHR0b3VjaE1vdmVYID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCksXG5cdFx0XHRcdHRvdWNoTW92ZVkgPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZKSxcblx0XHRcdFx0ZGlzdFkgPSBNYXRoLmFicyh0b3VjaE1vdmVZIC0gdG91Y2hTdGFydFkpLFxuXHRcdFx0XHRkaXN0WCA9IE1hdGguYWJzKHRvdWNoTW92ZVggLSB0b3VjaFN0YXJ0WCksXG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUgPSB2aWV3ZXIuZGlyZWN0aW9uTGluZTtcblxuXHRcdFx0dG91Y2hFbmQgPSB0b3VjaE1vdmVYO1xuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZVwiKTtcblx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXG5cdFx0XHRpZiAodG91Y2hTdGFydFggPiB0b3VjaEVuZCAmJlxuXHRcdFx0XHRcdGRpc3RYID4gbWluVG91Y2hEaXN0YW5jZSAmJlxuXHRcdFx0XHRcdGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgKSB7XG5cblx0XHRcdFx0bmV4dEltYWdlKCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRvdWNoU3RhcnRYIDwgdG91Y2hFbmQgJiZcblx0XHRcdFx0XHRkaXN0WCA+IG1pblRvdWNoRGlzdGFuY2UgJiZcblx0XHRcdFx0XHRkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlKSB7XG5cblx0XHRcdFx0cHJldkltYWdlKCk7XG5cdFx0XHR9IGVsc2UgaWYgKGRpc3RZID4gMjAwKSB7XG5cblx0XHRcdFx0Y2xvc2VWaWV3ZXIoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGFuZ2VIaXN0b3J5KGV2ZW50OiBhbnkpIHtcblx0XHRcdGNsb3NlVmlld2VyKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGluaXQ6IGluaXRcblx0XHR9XG5cdH0oKSk7XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiB3YWxudXQuaW5pdFxuXHR9XG59KSh3aW5kb3cpO1xuIl19
