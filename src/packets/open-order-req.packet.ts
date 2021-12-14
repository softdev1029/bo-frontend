import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { PacketManner } from "./packet-manner";

const OPEN_ORDER_REQ_STRUCTURE = [
  new DataByte("messageType", TypedData.SHORT), // 4
  new DataByte("account", TypedData.INT), // 6
  new DataByte("symbolEnum", TypedData.SHORT), // 10
  new DataByte("userName", TypedData.CHAR, 12), // 12
  new DataByte("sessionId", TypedData.INT), // 24
  new DataByte("sendingTime", TypedData.LONG), // 28
  new DataByte("msgSeqNum", TypedData.INT), // 36
  new DataByte("key", TypedData.INT), // 40
];

export const OpenOrderReqManner = new PacketManner(
  PacketHeaderMessageType.OPEN_ORDER_REQ,
  OPEN_ORDER_REQ_STRUCTURE
);
