import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { PacketManner } from "./packet-manner";

const MD_INFO_RES_MESSAGE_STRUCTURE = [
  new DataByte("type", TypedData.CHAR, 2), // 4
  new DataByte("symbolEnum", TypedData.SHORT), // 6
  new DataByte("protocolType", TypedData.SHORT), // 8
  new DataByte("bookType", TypedData.SHORT), // 10
  new DataByte("mdPrimary", TypedData.CHAR, 24), // 12
  new DataByte("mdSecondary", TypedData.CHAR, 24), // 36
  new DataByte("account", TypedData.INT), // 60
  new DataByte("key", TypedData.INT), // 64
  new DataByte("sessionId", TypedData.INT), // 68
  new DataByte("expirationDate", TypedData.CHAR, 24), // 72
  new DataByte("sendingTime", TypedData.LONG), // 96
  new DataByte("MsgSeqNum", TypedData.INT), // 104
];

export const MdInfoResManner = new PacketManner(
  PacketHeaderMessageType.MD_INFO_RES,
  MD_INFO_RES_MESSAGE_STRUCTURE
);
