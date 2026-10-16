import { createElement, renderToDOM } from '../mini-react.js';

const vApp = createElement(
  'main',
  {
    id: 'root-view',
    role: 'main',
  },
  createElement(
    'header',
    { className: 'hero' },
    createElement('h1', null, 'Mini React Engine'),
    createElement('p', null, '<img onerror=alert(1)> Safe Text')
  ),
  createElement(
    'button',
    {
      onClick: () => console.log('Ping'),
    },
    'Click'
  )
);

const root = document.getElementById('app');

root.replaceChildren(renderToDOM(vApp));

console.assert(
  root.querySelector('button') !== null,
  'Button mount failed'
);

console.assert(
  root.querySelector('p img') === null,
  'Unsafe image element detected'
);

console.assert(
  root.querySelector('#root-view div') === null,
  'Div soup detected'
);