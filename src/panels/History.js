import { React, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Group, RichCell, Avatar,
  Panel, PanelHeader, Placeholder,
} from '@vkontakte/vkui';
import { Icon28MoneyCircleOutline, Icon56HistoryOutline } from '@vkontakte/icons';
import StoreContext from '../store/context';

const parseRoute = (route) => route.match(/(?<number>[^.]*)\.\s+(?<route>.*),\sзоны/).groups;

const History = (id) => {
  const store = useContext(StoreContext);
  const events = store.user.card.history.map((event) => (
    <RichCell
      data-type={event.type}
      onClick={() => { store.setModal('eventDetails', event); }}
      key={event.date}
      before={(
        <Avatar size={48}>
          <span
            style={{ color: 'var(--accent)' }}
          >
            {event.type === 'payment'
              ? parseRoute(event.route).number
              : <Icon28MoneyCircleOutline />}
          </span>
        </Avatar>
    )}
      caption={event.date}
      after={`${event.type === 'payment' ? '-' : '+'} ${event.sum} ₽`}
    >
      {event.type === 'payment' ? parseRoute(event.route).route : 'Пополнение баланса'}
    </RichCell>
  ));

  return (
    <Panel id={id}>
      <PanelHeader>История поездок</PanelHeader>
      {events.length > 0 ? <Group>{events.reverse()}</Group>
        : (
          <Group>
            <Placeholder icon={<Icon56HistoryOutline />}>
              История пуста
            </Placeholder>
          </Group>
        )}
    </Panel>
  );
};

export default observer(History);
