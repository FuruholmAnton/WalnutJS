# WalnutJS

Image slider made with JavaScript. Looks for images in the chosen container. 

Support background images.

## install
```
bower install walnutjs
```


## How to implement with `<img>` tags

1. Download the __walnut__ folder and add it to your project.

2. Add this to your HTML, I recommend at the bottom, just before `</body>` (change `src` path to fit your project):
	```html
	<script walnut-script src="/walnut/walnut.js"></script>
	```

3. Add `walnut` as an attribute to the container/containers including images you want to show in the slider
  ```html
  <div walnut-image>
  ```

4. Done! So simple!


### How to implement with `background-image: url()`

1. Download the __walnut__ folder and add it to your project.

2. Add this to your HTML, I recommend at the bottom, just before `</body>` (change `src` path to fit your project):
	```html
	<script walnutScript src="/walnut/walnut.js"></script>
	```
3. Add `walnut` as an attribute to the container/containers including images you want to show in the slider

4. Add `walnut-image` as an attribute to the element with the background-image css.
  ```html
  <div style="background-image: url('images/example.jpg'); width: 200px; height: 200px;" walnut-image></div>
  ```

5. Done! So simple!


## How to use
### To change image you can choose between 
   
- Clicking the buttons on the viewer
- Navigate with the keyboard buttons <- & ->
- Swipe on a touch device
- Click the picture underneath


## Good to know

- It is possible to use classes instead of attributes
  ex. `<img class="walnut-image">` instead of `<img walnut-image>`

- If you don't specify "walnut-image" on a image then it will take all images inside of the container (not background images) 
