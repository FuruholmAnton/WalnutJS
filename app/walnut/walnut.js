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
            if (document.querySelector(".walnut__item") instanceof HTMLElement) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvd2FsbnV0L3dhbG51dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NNLE1BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFTLE1BQU07SUFDdEMsWUFBWSxDQUFDO0lBRWI7OztNQUdFO0lBQ0Ysc0JBQXVCLEVBQWUsRUFBRSxHQUFXO1FBQ2xELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNYLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7WUFBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ1YsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsQ0FBQztZQUNyRSxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7WUFDakcsQ0FBQztRQUNGLENBQUM7SUFDTCxDQUFDO0lBRUQ7UUFDQyxNQUFNLENBQU8sUUFBUyxDQUFDLGlCQUFpQjtZQUNqQyxRQUFTLENBQUMsdUJBQXVCO1lBQ2pDLFFBQVMsQ0FBQyxvQkFBb0I7WUFDOUIsUUFBUyxDQUFDLG1CQUFtQixDQUFDO0lBQ3RDLENBQUM7SUFDRCxJQUFJLG9CQUFvQixHQUFR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SSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUV4QixXQUFXLEVBQUUsQ0FBQztZQUNmLENBQUM7UUFDRixDQUFDO1FBRUQsdUJBQXVCLEtBQVU7WUFDaEMsV0FBVyxFQUFFLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxDQUFDO1lBQ04sSUFBSSxFQUFFLElBQUk7U0FDVixDQUFBO0lBQ0YsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVMLE1BQU0sQ0FBQztRQUNOLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtLQUNqQixDQUFBO0FBQ0YsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4oPGFueT53aW5kb3cpLndhbG51dCA9IChmdW5jdGlvbih3aW5kb3cpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Lypcblx0KiBMb29rcyBmb3IgdGhlIGF0dHJpYnV0ZSBmaXJzdC5cblx0KiBJZiBubyBlbGVtZW50cyBhcmUgZm91bmQgdGhlbiB0cmllcyB3aXRoIGNsYXNzTGlzdFxuXHQqL1xuXHRmdW5jdGlvbiBmaW5kQW5jZXN0b3IgKGVsOiBIVE1MRWxlbWVudCwgY2xzOiBzdHJpbmcpIHtcblx0XHRsZXQgZWxlbSA9IGVsO1xuXHQgICAgd2hpbGUgKChlbGVtID0gZWxlbS5wYXJlbnRFbGVtZW50KSAmJiAhZWxlbS5oYXNBdHRyaWJ1dGUoY2xzKSk7XG5cdCAgICBpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cdCAgICBcdHJldHVybiBlbGVtO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0ZWxlbSA9IGVsO1xuXHQgICAgXHR3aGlsZSAoKGVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQpICYmICFlbGVtLmNsYXNzTGlzdC5jb250YWlucyhjbHMpKTtcblx0ICAgIFx0aWYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXHQgICAgXHRcdHJldHVybiBlbGVtO1xuXHQgICAgXHR9IGVsc2Uge1xuXHQgICAgXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYW55IGNvbnRhaW5lciB3aXRoIGF0dHJpYnV0ZSBvciBjbGFzcyAnd2FsbnV0JyBvZiB0aGlzIGVsZW1lbnRcIik7XG5cdCAgICBcdH1cblx0ICAgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGlzRnVsbHNjcmVlbkVuYWJsZWQoKSB7XG5cdFx0cmV0dXJuICg8YW55PmRvY3VtZW50KS5mdWxsc2NyZWVuRW5hYmxlZCB8fFxuXHRcdFx0KDxhbnk+ZG9jdW1lbnQpLndlYmtpdEZ1bGxzY3JlZW5FbmFibGVkIHx8XG5cdFx0XHQoPGFueT5kb2N1bWVudCkubW96RnVsbFNjcmVlbkVuYWJsZWQgfHxcblx0XHRcdCg8YW55PmRvY3VtZW50KS5tc0Z1bGxzY3JlZW5FbmFibGVkO1xuXHR9XG5cdGxldCBsYXVuY2hJbnRvRnVsbHNjcmVlbjogYW55ID0gdW5kZWZpbmVkLFxuXHRcdGV4aXRGdWxsc2NyZWVuOiBhbnkgPSB1bmRlZmluZWQ7XG5cblx0aWYgKCEhaXNGdWxsc2NyZWVuRW5hYmxlZCgpKSB7XG5cblx0XHRsZXQgZnVsbHNjcmVlbkVuYWJsZWQgPSAoPGFueT5kb2N1bWVudCkuZnVsbHNjcmVlbkVuYWJsZWQgfHwgKDxhbnk+ZG9jdW1lbnQpLm1vekZ1bGxTY3JlZW5FbmFibGVkIHx8ICg8YW55PmRvY3VtZW50KS53ZWJraXRGdWxsc2NyZWVuRW5hYmxlZDtcblx0XHRsZXQgZnVsbHNjcmVlbkVsZW1lbnQgPSAoPGFueT5kb2N1bWVudCkuZnVsbHNjcmVlbkVsZW1lbnQgfHwgKDxhbnk+ZG9jdW1lbnQpLm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8ICg8YW55PmRvY3VtZW50KS53ZWJraXRGdWxsc2NyZWVuRWxlbWVudDtcblxuXHRcdGxhdW5jaEludG9GdWxsc2NyZWVuID0gZnVuY3Rpb24gKGVsZW1lbnQ6IGFueSkge1xuXHRcdCAgaWYoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge1xuXHRcdCAgICBlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0ICB9IGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuXHRcdCAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG5cdFx0ICB9IGVsc2UgaWYoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikge1xuXHRcdCAgICBlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0ICB9IGVsc2UgaWYoZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7XG5cdFx0ICAgIGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdCAgfVxuXHRcdH07XG5cblx0XHRleGl0RnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcblx0XHQgIGlmKCg8YW55PmRvY3VtZW50KS5leGl0RnVsbHNjcmVlbikge1xuXHRcdCAgICAoPGFueT5kb2N1bWVudCkuZXhpdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH0gZWxzZSBpZigoPGFueT5kb2N1bWVudCkubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuXHRcdCAgICAoPGFueT5kb2N1bWVudCkubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuXHRcdCAgfSBlbHNlIGlmKCg8YW55PmRvY3VtZW50KS53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xuXHRcdCAgICAoPGFueT5kb2N1bWVudCkud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogW2RvRGV2aWNlSGF2ZVRvdWNoIGRlc2NyaXB0aW9uXVxuXHQgKi9cblx0ZnVuY3Rpb24gZG9EZXZpY2VIYXZlVG91Y2goKSB7XG5cdFx0dmFyIGJvb2wgPSBmYWxzZTtcblx0ICAgIGlmICgoJ29udG91Y2hzdGFydCcgaW4gKDxhbnk+d2luZG93KSkgfHwgKDxhbnk+d2luZG93KS5Eb2N1bWVudFRvdWNoKSB7XG5cdCAgICAgIGJvb2wgPSB0cnVlO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGJvb2w7XG5cdH1cblxuXHQvKipcblx0ICogT24gUmVzaXplRXZlbnQgZnVuY3Rpb25cblx0ICovXG5cdGZ1bmN0aW9uIHJlc2l6ZUV2ZW50KGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIGFjdGlvbjogc3RyaW5nID0gdW5kZWZpbmVkKSB7XG5cdFx0aWYoYWN0aW9uID09PSBcInJlbW92ZVwiKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2FsbGJhY2ssIHRydWUpO1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBjYWxsYmFjayk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGNhbGxiYWNrKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVXNlIFNWRyBhcyBpbmxpbmUgSmF2YVNjcmlwdFxuXHQgKi9cblx0Y29uc3Qgc3ZnQ2xvc2VCdG4gPSAnPHN2ZyBjbGFzcz1cIndhbG51dC1jbG9zZVwiIHZpZXdCb3g9XCIwIDAgODAwIDgwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxLjRcIj48cGF0aCBjbGFzcz1cIndhbG51dC1jbG9zZV9fcGF0aFwiIGZpbGw9XCIjZmZmXCIgZD1cIk0yMS42IDYxLjZsMzguOC0zOUw3NzUgNzM3LjNsLTM5IDM5elwiLz48cGF0aCBjbGFzcz1cIndhbG51dC1jbG9zZV9fcGF0aFwiIGZpbGw9XCIjZmZmXCIgZD1cIk0yMS42IDYxLjZsMzguOC0zOUw3NzUgNzM3LjNsLTM5IDM5elwiLz48cGF0aCBjbGFzcz1cIndhbG51dC1jbG9zZV9fcGF0aFwiIGZpbGw9XCIjZmZmXCIgZD1cIk0yLjggODAuNEw4MC4zIDNsNzE0LjQgNzE0LjMtNzcuNSA3Ny41elwiLz48cGF0aCBjbGFzcz1cIndhbG51dC1jbG9zZV9fcGF0aFwiIGZpbGw9XCIjZmZmXCIgZD1cIk03OTcuNyA4Mi41TDcxNy4yIDIgMi44IDcxNi40IDgzLjIgNzk3elwiLz48L3N2Zz4nO1xuXHRjb25zdCBzdmdDbG9zZUJ0bkZpbGxlZCA9ICc8c3ZnIHZpZXdCb3g9XCIwIDAgODAwIDgwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxLjRcIj48cGF0aCBkPVwiTTQwMCA3LjJjMjE5LjQgMCAzOTcuNiAxNzYuMyAzOTcuNiAzOTMuNVM2MTkuNCA3OTQuMyA0MDAgNzk0LjNDMTgwLjYgNzk0LjMgMi40IDYxOCAyLjQgNDAwLjcgMi40IDE4My41IDE4MC42IDcuMiA0MDAgNy4yem0tNDguMiAzODlMMTUzLjIgNTk1bDUwLjIgNTAuMkw0MDIgNDQ2LjUgNTk5LjQgNjQ0bDQ4LjQtNDguNUw0NTAuNSAzOThsMTk5LjItMTk5LTUwLjItNTAuNEw0MDAuMiAzNDggMjAxLjUgMTQ5IDE1MyAxOTcuNiAzNTIgMzk2LjN6XCIgZmlsbD1cIiNmZmZcIi8+PC9zdmc+Jztcblx0Y29uc3Qgc3ZnRnVsbHNjcmVlbkJ0biA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0X19mdWxsc2NyZWVuXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxLjRcIj48cGF0aCBkPVwiTTMuNCAxNS40SDBWMjRoOC42di0zLjRIMy40di01LjJ6TTAgOC42aDMuNFYzLjRoNS4yVjBIMHY4LjZ6bTIwLjYgMTJoLTUuMlYyNEgyNHYtOC42aC0zLjR2NS4yek0xNS40IDB2My40aDUuMnY1LjJIMjRWMGgtOC42elwiIGZpbGw9XCIjZmZmXCIgZmlsbC1ydWxlPVwibm9uemVyb1wiLz48L3N2Zz4nO1xuXHRjb25zdCBzdmdCdG5MZWZ0ID0gJzxzdmcgY2xhc3M9XCJ3YWxudXRfX25hdmlnYXRpb24taW1nXCIgdmlld0JveD1cIjAgMCA0NSA0NVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxLjQxXCI+PGcgZmlsbD1cIiNmZmZcIiBmaWxsLXJ1bGU9XCJub256ZXJvXCI+PHBhdGggZD1cIk0yMi4xMiA0NC4yNGMxMi4yIDAgMjIuMTItOS45MyAyMi4xMi0yMi4xMkM0NC4yNCA5LjkyIDM0LjMgMCAyMi4xMiAwIDkuOTIgMCAwIDkuOTIgMCAyMi4xMmMwIDEyLjIgOS45MiAyMi4xMiAyMi4xMiAyMi4xMnptMC00Mi43NGMxMS4zNyAwIDIwLjYyIDkuMjUgMjAuNjIgMjAuNjIgMCAxMS4zNy05LjI1IDIwLjYyLTIwLjYyIDIwLjYyLTExLjM3IDAtMjAuNjItOS4yNS0yMC42Mi0yMC42MkMxLjUgMTAuNzUgMTAuNzUgMS41IDIyLjEyIDEuNXpcIi8+PHBhdGggZD1cIk0yNC45IDI5Ljg4Yy4yIDAgLjM4LS4wNy41Mi0uMjIuMy0uMy4zLS43NiAwLTEuMDZsLTYuOC02LjggNi44LTYuOGMuMy0uMy4zLS43NyAwLTEuMDYtLjMtLjMtLjc2LS4zLTEuMDYgMGwtNy4zMiA3LjMzYy0uMy4zLS4zLjc3IDAgMS4wNmw3LjMyIDcuMzNjLjE1LjE1LjM0LjIyLjUzLjIyelwiLz48L2c+PC9zdmc+Jztcblx0Y29uc3Qgc3ZnQnRuUmlnaHQgPSAnPHN2ZyBjbGFzcz1cIndhbG51dF9fbmF2aWdhdGlvbi1pbWdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA0NC4yMzYgNDQuMjM2XCI+PGcgZmlsbD1cIiNGRkZcIj48cGF0aCBkPVwiTTIyLjEyIDQ0LjI0QzkuOTIgNDQuMjQgMCAzNC4zIDAgMjIuMTJTOS45MiAwIDIyLjEyIDBzMjIuMTIgOS45MiAyMi4xMiAyMi4xMi05LjkzIDIyLjEyLTIyLjEyIDIyLjEyem0wLTQyLjc0QzEwLjc1IDEuNSAxLjUgMTAuNzUgMS41IDIyLjEyYzAgMTEuMzcgOS4yNSAyMC42MiAyMC42MiAyMC42MiAxMS4zNyAwIDIwLjYyLTkuMjUgMjAuNjItMjAuNjIgMC0xMS4zNy05LjI1LTIwLjYyLTIwLjYyLTIwLjYyelwiLz48cGF0aCBkPVwiTTE5LjM0IDI5Ljg4Yy0uMiAwLS4zOC0uMDctLjUzLS4yMi0uMjgtLjMtLjI4LS43NiAwLTEuMDZsNi44LTYuOC02LjgtNi44Yy0uMjgtLjMtLjI4LS43NyAwLTEuMDcuMy0uMy43OC0uMyAxLjA3IDBsNy4zMyA3LjM0Yy4zLjMuMy43NyAwIDEuMDZsLTcuMzMgNy4zM2MtLjE0LjE1LS4zNC4yMi0uNTMuMjJ6XCIvPjwvZz48L3N2Zz4nO1xuXG5cdGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcblx0Y29uc3QgZ19zdmdDbG9zZUJ0biA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnQ2xvc2VCdG4sIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQ7XG5cdGNvbnN0IGdfc3ZnQ2xvc2VCdG5GaWxsZWQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0Nsb3NlQnRuRmlsbGVkLCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50O1xuXHRjb25zdCBnX3N2Z0Z1bGxzY3JlZW5CdG4gPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0Z1bGxzY3JlZW5CdG4sIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQ7XG5cdGNvbnN0IGdfc3ZnQnRuTGVmdCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnQnRuTGVmdCwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudDtcblx0Y29uc3QgZ19zdmdCdG5SaWdodCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnQnRuUmlnaHQsIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQ7XG5cblx0LyoqXG5cdCAqIFt3YWxudXQgZGVzY3JpcHRpb25dXG5cdCAqL1xuXHRjb25zdCB3YWxudXQgPSAoZnVuY3Rpb24oKSB7XG5cblx0XHQvKiBHbG9iYWxzIHdpdGhpbiB3YWxudXQgKi9cblx0XHRsZXQgcGF0aDtcblx0XHRsZXQgcGF0aEFycmF5O1xuXHRcdGxldCBwYXRoTWlkZGxlO1xuXHRcdGxldCBuZXdQYXRobmFtZTtcblx0XHRsZXQgaTtcblx0XHRsZXQgbmF2aWdhdGlvbkJ1dHRvbnM7XG5cdFx0bGV0IGNvbnRhaW5lckluZGV4OiBzdHJpbmc7XG5cblx0XHRsZXQgQ09OVEFJTkVSUzogYW55ID0gW107XG5cdFx0bGV0IGNvbnRhaW5lckFycmF5OiBhbnkgPSBbXTtcblx0XHRsZXQgdmlld2VyOiBhbnkgPSB7fTtcblx0XHRsZXQgY29uZmlnOiBhbnkgPSB7fTtcblx0XHRsZXQgdG91Y2hTdGFydDogbnVtYmVyID0gMDtcblx0XHRsZXQgdG91Y2hTdGFydFg6IG51bWJlciA9IDA7XG5cdFx0bGV0IHRvdWNoU3RhcnRZOiBudW1iZXIgPSAwO1xuXHRcdGxldCB0b3VjaEVuZDogbnVtYmVyID0gMDtcblxuXHRcdGNvbnN0IGFsbG93ZWRUb3VjaERpc3RhbmNlOiBudW1iZXIgPSAxMDA7XG5cdFx0Y29uc3QgbWluVG91Y2hEaXN0YW5jZTogbnVtYmVyID0gMjA7XG5cblxuXHRcdGNvbnN0IHV0aWxzID0ge1xuXHRcdFx0Z2V0Q29udGFpbmVyczpmdW5jdGlvbigpIHtcblx0XHRcdFx0bGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3dhbG51dF0nKTtcblx0XHRcdFx0aWYgKGVsZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbXM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3YWxudXQnKTtcblx0XHRcdFx0XHRpZiAoZWxlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1zO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJDb3VsZG4ndCBmaW5kIGFueSBjb250YWluZXJzIGZvciBcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0b25jZTpmdW5jdGlvbihmbjogYW55LCBjb250ZXh0OiBhbnkgPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gZnVuY3Rpb24gY2FuIG9ubHkgZmlyZSBvbmNlXG5cdFx0XHRcdGxldCByZXN1bHQ6IGFueTtcblxuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYoZm4pIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQgfHwgdGhpcywgYXJndW1lbnRzKTtcblx0XHRcdFx0XHRcdGZuID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRsZXQgbmV3UGF0aDtcblxuXHRcdFx0Q09OVEFJTkVSUyA9IHV0aWxzLmdldENvbnRhaW5lcnMoKTtcblxuXHRcdFx0Ly8gYWRkQ1NTTGluaygpO1xuXHRcdFx0aW5kZXhJbWFnZXMoKTtcblx0XHRcdGJ1aWxkVmlld2VyKCk7XG5cblx0XHRcdGlmIChkb0RldmljZUhhdmVUb3VjaCgpKSB7XG5cdFx0XHRcdHZpZXdlci53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXQtLWlzLXRvdWNoXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0ICogQWRkcyBhbmQgcmVtb3ZlcyBldmVudCBvbiBvcGVuIGFuZCBjbG9zZVxuXHRcdCAqIFJFVklFVzogQWRkIG9uY2UgYW5kIGRvbnQgcmVtb3ZlLiBwcmVmb3JtYW5jZSBiZW5lZml0cz9cblx0XHQgKi9cblx0XHRjb25zdCBpbml0RXZlbnRzID0gdXRpbHMub25jZShmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IG1haW5JbWFnZSA9IHZpZXdlci5tYWluSW1hZ2U7XG5cdFx0XHR2aWV3ZXIud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tXcmFwcGVyKTtcblx0XHRcdHZpZXdlci5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VWaWV3ZXIpO1xuXHRcdFx0dmlld2VyLmZ1bGxzY3JlZW5CdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bGxzY3JlZW4pO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGNoZWNrS2V5UHJlc3NlZCk7XG5cblx0XHRcdGlmIChkb0RldmljZUhhdmVUb3VjaCgpKSB7XG5cdFx0XHRcdG1haW5JbWFnZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBzd2lwZVN0YXJ0KTtcblx0XHRcdFx0bWFpbkltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBzd2lwZUVuZCk7XG5cdFx0XHRcdG1haW5JbWFnZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHN3aXBlTW92ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2aWV3ZXIubmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbmV4dEltYWdlKTtcblx0XHRcdFx0dmlld2VyLnByZXZCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHByZXZJbWFnZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBpbml0RmxleEV2ZW50cygpIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBjaGVja0tleVByZXNzZWQpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBjaGFuZ2VIaXN0b3J5KTtcblx0XHRcdHJlc2l6ZUV2ZW50KGZpeFZpZXdlcik7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGRlaW5pdEZsZXhFdmVudHMoKSB7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgY2hlY2tLZXlQcmVzc2VkKTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgY2hhbmdlSGlzdG9yeSk7XG5cdFx0XHRyZXNpemVFdmVudChmaXhWaWV3ZXIsIFwicmVtb3ZlXCIpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEluZGV4ZXMgYXMgaW1hZ2VzIHNvIHJlbGF0ZWQgaW1hZ2VzIHdpbGwgc2hvdyBhcyB0aHVtYm5haWxzIHdoZW4gb3BlbmluZyB0aGUgdmlld2VyXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gaW5kZXhJbWFnZXMoKXtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgQ09OVEFJTkVSUy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHRcdGNvbnRhaW5lckFycmF5LnB1c2goe1xuXHRcdFx0XHRcdGNvbnRhaW5lcjogQ09OVEFJTkVSU1tpXSxcblx0XHRcdFx0XHRpbWFnZXM6IFtdXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdENPTlRBSU5FUlNbaV0uc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtY29udGFpbmVyXCIsIGkpO1xuXG5cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIFB1dHMgaW1hZ2VzIGluIGEgYXJyYXkuIEZpbmRzIGFsbCBpbWFnZXMgd2l0aCBlaXRoZXI6XG5cdFx0XHRcdCAqIENMQVNTIG9yIEFUVFJJQlVURSB3aXRoIFwid2FsbnV0LWltYWdlXCJcblx0XHRcdFx0ICogSWYgbmVpdGhlciBpcyBmb3VuZCB0aGVuIGl0IHdpbGwgbG9vayBmb3IgYWxsIDxpbWc+IHRhZ3Ncblx0XHRcdFx0ICpcblx0XHRcdFx0ICovXG5cdFx0XHRcdGxldCBpbWcgPSBDT05UQUlORVJTW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpO1xuXHRcdFx0XHRsZXQgYmdPbGQgPSBDT05UQUlORVJTW2ldLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3YWxudXQtaW1hZ2VcIik7XG5cdFx0XHRcdGxldCBiZyA9IENPTlRBSU5FUlNbaV0ucXVlcnlTZWxlY3RvckFsbCgnW3dhbG51dC1pbWFnZV0nKTtcblx0XHRcdFx0bGV0IGltYWdlcyA9IFtdO1xuXG5cdFx0XHRcdGlmIChiZ09sZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGJnT2xkLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdFx0XHRpbWFnZXMucHVzaChiZ09sZFt4XSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChiZy5sZW5ndGgpIHtcblx0XHRcdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGJnLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdFx0XHRpbWFnZXMucHVzaChiZ1t4XSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghYmdPbGQubGVuZ3RoICYmICFiZy5sZW5ndGggJiYgaW1nICkge1xuXHRcdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgaW1nLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdFx0XHRpbWFnZXMucHVzaChpbWdbeF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBpbWFnZXMubGVuZ3RoOyBqKyspIHtcblxuXHRcdFx0XHRcdGltYWdlc1tqXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb3BlblZpZXdlcik7XG5cblx0XHRcdFx0XHRpbWFnZXNbal0uc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgaik7XG5cblx0XHRcdFx0XHRsZXQgc3JjO1xuXG5cdFx0XHRcdFx0aWYoaW1hZ2VzW2pdLnNyYykge1xuXHRcdFx0XHRcdFx0c3JjID0gaW1hZ2VzW2pdLnNyY1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXQgc3R5bGUgPSBpbWFnZXNbal0uY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGltYWdlc1tqXSwgbnVsbCk7XG5cdFx0XHRcdFx0XHRzcmMgPSBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2Uuc2xpY2UoNCwgLTEpLnJlcGxhY2UoL1wiL2csIFwiXCIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnRhaW5lckFycmF5W2ldLmltYWdlcy5wdXNoKHtcblx0XHRcdFx0XHRcdGVsZW06IGltYWdlc1tqXSxcblx0XHRcdFx0XHRcdHNyYzogc3JjLFxuXHRcdFx0XHRcdFx0aW5kZXg6IGpcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlcyBFbGVtZW50cyB0aGF0IGJ1aWxkcyB1cCB0aGUgdmlld2VyXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gYnVpbGRWaWV3ZXIoKSB7XG5cdFx0XHRjb25zdCB1bCBcdFx0XHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdFx0XHRjb25zdCBsaXN0Q29udGFpbmVyIFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjb25zdCB3cmFwcGVyIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdGNvbnN0IGJveCAgXHRcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjb25zdCBtYWluSW1hZ2UgXHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXHRcdFx0Y29uc3QgbWFpbkltYWdlQ29udGFpbmVyIFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y29uc3QgbmV4dEJ0biBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjb25zdCBwcmV2QnRuIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdGNvbnN0IGNsb3NlQnRuIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0XHRcdGNvbnN0IGVsRGlyZWN0aW9uQXJyb3cgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y29uc3QgZWxEaXJlY3Rpb25MaW5lICAgIFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIEFkZCBDU1MgY2xhc3NlcyB0byB0aGUgZWxlbWVudHNcblx0XHRcdCAqL1xuXHRcdFx0dWwuY2xhc3NOYW1lIFx0XHRcdFx0XHQ9IFwid2FsbnV0X19saXN0XCI7XG5cdFx0XHRsaXN0Q29udGFpbmVyLmNsYXNzTmFtZSBcdFx0PSBcIndhbG51dF9fbGlzdC1jb250YWluZXJcIjtcblx0XHRcdG1haW5JbWFnZS5jbGFzc05hbWUgXHRcdFx0PSBcIndhbG51dF9faW1hZ2VcIjtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5jbGFzc05hbWUgXHQ9IFwid2FsbnV0X19pbWFnZS1jb250YWluZXJcIlxuXHRcdFx0Ym94LmNsYXNzTmFtZSBcdFx0XHRcdFx0PSBcIndhbG51dF9fYm94XCI7XG5cdFx0XHR3cmFwcGVyLmNsYXNzTmFtZSBcdFx0XHRcdD0gXCJ3YWxudXRfX3dyYXBwZXJcIjtcblx0XHRcdC8vIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwidHJ1ZVwiKTtcblx0XHRcdG5leHRCdG4uY2xhc3NOYW1lIFx0XHRcdFx0PSBcIndhbG51dF9fbmF2aWdhdGlvbiB3YWxudXRfX25hdmlnYXRpb24tLW5leHRcIjtcblx0XHRcdHByZXZCdG4uY2xhc3NOYW1lIFx0XHRcdFx0PSBcIndhbG51dF9fbmF2aWdhdGlvbiB3YWxudXRfX25hdmlnYXRpb24tLXByZXZcIjtcblx0XHRcdGVsRGlyZWN0aW9uQXJyb3cuY2xhc3NOYW1lIFx0XHQ9IFwid2FsbnV0X19kaXJlY3Rpb24tYXJyb3dcIjtcblx0XHRcdGVsRGlyZWN0aW9uTGluZS5jbGFzc05hbWUgXHRcdD0gXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lXCI7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ29ubmVjdHMgdGhlIEVsZW1lbnRzIGFuZCBjcmVhdGVzIHRoZSBzdHJ1Y3R1cmVcblx0XHRcdCAqL1xuXHRcdFx0bmV4dEJ0bi5hcHBlbmRDaGlsZChnX3N2Z0J0blJpZ2h0KTtcblx0XHRcdHByZXZCdG4uYXBwZW5kQ2hpbGQoZ19zdmdCdG5MZWZ0KTtcblx0XHRcdGVsRGlyZWN0aW9uTGluZS5hcHBlbmRDaGlsZChlbERpcmVjdGlvbkFycm93KTtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChtYWluSW1hZ2UpO1xuXHRcdFx0bWFpbkltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKG5leHRCdG4pO1xuXHRcdFx0bWFpbkltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZCdG4pO1xuXHRcdFx0bWFpbkltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsRGlyZWN0aW9uTGluZSk7XG5cdFx0XHRsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcblx0XHRcdGJveC5hcHBlbmRDaGlsZChtYWluSW1hZ2VDb250YWluZXIpO1xuXHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChsaXN0Q29udGFpbmVyKTtcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoZ19zdmdDbG9zZUJ0bik7XG5cdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGJveCk7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkIEZ1bGxzY3JlZW4gYnV0dG9uIHdoZW4gbm90IGluIGZ1bGxzY3JlZW4gbW9kZVxuXHRcdFx0ICovXG5cdFx0XHRpZighIWlzRnVsbHNjcmVlbkVuYWJsZWQoKSkge1xuXHRcdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGdfc3ZnRnVsbHNjcmVlbkJ0bik7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogTWFrZSB2YXJpYWJsZXMgZ2xvYmFsIGZvciB3YWxudXRcblx0XHRcdCAqL1xuXHRcdFx0dmlld2VyLmNsb3NlQnRuXHRcdCA9IGdfc3ZnQ2xvc2VCdG47XG5cdFx0XHR2aWV3ZXIubmV4dEJ0biBcdFx0ID0gbmV4dEJ0bjtcblx0XHRcdHZpZXdlci5wcmV2QnRuIFx0XHQgPSBwcmV2QnRuO1xuXHRcdFx0dmlld2VyLmZ1bGxzY3JlZW5CdG4gID0gZ19zdmdGdWxsc2NyZWVuQnRuO1xuXHRcdFx0dmlld2VyLm1haW5JbWFnZSBcdCA9IG1haW5JbWFnZTtcblx0XHRcdHZpZXdlci53cmFwcGVyIFx0XHQgPSB3cmFwcGVyO1xuXHRcdFx0dmlld2VyLmxpc3QgXHRcdFx0ID0gdWw7XG5cdFx0XHR2aWV3ZXIuZGlyZWN0aW9uQXJyb3cgPSBlbERpcmVjdGlvbkFycm93O1xuXHRcdFx0dmlld2VyLmRpcmVjdGlvbkxpbmUgID0gZWxEaXJlY3Rpb25MaW5lO1xuXHRcdFx0dmlld2VyLmJveCBcdFx0XHQgPSBib3g7XG5cblxuXHRcdFx0aW5pdEV2ZW50cygpO1xuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0ICogT3BlbnMgVmlld2VyIGFuZFxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG9wZW5WaWV3ZXIoZTogYW55KSB7XG5cblx0XHRcdGxldCBpbmRleDtcblx0XHRcdGxldCBjb250YWluZXI7XG5cdFx0XHRsZXQgbGlzdEl0ZW07XG5cdFx0XHRsZXQgbWFpbkltYWdlID0gdmlld2VyLm1haW5JbWFnZTtcblx0XHRcdGxldCBwcmV2QnRuID0gdmlld2VyLnByZXZCdG47XG5cdFx0XHRsZXQgbmV4dEJ0biA9IHZpZXdlci5uZXh0QnRuO1xuXHRcdFx0bGV0IHNyYztcblx0XHRcdGxldCBzdHlsZTtcblxuXHRcdFx0Y29udGFpbmVyID0gZmluZEFuY2VzdG9yKGUudGFyZ2V0LCBcIndhbG51dFwiKVxuXHRcdFx0Y29udGFpbmVySW5kZXggPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtY29udGFpbmVyXCIpO1xuXG5cdFx0XHRzZXRJbWFnZXMoY29udGFpbmVySW5kZXgpO1xuXG5cdFx0XHRpbmRleCA9IHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIikpO1xuXG5cblx0XHRcdHN0eWxlID0gdGhpcy5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcywgbnVsbCk7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogTG9va3MgZm9yIHRoZSBpbWFnZSBzb3VyY2UgYW5kIGlmIG5vdCBmb3VuZCBnZXQgdGhlIGJhY2tncm91bmQgaW1hZ2Vcblx0XHRcdCAqL1xuXHRcdFx0aWYgKHRoaXMuc3JjKSB7XG5cdFx0XHRcdHNyYyA9IHRoaXMuc3JjXG5cdFx0XHR9IGVsc2UgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAhPSBcIm5vbmVcIikge1xuXHRcdFx0XHRzcmMgPSBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2Uuc2xpY2UoNCwgLTEpLnJlcGxhY2UoL1wiL2csIFwiXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIGltYWdlIGZvciBlbGVtZW50OiBcIiArIHRoaXMpO1xuXHRcdFx0fVxuXG5cdFx0XHRtYWluSW1hZ2Uuc3JjID0gc3JjO1xuXHRcdFx0bWFpbkltYWdlLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGluZGV4KTtcblxuXG5cdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJ3YWxudXQtLW9wZW5cIik7XG5cblx0XHRcdGlmKGluZGV4ID09PSAwICYmIGluZGV4ID09PSBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0fSBlbHNlIGlmKGluZGV4ID09PSAwKSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fWVsc2UgaWYoaW5kZXggPT09IChjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpICkge1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdGluaXRGbGV4RXZlbnRzKCk7XG5cdFx0XHRmaXhWaWV3ZXIoKTtcblxuXHRcdFx0dmlld2VyLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fd3JhcHBlci0tb3BlblwiKTtcblxuXHRcdFx0bGV0IHN0YXRlT2JqID0gXCJ3YWxudXRcIjtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKHN0YXRlT2JqLCBcIndhbG51dFwiLCBcIlwiKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNldEltYWdlcyhjb250YWluZXJJbmRleDogYW55KSB7XG5cdFx0XHRsZXQgaW1nO1xuXHRcdFx0bGV0IGxpO1xuXHRcdFx0bGV0IGxpc3QgPSB2aWV3ZXIubGlzdDtcblxuXHRcdFx0bGlzdC5pbm5lckhUTUwgPSBcIlwiO1xuXG5cdFx0XHRpZihjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0bGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG5cdFx0XHRcdFx0bGkuY2xhc3NOYW1lID0gXCJ3YWxudXRfX2l0ZW1cIjtcblx0XHRcdFx0XHRsaS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXNbaV0uc3JjICsgXCIpXCI7XG5cdFx0XHRcdFx0bGkuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtc291cmNlXCIsIGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXNbaV0uc3JjKTtcblx0XHRcdFx0XHRsaS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiLCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2ldLmluZGV4KTtcblxuXG5cdFx0XHRcdFx0bGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRsZXQgc3JjID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1zb3VyY2VcIik7XG5cdFx0XHRcdFx0XHRjaGFuZ2VJbWFnZShudWxsLHtcblx0XHRcdFx0XHRcdFx0c291cmNlOiBzcmMsXG5cdFx0XHRcdFx0XHRcdGluZGV4OiBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpKSxcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyOiBudWxsXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGxpc3QuYXBwZW5kQ2hpbGQobGkpO1xuXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZml4TGlzdFdpZHRoKCkge1xuXHRcdFx0bGV0IGVsSXRlbTogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIndhbG51dF9faXRlbVwiKVswXTtcblx0XHRcdGxldCBsaXN0SXRlbTogbnVtYmVyID0gZWxJdGVtLm9mZnNldFdpZHRoO1xuXHRcdFx0bGV0IGVsTGlzdDogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIndhbG51dF9fbGlzdFwiKVswXTtcblx0XHRcdGVsTGlzdC5zdHlsZS53aWR0aCA9IChjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAqICBsaXN0SXRlbSkgKyBcInB4XCI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2xvc2VWaWV3ZXIoKSB7XG5cdFx0XHR2aWV3ZXIubWFpbkltYWdlLnNyYyA9IFwiXCI7XG5cdFx0XHR2aWV3ZXIud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X193cmFwcGVyLS1vcGVuXCIpO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0LS1vcGVuXCIpO1xuXHRcdFx0ZGVpbml0RmxleEV2ZW50cygpO1xuXHRcdFx0ZnVsbHNjcmVlbihcImV4aXRcIik7XG5cdFx0XHRpZiAoaGlzdG9yeS5zdGF0ZSA9PT0gXCJ3YWxudXRcIikge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlSW1hZ2UoYWN0aW9uOiBhbnksIG9iamVjdDogYW55ID0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcInVzZSBzdHJpY3RcIjtcblxuXHRcdFx0bGV0IG5ld0luZGV4ID0gMDtcblx0XHRcdGxldCBpbmRleDogbnVtYmVyID0gMDtcblx0XHRcdGxldCBwcmV2QnRuID0gdmlld2VyLnByZXZCdG47XG5cdFx0XHRsZXQgbmV4dEJ0biA9IHZpZXdlci5uZXh0QnRuO1xuXHRcdFx0bGV0IG1haW5JbWFnZSA9IHZpZXdlci5tYWluSW1hZ2U7XG5cblx0XHRcdGlmKHR5cGVvZiBhY3Rpb24gIT09IFwidW5kZWZpbmVkXCIgJiYgYWN0aW9uICE9PSBudWxsICl7XG5cdFx0XHRcdGluZGV4ID0gcGFyc2VJbnQobWFpbkltYWdlLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpKTtcblxuXHRcdFx0XHRpZihhY3Rpb24gPT09IFwibmV4dFwiICYmIGluZGV4IDwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKXtcblx0XHRcdFx0XHRpbmRleCA9IGluZGV4ICsgMTtcblx0XHRcdFx0fWVsc2UgaWYoYWN0aW9uID09PSBcInByZXZcIiAmJiBpbmRleCA+IDAgKXtcblx0XHRcdFx0XHRpbmRleCA9IGluZGV4IC0gMTtcblx0XHRcdFx0fWVsc2Uge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRPRE86IGZpbmQgcmlnaHQgYXJyYXkgaXN0ZWFkIG9mIDBcblx0XHRcdFx0aWYoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpbmRleF0pe1xuXHRcdFx0XHRcdG1haW5JbWFnZS5zcmMgPSBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2luZGV4XS5zcmM7XG5cdFx0XHRcdFx0bWFpbkltYWdlLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGluZGV4KTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdH0gZWxzZSBpZihvYmplY3QgJiYgb2JqZWN0LnNvdXJjZSl7XG5cdFx0XHRcdGluZGV4ID0gcGFyc2VJbnQob2JqZWN0LmluZGV4KTtcblx0XHRcdFx0bWFpbkltYWdlLnNyYyA9IG9iamVjdC5zb3VyY2U7XG5cdFx0XHRcdG1haW5JbWFnZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiLCBpbmRleCk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYoaW5kZXggPT09IDAgJiYgaW5kZXggPT09IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHR9IGVsc2UgaWYoaW5kZXggPT09IDApIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9ZWxzZSBpZihpbmRleCA9PT0gKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkgKSB7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH1cblxuXHRcdFx0Y2hlY2tIZWlnaHQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmaXhWaWV3ZXIoKSB7XG5cdFx0XHRjaGVja0hlaWdodCgpO1xuXHRcdFx0aWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53YWxudXRfX2l0ZW1cIikgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXHRcdFx0XHRmaXhMaXN0V2lkdGgoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjaGVja0hlaWdodCgpIHtcblx0XHRcdGxldCB2aWV3ZXJIZWlnaHQgPSB2aWV3ZXIuYm94Lm9mZnNldEhlaWdodDtcblx0XHRcdGxldCB3cmFwcGVyID0gdmlld2VyLndyYXBwZXI7XG5cblx0XHRcdGlmICggdmlld2VySGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG5cdFx0XHRcdHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcIndhbG51dC0tYWxpZ24tdG9wXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0LS1hbGlnbi10b3BcIik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tLZXlQcmVzc2VkKGU6IGFueSkge1xuXHRcdFx0bGV0IGtleSA9IGUua2V5Q29kZTtcblx0XHRcdGlmKCBrZXkgPT09IDM3KSB7XG5cdFx0XHRcdGNoYW5nZUltYWdlKFwicHJldlwiKTtcblx0XHRcdH0gZWxzZSBpZihrZXkgPT09IDM5KSB7XG5cdFx0XHRcdGNoYW5nZUltYWdlKFwibmV4dFwiKTtcblx0XHRcdH0gZWxzZSBpZihrZXkgPT09IDI3KSB7XG5cdFx0XHRcdGNsb3NlVmlld2VyKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2xpY2tXcmFwcGVyKGU6IGFueSkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTsgLy8gRklYTUU6IHN0b3AgZXZlbnQgZnJvbSBidWJibGluZ1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBGSVhNRTogc3RvcCBldmVudCBmcm9tIGJ1YmJsaW5nXG5cdFx0XHRpZiAoZS50YXJnZXQgIT09IHRoaXMpIHtcblx0XHRcdCAgICByZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjbG9zZVZpZXdlci5jYWxsKHRoaXMpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZ1bGxzY3JlZW4ob3B0aW9uOiBzdHJpbmcpIHtcblx0XHRcdGxldCB3cmFwcGVyIFx0XHQ9IHZpZXdlci53cmFwcGVyO1xuXHRcdFx0bGV0IGZ1bGxzY3JlZW5CdG4gXHQ9IHZpZXdlci5mdWxsc2NyZWVuQnRuO1xuXG5cdFx0XHRpZihvcHRpb24gPT09IFwiZXhpdFwiKSB7XG5cdFx0XHRcdGV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0XHRcdGZ1bGxzY3JlZW5CdG4uY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZnVsbHNjcmVlbi0taGlkZGVuXCIpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsYXVuY2hJbnRvRnVsbHNjcmVlbih3cmFwcGVyKTtcblx0XHRcdFx0ZnVsbHNjcmVlbkJ0bi5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19mdWxsc2NyZWVuLS1oaWRkZW5cIik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbmV4dEltYWdlKCkge1xuXHRcdFx0Y2hhbmdlSW1hZ2UuY2FsbCh0aGlzLCBcIm5leHRcIik7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcHJldkltYWdlKCkge1xuXHRcdFx0Y2hhbmdlSW1hZ2UuY2FsbCh0aGlzLCBcInByZXZcIik7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc3dpcGVTdGFydChlOiBhbnkpIHtcblx0XHRcdGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cblx0XHRcdHRvdWNoU3RhcnRYID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCk7XG5cdFx0XHR0b3VjaFN0YXJ0WSA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFkpO1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN3aXBlTW92ZShlOiBhbnkpIHtcblx0XHRcdGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cdFx0XHRsZXQgdG91Y2hNb3ZlWCA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFgpO1xuXHRcdFx0bGV0IHRvdWNoTW92ZVkgPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZKTtcblx0XHRcdGxldCBpbmRleCA9IHZpZXdlci5tYWluSW1hZ2UuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIik7XG5cdFx0XHRsZXQgZGlyZWN0aW9uTGluZSA9IHZpZXdlci5kaXJlY3Rpb25MaW5lO1xuXHRcdFx0bGV0IGRpcmVjdGlvbkFycm93ID0gdmlld2VyLmRpcmVjdGlvbkFycm93O1xuXHRcdFx0bGV0IGRpc3RYO1xuXHRcdFx0bGV0IGRpc3RZO1xuXG5cdFx0XHRkaXN0WCA9IE1hdGguYWJzKHRvdWNoTW92ZVggLSB0b3VjaFN0YXJ0WCk7XG5cdFx0XHRkaXN0WSA9IE1hdGguYWJzKHRvdWNoTW92ZVkgLSB0b3VjaFN0YXJ0WSk7XG5cblx0XHRcdGRpcmVjdGlvbkxpbmUuc3R5bGUud2lkdGggPSA0MCArIGRpc3RYICsgXCJweFwiO1xuXG5cdFx0XHQvLyBDaGVja3MgaWYgeW91IHN3aXBlIHJpZ2h0IG9yIGxlZnQgb3IgaWYgeW91IHN3aXBlZCB1cCBvciBkb3duIG1vcmUgdGhhbiBhbGxvd2VkIGFuZCBjaGVja3MgaWYgdGhlcmUgaXMgbW9yZSBwaWN0dXJlcyB0aGF0IHdheVxuXHRcdFx0aWYodG91Y2hTdGFydFggPiB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgICYmIGluZGV4IDwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdCdG5SaWdodCk7XG5cblx0XHRcdH0gZWxzZSBpZiAodG91Y2hTdGFydFggPiB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgKSB7XG5cdFx0XHRcdC8vIHN0b3Bcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLWxlZnRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZVwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0Nsb3NlQnRuRmlsbGVkKTtcblxuXHRcdFx0fSBlbHNlIGlmICh0b3VjaFN0YXJ0WCA8IHRvdWNoTW92ZVggJiYgZGlzdFkgPCBhbGxvd2VkVG91Y2hEaXN0YW5jZSAmJiBpbmRleCA+IDApIHtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0J0bkxlZnQpO1xuXG5cdFx0XHR9IGVsc2UgaWYodG91Y2hTdGFydFggPCB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UpIHtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0Nsb3NlQnRuRmlsbGVkKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0fVxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN3aXBlRW5kKGU6IGFueSkge1xuXHRcdFx0bGV0IHRvdWNob2JqICAgPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXHRcdFx0bGV0IHRvdWNoTW92ZVggPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRYKTtcblx0XHRcdGxldCB0b3VjaE1vdmVZID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSk7XG5cdFx0XHRsZXQgZGlzdFkgPSBNYXRoLmFicyh0b3VjaE1vdmVZIC0gdG91Y2hTdGFydFkpO1xuXHRcdFx0bGV0IGRpc3RYID0gTWF0aC5hYnModG91Y2hNb3ZlWCAtIHRvdWNoU3RhcnRYKTtcblx0XHRcdGxldCBkaXJlY3Rpb25MaW5lID0gdmlld2VyLmRpcmVjdGlvbkxpbmU7XG5cblx0XHRcdHRvdWNoRW5kID0gdG91Y2hNb3ZlWDtcblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblxuXHRcdFx0aWYgKHRvdWNoU3RhcnRYID4gdG91Y2hFbmQgJiZcblx0XHRcdFx0XHRkaXN0WCA+IG1pblRvdWNoRGlzdGFuY2UgJiZcblx0XHRcdFx0XHRkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICkge1xuXG5cdFx0XHRcdG5leHRJbWFnZSgpO1xuXHRcdFx0fSBlbHNlIGlmICh0b3VjaFN0YXJ0WCA8IHRvdWNoRW5kICYmXG5cdFx0XHRcdFx0ZGlzdFggPiBtaW5Ub3VjaERpc3RhbmNlICYmXG5cdFx0XHRcdFx0ZGlzdFkgPCBhbGxvd2VkVG91Y2hEaXN0YW5jZSkge1xuXG5cdFx0XHRcdHByZXZJbWFnZSgpO1xuXHRcdFx0fSBlbHNlIGlmIChkaXN0WSA+IDIwMCkge1xuXG5cdFx0XHRcdGNsb3NlVmlld2VyKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlSGlzdG9yeShldmVudDogYW55KSB7XG5cdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRpbml0OiBpbml0XG5cdFx0fVxuXHR9KCkpO1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogd2FsbnV0LmluaXRcblx0fVxufSkod2luZG93KTtcbiJdfQ==
