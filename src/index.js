import { React } from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import { AdaptivityProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import App from './App';
import StoreContext from './store/context';
import Store from './store';

const store = new Store();

(async () => {
  const isEmbedded = bridge.isEmbedded();
  store.isEmbedded = isEmbedded;

  if (isEmbedded) {
    const { keys } = await bridge.send('VKWebAppStorageGet', { keys: ['cardId', 'scheme'] });
    store.user.cardId = keys[0].value;
    store.user.scheme = keys[1].value;
  } else {
    store.user.cardId = localStorage.getItem('cardId');
    store.user.scheme = localStorage.getItem('scheme') || 'space_gray';
  }
})();

bridge.send('VKWebAppInit');

ReactDOM.render(
  <AdaptivityProvider>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </AdaptivityProvider>,
  document.getElementById('root'),
);
