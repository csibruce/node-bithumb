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


// info/ticker

// BithumbApi.call('/info/account', {
//   order_currency:'BTC',
//   payment_currency:'KRW'
// });
// BithumbApi.call('/info/balance'); // bithumb 거래소 회원 지갑 정보
// BithumbApi.call('/info/ticker');  // 회원 마지막 거래 정보

// 회원 거래 내역
// search >> 0 : 전체, 1 : 구매완료, 2 : 판매완료, 3 : 출금중, 4 : 입금, 5 : 출금, 9 : KRW입금중
// BithumbApi.call('/info/user_transactions', { currency: 'BTC' })
//   .then((res) => console.log(res));

// 주문
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
      console.log(chalk.yellow.bold(`주문이 완료되었습니다. order_id: ${order_id}`));
    });
}

orderBitcoin(0.037, 8965000);

// BithumbApi.call('/info/orders', {
//   order_id: '1511365777384',
//   type: 'bid',
//   count: '100',
//   // after: new Date('2017-09-01').getTime().toString(),
//   after: '1511323777608',
//   currency: 'XRP'
// })
//   .then(res => console.log(chalk.red('adsf')));

// 중복api호출...
// Promise.all([order(), order(), order()])
//   .then(() => console.log('======================='));

// 주문 취소
// BithumbApi.call('/trade/cancel')
//   .then(res => console.log(res))
