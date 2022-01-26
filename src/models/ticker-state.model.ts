import { ITickerConfig, TickerModel } from "./ticker.model";

export interface TickerState {
  items: TickerModel[];
  instruments: {
    [x: number]: Partial<ITickerConfig>;
  };
  instrumentLoaded: boolean;
}
