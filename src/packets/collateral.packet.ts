import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import {
  ICollateralData,
  ICollateralUpdateRequest,
} from "@/models/balance.model";
import { PacketManner } from "./packet-manner";
import { RISK_SYMBOL_COLLATERAL } from "./user-risk.packet";

const COLLATERAL_UPDATE_REQ_DATA = [
  new DataByte("type", TypedData.SHORT), // 4
  new DataByte("updateType", TypedData.SHORT), // 6
  new DataByte("accountId", TypedData.INT), // 8
  new DataByte("sessionId", TypedData.INT), // 12
  new DataByte("symbolEnum", TypedData.SHORT), // 16
  new DataByte("key", TypedData.INT), // 18
  new DataByte("seqNum", TypedData.INT), // 22
  new DataByte("sendingTime", TypedData.LONG), // 26
];

export const CollateralUpdateRequestManner =
  new PacketManner<ICollateralUpdateRequest>(
    PacketHeaderMessageType.COLLATERAL_UPDATE_REQ,
    COLLATERAL_UPDATE_REQ_DATA
  );
export const CollateralRequestManner = new PacketManner<ICollateralData>(
  PacketHeaderMessageType.COLLATERAL,
  RISK_SYMBOL_COLLATERAL
);
