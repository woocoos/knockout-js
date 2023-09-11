import { removeItem, setItem } from '@/pkg/localStore';
import { createModel } from 'ice';

type UserState = {
  id: string;
  displayName: string;
  avatarFileId?: string;
};

type ModelState = {
  refreshToken: string;
  token: string;
  tenantId: string;
  user: UserState | null;
};


export default createModel({
  state: {
    token: '',
    refreshToken: '',
    tenantId: '',
    user: null,
    darkMode: false,
    compactMode: false,
  } as ModelState,
  reducers: {
    updateToken(prevState: ModelState, payload: string) {
      if (payload) {
        setItem('token', payload);
      } else {
        removeItem('token');
      }
      prevState.token = payload;
    },
    updateRefreshToken(prevState: ModelState, payload: string) {
      if (payload) {
        setItem('refreshToken', payload);
      } else {
        removeItem('refreshToken');
      }
      prevState.refreshToken = payload;
    },
    updateTenantId(prevState: ModelState, payload: string) {
      if (payload) {
        setItem('tenantId', payload);
      } else {
        removeItem('tenantId');
      }
      prevState.tenantId = payload;
    },
    updateUser(prevState: ModelState, payload: UserState | null) {
      if (payload) {
        setItem('user', payload);
      } else {
        removeItem('user');
      }
      prevState.user = payload;
    },
  },
  effects: () => ({
  }),
});
