<?php

namespace ccxt\async\abstract;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


abstract class paymium extends \ccxt\async\Exchange {
    public function public_get_countries($params = array()) {
        return $this->request('countries', 'public', 'GET', $params, null, null, array());
    }
    public function public_get_data_currency_ticker($params = array()) {
        return $this->request('data/{currency}/ticker', 'public', 'GET', $params, null, null, array());
    }
    public function public_get_data_currency_trades($params = array()) {
        return $this->request('data/{currency}/trades', 'public', 'GET', $params, null, null, array());
    }
    public function public_get_data_currency_depth($params = array()) {
        return $this->request('data/{currency}/depth', 'public', 'GET', $params, null, null, array());
    }
    public function public_get_bitcoin_charts_id_trades($params = array()) {
        return $this->request('bitcoin_charts/{id}/trades', 'public', 'GET', $params, null, null, array());
    }
    public function public_get_bitcoin_charts_id_depth($params = array()) {
        return $this->request('bitcoin_charts/{id}/depth', 'public', 'GET', $params, null, null, array());
    }
    public function private_get_user($params = array()) {
        return $this->request('user', 'private', 'GET', $params, null, null, array());
    }
    public function private_get_user_addresses($params = array()) {
        return $this->request('user/addresses', 'private', 'GET', $params, null, null, array());
    }
    public function private_get_user_addresses_address($params = array()) {
        return $this->request('user/addresses/{address}', 'private', 'GET', $params, null, null, array());
    }
    public function private_get_user_orders($params = array()) {
        return $this->request('user/orders', 'private', 'GET', $params, null, null, array());
    }
    public function private_get_user_orders_uuid($params = array()) {
        return $this->request('user/orders/{uuid}', 'private', 'GET', $params, null, null, array());
    }
    public function private_get_user_price_alerts($params = array()) {
        return $this->request('user/price_alerts', 'private', 'GET', $params, null, null, array());
    }
    public function private_get_merchant_get_payment_uuid($params = array()) {
        return $this->request('merchant/get_payment/{uuid}', 'private', 'GET', $params, null, null, array());
    }
    public function private_post_user_addresses($params = array()) {
        return $this->request('user/addresses', 'private', 'POST', $params, null, null, array());
    }
    public function private_post_user_orders($params = array()) {
        return $this->request('user/orders', 'private', 'POST', $params, null, null, array());
    }
    public function private_post_user_withdrawals($params = array()) {
        return $this->request('user/withdrawals', 'private', 'POST', $params, null, null, array());
    }
    public function private_post_user_email_transfers($params = array()) {
        return $this->request('user/email_transfers', 'private', 'POST', $params, null, null, array());
    }
    public function private_post_user_payment_requests($params = array()) {
        return $this->request('user/payment_requests', 'private', 'POST', $params, null, null, array());
    }
    public function private_post_user_price_alerts($params = array()) {
        return $this->request('user/price_alerts', 'private', 'POST', $params, null, null, array());
    }
    public function private_post_merchant_create_payment($params = array()) {
        return $this->request('merchant/create_payment', 'private', 'POST', $params, null, null, array());
    }
    public function private_delete_user_orders_uuid($params = array()) {
        return $this->request('user/orders/{uuid}', 'private', 'DELETE', $params, null, null, array());
    }
    public function private_delete_user_orders_uuid_cancel($params = array()) {
        return $this->request('user/orders/{uuid}/cancel', 'private', 'DELETE', $params, null, null, array());
    }
    public function private_delete_user_price_alerts_id($params = array()) {
        return $this->request('user/price_alerts/{id}', 'private', 'DELETE', $params, null, null, array());
    }
    public function publicGetCountries($params = array()) {
        return $this->request('countries', 'public', 'GET', $params, null, null, array());
    }
    public function publicGetDataCurrencyTicker($params = array()) {
        return $this->request('data/{currency}/ticker', 'public', 'GET', $params, null, null, array());
    }
    public function publicGetDataCurrencyTrades($params = array()) {
        return $this->request('data/{currency}/trades', 'public', 'GET', $params, null, null, array());
    }
    public function publicGetDataCurrencyDepth($params = array()) {
        return $this->request('data/{currency}/depth', 'public', 'GET', $params, null, null, array());
    }
    public function publicGetBitcoinChartsIdTrades($params = array()) {
        return $this->request('bitcoin_charts/{id}/trades', 'public', 'GET', $params, null, null, array());
    }
    public function publicGetBitcoinChartsIdDepth($params = array()) {
        return $this->request('bitcoin_charts/{id}/depth', 'public', 'GET', $params, null, null, array());
    }
    public function privateGetUser($params = array()) {
        return $this->request('user', 'private', 'GET', $params, null, null, array());
    }
    public function privateGetUserAddresses($params = array()) {
        return $this->request('user/addresses', 'private', 'GET', $params, null, null, array());
    }
    public function privateGetUserAddressesAddress($params = array()) {
        return $this->request('user/addresses/{address}', 'private', 'GET', $params, null, null, array());
    }
    public function privateGetUserOrders($params = array()) {
        return $this->request('user/orders', 'private', 'GET', $params, null, null, array());
    }
    public function privateGetUserOrdersUuid($params = array()) {
        return $this->request('user/orders/{uuid}', 'private', 'GET', $params, null, null, array());
    }
    public function privateGetUserPriceAlerts($params = array()) {
        return $this->request('user/price_alerts', 'private', 'GET', $params, null, null, array());
    }
    public function privateGetMerchantGetPaymentUuid($params = array()) {
        return $this->request('merchant/get_payment/{uuid}', 'private', 'GET', $params, null, null, array());
    }
    public function privatePostUserAddresses($params = array()) {
        return $this->request('user/addresses', 'private', 'POST', $params, null, null, array());
    }
    public function privatePostUserOrders($params = array()) {
        return $this->request('user/orders', 'private', 'POST', $params, null, null, array());
    }
    public function privatePostUserWithdrawals($params = array()) {
        return $this->request('user/withdrawals', 'private', 'POST', $params, null, null, array());
    }
    public function privatePostUserEmailTransfers($params = array()) {
        return $this->request('user/email_transfers', 'private', 'POST', $params, null, null, array());
    }
    public function privatePostUserPaymentRequests($params = array()) {
        return $this->request('user/payment_requests', 'private', 'POST', $params, null, null, array());
    }
    public function privatePostUserPriceAlerts($params = array()) {
        return $this->request('user/price_alerts', 'private', 'POST', $params, null, null, array());
    }
    public function privatePostMerchantCreatePayment($params = array()) {
        return $this->request('merchant/create_payment', 'private', 'POST', $params, null, null, array());
    }
    public function privateDeleteUserOrdersUuid($params = array()) {
        return $this->request('user/orders/{uuid}', 'private', 'DELETE', $params, null, null, array());
    }
    public function privateDeleteUserOrdersUuidCancel($params = array()) {
        return $this->request('user/orders/{uuid}/cancel', 'private', 'DELETE', $params, null, null, array());
    }
    public function privateDeleteUserPriceAlertsId($params = array()) {
        return $this->request('user/price_alerts/{id}', 'private', 'DELETE', $params, null, null, array());
    }
}
