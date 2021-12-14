import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { PacketManner } from "./packet-manner";

const RISK_UPDATE_REQ_STRUCTURE = [
  new DataByte("messageType", TypedData.SHORT), // 4
  new DataByte("responseType", TypedData.SHORT), // 6
  new DataByte("account", TypedData.INT), // 8
  new DataByte("sessionId", TypedData.INT), // 12
  new DataByte("symbolEnum", TypedData.SHORT), // 16
  new DataByte("key", TypedData.INT), // 18
  new DataByte("msgSeqNum", TypedData.INT), // 22
  new DataByte("sendingTime", TypedData.LONG), // 26
];

export const RiskUpdateReqManner = new PacketManner(
  PacketHeaderMessageType.RISK_UPDATE_REQ,
  RISK_UPDATE_REQ_STRUCTURE
);
