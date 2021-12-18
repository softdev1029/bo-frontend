import { RoutePaths } from "@/constants/route-paths";
import { AppTradeType } from "@/constants/trade-type";
import {
  Collapsible,
  Dropdown,
  DropdownPosition,
  Icon,
  InputRadioInline,
} from "@/ui-components";
import { Menu, MenuItemProps, MenuProps } from "@/ui-components/Menu";
import React, { ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import MarketSetting from "@/components/market/Market.setting";

interface HeaderItem {
  title: ReactNode;
  contentClasses?: string;
  displayArrow?: boolean;
  dropdownClasses?: string;
  position?: DropdownPosition;
  arrowClass?: string;
  menu: MenuProps;
}

function lineRenderer(
  element: ReactNode,
  divider: boolean = true,
  spaceBottom: boolean = false
): MenuItemProps {
  return {
    content: horizontal(element),
    divider,
    spaceBottom,
  };
}

function horizontal(element: ReactNode): ReactNode {
  return (
    <div className="d-flex d-justify-content-space-between w-100">
      {element}
    </div>
  );
}

export function getHeaderMarketDropdown({ label, tradeType }) {
  return {
    title: <span className="text--white">{label}</span>,
    displayArrow: true,
    position: DropdownPosition.LEFT,
    dropdownClasses: "market-navigator",
    menu: {
      hoverable: true,
      header: <div>Choose Platform</div>,
      items: [
        {
          content: (
            <NavLink
              activeClassName="cpn-menu__link--active"
              to={`${RoutePaths.EXCHANGE}/BTCUSDT`}
            >
              Spot
            </NavLink>
          ),
          isActive: tradeType === AppTradeType.SPOT,
        },
        {
          content: (
            <NavLink
              activeClassName="cpn-menu__link--active"
              to={`${RoutePaths.DERIVATIVE}/BTCUSDT`}
            >
              Derivatives
            </NavLink>
          ),
          isActive: tradeType === AppTradeType.DERIVATIVE,
        },
      ],
    },
  };
}

// @todo: update data
export function getHeaderContralDetail(data?: any): HeaderItem {
  return {
    title: <span className="text--white">Contract Details</span>,
    contentClasses: "cpn-header__contract-details",
    menu: {
      header: (
        <span className="text--mariner font-bold">
          Full Contract Details(BTCUSD)
        </span>
      ),
      hoverable: true,
      items: [
        lineRenderer(
          <>
            <span>Initial Margin</span>
            <span>1.00%</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Maintenance Margin</span>
            <span>0.50%</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Funding Rate</span>
            <span>0.025%</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Funding Interval</span>
            <span>Continous</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Mark Price</span>
            <span>9601.24</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Index Price</span>
            <span>9598.49</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Funding Index Symbol</span>
            <span className="text--mariner">BTCUSDFI</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Mark Method</span>
            <span>Mark Price</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Auto-Deleveraging Enabled</span>
            <span>Yes</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Risk Limit</span>
            <span>200 BTC</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Risk Limit Increment</span>
            <span>100 BTC</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Open Interest</span>
            <span>612,414,932</span>
          </>
        ),
        lineRenderer(
          <>
            <span>24H Volume</span>
            <span>481,494,818</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Contract Size</span>
            <span>1 USD</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Commission</span>
            <span>
              See <span className="text--mariner">Fees</span> for more details.
            </span>
          </>
        ),
        lineRenderer(
          <>
            <span>Min Price Increment</span>
            <span>0.5 USD</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Max Order Price</span>
            <span>500,000</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Min Order Quantity</span>
            <span>1,000,000</span>
          </>
        ),
        lineRenderer(
          <>
            <span>Type</span>
            <span>Settled in BTC, quoted in USD</span>
          </>
        ),
      ],
    },
  };
}

export function getHeaderMultilanguage(data?: any): HeaderItem {
  return {
    displayArrow: true,
    title: (
      <div className="cpn-header__lang__icon">
        <img src="https://www.countryflags.io/gb/flat/64.png" alt="gb" />
        <span>EN</span>
      </div>
    ),
    contentClasses: "cpn-header__lang__dropdown__content",
    menu: {
      hoverable: true,
      items: [
        {
          content: (
            <div className="menu__lang__item active">
              <img src="https://www.countryflags.io/gb/flat/64.png" alt="gb" />
              <span>English</span>
            </div>
          ),
        },
        {
          content: (
            <div className="menu__lang__item">
              <img src="https://www.countryflags.io/cn/flat/64.png" alt="gb" />
              <span>中文</span>
            </div>
          ),
        },
        {
          content: (
            <div className="menu__lang__item">
              <img src="https://www.countryflags.io/ru/flat/64.png" alt="gb" />
              <span>Pусский</span>
            </div>
          ),
        },
        {
          content: (
            <div className="menu__lang__item">
              <img src="https://www.countryflags.io/jp/flat/64.png" alt="gb" />
              <span>日本語</span>
            </div>
          ),
        },
        {
          content: (
            <div className="menu__lang__item">
              <img src="https://www.countryflags.io/kr/flat/64.png" alt="gb" />
              <span>한국어</span>
            </div>
          ),
        },
      ],
    },
  };
}
export function getHeaderQuestions() {
  return {
    title: (
      <span className="text--white r-font-size-18">
        <Icon id="question-circle" cssmodule="fas" />
      </span>
    ),
    contentClasses: "cpn-header__help",
    menu: {
      header: (
        <div className="cpn-header__menu-header title-2">Help & Support</div>
      ),
      hoverable: true,
      items: [
        {
          content: (
            <div className="title-2">
              <Link to="#">Knowledge Base</Link>
            </div>
          ),
        },
        {
          content: (
            <div className="title-2">
              <Link to="#">Support</Link>
            </div>
          ),
        },
        {
          content: (
            <div className="title-2">
              <Link to="#">Feedback</Link>
            </div>
          ),
        },
        {
          content: (
            <Collapsible title="Join Community">
              <div className="social__ctn">
                <Icon cssmodule="fab" id="discord" />
                <Icon cssmodule="fab" id="telegram-plane" />
                <Icon cssmodule="fab" id="twitter" />
              </div>
            </Collapsible>
          ),
        },
      ],
    },
  };
}
export function getHeaderSetting(data?: any): HeaderItem {
  return {
    title: (
      <span className="text--white font-size-18">
        <Icon id="cog" />
      </span>
    ),
    contentClasses: "cpn-header__platform-settings",
    menu: {
      items: [
        {
          divider: true,
          content: (
            <div>
              <div className="title">Platform Settings</div>
              <div className="theme">
                <span>Theme</span>
                <InputRadioInline
                  value={""}
                  checked={false}
                  onChange={() => {}}
                  label="Light"
                  radioClasses="font-size-10"
                />
                <InputRadioInline
                  value={""}
                  checked={true}
                  onChange={() => {}}
                  label="Dark"
                  radioClasses="font-size-10"
                />
              </div>
            </div>
          ),
        },
        {
          content: horizontal(
            <>
              <div>
                <div className="title">Animations</div>
                <div className="des">Disable to reduce CPU load.</div>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </>
          ),
        },
        {
          content: horizontal(
            <>
              <div>
                <div className="title">Notifications</div>
                <div className="des">Show order notification popups.</div>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </>
          ),
        },
        {
          content: horizontal(
            <>
              <div>
                <div className="title">Sound Effect</div>
                <div className="des">
                  Play sound effects for variety of order actions.
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </>
          ),
        },
        {
          content: horizontal(
            <>
              <div>
                <div className="title">Time Distinction</div>
                <div className="des">
                  Show Recent Trades "Time" row digit discrepancies.
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </>
          ),
        },
        {
          divider: true,
          spaceBottom: true,
          content: (
            <div>
              {horizontal(
                <>
                  <div>
                    <div className="title">Reference Currency</div>
                  </div>
                  <div className="select-box">
                    <span>Bitcoin (BTC)</span>
                    <span className="icon-arrow_down_icon r-font-size-18"></span>
                  </div>
                </>
              )}
              <div>
                <span>
                  Displays equivalent value in preferred cryptocurrency.
                </span>
              </div>
            </div>
          ),
        },
        {
          content: <MarketSetting tradeType={AppTradeType.DERIVATIVE} />,
        },
      ],
    },
  };
}

export function getHeaderItems(headerConfig) {
  return (
    <>
      {headerConfig.map((hconfig: HeaderItem, index: number) => (
        <Dropdown
          hoverable={true}
          key={`dropdown_${index}`}
          arrowClass={hconfig.arrowClass}
          position={hconfig.position}
          title={hconfig.title}
          contentClasses={hconfig.contentClasses}
          dropdownClasses={hconfig.dropdownClasses}
          displayArrow={hconfig.displayArrow}
        >
          <Menu
            header={hconfig.menu.header}
            hoverable={hconfig.menu.hoverable}
            items={hconfig.menu.items}
          />
        </Dropdown>
      ))}
    </>
  );
}
