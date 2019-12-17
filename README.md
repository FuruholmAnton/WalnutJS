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

<br/><br/>


## How to use
### To change image you can choose between 
   
- Clicking the buttons on the viewer
- Navigate with the keyboard buttons <- & ->
- Swipe on touch devices
