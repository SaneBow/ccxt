import kucoinRest from '../kucoin.js';
import { Int } from '../base/types.js';
import Client from '../base/ws/Client.js';
export default class kucoin extends kucoinRest {
    describe(): any;
    negotiate(privateChannel: any, params?: {}): any;
    negotiateHelper(privateChannel: any, params?: {}): Promise<string>;
    requestId(): any;
    subscribe(url: any, messageHash: any, subscriptionHash: any, subscription: any, params?: {}): Promise<any>;
    watchTicker(symbol: string, params?: {}): Promise<any>;
    handleTicker(client: Client, message: any): void;
    watchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<any>;
    handleOHLCV(client: Client, message: any): void;
    watchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<any>;
    handleTrade(client: Client, message: any): void;
    watchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<any>;
    handleOrderBook(client: Client, message: any): void;
    getCacheIndex(orderbook: any, cache: any): any;
    handleDelta(orderbook: any, delta: any): void;
    handleBidAsks(bookSide: any, bidAsks: any): void;
    handleOrderBookSubscription(client: Client, message: any, subscription: any): void;
    handleSubscriptionStatus(client: Client, message: any): any;
    handleSystemStatus(client: Client, message: any): any;
    watchOrders(symbol?: string, since?: Int, limit?: Int, params?: {}): Promise<any>;
    parseWsOrderStatus(status: any): string;
    parseWsOrder(order: any, market?: any): any;
    handleOrder(client: Client, message: any): void;
    watchMyTrades(symbol?: string, since?: Int, limit?: Int, params?: {}): Promise<any>;
    handleMyTrade(client: Client, message: any): void;
    parseWsTrade(trade: any, market?: any): import("../base/types.js").Trade;
    watchBalance(params?: {}): Promise<any>;
    handleBalance(client: Client, message: any): void;
    handleSubject(client: Client, message: any): any;
    ping(client: any): {
        id: any;
        type: string;
    };
    handlePong(client: Client, message: any): void;
    handleErrorMessage(client: Client, message: any): any;
    handleMessage(client: Client, message: any): any;
}
