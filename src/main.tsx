import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'mobx-react';
import App from './App';
import MetersStore from './stores/MetersStore';
import AddressStore from './stores/AddressStore';
import GlobalStyle from './globalStyles';

const metersStore = MetersStore.create({
  meters: [],
  limit: 20,
  offset: 0,
  loading: false,
});

const addressStore = AddressStore.create({
  addresses: {},
  isLoading: false,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider metersStore={metersStore} addressStore={addressStore}>
    <GlobalStyle />
    <App />
  </Provider>
);
