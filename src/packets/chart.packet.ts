import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { PacketReader } from "@/internals";
import {
  DataByte,
  IReadCustomData,
  TypedData,
} from "@/message-structures/typed-data";
import {
  IBar,
  IBarReqResponse,
  IBarResponse,
  IBarSnapshotResponse,
} from "@/models/bar.model";
import { getPackLength, PacketManner } from "./packet-manner";
const NumUpdatesDataByte = new DataByte("numUpdates", TypedData.SHORT);

const BAR_STRUCTURE = [
  new DataByte("interval", TypedData.SHORT), // 0
  new DataByte("time", TypedData.LONG), // 8
  new DataByte("open", TypedData.FLOAT), // 16
  new DataByte("high", TypedData.FLOAT), // 16
  new DataByte("low", TypedData.FLOAT), // 16
  new DataByte("close", TypedData.FLOAT), // 16
  new DataByte("volume", TypedData.FLOAT), // 16
]; // 19

class BarStructData extends DataByte implements IReadCustomData {
  getCustomValue(reader: PacketReader): IBar[] {
    const bars = [];
    const itemLength = getPackLength(BAR_STRUCTURE);
    const length =
      NumUpdatesDataByte.getRealValue() * itemLength || this.length();
    const maxLoop = length / itemLength;

    for (let i = 0; i < maxLoop; i++) {
      let o = {};

      BAR_STRUCTURE.forEach((dataByte) => {
        o[dataByte.name] = dataByte.getValue(reader);
      });

      bars.push(o);
    }

    return bars;
  }
}

const BAR_SNAPSHOT_MESSAGE_STRUCTURE = [
  new DataByte("type", TypedData.SHORT), // 4
  new DataByte("scrollInitialize", TypedData.SHORT), // 6
  new DataByte("symbolEnum", TypedData.SHORT), // 8
  new DataByte("symbolType", TypedData.SHORT), // 10
  NumUpdatesDataByte, // 12
  new DataByte("updateType", TypedData.SHORT), // 14
  new DataByte("symbolName", TypedData.CHAR, 24), // 16
  new DataByte("sendingTime", TypedData.LONG), // 40
  new DataByte("seqNum", TypedData.INT), // 48
  new BarStructData("chartBars", TypedData.CUSTOM_DATA, 1380), // 52
];

export const BarSnapshotManner = new PacketManner<IBarSnapshotResponse>(
  PacketHeaderMessageType.BAR_SNAPSHOT,
  BAR_SNAPSHOT_MESSAGE_STRUCTURE
);

const BAR_MESSAGE_STRUCTURE = [
  new DataByte("type", TypedData.SHORT), // 4
  new DataByte("interval", TypedData.SHORT), // 6
  new DataByte("symbolEnum", TypedData.SHORT), // 8
  new DataByte("symbolType", TypedData.SHORT), // 10
  new DataByte("symbolName", TypedData.CHAR, 12), // 12
  new DataByte("time", TypedData.LONG), // 24
  new DataByte("open", TypedData.FLOAT), // 32
  new DataByte("high", TypedData.FLOAT), // 36
  new DataByte("low", TypedData.FLOAT), // 40
  new DataByte("close", TypedData.FLOAT), // 44
  new DataByte("volume", TypedData.FLOAT), // 48
  new DataByte("sendingTime", TypedData.LONG), // 52
  new DataByte("seqNum", TypedData.INT), // 60
];

export const BarManner = new PacketManner<IBarResponse>(
  PacketHeaderMessageType.BAR_MESSAGE,
  BAR_MESSAGE_STRUCTURE
);

const BAR_REQ_MESSAGE_STRUCTURE = [
  new DataByte("type", TypedData.SHORT), // 4
  new DataByte("scrollInitialize", TypedData.SHORT), // 6
  new DataByte("symbolEnum", TypedData.SHORT), // 8
  new DataByte("barInterval", TypedData.SHORT), // 10
  new DataByte("symbolType", TypedData.SHORT), // 12
  new DataByte("start", TypedData.LONG), // 14
  new DataByte("end", TypedData.LONG), // 22
  new DataByte("symbolName", TypedData.CHAR, 24), // 30
  new DataByte("sendingTime", TypedData.LONG), // 54
  new DataByte("seqNum", TypedData.INT), // 62
];

export const BarReqManner = new PacketManner<IBarReqResponse>(
  PacketHeaderMessageType.BAR_REQUEST,
  BAR_REQ_MESSAGE_STRUCTURE
);
