import {
  React, useContext,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Placeholder, Group, CardGrid, ContentCard, PullToRefresh,
} from '@vkontakte/vkui';
import { Icon56NewsfeedOutline } from '@vkontakte/icons';
import './News.css';

import StoreContext from '../store/context';

const Feed = (id) => {
  const store = useContext(StoreContext);
  return (
    <Panel id={id}>
      <PanelHeader>Новости</PanelHeader>
      <PullToRefresh isFetching={store.news.isLoading} onRefresh={store.fetchNews}>
        {store.news.items.length > 0
          ? (
            <Group mode="plain">
              <CardGrid style={{ justifyContent: 'center' }} size="l">
                {store.news.items.map((post) => (
                  <ContentCard
                    onClick={() => { store.setModal('openPost', { href: post.link }); }}
                    style={{ maxWidth: '528px', cursor: 'pointer', whiteSpace: 'pre-wrap' }}
                    key={post.id}
                    text={post.excerpt.trim()}
                    header={post.title}
                    caption={post.publish_date.split('+')[0]}
                  />
                ))}
              </CardGrid>
            </Group>
          )
          : (
            <Group>
              <Placeholder icon={<Icon56NewsfeedOutline />}>
                Новостей нет
              </Placeholder>
            </Group>
          )}
      </PullToRefresh>
    </Panel>
  );
};

export default observer(Feed);
