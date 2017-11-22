// https://www.bithumb.com/u1/US127

// MESSAGE
// 5100	Bad Request
// 5200	Not Member
// 5300	Invalid Apikey
// 5302	Method Not Allowed
// 5400	Database Fail
// 5500	Invalid Parameter
// 5600	CUSTOM NOTICE (상황별 에러 메시지 출력)
// 5900	Unknown Error

const _ = require('lodash');
const chalk = require('chalk');
const Credential = require('./credential.js');
const XCoinAPI = require('./xcoin.js');
const BithumbApi = new XCoinAPI(Credential.api_key, Credential.api_secret)

const getMyBTCBalance = async () => {
  return await BithumbApi.call('/info/balance', { currency: 'BTC' }) // bithumb 거래소 회원 지갑 정보
    .then(res => {
      if (res.status !== '0000') return;

      const {
        total_krw,
        in_use_krw,
        available_krw,
        misu_krw,
        total_btc,
        in_use_btc,
        available_btc,
        misu_btc,
        xcoin_last
      } = res.data;

      console.log(chalk.yellow.bold(`[ 비트코인 잔액 ]`));
      console.log(chalk.yellow(`----------------------------------`));
      console.log(chalk.yellow(`총 원화            : ${total_krw}원`));
      console.log(chalk.yellow(`사용 중            : ${in_use_krw}원`));
      console.log(chalk.yellow(`구매가능한 원화    : ${available_krw}원`));
      console.log(chalk.yellow(`구매가능한 비트코인: ${available_btc}`));
      console.log(chalk.yellow(`마지막 거래채결금액: ${xcoin_last}원`));
      console.log(chalk.yellow(`----------------------------------`));
      return { available_btc, xcoin_last };
    });
}

const orderBitcoin = (units, price) => {
  console.log(chalk.yellow(`[ 비트코인 주문 ] ${new Date()}`));
  console.log(chalk.yellow(`주문가격: ${price}`));
  console.log(chalk.yellow(`주문수량: ${units}`));

  return BithumbApi.call('/trade/place', {
    order_currency: 'BTC',    // BTC, ETH, DASH, LTC, ETC, XRP, BCH, XMR, ZEC, QTUM (기본값: BTC)
    Payment_currency: 'KRW',  // KRW (기본값)
    units: units.toString(),  // 주문수량 - 1회 최소 수량 (BTC: 0.001 | ETH: 0.01 | DASH: 0.01 | LTC: 0.1 | ETC: 0.1 | XRP: 10 | BCH: 0.01 | XMR: 0.01 | ZEC: 0.001 | QTUM: 0.1) - 1회 최대 수량 (BTC: 300 | ETH: 2,500 | DASH: 4,000 | LTC: 15,000 | ETC: 30,000 | XRP: 2,500,000 | BCH: 1,200 | XMR: 10,000 | ZEC: 2,500 | QTUM: 30,000)
    price: price.toString(),  // 1Currency당 거래금액 (BTC, ETH, DASH, LTC, ETC, XRP, BCH, XMR, ZEC, QTUM)
    type: 'bid',              // 거래유형 (bid : 구매, ask : 판매)
  })
    .then(res => {
      const { status, order_id, message } = res;
      if (status !== '0000') {
        console.log(chalk.bgWhite('ERROR 주문오류!!'));
        console.log(chalk.red(`${message}(${status})`));
        return;
      }
      // TODO 주문완료된 order_id 저장하기 -> 주문체결여부 수시로 확인해야함.
      console.log(chalk.yellow.bold(`주문이 완료되었습니다. order_id: ${order_id}`));
    });
}

getMyBTCBalance()
  .then(async res => {
    const { available_btc, xcoin_last } = res;

    // TODO 코인 수량은 소수점 4째짜리 까지만 입력가능합니다.(5600)
    // TODO 최소주문수량이상으로 주문하게 할 것. (각 코인의 최소주문수량 알아보기)
    await orderBitcoin(available_btc, xcoin_last);
  });
