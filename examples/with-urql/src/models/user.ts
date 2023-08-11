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
      prevState.token = payload;
    },
    updateRefreshToken(prevState: ModelState, payload: string) {
      prevState.refreshToken = payload;
    },
    updateTenantId(prevState: ModelState, payload: string) {
      prevState.tenantId = payload;
    },
    updateUser(prevState: ModelState, payload: UserState | null) {
      prevState.user = payload;
    },
  },
  effects: () => ({
  }),
});
