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
    var svgCloseBtn = '<svg class="walnut-close" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"/><path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"/><path class="walnut-close__path" fill="#fff" d="M2.8 80.4L80.3 3l714.4 714.3-77.5 77.5z"/><path class="walnut-close__path" fill="#fff" d="M797.7 82.5L717.2 2 2.8 716.4 83.2 797z"/></svg>';
    var svgCloseBtnFilled = '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path d="M400 7.2c219.4 0 397.6 176.3 397.6 393.5S619.4 794.3 400 794.3C180.6 794.3 2.4 618 2.4 400.7 2.4 183.5 180.6 7.2 400 7.2zm-48.2 389L153.2 595l50.2 50.2L402 446.5 599.4 644l48.4-48.5L450.5 398l199.2-199-50.2-50.4L400.2 348 201.5 149 153 197.6 352 396.3z" fill="#fff"/></svg>';
    var svgFullscreenBtn = '<svg class="walnut__fullscreen" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4"><path d="M3.4 15.4H0V24h8.6v-3.4H3.4v-5.2zM0 8.6h3.4V3.4h5.2V0H0v8.6zm20.6 12h-5.2V24H24v-8.6h-3.4v5.2zM15.4 0v3.4h5.2v5.2H24V0h-8.6z" fill="#fff" fill-rule="nonzero"/></svg>';
    var svgBtnLeft = '<svg class="walnut__navigation-img" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41"><g fill="#fff" fill-rule="nonzero"><path d="M22.12 44.24c12.2 0 22.12-9.93 22.12-22.12C44.24 9.92 34.3 0 22.12 0 9.92 0 0 9.92 0 22.12c0 12.2 9.92 22.12 22.12 22.12zm0-42.74c11.37 0 20.62 9.25 20.62 20.62 0 11.37-9.25 20.62-20.62 20.62-11.37 0-20.62-9.25-20.62-20.62C1.5 10.75 10.75 1.5 22.12 1.5z"/><path d="M24.9 29.88c.2 0 .38-.07.52-.22.3-.3.3-.76 0-1.06l-6.8-6.8 6.8-6.8c.3-.3.3-.77 0-1.06-.3-.3-.76-.3-1.06 0l-7.32 7.33c-.3.3-.3.77 0 1.06l7.32 7.33c.15.15.34.22.53.22z"/></g></svg>';
    var svgBtnRight = '<svg class="walnut__navigation-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.236 44.236"><g fill="#FFF"><path d="M22.12 44.24C9.92 44.24 0 34.3 0 22.12S9.92 0 22.12 0s22.12 9.92 22.12 22.12-9.93 22.12-22.12 22.12zm0-42.74C10.75 1.5 1.5 10.75 1.5 22.12c0 11.37 9.25 20.62 20.62 20.62 11.37 0 20.62-9.25 20.62-20.62 0-11.37-9.25-20.62-20.62-20.62z"/><path d="M19.34 29.88c-.2 0-.38-.07-.53-.22-.28-.3-.28-.76 0-1.06l6.8-6.8-6.8-6.8c-.28-.3-.28-.77 0-1.07.3-.3.78-.3 1.07 0l7.33 7.34c.3.3.3.77 0 1.06l-7.33 7.33c-.14.15-.34.22-.53.22z"/></g></svg>';
    var parser = new DOMParser();
    var g_svgCloseBtn = parser.parseFromString(svgCloseBtn, "image/svg+xml").documentElement;
    var g_svgCloseBtnFilled = parser.parseFromString(svgCloseBtnFilled, "image/svg+xml").documentElement;
    var g_svgFullscreenBtn = parser.parseFromString(svgFullscreenBtn, "image/svg+xml").documentElement;
    var g_svgBtnLeft = parser.parseFromString(svgBtnLeft, "image/svg+xml").documentElement;
    var g_svgBtnRight = parser.parseFromString(svgBtnRight, "image/svg+xml").documentElement;
    /**
     * [walnut description]
     */
    var walnut = (function () {
        /* Globals within walnut */
        var path;
        var pathArray;
        var pathMiddle;
        var newPathname;
        var i;
        var navigationButtons;
        var containerIndex;
        var CONTAINERS = [];
        var containerArray = [];
        var viewer = {};
        var config = {};
        var touchStart = 0;
        var touchStartX = 0;
        var touchStartY = 0;
        var touchEnd = 0;
        var allowedTouchDistance = 100;
        var minTouchDistance = 20;
        var utils = {
            getContainers: function () {
                var elems = document.querySelectorAll('[walnut]');
                if (elems.length > 0) {
                    return elems;
                }
                else {
                    elems = document.getElementsByClassName('walnut');
                    if (elems.length > 0) {
                        return elems;
                    }
                    else {
                        console.warn("Couldn't find any containers for ");
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
            // addCSSLink();
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
                var img = CONTAINERS[i_1].getElementsByTagName("img");
                var bgOld = CONTAINERS[i_1].getElementsByClassName("walnut-image");
                var bg = CONTAINERS[i_1].querySelectorAll('[walnut-image]');
                var images = [];
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
            var ul = document.createElement("ul");
            var listContainer = document.createElement("div");
            var wrapper = document.createElement("div");
            var box = document.createElement("div");
            var mainImage = document.createElement("img");
            var mainImageContainer = document.createElement("div");
            var nextBtn = document.createElement("div");
            var prevBtn = document.createElement("div");
            var closeBtn = document.createElement("img");
            var elDirectionArrow = document.createElement("div");
            var elDirectionLine = document.createElement("div");
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
            document.body.appendChild(wrapper);
            /**
             * Add Fullscreen button when not in fullscreen mode
             */
            if (!!isFullscreenEnabled()) {
                wrapper.appendChild(g_svgFullscreenBtn);
            }
            /**
             * Make variables global for walnut
             */
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
            var index;
            var container;
            var listItem;
            var mainImage = viewer.mainImage;
            var prevBtn = viewer.prevBtn;
            var nextBtn = viewer.nextBtn;
            var src;
            var style;
            container = findAncestor(e.target, "walnut");
            containerIndex = container.getAttribute("data-walnut-container");
            setImages(containerIndex);
            index = parseInt(this.getAttribute("data-walnut-index"));
            style = this.currentStyle || window.getComputedStyle(this, null);
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
            document.body.classList.add("walnut--open");
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
            var img;
            var li;
            var list = viewer.list;
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
            var elItem = document.getElementsByClassName("walnut__item")[0];
            var listItem = elItem.offsetWidth;
            var elList = document.getElementsByClassName("walnut__list")[0];
            elList.style.width = (containerArray[containerIndex].images.length * listItem) + "px";
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
        function changeImage(action, object) {
            "use strict";
            if (action === void 0) { action = undefined; }
            if (object === void 0) { object = undefined; }
            var newIndex = 0;
            var index = 0;
            var prevBtn = viewer.prevBtn;
            var nextBtn = viewer.nextBtn;
            var mainImage = viewer.mainImage;
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
            if (document.getElementsByClassName(".walnut__item")[0] instanceof HTMLElement) {
                fixListWidth();
            }
        }
        function checkHeight() {
            var viewerHeight = viewer.box.offsetHeight;
            var wrapper = viewer.wrapper;
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
            var wrapper = viewer.wrapper;
            var fullscreenBtn = viewer.fullscreenBtn;
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
            var touchobj = e.changedTouches[0];
            var touchMoveX = parseInt(touchobj.clientX);
            var touchMoveY = parseInt(touchobj.clientY);
            var index = viewer.mainImage.getAttribute("data-walnut-index");
            var directionLine = viewer.directionLine;
            var directionArrow = viewer.directionArrow;
            var distX;
            var distY;
            distX = Math.abs(touchMoveX - touchStartX);
            distY = Math.abs(touchMoveY - touchStartY);
            directionLine.style.width = 40 + distX + "px";
            // Checks if you swipe right or left or if you swiped up or down more than allowed and checks if there is more pictures that way
            if (touchStartX > touchMoveX && distY < allowedTouchDistance && index < containerArray[containerIndex].images.length - 1) {
                directionLine.classList.remove("walnut__direction-line--active-left");
                directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-right");
                directionArrow.innerHTML = ""; // TODO: instead of removing just hide
                directionArrow.appendChild(g_svgBtnRight);
            }
            else if (touchStartX > touchMoveX && distY < allowedTouchDistance) {
                // stop
                directionLine.classList.remove("walnut__direction-line--active-left");
                directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-right");
                directionArrow.innerHTML = "";
                directionArrow.appendChild(g_svgCloseBtnFilled);
            }
            else if (touchStartX < touchMoveX && distY < allowedTouchDistance && index > 0) {
                directionLine.classList.remove("walnut__direction-line--active-right");
                directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-left");
                directionArrow.innerHTML = "";
                directionArrow.appendChild(g_svgBtnLeft);
            }
            else if (touchStartX < touchMoveX && distY < allowedTouchDistance) {
                directionLine.classList.remove("walnut__direction-line--active-right");
                directionLine.classList.add("walnut__direction-line--active walnut__direction-line--active-left");
                directionArrow.innerHTML = "";
                directionArrow.appendChild(g_svgCloseBtnFilled);
            }
            else {
                directionLine.classList.remove("walnut__direction-line--active walnut__direction-line--active-left walnut__direction-line--active-right");
            }
            e.preventDefault();
        }
        function swipeEnd(e) {
            var touchobj = e.changedTouches[0];
            var touchMoveX = parseInt(touchobj.clientX);
            var touchMoveY = parseInt(touchobj.clientY);
            var distY = Math.abs(touchMoveY - touchStartY);
            var distX = Math.abs(touchMoveX - touchStartX);
            var directionLine = viewer.directionLine;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvd2FsbnV0L3dhbG51dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NNLE1BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFTLE1BQU07SUFDdEMsWUFBWSxDQUFDO0lBRWI7OztNQUdFO0lBQ0Ysc0JBQXVCLEVBQWUsRUFBRSxHQUFXO1FBQ2xELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNYLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7WUFBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ1YsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsQ0FBQztZQUNyRSxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7WUFDakcsQ0FBQztRQUNGLENBQUM7SUFDTCxDQUFDO0lBRUQ7UUFDQyxNQUFNLENBQU8sUUFBUyxDQUFDLGlCQUFpQjtZQUNqQyxRQUFTLENBQUMsdUJBQXVCO1lBQ2pDLFFBQVMsQ0FBQyxvQkFBb0I7WUFDOUIsUUFBUyxDQUFDLG1CQUFtQixDQUFDO0lBQ3RDLENBQUM7SUFDRCxJQUFJLG9CQUFvQixHQUFR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LENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuKDxhbnk+d2luZG93KS53YWxudXQgPSAoZnVuY3Rpb24od2luZG93KSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8qXG5cdCogTG9va3MgZm9yIHRoZSBhdHRyaWJ1dGUgZmlyc3QuXG5cdCogSWYgbm8gZWxlbWVudHMgYXJlIGZvdW5kIHRoZW4gdHJpZXMgd2l0aCBjbGFzc0xpc3Rcblx0Ki9cblx0ZnVuY3Rpb24gZmluZEFuY2VzdG9yIChlbDogSFRNTEVsZW1lbnQsIGNsczogc3RyaW5nKSB7XG5cdFx0bGV0IGVsZW0gPSBlbDtcblx0ICAgIHdoaWxlICgoZWxlbSA9IGVsZW0ucGFyZW50RWxlbWVudCkgJiYgIWVsZW0uaGFzQXR0cmlidXRlKGNscykpO1xuXHQgICAgaWYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXHQgICAgXHRyZXR1cm4gZWxlbTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdGVsZW0gPSBlbDtcblx0ICAgIFx0d2hpbGUgKChlbGVtID0gZWxlbS5wYXJlbnRFbGVtZW50KSAmJiAhZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2xzKSk7XG5cdCAgICBcdGlmIChlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0ICAgIFx0XHRyZXR1cm4gZWxlbTtcblx0ICAgIFx0fSBlbHNlIHtcblx0ICAgIFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGFueSBjb250YWluZXIgd2l0aCBhdHRyaWJ1dGUgb3IgY2xhc3MgJ3dhbG51dCcgb2YgdGhpcyBlbGVtZW50XCIpO1xuXHQgICAgXHR9XG5cdCAgICB9XG5cdH1cblxuXHRmdW5jdGlvbiBpc0Z1bGxzY3JlZW5FbmFibGVkKCkge1xuXHRcdHJldHVybiAoPGFueT5kb2N1bWVudCkuZnVsbHNjcmVlbkVuYWJsZWQgfHxcblx0XHRcdCg8YW55PmRvY3VtZW50KS53ZWJraXRGdWxsc2NyZWVuRW5hYmxlZCB8fFxuXHRcdFx0KDxhbnk+ZG9jdW1lbnQpLm1vekZ1bGxTY3JlZW5FbmFibGVkIHx8XG5cdFx0XHQoPGFueT5kb2N1bWVudCkubXNGdWxsc2NyZWVuRW5hYmxlZDtcblx0fVxuXHRsZXQgbGF1bmNoSW50b0Z1bGxzY3JlZW46IGFueSA9IHVuZGVmaW5lZCxcblx0XHRleGl0RnVsbHNjcmVlbjogYW55ID0gdW5kZWZpbmVkO1xuXG5cdGlmICghIWlzRnVsbHNjcmVlbkVuYWJsZWQoKSkge1xuXG5cdFx0bGV0IGZ1bGxzY3JlZW5FbmFibGVkID0gKDxhbnk+ZG9jdW1lbnQpLmZ1bGxzY3JlZW5FbmFibGVkIHx8ICg8YW55PmRvY3VtZW50KS5tb3pGdWxsU2NyZWVuRW5hYmxlZCB8fCAoPGFueT5kb2N1bWVudCkud2Via2l0RnVsbHNjcmVlbkVuYWJsZWQ7XG5cdFx0bGV0IGZ1bGxzY3JlZW5FbGVtZW50ID0gKDxhbnk+ZG9jdW1lbnQpLmZ1bGxzY3JlZW5FbGVtZW50IHx8ICg8YW55PmRvY3VtZW50KS5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fCAoPGFueT5kb2N1bWVudCkud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQ7XG5cblx0XHRsYXVuY2hJbnRvRnVsbHNjcmVlbiA9IGZ1bmN0aW9uIChlbGVtZW50OiBhbnkpIHtcblx0XHQgIGlmKGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4pIHtcblx0XHQgICAgZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdCAgfSBlbHNlIGlmKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcblx0XHQgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdCAgfSBlbHNlIGlmKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcblx0XHQgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdCAgfSBlbHNlIGlmKGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbikge1xuXHRcdCAgICBlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH1cblx0XHR9O1xuXG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG5cdFx0ICBpZigoPGFueT5kb2N1bWVudCkuZXhpdEZ1bGxzY3JlZW4pIHtcblx0XHQgICAgKDxhbnk+ZG9jdW1lbnQpLmV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0ICB9IGVsc2UgaWYoKDxhbnk+ZG9jdW1lbnQpLm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcblx0XHQgICAgKDxhbnk+ZG9jdW1lbnQpLm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcblx0XHQgIH0gZWxzZSBpZigoPGFueT5kb2N1bWVudCkud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcblx0XHQgICAgKDxhbnk+ZG9jdW1lbnQpLndlYmtpdEV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0ICB9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFtkb0RldmljZUhhdmVUb3VjaCBkZXNjcmlwdGlvbl1cblx0ICovXG5cdGZ1bmN0aW9uIGRvRGV2aWNlSGF2ZVRvdWNoKCkge1xuXHRcdHZhciBib29sID0gZmFsc2U7XG5cdCAgICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluICg8YW55PndpbmRvdykpIHx8ICg8YW55PndpbmRvdykuRG9jdW1lbnRUb3VjaCkge1xuXHQgICAgICBib29sID0gdHJ1ZTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBib29sO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9uIFJlc2l6ZUV2ZW50IGZ1bmN0aW9uXG5cdCAqL1xuXHRmdW5jdGlvbiByZXNpemVFdmVudChjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkLCBhY3Rpb246IHN0cmluZyA9IHVuZGVmaW5lZCkge1xuXHRcdGlmKGFjdGlvbiA9PT0gXCJyZW1vdmVcIikge1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgY2FsbGJhY2spO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2FsbGJhY2ssIHRydWUpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBjYWxsYmFjayk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFVzZSBTVkcgYXMgaW5saW5lIEphdmFTY3JpcHRcblx0ICovXG5cdGNvbnN0IHN2Z0Nsb3NlQnRuID0gJzxzdmcgY2xhc3M9XCJ3YWxudXQtY2xvc2VcIiB2aWV3Qm94PVwiMCAwIDgwMCA4MDBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40XCI+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMjEuNiA2MS42bDM4LjgtMzlMNzc1IDczNy4zbC0zOSAzOXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMjEuNiA2MS42bDM4LjgtMzlMNzc1IDczNy4zbC0zOSAzOXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMi44IDgwLjRMODAuMyAzbDcxNC40IDcxNC4zLTc3LjUgNzcuNXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNNzk3LjcgODIuNUw3MTcuMiAyIDIuOCA3MTYuNCA4My4yIDc5N3pcIi8+PC9zdmc+Jztcblx0Y29uc3Qgc3ZnQ2xvc2VCdG5GaWxsZWQgPSAnPHN2ZyB2aWV3Qm94PVwiMCAwIDgwMCA4MDBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40XCI+PHBhdGggZD1cIk00MDAgNy4yYzIxOS40IDAgMzk3LjYgMTc2LjMgMzk3LjYgMzkzLjVTNjE5LjQgNzk0LjMgNDAwIDc5NC4zQzE4MC42IDc5NC4zIDIuNCA2MTggMi40IDQwMC43IDIuNCAxODMuNSAxODAuNiA3LjIgNDAwIDcuMnptLTQ4LjIgMzg5TDE1My4yIDU5NWw1MC4yIDUwLjJMNDAyIDQ0Ni41IDU5OS40IDY0NGw0OC40LTQ4LjVMNDUwLjUgMzk4bDE5OS4yLTE5OS01MC4yLTUwLjRMNDAwLjIgMzQ4IDIwMS41IDE0OSAxNTMgMTk3LjYgMzUyIDM5Ni4zelwiIGZpbGw9XCIjZmZmXCIvPjwvc3ZnPic7XG5cdGNvbnN0IHN2Z0Z1bGxzY3JlZW5CdG4gPSAnPHN2ZyBjbGFzcz1cIndhbG51dF9fZnVsbHNjcmVlblwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40XCI+PHBhdGggZD1cIk0zLjQgMTUuNEgwVjI0aDguNnYtMy40SDMuNHYtNS4yek0wIDguNmgzLjRWMy40aDUuMlYwSDB2OC42em0yMC42IDEyaC01LjJWMjRIMjR2LTguNmgtMy40djUuMnpNMTUuNCAwdjMuNGg1LjJ2NS4ySDI0VjBoLTguNnpcIiBmaWxsPVwiI2ZmZlwiIGZpbGwtcnVsZT1cIm5vbnplcm9cIi8+PC9zdmc+Jztcblx0Y29uc3Qgc3ZnQnRuTGVmdCA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0X19uYXZpZ2F0aW9uLWltZ1wiIHZpZXdCb3g9XCIwIDAgNDUgNDVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40MVwiPjxnIGZpbGw9XCIjZmZmXCIgZmlsbC1ydWxlPVwibm9uemVyb1wiPjxwYXRoIGQ9XCJNMjIuMTIgNDQuMjRjMTIuMiAwIDIyLjEyLTkuOTMgMjIuMTItMjIuMTJDNDQuMjQgOS45MiAzNC4zIDAgMjIuMTIgMCA5LjkyIDAgMCA5LjkyIDAgMjIuMTJjMCAxMi4yIDkuOTIgMjIuMTIgMjIuMTIgMjIuMTJ6bTAtNDIuNzRjMTEuMzcgMCAyMC42MiA5LjI1IDIwLjYyIDIwLjYyIDAgMTEuMzctOS4yNSAyMC42Mi0yMC42MiAyMC42Mi0xMS4zNyAwLTIwLjYyLTkuMjUtMjAuNjItMjAuNjJDMS41IDEwLjc1IDEwLjc1IDEuNSAyMi4xMiAxLjV6XCIvPjxwYXRoIGQ9XCJNMjQuOSAyOS44OGMuMiAwIC4zOC0uMDcuNTItLjIyLjMtLjMuMy0uNzYgMC0xLjA2bC02LjgtNi44IDYuOC02LjhjLjMtLjMuMy0uNzcgMC0xLjA2LS4zLS4zLS43Ni0uMy0xLjA2IDBsLTcuMzIgNy4zM2MtLjMuMy0uMy43NyAwIDEuMDZsNy4zMiA3LjMzYy4xNS4xNS4zNC4yMi41My4yMnpcIi8+PC9nPjwvc3ZnPic7XG5cdGNvbnN0IHN2Z0J0blJpZ2h0ID0gJzxzdmcgY2xhc3M9XCJ3YWxudXRfX25hdmlnYXRpb24taW1nXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNDQuMjM2IDQ0LjIzNlwiPjxnIGZpbGw9XCIjRkZGXCI+PHBhdGggZD1cIk0yMi4xMiA0NC4yNEM5LjkyIDQ0LjI0IDAgMzQuMyAwIDIyLjEyUzkuOTIgMCAyMi4xMiAwczIyLjEyIDkuOTIgMjIuMTIgMjIuMTItOS45MyAyMi4xMi0yMi4xMiAyMi4xMnptMC00Mi43NEMxMC43NSAxLjUgMS41IDEwLjc1IDEuNSAyMi4xMmMwIDExLjM3IDkuMjUgMjAuNjIgMjAuNjIgMjAuNjIgMTEuMzcgMCAyMC42Mi05LjI1IDIwLjYyLTIwLjYyIDAtMTEuMzctOS4yNS0yMC42Mi0yMC42Mi0yMC42MnpcIi8+PHBhdGggZD1cIk0xOS4zNCAyOS44OGMtLjIgMC0uMzgtLjA3LS41My0uMjItLjI4LS4zLS4yOC0uNzYgMC0xLjA2bDYuOC02LjgtNi44LTYuOGMtLjI4LS4zLS4yOC0uNzcgMC0xLjA3LjMtLjMuNzgtLjMgMS4wNyAwbDcuMzMgNy4zNGMuMy4zLjMuNzcgMCAxLjA2bC03LjMzIDcuMzNjLS4xNC4xNS0uMzQuMjItLjUzLjIyelwiLz48L2c+PC9zdmc+JztcblxuXHRjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cdGNvbnN0IGdfc3ZnQ2xvc2VCdG4gPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0Nsb3NlQnRuLCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50O1xuXHRjb25zdCBnX3N2Z0Nsb3NlQnRuRmlsbGVkID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdDbG9zZUJ0bkZpbGxlZCwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudDtcblx0Y29uc3QgZ19zdmdGdWxsc2NyZWVuQnRuID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdGdWxsc2NyZWVuQnRuLCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50O1xuXHRjb25zdCBnX3N2Z0J0bkxlZnQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0J0bkxlZnQsIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQ7XG5cdGNvbnN0IGdfc3ZnQnRuUmlnaHQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0J0blJpZ2h0LCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50O1xuXG5cdC8qKlxuXHQgKiBbd2FsbnV0IGRlc2NyaXB0aW9uXVxuXHQgKi9cblx0Y29uc3Qgd2FsbnV0ID0gKGZ1bmN0aW9uKCkge1xuXG5cdFx0LyogR2xvYmFscyB3aXRoaW4gd2FsbnV0ICovXG5cdFx0bGV0IHBhdGg7XG5cdFx0bGV0IHBhdGhBcnJheTtcblx0XHRsZXQgcGF0aE1pZGRsZTtcblx0XHRsZXQgbmV3UGF0aG5hbWU7XG5cdFx0bGV0IGk7XG5cdFx0bGV0IG5hdmlnYXRpb25CdXR0b25zO1xuXHRcdGxldCBjb250YWluZXJJbmRleDogc3RyaW5nO1xuXG5cdFx0bGV0IENPTlRBSU5FUlM6IGFueSA9IFtdO1xuXHRcdGxldCBjb250YWluZXJBcnJheTogYW55ID0gW107XG5cdFx0bGV0IHZpZXdlcjogYW55ID0ge307XG5cdFx0bGV0IGNvbmZpZzogYW55ID0ge307XG5cdFx0bGV0IHRvdWNoU3RhcnQ6IG51bWJlciA9IDA7XG5cdFx0bGV0IHRvdWNoU3RhcnRYOiBudW1iZXIgPSAwO1xuXHRcdGxldCB0b3VjaFN0YXJ0WTogbnVtYmVyID0gMDtcblx0XHRsZXQgdG91Y2hFbmQ6IG51bWJlciA9IDA7XG5cblx0XHRjb25zdCBhbGxvd2VkVG91Y2hEaXN0YW5jZTogbnVtYmVyID0gMTAwO1xuXHRcdGNvbnN0IG1pblRvdWNoRGlzdGFuY2U6IG51bWJlciA9IDIwO1xuXG5cblx0XHRjb25zdCB1dGlscyA9IHtcblx0XHRcdGdldENvbnRhaW5lcnM6ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t3YWxudXRdJyk7XG5cdFx0XHRcdGlmIChlbGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1zO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2FsbnV0Jyk7XG5cdFx0XHRcdFx0aWYgKGVsZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtcztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiQ291bGRuJ3QgZmluZCBhbnkgY29udGFpbmVycyBmb3IgXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG9uY2U6ZnVuY3Rpb24oZm46IGFueSwgY29udGV4dDogYW55ID0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vIGZ1bmN0aW9uIGNhbiBvbmx5IGZpcmUgb25jZVxuXHRcdFx0XHRsZXQgcmVzdWx0OiBhbnk7XG5cblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmKGZuKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBmbi5hcHBseShjb250ZXh0IHx8IHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0XHRmbiA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0bGV0IG5ld1BhdGg7XG5cblx0XHRcdENPTlRBSU5FUlMgPSB1dGlscy5nZXRDb250YWluZXJzKCk7XG5cblx0XHRcdC8vIGFkZENTU0xpbmsoKTtcblx0XHRcdGluZGV4SW1hZ2VzKCk7XG5cdFx0XHRidWlsZFZpZXdlcigpO1xuXG5cdFx0XHRpZiAoZG9EZXZpY2VIYXZlVG91Y2goKSkge1xuXHRcdFx0XHR2aWV3ZXIud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwid2FsbnV0LS1pcy10b3VjaFwiKTtcblx0XHRcdH1cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCAqIEFkZHMgYW5kIHJlbW92ZXMgZXZlbnQgb24gb3BlbiBhbmQgY2xvc2Vcblx0XHQgKiBSRVZJRVc6IEFkZCBvbmNlIGFuZCBkb250IHJlbW92ZS4gcHJlZm9ybWFuY2UgYmVuZWZpdHM/XG5cdFx0ICovXG5cdFx0Y29uc3QgaW5pdEV2ZW50cyA9IHV0aWxzLm9uY2UoZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBtYWluSW1hZ2UgPSB2aWV3ZXIubWFpbkltYWdlO1xuXHRcdFx0dmlld2VyLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrV3JhcHBlcik7XG5cdFx0XHR2aWV3ZXIuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlVmlld2VyKTtcblx0XHRcdHZpZXdlci5mdWxsc2NyZWVuQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdWxsc2NyZWVuKTtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBjaGVja0tleVByZXNzZWQpO1xuXG5cdFx0XHRpZiAoZG9EZXZpY2VIYXZlVG91Y2goKSkge1xuXHRcdFx0XHRtYWluSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgc3dpcGVTdGFydCk7XG5cdFx0XHRcdG1haW5JbWFnZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgc3dpcGVFbmQpO1xuXHRcdFx0XHRtYWluSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBzd2lwZU1vdmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmlld2VyLm5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5leHRJbWFnZSk7XG5cdFx0XHRcdHZpZXdlci5wcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcmV2SW1hZ2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gaW5pdEZsZXhFdmVudHMoKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgY2hlY2tLZXlQcmVzc2VkKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgY2hhbmdlSGlzdG9yeSk7XG5cdFx0XHRyZXNpemVFdmVudChmaXhWaWV3ZXIpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkZWluaXRGbGV4RXZlbnRzKCkge1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGNoZWNrS2V5UHJlc3NlZCk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGNoYW5nZUhpc3RvcnkpO1xuXHRcdFx0cmVzaXplRXZlbnQoZml4Vmlld2VyLCBcInJlbW92ZVwiKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBJbmRleGVzIGFzIGltYWdlcyBzbyByZWxhdGVkIGltYWdlcyB3aWxsIHNob3cgYXMgdGh1bWJuYWlscyB3aGVuIG9wZW5pbmcgdGhlIHZpZXdlclxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGluZGV4SW1hZ2VzKCl7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IENPTlRBSU5FUlMubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHRjb250YWluZXJBcnJheS5wdXNoKHtcblx0XHRcdFx0XHRjb250YWluZXI6IENPTlRBSU5FUlNbaV0sXG5cdFx0XHRcdFx0aW1hZ2VzOiBbXVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRDT05UQUlORVJTW2ldLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWNvbnRhaW5lclwiLCBpKTtcblxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBQdXRzIGltYWdlcyBpbiBhIGFycmF5LiBGaW5kcyBhbGwgaW1hZ2VzIHdpdGggZWl0aGVyOlxuXHRcdFx0XHQgKiBDTEFTUyBvciBBVFRSSUJVVEUgd2l0aCBcIndhbG51dC1pbWFnZVwiXG5cdFx0XHRcdCAqIElmIG5laXRoZXIgaXMgZm91bmQgdGhlbiBpdCB3aWxsIGxvb2sgZm9yIGFsbCA8aW1nPiB0YWdzXG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRsZXQgaW1nID0gQ09OVEFJTkVSU1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKTtcblx0XHRcdFx0bGV0IGJnT2xkID0gQ09OVEFJTkVSU1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwid2FsbnV0LWltYWdlXCIpO1xuXHRcdFx0XHRsZXQgYmcgPSBDT05UQUlORVJTW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t3YWxudXQtaW1hZ2VdJyk7XG5cdFx0XHRcdGxldCBpbWFnZXMgPSBbXTtcblxuXHRcdFx0XHRpZiAoYmdPbGQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBiZ09sZC5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goYmdPbGRbeF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYmcubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBiZy5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goYmdbeF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWJnT2xkLmxlbmd0aCAmJiAhYmcubGVuZ3RoICYmIGltZyApIHtcblx0XHRcdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGltZy5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goaW1nW3hdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgaW1hZ2VzLmxlbmd0aDsgaisrKSB7XG5cblx0XHRcdFx0XHRpbWFnZXNbal0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9wZW5WaWV3ZXIpO1xuXG5cdFx0XHRcdFx0aW1hZ2VzW2pdLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGopO1xuXG5cdFx0XHRcdFx0bGV0IHNyYztcblxuXHRcdFx0XHRcdGlmKGltYWdlc1tqXS5zcmMpIHtcblx0XHRcdFx0XHRcdHNyYyA9IGltYWdlc1tqXS5zcmNcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV0IHN0eWxlID0gaW1hZ2VzW2pdLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpbWFnZXNbal0sIG51bGwpO1xuXHRcdFx0XHRcdFx0c3JjID0gc3R5bGUuYmFja2dyb3VuZEltYWdlLnNsaWNlKDQsIC0xKS5yZXBsYWNlKC9cIi9nLCBcIlwiKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb250YWluZXJBcnJheVtpXS5pbWFnZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRlbGVtOiBpbWFnZXNbal0sXG5cdFx0XHRcdFx0XHRzcmM6IHNyYyxcblx0XHRcdFx0XHRcdGluZGV4OiBqXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgRWxlbWVudHMgdGhhdCBidWlsZHMgdXAgdGhlIHZpZXdlclxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGJ1aWxkVmlld2VyKCkge1xuXHRcdFx0Y29uc3QgdWwgXHRcdFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuXHRcdFx0Y29uc3QgbGlzdENvbnRhaW5lciBcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y29uc3Qgd3JhcHBlciBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjb25zdCBib3ggIFx0XHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y29uc3QgbWFpbkltYWdlIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0XHRcdGNvbnN0IG1haW5JbWFnZUNvbnRhaW5lciBcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdGNvbnN0IG5leHRCdG4gXHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y29uc3QgcHJldkJ0biBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjb25zdCBjbG9zZUJ0biBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdFx0XHRjb25zdCBlbERpcmVjdGlvbkFycm93ICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdGNvbnN0IGVsRGlyZWN0aW9uTGluZSAgICBcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBZGQgQ1NTIGNsYXNzZXMgdG8gdGhlIGVsZW1lbnRzXG5cdFx0XHQgKi9cblx0XHRcdHVsLmNsYXNzTmFtZSBcdFx0XHRcdFx0PSBcIndhbG51dF9fbGlzdFwiO1xuXHRcdFx0bGlzdENvbnRhaW5lci5jbGFzc05hbWUgXHRcdD0gXCJ3YWxudXRfX2xpc3QtY29udGFpbmVyXCI7XG5cdFx0XHRtYWluSW1hZ2UuY2xhc3NOYW1lIFx0XHRcdD0gXCJ3YWxudXRfX2ltYWdlXCI7XG5cdFx0XHRtYWluSW1hZ2VDb250YWluZXIuY2xhc3NOYW1lIFx0PSBcIndhbG51dF9faW1hZ2UtY29udGFpbmVyXCJcblx0XHRcdGJveC5jbGFzc05hbWUgXHRcdFx0XHRcdD0gXCJ3YWxudXRfX2JveFwiO1xuXHRcdFx0d3JhcHBlci5jbGFzc05hbWUgXHRcdFx0XHQ9IFwid2FsbnV0X193cmFwcGVyXCI7XG5cdFx0XHQvLyB3cmFwcGVyLnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG5cdFx0XHRuZXh0QnRuLmNsYXNzTmFtZSBcdFx0XHRcdD0gXCJ3YWxudXRfX25hdmlnYXRpb24gd2FsbnV0X19uYXZpZ2F0aW9uLS1uZXh0XCI7XG5cdFx0XHRwcmV2QnRuLmNsYXNzTmFtZSBcdFx0XHRcdD0gXCJ3YWxudXRfX25hdmlnYXRpb24gd2FsbnV0X19uYXZpZ2F0aW9uLS1wcmV2XCI7XG5cdFx0XHRlbERpcmVjdGlvbkFycm93LmNsYXNzTmFtZSBcdFx0PSBcIndhbG51dF9fZGlyZWN0aW9uLWFycm93XCI7XG5cdFx0XHRlbERpcmVjdGlvbkxpbmUuY2xhc3NOYW1lIFx0XHQ9IFwid2FsbnV0X19kaXJlY3Rpb24tbGluZVwiO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIENvbm5lY3RzIHRoZSBFbGVtZW50cyBhbmQgY3JlYXRlcyB0aGUgc3RydWN0dXJlXG5cdFx0XHQgKi9cblx0XHRcdG5leHRCdG4uYXBwZW5kQ2hpbGQoZ19zdmdCdG5SaWdodCk7XG5cdFx0XHRwcmV2QnRuLmFwcGVuZENoaWxkKGdfc3ZnQnRuTGVmdCk7XG5cdFx0XHRlbERpcmVjdGlvbkxpbmUuYXBwZW5kQ2hpbGQoZWxEaXJlY3Rpb25BcnJvdyk7XG5cdFx0XHRtYWluSW1hZ2VDb250YWluZXIuYXBwZW5kQ2hpbGQobWFpbkltYWdlKTtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChuZXh0QnRuKTtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2QnRuKTtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbERpcmVjdGlvbkxpbmUpO1xuXHRcdFx0bGlzdENvbnRhaW5lci5hcHBlbmRDaGlsZCh1bCk7XG5cdFx0XHRib3guYXBwZW5kQ2hpbGQobWFpbkltYWdlQ29udGFpbmVyKTtcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQobGlzdENvbnRhaW5lcik7XG5cdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGdfc3ZnQ2xvc2VCdG4pO1xuXHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChib3gpO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEFkZCBGdWxsc2NyZWVuIGJ1dHRvbiB3aGVuIG5vdCBpbiBmdWxsc2NyZWVuIG1vZGVcblx0XHRcdCAqL1xuXHRcdFx0aWYoISFpc0Z1bGxzY3JlZW5FbmFibGVkKCkpIHtcblx0XHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChnX3N2Z0Z1bGxzY3JlZW5CdG4pO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIE1ha2UgdmFyaWFibGVzIGdsb2JhbCBmb3Igd2FsbnV0XG5cdFx0XHQgKi9cblx0XHRcdHZpZXdlci5jbG9zZUJ0blx0XHQgPSBnX3N2Z0Nsb3NlQnRuO1xuXHRcdFx0dmlld2VyLm5leHRCdG4gXHRcdCA9IG5leHRCdG47XG5cdFx0XHR2aWV3ZXIucHJldkJ0biBcdFx0ID0gcHJldkJ0bjtcblx0XHRcdHZpZXdlci5mdWxsc2NyZWVuQnRuICA9IGdfc3ZnRnVsbHNjcmVlbkJ0bjtcblx0XHRcdHZpZXdlci5tYWluSW1hZ2UgXHQgPSBtYWluSW1hZ2U7XG5cdFx0XHR2aWV3ZXIud3JhcHBlciBcdFx0ID0gd3JhcHBlcjtcblx0XHRcdHZpZXdlci5saXN0IFx0XHRcdCA9IHVsO1xuXHRcdFx0dmlld2VyLmRpcmVjdGlvbkFycm93ID0gZWxEaXJlY3Rpb25BcnJvdztcblx0XHRcdHZpZXdlci5kaXJlY3Rpb25MaW5lICA9IGVsRGlyZWN0aW9uTGluZTtcblx0XHRcdHZpZXdlci5ib3ggXHRcdFx0ID0gYm94O1xuXG5cblx0XHRcdGluaXRFdmVudHMoKTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCAqIE9wZW5zIFZpZXdlciBhbmRcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBvcGVuVmlld2VyKGU6IGFueSkge1xuXG5cdFx0XHRsZXQgaW5kZXg7XG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXHRcdFx0bGV0IGxpc3RJdGVtO1xuXHRcdFx0bGV0IG1haW5JbWFnZSA9IHZpZXdlci5tYWluSW1hZ2U7XG5cdFx0XHRsZXQgcHJldkJ0biA9IHZpZXdlci5wcmV2QnRuO1xuXHRcdFx0bGV0IG5leHRCdG4gPSB2aWV3ZXIubmV4dEJ0bjtcblx0XHRcdGxldCBzcmM7XG5cdFx0XHRsZXQgc3R5bGU7XG5cblx0XHRcdGNvbnRhaW5lciA9IGZpbmRBbmNlc3RvcihlLnRhcmdldCwgXCJ3YWxudXRcIilcblx0XHRcdGNvbnRhaW5lckluZGV4ID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWNvbnRhaW5lclwiKTtcblxuXHRcdFx0c2V0SW1hZ2VzKGNvbnRhaW5lckluZGV4KTtcblxuXHRcdFx0aW5kZXggPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpKTtcblxuXG5cdFx0XHRzdHlsZSA9IHRoaXMuY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMsIG51bGwpO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIExvb2tzIGZvciB0aGUgaW1hZ2Ugc291cmNlIGFuZCBpZiBub3QgZm91bmQgZ2V0IHRoZSBiYWNrZ3JvdW5kIGltYWdlXG5cdFx0XHQgKi9cblx0XHRcdGlmICh0aGlzLnNyYykge1xuXHRcdFx0XHRzcmMgPSB0aGlzLnNyY1xuXHRcdFx0fSBlbHNlIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgIT0gXCJub25lXCIpIHtcblx0XHRcdFx0c3JjID0gc3R5bGUuYmFja2dyb3VuZEltYWdlLnNsaWNlKDQsIC0xKS5yZXBsYWNlKC9cIi9nLCBcIlwiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBpbWFnZSBmb3IgZWxlbWVudDogXCIgKyB0aGlzKTtcblx0XHRcdH1cblxuXHRcdFx0bWFpbkltYWdlLnNyYyA9IHNyYztcblx0XHRcdG1haW5JbWFnZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiLCBpbmRleCk7XG5cblxuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0LS1vcGVuXCIpO1xuXG5cdFx0XHRpZihpbmRleCA9PT0gMCAmJiBpbmRleCA9PT0gY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdH0gZWxzZSBpZihpbmRleCA9PT0gMCkge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH1lbHNlIGlmKGluZGV4ID09PSAoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKSApIHtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpbml0RmxleEV2ZW50cygpO1xuXHRcdFx0Zml4Vmlld2VyKCk7XG5cblx0XHRcdHZpZXdlci53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX3dyYXBwZXItLW9wZW5cIik7XG5cblx0XHRcdGxldCBzdGF0ZU9iaiA9IFwid2FsbnV0XCI7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgXCJ3YWxudXRcIiwgXCJcIik7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRJbWFnZXMoY29udGFpbmVySW5kZXg6IGFueSkge1xuXHRcdFx0bGV0IGltZztcblx0XHRcdGxldCBsaTtcblx0XHRcdGxldCBsaXN0ID0gdmlld2VyLmxpc3Q7XG5cblx0XHRcdGxpc3QuaW5uZXJIVE1MID0gXCJcIjtcblxuXHRcdFx0aWYoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuXHRcdFx0XHRcdGxpLmNsYXNzTmFtZSA9IFwid2FsbnV0X19pdGVtXCI7XG5cdFx0XHRcdFx0bGkuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2ldLnNyYyArIFwiKVwiO1xuXHRcdFx0XHRcdGxpLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LXNvdXJjZVwiLCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2ldLnNyYyk7XG5cdFx0XHRcdFx0bGkuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpXS5pbmRleCk7XG5cblxuXHRcdFx0XHRcdGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0bGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtc291cmNlXCIpO1xuXHRcdFx0XHRcdFx0Y2hhbmdlSW1hZ2UobnVsbCx7XG5cdFx0XHRcdFx0XHRcdHNvdXJjZTogc3JjLFxuXHRcdFx0XHRcdFx0XHRpbmRleDogcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKSksXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lcjogbnVsbFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRsaXN0LmFwcGVuZENoaWxkKGxpKTtcblxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZpeExpc3RXaWR0aCgpIHtcblx0XHRcdGxldCBlbEl0ZW06IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3YWxudXRfX2l0ZW1cIilbMF07XG5cdFx0XHRsZXQgbGlzdEl0ZW06IG51bWJlciA9IGVsSXRlbS5vZmZzZXRXaWR0aDtcblx0XHRcdGxldCBlbExpc3Q6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3YWxudXRfX2xpc3RcIilbMF07XG5cdFx0XHRlbExpc3Quc3R5bGUud2lkdGggPSAoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggKiAgbGlzdEl0ZW0pICsgXCJweFwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsb3NlVmlld2VyKCkge1xuXHRcdFx0dmlld2VyLm1haW5JbWFnZS5zcmMgPSBcIlwiO1xuXHRcdFx0dmlld2VyLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fd3JhcHBlci0tb3BlblwiKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dC0tb3BlblwiKTtcblx0XHRcdGRlaW5pdEZsZXhFdmVudHMoKTtcblx0XHRcdGZ1bGxzY3JlZW4oXCJleGl0XCIpO1xuXHRcdFx0aWYgKGhpc3Rvcnkuc3RhdGUgPT09IFwid2FsbnV0XCIpIHtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoYW5nZUltYWdlKGFjdGlvbjogYW55ID0gdW5kZWZpbmVkLCBvYmplY3Q6IGFueSA9IHVuZGVmaW5lZCkge1xuXHRcdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHRcdGxldCBuZXdJbmRleCA9IDA7XG5cdFx0XHRsZXQgaW5kZXg6IG51bWJlciA9IDA7XG5cdFx0XHRsZXQgcHJldkJ0biA9IHZpZXdlci5wcmV2QnRuO1xuXHRcdFx0bGV0IG5leHRCdG4gPSB2aWV3ZXIubmV4dEJ0bjtcblx0XHRcdGxldCBtYWluSW1hZ2UgPSB2aWV3ZXIubWFpbkltYWdlO1xuXG5cdFx0XHRpZih0eXBlb2YgYWN0aW9uICE9PSBcInVuZGVmaW5lZFwiICYmIGFjdGlvbiAhPT0gbnVsbCApe1xuXHRcdFx0XHRpbmRleCA9IHBhcnNlSW50KG1haW5JbWFnZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKSk7XG5cblx0XHRcdFx0aWYoYWN0aW9uID09PSBcIm5leHRcIiAmJiBpbmRleCA8IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSl7XG5cdFx0XHRcdFx0aW5kZXggPSBpbmRleCArIDE7XG5cdFx0XHRcdH1lbHNlIGlmKGFjdGlvbiA9PT0gXCJwcmV2XCIgJiYgaW5kZXggPiAwICl7XG5cdFx0XHRcdFx0aW5kZXggPSBpbmRleCAtIDE7XG5cdFx0XHRcdH1lbHNlIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUT0RPOiBmaW5kIHJpZ2h0IGFycmF5IGlzdGVhZCBvZiAwXG5cdFx0XHRcdGlmKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXNbaW5kZXhdKXtcblx0XHRcdFx0XHRtYWluSW1hZ2Uuc3JjID0gY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpbmRleF0uc3JjO1xuXHRcdFx0XHRcdG1haW5JbWFnZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiLCBpbmRleCk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHR9IGVsc2UgaWYob2JqZWN0ICYmIG9iamVjdC5zb3VyY2Upe1xuXHRcdFx0XHRpbmRleCA9IHBhcnNlSW50KG9iamVjdC5pbmRleCk7XG5cdFx0XHRcdG1haW5JbWFnZS5zcmMgPSBvYmplY3Quc291cmNlO1xuXHRcdFx0XHRtYWluSW1hZ2Uuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgaW5kZXgpO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmKGluZGV4ID09PSAwICYmIGluZGV4ID09PSBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0fSBlbHNlIGlmKGluZGV4ID09PSAwKSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fWVsc2UgaWYoaW5kZXggPT09IChjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpICkge1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdGNoZWNrSGVpZ2h0KCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZml4Vmlld2VyKCkge1xuXHRcdFx0Y2hlY2tIZWlnaHQoKTtcblx0XHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCIud2FsbnV0X19pdGVtXCIpWzBdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0XHRcdFx0Zml4TGlzdFdpZHRoKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tIZWlnaHQoKSB7XG5cdFx0XHRsZXQgdmlld2VySGVpZ2h0ID0gdmlld2VyLmJveC5vZmZzZXRIZWlnaHQ7XG5cdFx0XHRsZXQgd3JhcHBlciA9IHZpZXdlci53cmFwcGVyO1xuXG5cdFx0XHRpZiAoIHZpZXdlckhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuXHRcdFx0XHR3cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXQtLWFsaWduLXRvcFwiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dC0tYWxpZ24tdG9wXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrS2V5UHJlc3NlZChlOiBhbnkpIHtcblx0XHRcdGxldCBrZXkgPSBlLmtleUNvZGU7XG5cdFx0XHRpZigga2V5ID09PSAzNykge1xuXHRcdFx0XHRjaGFuZ2VJbWFnZShcInByZXZcIik7XG5cdFx0XHR9IGVsc2UgaWYoa2V5ID09PSAzOSkge1xuXHRcdFx0XHRjaGFuZ2VJbWFnZShcIm5leHRcIik7XG5cdFx0XHR9IGVsc2UgaWYoa2V5ID09PSAyNykge1xuXHRcdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsaWNrV3JhcHBlcihlOiBhbnkpIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIEZJWE1FOiBzdG9wIGV2ZW50IGZyb20gYnViYmxpbmdcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gRklYTUU6IHN0b3AgZXZlbnQgZnJvbSBidWJibGluZ1xuXHRcdFx0aWYgKGUudGFyZ2V0ICE9PSB0aGlzKSB7XG5cdFx0XHQgICAgcmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y2xvc2VWaWV3ZXIuY2FsbCh0aGlzKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmdWxsc2NyZWVuKG9wdGlvbjogc3RyaW5nKSB7XG5cdFx0XHRsZXQgd3JhcHBlciBcdFx0PSB2aWV3ZXIud3JhcHBlcjtcblx0XHRcdGxldCBmdWxsc2NyZWVuQnRuIFx0PSB2aWV3ZXIuZnVsbHNjcmVlbkJ0bjtcblxuXHRcdFx0aWYob3B0aW9uID09PSBcImV4aXRcIikge1xuXHRcdFx0XHRleGl0RnVsbHNjcmVlbigpO1xuXHRcdFx0XHRmdWxsc2NyZWVuQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2Z1bGxzY3JlZW4tLWhpZGRlblwiKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGF1bmNoSW50b0Z1bGxzY3JlZW4od3JhcHBlcik7XG5cdFx0XHRcdGZ1bGxzY3JlZW5CdG4uY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZnVsbHNjcmVlbi0taGlkZGVuXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG5leHRJbWFnZSgpIHtcblx0XHRcdGNoYW5nZUltYWdlLmNhbGwodGhpcywgXCJuZXh0XCIpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHByZXZJbWFnZSgpIHtcblx0XHRcdGNoYW5nZUltYWdlLmNhbGwodGhpcywgXCJwcmV2XCIpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN3aXBlU3RhcnQoZTogYW55KSB7XG5cdFx0XHRsZXQgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0XHR0b3VjaFN0YXJ0WCA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFgpO1xuXHRcdFx0dG91Y2hTdGFydFkgPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZKTtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzd2lwZU1vdmUoZTogYW55KSB7XG5cdFx0XHRsZXQgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXHRcdFx0bGV0IHRvdWNoTW92ZVggPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRYKTtcblx0XHRcdGxldCB0b3VjaE1vdmVZID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSk7XG5cdFx0XHRsZXQgaW5kZXggPSB2aWV3ZXIubWFpbkltYWdlLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpO1xuXHRcdFx0bGV0IGRpcmVjdGlvbkxpbmUgPSB2aWV3ZXIuZGlyZWN0aW9uTGluZTtcblx0XHRcdGxldCBkaXJlY3Rpb25BcnJvdyA9IHZpZXdlci5kaXJlY3Rpb25BcnJvdztcblx0XHRcdGxldCBkaXN0WDtcblx0XHRcdGxldCBkaXN0WTtcblxuXHRcdFx0ZGlzdFggPSBNYXRoLmFicyh0b3VjaE1vdmVYIC0gdG91Y2hTdGFydFgpO1xuXHRcdFx0ZGlzdFkgPSBNYXRoLmFicyh0b3VjaE1vdmVZIC0gdG91Y2hTdGFydFkpO1xuXG5cdFx0XHRkaXJlY3Rpb25MaW5lLnN0eWxlLndpZHRoID0gNDAgKyBkaXN0WCArIFwicHhcIjtcblxuXHRcdFx0Ly8gQ2hlY2tzIGlmIHlvdSBzd2lwZSByaWdodCBvciBsZWZ0IG9yIGlmIHlvdSBzd2lwZWQgdXAgb3IgZG93biBtb3JlIHRoYW4gYWxsb3dlZCBhbmQgY2hlY2tzIGlmIHRoZXJlIGlzIG1vcmUgcGljdHVyZXMgdGhhdCB3YXlcblx0XHRcdGlmKHRvdWNoU3RhcnRYID4gdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICAmJiBpbmRleCA8IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlIHdhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjsgLy8gVE9ETzogaW5zdGVhZCBvZiByZW1vdmluZyBqdXN0IGhpZGVcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdCdG5SaWdodCk7XG5cblx0XHRcdH0gZWxzZSBpZiAodG91Y2hTdGFydFggPiB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgKSB7XG5cdFx0XHRcdC8vIHN0b3Bcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLWxlZnRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZSB3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtcmlnaHRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkFycm93LmlubmVySFRNTCA9IFwiXCI7XG5cdFx0XHRcdGRpcmVjdGlvbkFycm93LmFwcGVuZENoaWxkKGdfc3ZnQ2xvc2VCdG5GaWxsZWQpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHRvdWNoU3RhcnRYIDwgdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICYmIGluZGV4ID4gMCkge1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtcmlnaHRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZSB3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdCdG5MZWZ0KTtcblxuXHRcdFx0fSBlbHNlIGlmKHRvdWNoU3RhcnRYIDwgdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlKSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlIHdhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0Nsb3NlQnRuRmlsbGVkKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlIHdhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0IHdhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdH1cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzd2lwZUVuZChlOiBhbnkpIHtcblx0XHRcdGxldCB0b3VjaG9iaiAgID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblx0XHRcdGxldCB0b3VjaE1vdmVYID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCk7XG5cdFx0XHRsZXQgdG91Y2hNb3ZlWSA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFkpO1xuXHRcdFx0bGV0IGRpc3RZID0gTWF0aC5hYnModG91Y2hNb3ZlWSAtIHRvdWNoU3RhcnRZKTtcblx0XHRcdGxldCBkaXN0WCA9IE1hdGguYWJzKHRvdWNoTW92ZVggLSB0b3VjaFN0YXJ0WCk7XG5cdFx0XHRsZXQgZGlyZWN0aW9uTGluZSA9IHZpZXdlci5kaXJlY3Rpb25MaW5lO1xuXG5cdFx0XHR0b3VjaEVuZCA9IHRvdWNoTW92ZVg7XG5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLWxlZnRcIik7XG5cdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtcmlnaHRcIik7XG5cblx0XHRcdGlmICh0b3VjaFN0YXJ0WCA+IHRvdWNoRW5kICYmXG5cdFx0XHRcdFx0ZGlzdFggPiBtaW5Ub3VjaERpc3RhbmNlICYmXG5cdFx0XHRcdFx0ZGlzdFkgPCBhbGxvd2VkVG91Y2hEaXN0YW5jZSApIHtcblxuXHRcdFx0XHRuZXh0SW1hZ2UoKTtcblx0XHRcdH0gZWxzZSBpZiAodG91Y2hTdGFydFggPCB0b3VjaEVuZCAmJlxuXHRcdFx0XHRcdGRpc3RYID4gbWluVG91Y2hEaXN0YW5jZSAmJlxuXHRcdFx0XHRcdGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UpIHtcblxuXHRcdFx0XHRwcmV2SW1hZ2UoKTtcblx0XHRcdH0gZWxzZSBpZiAoZGlzdFkgPiAyMDApIHtcblxuXHRcdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoYW5nZUhpc3RvcnkoZXZlbnQ6IGFueSkge1xuXHRcdFx0Y2xvc2VWaWV3ZXIoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0aW5pdDogaW5pdFxuXHRcdH1cblx0fSgpKTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IHdhbG51dC5pbml0XG5cdH1cbn0pKHdpbmRvdyk7XG4iXX0=
