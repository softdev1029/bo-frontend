// trades = MDExecReport
import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { PacketReader, PacketSender } from "@/internals";
import {
  DataByte,
  IReadCustomData,
  TypedData,
} from "@/message-structures/typed-data";
import { getPackLength, PacketManner } from "./packet-manner";

const BOOK_PRICE_STRUCTURE = [
  new DataByte("price", TypedData.DOUBLE), // 0
  new DataByte("size", TypedData.DOUBLE), // 8
  new DataByte("side", TypedData.CHAR, 1), // 16
  new DataByte("expiryDate", TypedData.CHAR, 24), // 17
  new DataByte("callPut", TypedData.CHAR, 1), // 41
];

class BookPrice10LevelDataByte extends DataByte implements IReadCustomData {
  putCustomValue(values: Object | Object[], sender: PacketSender) {
    const maxLoop = this.length() / getPackLength(BOOK_PRICE_STRUCTURE);
    for (let i = 0; i < maxLoop; i++) {
      BOOK_PRICE_STRUCTURE.forEach((dataByte) => {
        dataByte.putValue(
          values[i] ? values[i][dataByte.name] : undefined,
          sender
        );
      });
    }
  }
  getCustomValue(reader: PacketReader) {
    const prices = [];
    const maxLoop = this.length() / getPackLength(BOOK_PRICE_STRUCTURE);

    for (let i = 0; i < maxLoop; i++) {
      let o = {};

      BOOK_PRICE_STRUCTURE.forEach((dataByte) => {
        o[dataByte.name] = dataByte.getValue(reader);
      });

      prices.push(o);
    }

    return prices;
  }
}

const BOOK_MESSAGE_STRUCTURE = [
  new DataByte("type", TypedData.SHORT), // 4
  new DataByte("padding", TypedData.SHORT), // 6
  new DataByte("symbolEnum", TypedData.SHORT), // 8
  new DataByte("symbolType", TypedData.SHORT), // 10
  new DataByte("sendingTime", TypedData.LONG), // 12
  new DataByte("seqNum", TypedData.INT), // 20
  new DataByte("startLayer", TypedData.SHORT), // 24 // 1, 2, 3
  new DataByte("bit24Symbol", TypedData.CHAR, 12), // 26 // 1, 2, 3
  new BookPrice10LevelDataByte("price", TypedData.CUSTOM_DATA, 340), // 38
];

export const BookManner = (type) =>
  new PacketManner(type, BOOK_MESSAGE_STRUCTURE);

export const TEST_LEVEL_DATA = {
  price: {
    // 2022-07-01
    // 2 Put Bid
    "0": {
      price: "28901.01",
      size: "1.1",
      side: "B",
      expiryDate: "2022-07-01",
      callPut: "P",
    },
    "1": {
      price: "28902.01",
      size: "1.1",
      side: "B",
      expiryDate: "2022-07-01",
      callPut: "P",
    },
    // 1 put ask
    "2": {
      price: "28903.01",
      size: "1.1",
      side: "A",
      expiryDate: "2022-07-01",
      callPut: "P",
    },
    // 1 call bid
    "3": {
      price: "27901.01",
      size: "1.1",
      side: "B",
      expiryDate: "2022-07-01",
      callPut: "C",
    },
    // 2022-09-01
    // 1 Put Bid
    "4": {
      price: "28901.01",
      size: "1.1",
      side: "B",
      expiryDate: "2022-09-01",
      callPut: "P",
    },
    // 2 put ask
    "5": {
      price: "28902.01",
      size: "1.1",
      side: "A",
      expiryDate: "2022-09-01",
      callPut: "P",
    },
    "6": {
      price: "28903.01",
      size: "1.1",
      side: "A",
      expiryDate: "2022-09-01",
      callPut: "P",
    },
    // 1 call bid
    "7": {
      price: "27901.01",
      size: "1.1",
      side: "B",
      expiryDate: "2022-09-01",
      callPut: "C",
    },
  },
};
