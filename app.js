// https://www.bithumb.com/u1/US127

const Credential = require('./credential.js');
const XCoinAPI = require('./xcoin.js');
const BithumbApi = new XCoinAPI(Credential.api_key, Credential.api_secret)


// info/ticker

// BithumbApi.call('/info/account', {
//   order_currency:'BTC',
//   payment_currency:'KRW'
// });
BithumbApi.call('/info/balance'); // bithumb 거래소 회원 지갑 정보
// BithumbApi.call('/info/ticker');  // 회원 마지막 거래 정보

// 회원 거래 내역
// search >> 0 : 전체, 1 : 구매완료, 2 : 판매완료, 3 : 출금중, 4 : 입금, 5 : 출금, 9 : KRW입금중
// BithumbApi.call('/info/user_transactions', { currency: 'BTC' })
//   .then((res) => console.log({ res }));
