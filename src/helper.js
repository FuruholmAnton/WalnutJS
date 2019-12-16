
/**
 * Looks for the attribute first.
 * If no elements are found then tries with classList
 *
 * @export
 * @param {HTMLElement} el
 * @param {string} cls
 * @returns
 */
export function findAncestor(el, cls) {
	let elem = el;
    while ((elem = elem.parentElement) && !elem.hasAttribute(cls));
    if (elem instanceof HTMLElement) {
    	return elem;
    } else {
    	elem = el;
    	while ((elem = elem.parentElement) && !elem.classList.contains(cls));
    	if (elem instanceof HTMLElement) {
    		return elem;
    	} else {
			return false;
    	}
    }
}

export function getParent(el, parentSelector) {
    let parent = null;
    while (el.parentElement != null) {
        if (el.parentElement.matches(parentSelector) ) {
            parent = el.parentElement;
            break;
        }
        el = el.parentElement;
    }
    return parent;
}

export function isFullscreenEnabled() {
	return document.fullscreenEnabled ||
		document.webkitFullscreenEnabled ||
		document.mozFullScreenEnabled ||
		document.msFullscreenEnabled;
}

export let launchIntoFullscreen = undefined;
export let exitFullscreen = undefined;


export let fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
export let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

launchIntoFullscreen = function(elem) {
	console.log(elem);

	if (!document.fullscreenElement) {
		elem.requestFullscreen().catch((err) => {
			console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
		});
	}
};

exitFullscreen = function() {
	if (document.fullscreenElement) {
		document.exitFullscreen().then(()=> console.log('Document Exited form Full screen mode'))
		.catch((err)=> console.error(err));
	}
};


/**
 * [doDeviceHaveTouch description]
 */
export function doDeviceHaveTouch() {
	let bool = false;
    if (('ontouchstart' in window) || window.DocumentTouch) {
      bool = true;
    }
    return bool;
}

/**
 * On ResizeEvent function
 */
export function resizeEvent(callback, action = undefined) {
	if (action === 'remove') {
		window.removeEventListener('resize', callback, true);
		window.removeEventListener('orientationchange', callback);
	} else {
		window.addEventListener('resize', callback, true);
		window.addEventListener('orientationchange', callback);
	}
}

export function once(fn, context = undefined) {
	// function can only fire once
	let result;

	return function() {
		if (fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}

export function getComputedTranslateY(obj)
{
    if (!window.getComputedStyle) return;
    let style = getComputedStyle(obj);
    let transform = style.transform || style.webkitTransform || style.mozTransform;
    let mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}

export function bind(self, ...functions) {
    functions.forEach((name) => {
        if (!self[name]) return console.warn(`Method '${name}' does not exist on ${typeof self}:`, self);
        self[name] = self[name].bind(self);
    });
}

