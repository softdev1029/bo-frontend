import React from "react";
import { connect } from "react-redux";
import _debounce from "lodash/debounce";
import Chart from "./TVChart";
// import { getActiveOrders } from '../../../selectors/order.selectors';
import { getChartSettingsKey } from "./Chart.themes";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  toggleWorkspaceSetting,
  updateUISetting,
} from "@/actions/ui-setting.actions";
import { getLastPriceBySymbol } from "@/selectors/ticker.selectors";
import { EMPTY_ARRAY } from "@/exports";
import { WorkspaceSettingEnum } from "@/models/workspace-setting";
import { getSymbolEnum } from "@/exports/ticker.utils";
import { chartSnapshotSubscriber, IChartPayload } from "./Chart.subject";
import { IBar } from "@/models/bar.model";
import { sendWsData } from "@/actions/ws.actions";
import { WebSocketKindEnum } from "@/constants/websocket.enums";
import { ScrollInitalizeEnum } from "@/constants/system-enums";
import { appTradeTypeToSymbolType } from "@/constants/trade-type";
import { BarReqManner } from "@/packets/chart.packet";
// import { cancelOrder } from '../../../actions/order.actions';
// import { getPositionBySymbol } from '../../../selectors/positions.selectors';
// import { closePosition } from '../../../actions/position.actions';

const mapStateToProps = (state, { pair }) => {
  // const ready = true;
  // const showPriceAlerts = getSetting(state)('show_chart_alerts');
  // const showOrders = getSetting(state)('show_chart_orders');
  // const showPositions = getSetting(state)('show_chart_positions');
  const interval = getSetting(state)("chart_interval");
  const chartType = getSetting(state)("chart_type");
  const chartAction = getSetting(state)("chart_action");
  const chartIntervals = getSetting(state)("chart_intervals");

  // const position = showPositions && (tradingType === "margin" ? getPositionBySymbol(state, pair) : undefined);

  return {
    pair,
    // ready,
    interval,
    chartType,
    chartAction,
    chartIntervals,
    lastPrice: getLastPriceBySymbol(state)(pair),
    height: getSetting(state)("chart_height"),
    theme: getSetting(state)("theme"),
    currentChartTheme: getSetting(state)("current_chart_theme"),
    timeDifference: 1,
    candles: EMPTY_ARRAY,
    chartSettings: getSetting(state)(getChartSettingsKey()),
    priceAlerts: null,
    // orders: (showOrders && getActiveOrders(state)) || null,
    orders: null,
    position: undefined,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  addPriceAlert(pair, price) {
    console.warn("addPriceAlert", pair, price);
    //TODO@chart
    // callLegacyFunction('alert', 'setPriceAlerts', pair, price)
  },
  removePriceAlert(id) {
    //TODO@chart
    console.warn("removePriceAlert", id);
    // callLegacyFunction('alert', 'removePriceAlert', id)
  },
  cancelOrder(id, symbol) {
    // dispatch(cancelOrder(id, symbol));
  },
  setOrderFromPrice(value) {
    //TODO@chart
    console.warn("setOrderFromPrice", value);
  },
  setInitialTimeDiff: () => {
    // sets a default timeDiff to have a faster chart boot
    console.warn("setInitialTimeDiff");
  },
  updateInterval(nextInterval) {
    dispatch(
      updateUISetting({
        key: "chart_interval",
        value: nextInterval,
        persist: false,
      })
    );
  },
  updateChartTheme(theme) {
    dispatch(
      updateUISetting({
        key: "current_chart_theme",
        value: theme,
        persist: false,
      })
    );
  },
  closePosition(amount, symbol, side) {
    // dispatch(closePosition({side, symbol, amount}))
  },
  closeCard(e) {
    dispatch(
      toggleWorkspaceSetting({
        key: WorkspaceSettingEnum.CHART,
        persist: false,
      })
    );
  },
  getChartHistoryRequest({ interval, tradingType, pair, start, end }) {
    const payload = {
      scrollInitialize: ScrollInitalizeEnum.SCROLL,
      symbolEnum: getSymbolEnum(pair),
      barInterval: interval,
      symbolType: appTradeTypeToSymbolType(tradingType),
      start,
      end,
      symbolName: pair,
      sendingTime: Date.now(),
    };
    const sender = BarReqManner.send(payload);
    console.log(">> TV payload", payload, sender);
    dispatch(sendWsData(WebSocketKindEnum.MARKET, sender));
  },
});

// function InternalWrapper(props) {
//   const { theme } = useThemeContext();
//   const { ready, isVisible, chartSettings, currentChartTheme, updateChartTheme, dispatch } = props;

