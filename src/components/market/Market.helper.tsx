import { capitalize } from "@/exports";
import { WorkspaceSettingEnum } from "@/models/workspace-setting";

export function getWorkspaceLabel(name: string): string {
  switch (name) {
    case WorkspaceSettingEnum.CONTRACT: {
      return "Contract Details";
    }
    case WorkspaceSettingEnum.TRADE: {
      return "Recent Trades";
    }
    case WorkspaceSettingEnum.ORDERBOOK: {
      return "Order Book";
    }
    case WorkspaceSettingEnum.BALANCE: {
      return "Balances";
    }
    case WorkspaceSettingEnum.MARKET: {
      return "Trading Info";
    }
    case WorkspaceSettingEnum.MARKET_HISTORY: {
      return "Positions & Open Orders";
    }
    default: {
      return capitalize(name);
    }
  }
}
