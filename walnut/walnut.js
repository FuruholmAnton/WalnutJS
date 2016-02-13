"use strict";!function(){var e={init:function(){this.CONTAINERS=document.getElementsByClassName("walnut"),this.containerArray=[],this.viewer={},this.config={};var t=document.getElementById("walnutScript").src;t=t.replace("walnut.js","");for(var n=t.split("/"),a="",i=3;i<n.length;i++)3!==i&&(a+="/"),a+=n[i];e.config.path=a,this.indexImages(),this.buildTemplate(),this.addCSS()},addCSS:function(){var t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("type","text/css"),t.setAttribute("href",e.config.path+"styles/walnut.css"),document.getElementsByTagName("head")[0].appendChild(t)},indexImages:function(){for(var t=0;t<this.CONTAINERS.length;t++){this.containerArray.push({container:this.CONTAINERS[t],images:[]}),this.CONTAINERS[t].setAttribute("data-walnut-container",t);for(var n=this.CONTAINERS[t].getElementsByTagName("img"),a=0;a<n.length;a++)n[a].addEventListener("click",e.openViewer),n[a].setAttribute("data-walnut-index",a),this.containerArray[t].images.push({elem:n[a],src:n[a].src,index:a})}},buildTemplate:function(){var t=document.createElement("ul"),n=document.createElement("div"),a=document.createElement("div"),i=document.createElement("div"),r=document.createElement("img"),s=document.createElement("div"),l=document.createElement("div"),c=document.createElement("img"),d=document.createElement("div"),o=document.createElement("img"),m=document.createElement("img"),p=document.getElementsByTagName("body")[0];t.className="walnut__list",n.className="walnut__list-container",r.className="walnut__image",s.className="walnut__image-container",i.className="walnut__box",a.className="walnut__wrapper",m.className="walnut__close",m.src=e.config.path+"images/button_close.svg",l.className="walnut__navigation walnut__navigation--next",c.src=e.config.path+"images/button_to_right.svg",c.className="walnut__navigation-img",d.className="walnut__navigation walnut__navigation--prev",o.src=e.config.path+"images/button_to_left.svg",o.className="walnut__navigation-img",l.appendChild(c),d.appendChild(o),s.appendChild(r),s.appendChild(l),s.appendChild(d),n.appendChild(t),i.appendChild(s),i.appendChild(n),i.appendChild(m),a.appendChild(i),p.appendChild(a),e.body=p,e.viewer.closeBtn=m,e.viewer.nextBtn=l,e.viewer.prevBtn=d,e.viewer.mainImage=r,e.viewer.wrapper=a,e.viewer.list=t},setImages:function(t){var n;if(e.viewer.list.innerHTML="",this.containerArray[e.containerIndex].images.length>1){for(var a=0;a<this.containerArray[e.containerIndex].images.length;a++)n=document.createElement("li"),n.className="walnut__item",n.style.backgroundImage="url("+e.containerArray[e.containerIndex].images[a].src+")",n.setAttribute("data-walnut-source",e.containerArray[e.containerIndex].images[a].src),n.setAttribute("data-walnut-index",e.containerArray[e.containerIndex].images[a].index),n.addEventListener("click",function(){var t=this.getAttribute("data-walnut-source");e.changeImage(null,{source:t,index:this.getAttribute("data-walnut-index"),container:null})}),e.viewer.list.appendChild(n);document.getElementsByClassName("walnut__list")[0].style.width=200*this.containerArray[e.containerIndex].images.length+"px"}},openViewer:function(t){for(var n,a=0;a<t.path.length;a++)""!==t.path[a].className&&t.path[a].className&&t.path[a].className.indexOf("walnut")>-1&&(e.containerIndex=t.path[a].getAttribute("data-walnut-container"));e.setImages(),n=this.getAttribute("data-walnut-index"),n=parseInt(n),e.viewer.mainImage.src=this.src,e.viewer.mainImage.setAttribute("data-walnut-index",n),e.viewer.wrapper.classList.add("walnut__wrapper--open"),e.body.classList.add("walnut--open"),0===n&&n===e.containerArray[e.containerIndex].images.length-1?(e.viewer.prevBtn.style.display="none",e.viewer.nextBtn.style.display="none"):0===n?(e.viewer.prevBtn.style.display="none",e.viewer.nextBtn.style.display=""):n===e.containerArray[e.containerIndex].images.length-1?(e.viewer.nextBtn.style.display="none",e.viewer.prevBtn.style.display=""):(e.viewer.prevBtn.style.display="",e.viewer.nextBtn.style.display=""),e.initViewer()},closeViewer:function(){e.viewer.mainImage.src="",e.viewer.wrapper.classList.remove("walnut__wrapper--open"),e.body.classList.remove("walnut--open"),e.deinitViewer()},changeImage:function(t,n){var a=0;if("undefined"!=typeof t&&null!==t){if(a=e.viewer.mainImage.getAttribute("data-walnut-index"),a=parseInt(a),"next"===t&&a<e.containerArray[e.containerIndex].images.length-1)a+=1;else{if(!("prev"===t&&a>0))return;a-=1}e.containerArray[e.containerIndex].images[a]&&(e.viewer.mainImage.src=e.containerArray[e.containerIndex].images[a].src,e.viewer.mainImage.setAttribute("data-walnut-index",a))}else"undefined"!=typeof n&&(a=parseInt(n.index),e.viewer.mainImage.src=n.source,e.viewer.mainImage.setAttribute("data-walnut-index",a));0===a&&a===e.containerArray[e.containerIndex].images.length-1?(e.viewer.prevBtn.style.display="none",e.viewer.nextBtn.style.display="none"):0===a?(e.viewer.prevBtn.style.display="none",e.viewer.nextBtn.style.display=""):a===e.containerArray[e.containerIndex].images.length-1?(e.viewer.nextBtn.style.display="none",e.viewer.prevBtn.style.display=""):(e.viewer.prevBtn.style.display="",e.viewer.nextBtn.style.display="")},initViewer:function(){e.viewer.wrapper.addEventListener("click",e.clickWrapper),e.viewer.closeBtn.addEventListener("click",e.closeViewer),e.viewer.nextBtn.addEventListener("click",e.nextImage),e.viewer.prevBtn.addEventListener("click",e.prevImage),document.addEventListener("keyup",e.checkKeyPressed)},deinitViewer:function(){e.viewer.wrapper.removeEventListener("click",e.clickWrapper),e.viewer.closeBtn.removeEventListener("click",e.closeViewer),e.viewer.nextBtn.removeEventListener("click",e.nextImage),e.viewer.prevBtn.removeEventListener("click",e.prevImage),document.removeEventListener("keyup",e.checkKeyPressed)},checkKeyPressed:function(t){var n=t.keyCode;37===n?e.changeImage("prev"):39===n?e.changeImage("next"):27===n&&e.closeViewer()},clickWrapper:function(t){t.stopPropagation(),t.preventDefault(),t.target===this&&e.closeViewer.call(this)},nextImage:function(){e.changeImage.call(this,"next")},prevImage:function(){e.changeImage.call(this,"prev")}};e.init()}();