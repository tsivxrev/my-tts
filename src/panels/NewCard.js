import { React, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Group, SimpleCell, Div, Headline, Text, Subhead,
} from '@vkontakte/vkui';
import { Icon28ChainOutline } from '@vkontakte/icons';

import StoreContext from '../store/context';

const NewCard = (id) => {
  const store = useContext(StoreContext);

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      <Group>
        <Div>
          <Headline weight="medium" style={{ marginBottom: 16 }}>Мой ТТС</Headline>
          <Text weight="regular" style={{ marginBottom: 9 }}>
            Неофициальный сервис для просмотра баланса транспортных карт
            Тюменской области. Если есть вопросы по поводу данного приложения,
            то напишите мне в личку @nitroauth
          </Text>
          <Subhead weight="regular" style={{ color: 'var(--text_secondary)' }}>
            Для продолжения добавьте свою транспортную карту
          </Subhead>
        </Div>
        <SimpleCell
          onClick={() => { store.setModal('bindCard'); }}
          expandable
          before={<Icon28ChainOutline />}
        >
          Привязать карту
        </SimpleCell>
      </Group>
    </Panel>
  );
};

export default observer(NewCard);
