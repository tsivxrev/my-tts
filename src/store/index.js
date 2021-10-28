import { runInAction, makeAutoObservable } from 'mobx';
import bridge from '@vkontakte/vk-bridge';
import { fetchCard, fetchNews } from '../api';

export default class Store {
  isEmbedded = false;

  nav = {
    activeView: 'home',
    activeStory: 'loading',
    activePanel: 'home',
    activeModal: null,
    modalProps: {},
    popout: null,
    snackbar: null,
  }

  user = {
    scheme: 'bright_light',
    cardId: null,
    card: {},
  }

  news = {
    isLoading: true,
    items: [],
  }

  bindCardProperties = {
    isError: false,
    errorMessage: 'Некорректный номер карты',
    isFetching: false,
    temporaryCardId: null,
    submitButtonActive: false,
  }

  constructor() {
    makeAutoObservable(this);
    window.store = this;
  }

  storageSet = async (key, value) => {
    if (this.isEmbedded) {
      try {
        await bridge.send('VKWebAppStorageSet', { key, value });
      } catch (err) {
        localStorage.setItem(key, value);
      }
    }
    localStorage.setItem(key, value);
  }

  get ready() {
    return !!this.user.cardId;
  }

  onStoryChange = (e) => {
    this.nav.activeStory = e.currentTarget.dataset.story;
  }

  changeScheme = () => {
    this.user.scheme = this.user.scheme === 'bright_light' ? 'space_gray' : 'bright_light';
    this.storageSet('scheme', this.user.scheme);
  }

  go = (to) => { // {activeStory: 1, activeView: 2, activePanel: 3}
    Object.assign(this.nav, to);
  }

  setModal = (id, props = this.nav.modalProps) => {
    this.nav.activeModal = id;
    this.nav.modalProps = props;
  }

  bindCardOnClose = () => {
    this.setModal(null);
    this.bindCardProperties.temporaryCardId = null;
    this.bindCardProperties.submitButtonActive = false;
  }

  bindCardInputOnChange = (e) => {
    const { value } = e.currentTarget;
    const valid = value.length === 19 && !Number.isNaN(Number(value));
    this.bindCardProperties.temporaryCardId = value;
    this.bindCardProperties.submitButtonActive = valid;
  }

  bindCardSetErrorMessage = (message) => {
    this.bindCardProperties.errorMessage = message;
  }

  bindCardSetError = () => {
    this.bindCardProperties.isFetching = false;
    this.bindCardProperties.isError = true;
    setTimeout(() => {
      runInAction(() => {
        this.bindCardProperties.isError = false;
      });
    }, 2000);
  }

  bindCard = async () => {
    runInAction(() => {
      this.bindCardProperties.isFetching = true;
    });
    const cardId = this.bindCardProperties.temporaryCardId;

    try {
      const { data } = await fetchCard(cardId);

      if (data === 'EMPTY_CARD') {
        this.bindCardSetError();
        return;
      }

      if (this.isEmbedded) {
        try {
          await bridge.send('VKWebAppStorageSet', { key: 'cardId', value: cardId });
        } catch (err) {
          localStorage.setItem('cardId', cardId);
        }
      }
      localStorage.setItem('cardId', cardId);

      runInAction(() => {
        this.bindCardProperties.isFetching = false;
        this.user.cardId = cardId;
        this.user.card = data;
      });

      this.setModal(null);
      this.go({ activeStory: 'home' });
    } catch (e) {
      if (e.response.statusCode >= 500) {
        this.bindCardSetErrorMessage('Ошибка сервера, повторите попытку позже');
      } else {
        this.bindCardSetErrorMessage('Некорректный номер карты');
      }
      this.bindCardSetError();
    }
  }

  fetchNews = async () => {
    runInAction(() => {
      this.news.isLoading = true;
    });

    try {
      const { data } = await fetchNews();

      runInAction(() => {
        this.news.isLoading = false;
        this.news.items = data.objects;
      });
    } catch {
      runInAction(() => {
        this.news.isLoading = false;
      });
    }
  }

  fetchUser = async () => {
    this.go({ activeStory: 'loading' });
    this.fetchNews();

    try {
      const { data } = await fetchCard(this.user.cardId);

      if (data === 'EMPTY_CARD') {
        this.go({ activeStory: 'newCard' });
        return;
      }

      runInAction(() => {
        this.user.card = data;
      });

      this.go({ activeStory: 'home' });
    } catch (e) {
      if (e.response.statusCode >= 500) {
        this.go({ activeStory: 'error' });
      } else {
        this.go({ activeStory: 'newCard' });
      }
    }
  }
}
