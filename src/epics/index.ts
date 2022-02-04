import {
  dataFeed,
  adminRisk,
  wsOnAdminRiskMessageEpic,
  onWebWorkerEpic,
  wsOnOrderMessageEpic,
  wsOnMarketMessageEpic,
} from "./ws.epics";
import {
  login2FAEpic,
  logoutEpic,
  logoutSuccessEpic,
  loginEpic,
  loginSuccessEpic,
} from "./auth.epics";
import { storageSaveEpic, storageDeleteEpic } from "./storage.epics";
import { uiSettingEpic } from "./ui-setting.epics";
import { instrumentRequestEpic } from "./ticker.epics";
import { initBookEpic } from "./book.epics";
import { initTradeEpic } from "./trade.epics";
import { orderFormEpic } from "./order-form.epics";

export const rootEpic = {
  adminRisk,
  onWebWorkerEpic,
  // dataFeed,
  wsOnAdminRiskMessageEpic,
  wsOnMarketMessageEpic,
  // setupWsConnectionEpic,
  // testAdminRiskEpic,
  wsOnOrderMessageEpic,
  loginSuccessEpic,
  loginEpic,
  login2FAEpic,
  logoutEpic,
  logoutSuccessEpic,
  storageSaveEpic,
  storageDeleteEpic,
  uiSettingEpic,
  instrumentRequestEpic,
  initBookEpic,
  initTradeEpic,
  orderFormEpic,
};
