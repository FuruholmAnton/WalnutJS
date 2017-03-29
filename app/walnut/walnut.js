(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.findAncestor = findAncestor;
function isFullscreenEnabled() {
    return document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled;
}
exports.isFullscreenEnabled = isFullscreenEnabled;
exports.launchIntoFullscreen = undefined;
exports.exitFullscreen = undefined;
exports.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
exports.fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
exports.launchIntoFullscreen = function (element) {
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
exports.exitFullscreen = function () {
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
exports.doDeviceHaveTouch = doDeviceHaveTouch;
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
exports.resizeEvent = resizeEvent;
function once(fn, context) {
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
exports.once = once;
function getComputedTranslateY(obj) {
    if (!window.getComputedStyle)
        return;
    var style = getComputedStyle(obj), transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat)
        return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}
exports.getComputedTranslateY = getComputedTranslateY;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
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
    "use strict";
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
    var clickTarget;
    var listContainer = {
        dragstartY: 0,
        dragendY: 0,
        lastY: 0,
        draging: false,
        translatedY: 0,
        dragCanceled: false
    };
    var allowedTouchDistance = 100;
    var minTouchDistance = 20;
    function getContainers() {
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
    }
    function init() {
        var newPath;
        CONTAINERS = getContainers();
        indexImages();
        buildViewer();
        if (helper_1.doDeviceHaveTouch()) {
            viewer.wrapper.classList.add("walnut--is-touch");
        }
    }
    /**
     * Adds and removes event on open and close
     * REVIEW: Add once and dont remove. preformance benefits?
     */
    var initEvents = helper_1.once(function () {
        var mainImage = viewer.mainImage;
        viewer.wrapper.addEventListener("click", clickWrapper, false);
        viewer.closeBtn.addEventListener("click", closeViewer, false);
        viewer.fullscreenBtn.addEventListener("click", fullscreen, false);
        document.addEventListener("keyup", checkKeyPressed, false);
        // viewer.listHandle.addEventListener('drag', onDragingPreviewList);
        // viewer.listHandle.addEventListener('dragstart', onDragPreviewList);
        // viewer.listHandle.addEventListener('dragend', onDragEndPreviewList);
        viewer.wrapper.addEventListener('mousemove', onDragingPreviewList);
        viewer.wrapper.addEventListener('mousedown', onDragPreviewList);
        viewer.wrapper.addEventListener('mouseup', onDragEndPreviewList);
        if (helper_1.doDeviceHaveTouch()) {
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
        helper_1.resizeEvent(fixViewer);
    }
    function deinitFlexEvents() {
        document.removeEventListener("keyup", checkKeyPressed);
        window.removeEventListener("popstate", changeHistory);
        helper_1.resizeEvent(fixViewer, "remove");
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
        var listHandle = document.createElement("div");
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
        listHandle.className = "walnut__list-handle";
        mainImage.className = "walnut__image";
        mainImageContainer.className = "walnut__image-container";
        box.className = "walnut__box";
        wrapper.className = "walnut__wrapper";
        nextBtn.className = "walnut__navigation walnut__navigation--next";
        prevBtn.className = "walnut__navigation walnut__navigation--prev";
        elDirectionArrow.className = "walnut__direction-arrow";
        elDirectionLine.className = "walnut__direction-line";
        /**
         * Set attributes
         */
        // listContainer.setAttribute('draggable', 'true');
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
        listContainer.appendChild(listHandle);
        box.appendChild(mainImageContainer);
        wrapper.appendChild(listContainer);
        wrapper.appendChild(g_svgCloseBtn);
        wrapper.appendChild(box);
        document.body.appendChild(wrapper);
        /**
         * Add Fullscreen button when not in fullscreen mode
         */
        if (!!helper_1.isFullscreenEnabled()) {
            wrapper.appendChild(g_svgFullscreenBtn);
        }
        /**
         * Make variables global for walnut
         */
        viewer.listHandle = listHandle;
        viewer.listContainer = listContainer;
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
        container = helper_1.findAncestor(e.target, "walnut");
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
        if (e.target !== this || clickTarget !== viewer.wrapper) {
            return;
        }
        closeViewer.call(this);
    }
    function fullscreen(option) {
        var wrapper = viewer.wrapper;
        var fullscreenBtn = viewer.fullscreenBtn;
        if (option === "exit") {
            helper_1.exitFullscreen();
            fullscreenBtn.classList.remove("walnut__fullscreen--hidden");
        }
        else {
            helper_1.launchIntoFullscreen(wrapper);
            fullscreenBtn.classList.add("walnut__fullscreen--hidden");
        }
    }
    function nextImage() {
        changeImage.call(this, "next");
    }
    function prevImage() {
        changeImage.call(this, "prev");
    }
    function onDragPreviewList(e) {
        var target = e.target;
        clickTarget = target;
        if (target.matches('.walnut__list-handle')) {
            e.preventDefault();
            console.log('dragStart', e);
            listContainer.dragstartY = e.clientY;
            listContainer.draging = true;
        }
    }
    function onDragingPreviewList(e) {
        e.preventDefault();
        var y = parseFloat(e.clientY);
        if (listContainer.draging && !listContainer.dragCanceled && (y > (listContainer.dragstartY + 1) ||
            y < (listContainer.dragstartY - 1))) {
            window.requestAnimationFrame(function () {
                var startY = listContainer.dragstartY;
                var translated = listContainer.translatedY;
                var newY = translated + (y - startY);
                if (newY < 0) {
                    listContainer.dragCanceled = true;
                    return;
                }
                newY = Math.min(100, newY); // TODO: change 100 to list height
                console.log('drag', newY);
                viewer.listContainer.style.transform = "translate3d(0," + newY + "px,0)";
            });
        }
    }
    function onDragEndPreviewList(e) {
        if (listContainer.draging) {
            e.preventDefault();
            e.stopPropagation();
            var newY = (listContainer.translatedY + (e.clientY - listContainer.dragstartY));
            newY = Math.max(0, newY);
            newY = Math.min(100, newY);
            listContainer.translatedY = newY;
            listContainer.draging = false;
            listContainer.dragCanceled = false;
            console.log('dragEnd', listContainer.translatedY);
        }
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
window.walnut = walnut;

},{"./helper":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvd2FsbnV0L2hlbHBlci50cyIsImFwcC93YWxudXQvd2FsbnV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7O0VBR0U7QUFDRixzQkFBOEIsRUFBZSxFQUFFLEdBQVc7SUFDekQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ1gsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQztRQUFDLENBQUM7SUFDL0QsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNQLElBQUksR0FBRyxFQUFFLENBQUM7UUFDVixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUFDLENBQUM7UUFDckUsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNiLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsOEVBQThFLENBQUMsQ0FBQztRQUNqRyxDQUFDO0lBQ0YsQ0FBQztBQUNMLENBQUM7QUFkRCxvQ0FjQztBQUVEO0lBQ0MsTUFBTSxDQUFPLFFBQVMsQ0FBQyxpQkFBaUI7UUFDakMsUUFBUyxDQUFDLHVCQUF1QjtRQUNqQyxRQUFTLENBQUMsb0JBQW9CO1FBQzlCLFFBQVMsQ0FBQyxtQkFBbUIsQ0FBQztBQUN0QyxDQUFDO0FBTEQsa0RBS0M7QUFFVSxRQUFBLG9CQUFvQixHQUFRLFNBQVMsQ0FBQztB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LENBQUMsQ0FBQztBQUVDLE1BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4qIExvb2tzIGZvciB0aGUgYXR0cmlidXRlIGZpcnN0LlxuKiBJZiBubyBlbGVtZW50cyBhcmUgZm91bmQgdGhlbiB0cmllcyB3aXRoIGNsYXNzTGlzdFxuKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQW5jZXN0b3IgKGVsOiBIVE1MRWxlbWVudCwgY2xzOiBzdHJpbmcpIHtcblx0bGV0IGVsZW0gPSBlbDtcbiAgICB3aGlsZSAoKGVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQpICYmICFlbGVtLmhhc0F0dHJpYnV0ZShjbHMpKTtcbiAgICBpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgXHRyZXR1cm4gZWxlbTtcbiAgICB9IGVsc2Uge1xuICAgIFx0ZWxlbSA9IGVsO1xuICAgIFx0d2hpbGUgKChlbGVtID0gZWxlbS5wYXJlbnRFbGVtZW50KSAmJiAhZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2xzKSk7XG4gICAgXHRpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgXHRcdHJldHVybiBlbGVtO1xuICAgIFx0fSBlbHNlIHtcbiAgICBcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhbnkgY29udGFpbmVyIHdpdGggYXR0cmlidXRlIG9yIGNsYXNzICd3YWxudXQnIG9mIHRoaXMgZWxlbWVudFwiKTtcbiAgICBcdH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bGxzY3JlZW5FbmFibGVkKCkge1xuXHRyZXR1cm4gKDxhbnk+ZG9jdW1lbnQpLmZ1bGxzY3JlZW5FbmFibGVkIHx8XG5cdFx0KDxhbnk+ZG9jdW1lbnQpLndlYmtpdEZ1bGxzY3JlZW5FbmFibGVkIHx8XG5cdFx0KDxhbnk+ZG9jdW1lbnQpLm1vekZ1bGxTY3JlZW5FbmFibGVkIHx8XG5cdFx0KDxhbnk+ZG9jdW1lbnQpLm1zRnVsbHNjcmVlbkVuYWJsZWQ7XG59XG5cbmV4cG9ydCBsZXQgbGF1bmNoSW50b0Z1bGxzY3JlZW46IGFueSA9IHVuZGVmaW5lZDtcbmV4cG9ydCBsZXQgZXhpdEZ1bGxzY3JlZW46IGFueSA9IHVuZGVmaW5lZDtcblxuXG5cbmV4cG9ydCBsZXQgZnVsbHNjcmVlbkVuYWJsZWQgPSAoPGFueT5kb2N1bWVudCkuZnVsbHNjcmVlbkVuYWJsZWQgfHwgKDxhbnk+ZG9jdW1lbnQpLm1vekZ1bGxTY3JlZW5FbmFibGVkIHx8ICg8YW55PmRvY3VtZW50KS53ZWJraXRGdWxsc2NyZWVuRW5hYmxlZDtcbmV4cG9ydCBsZXQgZnVsbHNjcmVlbkVsZW1lbnQgPSAoPGFueT5kb2N1bWVudCkuZnVsbHNjcmVlbkVsZW1lbnQgfHwgKDxhbnk+ZG9jdW1lbnQpLm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8ICg8YW55PmRvY3VtZW50KS53ZWJraXRGdWxsc2NyZWVuRWxlbWVudDtcblxuXHRsYXVuY2hJbnRvRnVsbHNjcmVlbiA9IGZ1bmN0aW9uIChlbGVtZW50OiBhbnkpIHtcblx0ICBpZihlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XG5cdCAgICBlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdCAgfSBlbHNlIGlmKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcblx0ICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcblx0ICB9IGVsc2UgaWYoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikge1xuXHQgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHQgIH0gZWxzZSBpZihlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcblx0ICAgIGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHQgIH1cblx0fTtcblxuXHRleGl0RnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcblx0ICBpZigoPGFueT5kb2N1bWVudCkuZXhpdEZ1bGxzY3JlZW4pIHtcblx0ICAgICg8YW55PmRvY3VtZW50KS5leGl0RnVsbHNjcmVlbigpO1xuXHQgIH0gZWxzZSBpZigoPGFueT5kb2N1bWVudCkubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuXHQgICAgKDxhbnk+ZG9jdW1lbnQpLm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcblx0ICB9IGVsc2UgaWYoKDxhbnk+ZG9jdW1lbnQpLndlYmtpdEV4aXRGdWxsc2NyZWVuKSB7XG5cdCAgICAoPGFueT5kb2N1bWVudCkud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcblx0ICB9XG5cdH1cblxuXG4vKipcbiAqIFtkb0RldmljZUhhdmVUb3VjaCBkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvRGV2aWNlSGF2ZVRvdWNoKCkge1xuXHR2YXIgYm9vbCA9IGZhbHNlO1xuICAgIGlmICgoJ29udG91Y2hzdGFydCcgaW4gKDxhbnk+d2luZG93KSkgfHwgKDxhbnk+d2luZG93KS5Eb2N1bWVudFRvdWNoKSB7XG4gICAgICBib29sID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGJvb2w7XG59XG5cbi8qKlxuICogT24gUmVzaXplRXZlbnQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZUV2ZW50KGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIGFjdGlvbjogc3RyaW5nID0gdW5kZWZpbmVkKSB7XG5cdGlmKGFjdGlvbiA9PT0gXCJyZW1vdmVcIikge1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjYWxsYmFjaywgdHJ1ZSk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBjYWxsYmFjayk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNhbGxiYWNrLCB0cnVlKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGNhbGxiYWNrKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb25jZShmbjogYW55LCBjb250ZXh0OiBhbnkgPSB1bmRlZmluZWQpIHtcblx0Ly8gZnVuY3Rpb24gY2FuIG9ubHkgZmlyZSBvbmNlXG5cdGxldCByZXN1bHQ6IGFueTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0aWYoZm4pIHtcblx0XHRcdHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQgfHwgdGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGZuID0gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tcHV0ZWRUcmFuc2xhdGVZKG9iajogYW55KVxue1xuICAgIGlmKCF3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkgcmV0dXJuO1xuICAgIHZhciBzdHlsZTogYW55ID0gZ2V0Q29tcHV0ZWRTdHlsZShvYmopLFxuICAgICAgICB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gfHwgc3R5bGUud2Via2l0VHJhbnNmb3JtIHx8IHN0eWxlLm1velRyYW5zZm9ybTtcbiAgICB2YXIgbWF0ID0gdHJhbnNmb3JtLm1hdGNoKC9ebWF0cml4M2RcXCgoLispXFwpJC8pO1xuICAgIGlmKG1hdCkgcmV0dXJuIHBhcnNlRmxvYXQobWF0WzFdLnNwbGl0KCcsICcpWzEzXSk7XG4gICAgbWF0ID0gdHJhbnNmb3JtLm1hdGNoKC9ebWF0cml4XFwoKC4rKVxcKSQvKTtcbiAgICByZXR1cm4gbWF0ID8gcGFyc2VGbG9hdChtYXRbMV0uc3BsaXQoJywgJylbNV0pIDogMDtcbn1cbiIsImltcG9ydCB7XG5cdGZ1bGxzY3JlZW5FbmFibGVkLFxuXHRmdWxsc2NyZWVuRWxlbWVudCxcblx0ZmluZEFuY2VzdG9yLFxuXHRpc0Z1bGxzY3JlZW5FbmFibGVkLFxuXHRkb0RldmljZUhhdmVUb3VjaCxcblx0cmVzaXplRXZlbnQsXG5cdGxhdW5jaEludG9GdWxsc2NyZWVuLFxuXHRleGl0RnVsbHNjcmVlbixcblx0b25jZSxcblx0Z2V0Q29tcHV0ZWRUcmFuc2xhdGVZXG59IGZyb20gJy4vaGVscGVyJztcblxuLyoqXG4gKiBVc2UgU1ZHIGFzIGlubGluZSBKYXZhU2NyaXB0XG4gKi9cbmNvbnN0IHN2Z0Nsb3NlQnRuID0gJzxzdmcgY2xhc3M9XCJ3YWxudXQtY2xvc2VcIiB2aWV3Qm94PVwiMCAwIDgwMCA4MDBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40XCI+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMjEuNiA2MS42bDM4LjgtMzlMNzc1IDczNy4zbC0zOSAzOXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMjEuNiA2MS42bDM4LjgtMzlMNzc1IDczNy4zbC0zOSAzOXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNMi44IDgwLjRMODAuMyAzbDcxNC40IDcxNC4zLTc3LjUgNzcuNXpcIi8+PHBhdGggY2xhc3M9XCJ3YWxudXQtY2xvc2VfX3BhdGhcIiBmaWxsPVwiI2ZmZlwiIGQ9XCJNNzk3LjcgODIuNUw3MTcuMiAyIDIuOCA3MTYuNCA4My4yIDc5N3pcIi8+PC9zdmc+JztcbmNvbnN0IHN2Z0Nsb3NlQnRuRmlsbGVkID0gJzxzdmcgdmlld0JveD1cIjAgMCA4MDAgODAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEuNFwiPjxwYXRoIGQ9XCJNNDAwIDcuMmMyMTkuNCAwIDM5Ny42IDE3Ni4zIDM5Ny42IDM5My41UzYxOS40IDc5NC4zIDQwMCA3OTQuM0MxODAuNiA3OTQuMyAyLjQgNjE4IDIuNCA0MDAuNyAyLjQgMTgzLjUgMTgwLjYgNy4yIDQwMCA3LjJ6bS00OC4yIDM4OUwxNTMuMiA1OTVsNTAuMiA1MC4yTDQwMiA0NDYuNSA1OTkuNCA2NDRsNDguNC00OC41TDQ1MC41IDM5OGwxOTkuMi0xOTktNTAuMi01MC40TDQwMC4yIDM0OCAyMDEuNSAxNDkgMTUzIDE5Ny42IDM1MiAzOTYuM3pcIiBmaWxsPVwiI2ZmZlwiLz48L3N2Zz4nO1xuY29uc3Qgc3ZnRnVsbHNjcmVlbkJ0biA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0X19mdWxsc2NyZWVuXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxLjRcIj48cGF0aCBkPVwiTTMuNCAxNS40SDBWMjRoOC42di0zLjRIMy40di01LjJ6TTAgOC42aDMuNFYzLjRoNS4yVjBIMHY4LjZ6bTIwLjYgMTJoLTUuMlYyNEgyNHYtOC42aC0zLjR2NS4yek0xNS40IDB2My40aDUuMnY1LjJIMjRWMGgtOC42elwiIGZpbGw9XCIjZmZmXCIgZmlsbC1ydWxlPVwibm9uemVyb1wiLz48L3N2Zz4nO1xuY29uc3Qgc3ZnQnRuTGVmdCA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0X19uYXZpZ2F0aW9uLWltZ1wiIHZpZXdCb3g9XCIwIDAgNDUgNDVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMS40MVwiPjxnIGZpbGw9XCIjZmZmXCIgZmlsbC1ydWxlPVwibm9uemVyb1wiPjxwYXRoIGQ9XCJNMjIuMTIgNDQuMjRjMTIuMiAwIDIyLjEyLTkuOTMgMjIuMTItMjIuMTJDNDQuMjQgOS45MiAzNC4zIDAgMjIuMTIgMCA5LjkyIDAgMCA5LjkyIDAgMjIuMTJjMCAxMi4yIDkuOTIgMjIuMTIgMjIuMTIgMjIuMTJ6bTAtNDIuNzRjMTEuMzcgMCAyMC42MiA5LjI1IDIwLjYyIDIwLjYyIDAgMTEuMzctOS4yNSAyMC42Mi0yMC42MiAyMC42Mi0xMS4zNyAwLTIwLjYyLTkuMjUtMjAuNjItMjAuNjJDMS41IDEwLjc1IDEwLjc1IDEuNSAyMi4xMiAxLjV6XCIvPjxwYXRoIGQ9XCJNMjQuOSAyOS44OGMuMiAwIC4zOC0uMDcuNTItLjIyLjMtLjMuMy0uNzYgMC0xLjA2bC02LjgtNi44IDYuOC02LjhjLjMtLjMuMy0uNzcgMC0xLjA2LS4zLS4zLS43Ni0uMy0xLjA2IDBsLTcuMzIgNy4zM2MtLjMuMy0uMy43NyAwIDEuMDZsNy4zMiA3LjMzYy4xNS4xNS4zNC4yMi41My4yMnpcIi8+PC9nPjwvc3ZnPic7XG5jb25zdCBzdmdCdG5SaWdodCA9ICc8c3ZnIGNsYXNzPVwid2FsbnV0X19uYXZpZ2F0aW9uLWltZ1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDQ0LjIzNiA0NC4yMzZcIj48ZyBmaWxsPVwiI0ZGRlwiPjxwYXRoIGQ9XCJNMjIuMTIgNDQuMjRDOS45MiA0NC4yNCAwIDM0LjMgMCAyMi4xMlM5LjkyIDAgMjIuMTIgMHMyMi4xMiA5LjkyIDIyLjEyIDIyLjEyLTkuOTMgMjIuMTItMjIuMTIgMjIuMTJ6bTAtNDIuNzRDMTAuNzUgMS41IDEuNSAxMC43NSAxLjUgMjIuMTJjMCAxMS4zNyA5LjI1IDIwLjYyIDIwLjYyIDIwLjYyIDExLjM3IDAgMjAuNjItOS4yNSAyMC42Mi0yMC42MiAwLTExLjM3LTkuMjUtMjAuNjItMjAuNjItMjAuNjJ6XCIvPjxwYXRoIGQ9XCJNMTkuMzQgMjkuODhjLS4yIDAtLjM4LS4wNy0uNTMtLjIyLS4yOC0uMy0uMjgtLjc2IDAtMS4wNmw2LjgtNi44LTYuOC02LjhjLS4yOC0uMy0uMjgtLjc3IDAtMS4wNy4zLS4zLjc4LS4zIDEuMDcgMGw3LjMzIDcuMzRjLjMuMy4zLjc3IDAgMS4wNmwtNy4zMyA3LjMzYy0uMTQuMTUtLjM0LjIyLS41My4yMnpcIi8+PC9nPjwvc3ZnPic7XG5cbmNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbmNvbnN0IGdfc3ZnQ2xvc2VCdG4gPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0Nsb3NlQnRuLCBcImltYWdlL3N2Zyt4bWxcIikuZG9jdW1lbnRFbGVtZW50O1xuY29uc3QgZ19zdmdDbG9zZUJ0bkZpbGxlZCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3ZnQ2xvc2VCdG5GaWxsZWQsIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQ7XG5jb25zdCBnX3N2Z0Z1bGxzY3JlZW5CdG4gPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0Z1bGxzY3JlZW5CdG4sIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQ7XG5jb25zdCBnX3N2Z0J0bkxlZnQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2Z0J0bkxlZnQsIFwiaW1hZ2Uvc3ZnK3htbFwiKS5kb2N1bWVudEVsZW1lbnQ7XG5jb25zdCBnX3N2Z0J0blJpZ2h0ID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhzdmdCdG5SaWdodCwgXCJpbWFnZS9zdmcreG1sXCIpLmRvY3VtZW50RWxlbWVudDtcblxuLyoqXG4gKiBbd2FsbnV0IGRlc2NyaXB0aW9uXVxuICovXG5jb25zdCB3YWxudXQgPSAoZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8qIEdsb2JhbHMgd2l0aGluIHdhbG51dCAqL1xuXHRsZXQgcGF0aDtcblx0bGV0IHBhdGhBcnJheTtcblx0bGV0IHBhdGhNaWRkbGU7XG5cdGxldCBuZXdQYXRobmFtZTtcblx0bGV0IGk7XG5cdGxldCBuYXZpZ2F0aW9uQnV0dG9ucztcblx0bGV0IGNvbnRhaW5lckluZGV4OiBzdHJpbmc7XG5cblx0bGV0IENPTlRBSU5FUlM6IGFueSA9IFtdO1xuXHRsZXQgY29udGFpbmVyQXJyYXk6IGFueSA9IFtdO1xuXHRsZXQgdmlld2VyOiBhbnkgPSB7fTtcblx0bGV0IGNvbmZpZzogYW55ID0ge307XG5cdGxldCB0b3VjaFN0YXJ0OiBudW1iZXIgPSAwO1xuXHRsZXQgdG91Y2hTdGFydFg6IG51bWJlciA9IDA7XG5cdGxldCB0b3VjaFN0YXJ0WTogbnVtYmVyID0gMDtcblx0bGV0IHRvdWNoRW5kOiBudW1iZXIgPSAwO1xuXG5cdGxldCBjbGlja1RhcmdldDogYW55O1xuXG5cdGxldCBsaXN0Q29udGFpbmVyIDoge1xuXHRcdGRyYWdzdGFydFk6IG51bWJlcixcblx0XHRkcmFnZW5kWTogbnVtYmVyLFxuXHRcdGxhc3RZOiBudW1iZXIsXG5cdFx0ZHJhZ2luZzogYm9vbGVhbixcblx0XHR0cmFuc2xhdGVkWTogbnVtYmVyLFxuXHRcdGRyYWdDYW5jZWxlZDogYm9vbGVhblxuXHR9ID0ge1xuXHRcdGRyYWdzdGFydFk6IDAsXG5cdFx0ZHJhZ2VuZFk6IDAsXG5cdFx0bGFzdFk6IDAsXG5cdFx0ZHJhZ2luZzogZmFsc2UsXG5cdFx0dHJhbnNsYXRlZFk6IDAsXG5cdFx0ZHJhZ0NhbmNlbGVkOiBmYWxzZVxuXHR9XG5cblx0Y29uc3QgYWxsb3dlZFRvdWNoRGlzdGFuY2U6IG51bWJlciA9IDEwMDtcblx0Y29uc3QgbWluVG91Y2hEaXN0YW5jZTogbnVtYmVyID0gMjA7XG5cblxuXHRmdW5jdGlvbiBnZXRDb250YWluZXJzKCkge1xuXHRcdGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t3YWxudXRdJyk7XG5cdFx0aWYgKGVsZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiBlbGVtcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZWxlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3YWxudXQnKTtcblx0XHRcdGlmIChlbGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihcIkNvdWxkbid0IGZpbmQgYW55IGNvbnRhaW5lcnMgZm9yIFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdGxldCBuZXdQYXRoO1xuXG5cdFx0Q09OVEFJTkVSUyA9IGdldENvbnRhaW5lcnMoKTtcblxuXHRcdGluZGV4SW1hZ2VzKCk7XG5cdFx0YnVpbGRWaWV3ZXIoKTtcblxuXHRcdGlmIChkb0RldmljZUhhdmVUb3VjaCgpKSB7XG5cdFx0XHR2aWV3ZXIud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwid2FsbnV0LS1pcy10b3VjaFwiKTtcblx0XHR9XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBBZGRzIGFuZCByZW1vdmVzIGV2ZW50IG9uIG9wZW4gYW5kIGNsb3NlXG5cdCAqIFJFVklFVzogQWRkIG9uY2UgYW5kIGRvbnQgcmVtb3ZlLiBwcmVmb3JtYW5jZSBiZW5lZml0cz9cblx0ICovXG5cdGNvbnN0IGluaXRFdmVudHMgPSBvbmNlKGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IG1haW5JbWFnZSA9IHZpZXdlci5tYWluSW1hZ2U7XG5cdFx0dmlld2VyLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrV3JhcHBlciwgZmFsc2UpO1xuXHRcdHZpZXdlci5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VWaWV3ZXIsIGZhbHNlKTtcblx0XHR2aWV3ZXIuZnVsbHNjcmVlbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVsbHNjcmVlbiwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBjaGVja0tleVByZXNzZWQsIGZhbHNlKTtcblxuXHRcdC8vIHZpZXdlci5saXN0SGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBvbkRyYWdpbmdQcmV2aWV3TGlzdCk7XG5cdFx0Ly8gdmlld2VyLmxpc3RIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0Jywgb25EcmFnUHJldmlld0xpc3QpO1xuXHRcdC8vIHZpZXdlci5saXN0SGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCBvbkRyYWdFbmRQcmV2aWV3TGlzdCk7XG5cblx0XHR2aWV3ZXIud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbkRyYWdpbmdQcmV2aWV3TGlzdCk7XG5cdFx0dmlld2VyLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25EcmFnUHJldmlld0xpc3QpO1xuXHRcdHZpZXdlci53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbkRyYWdFbmRQcmV2aWV3TGlzdCk7XG5cblx0XHRpZiAoZG9EZXZpY2VIYXZlVG91Y2goKSkge1xuXHRcdFx0bWFpbkltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHN3aXBlU3RhcnQpO1xuXHRcdFx0bWFpbkltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBzd2lwZUVuZCk7XG5cdFx0XHRtYWluSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBzd2lwZU1vdmUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2aWV3ZXIubmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbmV4dEltYWdlKTtcblx0XHRcdHZpZXdlci5wcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcmV2SW1hZ2UpO1xuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gaW5pdEZsZXhFdmVudHMoKSB7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGNoZWNrS2V5UHJlc3NlZCk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBjaGFuZ2VIaXN0b3J5KTtcblx0XHRyZXNpemVFdmVudChmaXhWaWV3ZXIpO1xuXHR9XG5cdGZ1bmN0aW9uIGRlaW5pdEZsZXhFdmVudHMoKSB7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGNoZWNrS2V5UHJlc3NlZCk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBjaGFuZ2VIaXN0b3J5KTtcblx0XHRyZXNpemVFdmVudChmaXhWaWV3ZXIsIFwicmVtb3ZlXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGV4ZXMgYXMgaW1hZ2VzIHNvIHJlbGF0ZWQgaW1hZ2VzIHdpbGwgc2hvdyBhcyB0aHVtYm5haWxzIHdoZW4gb3BlbmluZyB0aGUgdmlld2VyXG5cdCAqL1xuXHRmdW5jdGlvbiBpbmRleEltYWdlcygpe1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgQ09OVEFJTkVSUy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHRjb250YWluZXJBcnJheS5wdXNoKHtcblx0XHRcdFx0Y29udGFpbmVyOiBDT05UQUlORVJTW2ldLFxuXHRcdFx0XHRpbWFnZXM6IFtdXG5cdFx0XHR9KTtcblxuXHRcdFx0Q09OVEFJTkVSU1tpXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1jb250YWluZXJcIiwgaSk7XG5cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQdXRzIGltYWdlcyBpbiBhIGFycmF5LiBGaW5kcyBhbGwgaW1hZ2VzIHdpdGggZWl0aGVyOlxuXHRcdFx0ICogQ0xBU1Mgb3IgQVRUUklCVVRFIHdpdGggXCJ3YWxudXQtaW1hZ2VcIlxuXHRcdFx0ICogSWYgbmVpdGhlciBpcyBmb3VuZCB0aGVuIGl0IHdpbGwgbG9vayBmb3IgYWxsIDxpbWc+IHRhZ3Ncblx0XHRcdCAqXG5cdFx0XHQgKi9cblx0XHRcdGxldCBpbWcgPSBDT05UQUlORVJTW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpO1xuXHRcdFx0bGV0IGJnT2xkID0gQ09OVEFJTkVSU1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwid2FsbnV0LWltYWdlXCIpO1xuXHRcdFx0bGV0IGJnID0gQ09OVEFJTkVSU1tpXS5xdWVyeVNlbGVjdG9yQWxsKCdbd2FsbnV0LWltYWdlXScpO1xuXHRcdFx0bGV0IGltYWdlcyA9IFtdO1xuXG5cdFx0XHRpZiAoYmdPbGQubGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgYmdPbGQubGVuZ3RoOyB4KyspIHtcblx0XHRcdFx0XHRpbWFnZXMucHVzaChiZ09sZFt4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChiZy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBiZy5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRcdGltYWdlcy5wdXNoKGJnW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFiZ09sZC5sZW5ndGggJiYgIWJnLmxlbmd0aCAmJiBpbWcgKSB7XG5cdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgaW1nLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdFx0aW1hZ2VzLnB1c2goaW1nW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgaW1hZ2VzLmxlbmd0aDsgaisrKSB7XG5cblx0XHRcdFx0aW1hZ2VzW2pdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvcGVuVmlld2VyKTtcblxuXHRcdFx0XHRpbWFnZXNbal0uc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgaik7XG5cblx0XHRcdFx0bGV0IHNyYztcblxuXHRcdFx0XHRpZihpbWFnZXNbal0uc3JjKSB7XG5cdFx0XHRcdFx0c3JjID0gaW1hZ2VzW2pdLnNyY1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxldCBzdHlsZSA9IGltYWdlc1tqXS5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaW1hZ2VzW2pdLCBudWxsKTtcblx0XHRcdFx0XHRzcmMgPSBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2Uuc2xpY2UoNCwgLTEpLnJlcGxhY2UoL1wiL2csIFwiXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29udGFpbmVyQXJyYXlbaV0uaW1hZ2VzLnB1c2goe1xuXHRcdFx0XHRcdGVsZW06IGltYWdlc1tqXSxcblx0XHRcdFx0XHRzcmM6IHNyYyxcblx0XHRcdFx0XHRpbmRleDogalxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIEVsZW1lbnRzIHRoYXQgYnVpbGRzIHVwIHRoZSB2aWV3ZXJcblx0ICovXG5cdGZ1bmN0aW9uIGJ1aWxkVmlld2VyKCkge1xuXHRcdGNvbnN0IHVsOiBIVE1MRWxlbWVudCBcdFx0XHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdFx0Y29uc3QgbGlzdENvbnRhaW5lcjogSFRNTEVsZW1lbnQgXHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjb25zdCBsaXN0SGFuZGxlOiBIVE1MRWxlbWVudCBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y29uc3Qgd3JhcHBlcjogSFRNTEVsZW1lbnQgXHRcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y29uc3QgYm94OiBIVE1MRWxlbWVudCAgXHRcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y29uc3QgbWFpbkltYWdlOiBIVE1MRWxlbWVudCBcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdFx0Y29uc3QgbWFpbkltYWdlQ29udGFpbmVyOiBIVE1MRWxlbWVudCBcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjb25zdCBuZXh0QnRuOiBIVE1MRWxlbWVudCBcdFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjb25zdCBwcmV2QnRuOiBIVE1MRWxlbWVudCBcdFx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjb25zdCBjbG9zZUJ0bjogSFRNTEVsZW1lbnQgXHRcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXHRcdGNvbnN0IGVsRGlyZWN0aW9uQXJyb3c6IEhUTUxFbGVtZW50ICAgIFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGNvbnN0IGVsRGlyZWN0aW9uTGluZTogSFRNTEVsZW1lbnQgICAgXHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblx0XHQvKipcblx0XHQgKiBBZGQgQ1NTIGNsYXNzZXMgdG8gdGhlIGVsZW1lbnRzXG5cdFx0ICovXG5cdFx0dWwuY2xhc3NOYW1lIFx0XHRcdFx0XHQ9IFwid2FsbnV0X19saXN0XCI7XG5cdFx0bGlzdENvbnRhaW5lci5jbGFzc05hbWUgXHRcdD0gXCJ3YWxudXRfX2xpc3QtY29udGFpbmVyXCI7XG5cdFx0bGlzdEhhbmRsZS5jbGFzc05hbWUgXHRcdFx0PSBcIndhbG51dF9fbGlzdC1oYW5kbGVcIjtcblx0XHRtYWluSW1hZ2UuY2xhc3NOYW1lIFx0XHRcdD0gXCJ3YWxudXRfX2ltYWdlXCI7XG5cdFx0bWFpbkltYWdlQ29udGFpbmVyLmNsYXNzTmFtZSBcdD0gXCJ3YWxudXRfX2ltYWdlLWNvbnRhaW5lclwiXG5cdFx0Ym94LmNsYXNzTmFtZSBcdFx0XHRcdFx0PSBcIndhbG51dF9fYm94XCI7XG5cdFx0d3JhcHBlci5jbGFzc05hbWUgXHRcdFx0XHQ9IFwid2FsbnV0X193cmFwcGVyXCI7XG5cdFx0bmV4dEJ0bi5jbGFzc05hbWUgXHRcdFx0XHQ9IFwid2FsbnV0X19uYXZpZ2F0aW9uIHdhbG51dF9fbmF2aWdhdGlvbi0tbmV4dFwiO1xuXHRcdHByZXZCdG4uY2xhc3NOYW1lIFx0XHRcdFx0PSBcIndhbG51dF9fbmF2aWdhdGlvbiB3YWxudXRfX25hdmlnYXRpb24tLXByZXZcIjtcblx0XHRlbERpcmVjdGlvbkFycm93LmNsYXNzTmFtZSBcdFx0PSBcIndhbG51dF9fZGlyZWN0aW9uLWFycm93XCI7XG5cdFx0ZWxEaXJlY3Rpb25MaW5lLmNsYXNzTmFtZSBcdFx0PSBcIndhbG51dF9fZGlyZWN0aW9uLWxpbmVcIjtcblxuXHRcdC8qKlxuXHRcdCAqIFNldCBhdHRyaWJ1dGVzXG5cdFx0ICovXG5cdFx0Ly8gbGlzdENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsICd0cnVlJyk7XG5cblx0XHQvKipcblx0XHQgKiBDb25uZWN0cyB0aGUgRWxlbWVudHMgYW5kIGNyZWF0ZXMgdGhlIHN0cnVjdHVyZVxuXHRcdCAqL1xuXHRcdG5leHRCdG4uYXBwZW5kQ2hpbGQoZ19zdmdCdG5SaWdodCk7XG5cdFx0cHJldkJ0bi5hcHBlbmRDaGlsZChnX3N2Z0J0bkxlZnQpO1xuXHRcdGVsRGlyZWN0aW9uTGluZS5hcHBlbmRDaGlsZChlbERpcmVjdGlvbkFycm93KTtcblx0XHRtYWluSW1hZ2VDb250YWluZXIuYXBwZW5kQ2hpbGQobWFpbkltYWdlKTtcblx0XHRtYWluSW1hZ2VDb250YWluZXIuYXBwZW5kQ2hpbGQobmV4dEJ0bik7XG5cdFx0bWFpbkltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZCdG4pO1xuXHRcdG1haW5JbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbERpcmVjdGlvbkxpbmUpO1xuXHRcdGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQodWwpO1xuXHRcdGxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQobGlzdEhhbmRsZSk7XG5cdFx0Ym94LmFwcGVuZENoaWxkKG1haW5JbWFnZUNvbnRhaW5lcik7XG5cdFx0d3JhcHBlci5hcHBlbmRDaGlsZChsaXN0Q29udGFpbmVyKTtcblx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGdfc3ZnQ2xvc2VCdG4pO1xuXHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoYm94KTtcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG5cblx0XHQvKipcblx0XHQgKiBBZGQgRnVsbHNjcmVlbiBidXR0b24gd2hlbiBub3QgaW4gZnVsbHNjcmVlbiBtb2RlXG5cdFx0ICovXG5cdFx0aWYoISFpc0Z1bGxzY3JlZW5FbmFibGVkKCkpIHtcblx0XHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoZ19zdmdGdWxsc2NyZWVuQnRuKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBNYWtlIHZhcmlhYmxlcyBnbG9iYWwgZm9yIHdhbG51dFxuXHRcdCAqL1xuXHRcdHZpZXdlci5saXN0SGFuZGxlIFx0PSBsaXN0SGFuZGxlO1xuXHRcdHZpZXdlci5saXN0Q29udGFpbmVyID0gbGlzdENvbnRhaW5lcjtcblx0XHR2aWV3ZXIuY2xvc2VCdG5cdFx0ID0gZ19zdmdDbG9zZUJ0bjtcblx0XHR2aWV3ZXIubmV4dEJ0biBcdFx0ID0gbmV4dEJ0bjtcblx0XHR2aWV3ZXIucHJldkJ0biBcdFx0ID0gcHJldkJ0bjtcblx0XHR2aWV3ZXIuZnVsbHNjcmVlbkJ0biAgPSBnX3N2Z0Z1bGxzY3JlZW5CdG47XG5cdFx0dmlld2VyLm1haW5JbWFnZSBcdCA9IG1haW5JbWFnZTtcblx0XHR2aWV3ZXIud3JhcHBlciBcdFx0ID0gd3JhcHBlcjtcblx0XHR2aWV3ZXIubGlzdCBcdFx0XHQgPSB1bDtcblx0XHR2aWV3ZXIuZGlyZWN0aW9uQXJyb3cgPSBlbERpcmVjdGlvbkFycm93O1xuXHRcdHZpZXdlci5kaXJlY3Rpb25MaW5lICA9IGVsRGlyZWN0aW9uTGluZTtcblx0XHR2aWV3ZXIuYm94IFx0XHRcdCA9IGJveDtcblxuXG5cdFx0aW5pdEV2ZW50cygpO1xuXHR9XG5cblxuXHQvKipcblx0ICogT3BlbnMgVmlld2VyIGFuZFxuXHQgKi9cblx0ZnVuY3Rpb24gb3BlblZpZXdlcihlOiBhbnkpIHtcblxuXHRcdGxldCBpbmRleDtcblx0XHRsZXQgY29udGFpbmVyO1xuXHRcdGxldCBsaXN0SXRlbTtcblx0XHRsZXQgbWFpbkltYWdlID0gdmlld2VyLm1haW5JbWFnZTtcblx0XHRsZXQgcHJldkJ0biA9IHZpZXdlci5wcmV2QnRuO1xuXHRcdGxldCBuZXh0QnRuID0gdmlld2VyLm5leHRCdG47XG5cdFx0bGV0IHNyYztcblx0XHRsZXQgc3R5bGU7XG5cblx0XHRjb250YWluZXIgPSBmaW5kQW5jZXN0b3IoZS50YXJnZXQsIFwid2FsbnV0XCIpXG5cdFx0Y29udGFpbmVySW5kZXggPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtY29udGFpbmVyXCIpO1xuXG5cdFx0c2V0SW1hZ2VzKGNvbnRhaW5lckluZGV4KTtcblxuXHRcdGluZGV4ID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKSk7XG5cblxuXHRcdHN0eWxlID0gdGhpcy5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcywgbnVsbCk7XG5cblx0XHQvKipcblx0XHQgKiBMb29rcyBmb3IgdGhlIGltYWdlIHNvdXJjZSBhbmQgaWYgbm90IGZvdW5kIGdldCB0aGUgYmFja2dyb3VuZCBpbWFnZVxuXHRcdCAqL1xuXHRcdGlmICh0aGlzLnNyYykge1xuXHRcdFx0c3JjID0gdGhpcy5zcmNcblx0XHR9IGVsc2UgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAhPSBcIm5vbmVcIikge1xuXHRcdFx0c3JjID0gc3R5bGUuYmFja2dyb3VuZEltYWdlLnNsaWNlKDQsIC0xKS5yZXBsYWNlKC9cIi9nLCBcIlwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIGltYWdlIGZvciBlbGVtZW50OiBcIiArIHRoaXMpO1xuXHRcdH1cblxuXHRcdG1haW5JbWFnZS5zcmMgPSBzcmM7XG5cdFx0bWFpbkltYWdlLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGluZGV4KTtcblxuXG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0LS1vcGVuXCIpO1xuXG5cdFx0aWYoaW5kZXggPT09IDAgJiYgaW5kZXggPT09IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHR9IGVsc2UgaWYoaW5kZXggPT09IDApIHtcblx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHR9ZWxzZSBpZihpbmRleCA9PT0gKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkgKSB7XG5cdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdH1cblxuXHRcdGluaXRGbGV4RXZlbnRzKCk7XG5cdFx0Zml4Vmlld2VyKCk7XG5cblx0XHR2aWV3ZXIud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X193cmFwcGVyLS1vcGVuXCIpO1xuXG5cdFx0bGV0IHN0YXRlT2JqID0gXCJ3YWxudXRcIjtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgXCJ3YWxudXRcIiwgXCJcIik7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHNldEltYWdlcyhjb250YWluZXJJbmRleDogYW55KSB7XG5cdFx0bGV0IGltZztcblx0XHRsZXQgbGk7XG5cdFx0bGV0IGxpc3QgPSB2aWV3ZXIubGlzdDtcblxuXHRcdGxpc3QuaW5uZXJIVE1MID0gXCJcIjtcblxuXHRcdGlmKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuXHRcdFx0XHRsaS5jbGFzc05hbWUgPSBcIndhbG51dF9faXRlbVwiO1xuXHRcdFx0XHRsaS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXNbaV0uc3JjICsgXCIpXCI7XG5cdFx0XHRcdGxpLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LXNvdXJjZVwiLCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzW2ldLnNyYyk7XG5cdFx0XHRcdGxpLnNldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIsIGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXNbaV0uaW5kZXgpO1xuXG5cblx0XHRcdFx0bGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtc291cmNlXCIpO1xuXHRcdFx0XHRcdGNoYW5nZUltYWdlKG51bGwse1xuXHRcdFx0XHRcdFx0c291cmNlOiBzcmMsXG5cdFx0XHRcdFx0XHRpbmRleDogcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKSksXG5cdFx0XHRcdFx0XHRjb250YWluZXI6IG51bGxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0bGlzdC5hcHBlbmRDaGlsZChsaSk7XG5cblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZml4TGlzdFdpZHRoKCkge1xuXHRcdGxldCBlbEl0ZW06IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3YWxudXRfX2l0ZW1cIilbMF07XG5cdFx0bGV0IGxpc3RJdGVtOiBudW1iZXIgPSBlbEl0ZW0ub2Zmc2V0V2lkdGg7XG5cdFx0bGV0IGVsTGlzdDogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIndhbG51dF9fbGlzdFwiKVswXTtcblx0XHRlbExpc3Quc3R5bGUud2lkdGggPSAoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlcy5sZW5ndGggKiAgbGlzdEl0ZW0pICsgXCJweFwiO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xvc2VWaWV3ZXIoKSB7XG5cdFx0dmlld2VyLm1haW5JbWFnZS5zcmMgPSBcIlwiO1xuXHRcdHZpZXdlci53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX3dyYXBwZXItLW9wZW5cIik7XG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0LS1vcGVuXCIpO1xuXHRcdGRlaW5pdEZsZXhFdmVudHMoKTtcblx0XHRmdWxsc2NyZWVuKFwiZXhpdFwiKTtcblx0XHRpZiAoaGlzdG9yeS5zdGF0ZSA9PT0gXCJ3YWxudXRcIikge1xuXHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNoYW5nZUltYWdlKGFjdGlvbjogYW55ID0gdW5kZWZpbmVkLCBvYmplY3Q6IGFueSA9IHVuZGVmaW5lZCkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0bGV0IG5ld0luZGV4ID0gMDtcblx0XHRsZXQgaW5kZXg6IG51bWJlciA9IDA7XG5cdFx0bGV0IHByZXZCdG4gPSB2aWV3ZXIucHJldkJ0bjtcblx0XHRsZXQgbmV4dEJ0biA9IHZpZXdlci5uZXh0QnRuO1xuXHRcdGxldCBtYWluSW1hZ2UgPSB2aWV3ZXIubWFpbkltYWdlO1xuXG5cdFx0aWYodHlwZW9mIGFjdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhY3Rpb24gIT09IG51bGwgKXtcblx0XHRcdGluZGV4ID0gcGFyc2VJbnQobWFpbkltYWdlLmdldEF0dHJpYnV0ZShcImRhdGEtd2FsbnV0LWluZGV4XCIpKTtcblxuXHRcdFx0aWYoYWN0aW9uID09PSBcIm5leHRcIiAmJiBpbmRleCA8IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSl7XG5cdFx0XHRcdGluZGV4ID0gaW5kZXggKyAxO1xuXHRcdFx0fWVsc2UgaWYoYWN0aW9uID09PSBcInByZXZcIiAmJiBpbmRleCA+IDAgKXtcblx0XHRcdFx0aW5kZXggPSBpbmRleCAtIDE7XG5cdFx0XHR9ZWxzZSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVE9ETzogZmluZCByaWdodCBhcnJheSBpc3RlYWQgb2YgMFxuXHRcdFx0aWYoY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpbmRleF0pe1xuXHRcdFx0XHRtYWluSW1hZ2Uuc3JjID0gY29udGFpbmVyQXJyYXlbY29udGFpbmVySW5kZXhdLmltYWdlc1tpbmRleF0uc3JjO1xuXHRcdFx0XHRtYWluSW1hZ2Uuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgaW5kZXgpO1xuXHRcdFx0fVxuXG5cblx0XHR9IGVsc2UgaWYob2JqZWN0ICYmIG9iamVjdC5zb3VyY2Upe1xuXHRcdFx0aW5kZXggPSBwYXJzZUludChvYmplY3QuaW5kZXgpO1xuXHRcdFx0bWFpbkltYWdlLnNyYyA9IG9iamVjdC5zb3VyY2U7XG5cdFx0XHRtYWluSW1hZ2Uuc2V0QXR0cmlidXRlKFwiZGF0YS13YWxudXQtaW5kZXhcIiwgaW5kZXgpO1xuXG5cdFx0fVxuXG5cdFx0aWYoaW5kZXggPT09IDAgJiYgaW5kZXggPT09IGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0cHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHR9IGVsc2UgaWYoaW5kZXggPT09IDApIHtcblx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0bmV4dEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHR9ZWxzZSBpZihpbmRleCA9PT0gKGNvbnRhaW5lckFycmF5W2NvbnRhaW5lckluZGV4XS5pbWFnZXMubGVuZ3RoIC0gMSkgKSB7XG5cdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByZXZCdG4uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHRuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdH1cblxuXHRcdGNoZWNrSGVpZ2h0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiBmaXhWaWV3ZXIoKSB7XG5cdFx0Y2hlY2tIZWlnaHQoKTtcblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiLndhbG51dF9faXRlbVwiKVswXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cdFx0XHRmaXhMaXN0V2lkdGgoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjaGVja0hlaWdodCgpIHtcblx0XHRsZXQgdmlld2VySGVpZ2h0ID0gdmlld2VyLmJveC5vZmZzZXRIZWlnaHQ7XG5cdFx0bGV0IHdyYXBwZXIgPSB2aWV3ZXIud3JhcHBlcjtcblxuXHRcdGlmICggdmlld2VySGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG5cdFx0XHR3cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJ3YWxudXQtLWFsaWduLXRvcFwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0LS1hbGlnbi10b3BcIik7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY2hlY2tLZXlQcmVzc2VkKGU6IGFueSkge1xuXHRcdGxldCBrZXkgPSBlLmtleUNvZGU7XG5cdFx0aWYoIGtleSA9PT0gMzcpIHtcblx0XHRcdGNoYW5nZUltYWdlKFwicHJldlwiKTtcblx0XHR9IGVsc2UgaWYoa2V5ID09PSAzOSkge1xuXHRcdFx0Y2hhbmdlSW1hZ2UoXCJuZXh0XCIpO1xuXHRcdH0gZWxzZSBpZihrZXkgPT09IDI3KSB7XG5cdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNsaWNrV3JhcHBlcihlOiBhbnkpIHtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpOyAvLyBGSVhNRTogc3RvcCBldmVudCBmcm9tIGJ1YmJsaW5nXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBGSVhNRTogc3RvcCBldmVudCBmcm9tIGJ1YmJsaW5nXG5cdFx0aWYgKGUudGFyZ2V0ICE9PSB0aGlzIHx8IGNsaWNrVGFyZ2V0ICE9PSB2aWV3ZXIud3JhcHBlcikge1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGNsb3NlVmlld2VyLmNhbGwodGhpcyk7XG5cdH1cblxuXHRmdW5jdGlvbiBmdWxsc2NyZWVuKG9wdGlvbjogc3RyaW5nKSB7XG5cdFx0bGV0IHdyYXBwZXIgXHRcdD0gdmlld2VyLndyYXBwZXI7XG5cdFx0bGV0IGZ1bGxzY3JlZW5CdG4gXHQ9IHZpZXdlci5mdWxsc2NyZWVuQnRuO1xuXG5cdFx0aWYob3B0aW9uID09PSBcImV4aXRcIikge1xuXHRcdFx0ZXhpdEZ1bGxzY3JlZW4oKTtcblx0XHRcdGZ1bGxzY3JlZW5CdG4uY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZnVsbHNjcmVlbi0taGlkZGVuXCIpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGxhdW5jaEludG9GdWxsc2NyZWVuKHdyYXBwZXIpO1xuXHRcdFx0ZnVsbHNjcmVlbkJ0bi5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19mdWxsc2NyZWVuLS1oaWRkZW5cIik7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gbmV4dEltYWdlKCkge1xuXHRcdGNoYW5nZUltYWdlLmNhbGwodGhpcywgXCJuZXh0XCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJldkltYWdlKCkge1xuXHRcdGNoYW5nZUltYWdlLmNhbGwodGhpcywgXCJwcmV2XCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25EcmFnUHJldmlld0xpc3QoZTogYW55KSB7XG5cblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcblx0XHRjbGlja1RhcmdldCA9IHRhcmdldDtcblx0XHRpZiAodGFyZ2V0Lm1hdGNoZXMoJy53YWxudXRfX2xpc3QtaGFuZGxlJykpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGNvbnNvbGUubG9nKCdkcmFnU3RhcnQnLCBlKTtcblx0XHRcdGxpc3RDb250YWluZXIuZHJhZ3N0YXJ0WSA9IGUuY2xpZW50WTtcblx0XHRcdGxpc3RDb250YWluZXIuZHJhZ2luZyA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25EcmFnaW5nUHJldmlld0xpc3QoZTogYW55KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCB5OiBhbnkgPSBwYXJzZUZsb2F0KGUuY2xpZW50WSk7XG5cdFx0aWYgKGxpc3RDb250YWluZXIuZHJhZ2luZyAmJiAhbGlzdENvbnRhaW5lci5kcmFnQ2FuY2VsZWQgJiYgKHkgPiAobGlzdENvbnRhaW5lci5kcmFnc3RhcnRZICsgMSkgfHxcblx0XHRcdFx0XHR5IDwgKGxpc3RDb250YWluZXIuZHJhZ3N0YXJ0WSAtIDEpKSlcblx0XHR7XG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdFx0bGV0IHN0YXJ0WTogbnVtYmVyID0gbGlzdENvbnRhaW5lci5kcmFnc3RhcnRZO1xuXHRcdFx0XHRsZXQgdHJhbnNsYXRlZDogbnVtYmVyID0gbGlzdENvbnRhaW5lci50cmFuc2xhdGVkWTtcblx0XHRcdFx0bGV0IG5ld1k6IG51bWJlciA9IHRyYW5zbGF0ZWQgKyAoeSAtIHN0YXJ0WSk7XG5cdFx0XHRcdGlmIChuZXdZIDwgMCApIHtcblx0XHRcdFx0XHRsaXN0Q29udGFpbmVyLmRyYWdDYW5jZWxlZCA9IHRydWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld1kgPSBNYXRoLm1pbigxMDAsIG5ld1kpOyAvLyBUT0RPOiBjaGFuZ2UgMTAwIHRvIGxpc3QgaGVpZ2h0XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdkcmFnJywgbmV3WSk7XG5cdFx0XHRcdHZpZXdlci5saXN0Q29udGFpbmVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwLCR7bmV3WX1weCwwKWA7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvbkRyYWdFbmRQcmV2aWV3TGlzdChlOiBhbnkpIHtcblx0XHRpZiAobGlzdENvbnRhaW5lci5kcmFnaW5nKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0bGV0IG5ld1kgPSAobGlzdENvbnRhaW5lci50cmFuc2xhdGVkWSArIChlLmNsaWVudFkgLSBsaXN0Q29udGFpbmVyLmRyYWdzdGFydFkpKTtcblx0XHRcdG5ld1kgPSBNYXRoLm1heCgwLCBuZXdZKTtcblx0XHRcdG5ld1kgPSBNYXRoLm1pbigxMDAsIG5ld1kpO1xuXHRcdFx0bGlzdENvbnRhaW5lci50cmFuc2xhdGVkWSA9IG5ld1k7XG5cdFx0XHRsaXN0Q29udGFpbmVyLmRyYWdpbmcgPSBmYWxzZTtcblx0XHRcdGxpc3RDb250YWluZXIuZHJhZ0NhbmNlbGVkID0gZmFsc2U7XG5cdFx0XHRjb25zb2xlLmxvZygnZHJhZ0VuZCcsIGxpc3RDb250YWluZXIudHJhbnNsYXRlZFkpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHN3aXBlU3RhcnQoZTogYW55KSB7XG5cdFx0bGV0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblxuXHRcdHRvdWNoU3RhcnRYID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCk7XG5cdFx0dG91Y2hTdGFydFkgPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZKTtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiBzd2lwZU1vdmUoZTogYW55KSB7XG5cdFx0bGV0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblx0XHRsZXQgdG91Y2hNb3ZlWCA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFgpO1xuXHRcdGxldCB0b3VjaE1vdmVZID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSk7XG5cdFx0bGV0IGluZGV4ID0gdmlld2VyLm1haW5JbWFnZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdhbG51dC1pbmRleFwiKTtcblx0XHRsZXQgZGlyZWN0aW9uTGluZSA9IHZpZXdlci5kaXJlY3Rpb25MaW5lO1xuXHRcdGxldCBkaXJlY3Rpb25BcnJvdyA9IHZpZXdlci5kaXJlY3Rpb25BcnJvdztcblx0XHRsZXQgZGlzdFg7XG5cdFx0bGV0IGRpc3RZO1xuXG5cdFx0ZGlzdFggPSBNYXRoLmFicyh0b3VjaE1vdmVYIC0gdG91Y2hTdGFydFgpO1xuXHRcdGRpc3RZID0gTWF0aC5hYnModG91Y2hNb3ZlWSAtIHRvdWNoU3RhcnRZKTtcblxuXHRcdGRpcmVjdGlvbkxpbmUuc3R5bGUud2lkdGggPSA0MCArIGRpc3RYICsgXCJweFwiO1xuXG5cdFx0Ly8gQ2hlY2tzIGlmIHlvdSBzd2lwZSByaWdodCBvciBsZWZ0IG9yIGlmIHlvdSBzd2lwZWQgdXAgb3IgZG93biBtb3JlIHRoYW4gYWxsb3dlZCBhbmQgY2hlY2tzIGlmIHRoZXJlIGlzIG1vcmUgcGljdHVyZXMgdGhhdCB3YXlcblx0XHRpZih0b3VjaFN0YXJ0WCA+IHRvdWNoTW92ZVggJiYgZGlzdFkgPCBhbGxvd2VkVG91Y2hEaXN0YW5jZSAgJiYgaW5kZXggPCBjb250YWluZXJBcnJheVtjb250YWluZXJJbmRleF0uaW1hZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlIHdhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdGRpcmVjdGlvbkFycm93LmlubmVySFRNTCA9IFwiXCI7IC8vIFRPRE86IGluc3RlYWQgb2YgcmVtb3ZpbmcganVzdCBoaWRlXG5cdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0J0blJpZ2h0KTtcblxuXHRcdH0gZWxzZSBpZiAodG91Y2hTdGFydFggPiB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UgKSB7XG5cdFx0XHQvLyBzdG9wXG5cdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZSB3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtcmlnaHRcIik7XG5cdFx0XHRkaXJlY3Rpb25BcnJvdy5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0ZGlyZWN0aW9uQXJyb3cuYXBwZW5kQ2hpbGQoZ19zdmdDbG9zZUJ0bkZpbGxlZCk7XG5cblx0XHR9IGVsc2UgaWYgKHRvdWNoU3RhcnRYIDwgdG91Y2hNb3ZlWCAmJiBkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICYmIGluZGV4ID4gMCkge1xuXHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QuYWRkKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlIHdhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdFx0ZGlyZWN0aW9uQXJyb3cuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdGRpcmVjdGlvbkFycm93LmFwcGVuZENoaWxkKGdfc3ZnQnRuTGVmdCk7XG5cblx0XHR9IGVsc2UgaWYodG91Y2hTdGFydFggPCB0b3VjaE1vdmVYICYmIGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UpIHtcblx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblx0XHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LmFkZChcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZSB3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUtbGVmdFwiKTtcblx0XHRcdGRpcmVjdGlvbkFycm93LmlubmVySFRNTCA9IFwiXCI7XG5cdFx0XHRkaXJlY3Rpb25BcnJvdy5hcHBlbmRDaGlsZChnX3N2Z0Nsb3NlQnRuRmlsbGVkKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRkaXJlY3Rpb25MaW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YWxudXRfX2RpcmVjdGlvbi1saW5lLS1hY3RpdmUgd2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLWxlZnQgd2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlLXJpZ2h0XCIpO1xuXHRcdH1cblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiBzd2lwZUVuZChlOiBhbnkpIHtcblx0XHRsZXQgdG91Y2hvYmogICA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cdFx0bGV0IHRvdWNoTW92ZVggPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRYKTtcblx0XHRsZXQgdG91Y2hNb3ZlWSA9IHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFkpO1xuXHRcdGxldCBkaXN0WSA9IE1hdGguYWJzKHRvdWNoTW92ZVkgLSB0b3VjaFN0YXJ0WSk7XG5cdFx0bGV0IGRpc3RYID0gTWF0aC5hYnModG91Y2hNb3ZlWCAtIHRvdWNoU3RhcnRYKTtcblx0XHRsZXQgZGlyZWN0aW9uTGluZSA9IHZpZXdlci5kaXJlY3Rpb25MaW5lO1xuXG5cdFx0dG91Y2hFbmQgPSB0b3VjaE1vdmVYO1xuXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0ZGlyZWN0aW9uTGluZS5jbGFzc0xpc3QucmVtb3ZlKFwid2FsbnV0X19kaXJlY3Rpb24tbGluZS0tYWN0aXZlXCIpO1xuXHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1sZWZ0XCIpO1xuXHRcdGRpcmVjdGlvbkxpbmUuY2xhc3NMaXN0LnJlbW92ZShcIndhbG51dF9fZGlyZWN0aW9uLWxpbmUtLWFjdGl2ZS1yaWdodFwiKTtcblxuXHRcdGlmICh0b3VjaFN0YXJ0WCA+IHRvdWNoRW5kICYmXG5cdFx0XHRcdGRpc3RYID4gbWluVG91Y2hEaXN0YW5jZSAmJlxuXHRcdFx0XHRkaXN0WSA8IGFsbG93ZWRUb3VjaERpc3RhbmNlICkge1xuXG5cdFx0XHRuZXh0SW1hZ2UoKTtcblx0XHR9IGVsc2UgaWYgKHRvdWNoU3RhcnRYIDwgdG91Y2hFbmQgJiZcblx0XHRcdFx0ZGlzdFggPiBtaW5Ub3VjaERpc3RhbmNlICYmXG5cdFx0XHRcdGRpc3RZIDwgYWxsb3dlZFRvdWNoRGlzdGFuY2UpIHtcblxuXHRcdFx0cHJldkltYWdlKCk7XG5cdFx0fSBlbHNlIGlmIChkaXN0WSA+IDIwMCkge1xuXG5cdFx0XHRjbG9zZVZpZXdlcigpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNoYW5nZUhpc3RvcnkoZXZlbnQ6IGFueSkge1xuXHRcdGNsb3NlVmlld2VyKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcblxuKDxhbnk+d2luZG93KS53YWxudXQgPSB3YWxudXRcbiJdfQ==