//   const persistChartSettings = useCallback((currentChartSettings?) => {
//     const chartSettingsToPersist =
//       currentChartSettings !== undefined ? currentChartSettings : chartSettings;

//     dispatch(
//       updateUISetting({
//         key: getChartSettingsKey(),
//         value: chartSettingsToPersist,
//         persist: false,
//       })
//     );
//   }, [dispatch, chartSettings]);

//   const persistChartSettingsThrottled = _debounce(persistChartSettings, 3000, {
//     maxWait: 10000,
//   });

//   const updateChartSettings = useCallback((currentChartSettings, persistImmediately) => {
//     // const key = getChartSettingsKey();

//     if (persistImmediately) {
//       // sometimes it's important to persist settings immediately
//       persistChartSettings(currentChartSettings);
//     } else {
//       dispatch(updateUISetting({ key: getChartSettingsKey(), value: currentChartSettings, persist: false }));
//       persistChartSettingsThrottled(currentChartSettings);
//     }
//   }, [dispatch, persistChartSettings, persistChartSettingsThrottled]);

//   useEffect(() => {
//     persistChartSettings();
//     // prevent debounced "persistChartSettings" function calls
//     persistChartSettingsThrottled.cancel();
//   }, [persistChartSettings, persistChartSettingsThrottled])

//   useEffect(() => {
//     if(currentChartTheme === theme) return;
//     updateChartTheme(theme);
//   }, [theme, currentChartTheme, updateChartTheme])

//   if (!ready) return <p>Loading...</p>;

//   // WARNING when chart is collapsed we cannot render it, otherwise TV throws errors
//   if (!isVisible) {
//     return <p>collapsed...</p>
//   }
//   return <Chart {...props} updateChartSettings={updateChartSettings} />;
// }

interface IChartContainerWrapperState {
  isReady: boolean;
  data?: IBar[];
}
class InternalWrapper extends React.PureComponent<
  any,
  IChartContainerWrapperState
> {
  private persistChartSettingsThrottled;
  private _snapshotSubscription$;

  constructor(props) {
    super(props);

    this.updateChartSettings = this.updateChartSettings.bind(this);
    this.persistChartSettings = this.persistChartSettings.bind(this);

    // debounce settings persist for 3 seconds, but guarantee that max delay is no more than 10 seconds
    this.persistChartSettingsThrottled = _debounce(
      this.persistChartSettings,
      3000,
      { maxWait: 10000 }
    );

    this.state = {
      isReady: false,
      data: null,
    };
  }

  componentDidMount() {
    this.persistChartSettings();
    // prevent debounced "persistChartSettings" function calls
    this.persistChartSettingsThrottled.cancel();

    this._snapshotSubscription$ = chartSnapshotSubscriber().subscribe(
      (chartPayload: IChartPayload) => {
        if (
          chartPayload.symbolEnum === getSymbolEnum(this.props.pair)
          // chartPayload.interval === +RESOLUTION_MAP[this.props.interval]
        ) {
          // const candles = chartPayload.bars.map(bar => _omit(bar, ["interval"]));
          console.log("chartPayload.bars", chartPayload.bars);
          this.setState({
            isReady: true,
            data: chartPayload.bars,
          });
        }
      }
    );
  }

  componentWillUnmount(): void {
    if (this._snapshotSubscription$) {
      this._snapshotSubscription$.unsubscribe();
    }
  }

  persistChartSettings(chartSettings?) {
    const chartSettingsToPersist =
      chartSettings !== undefined ? chartSettings : this.props.chartSettings;

    this.props.dispatch(
      updateUISetting({
        key: getChartSettingsKey(),
        value: chartSettingsToPersist,
        persist: false,
      })
    );
  }

  updateChartSettings(chartSettings, persistImmediately) {
    // const key = getChartSettingsKey();

    if (persistImmediately) {
      // sometimes it's important to persist settings immediately
      this.persistChartSettings(chartSettings);
    } else {
      this.persistChartSettingsThrottled(chartSettings);
    }
  }

  render() {
    const { props, updateChartSettings } = this;
    const { isReady, data } = this.state;

    const childProps = {
      ...props,
      isVisible: isReady,
      ready: isReady,
      updateChartSettings,
      candles: data,
    };

    // if (!childProps.ready) {
    //   return <p>Loading...</p>;
    // }

    // WARNING when chart is collapsed we cannot render it, otherwise TV throws errors
    // if (!childProps.isVisible) {
    //   return <p>collapsed...</p>;
    // }

    return <Chart {...childProps} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InternalWrapper);
