/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postWrapper = postWrapper;
// Repurposed ideas from: https://gist.github.com/blankg/d5537a458b55b9d15cb4fd78258ad840
var promiseChain = new Promise(function (resolve, reject) {
  function tryAgain() {
    if (window.postMessage.length !== 1) {
      setTimeout(function () {
        resolve();
      }, 100);
    } else {
      resolve();
    }
  }
  tryAgain();
});
var callbacks = {};
var promises = {};
var guid = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

function postWrapper(args) {
  // Add callback id to args
  args.cbid = guid();
  // Queue up message
  promiseChain = promiseChain.then(function () {
    return new Promise(function (resolve, reject) {
      promises[args.cbid] = {
        resolve: resolve,
        reject: reject
      };
      window.postMessage(JSON.stringify(args), '*');
    });
  });
  return new Promise(function (resolve, reject) {
    callbacks[args.cbid] = function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    };
  });
}

function nextMessage(cbid) {
  if (promises[cbid]) {
    promises[cbid].resolve();
    delete promises[cbid];
  }
}

function pluginReturn(data) {
  var _JSON$parse = JSON.parse(data),
      cbid = _JSON$parse.cbid,
      err = _JSON$parse.err,
      res = _JSON$parse.res;

  if (callbacks[cbid]) {
    callbacks[cbid](err, res);
    delete callbacks[cbid];
    return true;
  } else {
    return false;
  }
}

document.PLUGIN_NEXT = window.PLUGIN_NEXT = nextMessage;
document.PLUGIN_RETURN = window.PLUGIN_RETURN = pluginReturn;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utils = exports.ui = exports.config = exports.core = undefined;

var _core = __webpack_require__(2);

var core = _interopRequireWildcard(_core);

var _config = __webpack_require__(3);

var config = _interopRequireWildcard(_config);

var _ui = __webpack_require__(4);

var ui = _interopRequireWildcard(_ui);

var _utils = __webpack_require__(5);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.core = core;
exports.config = config;
exports.ui = ui;
exports.utils = utils;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bitidAddress = bitidAddress;
exports.bitidSignature = bitidSignature;
exports.chooseWallet = chooseWallet;
exports.selectedWallet = selectedWallet;
exports.wallets = wallets;
exports.getAddress = getAddress;
exports.finalizeReceiveRequest = finalizeReceiveRequest;
exports.requestSpend = requestSpend;
exports.createSpendRequest2 = createSpendRequest2;
exports.requestSign = requestSign;
exports.broadcastTx = broadcastTx;
exports.saveTx = saveTx;
exports.requestFile = requestFile;
exports.writeData = writeData;
exports.clearData = clearData;
exports.readData = readData;
exports.debugLevel = debugLevel;
exports.getAffiliateInfo = getAffiliateInfo;

var _bridge = __webpack_require__(0);

/**
 * Returns a bitid address for the given uri and message
 * @return {string} bitid address
 */
function bitidAddress(uri, message) {
  return (0, _bridge.postWrapper)({
    func: 'bitidAddress', uri: uri, message: message
  });
}

/**
 * Returns a bitid signature for the given uri and message
 * @return {string} bitid signature
 */
function bitidSignature(uri, message) {
  return (0, _bridge.postWrapper)({ func: 'bitidSignature', uri: uri, message: message });
}

/**
 * Launches UI modal to select a wallet
 * @return promise
 */
function chooseWallet() {
  return (0, _bridge.postWrapper)({ func: 'chooseWallet' });
}

/**
 * Returns the user's currently selected wallet
 * @return promise
 */
function selectedWallet() {
  return (0, _bridge.postWrapper)({ func: 'selectedWallet' });
}

/**
 * Returns a list of the wallets for this account, included archived wallets
 * @return {object} an array of wallets
 */
function wallets(options) {
  return (0, _bridge.postWrapper)({ func: 'wallets', options: options });
}

/**
 * Create a receive request from the provided wallet.
 * @param {object} walletId - the walletId object
 * @return {object} currencyCode - currency code
 */
function getAddress(walletId, currencyCode) {
  return (0, _bridge.postWrapper)({ func: 'getAddress', walletId: walletId, currencyCode: currencyCode });
}

/**
 * Finalizing a request marks the address as used and it will not be used for
 * future requests. The metadata will also be written for this address.  This
 * is useful so that when a future payment comes in, the metadata can be
 * auto-populated.
 * @return true if the request was successfully finalized.
 * @param {object} wallet - the wallet object
 * @param {string} requestId - the bitcoin address to finalize
 */
