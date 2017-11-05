
/**
 * Looks for the attribute first.
 * If no elements are found then tries with classList
 * 
 * @export
 * @param {HTMLElement} el 
 * @param {string} cls 
 * @returns 
 */
export function findAncestor (el: HTMLElement, cls: string) {
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

export function isFullscreenEnabled() {
	return (<any>document).fullscreenEnabled ||
		(<any>document).webkitFullscreenEnabled ||
		(<any>document).mozFullScreenEnabled ||
		(<any>document).msFullscreenEnabled;
}

export let launchIntoFullscreen: any = undefined;
export let exitFullscreen: any = undefined;



export let fullscreenEnabled = (<any>document).fullscreenEnabled || (<any>document).mozFullScreenEnabled || (<any>document).webkitFullscreenEnabled;
export let fullscreenElement = (<any>document).fullscreenElement || (<any>document).mozFullScreenElement || (<any>document).webkitFullscreenElement;

	launchIntoFullscreen = function (element: any) {
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
	  if((<any>document).exitFullscreen) {
	    (<any>document).exitFullscreen();
	  } else if((<any>document).mozCancelFullScreen) {
	    (<any>document).mozCancelFullScreen();
	  } else if((<any>document).webkitExitFullscreen) {
	    (<any>document).webkitExitFullscreen();
	  }
	}


/**
 * [doDeviceHaveTouch description]
 */
export function doDeviceHaveTouch() {
	var bool = false;
    if (('ontouchstart' in (<any>window)) || (<any>window).DocumentTouch) {
      bool = true;
    }
    return bool;
}

/**
 * On ResizeEvent function
 */
export function resizeEvent(callback: (...args: any[]) => void, action: string = undefined) {
	if(action === "remove") {
		window.removeEventListener('resize', callback, true);
		window.removeEventListener("orientationchange", callback);
	} else {
		window.addEventListener('resize', callback, true);
		window.addEventListener("orientationchange", callback);
	}
}

export function once(fn: any, context: any = undefined) {
	// function can only fire once
	let result: any;

	return function() {
		if(fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}

export function getComputedTranslateY(obj: any)
{
    if(!window.getComputedStyle) return;
    var style: any = getComputedStyle(obj),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}
