import App from './App';
// import './base.scss';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import './tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Carousel, initTE } from 'tw-elements';

initTE({ Carousel });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
