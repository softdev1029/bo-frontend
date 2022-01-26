import { GUEST_USER } from "@/reducers/auth.reducer";
import { createSelector } from "reselect";

const getUserReducer = (state) => state.user;

export const getUserEmail = createSelector(getUserReducer, (user) =>
  user.email === GUEST_USER ? "" : user.email
);
export const isUserLoggedIn = createSelector(
  getUserReducer,
  // (user) => user.loggedIn
  (user) => {
    // const whitelist = [97, 89, 109, 113];
    // return user.loggedIn && !!~whitelist.indexOf(user.accountId);
    return user.loggedIn || true;
  }
);

export const getAccessToken = createSelector(
  getUserReducer,
  (user) => user.token || null
);

export const getUsername = createSelector(
  getUserReducer,
  (user) => user.username || ""
);

export const getAccountId = createSelector(
  getUserReducer,
  (user) => user.accountId || 0
);

export const getSessionId = createSelector(
  getUserReducer,
  (user) => user.sessionId || 0
);

export const getTwoFaCode = createSelector(
  getUserReducer,
  (user) => user.twoFACode || ""
);
