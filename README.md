# WalnutJS
Image slider made with JavaScript.  


## install
```
npm i @lostonline/walnut
```
<br/>

## How to implement 

1. Import 
```javascript
import Walnut from '@lostonline/walnut';
```

2. Initiate Walnut with an array of elements; works with `<img>` and `background-image: url()`.
```javascript
// Get all containers
document.querySelectorAll('.container').forEach((el) => {
  // Initiate each container with its images
  new Walnut([...el.getElementsByTagName('img'), ...el.querySelectorAll('.image')]);
});
```

3. Add `walnut.css`

4. Add html for the viewer somewhere to the `<body/>`

```html
<div id="walnut-viewer" class="walnut__wrapper">
    
    <div class="walnut-close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round"
        stroke-miterlimit="1.4">
        <path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"></path>
        <path class="walnut-close__path" fill="#fff" d="M21.6 61.6l38.8-39L775 737.3l-39 39z"></path>
        <path class="walnut-close__path" fill="#fff" d="M2.8 80.4L80.3 3l714.4 714.3-77.5 77.5z"></path>
        <path class="walnut-close__path" fill="#fff" d="M797.7 82.5L717.2 2 2.8 716.4 83.2 797z"></path>
      </svg>
    </div>

    <div class="walnut__box">
      <div class="walnut__image-container"><img class="walnut__image" src="http://localhost:9000/images/1.jpg" data-walnut-index="1">
        <div class="walnut__navigation walnut__navigation--next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.236 44.236">
            <g fill="#FFF">
              <path d="M22.12 44.24C9.92 44.24 0 34.3 0 22.12S9.92 0 22.12 0s22.12 9.92 22.12 22.12-9.93 22.12-22.12 22.12zm0-42.74C10.75 1.5 1.5 10.75 1.5 22.12c0 11.37 9.25 20.62 20.62 20.62 11.37 0 20.62-9.25 20.62-20.62 0-11.37-9.25-20.62-20.62-20.62z"></path>
              <path d="M19.34 29.88c-.2 0-.38-.07-.53-.22-.28-.3-.28-.76 0-1.06l6.8-6.8-6.8-6.8c-.28-.3-.28-.77 0-1.07.3-.3.78-.3 1.07 0l7.33 7.34c.3.3.3.77 0 1.06l-7.33 7.33c-.14.15-.34.22-.53.22z"></path>
            </g>
          </svg>
        </div>
        <div class="walnut__navigation walnut__navigation--prev">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round"
            stroke-miterlimit="1.41">
            <g fill="#fff" fill-rule="nonzero">
              <path d="M22.12 44.24c12.2 0 22.12-9.93 22.12-22.12C44.24 9.92 34.3 0 22.12 0 9.92 0 0 9.92 0 22.12c0 12.2 9.92 22.12 22.12 22.12zm0-42.74c11.37 0 20.62 9.25 20.62 20.62 0 11.37-9.25 20.62-20.62 20.62-11.37 0-20.62-9.25-20.62-20.62C1.5 10.75 10.75 1.5 22.12 1.5z"></path>
              <path d="M24.9 29.88c.2 0 .38-.07.52-.22.3-.3.3-.76 0-1.06l-6.8-6.8 6.8-6.8c.3-.3.3-.77 0-1.06-.3-.3-.76-.3-1.06 0l-7.32 7.33c-.3.3-.3.77 0 1.06l7.32 7.33c.15.15.34.22.53.22z"></path>
            </g>
          </svg>
        </div>
        <div class="walnut__direction-line">
          <div class="walnut__direction-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round"
            stroke-miterlimit="1.41">
              <g fill="#fff" fill-rule="nonzero">
                <path d="M22.12 44.24c12.2 0 22.12-9.93 22.12-22.12C44.24 9.92 34.3 0 22.12 0 9.92 0 0 9.92 0 22.12c0 12.2 9.92 22.12 22.12 22.12zm0-42.74c11.37 0 20.62 9.25 20.62 20.62 0 11.37-9.25 20.62-20.62 20.62-11.37 0-20.62-9.25-20.62-20.62C1.5 10.75 10.75 1.5 22.12 1.5z"></path>
                <path d="M24.9 29.88c.2 0 .38-.07.52-.22.3-.3.3-.76 0-1.06l-6.8-6.8 6.8-6.8c.3-.3.3-.77 0-1.06-.3-.3-.76-.3-1.06 0l-7.32 7.33c-.3.3-.3.77 0 1.06l7.32 7.33c.15.15.34.22.53.22z"></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="walnut__fullscreen">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round"
        stroke-miterlimit="1.4">
        <path d="M3.4 15.4H0V24h8.6v-3.4H3.4v-5.2zM0 8.6h3.4V3.4h5.2V0H0v8.6zm20.6 12h-5.2V24H24v-8.6h-3.4v5.2zM15.4 0v3.4h5.2v5.2H24V0h-8.6z"
          fill="#fff" fill-rule="nonzero"></path>
      </svg>
    </div>
  </div>
  ```

<br/><br/>


## How to use
### To change image you can choose between 
   
- Clicking the buttons on the viewer
- Navigate with the keyboard buttons <- & ->
- Swipe on touch devices
