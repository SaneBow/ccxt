<?php

namespace ccxt\pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\ExchangeError;
use ccxt\AuthenticationError;
use ccxt\Precise;
use React\Async;

class woo extends \ccxt\async\woo {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'has' => array(
                'ws' => true,
                'watchBalance' => false,
                'watchMyTrades' => false,
                'watchOHLCV' => true,
                'watchOrderBook' => true,
                'watchOrders' => true,
                'watchTicker' => true,
                'watchTickers' => true,
                'watchTrades' => true,
            ),
            'urls' => array(
                'api' => array(
                    'ws' => array(
                        'public' => 'wss://wss.woo.org/ws/stream',
                        'private' => 'wss://wss.woo.network/v2/ws/private/stream',
                    ),
                ),
                'test' => array(
                    'ws' => array(
                        'public' => 'wss://wss.staging.woo.org/ws/stream',
                        'private' => 'wss://wss.staging.woo.org/v2/ws/private/stream',
                    ),
                ),
            ),
            'requiredCredentials' => array(
                'apiKey' => true,
                'secret' => true,
                'uid' => true,
            ),
            'options' => array(
                'tradesLimit' => 1000,
                'ordersLimit' => 1000,
                'requestId' => array(),
            ),
            'streaming' => array(
                'ping' => array($this, 'ping'),
                'keepAlive' => 10000,
            ),
        ));
    }

    public function request_id($url) {
        $options = $this->safe_value($this->options, 'requestId', array());
        $previousValue = $this->safe_integer($options, $url, 0);
        $newValue = $this->sum($previousValue, 1);
        $this->options['requestId'][$url] = $newValue;
        return $newValue;
    }

    public function watch_public($messageHash, $message) {
        return Async\async(function () use ($messageHash, $message) {
            $this->check_required_uid();
            $url = $this->urls['api']['ws']['public'] . '/' . $this->uid;
            $requestId = $this->request_id($url);
            $subscribe = array(
                'id' => $requestId,
            );
            $request = array_merge($subscribe, $message);
            return Async\await($this->watch($url, $messageHash, $request, $messageHash, $subscribe));
        }) ();
    }

    public function watch_order_book(string $symbol, ?int $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $limit, $params) {
            Async\await($this->load_markets());
            $name = 'orderbook';
            $market = $this->market($symbol);
            $topic = $market['id'] . '@' . $name;
            $request = array(
                'event' => 'subscribe',
                'topic' => $topic,
            );
            $message = array_merge($request, $params);
            $orderbook = Async\await($this->watch_public($topic, $message));
            return $orderbook->limit ();
        }) ();
    }

    public function handle_order_book(Client $client, $message) {
        //
        //     {
        //         $topic => 'PERP_BTC_USDT@orderbook',
        //         ts => 1650121915308,
        //         $data => {
        //             $symbol => 'PERP_BTC_USDT',
        //             bids => array(
        //                 array(
        //                     0.30891,
        //                     2469.98
        //                 )
        //             ),
        //             asks => array(
        //                 array(
        //                     0.31075,
        //                     2379.63
        //                 )
        //             )
        //         }
        //     }
        //
        $data = $this->safe_value($message, 'data');
        $marketId = $this->safe_string($data, 'symbol');
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        $topic = $this->safe_string($message, 'topic');
        $orderbook = $this->safe_value($this->orderbooks, $symbol);
        if ($orderbook === null) {
            $orderbook = $this->order_book(array());
        }
        $timestamp = $this->safe_integer($message, 'ts');
        $snapshot = $this->parse_order_book($data, $symbol, $timestamp, 'bids', 'asks');
        $orderbook->reset ($snapshot);
        $client->resolve ($orderbook, $topic);
    }

    public function watch_ticker(string $symbol, $params = array ()) {
        return Async\async(function () use ($symbol, $params) {
            Async\await($this->load_markets());
            $name = 'ticker';
            $market = $this->market($symbol);
            $topic = $market['id'] . '@' . $name;
            $request = array(
                'event' => 'subscribe',
                'topic' => $topic,
            );
            $message = array_merge($request, $params);
            return Async\await($this->watch_public($topic, $message));
        }) ();
    }

    public function parse_ws_ticker($ticker, $market = null) {
        //
        //     {
        //         symbol => 'PERP_BTC_USDT',
        //         open => 19441.5,
        //         close => 20147.07,
        //         high => 20761.87,
        //         low => 19320.54,
        //         volume => 2481.103,
        //         amount => 50037935.0286,
        //         count => 3689
        //     }
        //
        $timestamp = $this->safe_integer($ticker, 'date', $this->milliseconds());
        return $this->safe_ticker(array(
            'symbol' => $this->safe_symbol(null, $market),
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601($timestamp),
            'high' => $this->safe_string($ticker, 'high'),
            'low' => $this->safe_string($ticker, 'low'),
            'bid' => null,
            'bidVolume' => null,
            'ask' => null,
            'askVolume' => null,
            'vwap' => null,
            'open' => $this->safe_string($ticker, 'open'),
            'close' => $this->safe_string($ticker, 'close'),
            'last' => null,
            'previousClose' => null,
            'change' => null,
            'percentage' => null,
            'average' => null,
            'baseVolume' => $this->safe_string($ticker, 'volume'),
            'quoteVolume' => $this->safe_string($ticker, 'amount'),
            'info' => $ticker,
        ), $market);
    }

    public function handle_ticker(Client $client, $message) {
        //
        //     {
        //         $topic => 'PERP_BTC_USDT@ticker',
        //         ts => 1657120017000,
        //         $data => {
        //             symbol => 'PERP_BTC_USDT',
        //             open => 19441.5,
        //             close => 20147.07,
        //             high => 20761.87,
        //             low => 19320.54,
        //             volume => 2481.103,
        //             amount => 50037935.0286,
        //             count => 3689
        //         }
        //     }
        //
        $data = $this->safe_value($message, 'data');
        $topic = $this->safe_value($message, 'topic');
        $marketId = $this->safe_string($data, 'symbol');
        $market = $this->safe_market($marketId);
        $timestamp = $this->safe_integer($message, 'ts');
        $data['date'] = $timestamp;
        $ticker = $this->parse_ws_ticker($data, $market);
        $ticker['symbol'] = $market['symbol'];
        $this->tickers[$market['symbol']] = $ticker;
        $client->resolve ($ticker, $topic);
        return $message;
    }

    public function watch_tickers(?array $symbols = null, $params = array ()) {
        return Async\async(function () use ($symbols, $params) {
            Async\await($this->load_markets());
            $name = 'tickers';
            $topic = $name;
            $request = array(
                'event' => 'subscribe',
                'topic' => $topic,
            );
            $message = array_merge($request, $params);
            $tickers = Async\await($this->watch_public($topic, $message));
            return $this->filter_by_array($tickers, 'symbol', $symbols);
        }) ();
    }

    public function handle_tickers(Client $client, $message) {
        //
        //     {
        //         "topic":"tickers",
        //         "ts":1618820615000,
        //         "data":array(
        //             array(
        //                 "symbol":"SPOT_OKB_USDT",
        //                 "open":16.297,
        //                 "close":17.183,
        //                 "high":24.707,
        //                 "low":11.997,
        //                 "volume":0,
        //                 "amount":0,
        //                 "count":0
        //             ),
        //             array(
        //                 "symbol":"SPOT_XRP_USDT",
        //                 "open":1.3515,
        //                 "close":1.43794,
        //                 "high":1.96674,
        //                 "low":0.39264,
        //                 "volume":750127.1,
        //                 "amount":985440.5122,
        //                 "count":396
        //             ),
        //         ...
        //         )
        //     }
        //
        $topic = $this->safe_value($message, 'topic');
        $data = $this->safe_value($message, 'data');
        $timestamp = $this->safe_integer($message, 'ts');
        $result = array();
        for ($i = 0; $i < count($data); $i++) {
            $marketId = $this->safe_string($data[$i], 'symbol');
            $market = $this->safe_market($marketId);
            $ticker = $this->parse_ws_ticker(array_merge($data[$i], array( 'date' => $timestamp )), $market);
            $this->tickers[$market['symbol']] = $ticker;
            $result[] = $ticker;
        }
        $client->resolve ($result, $topic);
    }

    public function watch_ohlcv(string $symbol, $timeframe = '1m', ?int $since = null, ?int $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $timeframe, $since, $limit, $params) {
            Async\await($this->load_markets());
            if (($timeframe !== '1m') && ($timeframe !== '5m') && ($timeframe !== '15m') && ($timeframe !== '30m') && ($timeframe !== '1h') && ($timeframe !== '1d') && ($timeframe !== '1w') && ($timeframe !== '1M')) {
                throw new ExchangeError($this->id . ' watchOHLCV $timeframe argument must be 1m, 5m, 15m, 30m, 1h, 1d, 1w, 1M');
            }
            $market = $this->market($symbol);
            $interval = $this->safe_string($this->timeframes, $timeframe, $timeframe);
            $name = 'kline';
            $topic = $market['id'] . '@' . $name . '_' . $interval;
            $request = array(
                'event' => 'subscribe',
                'topic' => $topic,
            );
            $message = array_merge($request, $params);
            $ohlcv = Async\await($this->watch_public($topic, $message));
            if ($this->newUpdates) {
                $limit = $ohlcv->getLimit ($market['symbol'], $limit);
            }
            return $this->filter_by_since_limit($ohlcv, $since, $limit, 0, true);
        }) ();
    }

    public function handle_ohlcv(Client $client, $message) {
        //
        //     {
        //         "topic":"SPOT_BTC_USDT@kline_1m",
        //         "ts":1618822432146,
        //         "data":{
        //             "symbol":"SPOT_BTC_USDT",
        //             "type":"1m",
        //             "open":56948.97,
        //             "close":56891.76,
        //             "high":56948.97,
        //             "low":56889.06,
        //             "volume":44.00947568,
        //             "amount":2504584.9,
        //             "startTime":1618822380000,
        //             "endTime":1618822440000
        //         }
        //     }
        //
        $data = $this->safe_value($message, 'data');
        $topic = $this->safe_value($message, 'topic');
        $marketId = $this->safe_string($data, 'symbol');
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        $interval = $this->safe_string($data, 'type');
        $timeframe = $this->find_timeframe($interval);
        $parsed = array(
            $this->safe_integer($data, 'startTime'),
            $this->safe_float($data, 'open'),
            $this->safe_float($data, 'high'),
            $this->safe_float($data, 'low'),
            $this->safe_float($data, 'close'),
            $this->safe_float($data, 'volume'),
        );
        $this->ohlcvs[$symbol] = $this->safe_value($this->ohlcvs, $symbol, array());
        $stored = $this->safe_value($this->ohlcvs[$symbol], $timeframe);
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'OHLCVLimit', 1000);
            $stored = new ArrayCacheByTimestamp ($limit);
            $this->ohlcvs[$symbol][$timeframe] = $stored;
        }
        $stored->append ($parsed);
        $client->resolve ($stored, $topic);
    }

    public function watch_trades(string $symbol, ?int $since = null, ?int $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $topic = $market['id'] . '@trade';
            $request = array(
                'event' => 'subscribe',
                'topic' => $topic,
            );
            $message = array_merge($request, $params);
            $trades = Async\await($this->watch_public($topic, $message));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($market['symbol'], $limit);
            }
            return $this->filter_by_symbol_since_limit($trades, $symbol, $since, $limit, true);
        }) ();
    }

    public function handle_trade(Client $client, $message) {
        //
        // {
        //     "topic":"SPOT_ADA_USDT@$trade",
        //     "ts":1618820361552,
        //     "data":{
        //         "symbol":"SPOT_ADA_USDT",
        //         "price":1.27988,
        //         "size":300,
        //         "side":"BUY",
        //         "source":0
        //     }
        // }
        //
        $topic = $this->safe_string($message, 'topic');
        $timestamp = $this->safe_integer($message, 'ts');
        $data = $this->safe_value($message, 'data');
        $marketId = $this->safe_string($data, 'symbol');
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        $trade = $this->parse_ws_trade(array_merge($data, array( 'timestamp' => $timestamp )), $market);
        $tradesArray = $this->safe_value($this->trades, $symbol);
        if ($tradesArray === null) {
            $limit = $this->safe_integer($this->options, 'tradesLimit', 1000);
            $tradesArray = new ArrayCache ($limit);
        }
        $tradesArray->append ($trade);
        $this->trades[$symbol] = $tradesArray;
        $client->resolve ($tradesArray, $topic);
    }

    public function parse_ws_trade($trade, $market = null) {
        //
        //     {
        //         "symbol":"SPOT_ADA_USDT",
        //         "timestamp":1618820361552,
        //         "price":1.27988,
        //         "size":300,
        //         "side":"BUY",
        //         "source":0
        //     }
        //
        $marketId = $this->safe_string($trade, 'symbol');
        $market = $this->safe_market($marketId, $market);
        $symbol = $market['symbol'];
        $price = $this->safe_string($trade, 'price');
        $amount = $this->safe_string($trade, 'size');
        $cost = Precise::string_mul($price, $amount);
        $side = $this->safe_string_lower($trade, 'side');
        $timestamp = $this->safe_integer($trade, 'timestamp');
        return $this->safe_trade(array(
            'id' => null,
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601($timestamp),
            'symbol' => $symbol,
            'side' => $side,
            'price' => $price,
            'amount' => $amount,
            'cost' => $cost,
            'order' => null,
            'takerOrMaker' => null,
            'type' => null,
            'fee' => null,
            'info' => $trade,
        ), $market);
    }

    public function check_required_uid($error = true) {
        if (!$this->uid) {
            if ($error) {
                throw new AuthenticationError($this->id . ' requires `uid` credential');
            } else {
                return false;
            }
        }
        return true;
    }

    public function authenticate($params = array ()) {
        $this->check_required_credentials();
        $url = $this->urls['api']['ws']['private'] . '/' . $this->uid;
        $client = $this->client($url);
        $messageHash = 'authenticated';
        $event = 'auth';
        $future = $this->safe_value($client->subscriptions, $messageHash);
        if ($future === null) {
            $ts = (string) $this->nonce();
            $auth = '|' . $ts;
            $signature = $this->hmac($this->encode($auth), $this->encode($this->secret), 'sha256');
            $request = array(
                'event' => $event,
                'params' => array(
                    'apikey' => $this->apiKey,
                    'sign' => $signature,
                    'timestamp' => $ts,
                ),
            );
            $message = array_merge($request, $params);
            $future = $this->watch($url, $messageHash, $message);
            $client->subscriptions[$messageHash] = $future;
        }
        return $future;
    }

    public function watch_private($messageHash, $message, $params = array ()) {
        return Async\async(function () use ($messageHash, $message, $params) {
            Async\await($this->authenticate($params));
            $url = $this->urls['api']['ws']['private'] . '/' . $this->uid;
            $requestId = $this->request_id($url);
            $subscribe = array(
                'id' => $requestId,
            );
            $request = array_merge($subscribe, $message);
            return Async\await($this->watch($url, $messageHash, $request, $messageHash, $subscribe));
        }) ();
    }

    public function watch_orders(?string $symbol = null, ?int $since = null, ?int $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            Async\await($this->load_markets());
            $topic = 'executionreport';
            $messageHash = $topic;
            if ($symbol !== null) {
                $market = $this->market($symbol);
                $symbol = $market['symbol'];
                $messageHash .= ':' . $symbol;
            }
            $request = array(
                'event' => 'subscribe',
                'topic' => $topic,
            );
            $message = array_merge($request, $params);
            $orders = Async\await($this->watch_private($messageHash, $message));
            if ($this->newUpdates) {
                $limit = $orders->getLimit ($symbol, $limit);
            }
            return $this->filter_by_symbol_since_limit($orders, $symbol, $since, $limit, true);
        }) ();
    }

    public function parse_ws_order($order, $market = null) {
        //
        //     {
        //         $symbol => 'PERP_BTC_USDT',
        //         $clientOrderId => 0,
        //         $orderId => 52952826,
        //         $type => 'LIMIT',
        //         $side => 'SELL',
        //         quantity => 0.01,
        //         $price => 22000,
        //         tradeId => 0,
        //         executedPrice => 0,
        //         executedQuantity => 0,
        //         $fee => 0,
        //         feeAsset => 'USDT',
        //         totalExecutedQuantity => 0,
        //         $status => 'NEW',
        //         reason => '',
        //         orderTag => 'default',
        //         totalFee => 0,
        //         visible => 0.01,
        //         $timestamp => 1657515556799,
        //         reduceOnly => false,
        //         maker => false
        //     }
        //
        $orderId = $this->safe_string($order, 'orderId');
        $marketId = $this->safe_string($order, 'symbol');
        $market = $this->market($marketId);
        $symbol = $market['symbol'];
        $timestamp = $this->safe_integer($order, 'timestamp');
        $cost = $this->safe_string($order, 'totalFee');
        $fee = array(
            'cost' => $cost,
            'currency' => $this->safe_string($order, 'feeAsset'),
        );
        $price = $this->safe_float($order, 'price');
        $amount = $this->safe_float($order, 'quantity');
        $side = $this->safe_string_lower($order, 'side');
        $type = $this->safe_string_lower($order, 'type');
        $filled = $this->safe_float($order, 'executedQuantity');
        $totalExecQuantity = $this->safe_float($order, 'totalExecutedQuantity');
        $remaining = $amount;
        if ($amount >= $totalExecQuantity) {
            $remaining -= $totalExecQuantity;
        }
        $rawStatus = $this->safe_string($order, 'status');
        $status = $this->parse_order_status($rawStatus);
        $trades = null;
        $clientOrderId = $this->safe_string($order, 'clientOrderId');
        return array(
            'info' => $order,
            'symbol' => $symbol,
            'id' => $orderId,
            'clientOrderId' => $clientOrderId,
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601($timestamp),
            'lastTradeTimestamp' => $timestamp,
            'type' => $type,
            'timeInForce' => null,
            'postOnly' => null,
            'side' => $side,
            'price' => $price,
            'stopPrice' => null,
            'triggerPrice' => null,
            'amount' => $amount,
            'cost' => $cost,
            'average' => null,
            'filled' => $filled,
            'remaining' => $remaining,
            'status' => $status,
            'fee' => $fee,
            'trades' => $trades,
        );
    }

    public function handle_order_update(Client $client, $message) {
        //
        //     {
        //         topic => 'executionreport',
        //         ts => 1657515556799,
        //         data => {
        //             symbol => 'PERP_BTC_USDT',
        //             clientOrderId => 0,
        //             orderId => 52952826,
        //             type => 'LIMIT',
        //             side => 'SELL',
        //             quantity => 0.01,
        //             price => 22000,
        //             tradeId => 0,
        //             executedPrice => 0,
        //             executedQuantity => 0,
        //             fee => 0,
        //             feeAsset => 'USDT',
        //             totalExecutedQuantity => 0,
        //             status => 'NEW',
        //             reason => '',
        //             orderTag => 'default',
        //             totalFee => 0,
        //             visible => 0.01,
        //             timestamp => 1657515556799,
        //             reduceOnly => false,
        //             maker => false
        //         }
        //     }
        //
        $order = $this->safe_value($message, 'data');
        $this->handle_order($client, $order);
    }

    public function handle_order(Client $client, $message) {
        $topic = 'executionreport';
        $parsed = $this->parse_ws_order($message);
        $symbol = $this->safe_string($parsed, 'symbol');
        $orderId = $this->safe_string($parsed, 'id');
        if ($symbol !== null) {
            if ($this->orders === null) {
                $limit = $this->safe_integer($this->options, 'ordersLimit', 1000);
                $this->orders = new ArrayCacheBySymbolById ($limit);
            }
            $cachedOrders = $this->orders;
            $orders = $this->safe_value($cachedOrders->hashmap, $symbol, array());
            $order = $this->safe_value($orders, $orderId);
            if ($order !== null) {
                $fee = $this->safe_value($order, 'fee');
                if ($fee !== null) {
                    $parsed['fee'] = $fee;
                }
                $fees = $this->safe_value($order, 'fees');
                if ($fees !== null) {
                    $parsed['fees'] = $fees;
                }
                $parsed['trades'] = $this->safe_value($order, 'trades');
                $parsed['timestamp'] = $this->safe_integer($order, 'timestamp');
                $parsed['datetime'] = $this->safe_string($order, 'datetime');
            }
            $cachedOrders->append ($parsed);
            $client->resolve ($this->orders, $topic);
            $messageHashSymbol = $topic . ':' . $symbol;
            $client->resolve ($this->orders, $messageHashSymbol);
        }
    }

    public function handle_message(Client $client, $message) {
        $methods = array(
            'ping' => array($this, 'handle_ping'),
            'pong' => array($this, 'handle_pong'),
            'subscribe' => array($this, 'handle_subscribe'),
            'orderbook' => array($this, 'handle_order_book'),
            'ticker' => array($this, 'handle_ticker'),
            'tickers' => array($this, 'handle_tickers'),
            'kline' => array($this, 'handle_ohlcv'),
            'auth' => array($this, 'handle_auth'),
            'executionreport' => array($this, 'handle_order_update'),
            'trade' => array($this, 'handle_trade'),
        );
        $event = $this->safe_string($message, 'event');
        $method = $this->safe_value($methods, $event);
        if ($method !== null) {
            return $method($client, $message);
        }
        $topic = $this->safe_string($message, 'topic');
        if ($topic !== null) {
            $method = $this->safe_value($methods, $topic);
            if ($method !== null) {
                return $method($client, $message);
            }
            $splitTopic = explode('@', $topic);
            $splitLength = count($splitTopic);
            if ($splitLength === 2) {
                $name = $this->safe_string($splitTopic, 1);
                $method = $this->safe_value($methods, $name);
                if ($method !== null) {
                    return $method($client, $message);
                }
                $splitName = explode('_', $name);
                $splitNameLength = count($splitTopic);
                if ($splitNameLength === 2) {
                    $method = $this->safe_value($methods, $this->safe_string($splitName, 0));
                    if ($method !== null) {
                        return $method($client, $message);
                    }
                }
            }
        }
        return $message;
    }

    public function ping($client) {
        return array( 'event' => 'ping' );
    }

    public function handle_ping(Client $client, $message) {
        return array( 'event' => 'pong' );
    }

    public function handle_pong(Client $client, $message) {
        //
        // array( event => 'pong', ts => 1657117026090 )
        //
        $client->lastPong = $this->milliseconds();
        return $message;
    }

    public function handle_subscribe(Client $client, $message) {
        //
        //     {
        //         id => '666888',
        //         event => 'subscribe',
        //         success => true,
        //         ts => 1657117712212
        //     }
        //
        return $message;
    }

    public function handle_auth(Client $client, $message) {
        //
        //     {
        //         event => 'auth',
        //         $success => true,
        //         ts => 1657463158812
        //     }
        //
        $messageHash = 'authenticated';
        $success = $this->safe_value($message, 'success');
        if ($success) {
            $client->resolve ($message, $messageHash);
        } else {
            $error = new AuthenticationError ($this->json($message));
            $client->reject ($error, $messageHash);
            // allows further authentication attempts
            if (is_array($client->subscriptions) && array_key_exists($messageHash, $client->subscriptions)) {
                unset($client->subscriptions['authenticated']);
            }
        }
    }
}
