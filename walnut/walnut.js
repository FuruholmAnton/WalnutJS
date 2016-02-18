"use strict";!function(){function e(e,t){for(;(e=e.parentElement)&&!e.classList.contains(t););return e}function t(){return!!("ontouchstart"in window||window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture||window.DocumentTouch&&document instanceof DocumentTouch)}function i(e){window.addEventListener("resize",e,!0),window.addEventListener("orientationchange",e)}window.requestAnimationFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();var n={init:function(){this.CONTAINERS=document.getElementsByClassName("walnut"),this.containerArray=[],this.viewer={},this.config={},this.touchStart=0,this.touchEnd=0,this.allowedTouchDistance=100,sessionStorage.countTouch=0;var e,i,a,r;e=document.getElementById("walnutScript").src,e=e.replace("walnut.js",""),i=e.split("/"),a="";for(var r=3;r<i.length;r++)3!==r&&(a+="/"),a+=i[r];n.config.path=a,this.indexImages(),this.buildTemplate(),this.addCSSLink(),t()&&n.viewer.wrapper.classList.add("walnut--is-touch")},fixViewer:function(){n.checkHeight(),n.fixList()},initEvents:function(){n.viewer.wrapper.addEventListener("click",n.clickWrapper),n.viewer.closeBtn.addEventListener("click",n.closeViewer),document.addEventListener("keyup",n.checkKeyPressed),i(n.fixViewer),t()?(n.viewer.mainImage.addEventListener("touchstart",n.swipeStart),n.viewer.mainImage.addEventListener("touchend",n.swipeEnd),n.viewer.mainImage.addEventListener("touchmove",n.swipeMove)):(n.viewer.nextBtn.addEventListener("click",n.nextImage),n.viewer.prevBtn.addEventListener("click",n.prevImage))},deinitEvents:function(){n.viewer.wrapper.removeEventListener("click",n.clickWrapper),n.viewer.closeBtn.removeEventListener("click",n.closeViewer),document.removeEventListener("keyup",n.checkKeyPressed),t()?(n.viewer.mainImage.removeEventListener("touchstart",n.swipeStart),n.viewer.mainImage.removeEventListener("touchend",n.swipeEnd),n.viewer.mainImage.removeEventListener("touchmove",n.swipeMove)):(n.viewer.nextBtn.removeEventListener("click",n.nextImage),n.viewer.prevBtn.removeEventListener("click",n.prevImage))},addCSSLink:function(){var e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("type","text/css"),e.setAttribute("href",n.config.path+"styles/walnut.css"),document.getElementsByTagName("head")[0].appendChild(e)},indexImages:function(){for(var e=0;e<this.CONTAINERS.length;e++){this.containerArray.push({container:this.CONTAINERS[e],images:[]}),this.CONTAINERS[e].setAttribute("data-walnut-container",e);var t=this.CONTAINERS[e].getElementsByTagName("img"),i=this.CONTAINERS[e].getElementsByClassName("walnut-image"),a=[];if(i)for(var r=0;r<i.length;r++)a.push(i[r]);if(t)for(var r=0;r<t.length;r++)a.push(t[r]);for(var c=0;c<a.length;c++){a[c].addEventListener("click",n.openViewer),a[c].setAttribute("data-walnut-index",c);var s;if(a[c].src)s=a[c].src;else{var o=a[c].currentStyle||window.getComputedStyle(a[c],!1);s=o.backgroundImage.slice(4,-1).replace(/"/g,"")}this.containerArray[e].images.push({elem:a[c],src:s,index:c})}}},buildTemplate:function(){var e=document.createElement("ul"),t=document.createElement("div"),i=document.createElement("div"),a=document.createElement("div"),r=document.createElement("img"),c=document.createElement("div"),s=document.createElement("div"),o=document.createElement("img"),l=document.createElement("div"),d=document.createElement("img"),u=document.createElement("img"),v=document.getElementsByTagName("body")[0],w=document.createElement("img"),m=document.createElement("div");e.className="walnut__list",t.className="walnut__list-container",r.className="walnut__image",c.className="walnut__image-container",a.className="walnut__box",i.className="walnut__wrapper",u.className="walnut__close",u.src=n.config.path+"images/button_close.svg",s.className="walnut__navigation walnut__navigation--next",o.src=n.config.path+"images/button_to_right.svg",o.className="walnut__navigation-img",l.className="walnut__navigation walnut__navigation--prev",d.src=n.config.path+"images/button_to_left.svg",d.className="walnut__navigation-img",w.className="walnut__direction-arrow",m.className="walnut__direction-line",s.appendChild(o),l.appendChild(d),m.appendChild(w),c.appendChild(r),c.appendChild(s),c.appendChild(l),c.appendChild(m),t.appendChild(e),a.appendChild(c),a.appendChild(t),a.appendChild(u),i.appendChild(a),v.appendChild(i),n.body=v,n.viewer.closeBtn=u,n.viewer.nextBtn=s,n.viewer.prevBtn=l,n.viewer.mainImage=r,n.viewer.wrapper=i,n.viewer.list=e,n.viewer.directionArrow=w,n.viewer.directionLine=m,n.viewer.box=a},setImages:function(e){var t;if(n.viewer.list.innerHTML="",this.containerArray[n.containerIndex].images.length>1)for(var i=0;i<this.containerArray[n.containerIndex].images.length;i++)t=document.createElement("li"),t.className="walnut__item",t.style.backgroundImage="url("+n.containerArray[n.containerIndex].images[i].src+")",t.setAttribute("data-walnut-source",n.containerArray[n.containerIndex].images[i].src),t.setAttribute("data-walnut-index",n.containerArray[n.containerIndex].images[i].index),t.addEventListener("click",function(){var e=this.getAttribute("data-walnut-source");n.changeImage(null,{source:e,index:this.getAttribute("data-walnut-index"),container:null})}),n.viewer.list.appendChild(t)},openViewer:function(t){var i,a;a=e(t.target,"walnut"),a&&(n.containerIndex=a.getAttribute("data-walnut-container")),n.setImages(),i=this.getAttribute("data-walnut-index"),i=parseInt(i);var r;if(this.src)r=this.src;else{var c=this.currentStyle||window.getComputedStyle(this,!1);r=c.backgroundImage.slice(4,-1).replace(/"/g,"")}n.viewer.mainImage.src=r,n.viewer.mainImage.setAttribute("data-walnut-index",i),n.viewer.wrapper.classList.add("walnut__wrapper--open"),n.body.classList.add("walnut--open"),0===i&&i===n.containerArray[n.containerIndex].images.length-1?(n.viewer.prevBtn.style.display="none",n.viewer.nextBtn.style.display="none"):0===i?(n.viewer.prevBtn.style.display="none",n.viewer.nextBtn.style.display=""):i===n.containerArray[n.containerIndex].images.length-1?(n.viewer.nextBtn.style.display="none",n.viewer.prevBtn.style.display=""):(n.viewer.prevBtn.style.display="",n.viewer.nextBtn.style.display=""),n.initEvents(),n.checkHeight(),n.fixList()},fixList:function(){var e=document.querySelector(".walnut__item").offsetWidth;document.querySelector(".walnut__list").style.width=n.containerArray[n.containerIndex].images.length*e+"px"},closeViewer:function(){n.viewer.mainImage.src="",n.viewer.wrapper.classList.remove("walnut__wrapper--open"),n.body.classList.remove("walnut--open"),n.deinitEvents()},changeImage:function(e,t){var i=0;if("undefined"!=typeof e&&null!==e){if(i=n.viewer.mainImage.getAttribute("data-walnut-index"),i=parseInt(i),"next"===e&&i<n.containerArray[n.containerIndex].images.length-1)i+=1;else{if(!("prev"===e&&i>0))return;i-=1}n.containerArray[n.containerIndex].images[i]&&(n.viewer.mainImage.src=n.containerArray[n.containerIndex].images[i].src,n.viewer.mainImage.setAttribute("data-walnut-index",i))}else"undefined"!=typeof t&&(i=parseInt(t.index),n.viewer.mainImage.src=t.source,n.viewer.mainImage.setAttribute("data-walnut-index",i));0===i&&i===n.containerArray[n.containerIndex].images.length-1?(n.viewer.prevBtn.style.display="none",n.viewer.nextBtn.style.display="none"):0===i?(n.viewer.prevBtn.style.display="none",n.viewer.nextBtn.style.display=""):i===n.containerArray[n.containerIndex].images.length-1?(n.viewer.nextBtn.style.display="none",n.viewer.prevBtn.style.display=""):(n.viewer.prevBtn.style.display="",n.viewer.nextBtn.style.display=""),n.checkHeight()},checkHeight:function(){var e=n.viewer.box.offsetHeight;e>window.innerHeight?n.viewer.wrapper.classList.add("walnut--align-top"):n.viewer.wrapper.classList.remove("walnut--align-top")},checkKeyPressed:function(e){var t=e.keyCode;37===t?n.changeImage("prev"):39===t?n.changeImage("next"):27===t&&n.closeViewer()},clickWrapper:function(e){e.stopPropagation(),e.preventDefault(),e.target===this&&n.closeViewer.call(this)},nextImage:function(){n.changeImage.call(this,"next")},prevImage:function(){n.changeImage.call(this,"prev")},swipeStart:function(e){var t=e.changedTouches[0];n.touchStartX=parseInt(t.clientX),n.touchStartY=parseInt(t.clientY),e.preventDefault()},swipeEnd:function(e){var t=e.changedTouches[0],i=parseInt(t.clientX),a=parseInt(t.clientY),r=Math.abs(a-n.touchStartY);n.touchEnd=i,e.preventDefault(),n.viewer.directionLine.classList.remove("walnut__direction-line--active"),n.viewer.directionLine.classList.remove("walnut__direction-line--active-left"),n.viewer.directionLine.classList.remove("walnut__direction-line--active-right"),n.touchStartX>n.touchEnd&&r<n.allowedTouchDistance?n.nextImage():n.touchStartX<n.touchEnd&&r<n.allowedTouchDistance&&n.prevImage()},swipeMove:function(e){var t,i,a=e.changedTouches[0],r=parseInt(a.clientX),c=parseInt(a.clientY),s=n.viewer.mainImage.getAttribute("data-walnut-index");t=Math.abs(r-n.touchStartX),i=Math.abs(c-n.touchStartY),n.viewer.directionLine.style.width=40+t+"px",n.touchStartX>r&&i<n.allowedTouchDistance&&s<n.containerArray[n.containerIndex].images.length-1?(n.viewer.directionLine.classList.remove("walnut__direction-line--active-left"),n.viewer.directionLine.classList.add("walnut__direction-line--active"),n.viewer.directionLine.classList.add("walnut__direction-line--active-right"),n.viewer.directionArrow.src=n.config.path+"images/button_to_right.svg"):n.touchStartX>r&&i<n.allowedTouchDistance?(n.viewer.directionLine.classList.remove("walnut__direction-line--active-left"),n.viewer.directionLine.classList.add("walnut__direction-line--active"),n.viewer.directionLine.classList.add("walnut__direction-line--active-right"),n.viewer.directionArrow.src=n.config.path+"images/button_close_filled.svg"):n.touchStartX<r&&i<n.allowedTouchDistance&&s>0?(n.viewer.directionLine.classList.remove("walnut__direction-line--active-right"),n.viewer.directionLine.classList.add("walnut__direction-line--active"),n.viewer.directionLine.classList.add("walnut__direction-line--active-left"),n.viewer.directionArrow.src=n.config.path+"images/button_to_left.svg"):n.touchStartX<r&&i<n.allowedTouchDistance?(n.viewer.directionLine.classList.remove("walnut__direction-line--active-right"),n.viewer.directionLine.classList.add("walnut__direction-line--active"),n.viewer.directionLine.classList.add("walnut__direction-line--active-left"),n.viewer.directionArrow.src=n.config.path+"images/button_close_filled.svg"):(n.viewer.directionLine.classList.remove("walnut__direction-line--active"),n.viewer.directionLine.classList.remove("walnut__direction-line--active-left"),n.viewer.directionLine.classList.remove("walnut__direction-line--active-right")),e.preventDefault()}};n.init()}();