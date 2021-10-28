import { React, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Group, SimpleCell,
} from '@vkontakte/vkui';
import { Icon28ChainOutline, Icon28MoonOutline, Icon28SunOutline } from '@vkontakte/icons';

import StoreContext from '../store/context';

const Settings = (id) => {
  const store = useContext(StoreContext);

  return (
    <Panel id={id}>
      <PanelHeader>Настройки</PanelHeader>
      <Group>
        <SimpleCell
          before={store.user.scheme === 'bright_light' ? <Icon28MoonOutline /> : <Icon28SunOutline />}
          onClick={() => { store.changeScheme(); }}
        >
          Сменить тему
        </SimpleCell>
        <SimpleCell
          onClick={() => { store.setModal('bindCard'); }}
          expandable
          before={<Icon28ChainOutline />}
        >
          Привязать другую карту
        </SimpleCell>
      </Group>
    </Panel>
  );
};

export default observer(Settings);
