'use strict';

//  ---------------------------------------------------------------------------

const { ArgumentsRequired, ExchangeError, ExchangeNotAvailable, InsufficientFunds, AccountSuspended, InvalidNonce, NotSupported, BadRequest, AuthenticationError, RateLimitExceeded, PermissionDenied } = require ('./base/errors');
const Precise = require ('./base/Precise');
const kucoin = require ('./kucoin.js');

//  ---------------------------------------------------------------------------

module.exports = class kucoinfutures extends kucoin {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'kucoinfutures',
            'name': 'Kucoin Futures',
            'countries': [ 'SC' ],
            'rateLimit': 334,
            'version': 'v2',
            'certified': false,
            'pro': true,
            'comment': 'Platform 2.0',
            'quoteJsonNumbers': false,
            'has': {
                'cancelAllOrders': undefined,
                'cancelOrder': undefined,
                'CORS': undefined,
                'createDepositAddress': undefined,
                'createOrder': undefined,
                'fetchAccounts': undefined,
                'fetchBalance': undefined,
                'fetchClosedOrders': undefined,
                'fetchCurrencies': undefined,
                'fetchDepositAddress': undefined,
                'fetchDeposits': undefined,
                'fetchFundingFee': undefined,
                'fetchFundingHistory': undefined,
                'fetchFundingRateHistory': false,
                'fetchIndexOHLCV': false,
                'fetchLedger': undefined,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': undefined,
                'fetchOHLCV': undefined,
                'fetchOpenOrders': undefined,
                'fetchOrder': undefined,
                'fetchOrderBook': undefined,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': undefined,
                'fetchTicker': undefined,
                'fetchTickers': undefined,
                'fetchTime': undefined,
                'fetchTrades': undefined,
                'fetchWithdrawals': undefined,
                'transfer': undefined,
                'withdraw': undefined,
            },
            'urls': {
                'logo': 'https://docs.kucoin.com/futures/images/logo_en.svg',
                'doc': [
                    'https://docs.kucoin.com/futures',
                    'https://docs.kucoin.com',
                ],
                'www': 'https://futures.kucoin.com/',
                'referral': 'https://www.kucoin.com/?rcode=E5wkqe',
                'api': {
                    'futuresPrivate': 'https://api-futures.kucoin.com',
                    'futuresPublic': 'https://api-futures.kucoin.com',
                },
                'test': {
                    'futuresPrivate': 'https://api-sandbox-futures.kucoin.com',
                    'futuresPublic': 'https://api-sandbox-futures.kucoin.com',
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'password': true,
            },
            'api': {
                'futuresPublic': {
                    'get': [
                        'contracts/active',
                        'contracts/{symbol}',
                        'ticker',
                        'level2/snapshot',
                        'level2/depth{limit}',
                        'level2/message/query',
                        'level3/message/query', // deprecated，level3/snapshot is suggested
                        'level3/snapshot', // v2
                        'trade/history',
                        'interest/query',
                        'index/query',
                        'mark-price/{symbol}/current',
                        'premium/query',
                        'funding-rate/{symbol}/current',
                        'timestamp',
                        'status',
                        'kline/query',
                    ],
                    'post': [
                        'bullet-public',
                    ],
                },
                'futuresPrivate': {
                    'get': [
                        'account-overview',
                        'transaction-history',
                        'deposit-address',
                        'deposit-list',
                        'withdrawals/quotas',
                        'withdrawal-list',
                        'transfer-list',
                        'orders',
                        'stopOrders',
                        'recentDoneOrders',
                        'orders/{order-id}', // ?clientOid={client-order-id} // get order by orderId
                        'orders/byClientOid', // ?clientOid=eresc138b21023a909e5ad59 // get order by clientOid
                        'fills',
                        'recentFills',
                        'openOrderStatistics',
                        'position',
                        'positions',
                        'funding-history',
                    ],
                    'post': [
                        'withdrawals',
                        'transfer-out', // v2
                        'orders',
                        'position/margin/auto-deposit-status',
                        'position/margin/deposit-margin',
                        'bullet-private',
                    ],
                    'delete': [
                        'withdrawals/{withdrawalId}',
                        'cancel/transfer-out',
                        'orders/{order-id}',
                        'orders',
                        'stopOrders',
                    ],
                },
            },
            'exceptions': {
                'exact': {
                    // 'order not exist': OrderNotFound,
                    // 'order not exist.': OrderNotFound, // duplicated error temporarily
                    // 'order_not_exist': OrderNotFound, // {"code":"order_not_exist","msg":"order_not_exist"} ¯\_(ツ)_/¯
                    // 'order_not_exist_or_not_allow_to_cancel': InvalidOrder, // {"code":"400100","msg":"order_not_exist_or_not_allow_to_cancel"}
                    // 'Order size below the minimum requirement.': InvalidOrder, // {"code":"400100","msg":"Order size below the minimum requirement."}
                    // 'The withdrawal amount is below the minimum requirement.': ExchangeError, // {"code":"400100","msg":"The withdrawal amount is below the minimum requirement."}
                    // 'Unsuccessful! Exceeded the max. funds out-transfer limit': InsufficientFunds, // {"code":"200000","msg":"Unsuccessful! Exceeded the max. funds out-transfer limit"}
                    '400': BadRequest, // Bad Request -- Invalid request format
                    '401': AuthenticationError, // Unauthorized -- Invalid API Key
                    '403': NotSupported, // Forbidden -- The request is forbidden
                    '404': NotSupported, // Not Found -- The specified resource could not be found
                    '405': NotSupported, // Method Not Allowed -- You tried to access the resource with an invalid method.
                    '415': BadRequest,  // Content-Type -- application/json
                    '429': RateLimitExceeded, // Too Many Requests -- Access limit breached
                    '500': ExchangeNotAvailable, // Internal Server Error -- We had a problem with our server. Try again later.
                    '503': ExchangeNotAvailable, // Service Unavailable -- We're temporarily offline for maintenance. Please try again later.
                    '101030': PermissionDenied, // {"code":"101030","msg":"You haven't yet enabled the margin trading"}
                    '200004': InsufficientFunds,
                    '230003': InsufficientFunds, // {"code":"230003","msg":"Balance insufficient!"}
                    '260100': InsufficientFunds, // {"code":"260100","msg":"account.noBalance"}
                    '400001': AuthenticationError, // Any of KC-API-KEY, KC-API-SIGN, KC-API-TIMESTAMP, KC-API-PASSPHRASE is missing in your request header.
                    '400002': InvalidNonce, // KC-API-TIMESTAMP Invalid -- Time differs from server time by more than 5 seconds
                    '400003': AuthenticationError, // KC-API-KEY not exists
                    '400004': AuthenticationError, // KC-API-PASSPHRASE error
                    '400005': AuthenticationError, // Signature error -- Please check your signature
                    '400006': AuthenticationError, // The IP address is not in the API whitelist
                    '400007': AuthenticationError, // Access Denied -- Your API key does not have sufficient permissions to access the URI
                    '404000': NotSupported, // URL Not Found -- The requested resource could not be found
                    '400100': BadRequest, // Parameter Error -- You tried to access the resource with invalid parameters
                    '411100': AccountSuspended, // User is frozen -- Please contact us via support center
                    '500000': ExchangeNotAvailable, // Internal Server Error -- We had a problem with our server. Try again later.
                },
                // 'broad': {
                //     'Exceeded the access frequency': RateLimitExceeded,
                //     'require more permission': PermissionDenied,
                // },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'taker': 0.001,
                    'maker': 0.001,
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {},
                    'deposit': {},
                },
            },
            'commonCurrencies': {
                'HOT': 'HOTNOW',
                'EDGE': 'DADI', // https://github.com/ccxt/ccxt/issues/5756
                'WAX': 'WAXP',
                'TRY': 'Trias',
                'VAI': 'VAIOT',
            },
            'timeframes': {
                '1m': 1,
                '3m': undefined,
                '5m': 5,
                '15m': 15,
                '30m': 30,
                '1h': 60,
                '2h': 120,
                '4h': 240,
                '6h': undefined,
                '8h': 480,
                '12h': 720,
                '1d': 1440,
                '1w': 10080,
            },
            'options': {
                // 'version': 'v2',
                // 'symbolSeparator': '-',
                'defaultType': 'swap',
                'marginTypes': {},
                // endpoint versions
                'versions': {
                    'futuresPrivate': {
                        'GET': {
                            'account-overview': 'v1',
                            'positions': 'v1',
                        },
                        'POST': {
                            'transfer-out': 'v2',
                        },
                    },
                    'futuresPublic': {
                        'GET': {
                            'level3/snapshot': 'v2',
                        },
                    },
                },
                'accountsByType': {
                    'trade': 'trade',
                    'trading': 'trade',
                    'spot': 'trade',
                    'margin': 'margin',
                    'main': 'main',
                    'funding': 'main',
                    'futures': 'contract',
                    'contract': 'contract',
                    'pool': 'pool',
                    'pool-x': 'pool',
                },
                'networks': {
                    'ETH': 'eth',
                    'ERC20': 'eth',
                    'TRX': 'trx',
                    'TRC20': 'trx',
                    'KCC': 'kcc',
                    'TERRA': 'luna',
                },
            },
        });
    }

    async fetchMarkets (params = {}) {
        const response = await this.futuresPublicGetContractsActive (params);
        //
        //  {
        //     "code": "200000",
        //     "data": {
        //         "symbol": "ETHUSDTM",
        //         "rootSymbol": "USDT",
        //         "type": "FFWCSX",
        //         "firstOpenDate": 1591086000000,
        //         "expireDate": null,
        //         "settleDate": null,
        //         "baseCurrency": "ETH",
        //         "quoteCurrency": "USDT",
        //         "settleCurrency": "USDT",
        //         "maxOrderQty": 1000000,
        //         "maxPrice": 1000000.0000000000,
        //         "lotSize": 1,
        //         "tickSize": 0.05,
        //         "indexPriceTickSize": 0.01,
        //         "multiplier": 0.01,
        //         "initialMargin": 0.01,
        //         "maintainMargin": 0.005,
        //         "maxRiskLimit": 1000000,
        //         "minRiskLimit": 1000000,
        //         "riskStep": 500000,
        //         "makerFeeRate": 0.00020,
        //         "takerFeeRate": 0.00060,
        //         "takerFixFee": 0.0000000000,
        //         "makerFixFee": 0.0000000000,
        //         "settlementFee": null,
        //         "isDeleverage": true,
        //         "isQuanto": true,
        //         "isInverse": false,
        //         "markMethod": "FairPrice",
        //         "fairMethod": "FundingRate",
        //         "fundingBaseSymbol": ".ETHINT8H",
        //         "fundingQuoteSymbol": ".USDTINT8H",
        //         "fundingRateSymbol": ".ETHUSDTMFPI8H",
        //         "indexSymbol": ".KETHUSDT",
        //         "settlementSymbol": "",
        //         "status": "Open",
        //         "fundingFeeRate": 0.000535,
        //         "predictedFundingFeeRate": 0.002197,
        //         "openInterest": "8724443",
        //         "turnoverOf24h": 341156641.03354263,
        //         "volumeOf24h": 74833.54000000,
        //         "markPrice": 4534.07,
        //         "indexPrice":4531.92,
        //         "lastTradePrice": 4545.4500000000,
        //         "nextFundingRateTime": 25481884,
        //         "maxLeverage": 100,
        //         "sourceExchanges":  [
        //             "huobi",
        //             "Okex",
        //             "Binance",
        //             "Kucoin",
        //             "Poloniex",
        //             "Hitbtc"
        //         ],
        //         "premiumsSymbol1M": ".ETHUSDTMPI",
        //         "premiumsSymbol8H": ".ETHUSDTMPI8H",
        //         "fundingBaseSymbol1M": ".ETHINT",
        //         "fundingQuoteSymbol1M": ".USDTINT",
        //         "lowPrice": 4456.90,
        //         "highPrice":  4674.25,
        //         "priceChgPct": 0.0046,
        //         "priceChg": 21.15
        //     }
        //  }
        //
        const result = [];
        const data = this.safeValue (response, 'data');
        for (let i = 0; i < data.length; i++) {
            const market = data[i];
            const id = this.safeString (market, 'symbol');
            let expireDate = this.safeNumber (market, 'expireDate');
            if (expireDate) {
                expireDate = expireDate.toString ();
            }
            const futures = expireDate ? true : false;
            const swap = !futures;
            const base = this.safeString (market, 'baseCurrency');
            const quote = this.safeString (market, 'quoteCurrency');
            const settle = this.safeString (market, 'settleCurrency');
            let symbol = base + '/' + quote + ':' + settle;
            let type = 'swap';
            if (futures) {
                symbol = base + '/' + quote + '-' + expireDate + ':' + settle;
                type = 'futures';
            }
            const baseMaxSize = this.safeNumber (market, 'baseMaxSize');
            const baseMinSizeString = this.safeString (market, 'baseMinSize');
            const quoteMaxSizeString = this.safeString (market, 'quoteMaxSize');
            const baseMinSize = this.parseNumber (baseMinSizeString);
            const quoteMaxSize = this.parseNumber (quoteMaxSizeString);
            const quoteMinSize = this.safeNumber (market, 'quoteMinSize');
            const inverse = this.safeValue (market, 'isInverse');
            // const quoteIncrement = this.safeNumber (market, 'quoteIncrement');
            const amount = this.safeString (market, 'baseIncrement');
            const price = this.safeString (market, 'priceIncrement');
            const precision = {
                'amount': amount ? this.precisionFromString (this.safeString (market, 'baseIncrement')) : undefined,
                'price': price ? this.precisionFromString (this.safeString (market, 'priceIncrement')) : undefined,
            };
            const limits = {
                'amount': {
                    'min': baseMinSize,
                    'max': baseMaxSize,
                },
                'price': {
                    'min': this.safeNumber (market, 'priceIncrement'),
                    'max': this.parseNumber (Precise.stringDiv (quoteMaxSizeString, baseMinSizeString)),
                },
                'cost': {
                    'min': quoteMinSize,
                    'max': quoteMaxSize,
                },
                'leverage': {
                    'max': this.safeNumber (market, 'maxLeverage', 1),
                },
            };
            result.push ({
                'id': id,
                'symbol': symbol,
                'baseId': base,
                'quoteId': quote,
                'settleId': settle,
                'base': base,
                'quote': quote,
                'type': type,
                'spot': false,
                'margin': false,
                'swap': swap,
                'futures': futures,
                'option': false,
                'active': true,
                'maker': undefined,
                'taker': undefined,
                'precision': precision,
                'contract': swap,
                'linear': inverse !== true,
                'inverse': inverse,
                'expiry': this.safeValue (market, 'expireDate'),
                'contractSize': undefined,
                'limits': limits,
                'info': market,
                // Fee is in %, so divide by 100
                'fees': this.safeValue (this.fees, 'type', {}),
            });
        }
        return result;
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.futuresPublicGetTicker (this.extend (request, params));
        //
        //     {
        //         "code": "200000",
        //         "data": {
        //             "sequence":  1629930362547,
        //             "symbol": "ETHUSDTM",
        //             "side": "buy",
        //             "size":  130,
        //             "price": "4724.7",
        //             "bestBidSize":  5,
        //             "bestBidPrice": "4724.6",
        //             "bestAskPrice": "4724.65",
        //             "tradeId": "618d2a5a77a0c4431d2335f4",
        //             "ts":  1636641371963227600,
        //             "bestAskSize":  1789
        //          }
        //     }
        //
        return this.parseTicker (response['data'], market);
    }

    async fetchOHLCV (symbol, timeframe = '15m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = market['id'];
        const request = {
            'symbol': marketId,
            'granularity': this.timeframes[timeframe],
        };
        const duration = this.parseTimeframe (timeframe) * 1000;
        let endAt = this.milliseconds ();
        if (since !== undefined) {
            request['from'] = since;
            if (limit === undefined) {
                limit = this.safeInteger (this.options, 'fetchOHLCVLimit', 200);
            }
            endAt = this.sum (since, limit * duration);
        } else if (limit !== undefined) {
            since = endAt - limit * duration;
            request['from'] = since;
        }
        request['to'] = endAt;
        const response = await this.futuresPublicGetKlineQuery (this.extend (request, params));
        //     {
        //         "code":"200000",
        //         "data":[
        //             [1636459200000, 4779.3, 4792.1, 4768.7, 4770.3, 78051],
        //             [1636460100000, 4770.25, 4778.55, 4757.55, 4777.25, 80164],
        //             [1636461000000, 4777.25, 4791.45, 4774.5, 4791.3, 51555]
        //         ]
        //     }
        const data = this.safeValue (response, 'data', []);
        since = this.safeString (since);
        return this.parseOHLCVs (data, market, timeframe, Precise.stringDiv (since, '1000'), limit);
    }

    parseOHLCV (ohlcv, market = undefined) {
        //
        //     [
        //         "1545904980000",          // Start time of the candle cycle
        //         "0.058",                  // opening price
        //         "0.049",                  // closing price
        //         "0.058",                  // highest price
        //         "0.049",                  // lowest price
        //         "0.018",                  // base volume
        //         "0.000945",               // quote volume
        //     ]
        //
        return [
            Precise.stringDiv (this.safeString (ohlcv, 0), '1000'),
            this.safeNumber (ohlcv, 1),
            this.safeNumber (ohlcv, 3),
            this.safeNumber (ohlcv, 4),
            this.safeNumber (ohlcv, 2),
            this.safeNumber (ohlcv, 5),
        ];
    }

    async fetchL3OrderBook (symbol, limit = undefined, params = {}) {
        // Only here to overwrite superclass method
        throw new ExchangeError ('fetchL3OrderBook is not available using ' + this.id);
    }

    async transferIn (code, amount, params = {}) {
        // transfer from spot wallet to usdm futures wallet
        return await this.futuresTransfer (code, amount, 1, params);
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const level = this.safeNumber (params, 'level');
        if (level !== 2 && level !== undefined) {
            throw new BadRequest (this.id + ' fetchOrderBook can only return level 2');
        }
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        if ((limit === 20) || (limit === 100)) {
            request['limit'] = limit;
        } else {
            throw new BadRequest (this.id + ' fetchOrderBook limit argument must be 20 or 100');
        }
        const response = await this.futuresPublicGetLevel2DepthLimit (this.extend (request, params));
        //
        //     {
        //         "code": "200000",
        //         "data": {
        //           "symbol": "XBTUSDM",      //Symbol
        //           "sequence": 100,          //Ticker sequence number
        //           "asks": [
        //                 ["5000.0", 1000],   //Price, quantity
        //                 ["6000.0", 1983]    //Price, quantity
        //           ],
        //           "bids": [
        //                 ["3200.0", 800],    //Price, quantity
        //                 ["3100.0", 100]     //Price, quantity
        //           ],
        //           "ts": 1604643655040584408  // timestamp
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        const timestamp = parseInt (Precise.stringDiv (this.safeString (data, 'ts'), '1000000'));
        const orderbook = this.parseOrderBook (data, symbol, timestamp, 'bids', 'asks', 0, 1);
        orderbook['nonce'] = this.safeInteger (data, 'sequence');
        return orderbook;
    }

    parseTicker (ticker, market = undefined) {
        //
        //     {
        //         "code": "200000",
        //         "data": {
        //             "sequence":  1629930362547,
        //             "symbol": "ETHUSDTM",
        //             "side": "buy",
        //             "size":  130,
        //             "price": "4724.7",
        //             "bestBidSize":  5,
        //             "bestBidPrice": "4724.6",
        //             "bestAskPrice": "4724.65",
        //             "tradeId": "618d2a5a77a0c4431d2335f4",
        //             "ts":  1636641371963227600,
        //             "bestAskSize":  1789
        //          }
        //     }
        //
        // let percentage = this.safeNumber (ticker, 'changeRate');
        // if (percentage !== undefined) {
        //     percentage = percentage * 100;
        // }
        const last = this.safeNumber (ticker, 'price');
        const marketId = this.safeString (ticker, 'symbol');
        market = this.safeMarket (marketId, market, '-');
        // const baseVolume = this.safeNumber (ticker, 'vol');
        // const quoteVolume = this.safeNumber (ticker, 'volValue');
        // const vwap = this.vwap (baseVolume, quoteVolume);
        const timestamp = Precise.stringDiv (this.safeString (ticker, 'ts'), '1000000');
        return this.safeTicker ({
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': undefined,
            'low': undefined,
            'bid': this.safeNumber (ticker, 'bestBidPrice'),
            'bidVolume': this.safeNumber (ticker, 'bestBidSize'),
            'ask': this.safeNumber (ticker, 'bestAskPrice'),
            'askVolume': this.safeNumber (ticker, 'bestAskSize'),
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }

    async fetchFundingHistory (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        //
        // Private
        // @param symbol (string): The pair for which the contract was traded
        // @param since (number): The unix start time of the first funding payment requested
        // @param limit (number): The number of results to return
        // @param params (dict): Additional parameters to send to the API
        // @param return: Data for the history of the accounts funding payments for futures contracts
        //
        if (this.isFuturesMethod ('fetchFundingHistory', params)) {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' fetchFundingHistory() requires a symbol argument');
            }
            await this.loadMarkets ();
            const market = this.market (symbol);
            const request = {
                'symbol': market['id'],
            };
            if (since !== undefined) {
                request['startAt'] = since;
            }
            if (limit !== undefined) {
                request['maxCount'] = limit;
            }
            const method = 'futuresPrivateGetFundingHistory';
            const response = await this[method] (this.extend (request, params));
            // {
            //  "data": {
            //     "dataList": [
            //       {
            //         "id": 36275152660006,                // id
            //         "symbol": "XBTUSDM",                 // Symbol
            //         "timePoint": 1557918000000,          // Time point (milisecond)
            //         "fundingRate": 0.000013,             // Funding rate
            //         "markPrice": 8058.27,                // Mark price
            //         "positionQty": 10,                   // Position size
            //         "positionCost": -0.001241,           // Position value at settlement period
            //         "funding": -0.00000464,              // Settled funding fees. A positive number means that the user received the funding fee, and vice versa.
            //         "settleCurrency": "XBT"              // Settlement currency
            //       },
            //  }
            // }
            const data = this.safeValue (response, 'data');
            const dataList = this.safeValue (data, 'dataList');
            const fees = [];
            for (let i = 0; i < dataList.length; i++) {
                const timestamp = this.safeInteger (dataList[i], 'timePoint');
                fees.push ({
                    'info': dataList[i],
                    'symbol': this.safeSymbol (dataList[i], 'symbol'),
                    'code': this.safeCurrencyCode (dataList[i], 'settleCurrency'),
                    'timestamp': timestamp,
                    'datetime': this.iso8601 (timestamp),
                    'id': this.safeNumber (dataList[i], 'id'),
                    'amount': this.safeNumber (dataList[i], 'funding'),
                    'fundingRate': this.safeNumber (dataList[i], 'fundingRate'),
                    'markPrice': this.safeNumber (dataList[i], 'markPrice'),
                    'positionQty': this.safeNumber (dataList[i], 'positionQty'),
                    'positionCost': this.safeNumber (dataList[i], 'positionCost'),
                });
            }
            return fees;
        } else {
            throw new NotSupported (this.id + ' fetchFundingHistory() supports linear and inverse contracts only');
        }
    }

    async fetchPositions (symbols = undefined, params = {}) {
        const response = await this.futuresPrivateGetPositions (params);
        //
        //     {
        //         code: '200000',
        //         data: [
        //             {
        //                 id: '605a9772a229ab0006408258',
        //                 symbol: 'XBTUSDTM',
        //                 autoDeposit: false,
        //                 maintMarginReq: 0.005,
        //                 riskLimit: 200,
        //                 realLeverage: 0,
        //                 crossMode: false,
        //                 delevPercentage: 0,
        //                 currentTimestamp: 1616549746099,
        //                 currentQty: 0,
        //                 currentCost: 0,
        //                 currentComm: 0,
        //                 unrealisedCost: 0,
        //                 realisedGrossCost: 0,
        //                 realisedCost: 0,
        //                 isOpen: false,
        //                 markPrice: 54371.92,
        //                 markValue: 0,
        //                 posCost: 0,
        //                 posCross: 0,
        //                 posInit: 0,
        //                 posComm: 0,
        //                 posLoss: 0,
        //                 posMargin: 0,
        //                 posMaint: 0,
        //                 maintMargin: 0,
        //                 realisedGrossPnl: 0,
        //                 realisedPnl: 0,
        //                 unrealisedPnl: 0,
        //                 unrealisedPnlPcnt: 0,
        //                 unrealisedRoePcnt: 0,
        //                 avgEntryPrice: 0,
        //                 liquidationPrice: 0,
        //                 bankruptPrice: 0,
        //                 settleCurrency: 'USDT',
        //                 isInverse: false
        //             },
        //             {
        //                 id: '605a9772026ac900066550df',
        //                 symbol: 'XBTUSDM',
        //                 autoDeposit: false,
        //                 maintMarginReq: 0.005,
        //                 riskLimit: 200,
        //                 realLeverage: 0,
        //                 crossMode: false,
        //                 delevPercentage: 0,
        //                 currentTimestamp: 1616549746110,
        //                 currentQty: 0,
        //                 currentCost: 0,
        //                 currentComm: 0,
        //                 unrealisedCost: 0,
        //                 realisedGrossCost: 0,
        //                 realisedCost: 0,
        //                 isOpen: false,
        //                 markPrice: 54354.76,
        //                 markValue: 0,
        //                 posCost: 0,
        //                 posCross: 0,
        //                 posInit: 0,
        //                 posComm: 0,
        //                 posLoss: 0,
        //                 posMargin: 0,
        //                 posMaint: 0,
        //                 maintMargin: 0,
        //                 realisedGrossPnl: 0,
        //                 realisedPnl: 0,
        //                 unrealisedPnl: 0,
        //                 unrealisedPnlPcnt: 0,
        //                 unrealisedRoePcnt: 0,
        //                 avgEntryPrice: 0,
        //                 liquidationPrice: 0,
        //                 bankruptPrice: 0,
        //                 settleCurrency: 'XBT',
        //                 isInverse: true
        //             }
        //         ]
        //     }
        //
        return this.safeValue (response, 'data', response);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        //
        // the v2 URL is https://openapi-v2.kucoin.com/api/v1/endpoint
        //                                †                 ↑
        //
        const versions = this.safeValue (this.options, 'versions', {});
        const apiVersions = this.safeValue (versions, api, {});
        const methodVersions = this.safeValue (apiVersions, method, {});
        const defaultVersion = this.safeString (methodVersions, path, this.options['version']);
        const version = this.safeString (params, 'version', defaultVersion);
        params = this.omit (params, 'version');
        let endpoint = '/api/' + version + '/' + this.implodeParams (path, params);
        const query = this.omit (params, this.extractParams (path));
        let endpart = '';
        headers = (headers !== undefined) ? headers : {};
        if (Object.keys (query).length) {
            if ((method === 'GET') || (method === 'DELETE')) {
                endpoint += '?' + this.urlencode (query);
            } else {
                body = this.json (query);
                endpart = body;
                headers['Content-Type'] = 'application/json';
            }
        }
        const url = this.urls['api'][api] + endpoint;
        if ((api === 'private') || (api === 'futuresPrivate')) {
            this.checkRequiredCredentials ();
            const timestamp = this.nonce ().toString ();
            headers = this.extend ({
                'KC-API-KEY-VERSION': '2',
                'KC-API-KEY': this.apiKey,
                'KC-API-TIMESTAMP': timestamp,
            }, headers);
            const apiKeyVersion = this.safeString (headers, 'KC-API-KEY-VERSION');
            if (apiKeyVersion === '2') {
                const passphrase = this.hmac (this.encode (this.password), this.encode (this.secret), 'sha256', 'base64');
                headers['KC-API-PASSPHRASE'] = passphrase;
            } else {
                headers['KC-API-PASSPHRASE'] = this.password;
            }
            const payload = timestamp + method + endpoint + endpart;
            const signature = this.hmac (this.encode (payload), this.encode (this.secret), 'sha256', 'base64');
            headers['KC-API-SIGN'] = signature;
            const partner = this.safeValue (this.options, 'partner', {});
            const partnerId = this.safeString (partner, 'id');
            const partnerSecret = this.safeString (partner, 'secret');
            if ((partnerId !== undefined) && (partnerSecret !== undefined)) {
                const partnerPayload = timestamp + partnerId + this.apiKey;
                const partnerSignature = this.hmac (this.encode (partnerPayload), this.encode (partnerSecret), 'sha256', 'base64');
                headers['KC-API-PARTNER-SIGN'] = partnerSignature;
                headers['KC-API-PARTNER'] = partnerId;
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            this.throwBroadlyMatchedException (this.exceptions['broad'], body, body);
            return;
        }
        //
        // bad
        //     { "code": "400100", "msg": "validation.createOrder.clientOidIsRequired" }
        // good
        //     { code: '200000', data: { ... }}
        //
        const errorCode = this.safeString (response, 'code');
        const message = this.safeString (response, 'msg', '');
        this.throwExactlyMatchedException (this.exceptions['exact'], message, this.id + ' ' + message);
        this.throwExactlyMatchedException (this.exceptions['exact'], errorCode, this.id + ' ' + message);
    }

    // async transferIn (code, amount, params = {}) {
    //     // transfer from spot wallet to usdm futures wallet
    //     return await this.futuresTransfer (code, amount, 1, params);
    // }

    // async transferOut (code, amount, params = {}) {
    //     // transfer from usdm futures wallet to spot wallet
    //     return await this.futuresTransfer (code, amount, 2, params);
    // }
};
