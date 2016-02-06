(function(){
	
	// IDEA: user chooses className

	var walnut = {

		init:function() {

			this.CONTAINERS 	= document.getElementsByClassName("walnut");
			this.containerArray	= [];
			this.viewer 		= {};
			
			this.indexImages();
			this.buildTemplate();
		},

		indexImages:function(){
			for (var i = 0; i < this.CONTAINERS.length; i++) {
				this.containerArray.push({
					container: this.CONTAINERS[i],
					images: []
				}
					);
				var images = this.CONTAINERS[i].getElementsByTagName("img");

				for (var j = 0; j < images.length; j++) {

					images[j].addEventListener("click", function(){
						walnut.openViewer.call(this);
					});

					images[j].setAttribute("data-walnut-index", j);

					this.containerArray[i].images.push({
						elem: images[j],
						src: images[j].src,
						index: j
					});
				};	

			};
		},

		buildTemplate:function() {
			var ul 			= document.createElement("ul"),
				listContainer = document.createElement("div"),
				wrapper 	= document.createElement("div"),
				box  		= document.createElement("div"),
				mainImage 	= document.createElement("img"),
				mainImageContainer = document.createElement("div"),
				nextBtn 	= document.createElement("div"),
				nextBtnImg  = document.createElement("img"),
				prevBtn 	= document.createElement("div"),
				prevBtnImg  = document.createElement("img"),
				closeBtn 	= document.createElement("img"),
				li,
				img,
				bodyTag 	= document.getElementsByTagName("body")[0];


			// TODO: find right array istead of 0
			for (var i = 0; i < this.containerArray[0].images.length; i++) { 
				li = document.createElement("li");
				li.className = "walnut__item";


				img = document.createElement("div");
				img.className = "walnut__source";
				img.style.backgroundImage = "url(" + walnut.containerArray[0].images[i].src + ")";
				img.setAttribute("data-walnut-source", walnut.containerArray[0].images[i].src);
				img.setAttribute("data-walnut-index", walnut.containerArray[0].images[i].index);


				img.addEventListener("click", function(){
					var src = this.getAttribute("data-walnut-source");
					walnut.changeImage(null,{
						source: src,
						index: this.getAttribute("data-walnut-index")
					});
				});

				li.appendChild(img);
				ul.appendChild(li);

			};

			

			
			ul.className 			= "walnut__list";
			listContainer.className = "walnut__list-container";
			mainImage.className 	= "walnut__image";
			mainImageContainer.className = "walnut__image-container"
			box.className 			= "walnut__box";
			wrapper.className 		= "walnut walnut__wrapper";
			closeBtn.className 		= "walnut__close";
			closeBtn.src 			= "images/button_close.svg";
			nextBtn.className 		= "walnut__navigation walnut__navigation--next";
			nextBtnImg.src 			= "images/button_to_right.svg";
			nextBtnImg.className 	= "walnut__navigation-img";
			// nextBtnText.innerHTML 	= ">";
			prevBtn.className 		= "walnut__navigation walnut__navigation--prev";
			prevBtnImg.src 			= "images/button_to_left.svg";
			// prevBtnText.innerHTML 	= "<";
			prevBtnImg.className 	= "walnut__navigation-img";


			nextBtn.appendChild(nextBtnImg);
			prevBtn.appendChild(prevBtnImg);
			mainImageContainer.appendChild(mainImage);
			mainImageContainer.appendChild(nextBtn);
			mainImageContainer.appendChild(prevBtn);
			listContainer.appendChild(ul);
			box.appendChild(mainImageContainer);
			box.appendChild(listContainer);
			box.appendChild(closeBtn);
			wrapper.appendChild(box);
			bodyTag.appendChild(wrapper);


			// Make variables global in walnut
			walnut.body 				= bodyTag;
			walnut.viewer.closeBtn		= closeBtn;
			walnut.viewer.nextBtn 		= nextBtn;
			walnut.viewer.prevBtn 		= prevBtn;
			walnut.viewer.mainImage 	= mainImage;
			walnut.viewer.wrapper 		= wrapper;

			document.getElementsByClassName("walnut__list")[0].style.width = (this.containerArray[0].images.length * 200 ) + "px";
			
		},

		openViewer:function() {

			var index = this.getAttribute("data-walnut-index");
			index = parseInt(index);

			walnut.viewer.mainImage.src = this.src;
			walnut.viewer.mainImage.setAttribute("data-walnut-index", index);
			
			walnut.viewer.wrapper.classList.add("walnut__wrapper--open");
			walnut.body.classList.add("walnut--open");

			if(index === 0) {
				walnut.viewer.prevBtn.style.display = "none";
			}else if(index === walnut.containerArray[0].images.length - 1) {
				walnut.viewer.nextBtn.style.display = "none";
			}

			walnut.initViewer();
		},

		closeViewer:function() {
			walnut.viewer.mainImage.src = "";
			walnut.viewer.wrapper.classList.remove("walnut__wrapper--open");
			walnut.body.classList.remove("walnut--open");
			walnut.deinitViewer();
		},

		changeImage:function(action, object) {
			"use strict";

			var newIndex = 0,
				index = 0;
							
			if(typeof action !== "undefined" && action !== null ){
				index = walnut.viewer.mainImage.getAttribute("data-walnut-index");
				index = parseInt(index);



				if(action === "next" && index < walnut.containerArray[0].images.length - 1){
					index = index + 1;
				}else if(action === "prev" && index > 0 ){
					index = index - 1;
				}else {
					return;
				}

				// TODO: find right array istead of 0
				if(walnut.containerArray[0].images[index]){
					walnut.viewer.mainImage.src = walnut.containerArray[0].images[index].src;
					walnut.viewer.mainImage.setAttribute("data-walnut-index", index);
				}


				

			} else if(typeof object !== "undefined"){
				index = parseInt(object.index);
				walnut.viewer.mainImage.src = object.source;
				walnut.viewer.mainImage.setAttribute("data-walnut-index", index);

			}
			
			if(index === 0) {
				walnut.viewer.prevBtn.style.display = "none";
				walnut.viewer.nextBtn.style.display = "";
			}else if(index === (walnut.containerArray[0].images.length - 1) ) {
				walnut.viewer.nextBtn.style.display = "none";
				walnut.viewer.prevBtn.style.display = "";
			} else {
				walnut.viewer.prevBtn.style.display = "";
				walnut.viewer.nextBtn.style.display = "";
			}
			
		},

		initViewer:function() {
			walnut.viewer.wrapper.addEventListener("click", walnut.clickWrapper);
			walnut.viewer.closeBtn.addEventListener("click", walnut.closeViewer);
			walnut.viewer.nextBtn.addEventListener("click", walnut.nextImage);
			walnut.viewer.prevBtn.addEventListener("click", walnut.prevImage);
			document.addEventListener("keyup", walnut.checkKeyPressed);
		},
		deinitViewer:function() {
			walnut.viewer.wrapper.removeEventListener("click", walnut.clickWrapper);
			walnut.viewer.closeBtn.removeEventListener("click", walnut.closeViewer);
			walnut.viewer.nextBtn.removeEventListener("click", walnut.nextImage);
			walnut.viewer.prevBtn.removeEventListener("click", walnut.prevImage);
			document.removeEventListener("keyup", walnut.checkKeyPressed);
		},
		checkKeyPressed:function(e) {
			var key = e.keyCode;
			if( key === 37) {
				walnut.changeImage("prev");
			} else if(key === 39) {
				walnut.changeImage("next");
			} else if(key === 27) {
				walnut.closeViewer();
			}
		},
		clickWrapper:function(e) {
			e.stopPropagation(); // FIXME: stop event from bubbling
			e.preventDefault(); // FIXME: stop event from bubbling
			if (e.target !== this){
			    return;
			}
			walnut.closeViewer.call(this);
		},
		nextImage:function() {
			walnut.changeImage.call(this, "next");
		},
		prevImage:function() {
			walnut.changeImage.call(this, "prev");
		}

	};

	walnut.init();


})();

