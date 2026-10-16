import { createElement } from '../Exercise1/mini-react.js';
import { useState } from '../Exercise2/reactive-engine.js';

let latestRequestId = 0;

const skeletonStyles = `
  @keyframes skeleton-pulse {
    0% {
      opacity: 0.45;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0.45;
    }
  }

  .feed-skeleton {
    animation: skeleton-pulse 1.2s ease-in-out infinite;
  }

  .feed-skeleton__line {
    display: block;
    width: 100%;
    min-height: 1rem;
    margin-block: 0.5rem;
    background-color: #d9d9d9;
    border-radius: 0.25rem;
  }
`;

/**
 * Simulates an asynchronous feed request with random failure.
 */
export function fetchFeed() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error('Unable to connect to the feed service.'));
        return;
      }

      resolve([
        {
          id: crypto.randomUUID(),
          title: 'Review virtual DOM architecture',
        },
        {
          id: crypto.randomUUID(),
          title: 'Verify state machine transitions',
        },
        {
          id: crypto.randomUUID(),
          title: 'Audit delegated events',
        },
      ]);
    }, 1000);
  });
}

/**
 * Renders a resilient four-state asynchronous data component.
 */
export function DataFeed() {
  const [state, setState] = useState({
    status: 'IDLE',
  });

  const loadData = async () => {
    const requestId = ++latestRequestId;

    setState({
      status: 'LOADING',
    });

    try {
      const items = await fetchFeed();

      if (requestId !== latestRequestId) {
        return;
      }

      setState({
        status: 'SUCCESS',
        data: items,
      });
    } catch (error) {
      if (requestId !== latestRequestId) {
        return;
      }

      setState({
        status: 'ERROR',
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected connection error occurred.',
      });
    }
  };

  switch (state.status) {
    case 'IDLE':
      return createElement(
        'section',
        { 'aria-labelledby': 'feed-heading' },
        createElement('h2', { id: 'feed-heading' }, 'Data Feed'),
        createElement(
          'button',
          {
            type: 'button',
            onClick: loadData,
          },
          'Load Feed'
        )
      );

    case 'LOADING':
      return createElement(
        'section',
        {
          role: 'status',
          'aria-busy': 'true',
          'aria-label': 'Loading feed',
        },
        createElement('style', null, skeletonStyles),
        createElement(
          'article',
          { className: 'feed-skeleton' },
          createElement('span', {
            className: 'feed-skeleton__line',
            'aria-hidden': 'true',
          }),
          createElement('span', {
            className: 'feed-skeleton__line',
            'aria-hidden': 'true',
          }),
          createElement('span', {
            className: 'feed-skeleton__line',
            'aria-hidden': 'true',
          })
        ),
        createElement('p', null, 'Loading feed...')
      );

    case 'SUCCESS':
      return createElement(
        'section',
        { 'aria-labelledby': 'feed-heading' },
        createElement('h2', { id: 'feed-heading' }, 'Data Feed'),
        createElement(
          'ul',
          null,
          state.data.map((item) =>
            createElement(
              'li',
              {
                key: item.id,
                'data-item-id': item.id,
              },
              item.title
            )
          )
        )
      );

    case 'ERROR':
      return createElement(
        'section',
        {
          role: 'alert',
          'aria-labelledby': 'feed-error-heading',
        },
        createElement(
          'h2',
          { id: 'feed-error-heading' },
          'Connection Error'
        ),
        createElement('p', null, state.error),
        createElement(
          'button',
          {
            type: 'button',
            onClick: loadData,
          },
          'Retry Connection'
        )
      );

    default:
      throw new Error(`Unsupported view state: ${state.status}`);
  }
}