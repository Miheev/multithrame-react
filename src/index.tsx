import './styles/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app/App';
import * as serviceWorker from './serviceWorker';
import { sharedInjector } from 'src/modules/core/services/shared.container';

ReactDOM.render(<App/>, document.getElementById('root'));

/**
 * Should trigger AppConnector::destroy, which emit destroy event and then the rest containers & services will be destroyed.
 */
window.onunload = function() {
  setTimeout(() => {
    sharedInjector.destroy();
  });
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
