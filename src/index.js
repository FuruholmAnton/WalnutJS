import Walnut from './Walnut.class.js';
import './index.scss';
import './walnut.scss';

document.querySelectorAll('.walnut').forEach((el) => {
    new Walnut([...el.getElementsByTagName('img'), ...el.querySelectorAll('.image')]);
});

