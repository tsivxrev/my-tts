import { React } from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import App from './App';
import StoreContext from './store/context';
import Store from './store';

bridge.send('VKWebAppInit');

ReactDOM.render(
  <ConfigProvider scheme="space_gray">
    <AdaptivityProvider>
      <StoreContext.Provider value={new Store()}>
        <App />
      </StoreContext.Provider>
    </AdaptivityProvider>
  </ConfigProvider>,
  document.getElementById('root'),
);
