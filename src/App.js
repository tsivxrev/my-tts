import {
  React, useContext, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';

import {
  Icon28HistoryBackwardOutline,
  Icon28PaymentCardOutline,
  Icon28Newsfeed, Icon28SettingsOutline,
  Icon56MoneyTransferOutline,
  Icon56ChainOutline, Icon24Dismiss, Icon56LinkCircleOutline,
} from '@vkontakte/icons';
import {
  SplitLayout, PanelHeader, SplitCol,
  ViewWidth, View, Panel, usePlatform, InfoRow,
  VKCOM, Group, Cell, Epic, AppRoot, SimpleCell, PanelHeaderClose,
  useAdaptivity, Tabbar, TabbarItem, PanelHeaderButton,
  ModalRoot, ModalCard, Input, Button,
  FormItem, FormLayout, ModalPage, ModalPageHeader, IOS, ANDROID, Separator,
} from '@vkontakte/vkui';

import './App.css';

import StoreContext from './store/context';
import Settings from './panels/Settings';
import NewCard from './panels/NewCard';
import History from './panels/History';
import Loading from './panels/Loading';
import Feed from './panels/Feed';
import Home from './panels/Home';

const App = () => {
  const { viewWidth } = useAdaptivity();
  const platform = usePlatform();
  const store = useContext(StoreContext);

  const isMobile = viewWidth <= ViewWidth.MOBILE;
  const isDesktop = viewWidth >= ViewWidth.TABLET;
  const hasHeader = platform !== VKCOM;

  const modals = (
    <ModalRoot activeModal={store.nav.activeModal}>
      <ModalCard
        id="openPost"
        onClose={() => store.setModal(null)}
        actions={(
          <Button
            onClick={() => store.setModal(null)}
            target="_blank"
            href={store.nav.modalProps.href}
            size="l"
            mode="primary"
          >
            Перейти к новости
          </Button>
        )}
        icon={<Icon56LinkCircleOutline />}
        header="Переход к новости"
        subheader="Откроется данный пост в новой вкладке"
      />

      <ModalCard
        id="pay"
        onClose={() => store.setModal(null)}
        actions={(
          <Button
            onClick={() => { store.setModal(null); }}
            target="_blank"
            href={`https://tmn.pay2way.ru/tcard?c=${store.user.cardId}`}
            size="l"
            mode="primary"
          >
            Перейти к пополнению
          </Button>
        )}
        icon={<Icon56MoneyTransferOutline />}
        header="Пополнение транспортной карты"
        subheader="В приложении этого сделать нельзя, но есть официальный сайт. Нажмите на кнопку ниже!"
      />

      <ModalPage
        id="eventDetails"
        onClose={() => { store.setModal(null); }}
        header={(
          <ModalPageHeader
            right={platform === IOS && (
              <PanelHeaderButton onClick={() => { store.setModal(null); }}>
                <Icon24Dismiss />
              </PanelHeaderButton>
            )}
            left={isMobile && platform === ANDROID && (
              <PanelHeaderClose
                onClick={() => { store.setModal(null); }}
              />
            )}
          >
            {store.nav.modalProps.type === 'replenishment' ? 'Пополнение' : 'Поездка'}
          </ModalPageHeader>
          )}
      >
        <Group>
          <SimpleCell disabled>
            <InfoRow header="Сумма">
              {store.nav.modalProps.sum}
              {' '}
              ₽
            </InfoRow>
          </SimpleCell>
          <SimpleCell disabled>
            <InfoRow header="Дата">
              {store.nav.modalProps.date}
            </InfoRow>
          </SimpleCell>
          <SimpleCell disabled>
            <InfoRow header="Агент">
              {store.nav.modalProps.agent}
            </InfoRow>
          </SimpleCell>
          {store.nav.modalProps.type === 'payment' ? (
            <SimpleCell disabled>
              <InfoRow header="Путь">
                {store.nav.modalProps.route}
              </InfoRow>
            </SimpleCell>
          ) : ''}
          <Separator style={{ margin: '12px 0' }} />
          <SimpleCell disabled>
            <InfoRow header="Баланс">
              {store.nav.modalProps.balance}
              {' '}
              ₽
            </InfoRow>
          </SimpleCell>
          {store.nav.modalProps.type === 'payment' ? (
            <SimpleCell disabled>
              <InfoRow header="Количество льготных поездок">
                {store.nav.modalProps.exemption_balance}
              </InfoRow>
            </SimpleCell>
          ) : ''}
        </Group>
      </ModalPage>

      <ModalCard
        id="bindCard"
        onClose={() => { store.bindCardOnClose(); }}
        icon={<Icon56ChainOutline />}
        header="Привязка карты"
        subheader="Если у Вас уже привязана карта, то новая карта заменит текущую"
        actions={(
          <Button
            onClick={() => { store.bindCard(); }}
            disabled={!store.bindCardProperties.submitButtonActive}
            size="l"
            mode="primary"
            loading={store.bindCardProperties.isFetching}
          >
            Привязать
          </Button>
        )}
      >
        <FormLayout>
          <FormItem
            status={store.bindCardProperties.isError ? 'error' : 'default'}
            bottom={store.bindCardProperties.isError ? store.bindCardProperties.errorMessage : ''}
          >
            <Input
              onChange={store.bindCardInputOnChange}
              placeholder="Номер карты"
            />
          </FormItem>
        </FormLayout>
      </ModalCard>
    </ModalRoot>
  );

  useEffect(() => {
    store.fetchUser();
  }, []);

  return (
    <AppRoot>
      <SplitLayout
        modal={modals}
        header={hasHeader && <PanelHeader separator={false} />}
        style={{ justifyContent: 'center' }}
      >
        {isDesktop && (
          <SplitCol fixed width="280px" maxWidth="280px">
            <Panel>
              {hasHeader && <PanelHeader />}
              <Group mode="plain">
                <Cell
                  disabled={store.nav.activeStory === 'home' || !store.ready}
                  style={store.nav.activeStory === 'home' ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8,
                  } : {}}
                  data-story="home"
                  onClick={store.onStoryChange}
                  before={<Icon28PaymentCardOutline />}
                >
                  Карта
                </Cell>
                <Cell
                  disabled={store.nav.activeStory === 'history' || !store.ready}
                  style={store.nav.activeStory === 'history' ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8,
                  } : {}}
                  data-story="history"
                  onClick={store.onStoryChange}
                  before={<Icon28HistoryBackwardOutline />}
                >
                  История поездок
                </Cell>
                <Cell
                  disabled={store.nav.activeStory === 'feed' || !store.ready}
                  style={store.nav.activeStory === 'feed' ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8,
                  } : {}}
                  data-story="feed"
                  onClick={store.onStoryChange}
                  before={<Icon28Newsfeed />}
                >
                  Новости
                </Cell>
                <Cell
                  disabled={store.nav.activeStory === 'settings' || !store.ready}
                  style={store.nav.activeStory === 'settings' ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8,
                  } : {}}
                  data-story="settings"
                  onClick={store.onStoryChange}
                  before={<Icon28SettingsOutline />}
                >
                  Настройки
                </Cell>
              </Group>
            </Panel>
          </SplitCol>
        )}

        <SplitCol
          animate={!isDesktop}
          spaced={isDesktop}
          width={isDesktop ? '560px' : '100%'}
          maxWidth={isDesktop ? '560px' : '100%'}
        >
          <Epic
            activeStory={store.nav.activeStory}
            tabbar={(!isDesktop
              && store.ready) && (
              <Tabbar>
                <TabbarItem
                  onClick={store.onStoryChange}
                  selected={store.nav.activeStory === 'home'}
                  data-story="home"
                  text="Карта"
                >
                  <Icon28PaymentCardOutline />

                </TabbarItem>
                <TabbarItem
                  onClick={store.onStoryChange}
                  selected={store.nav.activeStory === 'history'}
                  data-story="history"
                  text="История"
                >
                  <Icon28HistoryBackwardOutline />

                </TabbarItem>
                <TabbarItem
                  onClick={store.onStoryChange}
                  selected={store.nav.activeStory === 'feed'}
                  data-story="feed"
                  text="Новости"
                >
                  <Icon28Newsfeed />

                </TabbarItem>
                <TabbarItem
                  onClick={store.onStoryChange}
                  selected={store.nav.activeStory === 'settings'}
                  data-story="settings"
                  text="Настройки"
                >
                  <Icon28SettingsOutline />

                </TabbarItem>
              </Tabbar>
            )}
          >
            <View id="feed" modal={modals} activePanel="feed">
              <Feed id="feed" />
            </View>

            <View id="loading" activePanel="loading">
              <Loading id="loading" />
            </View>

            <View id="newCard" activePanel="newCard">
              <NewCard id="newCard" />
            </View>

            <View id="history" activePanel="history">
              <History id="history" />
            </View>

            <View id="settings" activePanel="settings">
              <Settings id="settings" />
            </View>

            <View id="home" activePanel="home">
              <Home id="home" />
            </View>
          </Epic>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};

export default observer(App);
