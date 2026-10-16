import { createElement, renderToDOM } from '../Exercise1/mini-react.js';
import {
  resetCursor,
  setRenderer,
  setupEventDelegation,
  useState,
} from './reactive-engine.js';

const initialTasks = [
  {
    id: crypto.randomUUID(),
    title: 'Review PR',
  },
  {
    id: crypto.randomUUID(),
    title: 'Verify AST',
  },
];

const root = document.getElementById('app');

if (!root) {
  throw new Error('Root container #app was not found.');
}

export function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('ALL');

  const visibleTasks = tasks.filter(() => true);

  const addTask = () => {
    setTasks((previousTasks) => [
      ...previousTasks,
      {
        id: crypto.randomUUID(),
        title: `Task ${previousTasks.length + 1}`,
      },
    ]);
  };

  const filterButton = (label) =>
    createElement(
      'button',
      {
        type: 'button',
        'aria-pressed': filter === label,
        onClick: () => setFilter(label),
      },
      label
    );

  return createElement(
    'main',
    { className: 'task-manager' },

    createElement(
      'header',
      null,
      createElement('h2', null, `Tasks: ${tasks.length}`)
    ),

    createElement(
      'section',
      { 'aria-label': 'Task filters' },
      filterButton('ALL'),
      filterButton('DONE'),
      filterButton('ACTIVE')
    ),

    createElement(
      'section',
      { 'aria-label': 'Task list' },
      createElement(
        'ul',
        null,
        visibleTasks.map((task) =>
          createElement(
            'li',
            { key: task.id },
            task.title
          )
        )
      )
    ),

    createElement(
      'button',
      {
        type: 'button',
        onClick: addTask,
      },
      'Add Task'
    )
  );
}

export function renderApp() {
  resetCursor();

  const vNode = TaskApp();

  root.replaceChildren(renderToDOM(vNode));
}

setRenderer(renderApp);
setupEventDelegation(root);
renderApp();