function finalizeReceiveRequest(wallet, requestId) {
  return (0, _bridge.postWrapper)({ func: 'finalizeReceiveRequest', wallet: wallet, requestId: requestId });
}

/**
 * Request that the user spends.
 * @param {object} wallet - the wallet object
 * @param {string} toAddress - the recipient address
 * @param {number} nativeAmount - how many satoshis to spend
 */
function requestSpend(wallet, toAddress, nativeAmount, options) {
  return (0, _bridge.postWrapper)({
    func: 'requestSpend',
    wallet: wallet,
    toAddress: toAddress,
    nativeAmount: nativeAmount,
    options: options
  });
}

/**
 * Request that the user spends to 2 outputs.
 * @param {object} wallet - the wallet object
 * @param {string} toAddress - the recipient address
 * @param {number} nativeAmount - how many satoshis to spend
 * @param {string} toAddress2 - the recipient address
 * @param {number} nativeAmount2 - how many satoshis to spend
 */
function createSpendRequest2(wallet, toAddress, nativeAmount, toAddress2, nativeAmount2, options) {
  return (0, _bridge.postWrapper)({
    func: 'createSpendRequest2',
    wallet: wallet,
    toAddress: toAddress,
    nativeAmount: nativeAmount,
    toAddress2: toAddress2,
    nativeAmount2: nativeAmount2,
    options: options
  });
}

/**
 * Request that the user creates and signs a transaction
 * @param {object} wallet - the wallet object
 * @param {string} toAddress - the recipient address
 * @param {number} nativeAmount - how many satoshis to spend
 * @param {amountFiat} amountFiat - not required, but the fiat value at the time of the request
 */
function requestSign(wallet, toAddress, nativeAmount, amountFiat, options) {
  return (0, _bridge.postWrapper)({
    func: 'requestSign',
    wallet: wallet,
    toAddress: toAddress,
    nativeAmount: nativeAmount,
    amountFiat: amountFiat,
    options: options
  });
}

/**
 * Broadcast a transaction.
 * @param {object} the wallet object
 * @param {string} the raw hex to be saved to the database
 */
function broadcastTx(wallet, rawtx) {
  return (0, _bridge.postWrapper)({ func: 'broadcastTx', wallet: wallet, rawtx: rawtx });
}

/**
 * Save the transaction to transaction database This should only be called if
 * the transaction has been successfully broadcasted, either by using
 * #Airbitz.core.broadcastTx or by a third party.
 * @param {object} the wallet object
 * @param {string} the raw hex to be saved to the database
 */
function saveTx(wallet, rawtx) {
  return (0, _bridge.postWrapper)({ func: 'saveTx', wallet: wallet, rawtx: rawtx });
}

/**
 * Launches the native OS's camera or file browser so the user can select a
 * file.
 */
function requestFile(options) {
  return (0, _bridge.postWrapper)({ func: 'requestFile', options: options });
}

/**
 * Securely persist data into the Airbitz core. Only the current plugin will
 * have access to that data.
 * @param {string} key - the key to access the data in the future
 * @param {object} data - the data to write, which will be encrypted and backed up
 */
function writeData(key, value) {
  return (0, _bridge.postWrapper)({ func: 'writeData', key: key, value: value });
}

/**
 * Clear all data in the Airbitz core, for the current plugin.
 */
function clearData() {
  return (0, _bridge.postWrapper)({ func: 'clearData' });
}

/**
 * Read the securely stored data from disk.
 * @param {string} key - the key to access the data.
 */
function readData(key) {
  return (0, _bridge.postWrapper)({ func: 'readData', key: key });
}

/**
 * Log messages to the ABC core at a particular level.
 * @param {number} level - ERROR = 0, WARNING = 1, INFO = 2, DEBUG = 3;
 */
function debugLevel(level, text) {
  return (0, _bridge.postWrapper)({ func: 'debugLevel', level: level, text: text });
}

/**
 * There is affiliate data only if the account was installed via an affiliate
 * link.
 * @return {object} dictionary of affiliate data
 */
