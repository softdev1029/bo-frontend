import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { PacketManner } from "./packet-manner";

const MD_INFO_REQ_MESSAGE_STRUCTURE = [
  new DataByte("type", TypedData.CHAR, 2), // 4
  new DataByte("symbolEnum", TypedData.SHORT), // 6
  new DataByte("protocolType", TypedData.SHORT), // 8
  new DataByte("bookType", TypedData.SHORT), // 10
  new DataByte("account", TypedData.INT), // 12
  new DataByte("key", TypedData.INT), // 16
  new DataByte("sessionId", TypedData.INT), // 20
  new DataByte("sendingTime", TypedData.LONG), // 24
  new DataByte("MsgSeqNum", TypedData.INT), // 32
];

export const MdInfoReqManner = new PacketManner(
  PacketHeaderMessageType.MD_INFO_REQ,
  MD_INFO_REQ_MESSAGE_STRUCTURE
);
