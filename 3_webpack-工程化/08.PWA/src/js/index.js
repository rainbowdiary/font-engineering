/* PWA 渐进式Web应用程序 */

// import $ from 'jquery';
import showMsg from './module1';

console.log($);
showMsg();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}