function getAffiliateInfo() {
  return (0, _bridge.postWrapper)({ func: 'getAffiliateInfo' });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

var _bridge = __webpack_require__(0);

/**
 * Fetch a configuration value. These are set in the native code, before the
 * webview is every loaded.
 * @param {key} key - the configuration key to fetch a value for
 * @return Promise with either string value on success or err on failure
 */
function get(key) {
  return (0, _bridge.postWrapper)({ func: 'get', key: key });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showAlert = showAlert;
exports.hideAlert = hideAlert;
exports.title = title;
exports.back = back;
exports.exit = exit;
exports.launchExternal = launchExternal;
exports.navStackClear = navStackClear;
exports.navStackPush = navStackPush;
exports.navStackPop = navStackPop;

var _bridge = __webpack_require__(0);

/**
 * Launches a native alert dialog.
 * @param {string} title - the dialog title
 * @param {string} message - the message body of the dialog
 */
function showAlert(success, title, message, options) {
  return (0, _bridge.postWrapper)({ func: 'showAlert', success: success, title: title, message: message });
}

/**
 * Hide an alerts that are currently displayed.
 */
function hideAlert() {
  return (0, _bridge.postWrapper)({ func: 'hideAlert' });
}

/**
 * Set the title of the current view. This updates the native apps titlebar.
 * @param {string} title - the title string
 */
function title(s) {
  return (0, _bridge.postWrapper)({ func: 'title', 'title': s });
}

/**
 * Go back in the navigation stack.
 */
function back() {
  return (0, _bridge.postWrapper)({ func: 'back' });
}

/**
 * Exit the plugin. This pops the current fragment or view controller of the
 * stack and destroys the webview.
 */
function exit() {
  return (0, _bridge.postWrapper)({ func: 'exit' });
}

/**
 * Launch an external web page or application.
 * @param {string} uri - the uri or url to open in a different app.
 */
function launchExternal(uri) {
  return (0, _bridge.postWrapper)({ func: 'launchExternal', uri: uri });
}

/**
 * Clear the naviation stack. Helpful when overriding the behavior of the
 * back button.
 */
function navStackClear() {
  return (0, _bridge.postWrapper)({ func: 'navStackClear' });
}

/**
 * Push a new URL onto the nav stack.
 */
function navStackPush(path) {
  return (0, _bridge.postWrapper)({ func: 'navStackPush', path: path });
}

/**
 * Pop a URL off the nav stack.
 */
function navStackPop() {
  return (0, _bridge.postWrapper)({ func: 'navStackPop' });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var COUNTRY_LIST = exports.COUNTRY_LIST = [{ 'name': 'Afghanistan', 'codeAlpha3': 'AFG', 'country-code': '004' }, { 'name': 'Åland Islands', 'codeAlpha3': 'ALA', 'country-code': '248' }, { 'name': 'Albania', 'codeAlpha3': 'ALB', 'country-code': '008' }, { 'name': 'Algeria', 'codeAlpha3': 'DZA', 'country-code': '012' }, { 'name': 'American Samoa', 'codeAlpha3': 'ASM', 'country-code': '016' }, { 'name': 'Andorra', 'codeAlpha3': 'AND', 'country-code': '020' }, { 'name': 'Angola', 'codeAlpha3': 'AGO', 'country-code': '024' }, { 'name': 'Anguilla', 'codeAlpha3': 'AIA', 'country-code': '660' }, { 'name': 'Antarctica', 'codeAlpha3': 'ATA', 'country-code': '010' }, { 'name': 'Antigua and Barbuda', 'codeAlpha3': 'ATG', 'country-code': '028' }, { 'name': 'Argentina', 'codeAlpha3': 'ARG', 'country-code': '032' }, { 'name': 'Armenia', 'codeAlpha3': 'ARM', 'country-code': '051' }, { 'name': 'Aruba', 'codeAlpha3': 'ABW', 'country-code': '533' }, { 'name': 'Australia', 'codeAlpha3': 'AUS', 'country-code': '036' }, { 'name': 'Austria', 'codeAlpha3': 'AUT', 'country-code': '040' }, { 'name': 'Azerbaijan', 'codeAlpha3': 'AZE', 'country-code': '031' }, { 'name': 'Bahamas', 'codeAlpha3': 'BHS', 'country-code': '044' }, { 'name': 'Bahrain', 'codeAlpha3': 'BHR', 'country-code': '048' }, { 'name': 'Bangladesh', 'codeAlpha3': 'BGD', 'country-code': '050' }, { 'name': 'Barbados', 'codeAlpha3': 'BRB', 'country-code': '052' }, { 'name': 'Belarus', 'codeAlpha3': 'BLR', 'country-code': '112' }, { 'name': 'Belgium', 'codeAlpha3': 'BEL', 'country-code': '056' }, { 'name': 'Belize', 'codeAlpha3': 'BLZ', 'country-code': '084' }, { 'name': 'Benin', 'codeAlpha3': 'BEN', 'country-code': '204' }, { 'name': 'Bermuda', 'codeAlpha3': 'BMU', 'country-code': '060' }, { 'name': 'Bhutan', 'codeAlpha3': 'BTN', 'country-code': '064' }, { 'name': 'Bolivia (Plurinational State of)', 'codeAlpha3': 'BOL', 'country-code': '068' }, { 'name': 'Bonaire, Sint Eustatius and Saba', 'codeAlpha3': 'BES', 'country-code': '535' }, { 'name': 'Bosnia and Herzegovina', 'codeAlpha3': 'BIH', 'country-code': '070' }, { 'name': 'Botswana', 'codeAlpha3': 'BWA', 'country-code': '072' }, { 'name': 'Bouvet Island', 'codeAlpha3': 'BVT', 'country-code': '074' }, { 'name': 'Brazil', 'codeAlpha3': 'BRA', 'country-code': '076' }, { 'name': 'British Indian Ocean Territory', 'codeAlpha3': 'IOT', 'country-code': '086' }, { 'name': 'Brunei Darussalam', 'codeAlpha3': 'BRN', 'country-code': '096' }, { 'name': 'Bulgaria', 'codeAlpha3': 'BGR', 'country-code': '100' }, { 'name': 'Burkina Faso', 'codeAlpha3': 'BFA', 'country-code': '854' }, { 'name': 'Burundi', 'codeAlpha3': 'BDI', 'country-code': '108' }, { 'name': 'Cambodia', 'codeAlpha3': 'KHM', 'country-code': '116' }, { 'name': 'Cameroon', 'codeAlpha3': 'CMR', 'country-code': '120' }, { 'name': 'Canada', 'codeAlpha3': 'CAN', 'country-code': '124' }, { 'name': 'Cabo Verde', 'codeAlpha3': 'CPV', 'country-code': '132' }, { 'name': 'Cayman Islands', 'codeAlpha3': 'CYM', 'country-code': '136' }, { 'name': 'Central African Republic', 'codeAlpha3': 'CAF', 'country-code': '140' }, { 'name': 'Chad', 'codeAlpha3': 'TCD', 'country-code': '148' }, { 'name': 'Chile', 'codeAlpha3': 'CHL', 'country-code': '152' }, { 'name': 'China', 'codeAlpha3': 'CHN', 'country-code': '156' }, { 'name': 'Christmas Island', 'codeAlpha3': 'CXR', 'country-code': '162' }, { 'name': 'Cocos (Keeling) Islands', 'codeAlpha3': 'CCK', 'country-code': '166' }, { 'name': 'Colombia', 'codeAlpha3': 'COL', 'country-code': '170' }, { 'name': 'Comoros', 'codeAlpha3': 'COM', 'country-code': '174' }, { 'name': 'Congo', 'codeAlpha3': 'COG', 'country-code': '178' }, { 'name': 'Congo (Democratic Republic of the)', 'codeAlpha3': 'COD', 'country-code': '180' }, { 'name': 'Cook Islands', 'codeAlpha3': 'COK', 'country-code': '184' }, { 'name': 'Costa Rica', 'codeAlpha3': 'CRI', 'country-code': '188' }, { 'name': "Côte d'Ivoire", 'codeAlpha3': 'CIV', 'country-code': '384' }, { 'name': 'Croatia', 'codeAlpha3': 'HRV', 'country-code': '191' }, { 'name': 'Cuba', 'codeAlpha3': 'CUB', 'country-code': '192' }, { 'name': 'Curaçao', 'codeAlpha3': 'CUW', 'country-code': '531' }, { 'name': 'Cyprus', 'codeAlpha3': 'CYP', 'country-code': '196' }, { 'name': 'Czech Republic', 'codeAlpha3': 'CZE', 'country-code': '203' }, { 'name': 'Denmark', 'codeAlpha3': 'DNK', 'country-code': '208' }, { 'name': 'Djibouti', 'codeAlpha3': 'DJI', 'country-code': '262' }, { 'name': 'Dominica', 'codeAlpha3': 'DMA', 'country-code': '212' }, { 'name': 'Dominican Republic', 'codeAlpha3': 'DOM', 'country-code': '214' }, { 'name': 'Ecuador', 'codeAlpha3': 'ECU', 'country-code': '218' }, { 'name': 'Egypt', 'codeAlpha3': 'EGY', 'country-code': '818' }, { 'name': 'El Salvador', 'codeAlpha3': 'SLV', 'country-code': '222' }, { 'name': 'Equatorial Guinea', 'codeAlpha3': 'GNQ', 'country-code': '226' }, { 'name': 'Eritrea', 'codeAlpha3': 'ERI', 'country-code': '232' }, { 'name': 'Estonia', 'codeAlpha3': 'EST', 'country-code': '233' }, { 'name': 'Ethiopia', 'codeAlpha3': 'ETH', 'country-code': '231' }, { 'name': 'Falkland Islands (Malvinas)', 'codeAlpha3': 'FLK', 'country-code': '238' }, { 'name': 'Faroe Islands', 'codeAlpha3': 'FRO', 'country-code': '234' }, { 'name': 'Fiji', 'codeAlpha3': 'FJI', 'country-code': '242' }, { 'name': 'Finland', 'codeAlpha3': 'FIN', 'country-code': '246' }, { 'name': 'France', 'codeAlpha3': 'FRA', 'country-code': '250' }, { 'name': 'French Guiana', 'codeAlpha3': 'GUF', 'country-code': '254' }, { 'name': 'French Polynesia', 'codeAlpha3': 'PYF', 'country-code': '258' }, { 'name': 'French Southern Territories', 'codeAlpha3': 'ATF', 'country-code': '260' }, { 'name': 'Gabon', 'codeAlpha3': 'GAB', 'country-code': '266' }, { 'name': 'Gambia', 'codeAlpha3': 'GMB', 'country-code': '270' }, { 'name': 'Georgia', 'codeAlpha3': 'GEO', 'country-code': '268' }, { 'name': 'Germany', 'codeAlpha3': 'DEU', 'country-code': '276' }, { 'name': 'Ghana', 'codeAlpha3': 'GHA', 'country-code': '288' }, { 'name': 'Gibraltar', 'codeAlpha3': 'GIB', 'country-code': '292' }, { 'name': 'Greece', 'codeAlpha3': 'GRC', 'country-code': '300' }, { 'name': 'Greenland', 'codeAlpha3': 'GRL', 'country-code': '304' }, { 'name': 'Grenada', 'codeAlpha3': 'GRD', 'country-code': '308' }, { 'name': 'Guadeloupe', 'codeAlpha3': 'GLP', 'country-code': '312' }, { 'name': 'Guam', 'codeAlpha3': 'GUM', 'country-code': '316' }, { 'name': 'Guatemala', 'codeAlpha3': 'GTM', 'country-code': '320' }, { 'name': 'Guernsey', 'codeAlpha3': 'GGY', 'country-code': '831' }, { 'name': 'Guinea', 'codeAlpha3': 'GIN', 'country-code': '324' }, { 'name': 'Guinea-Bissau', 'codeAlpha3': 'GNB', 'country-code': '624' }, { 'name': 'Guyana', 'codeAlpha3': 'GUY', 'country-code': '328' }, { 'name': 'Haiti', 'codeAlpha3': 'HTI', 'country-code': '332' }, { 'name': 'Heard Island and McDonald Islands', 'codeAlpha3': 'HMD', 'country-code': '334' }, { 'name': 'Holy See', 'codeAlpha3': 'VAT', 'country-code': '336' }, { 'name': 'Honduras', 'codeAlpha3': 'HND', 'country-code': '340' }, { 'name': 'Hong Kong', 'codeAlpha3': 'HKG', 'country-code': '344' }, { 'name': 'Hungary', 'codeAlpha3': 'HUN', 'country-code': '348' }, { 'name': 'Iceland', 'codeAlpha3': 'ISL', 'country-code': '352' }, { 'name': 'India', 'codeAlpha3': 'IND', 'country-code': '356' }, { 'name': 'Indonesia', 'codeAlpha3': 'IDN', 'country-code': '360' }, { 'name': 'Iran (Islamic Republic of)', 'codeAlpha3': 'IRN', 'country-code': '364' }, { 'name': 'Iraq', 'codeAlpha3': 'IRQ', 'country-code': '368' }, { 'name': 'Ireland', 'codeAlpha3': 'IRL', 'country-code': '372' }, { 'name': 'Isle of Man', 'codeAlpha3': 'IMN', 'country-code': '833' }, { 'name': 'Israel', 'codeAlpha3': 'ISR', 'country-code': '376' }, { 'name': 'Italy', 'codeAlpha3': 'ITA', 'country-code': '380' }, { 'name': 'Jamaica', 'codeAlpha3': 'JAM', 'country-code': '388' }, { 'name': 'Japan', 'codeAlpha3': 'JPN', 'country-code': '392' }, { 'name': 'Jersey', 'codeAlpha3': 'JEY', 'country-code': '832' }, { 'name': 'Jordan', 'codeAlpha3': 'JOR', 'country-code': '400' }, { 'name': 'Kazakhstan', 'codeAlpha3': 'KAZ', 'country-code': '398' }, { 'name': 'Kenya', 'codeAlpha3': 'KEN', 'country-code': '404' }, { 'name': 'Kiribati', 'codeAlpha3': 'KIR', 'country-code': '296' }, { 'name': "Korea (Democratic People's Republic of)", 'codeAlpha3': 'PRK', 'country-code': '408' }, { 'name': 'Korea (Republic of)', 'codeAlpha3': 'KOR', 'country-code': '410' }, { 'name': 'Kuwait', 'codeAlpha3': 'KWT', 'country-code': '414' }, { 'name': 'Kyrgyzstan', 'codeAlpha3': 'KGZ', 'country-code': '417' }, { 'name': "Lao People's Democratic Republic", 'codeAlpha3': 'LAO', 'country-code': '418' }, { 'name': 'Latvia', 'codeAlpha3': 'LVA', 'country-code': '428' }, { 'name': 'Lebanon', 'codeAlpha3': 'LBN', 'country-code': '422' }, { 'name': 'Lesotho', 'codeAlpha3': 'LSO', 'country-code': '426' }, { 'name': 'Liberia', 'codeAlpha3': 'LBR', 'country-code': '430' }, { 'name': 'Libya', 'codeAlpha3': 'LBY', 'country-code': '434' }, { 'name': 'Liechtenstein', 'codeAlpha3': 'LIE', 'country-code': '438' }, { 'name': 'Lithuania', 'codeAlpha3': 'LTU', 'country-code': '440' }, { 'name': 'Luxembourg', 'codeAlpha3': 'LUX', 'country-code': '442' }, { 'name': 'Macao', 'codeAlpha3': 'MAC', 'country-code': '446' }, { 'name': 'Macedonia (the former Yugoslav Republic of)', 'codeAlpha3': 'MKD', 'country-code': '807' }, { 'name': 'Madagascar', 'codeAlpha3': 'MDG', 'country-code': '450' }, { 'name': 'Malawi', 'codeAlpha3': 'MWI', 'country-code': '454' }, { 'name': 'Malaysia', 'codeAlpha3': 'MYS', 'country-code': '458' }, { 'name': 'Maldives', 'codeAlpha3': 'MDV', 'country-code': '462' }, { 'name': 'Mali', 'codeAlpha3': 'MLI', 'country-code': '466' }, { 'name': 'Malta', 'codeAlpha3': 'MLT', 'country-code': '470' }, { 'name': 'Marshall Islands', 'codeAlpha3': 'MHL', 'country-code': '584' }, { 'name': 'Martinique', 'codeAlpha3': 'MTQ', 'country-code': '474' }, { 'name': 'Mauritania', 'codeAlpha3': 'MRT', 'country-code': '478' }, { 'name': 'Mauritius', 'codeAlpha3': 'MUS', 'country-code': '480' }, { 'name': 'Mayotte', 'codeAlpha3': 'MYT', 'country-code': '175' }, { 'name': 'Mexico', 'codeAlpha3': 'MEX', 'country-code': '484' }, { 'name': 'Micronesia (Federated States of)', 'codeAlpha3': 'FSM', 'country-code': '583' }, { 'name': 'Moldova (Republic of)', 'codeAlpha3': 'MDA', 'country-code': '498' }, { 'name': 'Monaco', 'codeAlpha3': 'MCO', 'country-code': '492' }, { 'name': 'Mongolia', 'codeAlpha3': 'MNG', 'country-code': '496' }, { 'name': 'Montenegro', 'codeAlpha3': 'MNE', 'country-code': '499' }, { 'name': 'Montserrat', 'codeAlpha3': 'MSR', 'country-code': '500' }, { 'name': 'Morocco', 'codeAlpha3': 'MAR', 'country-code': '504' }, { 'name': 'Mozambique', 'codeAlpha3': 'MOZ', 'country-code': '508' }, { 'name': 'Myanmar', 'codeAlpha3': 'MMR', 'country-code': '104' }, { 'name': 'Namibia', 'codeAlpha3': 'NAM', 'country-code': '516' }, { 'name': 'Nauru', 'codeAlpha3': 'NRU', 'country-code': '520' }, { 'name': 'Nepal', 'codeAlpha3': 'NPL', 'country-code': '524' }, { 'name': 'Netherlands', 'codeAlpha3': 'NLD', 'country-code': '528' }, { 'name': 'New Caledonia', 'codeAlpha3': 'NCL', 'country-code': '540' }, { 'name': 'New Zealand', 'codeAlpha3': 'NZL', 'country-code': '554' }, { 'name': 'Nicaragua', 'codeAlpha3': 'NIC', 'country-code': '558' }, { 'name': 'Niger', 'codeAlpha3': 'NER', 'country-code': '562' }, { 'name': 'Nigeria', 'codeAlpha3': 'NGA', 'country-code': '566' }, { 'name': 'Niue', 'codeAlpha3': 'NIU', 'country-code': '570' }, { 'name': 'Norfolk Island', 'codeAlpha3': 'NFK', 'country-code': '574' }, { 'name': 'Northern Mariana Islands', 'codeAlpha3': 'MNP', 'country-code': '580' }, { 'name': 'Norway', 'codeAlpha3': 'NOR', 'country-code': '578' }, { 'name': 'Oman', 'codeAlpha3': 'OMN', 'country-code': '512' }, { 'name': 'Pakistan', 'codeAlpha3': 'PAK', 'country-code': '586' }, { 'name': 'Palau', 'codeAlpha3': 'PLW', 'country-code': '585' }, { 'name': 'Palestine, State of', 'codeAlpha3': 'PSE', 'country-code': '275' }, { 'name': 'Panama', 'codeAlpha3': 'PAN', 'country-code': '591' }, { 'name': 'Papua New Guinea', 'codeAlpha3': 'PNG', 'country-code': '598' }, { 'name': 'Paraguay', 'codeAlpha3': 'PRY', 'country-code': '600' }, { 'name': 'Peru', 'codeAlpha3': 'PER', 'country-code': '604' }, { 'name': 'Philippines', 'codeAlpha3': 'PHL', 'country-code': '608' }, { 'name': 'Pitcairn', 'codeAlpha3': 'PCN', 'country-code': '612' }, { 'name': 'Poland', 'codeAlpha3': 'POL', 'country-code': '616' }, { 'name': 'Portugal', 'codeAlpha3': 'PRT', 'country-code': '620' }, { 'name': 'Puerto Rico', 'codeAlpha3': 'PRI', 'country-code': '630' }, { 'name': 'Qatar', 'codeAlpha3': 'QAT', 'country-code': '634' }, { 'name': 'Réunion', 'codeAlpha3': 'REU', 'country-code': '638' }, { 'name': 'Romania', 'codeAlpha3': 'ROU', 'country-code': '642' }, { 'name': 'Russian Federation', 'codeAlpha3': 'RUS', 'country-code': '643' }, { 'name': 'Rwanda', 'codeAlpha3': 'RWA', 'country-code': '646' }, { 'name': 'Saint Barthélemy', 'codeAlpha3': 'BLM', 'country-code': '652' }, { 'name': 'Saint Helena, Ascension and Tristan da Cunha', 'codeAlpha3': 'SHN', 'country-code': '654' }, { 'name': 'Saint Kitts and Nevis', 'codeAlpha3': 'KNA', 'country-code': '659' }, { 'name': 'Saint Lucia', 'codeAlpha3': 'LCA', 'country-code': '662' }, { 'name': 'Saint Martin (French part)', 'codeAlpha3': 'MAF', 'country-code': '663' }, { 'name': 'Saint Pierre and Miquelon', 'codeAlpha3': 'SPM', 'country-code': '666' }, { 'name': 'Saint Vincent and the Grenadines', 'codeAlpha3': 'VCT', 'country-code': '670' }, { 'name': 'Samoa', 'codeAlpha3': 'WSM', 'country-code': '882' }, { 'name': 'San Marino', 'codeAlpha3': 'SMR', 'country-code': '674' }, { 'name': 'Sao Tome and Principe', 'codeAlpha3': 'STP', 'country-code': '678' }, { 'name': 'Saudi Arabia', 'codeAlpha3': 'SAU', 'country-code': '682' }, { 'name': 'Senegal', 'codeAlpha3': 'SEN', 'country-code': '686' }, { 'name': 'Serbia', 'codeAlpha3': 'SRB', 'country-code': '688' }, { 'name': 'Seychelles', 'codeAlpha3': 'SYC', 'country-code': '690' }, { 'name': 'Sierra Leone', 'codeAlpha3': 'SLE', 'country-code': '694' }, { 'name': 'Singapore', 'codeAlpha3': 'SGP', 'country-code': '702' }, { 'name': 'Sint Maarten (Dutch part)', 'codeAlpha3': 'SXM', 'country-code': '534' }, { 'name': 'Slovakia', 'codeAlpha3': 'SVK', 'country-code': '703' }, { 'name': 'Slovenia', 'codeAlpha3': 'SVN', 'country-code': '705' }, { 'name': 'Solomon Islands', 'codeAlpha3': 'SLB', 'country-code': '090' }, { 'name': 'Somalia', 'codeAlpha3': 'SOM', 'country-code': '706' }, { 'name': 'South Africa', 'codeAlpha3': 'ZAF', 'country-code': '710' }, { 'name': 'South Georgia and the South Sandwich Islands', 'codeAlpha3': 'SGS', 'country-code': '239' }, { 'name': 'South Sudan', 'codeAlpha3': 'SSD', 'country-code': '728' }, { 'name': 'Spain', 'codeAlpha3': 'ESP', 'country-code': '724' }, { 'name': 'Sri Lanka', 'codeAlpha3': 'LKA', 'country-code': '144' }, { 'name': 'Sudan', 'codeAlpha3': 'SDN', 'country-code': '729' }, { 'name': 'Suriname', 'codeAlpha3': 'SUR', 'country-code': '740' }, { 'name': 'Svalbard and Jan Mayen', 'codeAlpha3': 'SJM', 'country-code': '744' }, { 'name': 'Swaziland', 'codeAlpha3': 'SWZ', 'country-code': '748' }, { 'name': 'Sweden', 'codeAlpha3': 'SWE', 'country-code': '752' }, { 'name': 'Switzerland', 'codeAlpha3': 'CHE', 'country-code': '756' }, { 'name': 'Syrian Arab Republic', 'codeAlpha3': 'SYR', 'country-code': '760' }, { 'name': 'Taiwan, Province of China', 'codeAlpha3': 'TWN', 'country-code': '158' }, { 'name': 'Tajikistan', 'codeAlpha3': 'TJK', 'country-code': '762' }, { 'name': 'Tanzania, United Republic of', 'codeAlpha3': 'TZA', 'country-code': '834' }, { 'name': 'Thailand', 'codeAlpha3': 'THA', 'country-code': '764' }, { 'name': 'Timor-Leste', 'codeAlpha3': 'TLS', 'country-code': '626' }, { 'name': 'Togo', 'codeAlpha3': 'TGO', 'country-code': '768' }, { 'name': 'Tokelau', 'codeAlpha3': 'TKL', 'country-code': '772' }, { 'name': 'Tonga', 'codeAlpha3': 'TON', 'country-code': '776' }, { 'name': 'Trinidad and Tobago', 'codeAlpha3': 'TTO', 'country-code': '780' }, { 'name': 'Tunisia', 'codeAlpha3': 'TUN', 'country-code': '788' }, { 'name': 'Turkey', 'codeAlpha3': 'TUR', 'country-code': '792' }, { 'name': 'Turkmenistan', 'codeAlpha3': 'TKM', 'country-code': '795' }, { 'name': 'Turks and Caicos Islands', 'codeAlpha3': 'TCA', 'country-code': '796' }, { 'name': 'Tuvalu', 'codeAlpha3': 'TUV', 'country-code': '798' }, { 'name': 'Uganda', 'codeAlpha3': 'UGA', 'country-code': '800' }, { 'name': 'Ukraine', 'codeAlpha3': 'UKR', 'country-code': '804' }, { 'name': 'United Arab Emirates', 'codeAlpha3': 'ARE', 'country-code': '784' }, { 'name': 'United Kingdom of Great Britain and Northern Ireland', 'codeAlpha3': 'GBR', 'country-code': '826' }, { 'name': 'United States of America', 'codeAlpha3': 'USA', 'country-code': '840' }, { 'name': 'United States Minor Outlying Islands', 'codeAlpha3': 'UMI', 'country-code': '581' }, { 'name': 'Uruguay', 'codeAlpha3': 'URY', 'country-code': '858' }, { 'name': 'Uzbekistan', 'codeAlpha3': 'UZB', 'country-code': '860' }, { 'name': 'Vanuatu', 'codeAlpha3': 'VUT', 'country-code': '548' }, { 'name': 'Venezuela (Bolivarian Republic of)', 'codeAlpha3': 'VEN', 'country-code': '862' }, { 'name': 'Viet Nam', 'codeAlpha3': 'VNM', 'country-code': '704' }, { 'name': 'Virgin Islands (British)', 'codeAlpha3': 'VGB', 'country-code': '092' }, { 'name': 'Virgin Islands (U.S.)', 'codeAlpha3': 'VIR', 'country-code': '850' }, { 'name': 'Wallis and Futuna', 'codeAlpha3': 'WLF', 'country-code': '876' }, { 'name': 'Western Sahara', 'codeAlpha3': 'ESH', 'country-code': '732' }, { 'name': 'Yemen', 'codeAlpha3': 'YEM', 'country-code': '887' }, { 'name': 'Zambia', 'codeAlpha3': 'ZMB', 'country-code': '894' }, { 'name': 'Zimbabwe', 'codeAlpha3': 'ZWE', 'country-code': '716' }];

/***/ })
/******/ ]);