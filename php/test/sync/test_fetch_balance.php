<?php
namespace ccxt;
use \ccxt\Precise;

// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -----------------------------------------------------------------------------
include_once __DIR__ . '/../base/test_balance.php';

function test_fetch_balance($exchange, $skipped_properties, $code, $symbol) {
    $method = 'fetchBalance';
    $response = $exchange->fetch_balance();
    test_balance($exchange, $skipped_properties, $method, $response);
}
