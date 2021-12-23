import { riskWsUrl, testurl1 } from "@/config/config";
import {
  WebSocketChannelEnum,
  WebSocketKindEnum,
  WebSocketKindStateEnum,
} from "@/constants/websocket.enums";
import { shallowCompareObjects } from "@/exports";
import { ClientLoginManner } from "@/packets/client-login.packet";
import { ColDataManner } from "@/packets/col-data.packet";
import { ColUpdateReqManner } from "@/packets/col-update-req.packet";
import { InstrumentRequestManner } from "@/packets/instrument.packet";
import { OpenOrderReqManner } from "@/packets/open-order-req.packet";
import { RiskUpdateReqManner } from "@/packets/risk-update-req.packet";
import { TransactionManner } from "@/packets/transaction.packet";
import { RiskSymbolManner } from "@/packets/user-risk.packet";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { w3cwebsocket as W3CWebSocket } from "websocket";

interface WSInfo {
  url: string;
  id: number;
  type: WebSocketKindEnum;
}

/**
 * if the primary server is down after 3 retry times -> switch to the secondary server
 */
class WebsocketMananger {
  private wsInstances = {};
  private pendingUrls: { [x in WebSocketKindEnum]?: string[] } = {};
  private usingSockets: { [x in WebSocketKindEnum]?: string } = {};
  socketId: number = WebSocketKindEnum.ADMIN_RISK;

  wsEntriesSubject = new Subject();

  private client: any = null;

  constructor(adminRiskUrl: string) {
    this.usingSockets[WebSocketKindEnum.ADMIN_RISK] = adminRiskUrl;

    this.usingSockets[WebSocketKindEnum.MARKET] = testurl1;

    // this.client = new W3CWebSocket(adminRiskUrl);
    // this.client.binaryType = "arraybuffer";

    // this.client.onopen = () => {
    //   console.log("WebSocket Client Connected");
    // };

    // this.client.onmessage = (message) => {
    //   console.log(message.data);
    //   const bytearray = new Uint8Array(message.data);
    //   const data: number[] = [];
    //   for (let i = 0; i < bytearray.length; i++) {
    //     data.push(bytearray[i]);
    //   }

    //   if (data[0] == "H".charCodeAt(0)) {
    //     const readData = ClientLoginManner.read(data);
    //     console.log("Received Logon reply", readData);
    //   } else if (data[0] == "Y".charCodeAt(0)) {
    //     const readData = InstrumentRequestManner.read(data);
    //     console.log("Received Instrument request reply", readData);
    //   } else if (data[0] == "T".charCodeAt(0)) {
    //     const readData = TransactionManner.read(data);
    //     console.log("Received Transaction reply", readData);
    //   } else if (data[0] == "f".charCodeAt(0)) {
    //     const readData = ColUpdateReqManner.read(data);
    //     console.log("Received Collateral Update Request reply", readData);
    //   } else if (data[0] == "e".charCodeAt(0)) {
    //     const readData = OpenOrderReqManner.read(data);
    //     console.log("Received Open Order Request reply", readData);
    //   } else if (data[0] == "w".charCodeAt(0)) {
    //     const readData = RiskUpdateReqManner.read(data);
    //     console.log("Received Risk Update Request reply", readData);
    //   } else if (data[0] == "N".charCodeAt(0)) {
    //     const readData = RiskSymbolManner.read(data);
    //     console.log("Received Risk User Symbol reply", readData);
    //   } else if (data[0] == "h".charCodeAt(0)) {
    //     const readData = ColDataManner.read(data);
    //     console.log("Received Collateral Data reply", readData);
    //   }
    // };
  }

  send(data: any) {
    // const len = data.length;
    // const bytearray = new Uint8Array(len);
    // for (let i = 0; i < len; ++i) {
    //   bytearray[i] = data[i];
    // }
    // this.client.send(bytearray);
  }

  hasInstance(id: number): boolean {
    return this.wsInstances.hasOwnProperty(id);
  }

  registerInstance(id: number, url: string) {
    if (this.usingSockets[id] === url) this.wsInstances[id] = true;
  }

  removeInstance(id: number) {
    delete this.wsInstances[id];
  }

  getEntries$(): Observable<any> {
    return this.wsEntriesSubject
      .asObservable()
      .pipe(
        distinctUntilChanged((prev, current) =>
          shallowCompareObjects(prev, current)
        )
      );
  }

  addWs(url: string, type: WebSocketKindEnum) {
    if (!this.pendingUrls.hasOwnProperty(type)) this.pendingUrls[type] = [];

    if (!this.pendingUrls[type].includes(url)) {
      this.pendingUrls[type].push(url);
    }
  }

  getUrlEntries(): string[] {
    const urls = [];
    for (let type in this.pendingUrls) {
      const url = this.pendingUrls[type].shift();
      this.usingSockets[type] = url;
      url && urls.push(url);
    }

    console.log("[sock.mgr] url entries", urls);

    console.log("[sock.mgr] remaining pendings", { ...this.pendingUrls });
    return urls;
  }

  // accept current entries and emit new value
  acceptEntries() {
    const ids = [];
    for (let type in this.usingSockets) {
      if (+type === WebSocketKindEnum.ADMIN_RISK) continue;

      ids.push(+type);
    }

    this.wsEntriesSubject.next(ids);
  }

  clear() {}

  isRiskAdminWsById(id: number): boolean {
    return id === WebSocketKindEnum.ADMIN_RISK;
  }

  isMarketWsById(id: number): boolean {
    return id === WebSocketKindEnum.MARKET;
  }

  isOrderWsById(id: number): boolean {
    return id === WebSocketKindEnum.ORDERS;
  }

  isMarketWsByUrl(url: string): boolean {
    const id = this._getRunningSocketTypeByUrl(url);

    return this.isMarketWsById(id);
  }

  isOrderWsByUrl(url: string): boolean {
    const id = this._getRunningSocketTypeByUrl(url);

    return this.isOrderWsById(id);
  }

  private _getRunningSocketTypeByUrl(url: string): number {
    for (let type in this.usingSockets) {
      if (this.usingSockets[type] === url) return +type;
    }

    return 0;
  }

  getUrlFromId(id: number): string | null {
    if (!this.usingSockets[id]) return null;

    return this.usingSockets[id];
  }

  getIdFromUrl(url: string): number | null {
    const id = this._getRunningSocketTypeByUrl(url);

    if (!id) return null;

    return id;
  }

  getSocketInChargeOfByChannel(
    channel: WebSocketChannelEnum
  ): WebSocketKindEnum | null {
    switch (channel) {
      case WebSocketChannelEnum.MARKET:
      case WebSocketChannelEnum.TRADES:
      case WebSocketChannelEnum.ORDERBOOK:
      case WebSocketChannelEnum.CHART: {
        return WebSocketKindEnum.MARKET;
      }
      // tested
      // used to test 2nd websocket
      // case WebSocketChannelEnum.ORDERBOOK:
      // case WebSocketChannelEnum.CHART: {
      // return WebSocketKindEnum.ORDERS;
      // }
      default: {
        return null;
      }
    }
  }
}

export const SingletonWSManager = new WebsocketMananger(riskWsUrl);
