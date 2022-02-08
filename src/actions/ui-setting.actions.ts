export const UPDATE_UI_SETTING = "@ui/UPDATE_UI_SETTING";
export const OVERRIDE_UI_SETTING = "@ui/OVERRIDE_UI_SETTING";
export const UI_SET_ORDER = "@ui/UI_SET_ORDER";
export const TOGGLE_BOOLEAN_SETTING = "@ui/TOGGLE_BOOLEAN_SETTING";
export const TOGGLE_WORKSPACE_SETTING = "@ui/TOGGLE_WORKSPACE_SETTING";
export const TOGGLE_FAVOR_SYMBOL = "@ui/TOGGLE_FAVOR_SYMBOL";
export const SELECT_ORDER_OPTION = "@ui/SELECT_ORDER_OPTION";
export const SELECT_DATE_OPTION = "@ui/SELECT_DATE_OPTION";
export const SET_FULLSCREEN_MODE = "@ui/SET_FULLSCREEN_MODE";

export function updateUISetting({ key, value, persist = false }) {
  return {
    type: UPDATE_UI_SETTING,
    payload: { key, value, persist },
  };
}

export function overrideUISetting({ settings, persist }) {
  return {
    type: OVERRIDE_UI_SETTING,
    payload: { settings, persist },
  };
}

export function setOrder(section, orderBy, sortDirection, persist) {
  return {
    type: UI_SET_ORDER,
    payload: {
      section,
      key: orderBy,
      direction: sortDirection,
      persist,
    },
  };
}

export function toggleBooleanSetting({ key, persist }) {
  return {
    type: TOGGLE_BOOLEAN_SETTING,
    payload: {
      key,
      persist,
    },
  };
}

export function toggleWorkspaceSetting({ key, persist }) {
  return {
    type: TOGGLE_WORKSPACE_SETTING,
    payload: {
      key,
      persist,
    },
  };
}

// Option OrderBook

export function selectOption({ key, option, persist }) {
  console.log("option:", option);

  return {
    type: SELECT_ORDER_OPTION,
    payload: {
      key,
      option,
      persist,
    },
  };
}

// Full Screen Mode

export function setFullScreenMode({ key, status, persist }) {
  return {
    type: SET_FULLSCREEN_MODE,
    payload: {
      key,
      status,
      persist,
    },
  };
}
