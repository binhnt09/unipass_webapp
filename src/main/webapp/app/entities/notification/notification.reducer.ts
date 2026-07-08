import { loadMoreDataWhenScrolled } from 'react-jhipster';

import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';

import { getPageNumberFromLinkHeader } from 'app/shared/jhipster/link-header';
import { INotification, defaultValue } from 'app/shared/model/notification.model';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity } from 'app/shared/util/entity-utils';

const initialState: EntityState<INotification> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  unreadCount: 0,
};

const apiUrl = 'api/notifications';

// Actions

export const getEntities = createAsyncThunk(
  'notification/fetch_entity_list',
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${Date.now()}`;
    return axios.get<INotification[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getMyNotifications = createAsyncThunk(
  'notification/fetch_my_notifications',
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}/my-notifications?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${Date.now()}`;
    return axios.get<INotification[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getUnreadCount = createAsyncThunk(
  'notification/fetch_unread_count',
  async () => {
    return axios.get<number>(`${apiUrl}/unread-count`);
  },
  { serializeError: serializeAxiosError },
);

export const markAsRead = createAsyncThunk(
  'notification/mark_as_read',
  async (id: string | number) => {
    return axios.put<void>(`${apiUrl}/${id}/read`);
  },
  { serializeError: serializeAxiosError },
);

export const markAllAsRead = createAsyncThunk(
  'notification/mark_all_as_read',
  async () => {
    return axios.put<void>(`${apiUrl}/read-all`);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'notification/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<INotification>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'notification/create_entity',
  async (entity: INotification) => {
    return axios.post<INotification>(apiUrl, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'notification/update_entity',
  async (entity: INotification) => {
    return axios.put<INotification>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'notification/partial_update_entity',
  async (entity: INotification) => {
    return axios.patch<INotification>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'notification/delete_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return await axios.delete<INotification>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// slice

export const NotificationSlice = createEntitySlice({
  name: 'notification',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(markAsRead, markAllAsRead), state => {
        state.updating = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(getEntities, getMyNotifications), (state, action) => {
        const { data, headers } = action.payload;
        const links = getPageNumberFromLinkHeader(headers.link);

        return {
          ...state,
          loading: false,
          links,
          entities: loadMoreDataWhenScrolled(state.entities || [], data || [], links),
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity, getMyNotifications, getUnreadCount), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity, markAsRead, markAllAsRead), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = NotificationSlice.actions;

// Reducer
export default NotificationSlice.reducer;
