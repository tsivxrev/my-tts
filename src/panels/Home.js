import { React, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Group, SimpleCell, CardGrid, Card, Title, Spacing, InfoRow, Separator,
} from '@vkontakte/vkui';
import { Icon28ReplayOutline, Icon28MoneyTransferOutline } from '@vkontakte/icons';

import StoreContext from '../store/context';

const Home = (id) => {
  const store = useContext(StoreContext);

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      <Group>
        <CardGrid size="l">
          <Card size="l">
            <div style={{ padding: 25 }}>
              <Title level="3" weight="medium">
                Карта «
                {store.user.card.ltype}
                »
              </Title>
              <Spacing />
              <Title style={{ color: 'var(--accent)' }} level="1" weight="bold">
                {store.user.card.balance}
                {' '}
                ₽
              </Title>
            </div>
          </Card>
        </CardGrid>
        <Spacing />
        <SimpleCell disabled>
          <InfoRow header="Остаток льготных поездок">
            {store.user.card.exemption_balance}
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header="Номер карты">
            {store.user.card.card}
          </InfoRow>
        </SimpleCell>
        <SimpleCell disabled>
          <InfoRow header="Регион">
            {store.user.card.region}
          </InfoRow>
        </SimpleCell>
        <Separator style={{ margin: '12px 0' }} />
        <SimpleCell
          onClick={() => { store.fetchUser(); }}
          expandable
          before={<Icon28ReplayOutline />}
        >
          Обновить
        </SimpleCell>
        <SimpleCell
          onClick={() => { store.setModal('pay'); }}
          expandable
          before={<Icon28MoneyTransferOutline />}
        >
          Пополнить
        </SimpleCell>
      </Group>
    </Panel>
  );
};

export default observer(Home);
