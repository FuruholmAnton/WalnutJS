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
            document.head.appendChild(fileref);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvd2FsbnV0L3dhbG51dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NNLE1BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFTLE1BQU07SUFDdEMsWUFBWSxDQUFDO0lBRWI7OztNQUdFO0lBQ0Ysc0JBQXVCLEVBQWUsRUFBRSxHQUFXO1FBQ2xELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNYLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7WUFBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ1YsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsQ0FBQztZQUNyRSxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7WUFDakcsQ0FBQztRQUNGLENBQUM7SUFDTCxDQUFDO0lBRUQ7UUFDQyxNQUFNLENBQU8sUUFBUyxDQUFDLGlCQUFpQjtZQUNqQyxRQUFTLENBQUMsdUJBQXVCO1lBQ2pDLFFBQVMsQ0FBQyxvQkFBb0I7WUFDOUIsUUFBUyxDQUFDLG1CQUFtQixDQUFDO0lBQ3RDLENBQUM7SUFDRCxJQUFJLG9CQUFvQixHQUFR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U0FBUyxFQUFFLENBQUM7WUFDYixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRyxRQUFRO2dCQUMvQixLQUFLLEdBQUcsZ0JBQWdCO2dCQUN4QixLQUFLLEdBQUcsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUVoQyxTQUFTLEVBQUUsQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRXhCLFdBQVcsRUFBRSxDQUFDO1lBQ2YsQ0FBQztRQUNGLENBQUM7UUFFRCx1QkFBdUIsS0FBVTtZQUNoQyxXQUFXLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFFRCxNQUFNLENBQUM7WUFDTixJQUFJLEVBQUUsSUFBSTtTQUNWLENBQUE7SUFDRixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRUwsTUFBTSxDQUFDO1FBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO0tBQ2pCLENBQUE7QUFDRixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbig8YW55PndpbmRvdykud2FsbnV0ID0gKGZ1bmN0aW9uKHdpbmRvdykge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvKlxuXHQqIExvb2tzIGZvciB0aGUgYXR0cmlidXRlIGZpcnN0LlxuXHQqIElmIG5vIGVsZW1lbnRzIGFyZSBmb3VuZCB0aGVuIHRyaWVzIHdpdGggY2xhc3NMaXN0XG5cdCovXG5cdGZ1bmN0aW9uIGZpbmRBbmNlc3RvciAoZWw6IEhUTUxFbGVtZW50LCBjbHM6IHN0cmluZykge1xuXHRcdGxldCBlbGVtID0gZWw7XG5cdCAgICB3aGlsZSAoKGVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQpICYmICFlbGVtLmhhc0F0dHJpYnV0ZShjbHMpKTtcblx0ICAgIGlmIChlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0ICAgIFx0cmV0dXJuIGVsZW07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHRlbGVtID0gZWw7XG5cdCAgICBcdHdoaWxlICgoZWxlbSA9IGVsZW0ucGFyZW50RWxlbWVudCkgJiYgIWVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNscykpO1xuXHQgICAgXHRpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cdCAgICBcdFx0cmV0dXJuIGVsZW07XG5cdCAgICBcdH0gZWxzZSB7XG5cdCAgICBcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhbnkgY29udGFpbmVyIHdpdGggYXR0cmlidXRlIG9yIGNsYXNzICd3YWxudXQnIG9mIHRoaXMgZWxlbWVudFwiKTtcblx0ICAgIFx0fVxuXHQgICAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gaXNGdWxsc2NyZWVuRW5hYmxlZCgpIHtcblx0XHRyZXR1cm4gKDxhbnk+ZG9jdW1lbnQpLmZ1bGxzY3JlZW5FbmFibGVkIHx8XG5cdFx0XHQoPGFueT5kb2N1bWVudCkud2Via2l0RnVsbHNjcmVlbkVuYWJsZWQgfHxcblx0XHRcdCg8YW55PmRvY3VtZW50KS5tb3pGdWxsU2NyZWVuRW5hYmxlZCB8fFxuXHRcdFx0KDxhbnk+ZG9jdW1lbnQpLm1zRnVsbHNjcmVlbkVuYWJsZWQ7XG5cdH1cblx0bGV0IGxhdW5jaEludG9GdWxsc2NyZWVuOiBhbnkgPSB1bmRlZmluZWQsXG5cdFx0ZXhpdEZ1bGxzY3JlZW46IGFueSA9IHVuZGVmaW5lZDtcblxuXHRpZiAoISFpc0Z1bGxzY3JlZW5FbmFibGVkKCkpIHtcblxuXHRcdGxldCBmdWxsc2NyZWVuRW5hYmxlZCA9ICg8YW55PmRvY3VtZW50KS5mdWxsc2NyZWVuRW5hYmxlZCB8fCAoPGFueT5kb2N1bWVudCkubW96RnVsbFNjcmVlbkVuYWJsZWQgfHwgKDxhbnk+ZG9jdW1lbnQpLndlYmtpdEZ1bGxzY3JlZW5FbmFibGVkO1xuXHRcdGxldCBmdWxsc2NyZWVuRWxlbWVudCA9ICg8YW55PmRvY3VtZW50KS5mdWxsc2NyZWVuRWxlbWVudCB8fCAoPGFueT5kb2N1bWVudCkubW96RnVsbFNjcmVlbkVsZW1lbnQgfHwgKDxhbnk+ZG9jdW1lbnQpLndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50O1xuXG5cdFx0bGF1bmNoSW50b0Z1bGxzY3JlZW4gPSBmdW5jdGlvbiAoZWxlbWVudDogYW55KSB7XG5cdFx0ICBpZihlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XG5cdFx0ICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH0gZWxzZSBpZihlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG5cdFx0ICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcblx0XHQgIH0gZWxzZSBpZihlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XG5cdFx0ICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHQgIH0gZWxzZSBpZihlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcblx0XHQgICAgZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0ICB9XG5cdFx0fTtcblxuXHRcdGV4aXRGdWxsc2NyZWVuID0gZnVuY3Rpb24gKCkge1xuXHRcdCAgaWYoKDxhbnk+ZG9jdW1lbnQpLmV4aXRGdWxsc2NyZWVuKSB7XG5cdFx0ICAgICg8YW55PmRvY3VtZW50KS5leGl0RnVsbHNjcmVlbigpO1xuXHRcdCAgfSBlbHNlIGlmKCg8YW55PmRvY3VtZW50KS5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG5cdFx0ICAgICg8YW55PmRvY3VtZW50KS5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG5cdFx0ICB9IGVsc2UgaWYoKDxhbnk+ZG9jdW1lbnQpLndlYmtpdEV4aXRGdWxsc2NyZWVuKSB7XG5cdFx0ICAgICg8YW55PmRvY3VtZW50KS53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuXHRcdCAgfVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBbZG9EZXZpY2VIYXZlVG91Y2ggZGVzY3JpcHRpb25dXG5cdCAqL1xuXHRmdW5jdGlvbiBkb0RldmljZUhhdmVUb3VjaCgpIHtcblx0XHR2YXIgYm9vbCA9IGZhbHNlO1xuXHQgICAgaWYgKCgnb250b3VjaHN0YXJ0JyBpbiAoPGFueT53aW5kb3cpKSB8fCAoPGFueT53aW5kb3cpLkRvY3VtZW50VG91Y2gpIHtcblx0ICAgICAgYm9vbCA9IHRydWU7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gYm9vbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBPbiBSZXNpemVFdmVudCBmdW5jdGlvblxuXHQgKi9cblx0ZnVuY3Rpb24gcmVzaXplRXZlbnQoY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCwgYWN0aW9uOiBzdHJpbmcgPSB1bmRlZmluZWQpIHtcblx0XHRpZihhY3Rpb24gPT09IFwicmVtb3ZlXCIpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGNhbGxiYWNrKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNhbGxiYWNrLCB0cnVlKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgY2FsbGJhY2spO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBVc2UgU1ZHIGFzIGlubGluZSBKYXZhU2NyaXB0XG5cdCAqL1xuXHRjb25zdCBzdmdDbG9zZUJ0biA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0LWNsb3NlXCIgdmlld0JveD1cIjAgMCA4MDAgODAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEuNFwiPjxwYXRoIGNsYXNzPVwid2FsbnV0LWNsb3NlX19wYXRoXCIgZmlsbD1cIiNmZmZcIiBkPVwiTTIxLjYgNjEuNmwzOC44LTM5TDc3NSA3MzcuM2wtMzkgMzl6XCIvPjxwYXRoIGNsYXNzPVwid2FsbnV0LWNsb3NlX19wYXRoXCIgZmlsbD1cIiNmZmZcIiBkPVwiTTIxLjYgNjEuNmwzOC44LTM5TDc3NSA3MzcuM2wtMzkgMzl6XCIvPjxwYXRoIGNsYXNzPVwid2FsbnV0LWNsb3NlX19wYXRoXCIgZmlsbD1cIiNmZmZcIiBkPVwiTTIuOCA4MC40TDgwLjMgM2w3MTQuNCA3MTQuMy03Ny41IDc3LjV6XCIvPjxwYXRoIGNsYXNzPVwid2FsbnV0LWNsb3NlX19wYXRoXCIgZmlsbD1cIiNmZmZcIiBkPVwiTTc5Ny43IDgyLjVMNzE3LjIgMiAyLjggNzE2LjQgODMuMiA3OTd6XCIvPjwvc3ZnPic7XG5cdGNvbnN0IHN2Z0Nsb3NlQnRuRmlsbGVkID0gJzxzdmcgdmlld0JveD1cIjAgMCA4MDAgODAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEuNFwiPjxwYXRoIGQ9XCJNNDAwIDcuMmMyMTkuNCAwIDM5Ny42IDE3Ni4zIDM5Ny42IDM5My41UzYxOS40IDc5NC4zIDQwMCA3OTQuM0MxODAuNiA3OTQuMyAyLjQgNjE4IDIuNCA0MDAuNyAyLjQgMTgzLjUgMTgwLjYgNy4yIDQwMCA3LjJ6bS00OC4yIDM4OUwxNTMuMiA1OTVsNTAuMiA1MC4yTDQwMiA0NDYuNSA1OTkuNCA2NDRsNDguNC00OC41TDQ1MC41IDM5OGwxOTkuMi0xOTktNTAuMi01MC40TDQwMC4yIDM0OCAyMDEuNSAxNDkgMTUzIDE5Ny42IDM1MiAzOTYuM3pcIiBmaWxsPVwiI2ZmZlwiLz48L3N2Zz4nO1xuXHRjb25zdCBzdmdGdWxsc2NyZWVuQnRuID0gJzxzdmcgY2xhc3M9XCJ3YWxudXRfX2Z1bGxzY3JlZW5cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEuNFwiPjxwYXRoIGQ9XCJNMy40IDE1LjRIMFYyNGg4LjZ2LTMuNEgzLjR2LTUuMnpNMCA4LjZoMy40VjMuNGg1LjJWMEgwdjguNnptMjAuNiAxMmgtNS4yVjI0SDI0di04LjZoLTMuNHY1LjJ6TTE1LjQgMHYzLjRoNS4ydjUuMkgyNFYwaC04LjZ6XCIgZmlsbD1cIiNmZmZcIiBmaWxsLXJ1bGU9XCJub256ZXJvXCIvPjwvc3ZnPic7XG5cdGNvbnN0IHN2Z0J0bkxlZnQgPSAnPHN2ZyBjbGFzcz1cIndhbG51dF9fbmF2aWdhdGlvbi1pbWdcIiB2aWV3Qm94PVwiMCAwIDQ1IDQ1XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEuNDFcIj48ZyBmaWxsPVwiI2ZmZlwiIGZpbGwtcnVsZT1cIm5vbnplcm9cIj48cGF0aCBkPVwiTTIyLjEyIDQ0LjI0YzEyLjIgMCAyMi4xMi05LjkzIDIyLjEyLTIyLjEyQzQ0LjI0IDkuOTIgMzQuMyAwIDIyLjEyIDAgOS45MiAwIDAgOS45MiAwIDIyLjEyYzAgMTIuMiA5LjkyIDIyLjEyIDIyLjEyIDIyLjEyem0wLTQyLjc0YzExLjM3IDAgMjAuNjIgOS4yNSAyMC42MiAyMC42MiAwIDExLjM3LTkuMjUgMjAuNjItMjAuNjIgMjAuNjItMTEuMzcgMC0yMC42Mi05LjI1LTIwLjYyLTIwLjYyQzEuNSAxMC43NSAxMC43NSAxLjUgMjIuMTIgMS41elwiLz48cGF0aCBkPVwiTTI0LjkgMjkuODhjLjIgMCAuMzgtLjA3LjUyLS4yMi4zLS4zLjMtLjc2IDAtMS4wNmwtNi44LTYuOCA2LjgtNi44Yy4zLS4zLjMtLjc3IDAtMS4wNi0uMy0uMy0uNzYtLjMtMS4wNiAwbC03LjMyIDcuMzNjLS4zLjMtLjMuNzcgMCAxLjA2bDcuMzIgNy4zM2MuMTUuMTUuMzQuMjIuNTMuMjJ6XCIvPjwvZz48L3N2Zz4nO1xuXHRjb25zdCBzdmdCdG5SaWdodCA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0X19uYXZpZ2F0aW9uLWltZ1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDQ0LjIzNiA0NC4yMzZcIj48ZyBmaWxsPVwiI0ZGRlwiPjxwYXRoIGQ9XCJNMjIuMTIgNDQuMjRDOS45MiA0NC4yNCAwIDM0LjMgMCAyMi4xMlM5LjkyIDAgMjIuMTIgMHMyMi4xMiA5LjkyIDIyLjEyIDIyLjEyLTkuOTMgMjIuMTItMjIuMTIgMjIuMTJ6bTAtNDIuNzRDMTAuNzUgMS41IDEuNSAxMC43NSAxLjUgMjIuMTJjMCAxMS4zNyA5LjI1IDIwLjYyIDIwLjYyIDIwLjYyIDExLjM3IDAgMjAuNjItOS4yNSAyMC42Mi0yMC42MiAwLTExLjM3LTkuMjUtMjAuNjItMjAuNjItMjAuNjJ6XCIvPjxwYXRoIGQ9XCJNMTkuMzQgMjkuODhjLS4yIDAtLjM4LS4wNy0uNTMtLjIyLS4yOC0uMy0uMjgtLjc2IDAtMS4wNmw2LjgtNi44LTYuOC02LjhjLS4yOC0uMy0uMjgtLjc3IDAtMS4wNy4zLS4zLjc4LS4zIDEuMDcgMGw3LjMzIDcuMzRjLjMuMy4zLjc3IDAgMS4wNmwtNy4zMyA3LjMzYy0uMTQuMTUtLjM0LjIyLS41My4yMnpcIi8+PC9nPjwvc3ZnPic7XG5cblx0Y29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRjb25zdCBnX3N2Z0Nsb3NlQnRuID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdDbG9zZUJ0biwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudDtcblx0Y29uc3QgZ19zdmdDbG9zZUJ0bkZpbGxlZCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnQ2xvc2VCdG5GaWxsZWQsIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQ7XG5cdGNvbnN0IGdfc3ZnRnVsbHNjcmVlbkJ0biA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnRnVsbHNjcmVlbkJ0biwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudDtcblx0Y29uc3QgZ19zdmdCdG5MZWZ0ID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdCdG5MZWZ0LCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50O1xuXHRjb25zdCBnX3N2Z0J0blJpZ2h0ID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdCdG5SaWdodCwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudDtcblxuXHQvKipcblx0ICogW3dhbG51dCBkZXNjcmlwdGlvbl1cblx0ICovXG5cdGNvbnN0IHdhbG51dCA9IChmdW5jdGlvbigpIHtcblxuXHRcdC8qIEdsb2JhbHMgd2l0aGluIHdhbG51dCAqL1xuXHRcdGxldCBwYXRoO1xuXHRcdGxldCBwYXRoQXJyYXk7XG5cdFx0bGV0IHBhdGhNaWRkbGU7XG5cdFx0bGV0IG5ld1BhdGhuYW1lO1xuXHRcdGxldCBpO1xuXHRcdGxldCBuYXZpZ2F0aW9uQnV0dG9ucztcblx0XHRsZXQgY29udGFpbmVySW5kZXg6IHN0cmluZztcblxuXHRcdGxldCBDT05UQUlORVJTOiBhbnkgPSBbXTtcblx0XHRsZXQgY29udGFpbmVyQXJyYXk6IGFueSA9IFtdO1xuXHRcdGxldCB2aWV3ZXI6IGFueSA9IHt9O1xuXHRcdGxldCBjb25maWc6IGFueSA9IHt9O1xuXHRcdGxldCB0b3VjaFN0YXJ0OiBudW1iZXIgPSAwO1xuXHRcdGxldCB0b3VjaFN0YXJ0WDogbnVtYmVyID0gMDtcblx0XHRsZXQgdG91Y2hTdGFydFk6IG51bWJlciA9IDA7XG5cdFx0bGV0IHRvdWNoRW5kOiBudW1iZXIgPSAwO1xuXG5cdFx0Y29uc3QgYWxsb3dlZFRvdWNoRGlzdGFuY2U6IG51bWJlciA9IDEwMDtcblx0XHRjb25zdCBtaW5Ub3VjaERpc3RhbmNlOiBudW1iZXIgPSAyMDtcblxuXG5cdFx0Y29uc3QgdXRpbHMgPSB7XG5cdFx0XHRnZXRDb250YWluZXJzOmZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbd2FsbnV0XScpO1xuXHRcdFx0XHRpZiAoZWxlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtcztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dhbG51dCcpO1xuXHRcdFx0XHRcdGlmIChlbGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbXM7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihcIkNvdWxkbid0IGZpbmQgYW55IGNvbnRhaW5lcnMgZm9yIFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRnZXRTY3JpcHRTcmM6ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxldCBlbGVtOiBhbnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbd2FsbnV0LXNjcmlwdF0nKTtcblx0XHRcdFx0aWYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MU2NyaXB0RWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtLnNyYztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dhbG51dFNjcmlwdCcpO1xuXHRcdFx0XHRcdGlmIChlbGVtIGluc3RhbmNlb2YgSFRNTFNjcmlwdEVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtLnNyYztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiQ291bGRuJ3QgZmluZCB0aGUgc2NyaXB0LXRhZyBmb3Igd2FsbnV0IHdpdGggYXR0cmlidXRlIHdhbG51dC1zY3JpcHQgb3IgaWQ9J3dhbG51dFNjcmlwdCdcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0b25jZTpmdW5jdGlvbihmbjogYW55LCBjb250ZXh0OiBhbnkgPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gZnVuY3Rpb24gY2FuIG9ubHkgZmlyZSBvbmNlXG5cdFx0XHRcdGxldCByZXN1bHQ6IGFueTtcblxuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYoZm4pIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQgfHwgdGhpcywgYXJndW1lbnRzKTtcblx0XHRcdFx0XHRcdGZuID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRsZXQgbmV3UGF0aDtcblxuXHRcdFx0Q09OVEFJTkVSUyA9IHV0aWxzLmdldENvbnRhaW5lcnMoKTtcblxuXHRcdFx0cGF0aCA9IHV0aWxzLmdldFNjcmlwdFNyYygpO1xuXG5cdFx0XHRwYXRoQXJyYXkgPSBwYXRoLnNwbGl0KCAnLycgKTtcblx0XHRcdHBhdGhBcnJheS5zcGxpY2UocGF0aEFycmF5Lmxlbmd0aC0xLCAwLCBcInN0eWxlc1wiKTtcblx0XHRcdG5ld1BhdGggPSBwYXRoQXJyYXkuam9pbihcIi9cIik7XG5cdFx0XHRuZXdQYXRoID0gbmV3UGF0aC5yZXBsYWNlKFwid2FsbnV0LmpzXCIsIFwid2FsbnV0LmNzc1wiKTtcblxuXHRcdFx0Y29uZmlnLnBhdGhUb0NTUyA9IG5ld1BhdGg7XG5cblx0XHRcdGFkZENTU0xpbmsoKTtcblx0XHRcdGluZGV4SW1hZ2VzKCk7XG5cdFx0XHRidWlsZFZpZXdlcigpO1xuXG5cdFx0XHRpZiAoZG9EZXZpY2VIYXZlVG91Y2goKSkge1xuXHRcdFx0XHR2aWV3ZXIud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwid2FsbnV0LS1pcy10b3VjaFwiKTtcblx0XHRcdH1cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCAqIEFkZHMgYW5kIHJlbW92ZXMgZXZlbnQgb24gb3BlbiBhbmQgY2xvc2Vcblx0XHQgKiBSRVZJRVc6IEFkZCBvbmNlIGFuZCBkb250IHJlbW92ZS4gcHJlZm9ybWFuY2UgYmVuZWZpdHM/XG5cdFx0ICovXG5cdFx0Y29uc3QgaW5pdEV2ZW50cyA9IHV0aWxzLm9uY2UoZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBtYWluSW1hZ2UgPSB2aWV3ZXIubWFpbkltYWdlO1xuXHRcdFx0dmlld2VyLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrV3JhcHBlcik7XG5cdFx0XHR2aWV3ZXIuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlVmlld2VyKTtcblx0XHRcdHZpZXdlci5mdWxsc2NyZWVuQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdWxsc2NyZWVuKTtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBjaGVja0tleVByZXNzZWQpO1xuXG5cdFx0XHRpZiAoZG9EZXZpY2VIYXZlVG91Y2goKSkge1xuXHRcdFx0XHRtYWluSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgc3dpcGVTdGFydCk7XG5cdFx0XHRcdG1haW5JbWFnZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgc3dpcGVFbmQpO1xuXHRcdFx0XHRtYWluSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBzd2lwZU1vdmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmlld2VyLm5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5leHRJbWFnZSk7XG5cdFx0XHRcdHZpZXdlci5wcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcmV2SW1hZ2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gaW5pdEZsZXhFdmVudHMoKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgY2hlY2tLZXlQcmVzc2VkKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgY2hhbmdlSGlzdG9yeSk7XG5cdFx0XHRyZXNpemVFdmVudChmaXhWaWV3ZXIpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBkZWluaXRGbGV4RXZlbnRzKCkge1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGNoZWNrS2V5UHJlc3NlZCk7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGNoYW5nZUhpc3RvcnkpO1xuXHRcdFx0cmVzaXplRXZlbnQoZml4Vmlld2VyLCBcInJlbW92ZVwiKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBBZGQgdGhlIENTUyBMaW5rIGluIHRoZSBkb2N1bWVudFxuXHRcdCAqIFJFVklFVzogSGF2ZSB1c2VyIGRvIGl0IGhpbXNlbGYgdG8gbWFrZSBpdCBlYXN5IGZvciBjdXN0b21pemF0aW9uPyBmcm9tIENETiA/XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gYWRkQ1NTTGluaygpIHtcblxuXHRcdFx0Y29uc3QgZmlsZXJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdFx0ICAgIGZpbGVyZWYuc2V0QXR0cmlidXRlKFwicmVsXCIsIFwic3R5bGVzaGVldFwiKTtcblx0ICAgICAgICBmaWxlcmVmLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcblx0ICAgICAgICBmaWxlcmVmLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgY29uZmlnLnBhdGhUb0NTUyk7XG5cblx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZmlsZXJlZik7XG5cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBJbmRleGVzIGFzIGltYWdlcyBzbyByZWxhdGVkIGltYWdlcyB3aWxsIHNob3cgYXMgdGh1bWJuYWlscyB3aGVuIG9wZW5pbmcgdGhlIHZpZXdlclxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGluZGV4SW1hZ2VzKCl7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IENPTlRBSU5FUlMubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHRjb250YWluZXJBcnJheS5wdXNoKHtcblx0XHRcdFx0XHRjb250YWluZXI6IENPTlRBSU5FUlNbaV0sXG5cdFx0XHRcdFx0aW1hZ2VzOiBbXVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRDT05UQUlORVJTW2ldLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWNvbnRhaW5lclwiLCBpKTtcblxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBQdXRzIGltYWdlcyBpbiBhIGFycmF5LiBGaW5kcyBhbGwgaW1hZ2VzIHdpdGggZWl0aGVyOlxuXHRcdFx0XHQgKiBDTEFTUyBvciBBVFRSSUJVVEUgd2l0aCBcIndhbG51dC1pbWFnZVwiXG5cdFx0XHRcdCAqIElmIG5laXRoZXIgaXMgZm91bmQgdGhlbiBpdCB3aWxsIGxvb2sgZm9yIGFsbCA8aW1nPiB0YWdzXG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRsZXQgaW1nID0gQ09OVEFJTkVSU1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKTtcblx0XHRcdFx0bGV0IGJnT2xkID0gQ09OVEFJTkVSU1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwid2FsbnV0LWltYWdlXCIpO1xuXHRcdFx0XHRsZXQgYmcgPSBDT05UQUlORVJTW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t3YWxudXQtaW1hZ2VdJyk7XG5cdFx0XHRcdGxldCBpbWFnZXMgPSBbXTtcblxuXHRcdFx0XHRpZiAoYmdPbGQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBiZ09sZC5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goYmdPbGRbeF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYmcubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBiZy5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goYmdbeF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWJnT2xkLmxlbmd0aCAmJiAhYmcubGVuZ3RoICYmIGltZyApIHtcblx0XHRcdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGltZy5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdFx0aW1hZ2VzLnB1c2goaW1nW3hdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgaW1hZ2VzLmxlbmd0aDsgaisrKSB7XG5cblx0XHRcdFx0XHRpbWFnZXNbal0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9wZW5WaWV3ZXIpO1xuXG5cdFx0XHRcdFx0aW1hZ2VzW2pdLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGopO1xuXG5cdFx0XHRcdFx0bGV0IHNyYztcblxuXHRcdFx0XHRcdGlmKGltYWdlc1tqXS5zcmMpIHtcblx0XHRcdFx0XHRcdHNyYyA9IGltYWdlc1tqXS5zcmNcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV0IHN0eWxlID0gaW1hZ2VzW2pdLmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpbWFnZXNbal0sIG51bGwpO1xuXHRcdFx0XHRcdFx0c3JjID0gc3R5bGUuYmFja2dyb3VuZEltYWdlLnNsaWNlKDQsIC0xKS5yZXBsYWNlKC9cIi9nLCBcIlwiKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb250YWluZXJBcnJheVtpXS5pbWFnZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRlbGVtOiBpbWFnZXNbal0sXG5cdFx0XHRcdFx0XHRzcmM6IHNyYyxcblx0XHRcdFx0XHRcdGluZGV4OiBqXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgRWxlbWVudHMgdGhhdCBidWlsZHMgdXAgdGhlIHZpZXdlclxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGJ1aWxkVmlld2VyKCkge1xuXHRcdFx0Y29uc3QgdWwgXHRcdFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuXHRcdFx0Y29uc3QgbGlzdENvbnRhaW5lciBcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y29uc3Qgd3JhcHBlciBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjb25zdCBib3ggIFx0XHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y29uc3QgbWFpbkltYWdlIFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0XHRcdGNvbnN0IG1haW5JbWFnZUNvbnRhaW5lciBcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdGNvbnN0IG5leHRCdG4gXHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y29uc3QgcHJldkJ0biBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjb25zdCBjbG9zZUJ0biBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdFx0XHRjb25zdCBlbERpcmVjdGlvbkFycm93ICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdGNvbnN0IGVsRGlyZWN0aW9uTGluZSAgICBcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBZGQgQ1NTIGNsYXNzZXMgdG8gdGhlIGVsZW1lbnRzXG5cdFx0XHQgKi9cblx0XHRcdHVsLmNsYXNzTmFtZSBcdFx0XHRcdFx0PSBcIndhbG51dF9fbGlzdFwiO1xuXHRcdFx0bGlzdENvbnRhaW5lci5jbGFzc05hbWUgXHRcdD0gXCJ3YWxudXRfX2xpc3QtY29udGFpbmVyXCI7XG5cdFx0XHRtYWluSW1hZ2UuY2xhc3NOYW1lIFx0XHRcdD0gXCJ3YWxudXRfX2ltYWdlXCI7XG5cdFx0XHRtYWluSW1hZ2VDb250YWluZXIuY2xhc3NOYW1lIFx0PSBcIndhbG51dF9faW1hZ2UtY29udGFpbmVyXCJcblx0XHRcdGJveC5jbGFzc05hbWUgXHRcdFx0XHRcdD0gXCJ3YWxudXRfX2JveFwiO1xuXHRcdFx0d3JhcHBlci5jbGFzc05hbWUgXHRcdFx0XHQ9IFwid2FsbnV0X193cmFwcGVyXCI7XG5cdFx0XHQvLyB3cmFwcGVyLnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG5cdFx0XHRuZXh0QnRuLmNsYXNzTmFtZSBcdFx0XHRcdD0gXCJ3YWxudXRfX25hdmlnYXRpb24gd2FsbnV0X19uYXZpZ2F0aW9uLS1uZXh0XCI7XG5cdFx0XHRwcmV2QnRuLmNsYXNzTmFtZSBcdFx0XHRcdD0gXCJ3YWxudXRfX25hdmlnYXRpb24gd2FsbnV0X19uYXZpZ2F0aW9uLS1wcmV2XCI7XG5cdFx0XHRlbERpcmVjdGlvbkFycm93LmNsYXNzTmFtZSBcdFx0PSBcIndhbG51dF9fZGlyZWN0aW9uLWFycm93XCI7XG5cdFx0XHRlbERpcmVjdGlvbkxpbmUuY2xhc3NOYW1lIFx0XHQ9IFwid2FsbnV0X19kaXJlY3Rpb24tbGluZVwiO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIENvbm5lY3RzIHRoZSBFbGVtZW50cyBhbmQgY3JlYXRlcyB0aGUgc3RydWN0dXJlXG5cdFx0XHQgKi9cblx0XHRcdG5leHRCdG4uYXBwZW5kQ2hpbGQoZ19zdmdCdG5SaWdodCk7XG5cdFx0XHRwcmV2QnRuLmFwcGVuZENoaWxkKGdfc3ZnQnRuTGVmdCk7XG5cdFx0XHRlbERpcmVjdGlvbkxpbmUuYXBwZW5kQ2hpbGQoZWxEaXJlY3Rpb25BcnJvdyk7XG5cdFx0XHRtYWluSW1hZ2VDb250YWluZXIuYXBwZW5kQ2hpbGQobWFpbkltYWdlKTtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChuZXh0QnRuKTtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2QnRuKTtcblx0XHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbERpcmVjdGlvbkxpbmUpO1xuXHRcdFx0bGlzdENvbnRhaW5lci5hcHBlbmRDaGlsZCh1bCk7XG5cdFx0XHRib3guYXBwZW5kQ2hpbGQobWFpbkltYWdlQ29udGFpbmVyKTtcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQobGlzdENvbnRhaW5lcik7XG5cdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGdfc3ZnQ2xvc2VCdG4pO1xuXHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChib3gpO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEFkZCBGdWxsc2NyZWVuIGJ1dHRvbiB3aGVuIG5vdCBpbiBmdWxsc2NyZWVuIG1vZGVcblx0XHRcdCAqL1xuXHRcdFx0aWYoISFpc0Z1bGxzY3JlZW5FbmFibGVkKCkpIHtcblx0XHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChnX3N2Z0Z1bGxzY3JlZW5CdG4pO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIE1ha2UgdmFyaWFibGVzIGdsb2JhbCBmb3Igd2FsbnV0XG5cdFx0XHQgKi9cblx0XHRcdHZpZXdlci5jbG9zZUJ0blx0XHQgPSBnX3N2Z0Nsb3NlQnRuO1xuXHRcdFx0dmlld2VyLm5leHRCdG4gXHRcdCA9IG5leHRCdG47XG5cdFx0XHR2aWV3ZXIucHJldkJ0biBcdFx0ID0gcHJldkJ0bjtcblx0XHRcdHZpZXdlci5mdWxsc2NyZWVuQnRuICA9IGdfc3ZnRnVsbHNjcmVlbkJ0bjtcblx0XHRcdHZpZXdlci5tYWluSW1hZ2UgXHQgPSBtYWluSW1hZ2U7XG5cdFx0XHR2aWV3ZXIud3JhcHBlciBcdFx0ID0gd3JhcHBlcjtcblx0XHRcdHZpZXdlci5saXN0IFx0XHRcdCA9IHVsO1xuXHRcdFx0dmlld2VyLmRpcmVjdGlvbkFycm93ID0gZWxEaXJlY3Rpb25BcnJvdztcblx0XHRcdHZpZXdlci5kaXJlY3Rpb25MaW5lICA9IGVsRGlyZWN0aW9uTGluZTtcblx0XHRcdHZpZXdlci5ib3ggXHRcdFx0ID0gYm94O1xuXG5cblx0XHRcdGluaXRFdmVudHMoKTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCAqIE9wZW5zIFZpZXdlciBhbmRcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBvcGVuVmlld2VyKGU6IGFueSkge1xuXG5cdFx0XHRsZXQgaW5kZXg7XG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXHRcdFx0bGV0IGxpc3RJdGVtO1xuXHRcdFx0bGV0IG1haW5JbWFnZSA9IHZpZXdlci5tYWluSW1hZ2U7XG5cdFx0XHRsZXQgcHJldkJ0biA9IHZpZXdlci5wcmV2QnRuO1xuXHRcdFx0bGV0IG5leHRCdG4gPSB2aWV3ZXIubmV4dEJ0bjtcblx0XHRcdGxldCBzcmM7XG5cdFx0XHRsZXQgc3R5bGU7XG5cblx0XHRcdGNvbnRhaW5lciA9IGZpbmRBbmNlc3RvcihlLnRhcmdldCwgXCJ3YWxudXRcIilcblx0XHRcdGNvbnRhaW5lckluZGV4ID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWNvbnRhaW5lclwiKTtcblxuXHRcdFx0c2V0SW1hZ2VzKGNvbnRhaW5lckluZGV4KTtcblxuXHRcdFx0aW5kZXggPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpKTtcblxuXG5cdFx0XHRzdHlsZSA9IHRoaXMuY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMsIG51bGwpO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIExvb2tzIGZvciB0aGUgaW1hZ2Ugc291cmNlIGFuZCBpZiBub3QgZm91bmQgZ2V0IHRoZSBiYWNrZ3JvdW5kIGltYWdlXG5cdFx0XHQgKi9cblx0XHRcdGlmICh0aGlzLnNyYykge1xuXHRcdFx0XHRzcmMgPSB0aGlzLnNyY1xuXHRcdFx0fSBlbHNlIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgIT0gXCJub25lXCIpIHtcblx0XHRcdFx0c3JjID0gc3R5bGUuYmFja2dyb3VuZEltYWdlLnNsaWNlKDQsIC0xKS5yZXBsYWNlKC9cIi9nLCBcIlwiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBpbWFnZSBmb3IgZWxlbWVudDogXCIgKyB0aGlzKTtcblx0XHRcdH1cblxuXHRcdFx0bWFpbkltYWdlLnNyYyA9IHNyYztcblx0XHRcdG1haW5JbWFnZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiLCBpbmRleCk7XG5cblxuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0LS1vcGVuXCIpO1xuXG5cdFx0XHRpZihpbmRleCA9PT0gMCAmJiBpbmRleCA9PT0gY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdH0gZWxzZSBpZihpbmRleCA9PT0gMCkge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH1lbHNlIGlmKGluZGV4ID09PSAoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggLSAxKSApIHtcblx0XHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpbml0RmxleEV2ZW50cygpO1xuXHRcdFx0Zml4Vmlld2VyKCk7XG5cblx0XHRcdHZpZXdlci53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX3dyYXBwZXItLW9wZW5cIik7XG5cblx0XHRcdGxldCBzdGF0ZU9iaiA9IFwid2FsbnV0XCI7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgXCJ3YWxudXRcIiwgXCJcIik7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRJbWFnZXMoY29udGFpbmVySW5kZXg6IGFueSkge1xuXHRcdFx0bGV0IGltZztcblx0XHRcdGxldCBsaTtcblx0XHRcdGxldCBsaXN0ID0gdmlld2VyLmxpc3Q7XG5cblx0XHRcdGxpc3QuaW5uZXJIVE1MID0gXCJcIjtcblxuXHRcdFx0aWYoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuXHRcdFx0XHRcdGxpLmNsYXNzTmFtZSA9IFwid2FsbnV0X19pdGVtXCI7XG5cdFx0XHRcdFx0bGkuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2ldLnNyYyArIFwiKVwiO1xuXHRcdFx0XHRcdGxpLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LXNvdXJjZVwiLCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2ldLnNyYyk7XG5cdFx0XHRcdFx0bGkuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpXS5pbmRleCk7XG5cblxuXHRcdFx0XHRcdGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0bGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtc291cmNlXCIpO1xuXHRcdFx0XHRcdFx0Y2hhbmdlSW1hZ2UobnVsbCx7XG5cdFx0XHRcdFx0XHRcdHNvdXJjZTogc3JjLFxuXHRcdFx0XHRcdFx0XHRpbmRleDogcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKSksXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lcjogbnVsbFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRsaXN0LmFwcGVuZENoaWxkKGxpKTtcblxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZpeExpc3RXaWR0aCgpIHtcblx0XHRcdGxldCBlbEl0ZW06IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3YWxudXRfX2l0ZW1cIilbMF07XG5cdFx0XHRsZXQgbGlzdEl0ZW06IG51bWJlciA9IGVsSXRlbS5vZmZzZXRXaWR0aDtcblx0XHRcdGxldCBlbExpc3Q6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3YWxudXRfX2xpc3RcIilbMF07XG5cdFx0XHRlbExpc3Quc3R5bGUud2lkdGggPSAoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggKiAgbGlzdEl0ZW0pICsgXCJweFwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsb3NlVmlld2VyKCkge1xuXHRcdFx0dmlld2VyLm1haW5JbWFnZS5zcmMgPSBcIlwiO1xuXHRcdFx0dmlld2VyLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fd3JhcHBlci0tb3BlblwiKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dC0tb3BlblwiKTtcblx0XHRcdGRlaW5pdEZsZXhFdmVudHMoKTtcblx0XHRcdGZ1bGxzY3JlZW4oXCJleGl0XCIpO1xuXHRcdFx0aWYgKGhpc3Rvcnkuc3RhdGUgPT09IFwid2FsbnV0XCIpIHtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoYW5nZUltYWdlKGFjdGlvbjogYW55LCBvYmplY3Q6IGFueSA9IHVuZGVmaW5lZCkge1xuXHRcdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHRcdGxldCBuZXdJbmRleCA9IDA7XG5cdFx0XHRsZXQgaW5kZXg6IG51bWJlciA9IDA7XG5cdFx0XHRsZXQgcHJldkJ0biA9IHZpZXdlci5wcmV2QnRuO1xuXHRcdFx0bGV0IG5leHRCdG4gPSB2aWV3ZXIubmV4dEJ0bjtcblx0XHRcdGxldCBtYWluSW1hZ2UgPSB2aWV3ZXIubWFpbkltYWdlO1xuXG5cdFx0XHRpZih0eXBlb2YgYWN0aW9uICE9PSBcInVuZGVmaW5lZFwiICYmIGFjdGlvbiAhPT0gbnVsbCApe1xuXHRcdFx0XHRpbmRleCA9IHBhcnNlSW50KG1haW5JbWFnZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKSk7XG5cblx0XHRcdFx0aWYoYWN0aW9uID09PSBcIm5leHRcIiAmJiBpbmRleCA8IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSl7XG5cdFx0XHRcdFx0aW5kZXggPSBpbmRleCArIDE7XG5cdFx0XHRcdH1lbHNlIGlmKGFjdGlvbiA9PT0gXCJwcmV2XCIgJiYgaW5kZXggPiAwICl7XG5cdFx0XHRcdFx0aW5kZXggPSBpbmRleCAtIDE7XG5cdFx0XHRcdH1lbHNlIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUT0RPOiBmaW5kIHJpZ2h0IGFycmF5IGlzdGVhZCBvZiAwXG5cdFx0XHRcdGlmKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXNbaW5kZXhdKXtcblx0XHRcdFx0XHRtYWluSW1hZ2Uuc3JjID0gY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpbmRleF0uc3JjO1xuXHRcdFx0XHRcdG1haW5JbWFnZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiLCBpbmRleCk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHR9IGVsc2UgaWYob2JqZWN0ICYmIG9iamVjdC5zb3VyY2Upe1xuXHRcdFx0XHRpbmRleCA9IHBhcnNlSW50KG9iamVjdC5pbmRleCk7XG5cdFx0XHRcdG1haW5JbWFnZS5zcmMgPSBvYmplY3Quc291cmNlO1xuXHRcdFx0XHRtYWluSW1hZ2Uuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgaW5kZXgpO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmKGluZGV4ID09PSAwICYmIGluZGV4ID09PSBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0fSBlbHNlIGlmKGluZGV4ID09PSAwKSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0fWVsc2UgaWYoaW5kZXggPT09IChjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpICkge1xuXHRcdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHRcdG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdGNoZWNrSGVpZ2h0KCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZml4Vmlld2VyKCkge1xuXHRcdFx0Y2hlY2tIZWlnaHQoKTtcblx0XHRcdGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2FsbnV0X19pdGVtXCIpIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0XHRcdFx0Zml4TGlzdFdpZHRoKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tIZWlnaHQoKSB7XG5cdFx0XHRsZXQgdmlld2VySGVpZ2h0ID0gdmlld2VyLmJveC5vZmZzZXRIZWlnaHQ7XG5cdFx0XHRsZXQgd3JhcHBlciA9IHZpZXdlci53cmFwcGVyO1xuXG5cdFx0XHRpZiAoIHZpZXdlckhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuXHRcdFx0XHR3cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXQtLWFsaWduLXRvcFwiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dC0tYWxpZ24tdG9wXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoZWNrS2V5UHJlc3NlZChlOiBhbnkpIHtcblx0XHRcdGxldCBrZXkgPSBlLmtleUNvZGU7XG5cdFx0XHRpZigga2V5ID09PSAzNykge1xuXHRcdFx0XHRjaGFuZ2VJbWFnZShcInByZXZcIik7XG5cdFx0XHR9IGVsc2UgaWYoa2V5ID09PSAzOSkge1xuXHRcdFx0XHRjaGFuZ2VJbWFnZShcIm5leHRcIik7XG5cdFx0XHR9IGVsc2UgaWYoa2V5ID09PSAyNykge1xuXHRcdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNsaWNrV3JhcHBlcihlOiBhbnkpIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIEZJWE1FOiBzdG9wIGV2ZW50IGZyb20gYnViYmxpbmdcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gRklYTUU6IHN0b3AgZXZlbnQgZnJvbSBidWJibGluZ1xuXHRcdFx0aWYgKGUudGFyZ2V0ICE9PSB0aGlzKSB7XG5cdFx0XHQgICAgcmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y2xvc2VWaWV3ZXIuY2FsbCh0aGlzKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmdWxsc2NyZWVuKG9wdGlvbjogc3RyaW5nKSB7XG5cdFx0XHRsZXQgd3JhcHBlciBcdFx0PSB2aWV3ZXIud3JhcHBlcjtcblx0XHRcdGxldCBmdWxsc2NyZWVuQnRuIFx0PSB2aWV3ZXIuZnVsbHNjcmVlbkJ0bjtcblxuXHRcdFx0aWYob3B0aW9uID09PSBcImV4aXRcIikge1xuXHRcdFx0XHRleGl0RnVsbHNjcmVlbigpO1xuXHRcdFx0XHRmdWxsc2NyZWVuQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2Z1bGxzY3JlZW4tLWhpZGRlblwiKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGF1bmNoSW50b0Z1bGxzY3JlZW4od3JhcHBlcik7XG5cdFx0XHRcdGZ1bGxzY3JlZW5CdG4uY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZnVsbHNjcmVlbi0taGlkZGVuXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG5leHRJbWFnZSgpIHtcblx0XHRcdGNoYW5nZUltYWdlLmNhbGwodGhpcywgXCJuZXh0XCIpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHByZXZJbWFnZSgpIHtcblx0XHRcdGNoYW5nZUltYWdlLmNhbGwodGhpcywgXCJwcmV2XCIpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN3aXBlU3RhcnQoZTogYW55KSB7XG5cdFx0XHRsZXQgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0XHR0b3VjaFN0YXJ0WCA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFgpO1xuXHRcdFx0dG91Y2hTdGFydFkgPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZKTtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzd2lwZU1vdmUoZTogYW55KSB7XG5cdFx0XHRsZXQgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXHRcdFx0bGV0IHRvdWNoTW92ZVggPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRYKTtcblx0XHRcdGxldCB0b3VjaE1vdmVZID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSk7XG5cdFx0XHRsZXQgaW5kZXggPSB2aWV3ZXIubWFpbkltYWdlLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpO1xuXHRcdFx0bGV0IGRpcmVjdGlvbkxpbmUgPSB2aWV3ZXIuZGlyZWN0aW9uTGluZTtcblx0XHRcdGxldCBkaXJlY3Rpb25BcnJvdyA9IHZpZXdlci5kaXJlY3Rpb25BcnJvdztcblx0XHRcdGxldCBkaXN0WDtcblx0XHRcdGxldCBkaXN0WTtcblxuXHRcdFx0ZGlzdFggPSBNYXRoLmFicyh0b3VjaE1vdmVYIC0gdG91Y2hTdGFydFgpO1xuXHRcdFx0ZGlzdFkgPSBNYXRoLmFicyh0b3VjaE1vdmVZIC0gdG91Y2hTdGFydFkpO1xuXG5cdFx0XHRkaXJlY3Rpb25MaW5lLnN0eWxlLndpZHRoID0gNDAgKyBkaXN0WCArIFwicHhcIjtcblxuXHRcdFx0Ly8gQ2hlY2tzIGlmIHlvdSBzd2lwZSByaWdodCBvciBsZWZ0IG9yIGlmIHlvdSBzd2lwZWQgdXAgb3IgZG93biBtb3JlIHRoYW4gYWxsb3dlZCBhbmQgY2hlY2tzIGlmIHRoZXJlIGlzIG1vcmUgcGljdHVyZXMgdGhhdCB3YXlcblx0XHRcdGlmKHRvdWNoU3RhcnRYID4gdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICAmJiBpbmRleCA8IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtcmlnaHRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkFycm93LmlubmVySFRNTCA9IFwiXCI7XG5cdFx0XHRcdGRpcmVjdGlvbkFycm93LmFwcGVuZENoaWxkKGdfc3ZnQnRuUmlnaHQpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHRvdWNoU3RhcnRYID4gdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICkge1xuXHRcdFx0XHQvLyBzdG9wXG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmVcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdDbG9zZUJ0bkZpbGxlZCk7XG5cblx0XHRcdH0gZWxzZSBpZiAodG91Y2hTdGFydFggPCB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgJiYgaW5kZXggPiAwKSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdCdG5MZWZ0KTtcblxuXHRcdFx0fSBlbHNlIGlmKHRvdWNoU3RhcnRYIDwgdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlKSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdDbG9zZUJ0bkZpbGxlZCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZVwiKTtcblx0XHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLWxlZnRcIik7XG5cdFx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdH1cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzd2lwZUVuZChlOiBhbnkpIHtcblx0XHRcdGxldCB0b3VjaG9iaiAgID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblx0XHRcdGxldCB0b3VjaE1vdmVYID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCk7XG5cdFx0XHRsZXQgdG91Y2hNb3ZlWSA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFkpO1xuXHRcdFx0bGV0IGRpc3RZID0gTWF0aC5hYnModG91Y2hNb3ZlWSAtIHRvdWNoU3RhcnRZKTtcblx0XHRcdGxldCBkaXN0WCA9IE1hdGguYWJzKHRvdWNoTW92ZVggLSB0b3VjaFN0YXJ0WCk7XG5cdFx0XHRsZXQgZGlyZWN0aW9uTGluZSA9IHZpZXdlci5kaXJlY3Rpb25MaW5lO1xuXG5cdFx0XHR0b3VjaEVuZCA9IHRvdWNoTW92ZVg7XG5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLWxlZnRcIik7XG5cdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtcmlnaHRcIik7XG5cblx0XHRcdGlmICh0b3VjaFN0YXJ0WCA+IHRvdWNoRW5kICYmXG5cdFx0XHRcdFx0ZGlzdFggPiBtaW5Ub3VjaERpc3RhbmNlICYmXG5cdFx0XHRcdFx0ZGlzdFkgPCBhbGxvd2VkVG91Y2hEaXN0YW5jZSApIHtcblxuXHRcdFx0XHRuZXh0SW1hZ2UoKTtcblx0XHRcdH0gZWxzZSBpZiAodG91Y2hTdGFydFggPCB0b3VjaEVuZCAmJlxuXHRcdFx0XHRcdGRpc3RYID4gbWluVG91Y2hEaXN0YW5jZSAmJlxuXHRcdFx0XHRcdGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UpIHtcblxuXHRcdFx0XHRwcmV2SW1hZ2UoKTtcblx0XHRcdH0gZWxzZSBpZiAoZGlzdFkgPiAyMDApIHtcblxuXHRcdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNoYW5nZUhpc3RvcnkoZXZlbnQ6IGFueSkge1xuXHRcdFx0Y2xvc2VWaWV3ZXIoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0aW5pdDogaW5pdFxuXHRcdH1cblx0fSgpKTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IHdhbG51dC5pbml0XG5cdH1cbn0pKHdpbmRvdyk7XG4iXX0=
