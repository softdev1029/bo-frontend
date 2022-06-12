import { OptionsBookData, OrderBookModel } from "@/models/book.model";
import { CallPutOption } from "@/models/order.model";

export function getOptionOrderBookDataByDate({
  bids,
  asks,
}: {
  bids: OrderBookModel[];
  asks: OrderBookModel[];
}): OptionsBookData {
  const res: OptionsBookData = {};

  for (let i = 0; i < bids.length; i++) {
    const bid = bids[i];
    if (!res[bid.expiryDate]) {
      res[bid.expiryDate] = [];
    }
    const listInDate = res[bid.expiryDate];
    let filled = false;
    for (let j = 0; j < listInDate.length; j++) {
      const item = listInDate[j];
      if (!item.putBid && bid.callPut === CallPutOption.PUT) {
        item.putBid = bid;
        filled = true;
        break;
      }
      if (!item.callBid && bid.callPut === CallPutOption.CALL) {
        item.callBid = bid;
        filled = true;
        break;
      }
    }
    if (!filled) {
      listInDate.push({
        putBid: bid.callPut === CallPutOption.PUT ? bid : null,
        callBid: bid.callPut === CallPutOption.CALL ? bid : null,
        putAsk: null,
        callAsk: null,
      });
    }
  }

  for (let i = 0; i < asks.length; i++) {
    const ask = asks[i];
    if (!res[ask.expiryDate]) {
      res[ask.expiryDate] = [];
    }
    const listInDate = res[ask.expiryDate];
    let filled = false;
    for (let j = 0; j < listInDate.length; j++) {
      const item = listInDate[j];
      if (!item.putAsk && ask.callPut === CallPutOption.PUT) {
        item.putAsk = ask;
        filled = true;
        break;
      }
      if (!item.callAsk && ask.callPut === CallPutOption.CALL) {
        item.callAsk = ask;
        filled = true;
        break;
      }
    }
    if (!filled) {
      listInDate.push({
        putBid: null,
        callBid: null,
        putAsk: ask.callPut === CallPutOption.PUT ? ask : null,
        callAsk: ask.callPut === CallPutOption.CALL ? ask : null,
      });
    }
  }

  return res;
}
