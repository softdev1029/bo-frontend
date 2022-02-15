import {
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_UPDATE,
} from "@/actions/auth.actions";
import { USER_STORAGE_KEY } from "@/constants/storage-keys";
import { divide } from "@/exports/math";
import Storage from "@/internals/Storage";

// guest user is used for admin/risk authorizaton
export const GUEST_USER = "guest@user.id";

const originalState = {
  email: GUEST_USER,
  loggedIn: false,
  token: null,
  accountId: 90001,
  username: "MTX01",
  //... profile or sth
  // user symbol
  accountEquity: 0,
  symbolEquity: 0,
  tradingDisabled: false,
  availableMargin: 0,
  usedMargin: 0,
  leverage: 25,
  mmr: 0.005, // maintain margin requirement
  imr: 0.01, // initial margin requirement
  executedLongPosition: 0,
  executedShortPosition: 0,
  executedLongCash: 0,
  executedShortCash: 0,
};

const initialState = Object.assign(
  {},
  originalState,
  Storage.get(USER_STORAGE_KEY)
);

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS: {
      // @see fakers/auth.ts
      const { token, username } = action.payload;

      return {
        ...state,
        token,
        email: username,
        loggedIn: true,
      };
    }
    case USER_LOGOUT_SUCCESS: {
      return {
        ...state,
        ...originalState,
      };
    }
    case USER_UPDATE: {
      console.log('USER UPDATE', action.payload);
      const {
        sessionId,
        accountId
      } = action.payload;

      return {
        ...state,
        accountId,
        sessionId
      }
    }
    default:
      return state;
  }
};
