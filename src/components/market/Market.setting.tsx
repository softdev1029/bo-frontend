import React, { useCallback } from 'react';
import { Dropdown, Menu, MenuItem, Button, Switch } from '@/ui-components';
import { getSetting } from '@/selectors/ui-setting.selectors';
import { WorkspaceSetting, WorkspaceSettingEnum } from '@/models/workspace-setting';
import { getWorkspaceLabel } from './Market.helper';
import { updateUISetting } from '@/actions/ui-setting.actions';
import { defaultWorkspace } from '@/exports/defaultUISettings';
import { connect } from 'react-redux';
import { AppTradeType } from '@/constants/trade-type';

interface MarketSettingToggleProps {
  saveWorkspaceFunc: (workpsace: WorkspaceSetting, persist?: boolean) => void;
  name: string;
  enabledWorkspaces: WorkspaceSetting;
  divider?: boolean;
  spaceBottom?: boolean;
}
const MarketSettingToggle = ({ divider, spaceBottom, enabledWorkspaces, name, saveWorkspaceFunc }: MarketSettingToggleProps) => {
  const onChange = (checked: boolean) => {
    const newWorkspaces = {
      ...enabledWorkspaces,
      [name]: checked
    };

    saveWorkspaceFunc(newWorkspaces)
  };

  const isActive = enabledWorkspaces[name];

  return (
    <MenuItem divider={divider} spaceBottom={spaceBottom} content={
      <div className="d-flex d-justify-content-space-between">
        <span className="text--white">{getWorkspaceLabel(name)}</span>
        <Switch isActive={isActive} onChange={onChange} />
      </div>
    } />
  );
}

const MarketSetting = ({ tradeType, enabledWorkspaces, saveWorkspace, reset }) => {
  const onClickReset = useCallback(() => {
    reset(true);
  }, [reset]);

  return (
    <Menu>
      <div className="pb-5 text--silver-300 d-flex d-align-items-center d-justify-content-space-between">
        <span>Customize Workspace</span>
        <Button classes="pr-0" clear={true} onClick={onClickReset}>
          <span className="text--mariner">Reset to Default</span>
        </Button>
      </div>
      <MarketSettingToggle name={WorkspaceSettingEnum.CHART} enabledWorkspaces={enabledWorkspaces} saveWorkspaceFunc={saveWorkspace} />
      <MarketSettingToggle name={WorkspaceSettingEnum.ORDERBOOK} enabledWorkspaces={enabledWorkspaces} saveWorkspaceFunc={saveWorkspace} />
      <MarketSettingToggle name={WorkspaceSettingEnum.TRADE} enabledWorkspaces={enabledWorkspaces} saveWorkspaceFunc={saveWorkspace} />
      {/* <MarketSettingToggle name={WorkspaceSettingEnum.MARKET_HISTORY} enabledWorkspaces={enabledWorkspaces} saveWorkspaceFunc={saveWorkspace} /> */}
      <MarketSettingToggle name={WorkspaceSettingEnum.WATCHLIST} enabledWorkspaces={enabledWorkspaces} saveWorkspaceFunc={saveWorkspace} />
      <MarketSettingToggle name={WorkspaceSettingEnum.BALANCE} enabledWorkspaces={enabledWorkspaces} saveWorkspaceFunc={saveWorkspace} />
      <MarketSettingToggle name={WorkspaceSettingEnum.CONTRACT} enabledWorkspaces={enabledWorkspaces} saveWorkspaceFunc={saveWorkspace} />
    </Menu>
  );
}


const mapStateToProps = (state) => ({
  enabledWorkspaces: getSetting(state)('enabled_workspaces'),
});

const mapDispatchToProps = (dispatch) => ({
  saveWorkspace(workpsace: WorkspaceSetting, persist?: boolean) {
    dispatch(updateUISetting({
      key: 'enabled_workspaces',
      value: workpsace,
      persist
    }));
  },
  reset(persist?: boolean) {
    dispatch(updateUISetting({
      key: 'enabled_workspaces',
      value: defaultWorkspace,
      persist
    }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MarketSetting);