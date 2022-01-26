import { SymbolValue } from "@/constants/symbol-enums";
import { IBar } from "@/models/bar.model";
import { Subject } from "rxjs";

export const TradeUpdateSubject = new Subject();
export const chartUpdateFromTradeSubscriber = () =>
  TradeUpdateSubject.asObservable();

export const ChartUpdateSubject = new Subject<
  IBar & {
    pair: string;
  }
>();
export const chartUpdateSubscriber = () => ChartUpdateSubject.asObservable();

export interface IChartPayload {
  symbolEnum: SymbolValue;
  interval: number;
  bars: IBar[];
}
export const ChartSnapshotSubject = new Subject<IChartPayload>();
export const chartSnapshotSubscriber = () =>
  ChartSnapshotSubject.asObservable();
