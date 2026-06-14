import { Storage } from 'react-jhipster';

import { Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

import { websocketActivityMessage } from 'app/modules/administration/administration.reducer';
import { getAccount, logoutSession } from 'app/shared/reducers/authentication';
import { getMyNotifications, getUnreadCount } from 'app/entities/notification/notification.reducer';
import { toast } from 'react-toastify';

let stompClient: any = null;

// Export for reuse in other components (like chatPage)
export const getStompClient = () => stompClient;
export const isStompConnected = () => stompClient !== null && stompClient.connected;

let subscriber: any = null;
let notificationSubscriber: any = null;
let connection: Promise<any>;
let connectedPromise: any = null;
let listener: Observable<any>;
let listenerObserver: any;
let notificationListener: Observable<any>;
let notificationObserver: any;
let alreadyConnectedOnce = false;

const createConnection = (): Promise<any> => new Promise(resolve => (connectedPromise = resolve));

const createListener = (): Observable<any> =>
  new Observable(observer => {
    listenerObserver = observer;
  });

const createNotificationListener = (): Observable<any> =>
  new Observable(observer => {
    notificationObserver = observer;
  });

export const sendActivity = (page: string) => {
  connection?.then(() => {
    stompClient?.send(
      '/topic/activity', // destination
      JSON.stringify({ page }), // body
      {}, // header
    );
  });
};

const subscribe = () => {
  connection.then(() => {
    subscriber = stompClient.subscribe('/topic/tracker', data => {
      listenerObserver.next(JSON.parse(data.body));
    });
  });
};

const subscribeNotification = (userId: string | number) => {
  connection.then(() => {
    notificationSubscriber = stompClient.subscribe(`/topic/notification/${userId}`, data => {
      notificationObserver.next(JSON.parse(data.body));
    });
  });
};

const connect = () => {
  if (connectedPromise !== null || alreadyConnectedOnce) {
    // the connection is already being established
    return;
  }
  connection = createConnection();
  listener = createListener();
  notificationListener = createNotificationListener();

  // building absolute path so that websocket doesn't fail when deploying with a context path
  const loc = globalThis.location;
  const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || '';

  const headers = {};
  let url = `//${loc.host}${baseHref}/websocket/tracker`;
  const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  if (authToken) {
    url += `?access_token=${authToken}`;
  }
  const socket = new SockJS(url);
  stompClient = Stomp.over(socket, { protocols: ['v12.stomp'] });

  stompClient.connect(headers, () => {
    connectedPromise('success');
    connectedPromise = null;
    sendActivity(globalThis.location.pathname);
    alreadyConnectedOnce = true;
  });
};

const disconnect = () => {
  if (stompClient !== null) {
    if (stompClient.connected) {
      stompClient.disconnect();
    }
    stompClient = null;
  }
  alreadyConnectedOnce = false;
};

const receive = () => listener;

const unsubscribe = () => {
  if (subscriber !== null) {
    subscriber.unsubscribe();
  }
  if (notificationSubscriber !== null) {
    notificationSubscriber.unsubscribe();
  }
  listener = createListener();
  notificationListener = createNotificationListener();
};

export default store => next => action => {
  if (getAccount.fulfilled.match(action)) {
    connect();
    const isAdmin = action.payload.data.authorities.includes('ROLE_ADMIN');
    if (!alreadyConnectedOnce) {
      if (isAdmin) {
        subscribe();
        receive().subscribe(activity => {
          return store.dispatch(websocketActivityMessage(activity));
        });
      }

      const userId = action.payload.data.id;
      subscribeNotification(userId);
      notificationListener.subscribe(notification => {
        toast.info(notification.title + ': ' + notification.content);
        // Refresh notifications
        store.dispatch(getMyNotifications({ page: 0, size: 20, sort: 'id,desc' }));
        store.dispatch(getUnreadCount());
      });
    }
  } else if (getAccount.rejected.match(action) || action.type === logoutSession().type) {
    unsubscribe();
    disconnect();
  }
  return next(action);
};
