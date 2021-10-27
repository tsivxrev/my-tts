import { React } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, PanelSpinner,
} from '@vkontakte/vkui';

const Loading = (id) => (
  <Panel id={id}>
    <PanelHeader>Главная</PanelHeader>
    <PanelSpinner />
  </Panel>
);

export default observer(Loading);
