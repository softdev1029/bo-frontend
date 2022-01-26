const http = "https://api.binance.com/api/v3";
const fhttp = "https://fapi.binance.com/fapi/v1";
const ws = "wss://testnet.binance.vision/ws";
const protocol = "wss";
const api = "https://api-dev.bit24.com/";

// wss://api.binance.com:9443/ws/$all@allTickers
export const testurl1 = "wss://stream.binance.com:9443/ws";
export const oesWsUrl = `${protocol}://oes-dev.bit24.com`;
// export const riskWsUrl = `${protocol}://aes-dev.bit24.com`;
export const riskWsUrl = oesWsUrl;

const config = {
  http,
  fhttp,
  ws,
  protocol,
  appIdleTimeout: 3000,
  appSleptTimeout: 5000,
  api,
};

export default config;

// API Key: K6yK77lniZLth3fgsHsUR3zmWCe6FYxOsppXOThvDInxhDw0H6MmnHofGYa8M3IP
// Secret Key: CNljVFL73SpihfwQ3RcYflZLD1WyKU6o3YtCvAKGHrFw6yc02FZyTA7mkx1stmnC
