exports.id = "src_components_search_index_js";
exports.ids = ["src_components_search_index_js"];
exports.modules = {

/***/ "./node_modules/@algolia/cache-common/dist/cache-common.esm.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@algolia/cache-common/dist/cache-common.esm.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createFallbackableCache": () => (/* binding */ createFallbackableCache),
/* harmony export */   "createNullCache": () => (/* binding */ createNullCache)
/* harmony export */ });
// @todo Add logger on options to debug when caches go wrong.
function createFallbackableCache(options) {
    const caches = [...options.caches];
    const current = caches.shift(); // eslint-disable-line functional/immutable-data
    if (current === undefined) {
        return createNullCache();
    }
    return {
        get(key, defaultValue, events = {
            miss: () => Promise.resolve(),
        }) {
            return current.get(key, defaultValue, events).catch(() => {
                return createFallbackableCache({ caches }).get(key, defaultValue, events);
            });
        },
        set(key, value) {
            return current.set(key, value).catch(() => {
                return createFallbackableCache({ caches }).set(key, value);
            });
        },
        delete(key) {
            return current.delete(key).catch(() => {
                return createFallbackableCache({ caches }).delete(key);
            });
        },
        clear() {
            return current.clear().catch(() => {
                return createFallbackableCache({ caches }).clear();
            });
        },
    };
}

function createNullCache() {
    return {
        get(_key, defaultValue, events = {
            miss: () => Promise.resolve(),
        }) {
            const value = defaultValue();
            return value
                .then(result => Promise.all([result, events.miss(result)]))
                .then(([result]) => result);
        },
        set(_key, value) {
            return Promise.resolve(value);
        },
        delete(_key) {
            return Promise.resolve();
        },
        clear() {
            return Promise.resolve();
        },
    };
}




/***/ }),

/***/ "./node_modules/@algolia/cache-in-memory/dist/cache-in-memory.esm.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@algolia/cache-in-memory/dist/cache-in-memory.esm.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createInMemoryCache": () => (/* binding */ createInMemoryCache)
/* harmony export */ });
function createInMemoryCache(options = { serializable: true }) {
    // eslint-disable-next-line functional/no-let
    let cache = {};
    return {
        get(key, defaultValue, events = {
            miss: () => Promise.resolve(),
        }) {
            const keyAsString = JSON.stringify(key);
            if (keyAsString in cache) {
                return Promise.resolve(options.serializable ? JSON.parse(cache[keyAsString]) : cache[keyAsString]);
            }
            const promise = defaultValue();
            const miss = (events && events.miss) || (() => Promise.resolve());
            return promise.then((value) => miss(value)).then(() => promise);
        },
        set(key, value) {
            // eslint-disable-next-line functional/immutable-data
            cache[JSON.stringify(key)] = options.serializable ? JSON.stringify(value) : value;
            return Promise.resolve(value);
        },
        delete(key) {
            // eslint-disable-next-line functional/immutable-data
            delete cache[JSON.stringify(key)];
            return Promise.resolve();
        },
        clear() {
            cache = {};
            return Promise.resolve();
        },
    };
}




/***/ }),

/***/ "./node_modules/@algolia/client-analytics/dist/client-analytics.esm.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@algolia/client-analytics/dist/client-analytics.esm.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addABTest": () => (/* binding */ addABTest),
/* harmony export */   "createAnalyticsClient": () => (/* binding */ createAnalyticsClient),
/* harmony export */   "deleteABTest": () => (/* binding */ deleteABTest),
/* harmony export */   "getABTest": () => (/* binding */ getABTest),
/* harmony export */   "getABTests": () => (/* binding */ getABTests),
/* harmony export */   "stopABTest": () => (/* binding */ stopABTest)
/* harmony export */ });
/* harmony import */ var _algolia_client_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @algolia/client-common */ "./node_modules/@algolia/client-common/dist/client-common.esm.js");
/* harmony import */ var _algolia_transporter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @algolia/transporter */ "./node_modules/@algolia/transporter/dist/transporter.esm.js");
/* harmony import */ var _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @algolia/requester-common */ "./node_modules/@algolia/requester-common/dist/requester-common.esm.js");




const createAnalyticsClient = options => {
    const region = options.region || 'us';
    const auth = (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.createAuth)(_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.AuthMode.WithinHeaders, options.appId, options.apiKey);
    const transporter = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_1__.createTransporter)({
        hosts: [{ url: `analytics.${region}.algolia.com` }],
        ...options,
        headers: {
            ...auth.headers(),
            ...{ 'content-type': 'application/json' },
            ...options.headers,
        },
        queryParameters: {
            ...auth.queryParameters(),
            ...options.queryParameters,
        },
    });
    const appId = options.appId;
    return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.addMethods)({ appId, transporter }, options.methods);
};

const addABTest = (base) => {
    return (abTest, requestOptions) => {
        return base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__.MethodEnum.Post,
            path: '2/abtests',
            data: abTest,
        }, requestOptions);
    };
};

const deleteABTest = (base) => {
    return (abTestID, requestOptions) => {
        return base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__.MethodEnum.Delete,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.encode)('2/abtests/%s', abTestID),
        }, requestOptions);
    };
};

const getABTest = (base) => {
    return (abTestID, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.encode)('2/abtests/%s', abTestID),
        }, requestOptions);
    };
};

const getABTests = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__.MethodEnum.Get,
            path: '2/abtests',
        }, requestOptions);
    };
};

const stopABTest = (base) => {
    return (abTestID, requestOptions) => {
        return base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.encode)('2/abtests/%s/stop', abTestID),
        }, requestOptions);
    };
};




/***/ }),

/***/ "./node_modules/@algolia/client-common/dist/client-common.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@algolia/client-common/dist/client-common.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthMode": () => (/* binding */ AuthMode),
/* harmony export */   "addMethods": () => (/* binding */ addMethods),
/* harmony export */   "createAuth": () => (/* binding */ createAuth),
/* harmony export */   "createRetryablePromise": () => (/* binding */ createRetryablePromise),
/* harmony export */   "createWaitablePromise": () => (/* binding */ createWaitablePromise),
/* harmony export */   "destroy": () => (/* binding */ destroy),
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "shuffle": () => (/* binding */ shuffle),
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
function createAuth(authMode, appId, apiKey) {
    const credentials = {
        'x-algolia-api-key': apiKey,
        'x-algolia-application-id': appId,
    };
    return {
        headers() {
            return authMode === AuthMode.WithinHeaders ? credentials : {};
        },
        queryParameters() {
            return authMode === AuthMode.WithinQueryParameters ? credentials : {};
        },
    };
}

function createRetryablePromise(callback) {
    let retriesCount = 0; // eslint-disable-line functional/no-let
    const retry = () => {
        retriesCount++;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(callback(retry));
            }, Math.min(100 * retriesCount, 1000));
        });
    };
    return callback(retry);
}

function createWaitablePromise(promise, wait = (_response, _requestOptions) => {
    return Promise.resolve();
}) {
    // eslint-disable-next-line functional/immutable-data
    return Object.assign(promise, {
        wait(requestOptions) {
            return createWaitablePromise(promise
                .then(response => Promise.all([wait(response, requestOptions), response]))
                .then(promiseResults => promiseResults[1]));
        },
    });
}

// eslint-disable-next-line functional/prefer-readonly-type
function shuffle(array) {
    let c = array.length - 1; // eslint-disable-line functional/no-let
    // eslint-disable-next-line functional/no-loop-statement
    for (c; c > 0; c--) {
        const b = Math.floor(Math.random() * (c + 1));
        const a = array[c];
        array[c] = array[b]; // eslint-disable-line functional/immutable-data, no-param-reassign
        array[b] = a; // eslint-disable-line functional/immutable-data, no-param-reassign
    }
    return array;
}
function addMethods(base, methods) {
    if (!methods) {
        return base;
    }
    Object.keys(methods).forEach(key => {
        // eslint-disable-next-line functional/immutable-data, no-param-reassign
        base[key] = methods[key](base);
    });
    return base;
}
function encode(format, ...args) {
    // eslint-disable-next-line functional/no-let
    let i = 0;
    return format.replace(/%s/g, () => encodeURIComponent(args[i++]));
}

const version = '4.11.0';

const destroy = (base) => {
    return () => {
        return base.transporter.requester.destroy();
    };
};

const AuthMode = {
    /**
     * If auth credentials should be in query parameters.
     */
    WithinQueryParameters: 0,
    /**
     * If auth credentials should be in headers.
     */
    WithinHeaders: 1,
};




/***/ }),

/***/ "./node_modules/@algolia/client-personalization/dist/client-personalization.esm.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@algolia/client-personalization/dist/client-personalization.esm.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPersonalizationClient": () => (/* binding */ createPersonalizationClient),
/* harmony export */   "getPersonalizationStrategy": () => (/* binding */ getPersonalizationStrategy),
/* harmony export */   "setPersonalizationStrategy": () => (/* binding */ setPersonalizationStrategy)
/* harmony export */ });
/* harmony import */ var _algolia_client_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @algolia/client-common */ "./node_modules/@algolia/client-common/dist/client-common.esm.js");
/* harmony import */ var _algolia_transporter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @algolia/transporter */ "./node_modules/@algolia/transporter/dist/transporter.esm.js");
/* harmony import */ var _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @algolia/requester-common */ "./node_modules/@algolia/requester-common/dist/requester-common.esm.js");




const createPersonalizationClient = options => {
    const region = options.region || 'us';
    const auth = (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.createAuth)(_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.AuthMode.WithinHeaders, options.appId, options.apiKey);
    const transporter = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_1__.createTransporter)({
        hosts: [{ url: `personalization.${region}.algolia.com` }],
        ...options,
        headers: {
            ...auth.headers(),
            ...{ 'content-type': 'application/json' },
            ...options.headers,
        },
        queryParameters: {
            ...auth.queryParameters(),
            ...options.queryParameters,
        },
    });
    return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_0__.addMethods)({ appId: options.appId, transporter }, options.methods);
};

const getPersonalizationStrategy = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__.MethodEnum.Get,
            path: '1/strategies/personalization',
        }, requestOptions);
    };
};

const setPersonalizationStrategy = (base) => {
    return (personalizationStrategy, requestOptions) => {
        return base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_2__.MethodEnum.Post,
            path: '1/strategies/personalization',
            data: personalizationStrategy,
        }, requestOptions);
    };
};




/***/ }),

/***/ "./node_modules/@algolia/client-search/dist/client-search.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@algolia/client-search/dist/client-search.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApiKeyACLEnum": () => (/* binding */ ApiKeyACLEnum),
/* harmony export */   "BatchActionEnum": () => (/* binding */ BatchActionEnum),
/* harmony export */   "ScopeEnum": () => (/* binding */ ScopeEnum),
/* harmony export */   "StrategyEnum": () => (/* binding */ StrategyEnum),
/* harmony export */   "SynonymEnum": () => (/* binding */ SynonymEnum),
/* harmony export */   "addApiKey": () => (/* binding */ addApiKey),
/* harmony export */   "assignUserID": () => (/* binding */ assignUserID),
/* harmony export */   "assignUserIDs": () => (/* binding */ assignUserIDs),
/* harmony export */   "batch": () => (/* binding */ batch),
/* harmony export */   "browseObjects": () => (/* binding */ browseObjects),
/* harmony export */   "browseRules": () => (/* binding */ browseRules),
/* harmony export */   "browseSynonyms": () => (/* binding */ browseSynonyms),
/* harmony export */   "chunkedBatch": () => (/* binding */ chunkedBatch),
/* harmony export */   "clearDictionaryEntries": () => (/* binding */ clearDictionaryEntries),
/* harmony export */   "clearObjects": () => (/* binding */ clearObjects),
/* harmony export */   "clearRules": () => (/* binding */ clearRules),
/* harmony export */   "clearSynonyms": () => (/* binding */ clearSynonyms),
/* harmony export */   "copyIndex": () => (/* binding */ copyIndex),
/* harmony export */   "copyRules": () => (/* binding */ copyRules),
/* harmony export */   "copySettings": () => (/* binding */ copySettings),
/* harmony export */   "copySynonyms": () => (/* binding */ copySynonyms),
/* harmony export */   "createBrowsablePromise": () => (/* binding */ createBrowsablePromise),
/* harmony export */   "createMissingObjectIDError": () => (/* binding */ createMissingObjectIDError),
/* harmony export */   "createObjectNotFoundError": () => (/* binding */ createObjectNotFoundError),
/* harmony export */   "createSearchClient": () => (/* binding */ createSearchClient),
/* harmony export */   "createValidUntilNotFoundError": () => (/* binding */ createValidUntilNotFoundError),
/* harmony export */   "customRequest": () => (/* binding */ customRequest),
/* harmony export */   "deleteApiKey": () => (/* binding */ deleteApiKey),
/* harmony export */   "deleteBy": () => (/* binding */ deleteBy),
/* harmony export */   "deleteDictionaryEntries": () => (/* binding */ deleteDictionaryEntries),
/* harmony export */   "deleteIndex": () => (/* binding */ deleteIndex),
/* harmony export */   "deleteObject": () => (/* binding */ deleteObject),
/* harmony export */   "deleteObjects": () => (/* binding */ deleteObjects),
/* harmony export */   "deleteRule": () => (/* binding */ deleteRule),
/* harmony export */   "deleteSynonym": () => (/* binding */ deleteSynonym),
/* harmony export */   "exists": () => (/* binding */ exists),
/* harmony export */   "findAnswers": () => (/* binding */ findAnswers),
/* harmony export */   "findObject": () => (/* binding */ findObject),
/* harmony export */   "generateSecuredApiKey": () => (/* binding */ generateSecuredApiKey),
/* harmony export */   "getApiKey": () => (/* binding */ getApiKey),
/* harmony export */   "getAppTask": () => (/* binding */ getAppTask),
/* harmony export */   "getDictionarySettings": () => (/* binding */ getDictionarySettings),
/* harmony export */   "getLogs": () => (/* binding */ getLogs),
/* harmony export */   "getObject": () => (/* binding */ getObject),
/* harmony export */   "getObjectPosition": () => (/* binding */ getObjectPosition),
/* harmony export */   "getObjects": () => (/* binding */ getObjects),
/* harmony export */   "getRule": () => (/* binding */ getRule),
/* harmony export */   "getSecuredApiKeyRemainingValidity": () => (/* binding */ getSecuredApiKeyRemainingValidity),
/* harmony export */   "getSettings": () => (/* binding */ getSettings),
/* harmony export */   "getSynonym": () => (/* binding */ getSynonym),
/* harmony export */   "getTask": () => (/* binding */ getTask),
/* harmony export */   "getTopUserIDs": () => (/* binding */ getTopUserIDs),
/* harmony export */   "getUserID": () => (/* binding */ getUserID),
/* harmony export */   "hasPendingMappings": () => (/* binding */ hasPendingMappings),
/* harmony export */   "initIndex": () => (/* binding */ initIndex),
/* harmony export */   "listApiKeys": () => (/* binding */ listApiKeys),
/* harmony export */   "listClusters": () => (/* binding */ listClusters),
/* harmony export */   "listIndices": () => (/* binding */ listIndices),
/* harmony export */   "listUserIDs": () => (/* binding */ listUserIDs),
/* harmony export */   "moveIndex": () => (/* binding */ moveIndex),
/* harmony export */   "multipleBatch": () => (/* binding */ multipleBatch),
/* harmony export */   "multipleGetObjects": () => (/* binding */ multipleGetObjects),
/* harmony export */   "multipleQueries": () => (/* binding */ multipleQueries),
/* harmony export */   "multipleSearchForFacetValues": () => (/* binding */ multipleSearchForFacetValues),
/* harmony export */   "partialUpdateObject": () => (/* binding */ partialUpdateObject),
/* harmony export */   "partialUpdateObjects": () => (/* binding */ partialUpdateObjects),
/* harmony export */   "removeUserID": () => (/* binding */ removeUserID),
/* harmony export */   "replaceAllObjects": () => (/* binding */ replaceAllObjects),
/* harmony export */   "replaceAllRules": () => (/* binding */ replaceAllRules),
/* harmony export */   "replaceAllSynonyms": () => (/* binding */ replaceAllSynonyms),
/* harmony export */   "replaceDictionaryEntries": () => (/* binding */ replaceDictionaryEntries),
/* harmony export */   "restoreApiKey": () => (/* binding */ restoreApiKey),
/* harmony export */   "saveDictionaryEntries": () => (/* binding */ saveDictionaryEntries),
/* harmony export */   "saveObject": () => (/* binding */ saveObject),
/* harmony export */   "saveObjects": () => (/* binding */ saveObjects),
/* harmony export */   "saveRule": () => (/* binding */ saveRule),
/* harmony export */   "saveRules": () => (/* binding */ saveRules),
/* harmony export */   "saveSynonym": () => (/* binding */ saveSynonym),
/* harmony export */   "saveSynonyms": () => (/* binding */ saveSynonyms),
/* harmony export */   "search": () => (/* binding */ search),
/* harmony export */   "searchDictionaryEntries": () => (/* binding */ searchDictionaryEntries),
/* harmony export */   "searchForFacetValues": () => (/* binding */ searchForFacetValues),
/* harmony export */   "searchRules": () => (/* binding */ searchRules),
/* harmony export */   "searchSynonyms": () => (/* binding */ searchSynonyms),
/* harmony export */   "searchUserIDs": () => (/* binding */ searchUserIDs),
/* harmony export */   "setDictionarySettings": () => (/* binding */ setDictionarySettings),
/* harmony export */   "setSettings": () => (/* binding */ setSettings),
/* harmony export */   "updateApiKey": () => (/* binding */ updateApiKey),
/* harmony export */   "waitAppTask": () => (/* binding */ waitAppTask),
/* harmony export */   "waitTask": () => (/* binding */ waitTask)
/* harmony export */ });
/* harmony import */ var _algolia_client_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @algolia/client-common */ "./node_modules/@algolia/client-common/dist/client-common.esm.js");
/* harmony import */ var _algolia_transporter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @algolia/transporter */ "./node_modules/@algolia/transporter/dist/transporter.esm.js");
/* harmony import */ var _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @algolia/requester-common */ "./node_modules/@algolia/requester-common/dist/requester-common.esm.js");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);





function createBrowsablePromise(options) {
    const browse = (data) => {
        return options.request(data).then(response => {
            /**
             * First we send to the developer the
             * batch retrieved from the API.
             */
            if (options.batch !== undefined) {
                options.batch(response.hits);
            }
            /**
             * Then, we ask to the browse concrete implementation
             * if we should stop browsing. As example, the `browseObjects`
             * method will stop if the cursor is not present on the response.
             */
            if (options.shouldStop(response)) {
                return undefined;
            }
            /**
             * Finally, if the response contains a cursor, we browse to the next
             * batch using that same cursor. Otherwise, we just use the traditional
             * browsing using the page element.
             */
            if (response.cursor) {
                return browse({
                    cursor: response.cursor,
                });
            }
            return browse({
                page: (data.page || 0) + 1,
            });
        });
    };
    return browse({});
}

const createSearchClient = options => {
    const appId = options.appId;
    const auth = (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createAuth)(options.authMode !== undefined ? options.authMode : _algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.AuthMode.WithinHeaders, appId, options.apiKey);
    const transporter = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createTransporter)({
        hosts: [
            { url: `${appId}-dsn.algolia.net`, accept: _algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.CallEnum.Read },
            { url: `${appId}.algolia.net`, accept: _algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.CallEnum.Write },
        ].concat((0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.shuffle)([
            { url: `${appId}-1.algolianet.com` },
            { url: `${appId}-2.algolianet.com` },
            { url: `${appId}-3.algolianet.com` },
        ])),
        ...options,
        headers: {
            ...auth.headers(),
            ...{ 'content-type': 'application/x-www-form-urlencoded' },
            ...options.headers,
        },
        queryParameters: {
            ...auth.queryParameters(),
            ...options.queryParameters,
        },
    });
    const base = {
        transporter,
        appId,
        addAlgoliaAgent(segment, version) {
            transporter.userAgent.add({ segment, version });
        },
        clearCache() {
            return Promise.all([
                transporter.requestsCache.clear(),
                transporter.responsesCache.clear(),
            ]).then(() => undefined);
        },
    };
    return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.addMethods)(base, options.methods);
};

function createMissingObjectIDError() {
    return {
        name: 'MissingObjectIDError',
        message: 'All objects must have an unique objectID ' +
            '(like a primary key) to be valid. ' +
            'Algolia is also able to generate objectIDs ' +
            "automatically but *it's not recommended*. " +
            "To do it, use the `{'autoGenerateObjectIDIfNotExist': true}` option.",
    };
}

function createObjectNotFoundError() {
    return {
        name: 'ObjectNotFoundError',
        message: 'Object not found.',
    };
}

function createValidUntilNotFoundError() {
    return {
        name: 'ValidUntilNotFoundError',
        message: 'ValidUntil not found in given secured api key.',
    };
}

const addApiKey = (base) => {
    return (acl, requestOptions) => {
        const { queryParameters, ...options } = requestOptions || {};
        const data = {
            acl,
            ...(queryParameters !== undefined ? { queryParameters } : {}),
        };
        const wait = (response, waitRequestOptions) => {
            return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createRetryablePromise)(retry => {
                return getApiKey(base)(response.key, waitRequestOptions).catch((apiError) => {
                    if (apiError.status !== 404) {
                        throw apiError;
                    }
                    return retry();
                });
            });
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: '1/keys',
            data,
        }, options), wait);
    };
};

const assignUserID = (base) => {
    return (userID, clusterName, requestOptions) => {
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(requestOptions);
        // eslint-disable-next-line functional/immutable-data
        mappedRequestOptions.queryParameters['X-Algolia-User-ID'] = userID;
        return base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: '1/clusters/mapping',
            data: { cluster: clusterName },
        }, mappedRequestOptions);
    };
};

const assignUserIDs = (base) => {
    return (userIDs, clusterName, requestOptions) => {
        return base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: '1/clusters/mapping/batch',
            data: {
                users: userIDs,
                cluster: clusterName,
            },
        }, requestOptions);
    };
};

const clearDictionaryEntries = (base) => {
    return (dictionary, requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('/1/dictionaries/%s/batch', dictionary),
            data: {
                clearExistingDictionaryEntries: true,
                requests: { action: 'addEntry', body: [] },
            },
        }, requestOptions), (response, waitRequestOptions) => waitAppTask(base)(response.taskID, waitRequestOptions));
    };
};

const copyIndex = (base) => {
    return (from, to, requestOptions) => {
        const wait = (response, waitRequestOptions) => {
            return initIndex(base)(from, {
                methods: { waitTask },
            }).waitTask(response.taskID, waitRequestOptions);
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/operation', from),
            data: {
                operation: 'copy',
                destination: to,
            },
        }, requestOptions), wait);
    };
};

const copyRules = (base) => {
    return (from, to, requestOptions) => {
        return copyIndex(base)(from, to, {
            ...requestOptions,
            scope: [ScopeEnum.Rules],
        });
    };
};

const copySettings = (base) => {
    return (from, to, requestOptions) => {
        return copyIndex(base)(from, to, {
            ...requestOptions,
            scope: [ScopeEnum.Settings],
        });
    };
};

const copySynonyms = (base) => {
    return (from, to, requestOptions) => {
        return copyIndex(base)(from, to, {
            ...requestOptions,
            scope: [ScopeEnum.Synonyms],
        });
    };
};

const customRequest = (base) => {
    return (request, requestOptions) => {
        if (request.method === _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get) {
            return base.transporter.read(request, requestOptions);
        }
        return base.transporter.write(request, requestOptions);
    };
};

const deleteApiKey = (base) => {
    return (apiKey, requestOptions) => {
        const wait = (_, waitRequestOptions) => {
            return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createRetryablePromise)(retry => {
                return getApiKey(base)(apiKey, waitRequestOptions)
                    .then(retry)
                    .catch((apiError) => {
                    if (apiError.status !== 404) {
                        throw apiError;
                    }
                });
            });
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Delete,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/keys/%s', apiKey),
        }, requestOptions), wait);
    };
};

const deleteDictionaryEntries = (base) => {
    return (dictionary, objectIDs, requestOptions) => {
        const requests = objectIDs.map(objectID => ({
            action: 'deleteEntry',
            body: { objectID },
        }));
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('/1/dictionaries/%s/batch', dictionary),
            data: { clearExistingDictionaryEntries: false, requests },
        }, requestOptions), (response, waitRequestOptions) => waitAppTask(base)(response.taskID, waitRequestOptions));
    };
};

const generateSecuredApiKey = () => {
    return (parentApiKey, restrictions) => {
        const queryParameters = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.serializeQueryParameters)(restrictions);
        const securedKey = (0,crypto__WEBPACK_IMPORTED_MODULE_0__.createHmac)('sha256', parentApiKey)
            .update(queryParameters)
            .digest('hex');
        return Buffer.from(securedKey + queryParameters).toString('base64');
    };
};

const getApiKey = (base) => {
    return (apiKey, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/keys/%s', apiKey),
        }, requestOptions);
    };
};

const getDictionarySettings = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: '/1/dictionaries/*/settings',
        }, requestOptions);
    };
};

const getLogs = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: '1/logs',
        }, requestOptions);
    };
};

const getSecuredApiKeyRemainingValidity = () => {
    return (securedApiKey) => {
        const decodedString = Buffer.from(securedApiKey, 'base64').toString('ascii');
        const regex = /validUntil=(\d+)/;
        const match = decodedString.match(regex);
        if (match === null) {
            throw createValidUntilNotFoundError();
        }
        return parseInt(match[1], 10) - Math.round(new Date().getTime() / 1000);
    };
};

const getTopUserIDs = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: '1/clusters/mapping/top',
        }, requestOptions);
    };
};

const getAppTask = (base) => {
    return (taskID, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/task/%s', taskID.toString()),
        }, requestOptions);
    };
};

const getUserID = (base) => {
    return (userID, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/clusters/mapping/%s', userID),
        }, requestOptions);
    };
};

const hasPendingMappings = (base) => {
    return (requestOptions) => {
        const { retrieveMappings, ...options } = requestOptions || {};
        if (retrieveMappings === true) {
            // eslint-disable-next-line functional/immutable-data
            options.getClusters = true;
        }
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: '1/clusters/mapping/pending',
        }, options);
    };
};

const initIndex = (base) => {
    return (indexName, options = {}) => {
        const searchIndex = {
            transporter: base.transporter,
            appId: base.appId,
            indexName,
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.addMethods)(searchIndex, options.methods);
    };
};

const listApiKeys = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: '1/keys',
        }, requestOptions);
    };
};

const listClusters = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: '1/clusters',
        }, requestOptions);
    };
};

const listIndices = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: '1/indexes',
        }, requestOptions);
    };
};

const listUserIDs = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: '1/clusters/mapping',
        }, requestOptions);
    };
};

const moveIndex = (base) => {
    return (from, to, requestOptions) => {
        const wait = (response, waitRequestOptions) => {
            return initIndex(base)(from, {
                methods: { waitTask },
            }).waitTask(response.taskID, waitRequestOptions);
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/operation', from),
            data: {
                operation: 'move',
                destination: to,
            },
        }, requestOptions), wait);
    };
};

const multipleBatch = (base) => {
    return (requests, requestOptions) => {
        const wait = (response, waitRequestOptions) => {
            return Promise.all(Object.keys(response.taskID).map(indexName => {
                return initIndex(base)(indexName, {
                    methods: { waitTask },
                }).waitTask(response.taskID[indexName], waitRequestOptions);
            }));
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: '1/indexes/*/batch',
            data: {
                requests,
            },
        }, requestOptions), wait);
    };
};

const multipleGetObjects = (base) => {
    return (requests, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: '1/indexes/*/objects',
            data: {
                requests,
            },
        }, requestOptions);
    };
};

const multipleQueries = (base) => {
    return (queries, requestOptions) => {
        const requests = queries.map(query => {
            return {
                ...query,
                params: (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.serializeQueryParameters)(query.params || {}),
            };
        });
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: '1/indexes/*/queries',
            data: {
                requests,
            },
            cacheable: true,
        }, requestOptions);
    };
};

const multipleSearchForFacetValues = (base) => {
    return (queries, requestOptions) => {
        return Promise.all(queries.map(query => {
            const { facetName, facetQuery, ...params } = query.params;
            return initIndex(base)(query.indexName, {
                methods: { searchForFacetValues },
            }).searchForFacetValues(facetName, facetQuery, {
                ...requestOptions,
                ...params,
            });
        }));
    };
};

const removeUserID = (base) => {
    return (userID, requestOptions) => {
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(requestOptions);
        // eslint-disable-next-line functional/immutable-data
        mappedRequestOptions.queryParameters['X-Algolia-User-ID'] = userID;
        return base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Delete,
            path: '1/clusters/mapping',
        }, mappedRequestOptions);
    };
};

const replaceDictionaryEntries = (base) => {
    return (dictionary, entries, requestOptions) => {
        const requests = entries.map(entry => ({
            action: 'addEntry',
            body: entry,
        }));
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('/1/dictionaries/%s/batch', dictionary),
            data: { clearExistingDictionaryEntries: true, requests },
        }, requestOptions), (response, waitRequestOptions) => waitAppTask(base)(response.taskID, waitRequestOptions));
    };
};

const restoreApiKey = (base) => {
    return (apiKey, requestOptions) => {
        const wait = (_, waitRequestOptions) => {
            return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createRetryablePromise)(retry => {
                return getApiKey(base)(apiKey, waitRequestOptions).catch((apiError) => {
                    if (apiError.status !== 404) {
                        throw apiError;
                    }
                    return retry();
                });
            });
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/keys/%s/restore', apiKey),
        }, requestOptions), wait);
    };
};

const saveDictionaryEntries = (base) => {
    return (dictionary, entries, requestOptions) => {
        const requests = entries.map(entry => ({
            action: 'addEntry',
            body: entry,
        }));
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('/1/dictionaries/%s/batch', dictionary),
            data: { clearExistingDictionaryEntries: false, requests },
        }, requestOptions), (response, waitRequestOptions) => waitAppTask(base)(response.taskID, waitRequestOptions));
    };
};

const searchDictionaryEntries = (base) => {
    return (dictionary, query, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('/1/dictionaries/%s/search', dictionary),
            data: {
                query,
            },
            cacheable: true,
        }, requestOptions);
    };
};

const searchUserIDs = (base) => {
    return (query, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: '1/clusters/mapping/search',
            data: {
                query,
            },
        }, requestOptions);
    };
};

const setDictionarySettings = (base) => {
    return (settings, requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Put,
            path: '/1/dictionaries/*/settings',
            data: settings,
        }, requestOptions), (response, waitRequestOptions) => waitAppTask(base)(response.taskID, waitRequestOptions));
    };
};

const updateApiKey = (base) => {
    return (apiKey, requestOptions) => {
        const updatedFields = Object.assign({}, requestOptions);
        const { queryParameters, ...options } = requestOptions || {};
        const data = queryParameters ? { queryParameters } : {};
        const apiKeyFields = [
            'acl',
            'indexes',
            'referers',
            'restrictSources',
            'queryParameters',
            'description',
            'maxQueriesPerIPPerHour',
            'maxHitsPerQuery',
        ];
        const hasChanged = (getApiKeyResponse) => {
            return Object.keys(updatedFields)
                .filter((updatedField) => apiKeyFields.indexOf(updatedField) !== -1)
                .every(updatedField => {
                return getApiKeyResponse[updatedField] === updatedFields[updatedField];
            });
        };
        const wait = (_, waitRequestOptions) => (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createRetryablePromise)(retry => {
            return getApiKey(base)(apiKey, waitRequestOptions).then(getApiKeyResponse => {
                return hasChanged(getApiKeyResponse) ? Promise.resolve() : retry();
            });
        });
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Put,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/keys/%s', apiKey),
            data,
        }, options), wait);
    };
};

const waitAppTask = (base) => {
    return (taskID, requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createRetryablePromise)(retry => {
            return getAppTask(base)(taskID, requestOptions).then(response => {
                return response.status !== 'published' ? retry() : undefined;
            });
        });
    };
};

const batch = (base) => {
    return (requests, requestOptions) => {
        const wait = (response, waitRequestOptions) => {
            return waitTask(base)(response.taskID, waitRequestOptions);
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/batch', base.indexName),
            data: {
                requests,
            },
        }, requestOptions), wait);
    };
};

const browseObjects = (base) => {
    return (requestOptions) => {
        return createBrowsablePromise({
            shouldStop: response => response.cursor === undefined,
            ...requestOptions,
            request: (data) => base.transporter.read({
                method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
                path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/browse', base.indexName),
                data,
            }, requestOptions),
        });
    };
};

const browseRules = (base) => {
    return (requestOptions) => {
        const options = {
            hitsPerPage: 1000,
            ...requestOptions,
        };
        return createBrowsablePromise({
            shouldStop: response => response.hits.length < options.hitsPerPage,
            ...options,
            request(data) {
                return searchRules(base)('', { ...options, ...data }).then((response) => {
                    return {
                        ...response,
                        hits: response.hits.map(rule => {
                            // eslint-disable-next-line functional/immutable-data,no-param-reassign
                            delete rule._highlightResult;
                            return rule;
                        }),
                    };
                });
            },
        });
    };
};

const browseSynonyms = (base) => {
    return (requestOptions) => {
        const options = {
            hitsPerPage: 1000,
            ...requestOptions,
        };
        return createBrowsablePromise({
            shouldStop: response => response.hits.length < options.hitsPerPage,
            ...options,
            request(data) {
                return searchSynonyms(base)('', { ...options, ...data }).then((response) => {
                    return {
                        ...response,
                        hits: response.hits.map(synonym => {
                            // eslint-disable-next-line functional/immutable-data,no-param-reassign
                            delete synonym._highlightResult;
                            return synonym;
                        }),
                    };
                });
            },
        });
    };
};

const chunkedBatch = (base) => {
    return (bodies, action, requestOptions) => {
        const { batchSize, ...options } = requestOptions || {};
        const response = {
            taskIDs: [],
            objectIDs: [],
        };
        const forEachBatch = (lastIndex = 0) => {
            // eslint-disable-next-line functional/prefer-readonly-type
            const bodiesChunk = [];
            // eslint-disable-next-line functional/no-let
            let index;
            /* eslint-disable-next-line functional/no-loop-statement */
            for (index = lastIndex; index < bodies.length; index++) {
                // eslint-disable-next-line functional/immutable-data
                bodiesChunk.push(bodies[index]);
                if (bodiesChunk.length === (batchSize || 1000)) {
                    break;
                }
            }
            if (bodiesChunk.length === 0) {
                return Promise.resolve(response);
            }
            return batch(base)(bodiesChunk.map(body => {
                return {
                    action,
                    body,
                };
            }), options).then(res => {
                response.objectIDs = response.objectIDs.concat(res.objectIDs); // eslint-disable-line functional/immutable-data
                response.taskIDs.push(res.taskID); // eslint-disable-line functional/immutable-data
                index++;
                return forEachBatch(index);
            });
        };
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(forEachBatch(), (chunkedBatchResponse, waitRequestOptions) => {
            return Promise.all(chunkedBatchResponse.taskIDs.map(taskID => {
                return waitTask(base)(taskID, waitRequestOptions);
            }));
        });
    };
};

const clearObjects = (base) => {
    return (requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/clear', base.indexName),
        }, requestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const clearRules = (base) => {
    return (requestOptions) => {
        const { forwardToReplicas, ...options } = requestOptions || {};
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(options);
        if (forwardToReplicas) {
            mappedRequestOptions.queryParameters.forwardToReplicas = 1; // eslint-disable-line functional/immutable-data
        }
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/rules/clear', base.indexName),
        }, mappedRequestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const clearSynonyms = (base) => {
    return (requestOptions) => {
        const { forwardToReplicas, ...options } = requestOptions || {};
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(options);
        if (forwardToReplicas) {
            mappedRequestOptions.queryParameters.forwardToReplicas = 1; // eslint-disable-line functional/immutable-data
        }
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/synonyms/clear', base.indexName),
        }, mappedRequestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const deleteBy = (base) => {
    return (filters, requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/deleteByQuery', base.indexName),
            data: filters,
        }, requestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const deleteIndex = (base) => {
    return (requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Delete,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s', base.indexName),
        }, requestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const deleteObject = (base) => {
    return (objectID, requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(deleteObjects(base)([objectID], requestOptions).then(response => {
            return { taskID: response.taskIDs[0] };
        }), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const deleteObjects = (base) => {
    return (objectIDs, requestOptions) => {
        const objects = objectIDs.map(objectID => {
            return { objectID };
        });
        return chunkedBatch(base)(objects, BatchActionEnum.DeleteObject, requestOptions);
    };
};

const deleteRule = (base) => {
    return (objectID, requestOptions) => {
        const { forwardToReplicas, ...options } = requestOptions || {};
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(options);
        if (forwardToReplicas) {
            mappedRequestOptions.queryParameters.forwardToReplicas = 1; // eslint-disable-line functional/immutable-data
        }
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Delete,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/rules/%s', base.indexName, objectID),
        }, mappedRequestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const deleteSynonym = (base) => {
    return (objectID, requestOptions) => {
        const { forwardToReplicas, ...options } = requestOptions || {};
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(options);
        if (forwardToReplicas) {
            mappedRequestOptions.queryParameters.forwardToReplicas = 1; // eslint-disable-line functional/immutable-data
        }
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Delete,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/synonyms/%s', base.indexName, objectID),
        }, mappedRequestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const exists = (base) => {
    return (requestOptions) => {
        return getSettings(base)(requestOptions)
            .then(() => true)
            .catch(error => {
            if (error.status !== 404) {
                throw error;
            }
            return false;
        });
    };
};

const findAnswers = (base) => {
    return (query, queryLanguages, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/answers/%s/prediction', base.indexName),
            data: {
                query,
                queryLanguages,
            },
            cacheable: true,
        }, requestOptions);
    };
};

const findObject = (base) => {
    return (callback, requestOptions) => {
        const { query, paginate, ...options } = requestOptions || {};
        // eslint-disable-next-line functional/no-let
        let page = 0;
        const forEachPage = () => {
            return search(base)(query || '', { ...options, page }).then(result => {
                // eslint-disable-next-line functional/no-loop-statement
                for (const [position, hit] of Object.entries(result.hits)) {
                    // eslint-disable-next-line promise/no-callback-in-promise
                    if (callback(hit)) {
                        return {
                            object: hit,
                            position: parseInt(position, 10),
                            page,
                        };
                    }
                }
                page++;
                // paginate if option was set and has next page
                if (paginate === false || page >= result.nbPages) {
                    throw createObjectNotFoundError();
                }
                return forEachPage();
            });
        };
        return forEachPage();
    };
};

const getObject = (base) => {
    return (objectID, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/%s', base.indexName, objectID),
        }, requestOptions);
    };
};

const getObjectPosition = () => {
    return (searchResponse, objectID) => {
        // eslint-disable-next-line functional/no-loop-statement
        for (const [position, hit] of Object.entries(searchResponse.hits)) {
            if (hit.objectID === objectID) {
                return parseInt(position, 10);
            }
        }
        return -1;
    };
};

const getObjects = (base) => {
    return (objectIDs, requestOptions) => {
        const { attributesToRetrieve, ...options } = requestOptions || {};
        const requests = objectIDs.map(objectID => {
            return {
                indexName: base.indexName,
                objectID,
                ...(attributesToRetrieve ? { attributesToRetrieve } : {}),
            };
        });
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: '1/indexes/*/objects',
            data: {
                requests,
            },
        }, options);
    };
};

const getRule = (base) => {
    return (objectID, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/rules/%s', base.indexName, objectID),
        }, requestOptions);
    };
};

const getSettings = (base) => {
    return (requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/settings', base.indexName),
            data: {
                getVersion: 2,
            },
        }, requestOptions);
    };
};

const getSynonym = (base) => {
    return (objectID, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)(`1/indexes/%s/synonyms/%s`, base.indexName, objectID),
        }, requestOptions);
    };
};

const getTask = (base) => {
    return (taskID, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Get,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/task/%s', base.indexName, taskID.toString()),
        }, requestOptions);
    };
};

const partialUpdateObject = (base) => {
    return (object, requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(partialUpdateObjects(base)([object], requestOptions).then(response => {
            return {
                objectID: response.objectIDs[0],
                taskID: response.taskIDs[0],
            };
        }), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const partialUpdateObjects = (base) => {
    return (objects, requestOptions) => {
        const { createIfNotExists, ...options } = requestOptions || {};
        const action = createIfNotExists
            ? BatchActionEnum.PartialUpdateObject
            : BatchActionEnum.PartialUpdateObjectNoCreate;
        return chunkedBatch(base)(objects, action, options);
    };
};

const replaceAllObjects = (base) => {
    return (objects, requestOptions) => {
        const { safe, autoGenerateObjectIDIfNotExist, batchSize, ...options } = requestOptions || {};
        const operation = (from, to, type, operationRequestOptions) => {
            return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
                method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
                path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/operation', from),
                data: {
                    operation: type,
                    destination: to,
                },
            }, operationRequestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
        };
        const randomSuffix = Math.random()
            .toString(36)
            .substring(7);
        const temporaryIndexName = `${base.indexName}_tmp_${randomSuffix}`;
        const saveObjectsInTemporary = saveObjects({
            appId: base.appId,
            transporter: base.transporter,
            indexName: temporaryIndexName,
        });
        // @ts-ignore
        // eslint-disable-next-line prefer-const, functional/no-let, functional/prefer-readonly-type
        let responses = [];
        const copyWaitablePromise = operation(base.indexName, temporaryIndexName, 'copy', {
            ...options,
            scope: ['settings', 'synonyms', 'rules'],
        });
        // eslint-disable-next-line functional/immutable-data
        responses.push(copyWaitablePromise);
        const result = (safe
            ? copyWaitablePromise.wait(options)
            : copyWaitablePromise)
            .then(() => {
            const saveObjectsWaitablePromise = saveObjectsInTemporary(objects, {
                ...options,
                autoGenerateObjectIDIfNotExist,
                batchSize,
            });
            // eslint-disable-next-line functional/immutable-data
            responses.push(saveObjectsWaitablePromise);
            return safe ? saveObjectsWaitablePromise.wait(options) : saveObjectsWaitablePromise;
        })
            .then(() => {
            const moveWaitablePromise = operation(temporaryIndexName, base.indexName, 'move', options);
            // eslint-disable-next-line functional/immutable-data
            responses.push(moveWaitablePromise);
            return safe ? moveWaitablePromise.wait(options) : moveWaitablePromise;
        })
            .then(() => Promise.all(responses))
            .then(([copyResponse, saveObjectsResponse, moveResponse]) => {
            return {
                objectIDs: saveObjectsResponse.objectIDs,
                taskIDs: [copyResponse.taskID, ...saveObjectsResponse.taskIDs, moveResponse.taskID],
            };
        });
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(result, (_, waitRequestOptions) => {
            return Promise.all(responses.map(response => response.wait(waitRequestOptions)));
        });
    };
};

const replaceAllRules = (base) => {
    return (rules, requestOptions) => {
        return saveRules(base)(rules, {
            ...requestOptions,
            clearExistingRules: true,
        });
    };
};

const replaceAllSynonyms = (base) => {
    return (synonyms, requestOptions) => {
        return saveSynonyms(base)(synonyms, {
            ...requestOptions,
            clearExistingSynonyms: true,
        });
    };
};

const saveObject = (base) => {
    return (object, requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(saveObjects(base)([object], requestOptions).then(response => {
            return {
                objectID: response.objectIDs[0],
                taskID: response.taskIDs[0],
            };
        }), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const saveObjects = (base) => {
    return (objects, requestOptions) => {
        const { autoGenerateObjectIDIfNotExist, ...options } = requestOptions || {};
        const action = autoGenerateObjectIDIfNotExist
            ? BatchActionEnum.AddObject
            : BatchActionEnum.UpdateObject;
        if (action === BatchActionEnum.UpdateObject) {
            // eslint-disable-next-line functional/no-loop-statement
            for (const object of objects) {
                if (object.objectID === undefined) {
                    return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(Promise.reject(createMissingObjectIDError()));
                }
            }
        }
        return chunkedBatch(base)(objects, action, options);
    };
};

const saveRule = (base) => {
    return (rule, requestOptions) => {
        return saveRules(base)([rule], requestOptions);
    };
};

const saveRules = (base) => {
    return (rules, requestOptions) => {
        const { forwardToReplicas, clearExistingRules, ...options } = requestOptions || {};
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(options);
        if (forwardToReplicas) {
            mappedRequestOptions.queryParameters.forwardToReplicas = 1; // eslint-disable-line functional/immutable-data
        }
        if (clearExistingRules) {
            mappedRequestOptions.queryParameters.clearExistingRules = 1; // eslint-disable-line functional/immutable-data
        }
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/rules/batch', base.indexName),
            data: rules,
        }, mappedRequestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const saveSynonym = (base) => {
    return (synonym, requestOptions) => {
        return saveSynonyms(base)([synonym], requestOptions);
    };
};

const saveSynonyms = (base) => {
    return (synonyms, requestOptions) => {
        const { forwardToReplicas, clearExistingSynonyms, replaceExistingSynonyms, ...options } = requestOptions || {};
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(options);
        if (forwardToReplicas) {
            mappedRequestOptions.queryParameters.forwardToReplicas = 1; // eslint-disable-line functional/immutable-data
        }
        if (replaceExistingSynonyms || clearExistingSynonyms) {
            mappedRequestOptions.queryParameters.replaceExistingSynonyms = 1; // eslint-disable-line functional/immutable-data
        }
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/synonyms/batch', base.indexName),
            data: synonyms,
        }, mappedRequestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const search = (base) => {
    return (query, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/query', base.indexName),
            data: {
                query,
            },
            cacheable: true,
        }, requestOptions);
    };
};

const searchForFacetValues = (base) => {
    return (facetName, facetQuery, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/facets/%s/query', base.indexName, facetName),
            data: {
                facetQuery,
            },
            cacheable: true,
        }, requestOptions);
    };
};

const searchRules = (base) => {
    return (query, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/rules/search', base.indexName),
            data: {
                query,
            },
        }, requestOptions);
    };
};

const searchSynonyms = (base) => {
    return (query, requestOptions) => {
        return base.transporter.read({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Post,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/synonyms/search', base.indexName),
            data: {
                query,
            },
        }, requestOptions);
    };
};

const setSettings = (base) => {
    return (settings, requestOptions) => {
        const { forwardToReplicas, ...options } = requestOptions || {};
        const mappedRequestOptions = (0,_algolia_transporter__WEBPACK_IMPORTED_MODULE_2__.createMappedRequestOptions)(options);
        if (forwardToReplicas) {
            mappedRequestOptions.queryParameters.forwardToReplicas = 1; // eslint-disable-line functional/immutable-data
        }
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createWaitablePromise)(base.transporter.write({
            method: _algolia_requester_common__WEBPACK_IMPORTED_MODULE_3__.MethodEnum.Put,
            path: (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.encode)('1/indexes/%s/settings', base.indexName),
            data: settings,
        }, mappedRequestOptions), (response, waitRequestOptions) => waitTask(base)(response.taskID, waitRequestOptions));
    };
};

const waitTask = (base) => {
    return (taskID, requestOptions) => {
        return (0,_algolia_client_common__WEBPACK_IMPORTED_MODULE_1__.createRetryablePromise)(retry => {
            return getTask(base)(taskID, requestOptions).then(response => {
                return response.status !== 'published' ? retry() : undefined;
            });
        });
    };
};

const ApiKeyACLEnum = {
    AddObject: 'addObject',
    Analytics: 'analytics',
    Browser: 'browse',
    DeleteIndex: 'deleteIndex',
    DeleteObject: 'deleteObject',
    EditSettings: 'editSettings',
    ListIndexes: 'listIndexes',
    Logs: 'logs',
    Personalization: 'personalization',
    Recommendation: 'recommendation',
    Search: 'search',
    SeeUnretrievableAttributes: 'seeUnretrievableAttributes',
    Settings: 'settings',
    Usage: 'usage',
};

const BatchActionEnum = {
    AddObject: 'addObject',
    UpdateObject: 'updateObject',
    PartialUpdateObject: 'partialUpdateObject',
    PartialUpdateObjectNoCreate: 'partialUpdateObjectNoCreate',
    DeleteObject: 'deleteObject',
    DeleteIndex: 'delete',
    ClearIndex: 'clear',
};

const ScopeEnum = {
    Settings: 'settings',
    Synonyms: 'synonyms',
    Rules: 'rules',
};

const StrategyEnum = {
    None: 'none',
    StopIfEnoughMatches: 'stopIfEnoughMatches',
};

const SynonymEnum = {
    Synonym: 'synonym',
    OneWaySynonym: 'oneWaySynonym',
    AltCorrection1: 'altCorrection1',
    AltCorrection2: 'altCorrection2',
    Placeholder: 'placeholder',
};




/***/ }),

/***/ "./node_modules/@algolia/logger-common/dist/logger-common.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@algolia/logger-common/dist/logger-common.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LogLevelEnum": () => (/* binding */ LogLevelEnum),
/* harmony export */   "createNullLogger": () => (/* binding */ createNullLogger)
/* harmony export */ });
function createNullLogger() {
    return {
        debug(_message, _args) {
            return Promise.resolve();
        },
        info(_message, _args) {
            return Promise.resolve();
        },
        error(_message, _args) {
            return Promise.resolve();
        },
    };
}

const LogLevelEnum = {
    Debug: 1,
    Info: 2,
    Error: 3,
};




/***/ }),

/***/ "./node_modules/@algolia/requester-common/dist/requester-common.esm.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@algolia/requester-common/dist/requester-common.esm.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MethodEnum": () => (/* binding */ MethodEnum)
/* harmony export */ });
const MethodEnum = {
    Delete: 'DELETE',
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
};




/***/ }),

/***/ "./node_modules/@algolia/requester-node-http/dist/requester-node-http.esm.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@algolia/requester-node-http/dist/requester-node-http.esm.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createNodeHttpRequester": () => (/* binding */ createNodeHttpRequester)
/* harmony export */ });
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! https */ "https");
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(https__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);






/* eslint functional/prefer-readonly-type: 0 */
const agentOptions = { keepAlive: true };
const defaultHttpAgent = new http__WEBPACK_IMPORTED_MODULE_0__.Agent(agentOptions);
const defaultHttpsAgent = new https__WEBPACK_IMPORTED_MODULE_1__.Agent(agentOptions);
function createNodeHttpRequester({ agent: userGlobalAgent, httpAgent: userHttpAgent, httpsAgent: userHttpsAgent, requesterOptions = {}, } = {}) {
    const httpAgent = userHttpAgent || userGlobalAgent || defaultHttpAgent;
    const httpsAgent = userHttpsAgent || userGlobalAgent || defaultHttpsAgent;
    return {
        send(request) {
            return new Promise(resolve => {
                const url = (0,url__WEBPACK_IMPORTED_MODULE_2__.parse)(request.url);
                const path = url.query === null ? url.pathname : `${url.pathname}?${url.query}`;
                const options = {
                    ...requesterOptions,
                    agent: url.protocol === 'https:' ? httpsAgent : httpAgent,
                    hostname: url.hostname,
                    path,
                    method: request.method,
                    headers: {
                        ...(requesterOptions && requesterOptions.headers ? requesterOptions.headers : {}),
                        ...request.headers,
                    },
                    ...(url.port !== undefined ? { port: url.port || '' } : {}),
                };
                const req = (url.protocol === 'https:' ? https__WEBPACK_IMPORTED_MODULE_1__ : http__WEBPACK_IMPORTED_MODULE_0__).request(options, response => {
                    // eslint-disable-next-line functional/no-let
                    let contentBuffers = [];
                    response.on('data', chunk => {
                        contentBuffers = contentBuffers.concat(chunk);
                    });
                    response.on('end', () => {
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        clearTimeout(connectTimeout);
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        clearTimeout(responseTimeout);
                        resolve({
                            status: response.statusCode || 0,
                            content: Buffer.concat(contentBuffers).toString(),
                            isTimedOut: false,
                        });
                    });
                });
                const createTimeout = (timeout, content) => {
                    return setTimeout(() => {
                        req.abort();
                        resolve({
                            status: 0,
                            content,
                            isTimedOut: true,
                        });
                    }, timeout * 1000);
                };
                const connectTimeout = createTimeout(request.connectTimeout, 'Connection timeout');
                // eslint-disable-next-line functional/no-let
                let responseTimeout;
                req.on('error', error => {
                    clearTimeout(connectTimeout);
                    clearTimeout(responseTimeout);
                    resolve({ status: 0, content: error.message, isTimedOut: false });
                });
                req.once('response', () => {
                    clearTimeout(connectTimeout);
                    responseTimeout = createTimeout(request.responseTimeout, 'Socket timeout');
                });
                if (request.data !== undefined) {
                    req.write(request.data);
                }
                req.end();
            });
        },
        destroy() {
            httpAgent.destroy();
            httpsAgent.destroy();
            return Promise.resolve();
        },
    };
}




/***/ }),

/***/ "./node_modules/@algolia/transporter/dist/transporter.esm.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@algolia/transporter/dist/transporter.esm.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CallEnum": () => (/* binding */ CallEnum),
/* harmony export */   "HostStatusEnum": () => (/* binding */ HostStatusEnum),
/* harmony export */   "createApiError": () => (/* binding */ createApiError),
/* harmony export */   "createDeserializationError": () => (/* binding */ createDeserializationError),
/* harmony export */   "createMappedRequestOptions": () => (/* binding */ createMappedRequestOptions),
/* harmony export */   "createRetryError": () => (/* binding */ createRetryError),
/* harmony export */   "createStatefulHost": () => (/* binding */ createStatefulHost),
/* harmony export */   "createStatelessHost": () => (/* binding */ createStatelessHost),
/* harmony export */   "createTransporter": () => (/* binding */ createTransporter),
/* harmony export */   "createUserAgent": () => (/* binding */ createUserAgent),
/* harmony export */   "deserializeFailure": () => (/* binding */ deserializeFailure),
/* harmony export */   "deserializeSuccess": () => (/* binding */ deserializeSuccess),
/* harmony export */   "isStatefulHostTimeouted": () => (/* binding */ isStatefulHostTimeouted),
/* harmony export */   "isStatefulHostUp": () => (/* binding */ isStatefulHostUp),
/* harmony export */   "serializeData": () => (/* binding */ serializeData),
/* harmony export */   "serializeHeaders": () => (/* binding */ serializeHeaders),
/* harmony export */   "serializeQueryParameters": () => (/* binding */ serializeQueryParameters),
/* harmony export */   "serializeUrl": () => (/* binding */ serializeUrl),
/* harmony export */   "stackFrameWithoutCredentials": () => (/* binding */ stackFrameWithoutCredentials),
/* harmony export */   "stackTraceWithoutCredentials": () => (/* binding */ stackTraceWithoutCredentials)
/* harmony export */ });
/* harmony import */ var _algolia_requester_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @algolia/requester-common */ "./node_modules/@algolia/requester-common/dist/requester-common.esm.js");


function createMappedRequestOptions(requestOptions, timeout) {
    const options = requestOptions || {};
    const data = options.data || {};
    Object.keys(options).forEach(key => {
        if (['timeout', 'headers', 'queryParameters', 'data', 'cacheable'].indexOf(key) === -1) {
            data[key] = options[key]; // eslint-disable-line functional/immutable-data
        }
    });
    return {
        data: Object.entries(data).length > 0 ? data : undefined,
        timeout: options.timeout || timeout,
        headers: options.headers || {},
        queryParameters: options.queryParameters || {},
        cacheable: options.cacheable,
    };
}

const CallEnum = {
    /**
     * If the host is read only.
     */
    Read: 1,
    /**
     * If the host is write only.
     */
    Write: 2,
    /**
     * If the host is both read and write.
     */
    Any: 3,
};

const HostStatusEnum = {
    Up: 1,
    Down: 2,
    Timeouted: 3,
};

// By default, API Clients at Algolia have expiration delay
// of 5 mins. In the JavaScript client, we have 2 mins.
const EXPIRATION_DELAY = 2 * 60 * 1000;
function createStatefulHost(host, status = HostStatusEnum.Up) {
    return {
        ...host,
        status,
        lastUpdate: Date.now(),
    };
}
function isStatefulHostUp(host) {
    return host.status === HostStatusEnum.Up || Date.now() - host.lastUpdate > EXPIRATION_DELAY;
}
function isStatefulHostTimeouted(host) {
    return (host.status === HostStatusEnum.Timeouted && Date.now() - host.lastUpdate <= EXPIRATION_DELAY);
}

function createStatelessHost(options) {
    if (typeof options === 'string') {
        return {
            protocol: 'https',
            url: options,
            accept: CallEnum.Any,
        };
    }
    return {
        protocol: options.protocol || 'https',
        url: options.url,
        accept: options.accept || CallEnum.Any,
    };
}

function createRetryableOptions(hostsCache, statelessHosts) {
    return Promise.all(statelessHosts.map(statelessHost => {
        return hostsCache.get(statelessHost, () => {
            return Promise.resolve(createStatefulHost(statelessHost));
        });
    })).then(statefulHosts => {
        const hostsUp = statefulHosts.filter(host => isStatefulHostUp(host));
        const hostsTimeouted = statefulHosts.filter(host => isStatefulHostTimeouted(host));
        /**
         * Note, we put the hosts that previously timeouted on the end of the list.
         */
        const hostsAvailable = [...hostsUp, ...hostsTimeouted];
        const statelessHostsAvailable = hostsAvailable.length > 0
            ? hostsAvailable.map(host => createStatelessHost(host))
            : statelessHosts;
        return {
            getTimeout(timeoutsCount, baseTimeout) {
                /**
                 * Imagine that you have 4 hosts, if timeouts will increase
                 * on the following way: 1 (timeouted) > 4 (timeouted) > 5 (200)
                 *
                 * Note that, the very next request, we start from the previous timeout
                 *
                 *  5 (timeouted) > 6 (timeouted) > 7 ...
                 *
                 * This strategy may need to be reviewed, but is the strategy on the our
                 * current v3 version.
                 */
                const timeoutMultiplier = hostsTimeouted.length === 0 && timeoutsCount === 0
                    ? 1
                    : hostsTimeouted.length + 3 + timeoutsCount;
                return timeoutMultiplier * baseTimeout;
            },
            statelessHosts: statelessHostsAvailable,
        };
    });
}

const isNetworkError = ({ isTimedOut, status }) => {
    return !isTimedOut && ~~status === 0;
};
const isRetryable = (response) => {
    const status = response.status;
    const isTimedOut = response.isTimedOut;
    return (isTimedOut || isNetworkError(response) || (~~(status / 100) !== 2 && ~~(status / 100) !== 4));
};
const isSuccess = ({ status }) => {
    return ~~(status / 100) === 2;
};
const retryDecision = (response, outcomes) => {
    if (isRetryable(response)) {
        return outcomes.onRetry(response);
    }
    if (isSuccess(response)) {
        return outcomes.onSuccess(response);
    }
    return outcomes.onFail(response);
};

function retryableRequest(transporter, statelessHosts, request, requestOptions) {
    const stackTrace = []; // eslint-disable-line functional/prefer-readonly-type
    /**
     * First we prepare the payload that do not depend from hosts.
     */
    const data = serializeData(request, requestOptions);
    const headers = serializeHeaders(transporter, requestOptions);
    const method = request.method;
    // On `GET`, the data is proxied to query parameters.
    const dataQueryParameters = request.method !== _algolia_requester_common__WEBPACK_IMPORTED_MODULE_0__.MethodEnum.Get
        ? {}
        : {
            ...request.data,
            ...requestOptions.data,
        };
    const queryParameters = {
        'x-algolia-agent': transporter.userAgent.value,
        ...transporter.queryParameters,
        ...dataQueryParameters,
        ...requestOptions.queryParameters,
    };
    let timeoutsCount = 0; // eslint-disable-line functional/no-let
    const retry = (hosts, // eslint-disable-line functional/prefer-readonly-type
    getTimeout) => {
        /**
         * We iterate on each host, until there is no host left.
         */
        const host = hosts.pop(); // eslint-disable-line functional/immutable-data
        if (host === undefined) {
            throw createRetryError(stackTraceWithoutCredentials(stackTrace));
        }
        const payload = {
            data,
            headers,
            method,
            url: serializeUrl(host, request.path, queryParameters),
            connectTimeout: getTimeout(timeoutsCount, transporter.timeouts.connect),
            responseTimeout: getTimeout(timeoutsCount, requestOptions.timeout),
        };
        /**
         * The stackFrame is pushed to the stackTrace so we
         * can have information about onRetry and onFailure
         * decisions.
         */
        const pushToStackTrace = (response) => {
            const stackFrame = {
                request: payload,
                response,
                host,
                triesLeft: hosts.length,
            };
            // eslint-disable-next-line functional/immutable-data
            stackTrace.push(stackFrame);
            return stackFrame;
        };
        const decisions = {
            onSuccess: response => deserializeSuccess(response),
            onRetry(response) {
                const stackFrame = pushToStackTrace(response);
                /**
                 * If response is a timeout, we increaset the number of
                 * timeouts so we can increase the timeout later.
                 */
                if (response.isTimedOut) {
                    timeoutsCount++;
                }
                return Promise.all([
                    /**
                     * Failures are individually send the logger, allowing
                     * the end user to debug / store stack frames even
                     * when a retry error does not happen.
                     */
                    transporter.logger.info('Retryable failure', stackFrameWithoutCredentials(stackFrame)),
                    /**
                     * We also store the state of the host in failure cases. If the host, is
                     * down it will remain down for the next 2 minutes. In a timeout situation,
                     * this host will be added end of the list of hosts on the next request.
                     */
                    transporter.hostsCache.set(host, createStatefulHost(host, response.isTimedOut ? HostStatusEnum.Timeouted : HostStatusEnum.Down)),
                ]).then(() => retry(hosts, getTimeout));
            },
            onFail(response) {
                pushToStackTrace(response);
                throw deserializeFailure(response, stackTraceWithoutCredentials(stackTrace));
            },
        };
        return transporter.requester.send(payload).then(response => {
            return retryDecision(response, decisions);
        });
    };
    /**
     * Finally, for each retryable host perform request until we got a non
     * retryable response. Some notes here:
     *
     * 1. The reverse here is applied so we can apply a `pop` later on => more performant.
     * 2. We also get from the retryable options a timeout multiplier that is tailored
     * for the current context.
     */
    return createRetryableOptions(transporter.hostsCache, statelessHosts).then(options => {
        return retry([...options.statelessHosts].reverse(), options.getTimeout);
    });
}

function createTransporter(options) {
    const { hostsCache, logger, requester, requestsCache, responsesCache, timeouts, userAgent, hosts, queryParameters, headers, } = options;
    const transporter = {
        hostsCache,
        logger,
        requester,
        requestsCache,
        responsesCache,
        timeouts,
        userAgent,
        headers,
        queryParameters,
        hosts: hosts.map(host => createStatelessHost(host)),
        read(request, requestOptions) {
            /**
             * First, we compute the user request options. Now, keep in mind,
             * that using request options the user is able to modified the intire
             * payload of the request. Such as headers, query parameters, and others.
             */
            const mappedRequestOptions = createMappedRequestOptions(requestOptions, transporter.timeouts.read);
            const createRetryableRequest = () => {
                /**
                 * Then, we prepare a function factory that contains the construction of
                 * the retryable request. At this point, we may *not* perform the actual
                 * request. But we want to have the function factory ready.
                 */
                return retryableRequest(transporter, transporter.hosts.filter(host => (host.accept & CallEnum.Read) !== 0), request, mappedRequestOptions);
            };
            /**
             * Once we have the function factory ready, we need to determine of the
             * request is "cacheable" - should be cached. Note that, once again,
             * the user can force this option.
             */
            const cacheable = mappedRequestOptions.cacheable !== undefined
                ? mappedRequestOptions.cacheable
                : request.cacheable;
            /**
             * If is not "cacheable", we immediatly trigger the retryable request, no
             * need to check cache implementations.
             */
            if (cacheable !== true) {
                return createRetryableRequest();
            }
            /**
             * If the request is "cacheable", we need to first compute the key to ask
             * the cache implementations if this request is on progress or if the
             * response already exists on the cache.
             */
            const key = {
                request,
                mappedRequestOptions,
                transporter: {
                    queryParameters: transporter.queryParameters,
                    headers: transporter.headers,
                },
            };
            /**
             * With the computed key, we first ask the responses cache
             * implemention if this request was been resolved before.
             */
            return transporter.responsesCache.get(key, () => {
                /**
                 * If the request has never resolved before, we actually ask if there
                 * is a current request with the same key on progress.
                 */
                return transporter.requestsCache.get(key, () => {
                    return (transporter.requestsCache
                        /**
                         * Finally, if there is no request in progress with the same key,
                         * this `createRetryableRequest()` will actually trigger the
                         * retryable request.
                         */
                        .set(key, createRetryableRequest())
                        .then(response => Promise.all([transporter.requestsCache.delete(key), response]), err => Promise.all([transporter.requestsCache.delete(key), Promise.reject(err)]))
                        .then(([_, response]) => response));
                });
            }, {
                /**
                 * Of course, once we get this response back from the server, we
                 * tell response cache to actually store the received response
                 * to be used later.
                 */
                miss: response => transporter.responsesCache.set(key, response),
            });
        },
        write(request, requestOptions) {
            /**
             * On write requests, no cache mechanisms are applied, and we
             * proxy the request immediately to the requester.
             */
            return retryableRequest(transporter, transporter.hosts.filter(host => (host.accept & CallEnum.Write) !== 0), request, createMappedRequestOptions(requestOptions, transporter.timeouts.write));
        },
    };
    return transporter;
}

function createUserAgent(version) {
    const userAgent = {
        value: `Algolia for JavaScript (${version})`,
        add(options) {
            const addedUserAgent = `; ${options.segment}${options.version !== undefined ? ` (${options.version})` : ''}`;
            if (userAgent.value.indexOf(addedUserAgent) === -1) {
                // eslint-disable-next-line functional/immutable-data
                userAgent.value = `${userAgent.value}${addedUserAgent}`;
            }
            return userAgent;
        },
    };
    return userAgent;
}

function deserializeSuccess(response) {
    // eslint-disable-next-line functional/no-try-statement
    try {
        return JSON.parse(response.content);
    }
    catch (e) {
        throw createDeserializationError(e.message, response);
    }
}
function deserializeFailure({ content, status }, stackFrame) {
    // eslint-disable-next-line functional/no-let
    let message = content;
    // eslint-disable-next-line functional/no-try-statement
    try {
        message = JSON.parse(content).message;
    }
    catch (e) {
        // ..
    }
    return createApiError(message, status, stackFrame);
}

// eslint-disable-next-line functional/prefer-readonly-type
function encode(format, ...args) {
    // eslint-disable-next-line functional/no-let
    let i = 0;
    return format.replace(/%s/g, () => encodeURIComponent(args[i++]));
}

function serializeUrl(host, path, queryParameters) {
    const queryParametersAsString = serializeQueryParameters(queryParameters);
    // eslint-disable-next-line functional/no-let
    let url = `${host.protocol}://${host.url}/${path.charAt(0) === '/' ? path.substr(1) : path}`;
    if (queryParametersAsString.length) {
        url += `?${queryParametersAsString}`;
    }
    return url;
}
function serializeQueryParameters(parameters) {
    const isObjectOrArray = (value) => Object.prototype.toString.call(value) === '[object Object]' ||
        Object.prototype.toString.call(value) === '[object Array]';
    return Object.keys(parameters)
        .map(key => encode('%s=%s', key, isObjectOrArray(parameters[key]) ? JSON.stringify(parameters[key]) : parameters[key]))
        .join('&');
}
function serializeData(request, requestOptions) {
    if (request.method === _algolia_requester_common__WEBPACK_IMPORTED_MODULE_0__.MethodEnum.Get ||
        (request.data === undefined && requestOptions.data === undefined)) {
        return undefined;
    }
    const data = Array.isArray(request.data)
        ? request.data
        : { ...request.data, ...requestOptions.data };
    return JSON.stringify(data);
}
function serializeHeaders(transporter, requestOptions) {
    const headers = {
        ...transporter.headers,
        ...requestOptions.headers,
    };
    const serializedHeaders = {};
    Object.keys(headers).forEach(header => {
        const value = headers[header];
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        serializedHeaders[header.toLowerCase()] = value;
    });
    return serializedHeaders;
}

function stackTraceWithoutCredentials(stackTrace) {
    return stackTrace.map(stackFrame => stackFrameWithoutCredentials(stackFrame));
}
function stackFrameWithoutCredentials(stackFrame) {
    const modifiedHeaders = stackFrame.request.headers['x-algolia-api-key']
        ? { 'x-algolia-api-key': '*****' }
        : {};
    return {
        ...stackFrame,
        request: {
            ...stackFrame.request,
            headers: {
                ...stackFrame.request.headers,
                ...modifiedHeaders,
            },
        },
    };
}

function createApiError(message, status, transporterStackTrace) {
    return {
        name: 'ApiError',
        message,
        status,
        transporterStackTrace,
    };
}

function createDeserializationError(message, response) {
    return {
        name: 'DeserializationError',
        message,
        response,
    };
}

function createRetryError(transporterStackTrace) {
    return {
        name: 'RetryError',
        message: 'Unreachable hosts - your application id may be incorrect. If the error persists, contact support@algolia.com.',
        transporterStackTrace,
    };
}




/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "./node_modules/@emotion/is-prop-valid/dist/is-prop-valid.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/is-prop-valid/dist/is-prop-valid.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/is-prop-valid/node_modules/@emotion/memoize/dist/memoize.esm.js");


var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var index = (0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_0__["default"])(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);


/***/ }),

/***/ "./node_modules/@emotion/is-prop-valid/node_modules/@emotion/memoize/dist/memoize.esm.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@emotion/is-prop-valid/node_modules/@emotion/memoize/dist/memoize.esm.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (memoize);


/***/ }),

/***/ "./node_modules/@emotion/stylis/dist/stylis.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/@emotion/stylis/dist/stylis.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function stylis_min (W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {
                  }

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
          T(d[c]);
        } else Y = !!d | 0;
    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stylis_min);


/***/ }),

/***/ "./node_modules/@styled-icons/fa-brands/Algolia/Algolia.esm.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@styled-icons/fa-brands/Algolia/Algolia.esm.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Algolia": () => (/* binding */ Algolia),
/* harmony export */   "AlgoliaDimensions": () => (/* binding */ AlgoliaDimensions)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styled_icons_styled_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @styled-icons/styled-icon */ "./node_modules/@styled-icons/styled-icon/index.esm.js");



var Algolia = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(function (props, ref) {
  var attrs = {
    "fill": "currentColor",
    "xmlns": "http://www.w3.org/2000/svg"
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_styled_icons_styled_icon__WEBPACK_IMPORTED_MODULE_2__.StyledIconBase, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({
    iconAttrs: attrs,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 448 512"
  }, props, {
    ref: ref
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("path", {
    fill: "currentColor",
    d: "M229.3 182.6c-49.3 0-89.2 39.9-89.2 89.2 0 49.3 39.9 89.2 89.2 89.2s89.2-39.9 89.2-89.2c0-49.3-40-89.2-89.2-89.2zm62.7 56.6-58.9 30.6c-1.8.9-3.8-.4-3.8-2.3V201c0-1.5 1.3-2.7 2.7-2.6 26.2 1 48.9 15.7 61.1 37.1.7 1.3.2 3-1.1 3.7zM389.1 32H58.9C26.4 32 0 58.4 0 90.9V421c0 32.6 26.4 59 58.9 59H389c32.6 0 58.9-26.4 58.9-58.9V90.9C448 58.4 421.6 32 389.1 32zm-202.6 84.7c0-10.8 8.7-19.5 19.5-19.5h45.3c10.8 0 19.5 8.7 19.5 19.5v15.4c0 1.8-1.7 3-3.3 2.5-12.3-3.4-25.1-5.1-38.1-5.1-13.5 0-26.7 1.8-39.4 5.5-1.7.5-3.4-.8-3.4-2.5v-15.8zm-84.4 37 9.2-9.2c7.6-7.6 19.9-7.6 27.5 0l7.7 7.7c1.1 1.1 1 3-.3 4-6.2 4.5-12.1 9.4-17.6 14.9-5.4 5.4-10.4 11.3-14.8 17.4-1 1.3-2.9 1.5-4 .3l-7.7-7.7c-7.6-7.5-7.6-19.8 0-27.4zm127.2 244.8c-70 0-126.6-56.7-126.6-126.6s56.7-126.6 126.6-126.6c70 0 126.6 56.6 126.6 126.6 0 69.8-56.7 126.6-126.6 126.6z"
  }));
});
Algolia.displayName = 'Algolia';
var AlgoliaDimensions = {
  height: 512,
  width: 448
};

/***/ }),

/***/ "./node_modules/@styled-icons/fa-solid/Search/Search.esm.js":
/*!******************************************************************!*\
  !*** ./node_modules/@styled-icons/fa-solid/Search/Search.esm.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Search": () => (/* binding */ Search),
/* harmony export */   "SearchDimensions": () => (/* binding */ SearchDimensions)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styled_icons_styled_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @styled-icons/styled-icon */ "./node_modules/@styled-icons/styled-icon/index.esm.js");



var Search = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(function (props, ref) {
  var attrs = {
    "fill": "currentColor",
    "xmlns": "http://www.w3.org/2000/svg"
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_styled_icons_styled_icon__WEBPACK_IMPORTED_MODULE_2__.StyledIconBase, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({
    iconAttrs: attrs,
    iconVerticalAlign: "middle",
    iconViewBox: "0 0 512 512"
  }, props, {
    ref: ref
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("path", {
    fill: "currentColor",
    d: "M505 442.7 405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
  }));
});
Search.displayName = 'Search';
var SearchDimensions = {
  height: 512,
  width: 512
};

/***/ }),

/***/ "./node_modules/@styled-icons/styled-icon/index.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@styled-icons/styled-icon/index.esm.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StyledIconBase": () => (/* binding */ StyledIconBase)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.esm.js");
/* harmony import */ var _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/is-prop-valid */ "./node_modules/@emotion/is-prop-valid/dist/is-prop-valid.esm.js");




function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }





function isValidProp(key) {
  return (0,_emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_4__["default"])(key);
}

function filterSVGProps(props) {
  return Object.keys(props).reduce(function (p, k) {
    if (isValidProp(k)) {
      // hack to satisfy TypeScript complexity
      ;
      p[k] = props[k];
    }

    return p;
  }, {});
}

var StyledIconBaseBase = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.forwardRef(function (props, ref) {
  var children = props.children,
      iconAttrs = props.iconAttrs,
      iconVerticalAlign = props.iconVerticalAlign,
      iconViewBox = props.iconViewBox,
      size = props.size,
      title = props.title,
      otherProps = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2___default()(props, ["children", "iconAttrs", "iconVerticalAlign", "iconViewBox", "size", "title"]);

  var iconProps = _objectSpread({
    viewBox: iconViewBox,
    height: props.height !== undefined ? props.height : size,
    width: props.width !== undefined ? props.width : size,
    'aria-hidden': title == null ? 'true' : undefined,
    focusable: 'false',
    role: title != null ? 'img' : undefined
  }, iconAttrs);

  var svgProps = filterSVGProps(otherProps);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("svg", _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, iconProps, svgProps, {
    ref: ref
  }), title && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("title", {
    key: "icon-title"
  }, title), children);
});
var StyledIconBase = /*#__PURE__*/(0,styled_components__WEBPACK_IMPORTED_MODULE_5__["default"])(StyledIconBaseBase).withConfig({
  displayName: "StyledIconBase",
  componentId: "ea9ulj-0"
})(["display:inline-block;vertical-align:", ";overflow:hidden;"], function (props) {
  return props.iconVerticalAlign;
});

/***/ }),

/***/ "./node_modules/algoliasearch-helper/index.js":
/*!****************************************************!*\
  !*** ./node_modules/algoliasearch-helper/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var AlgoliaSearchHelper = __webpack_require__(/*! ./src/algoliasearch.helper */ "./node_modules/algoliasearch-helper/src/algoliasearch.helper.js");

var SearchParameters = __webpack_require__(/*! ./src/SearchParameters */ "./node_modules/algoliasearch-helper/src/SearchParameters/index.js");
var SearchResults = __webpack_require__(/*! ./src/SearchResults */ "./node_modules/algoliasearch-helper/src/SearchResults/index.js");

/**
 * The algoliasearchHelper module is the function that will let its
 * contains everything needed to use the Algoliasearch
 * Helper. It is a also a function that instanciate the helper.
 * To use the helper, you also need the Algolia JS client v3.
 * @example
 * //using the UMD build
 * var client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');
 * var helper = algoliasearchHelper(client, 'bestbuy', {
 *   facets: ['shipping'],
 *   disjunctiveFacets: ['category']
 * });
 * helper.on('result', function(event) {
 *   console.log(event.results);
 * });
 * helper
 *   .toggleFacetRefinement('category', 'Movies & TV Shows')
 *   .toggleFacetRefinement('shipping', 'Free shipping')
 *   .search();
 * @example
 * // The helper is an event emitter using the node API
 * helper.on('result', updateTheResults);
 * helper.once('result', updateTheResults);
 * helper.removeListener('result', updateTheResults);
 * helper.removeAllListeners('result');
 * @module algoliasearchHelper
 * @param  {AlgoliaSearch} client an AlgoliaSearch client
 * @param  {string} index the name of the index to query
 * @param  {SearchParameters|object} opts an object defining the initial config of the search. It doesn't have to be a {SearchParameters}, just an object containing the properties you need from it.
 * @return {AlgoliaSearchHelper}
 */
function algoliasearchHelper(client, index, opts) {
  return new AlgoliaSearchHelper(client, index, opts);
}

/**
 * The version currently used
 * @member module:algoliasearchHelper.version
 * @type {number}
 */
algoliasearchHelper.version = __webpack_require__(/*! ./src/version.js */ "./node_modules/algoliasearch-helper/src/version.js");

/**
 * Constructor for the Helper.
 * @member module:algoliasearchHelper.AlgoliaSearchHelper
 * @type {AlgoliaSearchHelper}
 */
algoliasearchHelper.AlgoliaSearchHelper = AlgoliaSearchHelper;

/**
 * Constructor for the object containing all the parameters of the search.
 * @member module:algoliasearchHelper.SearchParameters
 * @type {SearchParameters}
 */
algoliasearchHelper.SearchParameters = SearchParameters;

/**
 * Constructor for the object containing the results of the search.
 * @member module:algoliasearchHelper.SearchResults
 * @type {SearchResults}
 */
algoliasearchHelper.SearchResults = SearchResults;

module.exports = algoliasearchHelper;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/DerivedHelper/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/DerivedHelper/index.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var events = __webpack_require__(/*! events */ "events");
var inherits = __webpack_require__(/*! ../functions/inherits */ "./node_modules/algoliasearch-helper/src/functions/inherits.js");

/**
 * A DerivedHelper is a way to create sub requests to
 * Algolia from a main helper.
 * @class
 * @classdesc The DerivedHelper provides an event based interface for search callbacks:
 *  - search: when a search is triggered using the `search()` method.
 *  - result: when the response is retrieved from Algolia and is processed.
 *    This event contains a {@link SearchResults} object and the
 *    {@link SearchParameters} corresponding to this answer.
 */
function DerivedHelper(mainHelper, fn) {
  this.main = mainHelper;
  this.fn = fn;
  this.lastResults = null;
}

inherits(DerivedHelper, events.EventEmitter);

/**
 * Detach this helper from the main helper
 * @return {undefined}
 * @throws Error if the derived helper is already detached
 */
DerivedHelper.prototype.detach = function() {
  this.removeAllListeners();
  this.main.detachDerivedHelper(this);
};

DerivedHelper.prototype.getModifiedState = function(parameters) {
  return this.fn(parameters);
};

module.exports = DerivedHelper;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/SearchParameters/RefinementList.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/SearchParameters/RefinementList.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Functions to manipulate refinement lists
 *
 * The RefinementList is not formally defined through a prototype but is based
 * on a specific structure.
 *
 * @module SearchParameters.refinementList
 *
 * @typedef {string[]} SearchParameters.refinementList.Refinements
 * @typedef {Object.<string, SearchParameters.refinementList.Refinements>} SearchParameters.refinementList.RefinementList
 */

var defaultsPure = __webpack_require__(/*! ../functions/defaultsPure */ "./node_modules/algoliasearch-helper/src/functions/defaultsPure.js");
var omit = __webpack_require__(/*! ../functions/omit */ "./node_modules/algoliasearch-helper/src/functions/omit.js");
var objectHasKeys = __webpack_require__(/*! ../functions/objectHasKeys */ "./node_modules/algoliasearch-helper/src/functions/objectHasKeys.js");

var lib = {
  /**
   * Adds a refinement to a RefinementList
   * @param {RefinementList} refinementList the initial list
   * @param {string} attribute the attribute to refine
   * @param {string} value the value of the refinement, if the value is not a string it will be converted
   * @return {RefinementList} a new and updated refinement list
   */
  addRefinement: function addRefinement(refinementList, attribute, value) {
    if (lib.isRefined(refinementList, attribute, value)) {
      return refinementList;
    }

    var valueAsString = '' + value;

    var facetRefinement = !refinementList[attribute] ?
      [valueAsString] :
      refinementList[attribute].concat(valueAsString);

    var mod = {};

    mod[attribute] = facetRefinement;

    return defaultsPure({}, mod, refinementList);
  },
  /**
   * Removes refinement(s) for an attribute:
   *  - if the value is specified removes the refinement for the value on the attribute
   *  - if no value is specified removes all the refinements for this attribute
   * @param {RefinementList} refinementList the initial list
   * @param {string} attribute the attribute to refine
   * @param {string} [value] the value of the refinement
   * @return {RefinementList} a new and updated refinement lst
   */
  removeRefinement: function removeRefinement(refinementList, attribute, value) {
    if (value === undefined) {
      // we use the "filter" form of clearRefinement, since it leaves empty values as-is
      // the form with a string will remove the attribute completely
      return lib.clearRefinement(refinementList, function(v, f) {
        return attribute === f;
      });
    }

    var valueAsString = '' + value;

    return lib.clearRefinement(refinementList, function(v, f) {
      return attribute === f && valueAsString === v;
    });
  },
  /**
   * Toggles the refinement value for an attribute.
   * @param {RefinementList} refinementList the initial list
   * @param {string} attribute the attribute to refine
   * @param {string} value the value of the refinement
   * @return {RefinementList} a new and updated list
   */
  toggleRefinement: function toggleRefinement(refinementList, attribute, value) {
    if (value === undefined) throw new Error('toggleRefinement should be used with a value');

    if (lib.isRefined(refinementList, attribute, value)) {
      return lib.removeRefinement(refinementList, attribute, value);
    }

    return lib.addRefinement(refinementList, attribute, value);
  },
  /**
   * Clear all or parts of a RefinementList. Depending on the arguments, three
   * kinds of behavior can happen:
   *  - if no attribute is provided: clears the whole list
   *  - if an attribute is provided as a string: clears the list for the specific attribute
   *  - if an attribute is provided as a function: discards the elements for which the function returns true
   * @param {RefinementList} refinementList the initial list
   * @param {string} [attribute] the attribute or function to discard
   * @param {string} [refinementType] optional parameter to give more context to the attribute function
   * @return {RefinementList} a new and updated refinement list
   */
  clearRefinement: function clearRefinement(refinementList, attribute, refinementType) {
    if (attribute === undefined) {
      if (!objectHasKeys(refinementList)) {
        return refinementList;
      }
      return {};
    } else if (typeof attribute === 'string') {
      return omit(refinementList, [attribute]);
    } else if (typeof attribute === 'function') {
      var hasChanged = false;

      var newRefinementList = Object.keys(refinementList).reduce(function(memo, key) {
        var values = refinementList[key] || [];
        var facetList = values.filter(function(value) {
          return !attribute(value, key, refinementType);
        });

        if (facetList.length !== values.length) {
          hasChanged = true;
        }
        memo[key] = facetList;

        return memo;
      }, {});

      if (hasChanged) return newRefinementList;
      return refinementList;
    }
  },
  /**
   * Test if the refinement value is used for the attribute. If no refinement value
   * is provided, test if the refinementList contains any refinement for the
   * given attribute.
   * @param {RefinementList} refinementList the list of refinement
   * @param {string} attribute name of the attribute
   * @param {string} [refinementValue] value of the filter/refinement
   * @return {boolean}
   */
  isRefined: function isRefined(refinementList, attribute, refinementValue) {
    var containsRefinements = !!refinementList[attribute] &&
      refinementList[attribute].length > 0;

    if (refinementValue === undefined || !containsRefinements) {
      return containsRefinements;
    }

    var refinementValueAsString = '' + refinementValue;

    return refinementList[attribute].indexOf(refinementValueAsString) !== -1;
  }
};

module.exports = lib;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/SearchParameters/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/SearchParameters/index.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var merge = __webpack_require__(/*! ../functions/merge */ "./node_modules/algoliasearch-helper/src/functions/merge.js");
var defaultsPure = __webpack_require__(/*! ../functions/defaultsPure */ "./node_modules/algoliasearch-helper/src/functions/defaultsPure.js");
var intersection = __webpack_require__(/*! ../functions/intersection */ "./node_modules/algoliasearch-helper/src/functions/intersection.js");
var find = __webpack_require__(/*! ../functions/find */ "./node_modules/algoliasearch-helper/src/functions/find.js");
var valToNumber = __webpack_require__(/*! ../functions/valToNumber */ "./node_modules/algoliasearch-helper/src/functions/valToNumber.js");
var omit = __webpack_require__(/*! ../functions/omit */ "./node_modules/algoliasearch-helper/src/functions/omit.js");
var objectHasKeys = __webpack_require__(/*! ../functions/objectHasKeys */ "./node_modules/algoliasearch-helper/src/functions/objectHasKeys.js");
var isValidUserToken = __webpack_require__(/*! ../utils/isValidUserToken */ "./node_modules/algoliasearch-helper/src/utils/isValidUserToken.js");

var RefinementList = __webpack_require__(/*! ./RefinementList */ "./node_modules/algoliasearch-helper/src/SearchParameters/RefinementList.js");

/**
 * isEqual, but only for numeric refinement values, possible values:
 * - 5
 * - [5]
 * - [[5]]
 * - [[5,5],[4]]
 */
function isEqualNumericRefinement(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every(function(el, i) {
        return isEqualNumericRefinement(b[i], el);
      })
    );
  }
  return a === b;
}

/**
 * like _.find but using deep equality to be able to use it
 * to find arrays.
 * @private
 * @param {any[]} array array to search into (elements are base or array of base)
 * @param {any} searchedValue the value we're looking for (base or array of base)
 * @return {any} the searched value or undefined
 */
function findArray(array, searchedValue) {
  return find(array, function(currentValue) {
    return isEqualNumericRefinement(currentValue, searchedValue);
  });
}

/**
 * The facet list is the structure used to store the list of values used to
 * filter a single attribute.
 * @typedef {string[]} SearchParameters.FacetList
 */

/**
 * Structure to store numeric filters with the operator as the key. The supported operators
 * are `=`, `>`, `<`, `>=`, `<=` and `!=`.
 * @typedef {Object.<string, Array.<number|number[]>>} SearchParameters.OperatorList
 */

/**
 * SearchParameters is the data structure that contains all the information
 * usable for making a search to Algolia API. It doesn't do the search itself,
 * nor does it contains logic about the parameters.
 * It is an immutable object, therefore it has been created in a way that each
 * changes does not change the object itself but returns a copy with the
 * modification.
 * This object should probably not be instantiated outside of the helper. It will
 * be provided when needed. This object is documented for reference as you'll
 * get it from events generated by the {@link AlgoliaSearchHelper}.
 * If need be, instantiate the Helper from the factory function {@link SearchParameters.make}
 * @constructor
 * @classdesc contains all the parameters of a search
 * @param {object|SearchParameters} newParameters existing parameters or partial object
 * for the properties of a new SearchParameters
 * @see SearchParameters.make
 * @example <caption>SearchParameters of the first query in
 *   <a href="http://demos.algolia.com/instant-search-demo/">the instant search demo</a></caption>
{
   "query": "",
   "disjunctiveFacets": [
      "customerReviewCount",
      "category",
      "salePrice_range",
      "manufacturer"
  ],
   "maxValuesPerFacet": 30,
   "page": 0,
   "hitsPerPage": 10,
   "facets": [
      "type",
      "shipping"
  ]
}
 */
function SearchParameters(newParameters) {
  var params = newParameters ? SearchParameters._parseNumbers(newParameters) : {};

  if (params.userToken !== undefined && !isValidUserToken(params.userToken)) {
    console.warn('[algoliasearch-helper] The `userToken` parameter is invalid. This can lead to wrong analytics.\n  - Format: [a-zA-Z0-9_-]{1,64}');
  }
  /**
   * This attribute contains the list of all the conjunctive facets
   * used. This list will be added to requested facets in the
   * [facets attribute](https://www.algolia.com/doc/rest-api/search#param-facets) sent to algolia.
   * @member {string[]}
   */
  this.facets = params.facets || [];
  /**
   * This attribute contains the list of all the disjunctive facets
   * used. This list will be added to requested facets in the
   * [facets attribute](https://www.algolia.com/doc/rest-api/search#param-facets) sent to algolia.
   * @member {string[]}
   */
  this.disjunctiveFacets = params.disjunctiveFacets || [];
  /**
   * This attribute contains the list of all the hierarchical facets
   * used. This list will be added to requested facets in the
   * [facets attribute](https://www.algolia.com/doc/rest-api/search#param-facets) sent to algolia.
   * Hierarchical facets are a sub type of disjunctive facets that
   * let you filter faceted attributes hierarchically.
   * @member {string[]|object[]}
   */
  this.hierarchicalFacets = params.hierarchicalFacets || [];

  // Refinements
  /**
   * This attribute contains all the filters that need to be
   * applied on the conjunctive facets. Each facet must be properly
   * defined in the `facets` attribute.
   *
   * The key is the name of the facet, and the `FacetList` contains all
   * filters selected for the associated facet name.
   *
   * When querying algolia, the values stored in this attribute will
   * be translated into the `facetFilters` attribute.
   * @member {Object.<string, SearchParameters.FacetList>}
   */
  this.facetsRefinements = params.facetsRefinements || {};
  /**
   * This attribute contains all the filters that need to be
   * excluded from the conjunctive facets. Each facet must be properly
   * defined in the `facets` attribute.
   *
   * The key is the name of the facet, and the `FacetList` contains all
   * filters excluded for the associated facet name.
   *
   * When querying algolia, the values stored in this attribute will
   * be translated into the `facetFilters` attribute.
   * @member {Object.<string, SearchParameters.FacetList>}
   */
  this.facetsExcludes = params.facetsExcludes || {};
  /**
   * This attribute contains all the filters that need to be
   * applied on the disjunctive facets. Each facet must be properly
   * defined in the `disjunctiveFacets` attribute.
   *
   * The key is the name of the facet, and the `FacetList` contains all
   * filters selected for the associated facet name.
   *
   * When querying algolia, the values stored in this attribute will
   * be translated into the `facetFilters` attribute.
   * @member {Object.<string, SearchParameters.FacetList>}
   */
  this.disjunctiveFacetsRefinements = params.disjunctiveFacetsRefinements || {};
  /**
   * This attribute contains all the filters that need to be
   * applied on the numeric attributes.
   *
   * The key is the name of the attribute, and the value is the
   * filters to apply to this attribute.
   *
   * When querying algolia, the values stored in this attribute will
   * be translated into the `numericFilters` attribute.
   * @member {Object.<string, SearchParameters.OperatorList>}
   */
  this.numericRefinements = params.numericRefinements || {};
  /**
   * This attribute contains all the tags used to refine the query.
   *
   * When querying algolia, the values stored in this attribute will
   * be translated into the `tagFilters` attribute.
   * @member {string[]}
   */
  this.tagRefinements = params.tagRefinements || [];
  /**
   * This attribute contains all the filters that need to be
   * applied on the hierarchical facets. Each facet must be properly
   * defined in the `hierarchicalFacets` attribute.
   *
   * The key is the name of the facet, and the `FacetList` contains all
   * filters selected for the associated facet name. The FacetList values
   * are structured as a string that contain the values for each level
   * separated by the configured separator.
   *
   * When querying algolia, the values stored in this attribute will
   * be translated into the `facetFilters` attribute.
   * @member {Object.<string, SearchParameters.FacetList>}
   */
  this.hierarchicalFacetsRefinements = params.hierarchicalFacetsRefinements || {};

  var self = this;
  Object.keys(params).forEach(function(paramName) {
    var isKeyKnown = SearchParameters.PARAMETERS.indexOf(paramName) !== -1;
    var isValueDefined = params[paramName] !== undefined;

    if (!isKeyKnown && isValueDefined) {
      self[paramName] = params[paramName];
    }
  });
}

/**
 * List all the properties in SearchParameters and therefore all the known Algolia properties
 * This doesn't contain any beta/hidden features.
 * @private
 */
SearchParameters.PARAMETERS = Object.keys(new SearchParameters());

/**
 * @private
 * @param {object} partialState full or part of a state
 * @return {object} a new object with the number keys as number
 */
SearchParameters._parseNumbers = function(partialState) {
  // Do not reparse numbers in SearchParameters, they ought to be parsed already
  if (partialState instanceof SearchParameters) return partialState;

  var numbers = {};

  var numberKeys = [
    'aroundPrecision',
    'aroundRadius',
    'getRankingInfo',
    'minWordSizefor2Typos',
    'minWordSizefor1Typo',
    'page',
    'maxValuesPerFacet',
    'distinct',
    'minimumAroundRadius',
    'hitsPerPage',
    'minProximity'
  ];

  numberKeys.forEach(function(k) {
    var value = partialState[k];
    if (typeof value === 'string') {
      var parsedValue = parseFloat(value);
      // global isNaN is ok to use here, value is only number or NaN
      numbers[k] = isNaN(parsedValue) ? value : parsedValue;
    }
  });

  // there's two formats of insideBoundingBox, we need to parse
  // the one which is an array of float geo rectangles
  if (Array.isArray(partialState.insideBoundingBox)) {
    numbers.insideBoundingBox = partialState.insideBoundingBox.map(function(geoRect) {
      if (Array.isArray(geoRect)) {
        return geoRect.map(function(value) {
          return parseFloat(value);
        });
      }
      return geoRect;
    });
  }

  if (partialState.numericRefinements) {
    var numericRefinements = {};
    Object.keys(partialState.numericRefinements).forEach(function(attribute) {
      var operators = partialState.numericRefinements[attribute] || {};
      numericRefinements[attribute] = {};
      Object.keys(operators).forEach(function(operator) {
        var values = operators[operator];
        var parsedValues = values.map(function(v) {
          if (Array.isArray(v)) {
            return v.map(function(vPrime) {
              if (typeof vPrime === 'string') {
                return parseFloat(vPrime);
              }
              return vPrime;
            });
          } else if (typeof v === 'string') {
            return parseFloat(v);
          }
          return v;
        });
        numericRefinements[attribute][operator] = parsedValues;
      });
    });
    numbers.numericRefinements = numericRefinements;
  }

  return merge({}, partialState, numbers);
};

/**
 * Factory for SearchParameters
 * @param {object|SearchParameters} newParameters existing parameters or partial
 * object for the properties of a new SearchParameters
 * @return {SearchParameters} frozen instance of SearchParameters
 */
SearchParameters.make = function makeSearchParameters(newParameters) {
  var instance = new SearchParameters(newParameters);

  var hierarchicalFacets = newParameters.hierarchicalFacets || [];
  hierarchicalFacets.forEach(function(facet) {
    if (facet.rootPath) {
      var currentRefinement = instance.getHierarchicalRefinement(facet.name);

      if (currentRefinement.length > 0 && currentRefinement[0].indexOf(facet.rootPath) !== 0) {
        instance = instance.clearRefinements(facet.name);
      }

      // get it again in case it has been cleared
      currentRefinement = instance.getHierarchicalRefinement(facet.name);
      if (currentRefinement.length === 0) {
        instance = instance.toggleHierarchicalFacetRefinement(facet.name, facet.rootPath);
      }
    }
  });

  return instance;
};

/**
 * Validates the new parameters based on the previous state
 * @param {SearchParameters} currentState the current state
 * @param {object|SearchParameters} parameters the new parameters to set
 * @return {Error|null} Error if the modification is invalid, null otherwise
 */
SearchParameters.validate = function(currentState, parameters) {
  var params = parameters || {};

  if (currentState.tagFilters && params.tagRefinements && params.tagRefinements.length > 0) {
    return new Error(
      '[Tags] Cannot switch from the managed tag API to the advanced API. It is probably ' +
      'an error, if it is really what you want, you should first clear the tags with clearTags method.');
  }

  if (currentState.tagRefinements.length > 0 && params.tagFilters) {
    return new Error(
      '[Tags] Cannot switch from the advanced tag API to the managed API. It is probably ' +
      'an error, if it is not, you should first clear the tags with clearTags method.');
  }

  if (
    currentState.numericFilters &&
    params.numericRefinements &&
    objectHasKeys(params.numericRefinements)
  ) {
    return new Error(
      "[Numeric filters] Can't switch from the advanced to the managed API. It" +
        ' is probably an error, if this is really what you want, you have to first' +
        ' clear the numeric filters.'
    );
  }

  if (objectHasKeys(currentState.numericRefinements) && params.numericFilters) {
    return new Error(
      "[Numeric filters] Can't switch from the managed API to the advanced. It" +
      ' is probably an error, if this is really what you want, you have to first' +
      ' clear the numeric filters.');
  }

  return null;
};

SearchParameters.prototype = {
  constructor: SearchParameters,

  /**
   * Remove all refinements (disjunctive + conjunctive + excludes + numeric filters)
   * @method
   * @param {undefined|string|SearchParameters.clearCallback} [attribute] optional string or function
   * - If not given, means to clear all the filters.
   * - If `string`, means to clear all refinements for the `attribute` named filter.
   * - If `function`, means to clear all the refinements that return truthy values.
   * @return {SearchParameters}
   */
  clearRefinements: function clearRefinements(attribute) {
    var patch = {
      numericRefinements: this._clearNumericRefinements(attribute),
      facetsRefinements: RefinementList.clearRefinement(
        this.facetsRefinements,
        attribute,
        'conjunctiveFacet'
      ),
      facetsExcludes: RefinementList.clearRefinement(
        this.facetsExcludes,
        attribute,
        'exclude'
      ),
      disjunctiveFacetsRefinements: RefinementList.clearRefinement(
        this.disjunctiveFacetsRefinements,
        attribute,
        'disjunctiveFacet'
      ),
      hierarchicalFacetsRefinements: RefinementList.clearRefinement(
        this.hierarchicalFacetsRefinements,
        attribute,
        'hierarchicalFacet'
      )
    };
    if (
      patch.numericRefinements === this.numericRefinements &&
      patch.facetsRefinements === this.facetsRefinements &&
      patch.facetsExcludes === this.facetsExcludes &&
      patch.disjunctiveFacetsRefinements === this.disjunctiveFacetsRefinements &&
      patch.hierarchicalFacetsRefinements === this.hierarchicalFacetsRefinements
    ) {
      return this;
    }
    return this.setQueryParameters(patch);
  },
  /**
   * Remove all the refined tags from the SearchParameters
   * @method
   * @return {SearchParameters}
   */
  clearTags: function clearTags() {
    if (this.tagFilters === undefined && this.tagRefinements.length === 0) return this;

    return this.setQueryParameters({
      tagFilters: undefined,
      tagRefinements: []
    });
  },
  /**
   * Set the index.
   * @method
   * @param {string} index the index name
   * @return {SearchParameters}
   */
  setIndex: function setIndex(index) {
    if (index === this.index) return this;

    return this.setQueryParameters({
      index: index
    });
  },
  /**
   * Query setter
   * @method
   * @param {string} newQuery value for the new query
   * @return {SearchParameters}
   */
  setQuery: function setQuery(newQuery) {
    if (newQuery === this.query) return this;

    return this.setQueryParameters({
      query: newQuery
    });
  },
  /**
   * Page setter
   * @method
   * @param {number} newPage new page number
   * @return {SearchParameters}
   */
  setPage: function setPage(newPage) {
    if (newPage === this.page) return this;

    return this.setQueryParameters({
      page: newPage
    });
  },
  /**
   * Facets setter
   * The facets are the simple facets, used for conjunctive (and) faceting.
   * @method
   * @param {string[]} facets all the attributes of the algolia records used for conjunctive faceting
   * @return {SearchParameters}
   */
  setFacets: function setFacets(facets) {
    return this.setQueryParameters({
      facets: facets
    });
  },
  /**
   * Disjunctive facets setter
   * Change the list of disjunctive (or) facets the helper chan handle.
   * @method
   * @param {string[]} facets all the attributes of the algolia records used for disjunctive faceting
   * @return {SearchParameters}
   */
  setDisjunctiveFacets: function setDisjunctiveFacets(facets) {
    return this.setQueryParameters({
      disjunctiveFacets: facets
    });
  },
  /**
   * HitsPerPage setter
   * Hits per page represents the number of hits retrieved for this query
   * @method
   * @param {number} n number of hits retrieved per page of results
   * @return {SearchParameters}
   */
  setHitsPerPage: function setHitsPerPage(n) {
    if (this.hitsPerPage === n) return this;

    return this.setQueryParameters({
      hitsPerPage: n
    });
  },
  /**
   * typoTolerance setter
   * Set the value of typoTolerance
   * @method
   * @param {string} typoTolerance new value of typoTolerance ("true", "false", "min" or "strict")
   * @return {SearchParameters}
   */
  setTypoTolerance: function setTypoTolerance(typoTolerance) {
    if (this.typoTolerance === typoTolerance) return this;

    return this.setQueryParameters({
      typoTolerance: typoTolerance
    });
  },
  /**
   * Add a numeric filter for a given attribute
   * When value is an array, they are combined with OR
   * When value is a single value, it will combined with AND
   * @method
   * @param {string} attribute attribute to set the filter on
   * @param {string} operator operator of the filter (possible values: =, >, >=, <, <=, !=)
   * @param {number | number[]} value value of the filter
   * @return {SearchParameters}
   * @example
   * // for price = 50 or 40
   * searchparameter.addNumericRefinement('price', '=', [50, 40]);
   * @example
   * // for size = 38 and 40
   * searchparameter.addNumericRefinement('size', '=', 38);
   * searchparameter.addNumericRefinement('size', '=', 40);
   */
  addNumericRefinement: function(attribute, operator, v) {
    var value = valToNumber(v);

    if (this.isNumericRefined(attribute, operator, value)) return this;

    var mod = merge({}, this.numericRefinements);

    mod[attribute] = merge({}, mod[attribute]);

    if (mod[attribute][operator]) {
      // Array copy
      mod[attribute][operator] = mod[attribute][operator].slice();
      // Add the element. Concat can't be used here because value can be an array.
      mod[attribute][operator].push(value);
    } else {
      mod[attribute][operator] = [value];
    }

    return this.setQueryParameters({
      numericRefinements: mod
    });
  },
  /**
   * Get the list of conjunctive refinements for a single facet
   * @param {string} facetName name of the attribute used for faceting
   * @return {string[]} list of refinements
   */
  getConjunctiveRefinements: function(facetName) {
    if (!this.isConjunctiveFacet(facetName)) {
      return [];
    }
    return this.facetsRefinements[facetName] || [];
  },
  /**
   * Get the list of disjunctive refinements for a single facet
   * @param {string} facetName name of the attribute used for faceting
   * @return {string[]} list of refinements
   */
  getDisjunctiveRefinements: function(facetName) {
    if (!this.isDisjunctiveFacet(facetName)) {
      return [];
    }
    return this.disjunctiveFacetsRefinements[facetName] || [];
  },
  /**
   * Get the list of hierarchical refinements for a single facet
   * @param {string} facetName name of the attribute used for faceting
   * @return {string[]} list of refinements
   */
  getHierarchicalRefinement: function(facetName) {
    // we send an array but we currently do not support multiple
    // hierarchicalRefinements for a hierarchicalFacet
    return this.hierarchicalFacetsRefinements[facetName] || [];
  },
  /**
   * Get the list of exclude refinements for a single facet
   * @param {string} facetName name of the attribute used for faceting
   * @return {string[]} list of refinements
   */
  getExcludeRefinements: function(facetName) {
    if (!this.isConjunctiveFacet(facetName)) {
      return [];
    }
    return this.facetsExcludes[facetName] || [];
  },

  /**
   * Remove all the numeric filter for a given (attribute, operator)
   * @method
   * @param {string} attribute attribute to set the filter on
   * @param {string} [operator] operator of the filter (possible values: =, >, >=, <, <=, !=)
   * @param {number} [number] the value to be removed
   * @return {SearchParameters}
   */
  removeNumericRefinement: function(attribute, operator, paramValue) {
    if (paramValue !== undefined) {
      if (!this.isNumericRefined(attribute, operator, paramValue)) {
        return this;
      }
      return this.setQueryParameters({
        numericRefinements: this._clearNumericRefinements(function(value, key) {
          return (
            key === attribute &&
            value.op === operator &&
            isEqualNumericRefinement(value.val, valToNumber(paramValue))
          );
        })
      });
    } else if (operator !== undefined) {
      if (!this.isNumericRefined(attribute, operator)) return this;
      return this.setQueryParameters({
        numericRefinements: this._clearNumericRefinements(function(value, key) {
          return key === attribute && value.op === operator;
        })
      });
    }

    if (!this.isNumericRefined(attribute)) return this;
    return this.setQueryParameters({
      numericRefinements: this._clearNumericRefinements(function(value, key) {
        return key === attribute;
      })
    });
  },
  /**
   * Get the list of numeric refinements for a single facet
   * @param {string} facetName name of the attribute used for faceting
   * @return {SearchParameters.OperatorList} list of refinements
   */
  getNumericRefinements: function(facetName) {
    return this.numericRefinements[facetName] || {};
  },
  /**
   * Return the current refinement for the (attribute, operator)
   * @param {string} attribute attribute in the record
   * @param {string} operator operator applied on the refined values
   * @return {Array.<number|number[]>} refined values
   */
  getNumericRefinement: function(attribute, operator) {
    return this.numericRefinements[attribute] && this.numericRefinements[attribute][operator];
  },
  /**
   * Clear numeric filters.
   * @method
   * @private
   * @param {string|SearchParameters.clearCallback} [attribute] optional string or function
   * - If not given, means to clear all the filters.
   * - If `string`, means to clear all refinements for the `attribute` named filter.
   * - If `function`, means to clear all the refinements that return truthy values.
   * @return {Object.<string, OperatorList>}
   */
  _clearNumericRefinements: function _clearNumericRefinements(attribute) {
    if (attribute === undefined) {
      if (!objectHasKeys(this.numericRefinements)) {
        return this.numericRefinements;
      }
      return {};
    } else if (typeof attribute === 'string') {
      return omit(this.numericRefinements, [attribute]);
    } else if (typeof attribute === 'function') {
      var hasChanged = false;
      var numericRefinements = this.numericRefinements;
      var newNumericRefinements = Object.keys(numericRefinements).reduce(function(memo, key) {
        var operators = numericRefinements[key];
        var operatorList = {};

        operators = operators || {};
        Object.keys(operators).forEach(function(operator) {
          var values = operators[operator] || [];
          var outValues = [];
          values.forEach(function(value) {
            var predicateResult = attribute({val: value, op: operator}, key, 'numeric');
            if (!predicateResult) outValues.push(value);
          });
          if (outValues.length !== values.length) {
            hasChanged = true;
          }
          operatorList[operator] = outValues;
        });

        memo[key] = operatorList;

        return memo;
      }, {});

      if (hasChanged) return newNumericRefinements;
      return this.numericRefinements;
    }
  },
  /**
   * Add a facet to the facets attribute of the helper configuration, if it
   * isn't already present.
   * @method
   * @param {string} facet facet name to add
   * @return {SearchParameters}
   */
  addFacet: function addFacet(facet) {
    if (this.isConjunctiveFacet(facet)) {
      return this;
    }

    return this.setQueryParameters({
      facets: this.facets.concat([facet])
    });
  },
  /**
   * Add a disjunctive facet to the disjunctiveFacets attribute of the helper
   * configuration, if it isn't already present.
   * @method
   * @param {string} facet disjunctive facet name to add
   * @return {SearchParameters}
   */
  addDisjunctiveFacet: function addDisjunctiveFacet(facet) {
    if (this.isDisjunctiveFacet(facet)) {
      return this;
    }

    return this.setQueryParameters({
      disjunctiveFacets: this.disjunctiveFacets.concat([facet])
    });
  },
  /**
   * Add a hierarchical facet to the hierarchicalFacets attribute of the helper
   * configuration.
   * @method
   * @param {object} hierarchicalFacet hierarchical facet to add
   * @return {SearchParameters}
   * @throws will throw an error if a hierarchical facet with the same name was already declared
   */
  addHierarchicalFacet: function addHierarchicalFacet(hierarchicalFacet) {
    if (this.isHierarchicalFacet(hierarchicalFacet.name)) {
      throw new Error(
        'Cannot declare two hierarchical facets with the same name: `' + hierarchicalFacet.name + '`');
    }

    return this.setQueryParameters({
      hierarchicalFacets: this.hierarchicalFacets.concat([hierarchicalFacet])
    });
  },
  /**
   * Add a refinement on a "normal" facet
   * @method
   * @param {string} facet attribute to apply the faceting on
   * @param {string} value value of the attribute (will be converted to string)
   * @return {SearchParameters}
   */
  addFacetRefinement: function addFacetRefinement(facet, value) {
    if (!this.isConjunctiveFacet(facet)) {
      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
    }
    if (RefinementList.isRefined(this.facetsRefinements, facet, value)) return this;

    return this.setQueryParameters({
      facetsRefinements: RefinementList.addRefinement(this.facetsRefinements, facet, value)
    });
  },
  /**
   * Exclude a value from a "normal" facet
   * @method
   * @param {string} facet attribute to apply the exclusion on
   * @param {string} value value of the attribute (will be converted to string)
   * @return {SearchParameters}
   */
  addExcludeRefinement: function addExcludeRefinement(facet, value) {
    if (!this.isConjunctiveFacet(facet)) {
      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
    }
    if (RefinementList.isRefined(this.facetsExcludes, facet, value)) return this;

    return this.setQueryParameters({
      facetsExcludes: RefinementList.addRefinement(this.facetsExcludes, facet, value)
    });
  },
  /**
   * Adds a refinement on a disjunctive facet.
   * @method
   * @param {string} facet attribute to apply the faceting on
   * @param {string} value value of the attribute (will be converted to string)
   * @return {SearchParameters}
   */
  addDisjunctiveFacetRefinement: function addDisjunctiveFacetRefinement(facet, value) {
    if (!this.isDisjunctiveFacet(facet)) {
      throw new Error(
        facet + ' is not defined in the disjunctiveFacets attribute of the helper configuration');
    }

    if (RefinementList.isRefined(this.disjunctiveFacetsRefinements, facet, value)) return this;

    return this.setQueryParameters({
      disjunctiveFacetsRefinements: RefinementList.addRefinement(
        this.disjunctiveFacetsRefinements, facet, value)
    });
  },
  /**
   * addTagRefinement adds a tag to the list used to filter the results
   * @param {string} tag tag to be added
   * @return {SearchParameters}
   */
  addTagRefinement: function addTagRefinement(tag) {
    if (this.isTagRefined(tag)) return this;

    var modification = {
      tagRefinements: this.tagRefinements.concat(tag)
    };

    return this.setQueryParameters(modification);
  },
  /**
   * Remove a facet from the facets attribute of the helper configuration, if it
   * is present.
   * @method
   * @param {string} facet facet name to remove
   * @return {SearchParameters}
   */
  removeFacet: function removeFacet(facet) {
    if (!this.isConjunctiveFacet(facet)) {
      return this;
    }

    return this.clearRefinements(facet).setQueryParameters({
      facets: this.facets.filter(function(f) {
        return f !== facet;
      })
    });
  },
  /**
   * Remove a disjunctive facet from the disjunctiveFacets attribute of the
   * helper configuration, if it is present.
   * @method
   * @param {string} facet disjunctive facet name to remove
   * @return {SearchParameters}
   */
  removeDisjunctiveFacet: function removeDisjunctiveFacet(facet) {
    if (!this.isDisjunctiveFacet(facet)) {
      return this;
    }

    return this.clearRefinements(facet).setQueryParameters({
      disjunctiveFacets: this.disjunctiveFacets.filter(function(f) {
        return f !== facet;
      })
    });
  },
  /**
   * Remove a hierarchical facet from the hierarchicalFacets attribute of the
   * helper configuration, if it is present.
   * @method
   * @param {string} facet hierarchical facet name to remove
   * @return {SearchParameters}
   */
  removeHierarchicalFacet: function removeHierarchicalFacet(facet) {
    if (!this.isHierarchicalFacet(facet)) {
      return this;
    }

    return this.clearRefinements(facet).setQueryParameters({
      hierarchicalFacets: this.hierarchicalFacets.filter(function(f) {
        return f.name !== facet;
      })
    });
  },
  /**
   * Remove a refinement set on facet. If a value is provided, it will clear the
   * refinement for the given value, otherwise it will clear all the refinement
   * values for the faceted attribute.
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {string} [value] value used to filter
   * @return {SearchParameters}
   */
  removeFacetRefinement: function removeFacetRefinement(facet, value) {
    if (!this.isConjunctiveFacet(facet)) {
      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
    }
    if (!RefinementList.isRefined(this.facetsRefinements, facet, value)) return this;

    return this.setQueryParameters({
      facetsRefinements: RefinementList.removeRefinement(this.facetsRefinements, facet, value)
    });
  },
  /**
   * Remove a negative refinement on a facet
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {string} value value used to filter
   * @return {SearchParameters}
   */
  removeExcludeRefinement: function removeExcludeRefinement(facet, value) {
    if (!this.isConjunctiveFacet(facet)) {
      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
    }
    if (!RefinementList.isRefined(this.facetsExcludes, facet, value)) return this;

    return this.setQueryParameters({
      facetsExcludes: RefinementList.removeRefinement(this.facetsExcludes, facet, value)
    });
  },
  /**
   * Remove a refinement on a disjunctive facet
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {string} value value used to filter
   * @return {SearchParameters}
   */
  removeDisjunctiveFacetRefinement: function removeDisjunctiveFacetRefinement(facet, value) {
    if (!this.isDisjunctiveFacet(facet)) {
      throw new Error(
        facet + ' is not defined in the disjunctiveFacets attribute of the helper configuration');
    }
    if (!RefinementList.isRefined(this.disjunctiveFacetsRefinements, facet, value)) return this;

    return this.setQueryParameters({
      disjunctiveFacetsRefinements: RefinementList.removeRefinement(
        this.disjunctiveFacetsRefinements, facet, value)
    });
  },
  /**
   * Remove a tag from the list of tag refinements
   * @method
   * @param {string} tag the tag to remove
   * @return {SearchParameters}
   */
  removeTagRefinement: function removeTagRefinement(tag) {
    if (!this.isTagRefined(tag)) return this;

    var modification = {
      tagRefinements: this.tagRefinements.filter(function(t) {
        return t !== tag;
      })
    };

    return this.setQueryParameters(modification);
  },
  /**
   * Generic toggle refinement method to use with facet, disjunctive facets
   * and hierarchical facets
   * @param  {string} facet the facet to refine
   * @param  {string} value the associated value
   * @return {SearchParameters}
   * @throws will throw an error if the facet is not declared in the settings of the helper
   * @deprecated since version 2.19.0, see {@link SearchParameters#toggleFacetRefinement}
   */
  toggleRefinement: function toggleRefinement(facet, value) {
    return this.toggleFacetRefinement(facet, value);
  },
  /**
   * Generic toggle refinement method to use with facet, disjunctive facets
   * and hierarchical facets
   * @param  {string} facet the facet to refine
   * @param  {string} value the associated value
   * @return {SearchParameters}
   * @throws will throw an error if the facet is not declared in the settings of the helper
   */
  toggleFacetRefinement: function toggleFacetRefinement(facet, value) {
    if (this.isHierarchicalFacet(facet)) {
      return this.toggleHierarchicalFacetRefinement(facet, value);
    } else if (this.isConjunctiveFacet(facet)) {
      return this.toggleConjunctiveFacetRefinement(facet, value);
    } else if (this.isDisjunctiveFacet(facet)) {
      return this.toggleDisjunctiveFacetRefinement(facet, value);
    }

    throw new Error('Cannot refine the undeclared facet ' + facet +
      '; it should be added to the helper options facets, disjunctiveFacets or hierarchicalFacets');
  },
  /**
   * Switch the refinement applied over a facet/value
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {value} value value used for filtering
   * @return {SearchParameters}
   */
  toggleConjunctiveFacetRefinement: function toggleConjunctiveFacetRefinement(facet, value) {
    if (!this.isConjunctiveFacet(facet)) {
      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
    }

    return this.setQueryParameters({
      facetsRefinements: RefinementList.toggleRefinement(this.facetsRefinements, facet, value)
    });
  },
  /**
   * Switch the refinement applied over a facet/value
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {value} value value used for filtering
   * @return {SearchParameters}
   */
  toggleExcludeFacetRefinement: function toggleExcludeFacetRefinement(facet, value) {
    if (!this.isConjunctiveFacet(facet)) {
      throw new Error(facet + ' is not defined in the facets attribute of the helper configuration');
    }

    return this.setQueryParameters({
      facetsExcludes: RefinementList.toggleRefinement(this.facetsExcludes, facet, value)
    });
  },
  /**
   * Switch the refinement applied over a facet/value
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {value} value value used for filtering
   * @return {SearchParameters}
   */
  toggleDisjunctiveFacetRefinement: function toggleDisjunctiveFacetRefinement(facet, value) {
    if (!this.isDisjunctiveFacet(facet)) {
      throw new Error(
        facet + ' is not defined in the disjunctiveFacets attribute of the helper configuration');
    }

    return this.setQueryParameters({
      disjunctiveFacetsRefinements: RefinementList.toggleRefinement(
        this.disjunctiveFacetsRefinements, facet, value)
    });
  },
  /**
   * Switch the refinement applied over a facet/value
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {value} value value used for filtering
   * @return {SearchParameters}
   */
  toggleHierarchicalFacetRefinement: function toggleHierarchicalFacetRefinement(facet, value) {
    if (!this.isHierarchicalFacet(facet)) {
      throw new Error(
        facet + ' is not defined in the hierarchicalFacets attribute of the helper configuration');
    }

    var separator = this._getHierarchicalFacetSeparator(this.getHierarchicalFacetByName(facet));

    var mod = {};

    var upOneOrMultipleLevel = this.hierarchicalFacetsRefinements[facet] !== undefined &&
      this.hierarchicalFacetsRefinements[facet].length > 0 && (
      // remove current refinement:
      // refinement was 'beer > IPA', call is toggleRefine('beer > IPA'), refinement should be `beer`
      this.hierarchicalFacetsRefinements[facet][0] === value ||
      // remove a parent refinement of the current refinement:
      //  - refinement was 'beer > IPA > Flying dog'
      //  - call is toggleRefine('beer > IPA')
      //  - refinement should be `beer`
      this.hierarchicalFacetsRefinements[facet][0].indexOf(value + separator) === 0
    );

    if (upOneOrMultipleLevel) {
      if (value.indexOf(separator) === -1) {
        // go back to root level
        mod[facet] = [];
      } else {
        mod[facet] = [value.slice(0, value.lastIndexOf(separator))];
      }
    } else {
      mod[facet] = [value];
    }

    return this.setQueryParameters({
      hierarchicalFacetsRefinements: defaultsPure({}, mod, this.hierarchicalFacetsRefinements)
    });
  },

  /**
   * Adds a refinement on a hierarchical facet.
   * @param {string} facet the facet name
   * @param {string} path the hierarchical facet path
   * @return {SearchParameter} the new state
   * @throws Error if the facet is not defined or if the facet is refined
   */
  addHierarchicalFacetRefinement: function(facet, path) {
    if (this.isHierarchicalFacetRefined(facet)) {
      throw new Error(facet + ' is already refined.');
    }
    if (!this.isHierarchicalFacet(facet)) {
      throw new Error(facet + ' is not defined in the hierarchicalFacets attribute of the helper configuration.');
    }
    var mod = {};
    mod[facet] = [path];
    return this.setQueryParameters({
      hierarchicalFacetsRefinements: defaultsPure({}, mod, this.hierarchicalFacetsRefinements)
    });
  },

  /**
   * Removes the refinement set on a hierarchical facet.
   * @param {string} facet the facet name
   * @return {SearchParameter} the new state
   * @throws Error if the facet is not defined or if the facet is not refined
   */
  removeHierarchicalFacetRefinement: function(facet) {
    if (!this.isHierarchicalFacetRefined(facet)) {
      return this;
    }
    var mod = {};
    mod[facet] = [];
    return this.setQueryParameters({
      hierarchicalFacetsRefinements: defaultsPure({}, mod, this.hierarchicalFacetsRefinements)
    });
  },
  /**
   * Switch the tag refinement
   * @method
   * @param {string} tag the tag to remove or add
   * @return {SearchParameters}
   */
  toggleTagRefinement: function toggleTagRefinement(tag) {
    if (this.isTagRefined(tag)) {
      return this.removeTagRefinement(tag);
    }

    return this.addTagRefinement(tag);
  },
  /**
   * Test if the facet name is from one of the disjunctive facets
   * @method
   * @param {string} facet facet name to test
   * @return {boolean}
   */
  isDisjunctiveFacet: function(facet) {
    return this.disjunctiveFacets.indexOf(facet) > -1;
  },
  /**
   * Test if the facet name is from one of the hierarchical facets
   * @method
   * @param {string} facetName facet name to test
   * @return {boolean}
   */
  isHierarchicalFacet: function(facetName) {
    return this.getHierarchicalFacetByName(facetName) !== undefined;
  },
  /**
   * Test if the facet name is from one of the conjunctive/normal facets
   * @method
   * @param {string} facet facet name to test
   * @return {boolean}
   */
  isConjunctiveFacet: function(facet) {
    return this.facets.indexOf(facet) > -1;
  },
  /**
   * Returns true if the facet is refined, either for a specific value or in
   * general.
   * @method
   * @param {string} facet name of the attribute for used for faceting
   * @param {string} value, optional value. If passed will test that this value
   * is filtering the given facet.
   * @return {boolean} returns true if refined
   */
  isFacetRefined: function isFacetRefined(facet, value) {
    if (!this.isConjunctiveFacet(facet)) {
      return false;
    }
    return RefinementList.isRefined(this.facetsRefinements, facet, value);
  },
  /**
   * Returns true if the facet contains exclusions or if a specific value is
   * excluded.
   *
   * @method
   * @param {string} facet name of the attribute for used for faceting
   * @param {string} [value] optional value. If passed will test that this value
   * is filtering the given facet.
   * @return {boolean} returns true if refined
   */
  isExcludeRefined: function isExcludeRefined(facet, value) {
    if (!this.isConjunctiveFacet(facet)) {
      return false;
    }
    return RefinementList.isRefined(this.facetsExcludes, facet, value);
  },
  /**
   * Returns true if the facet contains a refinement, or if a value passed is a
   * refinement for the facet.
   * @method
   * @param {string} facet name of the attribute for used for faceting
   * @param {string} value optional, will test if the value is used for refinement
   * if there is one, otherwise will test if the facet contains any refinement
   * @return {boolean}
   */
  isDisjunctiveFacetRefined: function isDisjunctiveFacetRefined(facet, value) {
    if (!this.isDisjunctiveFacet(facet)) {
      return false;
    }
    return RefinementList.isRefined(this.disjunctiveFacetsRefinements, facet, value);
  },
  /**
   * Returns true if the facet contains a refinement, or if a value passed is a
   * refinement for the facet.
   * @method
   * @param {string} facet name of the attribute for used for faceting
   * @param {string} value optional, will test if the value is used for refinement
   * if there is one, otherwise will test if the facet contains any refinement
   * @return {boolean}
   */
  isHierarchicalFacetRefined: function isHierarchicalFacetRefined(facet, value) {
    if (!this.isHierarchicalFacet(facet)) {
      return false;
    }

    var refinements = this.getHierarchicalRefinement(facet);

    if (!value) {
      return refinements.length > 0;
    }

    return refinements.indexOf(value) !== -1;
  },
  /**
   * Test if the triple (attribute, operator, value) is already refined.
   * If only the attribute and the operator are provided, it tests if the
   * contains any refinement value.
   * @method
   * @param {string} attribute attribute for which the refinement is applied
   * @param {string} [operator] operator of the refinement
   * @param {string} [value] value of the refinement
   * @return {boolean} true if it is refined
   */
  isNumericRefined: function isNumericRefined(attribute, operator, value) {
    if (value === undefined && operator === undefined) {
      return !!this.numericRefinements[attribute];
    }

    var isOperatorDefined =
      this.numericRefinements[attribute] &&
      this.numericRefinements[attribute][operator] !== undefined;

    if (value === undefined || !isOperatorDefined) {
      return isOperatorDefined;
    }

    var parsedValue = valToNumber(value);
    var isAttributeValueDefined =
      findArray(this.numericRefinements[attribute][operator], parsedValue) !==
      undefined;

    return isOperatorDefined && isAttributeValueDefined;
  },
  /**
   * Returns true if the tag refined, false otherwise
   * @method
   * @param {string} tag the tag to check
   * @return {boolean}
   */
  isTagRefined: function isTagRefined(tag) {
    return this.tagRefinements.indexOf(tag) !== -1;
  },
  /**
   * Returns the list of all disjunctive facets refined
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {value} value value used for filtering
   * @return {string[]}
   */
  getRefinedDisjunctiveFacets: function getRefinedDisjunctiveFacets() {
    var self = this;

    // attributes used for numeric filter can also be disjunctive
    var disjunctiveNumericRefinedFacets = intersection(
      Object.keys(this.numericRefinements).filter(function(facet) {
        return Object.keys(self.numericRefinements[facet]).length > 0;
      }),
      this.disjunctiveFacets
    );

    return Object.keys(this.disjunctiveFacetsRefinements).filter(function(facet) {
      return self.disjunctiveFacetsRefinements[facet].length > 0;
    })
      .concat(disjunctiveNumericRefinedFacets)
      .concat(this.getRefinedHierarchicalFacets());
  },
  /**
   * Returns the list of all disjunctive facets refined
   * @method
   * @param {string} facet name of the attribute used for faceting
   * @param {value} value value used for filtering
   * @return {string[]}
   */
  getRefinedHierarchicalFacets: function getRefinedHierarchicalFacets() {
    var self = this;
    return intersection(
      // enforce the order between the two arrays,
      // so that refinement name index === hierarchical facet index
      this.hierarchicalFacets.map(function(facet) { return facet.name; }),
      Object.keys(this.hierarchicalFacetsRefinements).filter(function(facet) {
        return self.hierarchicalFacetsRefinements[facet].length > 0;
      })
    );
  },
  /**
   * Returned the list of all disjunctive facets not refined
   * @method
   * @return {string[]}
   */
  getUnrefinedDisjunctiveFacets: function() {
    var refinedFacets = this.getRefinedDisjunctiveFacets();

    return this.disjunctiveFacets.filter(function(f) {
      return refinedFacets.indexOf(f) === -1;
    });
  },

  managedParameters: [
    'index',

    'facets',
    'disjunctiveFacets',
    'facetsRefinements',
    'hierarchicalFacets',
    'facetsExcludes',

    'disjunctiveFacetsRefinements',
    'numericRefinements',
    'tagRefinements',
    'hierarchicalFacetsRefinements'
  ],
  getQueryParams: function getQueryParams() {
    var managedParameters = this.managedParameters;

    var queryParams = {};

    var self = this;
    Object.keys(this).forEach(function(paramName) {
      var paramValue = self[paramName];
      if (managedParameters.indexOf(paramName) === -1 && paramValue !== undefined) {
        queryParams[paramName] = paramValue;
      }
    });

    return queryParams;
  },
  /**
   * Let the user set a specific value for a given parameter. Will return the
   * same instance if the parameter is invalid or if the value is the same as the
   * previous one.
   * @method
   * @param {string} parameter the parameter name
   * @param {any} value the value to be set, must be compliant with the definition
   * of the attribute on the object
   * @return {SearchParameters} the updated state
   */
  setQueryParameter: function setParameter(parameter, value) {
    if (this[parameter] === value) return this;

    var modification = {};

    modification[parameter] = value;

    return this.setQueryParameters(modification);
  },
  /**
   * Let the user set any of the parameters with a plain object.
   * @method
   * @param {object} params all the keys and the values to be updated
   * @return {SearchParameters} a new updated instance
   */
  setQueryParameters: function setQueryParameters(params) {
    if (!params) return this;

    var error = SearchParameters.validate(this, params);

    if (error) {
      throw error;
    }

    var self = this;
    var nextWithNumbers = SearchParameters._parseNumbers(params);
    var previousPlainObject = Object.keys(this).reduce(function(acc, key) {
      acc[key] = self[key];
      return acc;
    }, {});

    var nextPlainObject = Object.keys(nextWithNumbers).reduce(
      function(previous, key) {
        var isPreviousValueDefined = previous[key] !== undefined;
        var isNextValueDefined = nextWithNumbers[key] !== undefined;

        if (isPreviousValueDefined && !isNextValueDefined) {
          return omit(previous, [key]);
        }

        if (isNextValueDefined) {
          previous[key] = nextWithNumbers[key];
        }

        return previous;
      },
      previousPlainObject
    );

    return new this.constructor(nextPlainObject);
  },

  /**
   * Returns a new instance with the page reset. Two scenarios possible:
   * the page is omitted -> return the given instance
   * the page is set -> return a new instance with a page of 0
   * @return {SearchParameters} a new updated instance
   */
  resetPage: function() {
    if (this.page === undefined) {
      return this;
    }

    return this.setPage(0);
  },

  /**
   * Helper function to get the hierarchicalFacet separator or the default one (`>`)
   * @param  {object} hierarchicalFacet
   * @return {string} returns the hierarchicalFacet.separator or `>` as default
   */
  _getHierarchicalFacetSortBy: function(hierarchicalFacet) {
    return hierarchicalFacet.sortBy || ['isRefined:desc', 'name:asc'];
  },

  /**
   * Helper function to get the hierarchicalFacet separator or the default one (`>`)
   * @private
   * @param  {object} hierarchicalFacet
   * @return {string} returns the hierarchicalFacet.separator or `>` as default
   */
  _getHierarchicalFacetSeparator: function(hierarchicalFacet) {
    return hierarchicalFacet.separator || ' > ';
  },

  /**
   * Helper function to get the hierarchicalFacet prefix path or null
   * @private
   * @param  {object} hierarchicalFacet
   * @return {string} returns the hierarchicalFacet.rootPath or null as default
   */
  _getHierarchicalRootPath: function(hierarchicalFacet) {
    return hierarchicalFacet.rootPath || null;
  },

  /**
   * Helper function to check if we show the parent level of the hierarchicalFacet
   * @private
   * @param  {object} hierarchicalFacet
   * @return {string} returns the hierarchicalFacet.showParentLevel or true as default
   */
  _getHierarchicalShowParentLevel: function(hierarchicalFacet) {
    if (typeof hierarchicalFacet.showParentLevel === 'boolean') {
      return hierarchicalFacet.showParentLevel;
    }
    return true;
  },

  /**
   * Helper function to get the hierarchicalFacet by it's name
   * @param  {string} hierarchicalFacetName
   * @return {object} a hierarchicalFacet
   */
  getHierarchicalFacetByName: function(hierarchicalFacetName) {
    return find(
      this.hierarchicalFacets,
      function(f) {
        return f.name === hierarchicalFacetName;
      }
    );
  },

  /**
   * Get the current breadcrumb for a hierarchical facet, as an array
   * @param  {string} facetName Hierarchical facet name
   * @return {array.<string>} the path as an array of string
   */
  getHierarchicalFacetBreadcrumb: function(facetName) {
    if (!this.isHierarchicalFacet(facetName)) {
      return [];
    }

    var refinement = this.getHierarchicalRefinement(facetName)[0];
    if (!refinement) return [];

    var separator = this._getHierarchicalFacetSeparator(
      this.getHierarchicalFacetByName(facetName)
    );
    var path = refinement.split(separator);
    return path.map(function(part) {
      return part.trim();
    });
  },

  toString: function() {
    return JSON.stringify(this, null, 2);
  }
};

/**
 * Callback used for clearRefinement method
 * @callback SearchParameters.clearCallback
 * @param {OperatorList|FacetList} value the value of the filter
 * @param {string} key the current attribute name
 * @param {string} type `numeric`, `disjunctiveFacet`, `conjunctiveFacet`, `hierarchicalFacet` or `exclude`
 * depending on the type of facet
 * @return {boolean} `true` if the element should be removed. `false` otherwise.
 */
module.exports = SearchParameters;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/SearchResults/generate-hierarchical-tree.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/SearchResults/generate-hierarchical-tree.js ***!
  \*******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = generateTrees;

var orderBy = __webpack_require__(/*! ../functions/orderBy */ "./node_modules/algoliasearch-helper/src/functions/orderBy.js");
var find = __webpack_require__(/*! ../functions/find */ "./node_modules/algoliasearch-helper/src/functions/find.js");
var prepareHierarchicalFacetSortBy = __webpack_require__(/*! ../functions/formatSort */ "./node_modules/algoliasearch-helper/src/functions/formatSort.js");

function generateTrees(state) {
  return function generate(hierarchicalFacetResult, hierarchicalFacetIndex) {
    var hierarchicalFacet = state.hierarchicalFacets[hierarchicalFacetIndex];
    var hierarchicalFacetRefinement =
      (state.hierarchicalFacetsRefinements[hierarchicalFacet.name] &&
        state.hierarchicalFacetsRefinements[hierarchicalFacet.name][0]) ||
      '';
    var hierarchicalSeparator = state._getHierarchicalFacetSeparator(
      hierarchicalFacet
    );
    var hierarchicalRootPath = state._getHierarchicalRootPath(
      hierarchicalFacet
    );
    var hierarchicalShowParentLevel = state._getHierarchicalShowParentLevel(
      hierarchicalFacet
    );
    var sortBy = prepareHierarchicalFacetSortBy(
      state._getHierarchicalFacetSortBy(hierarchicalFacet)
    );

    var rootExhaustive = hierarchicalFacetResult.every(function(facetResult) {
      return facetResult.exhaustive;
    });

    var generateTreeFn = generateHierarchicalTree(
      sortBy,
      hierarchicalSeparator,
      hierarchicalRootPath,
      hierarchicalShowParentLevel,
      hierarchicalFacetRefinement
    );

    var results = hierarchicalFacetResult;

    if (hierarchicalRootPath) {
      results = hierarchicalFacetResult.slice(
        hierarchicalRootPath.split(hierarchicalSeparator).length
      );
    }

    return results.reduce(generateTreeFn, {
      name: state.hierarchicalFacets[hierarchicalFacetIndex].name,
      count: null, // root level, no count
      isRefined: true, // root level, always refined
      path: null, // root level, no path
      exhaustive: rootExhaustive,
      data: null
    });
  };
}

function generateHierarchicalTree(
  sortBy,
  hierarchicalSeparator,
  hierarchicalRootPath,
  hierarchicalShowParentLevel,
  currentRefinement
) {
  return function generateTree(
    hierarchicalTree,
    hierarchicalFacetResult,
    currentHierarchicalLevel
  ) {
    var parent = hierarchicalTree;

    if (currentHierarchicalLevel > 0) {
      var level = 0;

      parent = hierarchicalTree;

      while (level < currentHierarchicalLevel) {
        /**
         * @type {object[]]} hierarchical data
         */
        var data = parent && Array.isArray(parent.data) ? parent.data : [];
        parent = find(data, function(subtree) {
          return subtree.isRefined;
        });
        level++;
      }
    }

    // we found a refined parent, let's add current level data under it
    if (parent) {
      // filter values in case an object has multiple categories:
      //   {
      //     categories: {
      //       level0: ['beers', 'bières'],
      //       level1: ['beers > IPA', 'bières > Belges']
      //     }
      //   }
      //
      // If parent refinement is `beers`, then we do not want to have `bières > Belges`
      // showing up

      var picked = Object.keys(hierarchicalFacetResult.data)
        .map(function(facetValue) {
          return [facetValue, hierarchicalFacetResult.data[facetValue]];
        })
        .filter(function(tuple) {
          var facetValue = tuple[0];
          return onlyMatchingTree(
            facetValue,
            parent.path || hierarchicalRootPath,
            currentRefinement,
            hierarchicalSeparator,
            hierarchicalRootPath,
            hierarchicalShowParentLevel
          );
        });

      parent.data = orderBy(
        picked.map(function(tuple) {
          var facetValue = tuple[0];
          var facetCount = tuple[1];

          return format(
            facetCount,
            facetValue,
            hierarchicalSeparator,
            currentRefinement,
            hierarchicalFacetResult.exhaustive
          );
        }),
        sortBy[0],
        sortBy[1]
      );
    }

    return hierarchicalTree;
  };
}

function onlyMatchingTree(
  facetValue,
  parentPath,
  currentRefinement,
  hierarchicalSeparator,
  hierarchicalRootPath,
  hierarchicalShowParentLevel
) {
  // we want the facetValue is a child of hierarchicalRootPath
  if (
    hierarchicalRootPath &&
    (facetValue.indexOf(hierarchicalRootPath) !== 0 ||
      hierarchicalRootPath === facetValue)
  ) {
    return false;
  }

  // we always want root levels (only when there is no prefix path)
  return (
    (!hierarchicalRootPath &&
      facetValue.indexOf(hierarchicalSeparator) === -1) ||
    // if there is a rootPath, being root level mean 1 level under rootPath
    (hierarchicalRootPath &&
      facetValue.split(hierarchicalSeparator).length -
        hierarchicalRootPath.split(hierarchicalSeparator).length ===
        1) ||
    // if current refinement is a root level and current facetValue is a root level,
    // keep the facetValue
    (facetValue.indexOf(hierarchicalSeparator) === -1 &&
      currentRefinement.indexOf(hierarchicalSeparator) === -1) ||
    // currentRefinement is a child of the facet value
    currentRefinement.indexOf(facetValue) === 0 ||
    // facetValue is a child of the current parent, add it
    (facetValue.indexOf(parentPath + hierarchicalSeparator) === 0 &&
      (hierarchicalShowParentLevel ||
        facetValue.indexOf(currentRefinement) === 0))
  );
}

function format(
  facetCount,
  facetValue,
  hierarchicalSeparator,
  currentRefinement,
  exhaustive
) {
  var parts = facetValue.split(hierarchicalSeparator);
  return {
    name: parts[parts.length - 1].trim(),
    path: facetValue,
    count: facetCount,
    isRefined:
      currentRefinement === facetValue ||
      currentRefinement.indexOf(facetValue + hierarchicalSeparator) === 0,
    exhaustive: exhaustive,
    data: null
  };
}


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/SearchResults/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/SearchResults/index.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var merge = __webpack_require__(/*! ../functions/merge */ "./node_modules/algoliasearch-helper/src/functions/merge.js");
var defaultsPure = __webpack_require__(/*! ../functions/defaultsPure */ "./node_modules/algoliasearch-helper/src/functions/defaultsPure.js");
var orderBy = __webpack_require__(/*! ../functions/orderBy */ "./node_modules/algoliasearch-helper/src/functions/orderBy.js");
var compact = __webpack_require__(/*! ../functions/compact */ "./node_modules/algoliasearch-helper/src/functions/compact.js");
var find = __webpack_require__(/*! ../functions/find */ "./node_modules/algoliasearch-helper/src/functions/find.js");
var findIndex = __webpack_require__(/*! ../functions/findIndex */ "./node_modules/algoliasearch-helper/src/functions/findIndex.js");
var formatSort = __webpack_require__(/*! ../functions/formatSort */ "./node_modules/algoliasearch-helper/src/functions/formatSort.js");

var generateHierarchicalTree = __webpack_require__(/*! ./generate-hierarchical-tree */ "./node_modules/algoliasearch-helper/src/SearchResults/generate-hierarchical-tree.js");

/**
 * @typedef SearchResults.Facet
 * @type {object}
 * @property {string} name name of the attribute in the record
 * @property {object} data the faceting data: value, number of entries
 * @property {object} stats undefined unless facet_stats is retrieved from algolia
 */

/**
 * @typedef SearchResults.HierarchicalFacet
 * @type {object}
 * @property {string} name name of the current value given the hierarchical level, trimmed.
 * If root node, you get the facet name
 * @property {number} count number of objects matching this hierarchical value
 * @property {string} path the current hierarchical value full path
 * @property {boolean} isRefined `true` if the current value was refined, `false` otherwise
 * @property {HierarchicalFacet[]} data sub values for the current level
 */

/**
 * @typedef SearchResults.FacetValue
 * @type {object}
 * @property {string} name the facet value itself
 * @property {number} count times this facet appears in the results
 * @property {boolean} isRefined is the facet currently selected
 * @property {boolean} isExcluded is the facet currently excluded (only for conjunctive facets)
 */

/**
 * @typedef Refinement
 * @type {object}
 * @property {string} type the type of filter used:
 * `numeric`, `facet`, `exclude`, `disjunctive`, `hierarchical`
 * @property {string} attributeName name of the attribute used for filtering
 * @property {string} name the value of the filter
 * @property {number} numericValue the value as a number. Only for numeric filters.
 * @property {string} operator the operator used. Only for numeric filters.
 * @property {number} count the number of computed hits for this filter. Only on facets.
 * @property {boolean} exhaustive if the count is exhaustive
 */

/**
 * @param {string[]} attributes
 */
function getIndices(attributes) {
  var indices = {};

  attributes.forEach(function(val, idx) {
    indices[val] = idx;
  });

  return indices;
}

function assignFacetStats(dest, facetStats, key) {
  if (facetStats && facetStats[key]) {
    dest.stats = facetStats[key];
  }
}

/**
 * @typedef {Object} HierarchicalFacet
 * @property {string} name
 * @property {string[]} attributes
 */

/**
 * @param {HierarchicalFacet[]} hierarchicalFacets
 * @param {string} hierarchicalAttributeName
 */
function findMatchingHierarchicalFacetFromAttributeName(
  hierarchicalFacets,
  hierarchicalAttributeName
) {
  return find(hierarchicalFacets, function facetKeyMatchesAttribute(
    hierarchicalFacet
  ) {
    var facetNames = hierarchicalFacet.attributes || [];
    return facetNames.indexOf(hierarchicalAttributeName) > -1;
  });
}

/*eslint-disable */
/**
 * Constructor for SearchResults
 * @class
 * @classdesc SearchResults contains the results of a query to Algolia using the
 * {@link AlgoliaSearchHelper}.
 * @param {SearchParameters} state state that led to the response
 * @param {array.<object>} results the results from algolia client
 * @example <caption>SearchResults of the first query in
 * <a href="http://demos.algolia.com/instant-search-demo">the instant search demo</a></caption>
{
   "hitsPerPage": 10,
   "processingTimeMS": 2,
   "facets": [
      {
         "name": "type",
         "data": {
            "HardGood": 6627,
            "BlackTie": 550,
            "Music": 665,
            "Software": 131,
            "Game": 456,
            "Movie": 1571
         },
         "exhaustive": false
      },
      {
         "exhaustive": false,
         "data": {
            "Free shipping": 5507
         },
         "name": "shipping"
      }
  ],
   "hits": [
      {
         "thumbnailImage": "http://img.bbystatic.com/BestBuy_US/images/products/1688/1688832_54x108_s.gif",
         "_highlightResult": {
            "shortDescription": {
               "matchLevel": "none",
               "value": "Safeguard your PC, Mac, Android and iOS devices with comprehensive Internet protection",
               "matchedWords": []
            },
            "category": {
               "matchLevel": "none",
               "value": "Computer Security Software",
               "matchedWords": []
            },
            "manufacturer": {
               "matchedWords": [],
               "value": "Webroot",
               "matchLevel": "none"
            },
            "name": {
               "value": "Webroot SecureAnywhere Internet Security (3-Device) (1-Year Subscription) - Mac/Windows",
               "matchedWords": [],
               "matchLevel": "none"
            }
         },
         "image": "http://img.bbystatic.com/BestBuy_US/images/products/1688/1688832_105x210_sc.jpg",
         "shipping": "Free shipping",
         "bestSellingRank": 4,
         "shortDescription": "Safeguard your PC, Mac, Android and iOS devices with comprehensive Internet protection",
         "url": "http://www.bestbuy.com/site/webroot-secureanywhere-internet-security-3-devi…d=1219060687969&skuId=1688832&cmp=RMX&ky=2d3GfEmNIzjA0vkzveHdZEBgpPCyMnLTJ",
         "name": "Webroot SecureAnywhere Internet Security (3-Device) (1-Year Subscription) - Mac/Windows",
         "category": "Computer Security Software",
         "salePrice_range": "1 - 50",
         "objectID": "1688832",
         "type": "Software",
         "customerReviewCount": 5980,
         "salePrice": 49.99,
         "manufacturer": "Webroot"
      },
      ....
  ],
   "nbHits": 10000,
   "disjunctiveFacets": [
      {
         "exhaustive": false,
         "data": {
            "5": 183,
            "12": 112,
            "7": 149,
            ...
         },
         "name": "customerReviewCount",
         "stats": {
            "max": 7461,
            "avg": 157.939,
            "min": 1
         }
      },
      {
         "data": {
            "Printer Ink": 142,
            "Wireless Speakers": 60,
            "Point & Shoot Cameras": 48,
            ...
         },
         "name": "category",
         "exhaustive": false
      },
      {
         "exhaustive": false,
         "data": {
            "> 5000": 2,
            "1 - 50": 6524,
            "501 - 2000": 566,
            "201 - 500": 1501,
            "101 - 200": 1360,
            "2001 - 5000": 47
         },
         "name": "salePrice_range"
      },
      {
         "data": {
            "Dynex™": 202,
            "Insignia™": 230,
            "PNY": 72,
            ...
         },
         "name": "manufacturer",
         "exhaustive": false
      }
  ],
   "query": "",
   "nbPages": 100,
   "page": 0,
   "index": "bestbuy"
}
 **/
/*eslint-enable */
function SearchResults(state, results) {
  var mainSubResponse = results[0];

  this._rawResults = results;

  var self = this;

  // https://www.algolia.com/doc/api-reference/api-methods/search/#response
  Object.keys(mainSubResponse).forEach(function(key) {
    self[key] = mainSubResponse[key];
  });

  /**
   * query used to generate the results
   * @name query
   * @member {string}
   * @memberof SearchResults
   * @instance
   */
  /**
   * The query as parsed by the engine given all the rules.
   * @name parsedQuery
   * @member {string}
   * @memberof SearchResults
   * @instance
   */
  /**
   * all the records that match the search parameters. Each record is
   * augmented with a new attribute `_highlightResult`
   * which is an object keyed by attribute and with the following properties:
   *  - `value` : the value of the facet highlighted (html)
   *  - `matchLevel`: full, partial or none depending on how the query terms match
   * @name hits
   * @member {object[]}
   * @memberof SearchResults
   * @instance
   */
  /**
   * index where the results come from
   * @name index
   * @member {string}
   * @memberof SearchResults
   * @instance
   */
  /**
   * number of hits per page requested
   * @name hitsPerPage
   * @member {number}
   * @memberof SearchResults
   * @instance
   */
  /**
   * total number of hits of this query on the index
   * @name nbHits
   * @member {number}
   * @memberof SearchResults
   * @instance
   */
  /**
   * total number of pages with respect to the number of hits per page and the total number of hits
   * @name nbPages
   * @member {number}
   * @memberof SearchResults
   * @instance
   */
  /**
   * current page
   * @name page
   * @member {number}
   * @memberof SearchResults
   * @instance
   */
  /**
   * The position if the position was guessed by IP.
   * @name aroundLatLng
   * @member {string}
   * @memberof SearchResults
   * @instance
   * @example "48.8637,2.3615",
   */
  /**
   * The radius computed by Algolia.
   * @name automaticRadius
   * @member {string}
   * @memberof SearchResults
   * @instance
   * @example "126792922",
   */
  /**
   * String identifying the server used to serve this request.
   *
   * getRankingInfo needs to be set to `true` for this to be returned
   *
   * @name serverUsed
   * @member {string}
   * @memberof SearchResults
   * @instance
   * @example "c7-use-2.algolia.net",
   */
  /**
   * Boolean that indicates if the computation of the counts did time out.
   * @deprecated
   * @name timeoutCounts
   * @member {boolean}
   * @memberof SearchResults
   * @instance
   */
  /**
   * Boolean that indicates if the computation of the hits did time out.
   * @deprecated
   * @name timeoutHits
   * @member {boolean}
   * @memberof SearchResults
   * @instance
   */
  /**
   * True if the counts of the facets is exhaustive
   * @name exhaustiveFacetsCount
   * @member {boolean}
   * @memberof SearchResults
   * @instance
   */
  /**
   * True if the number of hits is exhaustive
   * @name exhaustiveNbHits
   * @member {boolean}
   * @memberof SearchResults
   * @instance
   */
  /**
   * Contains the userData if they are set by a [query rule](https://www.algolia.com/doc/guides/query-rules/query-rules-overview/).
   * @name userData
   * @member {object[]}
   * @memberof SearchResults
   * @instance
   */
  /**
   * queryID is the unique identifier of the query used to generate the current search results.
   * This value is only available if the `clickAnalytics` search parameter is set to `true`.
   * @name queryID
   * @member {string}
   * @memberof SearchResults
   * @instance
   */

  /**
   * sum of the processing time of all the queries
   * @member {number}
   */
  this.processingTimeMS = results.reduce(function(sum, result) {
    return result.processingTimeMS === undefined
      ? sum
      : sum + result.processingTimeMS;
  }, 0);

  /**
   * disjunctive facets results
   * @member {SearchResults.Facet[]}
   */
  this.disjunctiveFacets = [];
  /**
   * disjunctive facets results
   * @member {SearchResults.HierarchicalFacet[]}
   */
  this.hierarchicalFacets = state.hierarchicalFacets.map(function initFutureTree() {
    return [];
  });
  /**
   * other facets results
   * @member {SearchResults.Facet[]}
   */
  this.facets = [];

  var disjunctiveFacets = state.getRefinedDisjunctiveFacets();

  var facetsIndices = getIndices(state.facets);
  var disjunctiveFacetsIndices = getIndices(state.disjunctiveFacets);
  var nextDisjunctiveResult = 1;

  // Since we send request only for disjunctive facets that have been refined,
  // we get the facets information from the first, general, response.

  var mainFacets = mainSubResponse.facets || {};

  Object.keys(mainFacets).forEach(function(facetKey) {
    var facetValueObject = mainFacets[facetKey];

    var hierarchicalFacet = findMatchingHierarchicalFacetFromAttributeName(
      state.hierarchicalFacets,
      facetKey
    );

    if (hierarchicalFacet) {
      // Place the hierarchicalFacet data at the correct index depending on
      // the attributes order that was defined at the helper initialization
      var facetIndex = hierarchicalFacet.attributes.indexOf(facetKey);
      var idxAttributeName = findIndex(state.hierarchicalFacets, function(f) {
        return f.name === hierarchicalFacet.name;
      });
      self.hierarchicalFacets[idxAttributeName][facetIndex] = {
        attribute: facetKey,
        data: facetValueObject,
        exhaustive: mainSubResponse.exhaustiveFacetsCount
      };
    } else {
      var isFacetDisjunctive = state.disjunctiveFacets.indexOf(facetKey) !== -1;
      var isFacetConjunctive = state.facets.indexOf(facetKey) !== -1;
      var position;

      if (isFacetDisjunctive) {
        position = disjunctiveFacetsIndices[facetKey];
        self.disjunctiveFacets[position] = {
          name: facetKey,
          data: facetValueObject,
          exhaustive: mainSubResponse.exhaustiveFacetsCount
        };
        assignFacetStats(self.disjunctiveFacets[position], mainSubResponse.facets_stats, facetKey);
      }
      if (isFacetConjunctive) {
        position = facetsIndices[facetKey];
        self.facets[position] = {
          name: facetKey,
          data: facetValueObject,
          exhaustive: mainSubResponse.exhaustiveFacetsCount
        };
        assignFacetStats(self.facets[position], mainSubResponse.facets_stats, facetKey);
      }
    }
  });

  // Make sure we do not keep holes within the hierarchical facets
  this.hierarchicalFacets = compact(this.hierarchicalFacets);

  // aggregate the refined disjunctive facets
  disjunctiveFacets.forEach(function(disjunctiveFacet) {
    var result = results[nextDisjunctiveResult];
    var facets = result && result.facets ? result.facets : {};
    var hierarchicalFacet = state.getHierarchicalFacetByName(disjunctiveFacet);

    // There should be only item in facets.
    Object.keys(facets).forEach(function(dfacet) {
      var facetResults = facets[dfacet];

      var position;

      if (hierarchicalFacet) {
        position = findIndex(state.hierarchicalFacets, function(f) {
          return f.name === hierarchicalFacet.name;
        });
        var attributeIndex = findIndex(self.hierarchicalFacets[position], function(f) {
          return f.attribute === dfacet;
        });

        // previous refinements and no results so not able to find it
        if (attributeIndex === -1) {
          return;
        }

        self.hierarchicalFacets[position][attributeIndex].data = merge(
          {},
          self.hierarchicalFacets[position][attributeIndex].data,
          facetResults
        );
      } else {
        position = disjunctiveFacetsIndices[dfacet];

        var dataFromMainRequest = mainSubResponse.facets && mainSubResponse.facets[dfacet] || {};

        self.disjunctiveFacets[position] = {
          name: dfacet,
          data: defaultsPure({}, facetResults, dataFromMainRequest),
          exhaustive: result.exhaustiveFacetsCount
        };
        assignFacetStats(self.disjunctiveFacets[position], result.facets_stats, dfacet);

        if (state.disjunctiveFacetsRefinements[dfacet]) {
          state.disjunctiveFacetsRefinements[dfacet].forEach(function(refinementValue) {
            // add the disjunctive refinements if it is no more retrieved
            if (!self.disjunctiveFacets[position].data[refinementValue] &&
              state.disjunctiveFacetsRefinements[dfacet].indexOf(refinementValue) > -1) {
              self.disjunctiveFacets[position].data[refinementValue] = 0;
            }
          });
        }
      }
    });
    nextDisjunctiveResult++;
  });

  // if we have some root level values for hierarchical facets, merge them
  state.getRefinedHierarchicalFacets().forEach(function(refinedFacet) {
    var hierarchicalFacet = state.getHierarchicalFacetByName(refinedFacet);
    var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);

    var currentRefinement = state.getHierarchicalRefinement(refinedFacet);
    // if we are already at a root refinement (or no refinement at all), there is no
    // root level values request
    if (currentRefinement.length === 0 || currentRefinement[0].split(separator).length < 2) {
      return;
    }

    var result = results[nextDisjunctiveResult];
    var facets = result && result.facets
      ? result.facets
      : {};
    Object.keys(facets).forEach(function(dfacet) {
      var facetResults = facets[dfacet];
      var position = findIndex(state.hierarchicalFacets, function(f) {
        return f.name === hierarchicalFacet.name;
      });
      var attributeIndex = findIndex(self.hierarchicalFacets[position], function(f) {
        return f.attribute === dfacet;
      });

      // previous refinements and no results so not able to find it
      if (attributeIndex === -1) {
        return;
      }

      // when we always get root levels, if the hits refinement is `beers > IPA` (count: 5),
      // then the disjunctive values will be `beers` (count: 100),
      // but we do not want to display
      //   | beers (100)
      //     > IPA (5)
      // We want
      //   | beers (5)
      //     > IPA (5)
      var defaultData = {};

      if (currentRefinement.length > 0) {
        var root = currentRefinement[0].split(separator)[0];
        defaultData[root] = self.hierarchicalFacets[position][attributeIndex].data[root];
      }

      self.hierarchicalFacets[position][attributeIndex].data = defaultsPure(
        defaultData,
        facetResults,
        self.hierarchicalFacets[position][attributeIndex].data
      );
    });

    nextDisjunctiveResult++;
  });

  // add the excludes
  Object.keys(state.facetsExcludes).forEach(function(facetName) {
    var excludes = state.facetsExcludes[facetName];
    var position = facetsIndices[facetName];

    self.facets[position] = {
      name: facetName,
      data: mainSubResponse.facets[facetName],
      exhaustive: mainSubResponse.exhaustiveFacetsCount
    };
    excludes.forEach(function(facetValue) {
      self.facets[position] = self.facets[position] || {name: facetName};
      self.facets[position].data = self.facets[position].data || {};
      self.facets[position].data[facetValue] = 0;
    });
  });

  /**
   * @type {Array}
   */
  this.hierarchicalFacets = this.hierarchicalFacets.map(generateHierarchicalTree(state));

  /**
   * @type {Array}
   */
  this.facets = compact(this.facets);
  /**
   * @type {Array}
   */
  this.disjunctiveFacets = compact(this.disjunctiveFacets);

  this._state = state;
}

/**
 * Get a facet object with its name
 * @deprecated
 * @param {string} name name of the faceted attribute
 * @return {SearchResults.Facet} the facet object
 */
SearchResults.prototype.getFacetByName = function(name) {
  function predicate(facet) {
    return facet.name === name;
  }

  return find(this.facets, predicate) ||
    find(this.disjunctiveFacets, predicate) ||
    find(this.hierarchicalFacets, predicate);
};

/**
 * Get the facet values of a specified attribute from a SearchResults object.
 * @private
 * @param {SearchResults} results the search results to search in
 * @param {string} attribute name of the faceted attribute to search for
 * @return {array|object} facet values. For the hierarchical facets it is an object.
 */
function extractNormalizedFacetValues(results, attribute) {
  function predicate(facet) {
    return facet.name === attribute;
  }

  if (results._state.isConjunctiveFacet(attribute)) {
    var facet = find(results.facets, predicate);
    if (!facet) return [];

    return Object.keys(facet.data).map(function(name) {
      return {
        name: name,
        count: facet.data[name],
        isRefined: results._state.isFacetRefined(attribute, name),
        isExcluded: results._state.isExcludeRefined(attribute, name)
      };
    });
  } else if (results._state.isDisjunctiveFacet(attribute)) {
    var disjunctiveFacet = find(results.disjunctiveFacets, predicate);
    if (!disjunctiveFacet) return [];

    return Object.keys(disjunctiveFacet.data).map(function(name) {
      return {
        name: name,
        count: disjunctiveFacet.data[name],
        isRefined: results._state.isDisjunctiveFacetRefined(attribute, name)
      };
    });
  } else if (results._state.isHierarchicalFacet(attribute)) {
    return find(results.hierarchicalFacets, predicate);
  }
}

/**
 * Sort nodes of a hierarchical or disjunctive facet results
 * @private
 * @param {function} sortFn
 * @param {HierarchicalFacet|Array} node node upon which we want to apply the sort
 * @param {string[]} names attribute names
 * @param {number} [level=0] current index in the names array
 */
function recSort(sortFn, node, names, level) {
  level = level || 0;

  if (Array.isArray(node)) {
    return sortFn(node, names[level]);
  }

  if (!node.data || node.data.length === 0) {
    return node;
  }

  var children = node.data.map(function(childNode) {
    return recSort(sortFn, childNode, names, level + 1);
  });
  var sortedChildren = sortFn(children, names[level]);
  var newNode = defaultsPure({data: sortedChildren}, node);
  return newNode;
}

SearchResults.DEFAULT_SORT = ['isRefined:desc', 'count:desc', 'name:asc'];

function vanillaSortFn(order, data) {
  return data.sort(order);
}

/**
 * @typedef FacetOrdering
 * @type {Object}
 * @property {string[]} [order]
 * @property {'count' | 'alpha' | 'hidden'} [sortRemainingBy]
 */

/**
 * Sorts facet arrays via their facet ordering
 * @param {Array} facetValues the values
 * @param {FacetOrdering} facetOrdering the ordering
 * @returns {Array}
 */
function sortViaFacetOrdering(facetValues, facetOrdering) {
  var orderedFacets = [];
  var remainingFacets = [];

  var order = facetOrdering.order || [];
  /**
   * an object with the keys being the values in order, the values their index:
   * ['one', 'two'] -> { one: 0, two: 1 }
   */
  var reverseOrder = order.reduce(function(acc, name, i) {
    acc[name] = i;
    return acc;
  }, {});

  facetValues.forEach(function(item) {
    // hierarchical facets get sorted using their raw name
    var name = item.path || item.name;
    if (reverseOrder[name] !== undefined) {
      orderedFacets[reverseOrder[name]] = item;
    } else {
      remainingFacets.push(item);
    }
  });

  orderedFacets = orderedFacets.filter(function(facet) {
    return facet;
  });

  var sortRemainingBy = facetOrdering.sortRemainingBy;
  var ordering;
  if (sortRemainingBy === 'hidden') {
    return orderedFacets;
  } else if (sortRemainingBy === 'alpha') {
    ordering = [['path', 'name'], ['asc', 'asc']];
  } else {
    ordering = [['count'], ['desc']];
  }

  return orderedFacets.concat(
    orderBy(remainingFacets, ordering[0], ordering[1])
  );
}

/**
 * @param {SearchResults} results the search results class
 * @param {string} attribute the attribute to retrieve ordering of
 * @returns {FacetOrdering=}
 */
function getFacetOrdering(results, attribute) {
  return (
    results.renderingContent &&
    results.renderingContent.facetOrdering &&
    results.renderingContent.facetOrdering.values &&
    results.renderingContent.facetOrdering.values[attribute]
  );
}

/**
 * Get a the list of values for a given facet attribute. Those values are sorted
 * refinement first, descending count (bigger value on top), and name ascending
 * (alphabetical order). The sort formula can overridden using either string based
 * predicates or a function.
 *
 * This method will return all the values returned by the Algolia engine plus all
 * the values already refined. This means that it can happen that the
 * `maxValuesPerFacet` [configuration](https://www.algolia.com/doc/rest-api/search#param-maxValuesPerFacet)
 * might not be respected if you have facet values that are already refined.
 * @param {string} attribute attribute name
 * @param {object} opts configuration options.
 * @param {boolean} [opts.facetOrdering]
 * Force the use of facetOrdering from the result if a sortBy is present. If
 * sortBy isn't present, facetOrdering will be used automatically.
 * @param {Array.<string> | function} opts.sortBy
 * When using strings, it consists of
 * the name of the [FacetValue](#SearchResults.FacetValue) or the
 * [HierarchicalFacet](#SearchResults.HierarchicalFacet) attributes with the
 * order (`asc` or `desc`). For example to order the value by count, the
 * argument would be `['count:asc']`.
 *
 * If only the attribute name is specified, the ordering defaults to the one
 * specified in the default value for this attribute.
 *
 * When not specified, the order is
 * ascending.  This parameter can also be a function which takes two facet
 * values and should return a number, 0 if equal, 1 if the first argument is
 * bigger or -1 otherwise.
 *
 * The default value for this attribute `['isRefined:desc', 'count:desc', 'name:asc']`
 * @return {FacetValue[]|HierarchicalFacet|undefined} depending on the type of facet of
 * the attribute requested (hierarchical, disjunctive or conjunctive)
 * @example
 * helper.on('result', function(event){
 *   //get values ordered only by name ascending using the string predicate
 *   event.results.getFacetValues('city', {sortBy: ['name:asc']});
 *   //get values  ordered only by count ascending using a function
 *   event.results.getFacetValues('city', {
 *     // this is equivalent to ['count:asc']
 *     sortBy: function(a, b) {
 *       if (a.count === b.count) return 0;
 *       if (a.count > b.count)   return 1;
 *       if (b.count > a.count)   return -1;
 *     }
 *   });
 * });
 */
SearchResults.prototype.getFacetValues = function(attribute, opts) {
  var facetValues = extractNormalizedFacetValues(this, attribute);
  if (!facetValues) {
    return undefined;
  }

  var options = defaultsPure({}, opts, {
    sortBy: SearchResults.DEFAULT_SORT,
    // if no sortBy is given, attempt to sort based on facetOrdering
    // if it is given, we still allow to sort via facet ordering first
    facetOrdering: !(opts && opts.sortBy)
  });

  var results = this;
  var attributes;
  if (Array.isArray(facetValues)) {
    attributes = [attribute];
  } else {
    var config = results._state.getHierarchicalFacetByName(facetValues.name);
    attributes = config.attributes;
  }

  return recSort(function(data, facetName) {
    if (options.facetOrdering) {
      var facetOrdering = getFacetOrdering(results, facetName);
      if (Boolean(facetOrdering)) {
        return sortViaFacetOrdering(data, facetOrdering);
      }
    }

    if (Array.isArray(options.sortBy)) {
      var order = formatSort(options.sortBy, SearchResults.DEFAULT_SORT);
      return orderBy(data, order[0], order[1]);
    } else if (typeof options.sortBy === 'function') {
      return vanillaSortFn(options.sortBy, data);
    }
    throw new Error(
      'options.sortBy is optional but if defined it must be ' +
        'either an array of string (predicates) or a sorting function'
    );
  }, facetValues, attributes);
};

/**
 * Returns the facet stats if attribute is defined and the facet contains some.
 * Otherwise returns undefined.
 * @param {string} attribute name of the faceted attribute
 * @return {object} The stats of the facet
 */
SearchResults.prototype.getFacetStats = function(attribute) {
  if (this._state.isConjunctiveFacet(attribute)) {
    return getFacetStatsIfAvailable(this.facets, attribute);
  } else if (this._state.isDisjunctiveFacet(attribute)) {
    return getFacetStatsIfAvailable(this.disjunctiveFacets, attribute);
  }

  return undefined;
};

/**
 * @typedef {Object} FacetListItem
 * @property {string} name
 */

/**
 * @param {FacetListItem[]} facetList (has more items, but enough for here)
 * @param {string} facetName
 */
function getFacetStatsIfAvailable(facetList, facetName) {
  var data = find(facetList, function(facet) {
    return facet.name === facetName;
  });
  return data && data.stats;
}

/**
 * Returns all refinements for all filters + tags. It also provides
 * additional information: count and exhaustiveness for each filter.
 *
 * See the [refinement type](#Refinement) for an exhaustive view of the available
 * data.
 *
 * Note that for a numeric refinement, results are grouped per operator, this
 * means that it will return responses for operators which are empty.
 *
 * @return {Array.<Refinement>} all the refinements
 */
SearchResults.prototype.getRefinements = function() {
  var state = this._state;
  var results = this;
  var res = [];

  Object.keys(state.facetsRefinements).forEach(function(attributeName) {
    state.facetsRefinements[attributeName].forEach(function(name) {
      res.push(getRefinement(state, 'facet', attributeName, name, results.facets));
    });
  });

  Object.keys(state.facetsExcludes).forEach(function(attributeName) {
    state.facetsExcludes[attributeName].forEach(function(name) {
      res.push(getRefinement(state, 'exclude', attributeName, name, results.facets));
    });
  });

  Object.keys(state.disjunctiveFacetsRefinements).forEach(function(attributeName) {
    state.disjunctiveFacetsRefinements[attributeName].forEach(function(name) {
      res.push(getRefinement(state, 'disjunctive', attributeName, name, results.disjunctiveFacets));
    });
  });

  Object.keys(state.hierarchicalFacetsRefinements).forEach(function(attributeName) {
    state.hierarchicalFacetsRefinements[attributeName].forEach(function(name) {
      res.push(getHierarchicalRefinement(state, attributeName, name, results.hierarchicalFacets));
    });
  });


  Object.keys(state.numericRefinements).forEach(function(attributeName) {
    var operators = state.numericRefinements[attributeName];
    Object.keys(operators).forEach(function(operator) {
      operators[operator].forEach(function(value) {
        res.push({
          type: 'numeric',
          attributeName: attributeName,
          name: value,
          numericValue: value,
          operator: operator
        });
      });
    });
  });

  state.tagRefinements.forEach(function(name) {
    res.push({type: 'tag', attributeName: '_tags', name: name});
  });

  return res;
};

/**
 * @typedef {Object} Facet
 * @property {string} name
 * @property {Object} data
 * @property {boolean} exhaustive
 */

/**
 * @param {*} state
 * @param {*} type
 * @param {string} attributeName
 * @param {*} name
 * @param {Facet[]} resultsFacets
 */
function getRefinement(state, type, attributeName, name, resultsFacets) {
  var facet = find(resultsFacets, function(f) {
    return f.name === attributeName;
  });
  var count = facet && facet.data && facet.data[name] ? facet.data[name] : 0;
  var exhaustive = (facet && facet.exhaustive) || false;

  return {
    type: type,
    attributeName: attributeName,
    name: name,
    count: count,
    exhaustive: exhaustive
  };
}

/**
 * @param {*} state
 * @param {string} attributeName
 * @param {*} name
 * @param {Facet[]} resultsFacets
 */
function getHierarchicalRefinement(state, attributeName, name, resultsFacets) {
  var facetDeclaration = state.getHierarchicalFacetByName(attributeName);
  var separator = state._getHierarchicalFacetSeparator(facetDeclaration);
  var split = name.split(separator);
  var rootFacet = find(resultsFacets, function(facet) {
    return facet.name === attributeName;
  });

  var facet = split.reduce(function(intermediateFacet, part) {
    var newFacet =
      intermediateFacet && find(intermediateFacet.data, function(f) {
        return f.name === part;
      });
    return newFacet !== undefined ? newFacet : intermediateFacet;
  }, rootFacet);

  var count = (facet && facet.count) || 0;
  var exhaustive = (facet && facet.exhaustive) || false;
  var path = (facet && facet.path) || '';

  return {
    type: 'hierarchical',
    attributeName: attributeName,
    name: path,
    count: count,
    exhaustive: exhaustive
  };
}

module.exports = SearchResults;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/algoliasearch.helper.js":
/*!***********************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/algoliasearch.helper.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var SearchParameters = __webpack_require__(/*! ./SearchParameters */ "./node_modules/algoliasearch-helper/src/SearchParameters/index.js");
var SearchResults = __webpack_require__(/*! ./SearchResults */ "./node_modules/algoliasearch-helper/src/SearchResults/index.js");
var DerivedHelper = __webpack_require__(/*! ./DerivedHelper */ "./node_modules/algoliasearch-helper/src/DerivedHelper/index.js");
var requestBuilder = __webpack_require__(/*! ./requestBuilder */ "./node_modules/algoliasearch-helper/src/requestBuilder.js");

var events = __webpack_require__(/*! events */ "events");
var inherits = __webpack_require__(/*! ./functions/inherits */ "./node_modules/algoliasearch-helper/src/functions/inherits.js");
var objectHasKeys = __webpack_require__(/*! ./functions/objectHasKeys */ "./node_modules/algoliasearch-helper/src/functions/objectHasKeys.js");
var omit = __webpack_require__(/*! ./functions/omit */ "./node_modules/algoliasearch-helper/src/functions/omit.js");
var merge = __webpack_require__(/*! ./functions/merge */ "./node_modules/algoliasearch-helper/src/functions/merge.js");

var version = __webpack_require__(/*! ./version */ "./node_modules/algoliasearch-helper/src/version.js");

/**
 * Event triggered when a parameter is set or updated
 * @event AlgoliaSearchHelper#event:change
 * @property {object} event
 * @property {SearchParameters} event.state the current parameters with the latest changes applied
 * @property {SearchResults} event.results the previous results received from Algolia. `null` before the first request
 * @example
 * helper.on('change', function(event) {
 *   console.log('The parameters have changed');
 * });
 */

/**
 * Event triggered when a main search is sent to Algolia
 * @event AlgoliaSearchHelper#event:search
 * @property {object} event
 * @property {SearchParameters} event.state the parameters used for this search
 * @property {SearchResults} event.results the results from the previous search. `null` if it is the first search.
 * @example
 * helper.on('search', function(event) {
 *   console.log('Search sent');
 * });
 */

/**
 * Event triggered when a search using `searchForFacetValues` is sent to Algolia
 * @event AlgoliaSearchHelper#event:searchForFacetValues
 * @property {object} event
 * @property {SearchParameters} event.state the parameters used for this search it is the first search.
 * @property {string} event.facet the facet searched into
 * @property {string} event.query the query used to search in the facets
 * @example
 * helper.on('searchForFacetValues', function(event) {
 *   console.log('searchForFacetValues sent');
 * });
 */

/**
 * Event triggered when a search using `searchOnce` is sent to Algolia
 * @event AlgoliaSearchHelper#event:searchOnce
 * @property {object} event
 * @property {SearchParameters} event.state the parameters used for this search it is the first search.
 * @example
 * helper.on('searchOnce', function(event) {
 *   console.log('searchOnce sent');
 * });
 */

/**
 * Event triggered when the results are retrieved from Algolia
 * @event AlgoliaSearchHelper#event:result
 * @property {object} event
 * @property {SearchResults} event.results the results received from Algolia
 * @property {SearchParameters} event.state the parameters used to query Algolia. Those might be different from the one in the helper instance (for example if the network is unreliable).
 * @example
 * helper.on('result', function(event) {
 *   console.log('Search results received');
 * });
 */

/**
 * Event triggered when Algolia sends back an error. For example, if an unknown parameter is
 * used, the error can be caught using this event.
 * @event AlgoliaSearchHelper#event:error
 * @property {object} event
 * @property {Error} event.error the error returned by the Algolia.
 * @example
 * helper.on('error', function(event) {
 *   console.log('Houston we got a problem.');
 * });
 */

/**
 * Event triggered when the queue of queries have been depleted (with any result or outdated queries)
 * @event AlgoliaSearchHelper#event:searchQueueEmpty
 * @example
 * helper.on('searchQueueEmpty', function() {
 *   console.log('No more search pending');
 *   // This is received before the result event if we're not expecting new results
 * });
 *
 * helper.search();
 */

/**
 * Initialize a new AlgoliaSearchHelper
 * @class
 * @classdesc The AlgoliaSearchHelper is a class that ease the management of the
 * search. It provides an event based interface for search callbacks:
 *  - change: when the internal search state is changed.
 *    This event contains a {@link SearchParameters} object and the
 *    {@link SearchResults} of the last result if any.
 *  - search: when a search is triggered using the `search()` method.
 *  - result: when the response is retrieved from Algolia and is processed.
 *    This event contains a {@link SearchResults} object and the
 *    {@link SearchParameters} corresponding to this answer.
 *  - error: when the response is an error. This event contains the error returned by the server.
 * @param  {AlgoliaSearch} client an AlgoliaSearch client
 * @param  {string} index the index name to query
 * @param  {SearchParameters | object} options an object defining the initial
 * config of the search. It doesn't have to be a {SearchParameters},
 * just an object containing the properties you need from it.
 */
function AlgoliaSearchHelper(client, index, options) {
  if (typeof client.addAlgoliaAgent === 'function') {
    client.addAlgoliaAgent('JS Helper (' + version + ')');
  }

  this.setClient(client);
  var opts = options || {};
  opts.index = index;
  this.state = SearchParameters.make(opts);
  this.lastResults = null;
  this._queryId = 0;
  this._lastQueryIdReceived = -1;
  this.derivedHelpers = [];
  this._currentNbQueries = 0;
}

inherits(AlgoliaSearchHelper, events.EventEmitter);

/**
 * Start the search with the parameters set in the state. When the
 * method is called, it triggers a `search` event. The results will
 * be available through the `result` event. If an error occurs, an
 * `error` will be fired instead.
 * @return {AlgoliaSearchHelper}
 * @fires search
 * @fires result
 * @fires error
 * @chainable
 */
AlgoliaSearchHelper.prototype.search = function() {
  this._search({onlyWithDerivedHelpers: false});
  return this;
};

AlgoliaSearchHelper.prototype.searchOnlyWithDerivedHelpers = function() {
  this._search({onlyWithDerivedHelpers: true});
  return this;
};

/**
 * Gets the search query parameters that would be sent to the Algolia Client
 * for the hits
 * @return {object} Query Parameters
 */
AlgoliaSearchHelper.prototype.getQuery = function() {
  var state = this.state;
  return requestBuilder._getHitsSearchParams(state);
};

/**
 * Start a search using a modified version of the current state. This method does
 * not trigger the helper lifecycle and does not modify the state kept internally
 * by the helper. This second aspect means that the next search call will be the
 * same as a search call before calling searchOnce.
 * @param {object} options can contain all the parameters that can be set to SearchParameters
 * plus the index
 * @param {function} [callback] optional callback executed when the response from the
 * server is back.
 * @return {promise|undefined} if a callback is passed the method returns undefined
 * otherwise it returns a promise containing an object with two keys :
 *  - content with a SearchResults
 *  - state with the state used for the query as a SearchParameters
 * @example
 * // Changing the number of records returned per page to 1
 * // This example uses the callback API
 * var state = helper.searchOnce({hitsPerPage: 1},
 *   function(error, content, state) {
 *     // if an error occurred it will be passed in error, otherwise its value is null
 *     // content contains the results formatted as a SearchResults
 *     // state is the instance of SearchParameters used for this search
 *   });
 * @example
 * // Changing the number of records returned per page to 1
 * // This example uses the promise API
 * var state1 = helper.searchOnce({hitsPerPage: 1})
 *                 .then(promiseHandler);
 *
 * function promiseHandler(res) {
 *   // res contains
 *   // {
 *   //   content : SearchResults
 *   //   state   : SearchParameters (the one used for this specific search)
 *   // }
 * }
 */
AlgoliaSearchHelper.prototype.searchOnce = function(options, cb) {
  var tempState = !options ? this.state : this.state.setQueryParameters(options);
  var queries = requestBuilder._getQueries(tempState.index, tempState);
  var self = this;

  this._currentNbQueries++;

  this.emit('searchOnce', {
    state: tempState
  });

  if (cb) {
    this.client
      .search(queries)
      .then(function(content) {
        self._currentNbQueries--;
        if (self._currentNbQueries === 0) {
          self.emit('searchQueueEmpty');
        }

        cb(null, new SearchResults(tempState, content.results), tempState);
      })
      .catch(function(err) {
        self._currentNbQueries--;
        if (self._currentNbQueries === 0) {
          self.emit('searchQueueEmpty');
        }

        cb(err, null, tempState);
      });

    return undefined;
  }

  return this.client.search(queries).then(function(content) {
    self._currentNbQueries--;
    if (self._currentNbQueries === 0) self.emit('searchQueueEmpty');
    return {
      content: new SearchResults(tempState, content.results),
      state: tempState,
      _originalResponse: content
    };
  }, function(e) {
    self._currentNbQueries--;
    if (self._currentNbQueries === 0) self.emit('searchQueueEmpty');
    throw e;
  });
};

 /**
 * Start the search for answers with the parameters set in the state.
 * This method returns a promise.
 * @param {Object} options - the options for answers API call
 * @param {string[]} options.attributesForPrediction - Attributes to use for predictions. If empty, `searchableAttributes` is used instead.
 * @param {string[]} options.queryLanguages - The languages in the query. Currently only supports ['en'].
 * @param {number} options.nbHits - Maximum number of answers to retrieve from the Answers Engine. Cannot be greater than 1000.
 *
 * @return {promise} the answer results
 */
AlgoliaSearchHelper.prototype.findAnswers = function(options) {
  var state = this.state;
  var derivedHelper = this.derivedHelpers[0];
  if (!derivedHelper) {
    return Promise.resolve([]);
  }
  var derivedState = derivedHelper.getModifiedState(state);
  var data = merge(
    {
      attributesForPrediction: options.attributesForPrediction,
      nbHits: options.nbHits
    },
    {
      params: omit(requestBuilder._getHitsSearchParams(derivedState), [
        'attributesToSnippet',
        'hitsPerPage',
        'restrictSearchableAttributes',
        'snippetEllipsisText' // FIXME remove this line once the engine is fixed.
      ])
    }
  );

  var errorMessage = 'search for answers was called, but this client does not have a function client.initIndex(index).findAnswers';
  if (typeof this.client.initIndex !== 'function') {
    throw new Error(errorMessage);
  }
  var index = this.client.initIndex(derivedState.index);
  if (typeof index.findAnswers !== 'function') {
    throw new Error(errorMessage);
  }
  return index.findAnswers(derivedState.query, options.queryLanguages, data);
};

/**
 * Structure of each result when using
 * [`searchForFacetValues()`](reference.html#AlgoliaSearchHelper#searchForFacetValues)
 * @typedef FacetSearchHit
 * @type {object}
 * @property {string} value the facet value
 * @property {string} highlighted the facet value highlighted with the query string
 * @property {number} count number of occurrence of this facet value
 * @property {boolean} isRefined true if the value is already refined
 */

/**
 * Structure of the data resolved by the
 * [`searchForFacetValues()`](reference.html#AlgoliaSearchHelper#searchForFacetValues)
 * promise.
 * @typedef FacetSearchResult
 * @type {object}
 * @property {FacetSearchHit} facetHits the results for this search for facet values
 * @property {number} processingTimeMS time taken by the query inside the engine
 */

/**
 * Search for facet values based on an query and the name of a faceted attribute. This
 * triggers a search and will return a promise. On top of using the query, it also sends
 * the parameters from the state so that the search is narrowed down to only the possible values.
 *
 * See the description of [FacetSearchResult](reference.html#FacetSearchResult)
 * @param {string} facet the name of the faceted attribute
 * @param {string} query the string query for the search
 * @param {number} [maxFacetHits] the maximum number values returned. Should be > 0 and <= 100
 * @param {object} [userState] the set of custom parameters to use on top of the current state. Setting a property to `undefined` removes
 * it in the generated query.
 * @return {promise.<FacetSearchResult>} the results of the search
 */
AlgoliaSearchHelper.prototype.searchForFacetValues = function(facet, query, maxFacetHits, userState) {
  var clientHasSFFV = typeof this.client.searchForFacetValues === 'function';
  if (
    !clientHasSFFV &&
    typeof this.client.initIndex !== 'function'
  ) {
    throw new Error(
      'search for facet values (searchable) was called, but this client does not have a function client.searchForFacetValues or client.initIndex(index).searchForFacetValues'
    );
  }
  var state = this.state.setQueryParameters(userState || {});
  var isDisjunctive = state.isDisjunctiveFacet(facet);
  var algoliaQuery = requestBuilder.getSearchForFacetQuery(facet, query, maxFacetHits, state);

  this._currentNbQueries++;
  var self = this;

  this.emit('searchForFacetValues', {
    state: state,
    facet: facet,
    query: query
  });

  var searchForFacetValuesPromise = clientHasSFFV
    ? this.client.searchForFacetValues([{indexName: state.index, params: algoliaQuery}])
    : this.client.initIndex(state.index).searchForFacetValues(algoliaQuery);

  return searchForFacetValuesPromise.then(function addIsRefined(content) {
    self._currentNbQueries--;
    if (self._currentNbQueries === 0) self.emit('searchQueueEmpty');

    content = Array.isArray(content) ? content[0] : content;

    content.facetHits.forEach(function(f) {
      f.isRefined = isDisjunctive
        ? state.isDisjunctiveFacetRefined(facet, f.value)
        : state.isFacetRefined(facet, f.value);
    });

    return content;
  }, function(e) {
    self._currentNbQueries--;
    if (self._currentNbQueries === 0) self.emit('searchQueueEmpty');
    throw e;
  });
};

/**
 * Sets the text query used for the search.
 *
 * This method resets the current page to 0.
 * @param  {string} q the user query
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.setQuery = function(q) {
  this._change({
    state: this.state.resetPage().setQuery(q),
    isPageReset: true
  });

  return this;
};

/**
 * Remove all the types of refinements except tags. A string can be provided to remove
 * only the refinements of a specific attribute. For more advanced use case, you can
 * provide a function instead. This function should follow the
 * [clearCallback definition](#SearchParameters.clearCallback).
 *
 * This method resets the current page to 0.
 * @param {string} [name] optional name of the facet / attribute on which we want to remove all refinements
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 * @example
 * // Removing all the refinements
 * helper.clearRefinements().search();
 * @example
 * // Removing all the filters on a the category attribute.
 * helper.clearRefinements('category').search();
 * @example
 * // Removing only the exclude filters on the category facet.
 * helper.clearRefinements(function(value, attribute, type) {
 *   return type === 'exclude' && attribute === 'category';
 * }).search();
 */
AlgoliaSearchHelper.prototype.clearRefinements = function(name) {
  this._change({
    state: this.state.resetPage().clearRefinements(name),
    isPageReset: true
  });

  return this;
};

/**
 * Remove all the tag filters.
 *
 * This method resets the current page to 0.
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.clearTags = function() {
  this._change({
    state: this.state.resetPage().clearTags(),
    isPageReset: true
  });

  return this;
};

/**
 * Adds a disjunctive filter to a faceted attribute with the `value` provided. If the
 * filter is already set, it doesn't change the filters.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} value the associated value (will be converted to string)
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.addDisjunctiveFacetRefinement = function(facet, value) {
  this._change({
    state: this.state.resetPage().addDisjunctiveFacetRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#addDisjunctiveFacetRefinement}
 */
AlgoliaSearchHelper.prototype.addDisjunctiveRefine = function() {
  return this.addDisjunctiveFacetRefinement.apply(this, arguments);
};

/**
 * Adds a refinement on a hierarchical facet. It will throw
 * an exception if the facet is not defined or if the facet
 * is already refined.
 *
 * This method resets the current page to 0.
 * @param {string} facet the facet name
 * @param {string} path the hierarchical facet path
 * @return {AlgoliaSearchHelper}
 * @throws Error if the facet is not defined or if the facet is refined
 * @chainable
 * @fires change
 */
AlgoliaSearchHelper.prototype.addHierarchicalFacetRefinement = function(facet, value) {
  this._change({
    state: this.state.resetPage().addHierarchicalFacetRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * Adds a an numeric filter to an attribute with the `operator` and `value` provided. If the
 * filter is already set, it doesn't change the filters.
 *
 * This method resets the current page to 0.
 * @param  {string} attribute the attribute on which the numeric filter applies
 * @param  {string} operator the operator of the filter
 * @param  {number} value the value of the filter
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.addNumericRefinement = function(attribute, operator, value) {
  this._change({
    state: this.state.resetPage().addNumericRefinement(attribute, operator, value),
    isPageReset: true
  });

  return this;
};

/**
 * Adds a filter to a faceted attribute with the `value` provided. If the
 * filter is already set, it doesn't change the filters.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} value the associated value (will be converted to string)
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.addFacetRefinement = function(facet, value) {
  this._change({
    state: this.state.resetPage().addFacetRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#addFacetRefinement}
 */
AlgoliaSearchHelper.prototype.addRefine = function() {
  return this.addFacetRefinement.apply(this, arguments);
};


/**
 * Adds a an exclusion filter to a faceted attribute with the `value` provided. If the
 * filter is already set, it doesn't change the filters.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} value the associated value (will be converted to string)
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.addFacetExclusion = function(facet, value) {
  this._change({
    state: this.state.resetPage().addExcludeRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#addFacetExclusion}
 */
AlgoliaSearchHelper.prototype.addExclude = function() {
  return this.addFacetExclusion.apply(this, arguments);
};

/**
 * Adds a tag filter with the `tag` provided. If the
 * filter is already set, it doesn't change the filters.
 *
 * This method resets the current page to 0.
 * @param {string} tag the tag to add to the filter
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.addTag = function(tag) {
  this._change({
    state: this.state.resetPage().addTagRefinement(tag),
    isPageReset: true
  });

  return this;
};

/**
 * Removes an numeric filter to an attribute with the `operator` and `value` provided. If the
 * filter is not set, it doesn't change the filters.
 *
 * Some parameters are optional, triggering different behavior:
 *  - if the value is not provided, then all the numeric value will be removed for the
 *  specified attribute/operator couple.
 *  - if the operator is not provided either, then all the numeric filter on this attribute
 *  will be removed.
 *
 * This method resets the current page to 0.
 * @param  {string} attribute the attribute on which the numeric filter applies
 * @param  {string} [operator] the operator of the filter
 * @param  {number} [value] the value of the filter
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.removeNumericRefinement = function(attribute, operator, value) {
  this._change({
    state: this.state.resetPage().removeNumericRefinement(attribute, operator, value),
    isPageReset: true
  });

  return this;
};

/**
 * Removes a disjunctive filter to a faceted attribute with the `value` provided. If the
 * filter is not set, it doesn't change the filters.
 *
 * If the value is omitted, then this method will remove all the filters for the
 * attribute.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} [value] the associated value
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.removeDisjunctiveFacetRefinement = function(facet, value) {
  this._change({
    state: this.state.resetPage().removeDisjunctiveFacetRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#removeDisjunctiveFacetRefinement}
 */
AlgoliaSearchHelper.prototype.removeDisjunctiveRefine = function() {
  return this.removeDisjunctiveFacetRefinement.apply(this, arguments);
};

/**
 * Removes the refinement set on a hierarchical facet.
 * @param {string} facet the facet name
 * @return {AlgoliaSearchHelper}
 * @throws Error if the facet is not defined or if the facet is not refined
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.removeHierarchicalFacetRefinement = function(facet) {
  this._change({
    state: this.state.resetPage().removeHierarchicalFacetRefinement(facet),
    isPageReset: true
  });

  return this;
};

/**
 * Removes a filter to a faceted attribute with the `value` provided. If the
 * filter is not set, it doesn't change the filters.
 *
 * If the value is omitted, then this method will remove all the filters for the
 * attribute.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} [value] the associated value
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.removeFacetRefinement = function(facet, value) {
  this._change({
    state: this.state.resetPage().removeFacetRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#removeFacetRefinement}
 */
AlgoliaSearchHelper.prototype.removeRefine = function() {
  return this.removeFacetRefinement.apply(this, arguments);
};

/**
 * Removes an exclusion filter to a faceted attribute with the `value` provided. If the
 * filter is not set, it doesn't change the filters.
 *
 * If the value is omitted, then this method will remove all the filters for the
 * attribute.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} [value] the associated value
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.removeFacetExclusion = function(facet, value) {
  this._change({
    state: this.state.resetPage().removeExcludeRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#removeFacetExclusion}
 */
AlgoliaSearchHelper.prototype.removeExclude = function() {
  return this.removeFacetExclusion.apply(this, arguments);
};

/**
 * Removes a tag filter with the `tag` provided. If the
 * filter is not set, it doesn't change the filters.
 *
 * This method resets the current page to 0.
 * @param {string} tag tag to remove from the filter
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.removeTag = function(tag) {
  this._change({
    state: this.state.resetPage().removeTagRefinement(tag),
    isPageReset: true
  });

  return this;
};

/**
 * Adds or removes an exclusion filter to a faceted attribute with the `value` provided. If
 * the value is set then it removes it, otherwise it adds the filter.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} value the associated value
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.toggleFacetExclusion = function(facet, value) {
  this._change({
    state: this.state.resetPage().toggleExcludeFacetRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#toggleFacetExclusion}
 */
AlgoliaSearchHelper.prototype.toggleExclude = function() {
  return this.toggleFacetExclusion.apply(this, arguments);
};

/**
 * Adds or removes a filter to a faceted attribute with the `value` provided. If
 * the value is set then it removes it, otherwise it adds the filter.
 *
 * This method can be used for conjunctive, disjunctive and hierarchical filters.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} value the associated value
 * @return {AlgoliaSearchHelper}
 * @throws Error will throw an error if the facet is not declared in the settings of the helper
 * @fires change
 * @chainable
 * @deprecated since version 2.19.0, see {@link AlgoliaSearchHelper#toggleFacetRefinement}
 */
AlgoliaSearchHelper.prototype.toggleRefinement = function(facet, value) {
  return this.toggleFacetRefinement(facet, value);
};

/**
 * Adds or removes a filter to a faceted attribute with the `value` provided. If
 * the value is set then it removes it, otherwise it adds the filter.
 *
 * This method can be used for conjunctive, disjunctive and hierarchical filters.
 *
 * This method resets the current page to 0.
 * @param  {string} facet the facet to refine
 * @param  {string} value the associated value
 * @return {AlgoliaSearchHelper}
 * @throws Error will throw an error if the facet is not declared in the settings of the helper
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.toggleFacetRefinement = function(facet, value) {
  this._change({
    state: this.state.resetPage().toggleFacetRefinement(facet, value),
    isPageReset: true
  });

  return this;
};

/**
 * @deprecated since version 2.4.0, see {@link AlgoliaSearchHelper#toggleFacetRefinement}
 */
AlgoliaSearchHelper.prototype.toggleRefine = function() {
  return this.toggleFacetRefinement.apply(this, arguments);
};

/**
 * Adds or removes a tag filter with the `value` provided. If
 * the value is set then it removes it, otherwise it adds the filter.
 *
 * This method resets the current page to 0.
 * @param {string} tag tag to remove or add
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.toggleTag = function(tag) {
  this._change({
    state: this.state.resetPage().toggleTagRefinement(tag),
    isPageReset: true
  });

  return this;
};

/**
 * Increments the page number by one.
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 * @example
 * helper.setPage(0).nextPage().getPage();
 * // returns 1
 */
AlgoliaSearchHelper.prototype.nextPage = function() {
  var page = this.state.page || 0;
  return this.setPage(page + 1);
};

/**
 * Decrements the page number by one.
 * @fires change
 * @return {AlgoliaSearchHelper}
 * @chainable
 * @example
 * helper.setPage(1).previousPage().getPage();
 * // returns 0
 */
AlgoliaSearchHelper.prototype.previousPage = function() {
  var page = this.state.page || 0;
  return this.setPage(page - 1);
};

/**
 * @private
 */
function setCurrentPage(page) {
  if (page < 0) throw new Error('Page requested below 0.');

  this._change({
    state: this.state.setPage(page),
    isPageReset: false
  });

  return this;
}

/**
 * Change the current page
 * @deprecated
 * @param  {number} page The page number
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.setCurrentPage = setCurrentPage;

/**
 * Updates the current page.
 * @function
 * @param  {number} page The page number
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.setPage = setCurrentPage;

/**
 * Updates the name of the index that will be targeted by the query.
 *
 * This method resets the current page to 0.
 * @param {string} name the index name
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.setIndex = function(name) {
  this._change({
    state: this.state.resetPage().setIndex(name),
    isPageReset: true
  });

  return this;
};

/**
 * Update a parameter of the search. This method reset the page
 *
 * The complete list of parameters is available on the
 * [Algolia website](https://www.algolia.com/doc/rest#query-an-index).
 * The most commonly used parameters have their own [shortcuts](#query-parameters-shortcuts)
 * or benefit from higher-level APIs (all the kind of filters and facets have their own API)
 *
 * This method resets the current page to 0.
 * @param {string} parameter name of the parameter to update
 * @param {any} value new value of the parameter
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 * @example
 * helper.setQueryParameter('hitsPerPage', 20).search();
 */
AlgoliaSearchHelper.prototype.setQueryParameter = function(parameter, value) {
  this._change({
    state: this.state.resetPage().setQueryParameter(parameter, value),
    isPageReset: true
  });

  return this;
};

/**
 * Set the whole state (warning: will erase previous state)
 * @param {SearchParameters} newState the whole new state
 * @return {AlgoliaSearchHelper}
 * @fires change
 * @chainable
 */
AlgoliaSearchHelper.prototype.setState = function(newState) {
  this._change({
    state: SearchParameters.make(newState),
    isPageReset: false
  });

  return this;
};

/**
 * Override the current state without triggering a change event.
 * Do not use this method unless you know what you are doing. (see the example
 * for a legit use case)
 * @param {SearchParameters} newState the whole new state
 * @return {AlgoliaSearchHelper}
 * @example
 *  helper.on('change', function(state){
 *    // In this function you might want to find a way to store the state in the url/history
 *    updateYourURL(state)
 *  })
 *  window.onpopstate = function(event){
 *    // This is naive though as you should check if the state is really defined etc.
 *    helper.overrideStateWithoutTriggeringChangeEvent(event.state).search()
 *  }
 * @chainable
 */
AlgoliaSearchHelper.prototype.overrideStateWithoutTriggeringChangeEvent = function(newState) {
  this.state = new SearchParameters(newState);
  return this;
};

/**
 * Check if an attribute has any numeric, conjunctive, disjunctive or hierarchical filters.
 * @param {string} attribute the name of the attribute
 * @return {boolean} true if the attribute is filtered by at least one value
 * @example
 * // hasRefinements works with numeric, conjunctive, disjunctive and hierarchical filters
 * helper.hasRefinements('price'); // false
 * helper.addNumericRefinement('price', '>', 100);
 * helper.hasRefinements('price'); // true
 *
 * helper.hasRefinements('color'); // false
 * helper.addFacetRefinement('color', 'blue');
 * helper.hasRefinements('color'); // true
 *
 * helper.hasRefinements('material'); // false
 * helper.addDisjunctiveFacetRefinement('material', 'plastic');
 * helper.hasRefinements('material'); // true
 *
 * helper.hasRefinements('categories'); // false
 * helper.toggleFacetRefinement('categories', 'kitchen > knife');
 * helper.hasRefinements('categories'); // true
 *
 */
AlgoliaSearchHelper.prototype.hasRefinements = function(attribute) {
  if (objectHasKeys(this.state.getNumericRefinements(attribute))) {
    return true;
  } else if (this.state.isConjunctiveFacet(attribute)) {
    return this.state.isFacetRefined(attribute);
  } else if (this.state.isDisjunctiveFacet(attribute)) {
    return this.state.isDisjunctiveFacetRefined(attribute);
  } else if (this.state.isHierarchicalFacet(attribute)) {
    return this.state.isHierarchicalFacetRefined(attribute);
  }

  // there's currently no way to know that the user did call `addNumericRefinement` at some point
  // thus we cannot distinguish if there once was a numeric refinement that was cleared
  // so we will return false in every other situations to be consistent
  // while what we should do here is throw because we did not find the attribute in any type
  // of refinement
  return false;
};

/**
 * Check if a value is excluded for a specific faceted attribute. If the value
 * is omitted then the function checks if there is any excluding refinements.
 *
 * @param  {string}  facet name of the attribute for used for faceting
 * @param  {string}  [value] optional value. If passed will test that this value
   * is filtering the given facet.
 * @return {boolean} true if refined
 * @example
 * helper.isExcludeRefined('color'); // false
 * helper.isExcludeRefined('color', 'blue') // false
 * helper.isExcludeRefined('color', 'red') // false
 *
 * helper.addFacetExclusion('color', 'red');
 *
 * helper.isExcludeRefined('color'); // true
 * helper.isExcludeRefined('color', 'blue') // false
 * helper.isExcludeRefined('color', 'red') // true
 */
AlgoliaSearchHelper.prototype.isExcluded = function(facet, value) {
  return this.state.isExcludeRefined(facet, value);
};

/**
 * @deprecated since 2.4.0, see {@link AlgoliaSearchHelper#hasRefinements}
 */
AlgoliaSearchHelper.prototype.isDisjunctiveRefined = function(facet, value) {
  return this.state.isDisjunctiveFacetRefined(facet, value);
};

/**
 * Check if the string is a currently filtering tag.
 * @param {string} tag tag to check
 * @return {boolean}
 */
AlgoliaSearchHelper.prototype.hasTag = function(tag) {
  return this.state.isTagRefined(tag);
};

/**
 * @deprecated since 2.4.0, see {@link AlgoliaSearchHelper#hasTag}
 */
AlgoliaSearchHelper.prototype.isTagRefined = function() {
  return this.hasTagRefinements.apply(this, arguments);
};


/**
 * Get the name of the currently used index.
 * @return {string}
 * @example
 * helper.setIndex('highestPrice_products').getIndex();
 * // returns 'highestPrice_products'
 */
AlgoliaSearchHelper.prototype.getIndex = function() {
  return this.state.index;
};

function getCurrentPage() {
  return this.state.page;
}

/**
 * Get the currently selected page
 * @deprecated
 * @return {number} the current page
 */
AlgoliaSearchHelper.prototype.getCurrentPage = getCurrentPage;
/**
 * Get the currently selected page
 * @function
 * @return {number} the current page
 */
AlgoliaSearchHelper.prototype.getPage = getCurrentPage;

/**
 * Get all the tags currently set to filters the results.
 *
 * @return {string[]} The list of tags currently set.
 */
AlgoliaSearchHelper.prototype.getTags = function() {
  return this.state.tagRefinements;
};

/**
 * Get the list of refinements for a given attribute. This method works with
 * conjunctive, disjunctive, excluding and numerical filters.
 *
 * See also SearchResults#getRefinements
 *
 * @param {string} facetName attribute name used for faceting
 * @return {Array.<FacetRefinement|NumericRefinement>} All Refinement are objects that contain a value, and
 * a type. Numeric also contains an operator.
 * @example
 * helper.addNumericRefinement('price', '>', 100);
 * helper.getRefinements('price');
 * // [
 * //   {
 * //     "value": [
 * //       100
 * //     ],
 * //     "operator": ">",
 * //     "type": "numeric"
 * //   }
 * // ]
 * @example
 * helper.addFacetRefinement('color', 'blue');
 * helper.addFacetExclusion('color', 'red');
 * helper.getRefinements('color');
 * // [
 * //   {
 * //     "value": "blue",
 * //     "type": "conjunctive"
 * //   },
 * //   {
 * //     "value": "red",
 * //     "type": "exclude"
 * //   }
 * // ]
 * @example
 * helper.addDisjunctiveFacetRefinement('material', 'plastic');
 * // [
 * //   {
 * //     "value": "plastic",
 * //     "type": "disjunctive"
 * //   }
 * // ]
 */
AlgoliaSearchHelper.prototype.getRefinements = function(facetName) {
  var refinements = [];

  if (this.state.isConjunctiveFacet(facetName)) {
    var conjRefinements = this.state.getConjunctiveRefinements(facetName);

    conjRefinements.forEach(function(r) {
      refinements.push({
        value: r,
        type: 'conjunctive'
      });
    });

    var excludeRefinements = this.state.getExcludeRefinements(facetName);

    excludeRefinements.forEach(function(r) {
      refinements.push({
        value: r,
        type: 'exclude'
      });
    });
  } else if (this.state.isDisjunctiveFacet(facetName)) {
    var disjRefinements = this.state.getDisjunctiveRefinements(facetName);

    disjRefinements.forEach(function(r) {
      refinements.push({
        value: r,
        type: 'disjunctive'
      });
    });
  }

  var numericRefinements = this.state.getNumericRefinements(facetName);

  Object.keys(numericRefinements).forEach(function(operator) {
    var value = numericRefinements[operator];

    refinements.push({
      value: value,
      operator: operator,
      type: 'numeric'
    });
  });

  return refinements;
};

/**
 * Return the current refinement for the (attribute, operator)
 * @param {string} attribute attribute in the record
 * @param {string} operator operator applied on the refined values
 * @return {Array.<number|number[]>} refined values
 */
AlgoliaSearchHelper.prototype.getNumericRefinement = function(attribute, operator) {
  return this.state.getNumericRefinement(attribute, operator);
};

/**
 * Get the current breadcrumb for a hierarchical facet, as an array
 * @param  {string} facetName Hierarchical facet name
 * @return {array.<string>} the path as an array of string
 */
AlgoliaSearchHelper.prototype.getHierarchicalFacetBreadcrumb = function(facetName) {
  return this.state.getHierarchicalFacetBreadcrumb(facetName);
};

// /////////// PRIVATE

/**
 * Perform the underlying queries
 * @private
 * @return {undefined}
 * @fires search
 * @fires result
 * @fires error
 */
AlgoliaSearchHelper.prototype._search = function(options) {
  var state = this.state;
  var states = [];
  var mainQueries = [];

  if (!options.onlyWithDerivedHelpers) {
    mainQueries = requestBuilder._getQueries(state.index, state);

    states.push({
      state: state,
      queriesCount: mainQueries.length,
      helper: this
    });

    this.emit('search', {
      state: state,
      results: this.lastResults
    });
  }

  var derivedQueries = this.derivedHelpers.map(function(derivedHelper) {
    var derivedState = derivedHelper.getModifiedState(state);
    var derivedStateQueries = requestBuilder._getQueries(derivedState.index, derivedState);

    states.push({
      state: derivedState,
      queriesCount: derivedStateQueries.length,
      helper: derivedHelper
    });

    derivedHelper.emit('search', {
      state: derivedState,
      results: derivedHelper.lastResults
    });

    return derivedStateQueries;
  });

  var queries = Array.prototype.concat.apply(mainQueries, derivedQueries);
  var queryId = this._queryId++;

  this._currentNbQueries++;

  try {
    this.client.search(queries)
      .then(this._dispatchAlgoliaResponse.bind(this, states, queryId))
      .catch(this._dispatchAlgoliaError.bind(this, queryId));
  } catch (error) {
    // If we reach this part, we're in an internal error state
    this.emit('error', {
      error: error
    });
  }
};

/**
 * Transform the responses as sent by the server and transform them into a user
 * usable object that merge the results of all the batch requests. It will dispatch
 * over the different helper + derived helpers (when there are some).
 * @private
 * @param {array.<{SearchParameters, AlgoliaQueries, AlgoliaSearchHelper}>}
 *  state state used for to generate the request
 * @param {number} queryId id of the current request
 * @param {object} content content of the response
 * @return {undefined}
 */
AlgoliaSearchHelper.prototype._dispatchAlgoliaResponse = function(states, queryId, content) {
  // FIXME remove the number of outdated queries discarded instead of just one

  if (queryId < this._lastQueryIdReceived) {
    // Outdated answer
    return;
  }

  this._currentNbQueries -= (queryId - this._lastQueryIdReceived);
  this._lastQueryIdReceived = queryId;

  if (this._currentNbQueries === 0) this.emit('searchQueueEmpty');

  var results = content.results.slice();

  states.forEach(function(s) {
    var state = s.state;
    var queriesCount = s.queriesCount;
    var helper = s.helper;
    var specificResults = results.splice(0, queriesCount);

    var formattedResponse = helper.lastResults = new SearchResults(state, specificResults);

    helper.emit('result', {
      results: formattedResponse,
      state: state
    });
  });
};

AlgoliaSearchHelper.prototype._dispatchAlgoliaError = function(queryId, error) {
  if (queryId < this._lastQueryIdReceived) {
    // Outdated answer
    return;
  }

  this._currentNbQueries -= queryId - this._lastQueryIdReceived;
  this._lastQueryIdReceived = queryId;

  this.emit('error', {
    error: error
  });

  if (this._currentNbQueries === 0) this.emit('searchQueueEmpty');
};

AlgoliaSearchHelper.prototype.containsRefinement = function(query, facetFilters, numericFilters, tagFilters) {
  return query ||
    facetFilters.length !== 0 ||
    numericFilters.length !== 0 ||
    tagFilters.length !== 0;
};

/**
 * Test if there are some disjunctive refinements on the facet
 * @private
 * @param {string} facet the attribute to test
 * @return {boolean}
 */
AlgoliaSearchHelper.prototype._hasDisjunctiveRefinements = function(facet) {
  return this.state.disjunctiveRefinements[facet] &&
    this.state.disjunctiveRefinements[facet].length > 0;
};

AlgoliaSearchHelper.prototype._change = function(event) {
  var state = event.state;
  var isPageReset = event.isPageReset;

  if (state !== this.state) {
    this.state = state;

    this.emit('change', {
      state: this.state,
      results: this.lastResults,
      isPageReset: isPageReset
    });
  }
};

/**
 * Clears the cache of the underlying Algolia client.
 * @return {AlgoliaSearchHelper}
 */
AlgoliaSearchHelper.prototype.clearCache = function() {
  this.client.clearCache && this.client.clearCache();
  return this;
};

/**
 * Updates the internal client instance. If the reference of the clients
 * are equal then no update is actually done.
 * @param  {AlgoliaSearch} newClient an AlgoliaSearch client
 * @return {AlgoliaSearchHelper}
 */
AlgoliaSearchHelper.prototype.setClient = function(newClient) {
  if (this.client === newClient) return this;

  if (typeof newClient.addAlgoliaAgent === 'function') {
    newClient.addAlgoliaAgent('JS Helper (' + version + ')');
  }
  this.client = newClient;

  return this;
};

/**
 * Gets the instance of the currently used client.
 * @return {AlgoliaSearch}
 */
AlgoliaSearchHelper.prototype.getClient = function() {
  return this.client;
};

/**
 * Creates an derived instance of the Helper. A derived helper
 * is a way to request other indices synchronised with the lifecycle
 * of the main Helper. This mechanism uses the multiqueries feature
 * of Algolia to aggregate all the requests in a single network call.
 *
 * This method takes a function that is used to create a new SearchParameter
 * that will be used to create requests to Algolia. Those new requests
 * are created just before the `search` event. The signature of the function
 * is `SearchParameters -> SearchParameters`.
 *
 * This method returns a new DerivedHelper which is an EventEmitter
 * that fires the same `search`, `result` and `error` events. Those
 * events, however, will receive data specific to this DerivedHelper
 * and the SearchParameters that is returned by the call of the
 * parameter function.
 * @param {function} fn SearchParameters -> SearchParameters
 * @return {DerivedHelper}
 */
AlgoliaSearchHelper.prototype.derive = function(fn) {
  var derivedHelper = new DerivedHelper(this, fn);
  this.derivedHelpers.push(derivedHelper);
  return derivedHelper;
};

/**
 * This method detaches a derived Helper from the main one. Prefer using the one from the
 * derived helper itself, to remove the event listeners too.
 * @private
 * @return {undefined}
 * @throws Error
 */
AlgoliaSearchHelper.prototype.detachDerivedHelper = function(derivedHelper) {
  var pos = this.derivedHelpers.indexOf(derivedHelper);
  if (pos === -1) throw new Error('Derived helper already detached');
  this.derivedHelpers.splice(pos, 1);
};

/**
 * This method returns true if there is currently at least one on-going search.
 * @return {boolean} true if there is a search pending
 */
AlgoliaSearchHelper.prototype.hasPendingRequests = function() {
  return this._currentNbQueries > 0;
};

/**
 * @typedef AlgoliaSearchHelper.NumericRefinement
 * @type {object}
 * @property {number[]} value the numbers that are used for filtering this attribute with
 * the operator specified.
 * @property {string} operator the faceting data: value, number of entries
 * @property {string} type will be 'numeric'
 */

/**
 * @typedef AlgoliaSearchHelper.FacetRefinement
 * @type {object}
 * @property {string} value the string use to filter the attribute
 * @property {string} type the type of filter: 'conjunctive', 'disjunctive', 'exclude'
 */

module.exports = AlgoliaSearchHelper;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/compact.js":
/*!********************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/compact.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function compact(array) {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.filter(Boolean);
};


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/defaultsPure.js":
/*!*************************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/defaultsPure.js ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";


// NOTE: this behaves like lodash/defaults, but doesn't mutate the target
// it also preserve keys order
module.exports = function defaultsPure() {
  var sources = Array.prototype.slice.call(arguments);

  return sources.reduceRight(function(acc, source) {
    Object.keys(Object(source)).forEach(function(key) {
      if (source[key] === undefined) {
        return;
      }
      if (acc[key] !== undefined) {
        // remove if already added, so that we can add it in correct order
        delete acc[key];
      }
      acc[key] = source[key];
    });
    return acc;
  }, {});
};


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/find.js":
/*!*****************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/find.js ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";


// @MAJOR can be replaced by native Array#find when we change support
module.exports = function find(array, comparator) {
  if (!Array.isArray(array)) {
    return undefined;
  }

  for (var i = 0; i < array.length; i++) {
    if (comparator(array[i])) {
      return array[i];
    }
  }
};


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/findIndex.js":
/*!**********************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/findIndex.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


// @MAJOR can be replaced by native Array#findIndex when we change support
module.exports = function find(array, comparator) {
  if (!Array.isArray(array)) {
    return -1;
  }

  for (var i = 0; i < array.length; i++) {
    if (comparator(array[i])) {
      return i;
    }
  }
  return -1;
};


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/formatSort.js":
/*!***********************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/formatSort.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var find = __webpack_require__(/*! ./find */ "./node_modules/algoliasearch-helper/src/functions/find.js");

/**
 * Transform sort format from user friendly notation to lodash format
 * @param {string[]} sortBy array of predicate of the form "attribute:order"
 * @param {string[]} [defaults] array of predicate of the form "attribute:order"
 * @return {array.<string[]>} array containing 2 elements : attributes, orders
 */
module.exports = function formatSort(sortBy, defaults) {
  var defaultInstructions = (defaults || []).map(function(sort) {
    return sort.split(':');
  });

  return sortBy.reduce(
    function preparePredicate(out, sort) {
      var sortInstruction = sort.split(':');

      var matchingDefault = find(defaultInstructions, function(
        defaultInstruction
      ) {
        return defaultInstruction[0] === sortInstruction[0];
      });

      if (sortInstruction.length > 1 || !matchingDefault) {
        out[0].push(sortInstruction[0]);
        out[1].push(sortInstruction[1]);
        return out;
      }

      out[0].push(matchingDefault[0]);
      out[1].push(matchingDefault[1]);
      return out;
    },
    [[], []]
  );
};


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/inherits.js":
/*!*********************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/inherits.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


function inherits(ctor, superCtor) {
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

module.exports = inherits;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/intersection.js":
/*!*************************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/intersection.js ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";


function intersection(arr1, arr2) {
  return arr1.filter(function(value, index) {
    return (
      arr2.indexOf(value) > -1 &&
      arr1.indexOf(value) === index /* skips duplicates */
    );
  });
}

module.exports = intersection;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/merge.js":
/*!******************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/merge.js ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";


function clone(value) {
  if (typeof value === 'object' && value !== null) {
    return _merge(Array.isArray(value) ? [] : {}, value);
  }
  return value;
}

function isObjectOrArrayOrFunction(value) {
  return (
    typeof value === 'function' ||
    Array.isArray(value) ||
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

function _merge(target, source) {
  if (target === source) {
    return target;
  }

  for (var key in source) {
    if (
      !Object.prototype.hasOwnProperty.call(source, key) ||
      key === '__proto__'
    ) {
      continue;
    }

    var sourceVal = source[key];
    var targetVal = target[key];

    if (typeof targetVal !== 'undefined' && typeof sourceVal === 'undefined') {
      continue;
    }

    if (
      isObjectOrArrayOrFunction(targetVal) &&
      isObjectOrArrayOrFunction(sourceVal)
    ) {
      target[key] = _merge(targetVal, sourceVal);
    } else {
      target[key] = clone(sourceVal);
    }
  }
  return target;
}

/**
 * This method is like Object.assign, but recursively merges own and inherited
 * enumerable keyed properties of source objects into the destination object.
 *
 * NOTE: this behaves like lodash/merge, but:
 * - does mutate functions if they are a source
 * - treats non-plain objects as plain
 * - does not work for circular objects
 * - treats sparse arrays as sparse
 * - does not convert Array-like objects (Arguments, NodeLists, etc.) to arrays
 *
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 */

function merge(target) {
  if (!isObjectOrArrayOrFunction(target)) {
    target = {};
  }

  for (var i = 1, l = arguments.length; i < l; i++) {
    var source = arguments[i];

    if (isObjectOrArrayOrFunction(source)) {
      _merge(target, source);
    }
  }
  return target;
}

module.exports = merge;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/objectHasKeys.js":
/*!**************************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/objectHasKeys.js ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";


function objectHasKeys(obj) {
  return obj && Object.keys(obj).length > 0;
}

module.exports = objectHasKeys;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/omit.js":
/*!*****************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/omit.js ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";


// https://github.com/babel/babel/blob/3aaafae053fa75febb3aa45d45b6f00646e30ba4/packages/babel-helpers/src/helpers.js#L604-L620
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source === null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key;
  var i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

module.exports = _objectWithoutPropertiesLoose;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/orderBy.js":
/*!********************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/orderBy.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined;
    var valIsNull = value === null;

    var othIsDefined = other !== undefined;
    var othIsNull = other === null;

    if (
      (!othIsNull && value > other) ||
      (valIsNull && othIsDefined) ||
      !valIsDefined
    ) {
      return 1;
    }
    if (
      (!valIsNull && value < other) ||
      (othIsNull && valIsDefined) ||
      !othIsDefined
    ) {
      return -1;
    }
  }
  return 0;
}

/**
 * @param {Array<object>} collection object with keys in attributes
 * @param {Array<string>} iteratees attributes
 * @param {Array<string>} orders asc | desc
 */
function orderBy(collection, iteratees, orders) {
  if (!Array.isArray(collection)) {
    return [];
  }

  if (!Array.isArray(orders)) {
    orders = [];
  }

  var result = collection.map(function(value, index) {
    return {
      criteria: iteratees.map(function(iteratee) {
        return value[iteratee];
      }),
      index: index,
      value: value
    };
  });

  result.sort(function comparer(object, other) {
    var index = -1;

    while (++index < object.criteria.length) {
      var res = compareAscending(object.criteria[index], other.criteria[index]);
      if (res) {
        if (index >= orders.length) {
          return res;
        }
        if (orders[index] === 'desc') {
          return -res;
        }
        return res;
      }
    }

    // This ensures a stable sort in V8 and other engines.
    // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  });

  return result.map(function(res) {
    return res.value;
  });
}

module.exports = orderBy;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/functions/valToNumber.js":
/*!************************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/functions/valToNumber.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";


function valToNumber(v) {
  if (typeof v === 'number') {
    return v;
  } else if (typeof v === 'string') {
    return parseFloat(v);
  } else if (Array.isArray(v)) {
    return v.map(valToNumber);
  }

  throw new Error('The value should be a number, a parsable string or an array of those.');
}

module.exports = valToNumber;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/requestBuilder.js":
/*!*****************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/requestBuilder.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var merge = __webpack_require__(/*! ./functions/merge */ "./node_modules/algoliasearch-helper/src/functions/merge.js");

var requestBuilder = {
  /**
   * Get all the queries to send to the client, those queries can used directly
   * with the Algolia client.
   * @private
   * @return {object[]} The queries
   */
  _getQueries: function getQueries(index, state) {
    var queries = [];

    // One query for the hits
    queries.push({
      indexName: index,
      params: requestBuilder._getHitsSearchParams(state)
    });

    // One for each disjunctive facets
    state.getRefinedDisjunctiveFacets().forEach(function(refinedFacet) {
      queries.push({
        indexName: index,
        params: requestBuilder._getDisjunctiveFacetSearchParams(state, refinedFacet)
      });
    });

    // maybe more to get the root level of hierarchical facets when activated
    state.getRefinedHierarchicalFacets().forEach(function(refinedFacet) {
      var hierarchicalFacet = state.getHierarchicalFacetByName(refinedFacet);

      var currentRefinement = state.getHierarchicalRefinement(refinedFacet);
      // if we are deeper than level 0 (starting from `beer > IPA`)
      // we want to get the root values
      var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);
      if (currentRefinement.length > 0 && currentRefinement[0].split(separator).length > 1) {
        queries.push({
          indexName: index,
          params: requestBuilder._getDisjunctiveFacetSearchParams(state, refinedFacet, true)
        });
      }
    });

    return queries;
  },

  /**
   * Build search parameters used to fetch hits
   * @private
   * @return {object.<string, any>}
   */
  _getHitsSearchParams: function(state) {
    var facets = state.facets
      .concat(state.disjunctiveFacets)
      .concat(requestBuilder._getHitsHierarchicalFacetsAttributes(state));


    var facetFilters = requestBuilder._getFacetFilters(state);
    var numericFilters = requestBuilder._getNumericFilters(state);
    var tagFilters = requestBuilder._getTagFilters(state);
    var additionalParams = {
      facets: facets.indexOf('*') > -1 ? ['*'] : facets,
      tagFilters: tagFilters
    };

    if (facetFilters.length > 0) {
      additionalParams.facetFilters = facetFilters;
    }

    if (numericFilters.length > 0) {
      additionalParams.numericFilters = numericFilters;
    }

    return merge({}, state.getQueryParams(), additionalParams);
  },

  /**
   * Build search parameters used to fetch a disjunctive facet
   * @private
   * @param  {string} facet the associated facet name
   * @param  {boolean} hierarchicalRootLevel ?? FIXME
   * @return {object}
   */
  _getDisjunctiveFacetSearchParams: function(state, facet, hierarchicalRootLevel) {
    var facetFilters = requestBuilder._getFacetFilters(state, facet, hierarchicalRootLevel);
    var numericFilters = requestBuilder._getNumericFilters(state, facet);
    var tagFilters = requestBuilder._getTagFilters(state);
    var additionalParams = {
      hitsPerPage: 1,
      page: 0,
      attributesToRetrieve: [],
      attributesToHighlight: [],
      attributesToSnippet: [],
      tagFilters: tagFilters,
      analytics: false,
      clickAnalytics: false
    };

    var hierarchicalFacet = state.getHierarchicalFacetByName(facet);

    if (hierarchicalFacet) {
      additionalParams.facets = requestBuilder._getDisjunctiveHierarchicalFacetAttribute(
        state,
        hierarchicalFacet,
        hierarchicalRootLevel
      );
    } else {
      additionalParams.facets = facet;
    }

    if (numericFilters.length > 0) {
      additionalParams.numericFilters = numericFilters;
    }

    if (facetFilters.length > 0) {
      additionalParams.facetFilters = facetFilters;
    }

    return merge({}, state.getQueryParams(), additionalParams);
  },

  /**
   * Return the numeric filters in an algolia request fashion
   * @private
   * @param {string} [facetName] the name of the attribute for which the filters should be excluded
   * @return {string[]} the numeric filters in the algolia format
   */
  _getNumericFilters: function(state, facetName) {
    if (state.numericFilters) {
      return state.numericFilters;
    }

    var numericFilters = [];

    Object.keys(state.numericRefinements).forEach(function(attribute) {
      var operators = state.numericRefinements[attribute] || {};
      Object.keys(operators).forEach(function(operator) {
        var values = operators[operator] || [];
        if (facetName !== attribute) {
          values.forEach(function(value) {
            if (Array.isArray(value)) {
              var vs = value.map(function(v) {
                return attribute + operator + v;
              });
              numericFilters.push(vs);
            } else {
              numericFilters.push(attribute + operator + value);
            }
          });
        }
      });
    });

    return numericFilters;
  },

  /**
   * Return the tags filters depending
   * @private
   * @return {string}
   */
  _getTagFilters: function(state) {
    if (state.tagFilters) {
      return state.tagFilters;
    }

    return state.tagRefinements.join(',');
  },


  /**
   * Build facetFilters parameter based on current refinements. The array returned
   * contains strings representing the facet filters in the algolia format.
   * @private
   * @param  {string} [facet] if set, the current disjunctive facet
   * @return {array.<string>}
   */
  _getFacetFilters: function(state, facet, hierarchicalRootLevel) {
    var facetFilters = [];

    var facetsRefinements = state.facetsRefinements || {};
    Object.keys(facetsRefinements).forEach(function(facetName) {
      var facetValues = facetsRefinements[facetName] || [];
      facetValues.forEach(function(facetValue) {
        facetFilters.push(facetName + ':' + facetValue);
      });
    });

    var facetsExcludes = state.facetsExcludes || {};
    Object.keys(facetsExcludes).forEach(function(facetName) {
      var facetValues = facetsExcludes[facetName] || [];
      facetValues.forEach(function(facetValue) {
        facetFilters.push(facetName + ':-' + facetValue);
      });
    });

    var disjunctiveFacetsRefinements = state.disjunctiveFacetsRefinements || {};
    Object.keys(disjunctiveFacetsRefinements).forEach(function(facetName) {
      var facetValues = disjunctiveFacetsRefinements[facetName] || [];
      if (facetName === facet || !facetValues || facetValues.length === 0) {
        return;
      }
      var orFilters = [];

      facetValues.forEach(function(facetValue) {
        orFilters.push(facetName + ':' + facetValue);
      });

      facetFilters.push(orFilters);
    });

    var hierarchicalFacetsRefinements = state.hierarchicalFacetsRefinements || {};
    Object.keys(hierarchicalFacetsRefinements).forEach(function(facetName) {
      var facetValues = hierarchicalFacetsRefinements[facetName] || [];
      var facetValue = facetValues[0];

      if (facetValue === undefined) {
        return;
      }

      var hierarchicalFacet = state.getHierarchicalFacetByName(facetName);
      var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);
      var rootPath = state._getHierarchicalRootPath(hierarchicalFacet);
      var attributeToRefine;
      var attributesIndex;

      // we ask for parent facet values only when the `facet` is the current hierarchical facet
      if (facet === facetName) {
        // if we are at the root level already, no need to ask for facet values, we get them from
        // the hits query
        if (facetValue.indexOf(separator) === -1 || (!rootPath && hierarchicalRootLevel === true) ||
          (rootPath && rootPath.split(separator).length === facetValue.split(separator).length)) {
          return;
        }

        if (!rootPath) {
          attributesIndex = facetValue.split(separator).length - 2;
          facetValue = facetValue.slice(0, facetValue.lastIndexOf(separator));
        } else {
          attributesIndex = rootPath.split(separator).length - 1;
          facetValue = rootPath;
        }

        attributeToRefine = hierarchicalFacet.attributes[attributesIndex];
      } else {
        attributesIndex = facetValue.split(separator).length - 1;

        attributeToRefine = hierarchicalFacet.attributes[attributesIndex];
      }

      if (attributeToRefine) {
        facetFilters.push([attributeToRefine + ':' + facetValue]);
      }
    });

    return facetFilters;
  },

  _getHitsHierarchicalFacetsAttributes: function(state) {
    var out = [];

    return state.hierarchicalFacets.reduce(
      // ask for as much levels as there's hierarchical refinements
      function getHitsAttributesForHierarchicalFacet(allAttributes, hierarchicalFacet) {
        var hierarchicalRefinement = state.getHierarchicalRefinement(hierarchicalFacet.name)[0];

        // if no refinement, ask for root level
        if (!hierarchicalRefinement) {
          allAttributes.push(hierarchicalFacet.attributes[0]);
          return allAttributes;
        }

        var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);
        var level = hierarchicalRefinement.split(separator).length;
        var newAttributes = hierarchicalFacet.attributes.slice(0, level + 1);

        return allAttributes.concat(newAttributes);
      }, out);
  },

  _getDisjunctiveHierarchicalFacetAttribute: function(state, hierarchicalFacet, rootLevel) {
    var separator = state._getHierarchicalFacetSeparator(hierarchicalFacet);
    if (rootLevel === true) {
      var rootPath = state._getHierarchicalRootPath(hierarchicalFacet);
      var attributeIndex = 0;

      if (rootPath) {
        attributeIndex = rootPath.split(separator).length;
      }
      return [hierarchicalFacet.attributes[attributeIndex]];
    }

    var hierarchicalRefinement = state.getHierarchicalRefinement(hierarchicalFacet.name)[0] || '';
    // if refinement is 'beers > IPA > Flying dog',
    // then we want `facets: ['beers > IPA']` as disjunctive facet (parent level values)

    var parentLevel = hierarchicalRefinement.split(separator).length - 1;
    return hierarchicalFacet.attributes.slice(0, parentLevel + 1);
  },

  getSearchForFacetQuery: function(facetName, query, maxFacetHits, state) {
    var stateForSearchForFacetValues = state.isDisjunctiveFacet(facetName) ?
      state.clearRefinements(facetName) :
      state;
    var searchForFacetSearchParameters = {
      facetQuery: query,
      facetName: facetName
    };
    if (typeof maxFacetHits === 'number') {
      searchForFacetSearchParameters.maxFacetHits = maxFacetHits;
    }
    return merge(
      {},
      requestBuilder._getHitsSearchParams(stateForSearchForFacetValues),
      searchForFacetSearchParameters
    );
  }
};

module.exports = requestBuilder;


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/utils/isValidUserToken.js":
/*!*************************************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/utils/isValidUserToken.js ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isValidUserToken(userToken) {
  if (userToken === null) {
    return false;
  }
  return /^[a-zA-Z0-9_-]{1,64}$/.test(userToken);
};


/***/ }),

/***/ "./node_modules/algoliasearch-helper/src/version.js":
/*!**********************************************************!*\
  !*** ./node_modules/algoliasearch-helper/src/version.js ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";


module.exports = '3.6.2';


/***/ }),

/***/ "./node_modules/algoliasearch/dist/algoliasearch.cjs.js":
/*!**************************************************************!*\
  !*** ./node_modules/algoliasearch/dist/algoliasearch.cjs.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var cacheCommon = __webpack_require__(/*! @algolia/cache-common */ "./node_modules/@algolia/cache-common/dist/cache-common.esm.js");
var cacheInMemory = __webpack_require__(/*! @algolia/cache-in-memory */ "./node_modules/@algolia/cache-in-memory/dist/cache-in-memory.esm.js");
var clientAnalytics = __webpack_require__(/*! @algolia/client-analytics */ "./node_modules/@algolia/client-analytics/dist/client-analytics.esm.js");
var clientCommon = __webpack_require__(/*! @algolia/client-common */ "./node_modules/@algolia/client-common/dist/client-common.esm.js");
var clientPersonalization = __webpack_require__(/*! @algolia/client-personalization */ "./node_modules/@algolia/client-personalization/dist/client-personalization.esm.js");
var clientSearch = __webpack_require__(/*! @algolia/client-search */ "./node_modules/@algolia/client-search/dist/client-search.esm.js");
var loggerCommon = __webpack_require__(/*! @algolia/logger-common */ "./node_modules/@algolia/logger-common/dist/logger-common.esm.js");
var requesterNodeHttp = __webpack_require__(/*! @algolia/requester-node-http */ "./node_modules/@algolia/requester-node-http/dist/requester-node-http.esm.js");
var transporter = __webpack_require__(/*! @algolia/transporter */ "./node_modules/@algolia/transporter/dist/transporter.esm.js");

function algoliasearch(appId, apiKey, options) {
    const commonOptions = {
        appId,
        apiKey,
        timeouts: {
            connect: 2,
            read: 5,
            write: 30,
        },
        requester: requesterNodeHttp.createNodeHttpRequester(),
        logger: loggerCommon.createNullLogger(),
        responsesCache: cacheCommon.createNullCache(),
        requestsCache: cacheCommon.createNullCache(),
        hostsCache: cacheInMemory.createInMemoryCache(),
        userAgent: transporter.createUserAgent(clientCommon.version).add({
            segment: 'Node.js',
            version: process.versions.node,
        }),
    };
    const searchClientOptions = { ...commonOptions, ...options };
    const initPersonalization = () => (clientOptions) => {
        return clientPersonalization.createPersonalizationClient({
            ...commonOptions,
            ...clientOptions,
            methods: {
                getPersonalizationStrategy: clientPersonalization.getPersonalizationStrategy,
                setPersonalizationStrategy: clientPersonalization.setPersonalizationStrategy,
            },
        });
    };
    return clientSearch.createSearchClient({
        ...searchClientOptions,
        methods: {
            search: clientSearch.multipleQueries,
            searchForFacetValues: clientSearch.multipleSearchForFacetValues,
            multipleBatch: clientSearch.multipleBatch,
            multipleGetObjects: clientSearch.multipleGetObjects,
            multipleQueries: clientSearch.multipleQueries,
            copyIndex: clientSearch.copyIndex,
            copySettings: clientSearch.copySettings,
            copyRules: clientSearch.copyRules,
            copySynonyms: clientSearch.copySynonyms,
            moveIndex: clientSearch.moveIndex,
            listIndices: clientSearch.listIndices,
            getLogs: clientSearch.getLogs,
            listClusters: clientSearch.listClusters,
            multipleSearchForFacetValues: clientSearch.multipleSearchForFacetValues,
            getApiKey: clientSearch.getApiKey,
            addApiKey: clientSearch.addApiKey,
            listApiKeys: clientSearch.listApiKeys,
            updateApiKey: clientSearch.updateApiKey,
            deleteApiKey: clientSearch.deleteApiKey,
            restoreApiKey: clientSearch.restoreApiKey,
            assignUserID: clientSearch.assignUserID,
            assignUserIDs: clientSearch.assignUserIDs,
            getUserID: clientSearch.getUserID,
            searchUserIDs: clientSearch.searchUserIDs,
            listUserIDs: clientSearch.listUserIDs,
            getTopUserIDs: clientSearch.getTopUserIDs,
            removeUserID: clientSearch.removeUserID,
            hasPendingMappings: clientSearch.hasPendingMappings,
            generateSecuredApiKey: clientSearch.generateSecuredApiKey,
            getSecuredApiKeyRemainingValidity: clientSearch.getSecuredApiKeyRemainingValidity,
            destroy: clientCommon.destroy,
            clearDictionaryEntries: clientSearch.clearDictionaryEntries,
            deleteDictionaryEntries: clientSearch.deleteDictionaryEntries,
            getDictionarySettings: clientSearch.getDictionarySettings,
            getAppTask: clientSearch.getAppTask,
            replaceDictionaryEntries: clientSearch.replaceDictionaryEntries,
            saveDictionaryEntries: clientSearch.saveDictionaryEntries,
            searchDictionaryEntries: clientSearch.searchDictionaryEntries,
            setDictionarySettings: clientSearch.setDictionarySettings,
            waitAppTask: clientSearch.waitAppTask,
            customRequest: clientSearch.customRequest,
            initIndex: base => (indexName) => {
                return clientSearch.initIndex(base)(indexName, {
                    methods: {
                        batch: clientSearch.batch,
                        delete: clientSearch.deleteIndex,
                        findAnswers: clientSearch.findAnswers,
                        getObject: clientSearch.getObject,
                        getObjects: clientSearch.getObjects,
                        saveObject: clientSearch.saveObject,
                        saveObjects: clientSearch.saveObjects,
                        search: clientSearch.search,
                        searchForFacetValues: clientSearch.searchForFacetValues,
                        waitTask: clientSearch.waitTask,
                        setSettings: clientSearch.setSettings,
                        getSettings: clientSearch.getSettings,
                        partialUpdateObject: clientSearch.partialUpdateObject,
                        partialUpdateObjects: clientSearch.partialUpdateObjects,
                        deleteObject: clientSearch.deleteObject,
                        deleteObjects: clientSearch.deleteObjects,
                        deleteBy: clientSearch.deleteBy,
                        clearObjects: clientSearch.clearObjects,
                        browseObjects: clientSearch.browseObjects,
                        getObjectPosition: clientSearch.getObjectPosition,
                        findObject: clientSearch.findObject,
                        exists: clientSearch.exists,
                        saveSynonym: clientSearch.saveSynonym,
                        saveSynonyms: clientSearch.saveSynonyms,
                        getSynonym: clientSearch.getSynonym,
                        searchSynonyms: clientSearch.searchSynonyms,
                        browseSynonyms: clientSearch.browseSynonyms,
                        deleteSynonym: clientSearch.deleteSynonym,
                        clearSynonyms: clientSearch.clearSynonyms,
                        replaceAllObjects: clientSearch.replaceAllObjects,
                        replaceAllSynonyms: clientSearch.replaceAllSynonyms,
                        searchRules: clientSearch.searchRules,
                        getRule: clientSearch.getRule,
                        deleteRule: clientSearch.deleteRule,
                        saveRule: clientSearch.saveRule,
                        saveRules: clientSearch.saveRules,
                        replaceAllRules: clientSearch.replaceAllRules,
                        browseRules: clientSearch.browseRules,
                        clearRules: clientSearch.clearRules,
                    },
                });
            },
            initAnalytics: () => (clientOptions) => {
                return clientAnalytics.createAnalyticsClient({
                    ...commonOptions,
                    ...clientOptions,
                    methods: {
                        addABTest: clientAnalytics.addABTest,
                        getABTest: clientAnalytics.getABTest,
                        getABTests: clientAnalytics.getABTests,
                        stopABTest: clientAnalytics.stopABTest,
                        deleteABTest: clientAnalytics.deleteABTest,
                    },
                });
            },
            initPersonalization,
            initRecommendation: () => (clientOptions) => {
                searchClientOptions.logger.info('The `initRecommendation` method is deprecated. Use `initPersonalization` instead.');
                return initPersonalization()(clientOptions);
            },
        },
    });
}
// eslint-disable-next-line functional/immutable-data
algoliasearch.version = clientCommon.version;

module.exports = algoliasearch;


/***/ }),

/***/ "./node_modules/algoliasearch/index.js":
/*!*********************************************!*\
  !*** ./node_modules/algoliasearch/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable functional/immutable-data, import/no-commonjs */
const algoliasearch = __webpack_require__(/*! ./dist/algoliasearch.cjs.js */ "./node_modules/algoliasearch/dist/algoliasearch.cjs.js");

/**
 * The Common JS build is the default entry point for the Node environment. Keep in
 * in mind, that for the browser environment, we hint the bundler to use the UMD
 * build instead as specified on the key `browser` of our `package.json` file.
 */
module.exports = algoliasearch;

/**
 * In addition, we also set explicitly the default export below making
 * this Common JS module in compliance with es6 modules specification.
 */
module.exports["default"] = algoliasearch;


/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./src/components/search/hitComps.js":
/*!*******************************************!*\
  !*** ./src/components/search/hitComps.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PageHit": () => (/* binding */ PageHit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-instantsearch-dom */ "./node_modules/react-instantsearch-dom/dist/es/widgets/Highlight.js");
/* harmony import */ var react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-instantsearch-dom */ "./node_modules/react-instantsearch-dom/dist/es/widgets/Snippet.js");
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.esm.js");




const PageHit = clickHandler => ({
  hit
}) => (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
  to: hit.slug,
  onClick: clickHandler
}, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_3__["default"], {
  attribute: "title",
  hit: hit,
  tagName: "mark"
}))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_4__["default"], {
  attribute: "excerpt",
  hit: hit,
  tagName: "mark"
}));

/***/ }),

/***/ "./src/components/search/index.js":
/*!****************************************!*\
  !*** ./src/components/search/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SearchComponent)
/* harmony export */ });
/* harmony import */ var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/styled/base */ "./node_modules/@emotion/styled/base/dist/emotion-styled-base.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-instantsearch-dom */ "./node_modules/react-instantsearch-core/dist/es/connectors/connectStateResults.js");
/* harmony import */ var react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-instantsearch-dom */ "./node_modules/react-instantsearch-core/dist/es/widgets/InstantSearch.js");
/* harmony import */ var react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-instantsearch-dom */ "./node_modules/react-instantsearch-core/dist/es/widgets/Index.js");
/* harmony import */ var react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-instantsearch-dom */ "./node_modules/react-instantsearch-dom/dist/es/widgets/Hits.js");
/* harmony import */ var react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-instantsearch-dom */ "./node_modules/react-instantsearch-core/dist/es/widgets/Configure.js");
/* harmony import */ var algoliasearch_lite__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! algoliasearch/lite */ "./node_modules/algoliasearch/index.js");
/* harmony import */ var algoliasearch_lite__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(algoliasearch_lite__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./src/components/search/styles.js");
/* harmony import */ var _styled_icons_fa_solid_Search__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @styled-icons/fa-solid/Search */ "./node_modules/@styled-icons/fa-solid/Search/Search.esm.js");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./input */ "./src/components/search/input.js");
/* harmony import */ var _hitComps__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hitComps */ "./src/components/search/hitComps.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.esm.js");


function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }












const SearchIcon = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(_styled_icons_fa_solid_Search__WEBPACK_IMPORTED_MODULE_6__.Search,  false ? 0 : {
  target: "e16dh4ip2",
  label: "SearchIcon"
})( false ? 0 : {
  name: "q8zv7r",
  styles: "width:1em;pointer-events:none",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUJpQyIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEluc3RhbnRTZWFyY2gsXG4gIEluZGV4LFxuICBIaXRzLFxuICBDb25maWd1cmUsXG4gIFBhZ2luYXRpb24sXG4gIGNvbm5lY3RTdGF0ZVJlc3VsdHMsXG59IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcbmltcG9ydCBhbGdvbGlhc2VhcmNoIGZyb20gJ2FsZ29saWFzZWFyY2gvbGl0ZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uLy4uL2NvbmZpZy5qcyc7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCB7IGNzcyB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IFBvd2VyZWRCeSB9IGZyb20gJy4vc3R5bGVzJztcbmltcG9ydCB7IFNlYXJjaCB9IGZyb20gJ0BzdHlsZWQtaWNvbnMvZmEtc29saWQvU2VhcmNoJztcbmltcG9ydCBJbnB1dCBmcm9tICcuL2lucHV0JztcbmltcG9ydCAqIGFzIGhpdENvbXBzIGZyb20gJy4vaGl0Q29tcHMnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuYDtcblxuY29uc3QgSGl0c1dyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiAke3Byb3BzID0+IChwcm9wcy5zaG93ID8gYGdyaWRgIDogYG5vbmVgKX07XG4gIG1heC1oZWlnaHQ6IDgwdmg7XG4gIG92ZXJmbG93OiBzY3JvbGw7XG4gIHotaW5kZXg6IDI7XG4gIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiBjYWxjKDEwMCUgKyAwLjVlbSk7XG4gIHdpZHRoOiA4MHZ3O1xuICBtYXgtd2lkdGg6IDMwZW07XG4gIGJveC1zaGFkb3c6IDAgMCA1cHggMDtcbiAgcGFkZGluZzogMC43ZW0gMWVtIDAuNGVtO1xuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA5OTFweCkge1xuICAgIHdpZHRoOiA0MDBweDtcbiAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICB9XG4gIEBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY3cHgpIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDUwMHB4O1xuICB9XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc21hbGxCb3JkZXJSYWRpdXN9O1xuICA+ICogKyAqIHtcbiAgICBwYWRkaW5nLXRvcDogMWVtICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZGFya0dyYXl9O1xuICB9XG4gIGxpICsgbGkge1xuICAgIG1hcmdpbi10b3A6IDAuN2VtO1xuICAgIHBhZGRpbmctdG9wOiAwLjdlbTtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saWdodEdyYXl9O1xuICB9XG4gICoge1xuICAgIG1hcmdpbi10b3A6IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcbiAgfVxuICB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgfVxuICBtYXJrIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saWdodEJsdWV9O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZGFya0JsdWV9O1xuICB9XG4gIGhlYWRlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgbWFyZ2luLWJvdHRvbTogMC4zZW07XG4gICAgaDMge1xuICAgICAgY29sb3I6IGJsYWNrO1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ncmF5fTtcbiAgICAgIHBhZGRpbmc6IDAuMWVtIDAuNGVtO1xuICAgICAgYm9yZGVyLXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gICAgfVxuICB9XG4gIGgzIHtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAgbWFyZ2luOiAwIDAgMC41ZW07XG4gIH1cbiAgaDQge1xuICAgIGNvbG9yOiBibGFjaztcbiAgICBtYXJnaW4tYm90dG9tOiAwLjNlbTtcbiAgfVxuYDtcblxuY29uc3QgUm9vdCA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC1nYXA6IDFlbTtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5gO1xuXG5jb25zdCBSZXN1bHRzID0gY29ubmVjdFN0YXRlUmVzdWx0cyhcbiAgKHsgc2VhcmNoaW5nLCBzZWFyY2hTdGF0ZTogc3RhdGUsIHNlYXJjaFJlc3VsdHM6IHJlcyB9KSA9PlxuICAgIChzZWFyY2hpbmcgJiYgYFNlYXJjaGluZy4uLmApIHx8IChyZXMgJiYgcmVzLm5iSGl0cyA9PT0gMCAmJiBgTm8gcmVzdWx0cyBmb3IgJyR7c3RhdGUucXVlcnl9J2ApXG4pO1xuXG5jb25zdCB1c2VDbGlja091dHNpZGUgPSAocmVmLCBoYW5kbGVyLCBldmVudHMpID0+IHtcbiAgaWYgKCFldmVudHMpIGV2ZW50cyA9IFtgbW91c2Vkb3duYCwgYHRvdWNoc3RhcnRgXTtcbiAgY29uc3QgZGV0ZWN0Q2xpY2tPdXRzaWRlID0gZXZlbnQgPT5cbiAgICByZWYgJiYgcmVmLmN1cnJlbnQgJiYgIXJlZi5jdXJyZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgaGFuZGxlcigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGRldGVjdENsaWNrT3V0c2lkZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBkZXRlY3RDbGlja091dHNpZGUpO1xuICAgIH07XG4gIH0pO1xufTtcblxuY29uc3Qgc2VhcmNoQ2xpZW50ID0gYWxnb2xpYXNlYXJjaChcbiAgY29uZmlnLmhlYWRlci5zZWFyY2guYWxnb2xpYUFwcElkLFxuICBjb25maWcuaGVhZGVyLnNlYXJjaC5hbGdvbGlhU2VhcmNoS2V5XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZWFyY2hDb21wb25lbnQoeyBpbmRpY2VzLCBjb2xsYXBzZSwgaGl0c0FzR3JpZCB9KSB7XG4gIGNvbnN0IHJlZiA9IGNyZWF0ZVJlZigpO1xuXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoYGApO1xuXG4gIGNvbnN0IFtmb2N1cywgc2V0Rm9jdXNdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUNsaWNrT3V0c2lkZShyZWYsICgpID0+IHNldEZvY3VzKGZhbHNlKSk7XG4gIGNvbnN0IGRpc3BsYXlSZXN1bHQgPSBxdWVyeS5sZW5ndGggPiAwICYmIGZvY3VzID8gJ3Nob3dSZXN1bHRzJyA6ICdoaWRlUmVzdWx0cyc7XG4gIHJldHVybiAoXG4gICAgPEluc3RhbnRTZWFyY2hcbiAgICAgIHNlYXJjaENsaWVudD17c2VhcmNoQ2xpZW50fVxuICAgICAgaW5kZXhOYW1lPXtpbmRpY2VzWzBdLm5hbWV9XG4gICAgICBvblNlYXJjaFN0YXRlQ2hhbmdlPXsoeyBxdWVyeSB9KSA9PiBzZXRRdWVyeShxdWVyeSl9XG4gICAgICByb290PXt7IFJvb3QsIHByb3BzOiB7IHJlZiB9IH19XG4gICAgPlxuICAgICAgPElucHV0IG9uRm9jdXM9eygpID0+IHNldEZvY3VzKHRydWUpfSB7Li4ueyBjb2xsYXBzZSwgZm9jdXMgfX0gLz5cbiAgICAgIDxIaXRzV3JhcHBlclxuICAgICAgICBjbGFzc05hbWU9eydoaXRXcmFwcGVyICcgKyBkaXNwbGF5UmVzdWx0fVxuICAgICAgICBzaG93PXtxdWVyeS5sZW5ndGggPiAwICYmIGZvY3VzfVxuICAgICAgICBhc0dyaWQ9e2hpdHNBc0dyaWR9XG4gICAgICA+XG4gICAgICAgIHtpbmRpY2VzLm1hcCgoeyBuYW1lLCB0aXRsZSwgaGl0Q29tcCwgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxJbmRleCBrZXk9e25hbWV9IGluZGV4TmFtZT17bmFtZX0+XG4gICAgICAgICAgICAgIDxSZXN1bHRzIC8+XG4gICAgICAgICAgICAgIDxIaXRzIGhpdENvbXBvbmVudD17aGl0Q29tcHNbaGl0Q29tcF0oKCkgPT4gc2V0Rm9jdXMoZmFsc2UpKX0gLz5cbiAgICAgICAgICAgIDwvSW5kZXg+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICAgIDxQb3dlcmVkQnkgLz5cbiAgICAgIDwvSGl0c1dyYXBwZXI+XG4gICAgICA8Q29uZmlndXJlIGhpdHNQZXJQYWdlPXs1fSAvPlxuICAgIDwvSW5zdGFudFNlYXJjaD5cbiAgKTtcbn1cbiJdfQ== */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});

const HitsWrapper = (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])("div",  false ? 0 : {
  target: "e16dh4ip1",
  label: "HitsWrapper"
})("display:", props => props.show ? `grid` : `none`, ";max-height:80vh;overflow:scroll;z-index:2;-webkit-overflow-scrolling:touch;position:absolute;right:0;top:calc(100% + 0.5em);width:80vw;max-width:30em;box-shadow:0 0 5px 0;padding:0.7em 1em 0.4em;background:white;@media only screen and (max-width: 991px){width:400px;max-width:400px;}@media only screen and (max-width: 767px){width:100%;max-width:500px;}border-radius:", props => props.theme.smallBorderRadius, ";>*+*{padding-top:1em!important;border-top:2px solid ", props => props.theme.darkGray, ";}li+li{margin-top:0.7em;padding-top:0.7em;border-top:1px solid ", props => props.theme.lightGray, ";}*{margin-top:0;padding:0;color:black!important;}ul{list-style:none;}mark{color:", props => props.theme.lightBlue, ";background:", props => props.theme.darkBlue, ";}header{display:flex;justify-content:space-between;margin-bottom:0.3em;h3{color:black;background:", props => props.theme.gray, ";padding:0.1em 0.4em;border-radius:", props => props.theme.smallBorderRadius, ";}}h3{color:black;margin:0 0 0.5em;}h4{color:black;margin-bottom:0.3em;}" + ( false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBd0I4QiIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEluc3RhbnRTZWFyY2gsXG4gIEluZGV4LFxuICBIaXRzLFxuICBDb25maWd1cmUsXG4gIFBhZ2luYXRpb24sXG4gIGNvbm5lY3RTdGF0ZVJlc3VsdHMsXG59IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcbmltcG9ydCBhbGdvbGlhc2VhcmNoIGZyb20gJ2FsZ29saWFzZWFyY2gvbGl0ZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uLy4uL2NvbmZpZy5qcyc7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCB7IGNzcyB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IFBvd2VyZWRCeSB9IGZyb20gJy4vc3R5bGVzJztcbmltcG9ydCB7IFNlYXJjaCB9IGZyb20gJ0BzdHlsZWQtaWNvbnMvZmEtc29saWQvU2VhcmNoJztcbmltcG9ydCBJbnB1dCBmcm9tICcuL2lucHV0JztcbmltcG9ydCAqIGFzIGhpdENvbXBzIGZyb20gJy4vaGl0Q29tcHMnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuYDtcblxuY29uc3QgSGl0c1dyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiAke3Byb3BzID0+IChwcm9wcy5zaG93ID8gYGdyaWRgIDogYG5vbmVgKX07XG4gIG1heC1oZWlnaHQ6IDgwdmg7XG4gIG92ZXJmbG93OiBzY3JvbGw7XG4gIHotaW5kZXg6IDI7XG4gIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiBjYWxjKDEwMCUgKyAwLjVlbSk7XG4gIHdpZHRoOiA4MHZ3O1xuICBtYXgtd2lkdGg6IDMwZW07XG4gIGJveC1zaGFkb3c6IDAgMCA1cHggMDtcbiAgcGFkZGluZzogMC43ZW0gMWVtIDAuNGVtO1xuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA5OTFweCkge1xuICAgIHdpZHRoOiA0MDBweDtcbiAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICB9XG4gIEBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY3cHgpIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDUwMHB4O1xuICB9XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc21hbGxCb3JkZXJSYWRpdXN9O1xuICA+ICogKyAqIHtcbiAgICBwYWRkaW5nLXRvcDogMWVtICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZGFya0dyYXl9O1xuICB9XG4gIGxpICsgbGkge1xuICAgIG1hcmdpbi10b3A6IDAuN2VtO1xuICAgIHBhZGRpbmctdG9wOiAwLjdlbTtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saWdodEdyYXl9O1xuICB9XG4gICoge1xuICAgIG1hcmdpbi10b3A6IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcbiAgfVxuICB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgfVxuICBtYXJrIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saWdodEJsdWV9O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZGFya0JsdWV9O1xuICB9XG4gIGhlYWRlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgbWFyZ2luLWJvdHRvbTogMC4zZW07XG4gICAgaDMge1xuICAgICAgY29sb3I6IGJsYWNrO1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ncmF5fTtcbiAgICAgIHBhZGRpbmc6IDAuMWVtIDAuNGVtO1xuICAgICAgYm9yZGVyLXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gICAgfVxuICB9XG4gIGgzIHtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAgbWFyZ2luOiAwIDAgMC41ZW07XG4gIH1cbiAgaDQge1xuICAgIGNvbG9yOiBibGFjaztcbiAgICBtYXJnaW4tYm90dG9tOiAwLjNlbTtcbiAgfVxuYDtcblxuY29uc3QgUm9vdCA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC1nYXA6IDFlbTtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5gO1xuXG5jb25zdCBSZXN1bHRzID0gY29ubmVjdFN0YXRlUmVzdWx0cyhcbiAgKHsgc2VhcmNoaW5nLCBzZWFyY2hTdGF0ZTogc3RhdGUsIHNlYXJjaFJlc3VsdHM6IHJlcyB9KSA9PlxuICAgIChzZWFyY2hpbmcgJiYgYFNlYXJjaGluZy4uLmApIHx8IChyZXMgJiYgcmVzLm5iSGl0cyA9PT0gMCAmJiBgTm8gcmVzdWx0cyBmb3IgJyR7c3RhdGUucXVlcnl9J2ApXG4pO1xuXG5jb25zdCB1c2VDbGlja091dHNpZGUgPSAocmVmLCBoYW5kbGVyLCBldmVudHMpID0+IHtcbiAgaWYgKCFldmVudHMpIGV2ZW50cyA9IFtgbW91c2Vkb3duYCwgYHRvdWNoc3RhcnRgXTtcbiAgY29uc3QgZGV0ZWN0Q2xpY2tPdXRzaWRlID0gZXZlbnQgPT5cbiAgICByZWYgJiYgcmVmLmN1cnJlbnQgJiYgIXJlZi5jdXJyZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgaGFuZGxlcigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGRldGVjdENsaWNrT3V0c2lkZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBkZXRlY3RDbGlja091dHNpZGUpO1xuICAgIH07XG4gIH0pO1xufTtcblxuY29uc3Qgc2VhcmNoQ2xpZW50ID0gYWxnb2xpYXNlYXJjaChcbiAgY29uZmlnLmhlYWRlci5zZWFyY2guYWxnb2xpYUFwcElkLFxuICBjb25maWcuaGVhZGVyLnNlYXJjaC5hbGdvbGlhU2VhcmNoS2V5XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZWFyY2hDb21wb25lbnQoeyBpbmRpY2VzLCBjb2xsYXBzZSwgaGl0c0FzR3JpZCB9KSB7XG4gIGNvbnN0IHJlZiA9IGNyZWF0ZVJlZigpO1xuXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoYGApO1xuXG4gIGNvbnN0IFtmb2N1cywgc2V0Rm9jdXNdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUNsaWNrT3V0c2lkZShyZWYsICgpID0+IHNldEZvY3VzKGZhbHNlKSk7XG4gIGNvbnN0IGRpc3BsYXlSZXN1bHQgPSBxdWVyeS5sZW5ndGggPiAwICYmIGZvY3VzID8gJ3Nob3dSZXN1bHRzJyA6ICdoaWRlUmVzdWx0cyc7XG4gIHJldHVybiAoXG4gICAgPEluc3RhbnRTZWFyY2hcbiAgICAgIHNlYXJjaENsaWVudD17c2VhcmNoQ2xpZW50fVxuICAgICAgaW5kZXhOYW1lPXtpbmRpY2VzWzBdLm5hbWV9XG4gICAgICBvblNlYXJjaFN0YXRlQ2hhbmdlPXsoeyBxdWVyeSB9KSA9PiBzZXRRdWVyeShxdWVyeSl9XG4gICAgICByb290PXt7IFJvb3QsIHByb3BzOiB7IHJlZiB9IH19XG4gICAgPlxuICAgICAgPElucHV0IG9uRm9jdXM9eygpID0+IHNldEZvY3VzKHRydWUpfSB7Li4ueyBjb2xsYXBzZSwgZm9jdXMgfX0gLz5cbiAgICAgIDxIaXRzV3JhcHBlclxuICAgICAgICBjbGFzc05hbWU9eydoaXRXcmFwcGVyICcgKyBkaXNwbGF5UmVzdWx0fVxuICAgICAgICBzaG93PXtxdWVyeS5sZW5ndGggPiAwICYmIGZvY3VzfVxuICAgICAgICBhc0dyaWQ9e2hpdHNBc0dyaWR9XG4gICAgICA+XG4gICAgICAgIHtpbmRpY2VzLm1hcCgoeyBuYW1lLCB0aXRsZSwgaGl0Q29tcCwgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxJbmRleCBrZXk9e25hbWV9IGluZGV4TmFtZT17bmFtZX0+XG4gICAgICAgICAgICAgIDxSZXN1bHRzIC8+XG4gICAgICAgICAgICAgIDxIaXRzIGhpdENvbXBvbmVudD17aGl0Q29tcHNbaGl0Q29tcF0oKCkgPT4gc2V0Rm9jdXMoZmFsc2UpKX0gLz5cbiAgICAgICAgICAgIDwvSW5kZXg+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICAgIDxQb3dlcmVkQnkgLz5cbiAgICAgIDwvSGl0c1dyYXBwZXI+XG4gICAgICA8Q29uZmlndXJlIGhpdHNQZXJQYWdlPXs1fSAvPlxuICAgIDwvSW5zdGFudFNlYXJjaD5cbiAgKTtcbn1cbiJdfQ== */"));

const Root = (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])("div",  false ? 0 : {
  target: "e16dh4ip0",
  label: "Root"
})( false ? 0 : {
  name: "3z7g5g",
  styles: "position:relative;display:grid;grid-gap:1em;@media only screen and (max-width: 767px){width:100%;}",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBeUZ1QiIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEluc3RhbnRTZWFyY2gsXG4gIEluZGV4LFxuICBIaXRzLFxuICBDb25maWd1cmUsXG4gIFBhZ2luYXRpb24sXG4gIGNvbm5lY3RTdGF0ZVJlc3VsdHMsXG59IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcbmltcG9ydCBhbGdvbGlhc2VhcmNoIGZyb20gJ2FsZ29saWFzZWFyY2gvbGl0ZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uLy4uL2NvbmZpZy5qcyc7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCB7IGNzcyB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IFBvd2VyZWRCeSB9IGZyb20gJy4vc3R5bGVzJztcbmltcG9ydCB7IFNlYXJjaCB9IGZyb20gJ0BzdHlsZWQtaWNvbnMvZmEtc29saWQvU2VhcmNoJztcbmltcG9ydCBJbnB1dCBmcm9tICcuL2lucHV0JztcbmltcG9ydCAqIGFzIGhpdENvbXBzIGZyb20gJy4vaGl0Q29tcHMnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuYDtcblxuY29uc3QgSGl0c1dyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiAke3Byb3BzID0+IChwcm9wcy5zaG93ID8gYGdyaWRgIDogYG5vbmVgKX07XG4gIG1heC1oZWlnaHQ6IDgwdmg7XG4gIG92ZXJmbG93OiBzY3JvbGw7XG4gIHotaW5kZXg6IDI7XG4gIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgdG9wOiBjYWxjKDEwMCUgKyAwLjVlbSk7XG4gIHdpZHRoOiA4MHZ3O1xuICBtYXgtd2lkdGg6IDMwZW07XG4gIGJveC1zaGFkb3c6IDAgMCA1cHggMDtcbiAgcGFkZGluZzogMC43ZW0gMWVtIDAuNGVtO1xuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA5OTFweCkge1xuICAgIHdpZHRoOiA0MDBweDtcbiAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICB9XG4gIEBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY3cHgpIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDUwMHB4O1xuICB9XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc21hbGxCb3JkZXJSYWRpdXN9O1xuICA+ICogKyAqIHtcbiAgICBwYWRkaW5nLXRvcDogMWVtICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZGFya0dyYXl9O1xuICB9XG4gIGxpICsgbGkge1xuICAgIG1hcmdpbi10b3A6IDAuN2VtO1xuICAgIHBhZGRpbmctdG9wOiAwLjdlbTtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saWdodEdyYXl9O1xuICB9XG4gICoge1xuICAgIG1hcmdpbi10b3A6IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcbiAgfVxuICB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgfVxuICBtYXJrIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saWdodEJsdWV9O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZGFya0JsdWV9O1xuICB9XG4gIGhlYWRlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgbWFyZ2luLWJvdHRvbTogMC4zZW07XG4gICAgaDMge1xuICAgICAgY29sb3I6IGJsYWNrO1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ncmF5fTtcbiAgICAgIHBhZGRpbmc6IDAuMWVtIDAuNGVtO1xuICAgICAgYm9yZGVyLXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gICAgfVxuICB9XG4gIGgzIHtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAgbWFyZ2luOiAwIDAgMC41ZW07XG4gIH1cbiAgaDQge1xuICAgIGNvbG9yOiBibGFjaztcbiAgICBtYXJnaW4tYm90dG9tOiAwLjNlbTtcbiAgfVxuYDtcblxuY29uc3QgUm9vdCA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC1nYXA6IDFlbTtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5gO1xuXG5jb25zdCBSZXN1bHRzID0gY29ubmVjdFN0YXRlUmVzdWx0cyhcbiAgKHsgc2VhcmNoaW5nLCBzZWFyY2hTdGF0ZTogc3RhdGUsIHNlYXJjaFJlc3VsdHM6IHJlcyB9KSA9PlxuICAgIChzZWFyY2hpbmcgJiYgYFNlYXJjaGluZy4uLmApIHx8IChyZXMgJiYgcmVzLm5iSGl0cyA9PT0gMCAmJiBgTm8gcmVzdWx0cyBmb3IgJyR7c3RhdGUucXVlcnl9J2ApXG4pO1xuXG5jb25zdCB1c2VDbGlja091dHNpZGUgPSAocmVmLCBoYW5kbGVyLCBldmVudHMpID0+IHtcbiAgaWYgKCFldmVudHMpIGV2ZW50cyA9IFtgbW91c2Vkb3duYCwgYHRvdWNoc3RhcnRgXTtcbiAgY29uc3QgZGV0ZWN0Q2xpY2tPdXRzaWRlID0gZXZlbnQgPT5cbiAgICByZWYgJiYgcmVmLmN1cnJlbnQgJiYgIXJlZi5jdXJyZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgaGFuZGxlcigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGRldGVjdENsaWNrT3V0c2lkZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBkZXRlY3RDbGlja091dHNpZGUpO1xuICAgIH07XG4gIH0pO1xufTtcblxuY29uc3Qgc2VhcmNoQ2xpZW50ID0gYWxnb2xpYXNlYXJjaChcbiAgY29uZmlnLmhlYWRlci5zZWFyY2guYWxnb2xpYUFwcElkLFxuICBjb25maWcuaGVhZGVyLnNlYXJjaC5hbGdvbGlhU2VhcmNoS2V5XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZWFyY2hDb21wb25lbnQoeyBpbmRpY2VzLCBjb2xsYXBzZSwgaGl0c0FzR3JpZCB9KSB7XG4gIGNvbnN0IHJlZiA9IGNyZWF0ZVJlZigpO1xuXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoYGApO1xuXG4gIGNvbnN0IFtmb2N1cywgc2V0Rm9jdXNdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUNsaWNrT3V0c2lkZShyZWYsICgpID0+IHNldEZvY3VzKGZhbHNlKSk7XG4gIGNvbnN0IGRpc3BsYXlSZXN1bHQgPSBxdWVyeS5sZW5ndGggPiAwICYmIGZvY3VzID8gJ3Nob3dSZXN1bHRzJyA6ICdoaWRlUmVzdWx0cyc7XG4gIHJldHVybiAoXG4gICAgPEluc3RhbnRTZWFyY2hcbiAgICAgIHNlYXJjaENsaWVudD17c2VhcmNoQ2xpZW50fVxuICAgICAgaW5kZXhOYW1lPXtpbmRpY2VzWzBdLm5hbWV9XG4gICAgICBvblNlYXJjaFN0YXRlQ2hhbmdlPXsoeyBxdWVyeSB9KSA9PiBzZXRRdWVyeShxdWVyeSl9XG4gICAgICByb290PXt7IFJvb3QsIHByb3BzOiB7IHJlZiB9IH19XG4gICAgPlxuICAgICAgPElucHV0IG9uRm9jdXM9eygpID0+IHNldEZvY3VzKHRydWUpfSB7Li4ueyBjb2xsYXBzZSwgZm9jdXMgfX0gLz5cbiAgICAgIDxIaXRzV3JhcHBlclxuICAgICAgICBjbGFzc05hbWU9eydoaXRXcmFwcGVyICcgKyBkaXNwbGF5UmVzdWx0fVxuICAgICAgICBzaG93PXtxdWVyeS5sZW5ndGggPiAwICYmIGZvY3VzfVxuICAgICAgICBhc0dyaWQ9e2hpdHNBc0dyaWR9XG4gICAgICA+XG4gICAgICAgIHtpbmRpY2VzLm1hcCgoeyBuYW1lLCB0aXRsZSwgaGl0Q29tcCwgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxJbmRleCBrZXk9e25hbWV9IGluZGV4TmFtZT17bmFtZX0+XG4gICAgICAgICAgICAgIDxSZXN1bHRzIC8+XG4gICAgICAgICAgICAgIDxIaXRzIGhpdENvbXBvbmVudD17aGl0Q29tcHNbaGl0Q29tcF0oKCkgPT4gc2V0Rm9jdXMoZmFsc2UpKX0gLz5cbiAgICAgICAgICAgIDwvSW5kZXg+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICAgIDxQb3dlcmVkQnkgLz5cbiAgICAgIDwvSGl0c1dyYXBwZXI+XG4gICAgICA8Q29uZmlndXJlIGhpdHNQZXJQYWdlPXs1fSAvPlxuICAgIDwvSW5zdGFudFNlYXJjaD5cbiAgKTtcbn1cbiJdfQ== */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});

const Results = (0,react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_7__["default"])(({
  searching,
  searchState: state,
  searchResults: res
}) => searching && `Searching...` || res && res.nbHits === 0 && `No results for '${state.query}'`);

const useClickOutside = (ref, handler, events) => {
  if (!events) events = [`mousedown`, `touchstart`];

  const detectClickOutside = event => ref && ref.current && !ref.current.contains(event.target) && handler();

  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    for (const event of events) document.addEventListener(event, detectClickOutside);

    return () => {
      for (const event of events) document.removeEventListener(event, detectClickOutside);
    };
  });
};

const searchClient = algoliasearch_lite__WEBPACK_IMPORTED_MODULE_8___default()((_config_js__WEBPACK_IMPORTED_MODULE_2___default().header.search.algoliaAppId), (_config_js__WEBPACK_IMPORTED_MODULE_2___default().header.search.algoliaSearchKey));
function SearchComponent({
  indices,
  collapse,
  hitsAsGrid
}) {
  const ref = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createRef)();
  const {
    0: query,
    1: setQuery
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(``);
  const {
    0: focus,
    1: setFocus
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  useClickOutside(ref, () => setFocus(false));
  const displayResult = query.length > 0 && focus ? 'showResults' : 'hideResults';
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_10__["default"], {
    searchClient: searchClient,
    indexName: indices[0].name,
    onSearchStateChange: ({
      query
    }) => setQuery(query),
    root: {
      Root,
      props: {
        ref
      }
    }
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(_input__WEBPACK_IMPORTED_MODULE_4__["default"], {
    onFocus: () => setFocus(true),
    collapse,
    focus
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(HitsWrapper, {
    className: 'hitWrapper ' + displayResult,
    show: query.length > 0 && focus,
    asGrid: hitsAsGrid
  }, indices.map(({
    name,
    title,
    hitComp,
    type
  }) => {
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_11__["default"], {
      key: name,
      indexName: name
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(Results, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_12__["default"], {
      hitComponent: _hitComps__WEBPACK_IMPORTED_MODULE_5__[hitComp](() => setFocus(false))
    }));
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(_styles__WEBPACK_IMPORTED_MODULE_3__.PoweredBy, null)), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_13__["default"], {
    hitsPerPage: 5
  }));
}

/***/ }),

/***/ "./src/components/search/input.js":
/*!****************************************!*\
  !*** ./src/components/search/input.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/styled/base */ "./node_modules/@emotion/styled/base/dist/emotion-styled-base.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-instantsearch-dom */ "./node_modules/react-instantsearch-core/dist/es/connectors/connectSearchBox.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.esm.js");
/* harmony import */ var _styled_icons_fa_solid_Search__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @styled-icons/fa-solid/Search */ "./node_modules/@styled-icons/fa-solid/Search/Search.esm.js");



const _excluded = ["refine"];

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }







const SearchIcon = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_2__["default"])(_styled_icons_fa_solid_Search__WEBPACK_IMPORTED_MODULE_4__.Search,  false ? 0 : {
  target: "e4vpgao2",
  label: "SearchIcon"
})( false ? 0 : {
  name: "cqufu4",
  styles: "width:1em;pointer-events:none;margin-right:10px;position:absolute;left:15px;color:#2fd2c5",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT2lDIiwiZmlsZSI6Ii9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0U2VhcmNoQm94IH0gZnJvbSAncmVhY3QtaW5zdGFudHNlYXJjaC1kb20nO1xuXG5pbXBvcnQgc3R5bGVkIGZyb20gJ0BlbW90aW9uL3N0eWxlZCc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICdAZW1vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBTZWFyY2ggfSBmcm9tICdAc3R5bGVkLWljb25zL2ZhLXNvbGlkL1NlYXJjaCc7XG5cbmNvbnN0IFNlYXJjaEljb24gPSBzdHlsZWQoU2VhcmNoKWBcbiAgd2lkdGg6IDFlbTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIG1hcmdpbi1yaWdodDogMTBweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAxNXB4O1xuICBjb2xvcjogIzJmZDJjNTtcbmA7XG5cbmNvbnN0IGZvY3VzID0gKHByb3BzKSA9PiBjc3NgXG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmRhcmtCbHVlfTtcbiAgY3Vyc29yOiB0ZXh0O1xuICB3aWR0aDogNWVtO1xuICArICR7U2VhcmNoSWNvbn0ge1xuICAgIGNvbG9yOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUuZGFya0JsdWV9O1xuICAgIG1hcmdpbjogMC4zZW07XG4gIH1cbmA7XG5cbmNvbnN0IGNvbGxhcHNlID0gKHByb3BzKSA9PiBjc3NgXG4gIHdpZHRoOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbG9yOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUubGlnaHRCbHVlfTtcbiAgKyAke1NlYXJjaEljb259IHtcbiAgICBjb2xvcjogd2hpdGU7XG4gIH1cbiAgJHsocHJvcHMpID0+IHByb3BzLmZvY3VzICYmIGZvY3VzKCl9XG4gIG1hcmdpbi1sZWZ0OiAkeyhwcm9wcykgPT4gKHByb3BzLmZvY3VzID8gYC0xLjZlbWAgOiBgLTFlbWApfTtcbiAgcGFkZGluZy1sZWZ0OiAkeyhwcm9wcykgPT4gKHByb3BzLmZvY3VzID8gYDEuNmVtYCA6IGAxZW1gKX07XG4gIDo6cGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUuZ3JheX07XG4gIH1cbmA7XG5cbmNvbnN0IGV4cGFuZCA9IChwcm9wcykgPT4gY3NzYFxuICBiYWNrZ3JvdW5kOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUudmVyeUxpZ2h0R3JheX07XG4gIHdpZHRoOiA2ZW07XG4gIG1hcmdpbi1sZWZ0OiAtMS42ZW07XG4gIHBhZGRpbmctbGVmdDogMS42ZW07XG4gICsgJHtTZWFyY2hJY29ufSB7XG4gICAgbWFyZ2luOiAwLjNlbTtcbiAgfVxuYDtcblxuY29uc3QgY29sbGFwc2VFeHBhbmQgPSAocHJvcHMpID0+IGNzc2BcbiAgJHsocHJvcHMpID0+IChwcm9wcy5jb2xsYXBzZSA/IGNvbGxhcHNlKCkgOiBleHBhbmQoKSl9XG5gO1xuXG5jb25zdCBJbnB1dCA9IHN0eWxlZC5pbnB1dGBcbiAgb3V0bGluZTogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICBmb250LXNpemU6IDFlbTtcbiAgYmFja2dyb3VuZDogd2hpdGU7XG4gIHRyYW5zaXRpb246ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5zaG9ydFRyYW5zfTtcbiAgYm9yZGVyLXJhZGl1czogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLnNtYWxsQm9yZGVyUmFkaXVzfTtcbiAge2NvbGxhcHNlRXhwYW5kfVxuYDtcblxuY29uc3QgRm9ybSA9IHN0eWxlZC5mb3JtYFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2N3B4KSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWFyZ2luLWxlZnQ6IDE1cHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3RTZWFyY2hCb3goKHsgcmVmaW5lLCAuLi5yZXN0IH0pID0+IHtcbiAgY29uc3QgcHJldmVudFN1Ym1pdCA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEZvcm0gY2xhc3NOYW1lPXsnZm9ybUVsZW1lbnQnfSBvblN1Ym1pdD17cHJldmVudFN1Ym1pdH0+XG4gICAgICA8U2VhcmNoSWNvbiAvPlxuICAgICAgPElucHV0XG4gICAgICAgIGNsYXNzTmFtZT17J3NlYXJjaElucHV0ICd9XG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiU2VhcmNoXCJcbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiByZWZpbmUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICB7Li4ucmVzdH1cbiAgICAgIC8+XG4gICAgPC9Gb3JtPlxuICApO1xufSk7XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});

const focus = props => /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.css)("background:white;color:", props => props.theme.darkBlue, ";cursor:text;width:5em;+", SearchIcon, "{color:", props => props.theme.darkBlue, ";margin:0.3em;}" + ( false ? 0 : ";label:focus;"),  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0I0QiIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2lucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdFNlYXJjaEJveCB9IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcblxuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgU2VhcmNoIH0gZnJvbSAnQHN0eWxlZC1pY29ucy9mYS1zb2xpZC9TZWFyY2gnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMTVweDtcbiAgY29sb3I6ICMyZmQyYzU7XG5gO1xuXG5jb25zdCBmb2N1cyA9IChwcm9wcykgPT4gY3NzYFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgY29sb3I6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5kYXJrQmx1ZX07XG4gIGN1cnNvcjogdGV4dDtcbiAgd2lkdGg6IDVlbTtcbiAgKyAke1NlYXJjaEljb259IHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmRhcmtCbHVlfTtcbiAgICBtYXJnaW46IDAuM2VtO1xuICB9XG5gO1xuXG5jb25zdCBjb2xsYXBzZSA9IChwcm9wcykgPT4gY3NzYFxuICB3aWR0aDogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmxpZ2h0Qmx1ZX07XG4gICsgJHtTZWFyY2hJY29ufSB7XG4gICAgY29sb3I6IHdoaXRlO1xuICB9XG4gICR7KHByb3BzKSA9PiBwcm9wcy5mb2N1cyAmJiBmb2N1cygpfVxuICBtYXJnaW4tbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAtMS42ZW1gIDogYC0xZW1gKX07XG4gIHBhZGRpbmctbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAxLjZlbWAgOiBgMWVtYCl9O1xuICA6OnBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmdyYXl9O1xuICB9XG5gO1xuXG5jb25zdCBleHBhbmQgPSAocHJvcHMpID0+IGNzc2BcbiAgYmFja2dyb3VuZDogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLnZlcnlMaWdodEdyYXl9O1xuICB3aWR0aDogNmVtO1xuICBtYXJnaW4tbGVmdDogLTEuNmVtO1xuICBwYWRkaW5nLWxlZnQ6IDEuNmVtO1xuICArICR7U2VhcmNoSWNvbn0ge1xuICAgIG1hcmdpbjogMC4zZW07XG4gIH1cbmA7XG5cbmNvbnN0IGNvbGxhcHNlRXhwYW5kID0gKHByb3BzKSA9PiBjc3NgXG4gICR7KHByb3BzKSA9PiAocHJvcHMuY29sbGFwc2UgPyBjb2xsYXBzZSgpIDogZXhwYW5kKCkpfVxuYDtcblxuY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIG91dGxpbmU6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgZm9udC1zaXplOiAxZW07XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICB0cmFuc2l0aW9uOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUuc2hvcnRUcmFuc307XG4gIGJvcmRlci1yYWRpdXM6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gIHtjb2xsYXBzZUV4cGFuZH1cbmA7XG5cbmNvbnN0IEZvcm0gPSBzdHlsZWQuZm9ybWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0U2VhcmNoQm94KCh7IHJlZmluZSwgLi4ucmVzdCB9KSA9PiB7XG4gIGNvbnN0IHByZXZlbnRTdWJtaXQgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxGb3JtIGNsYXNzTmFtZT17J2Zvcm1FbGVtZW50J30gb25TdWJtaXQ9e3ByZXZlbnRTdWJtaXR9PlxuICAgICAgPFNlYXJjaEljb24gLz5cbiAgICAgIDxJbnB1dFxuICAgICAgICBjbGFzc05hbWU9eydzZWFyY2hJbnB1dCAnfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlNlYXJjaFwiXG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gcmVmaW5lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAvPlxuICAgIDwvRm9ybT5cbiAgKTtcbn0pO1xuIl19 */");

const collapse = props => /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.css)("width:0;cursor:pointer;color:", props => props.theme.lightBlue, ";+", SearchIcon, "{color:white;}", props => props.focus && focus(), " margin-left:", props => props.focus ? `-1.6em` : `-1em`, ";padding-left:", props => props.focus ? `1.6em` : `1em`, ";::placeholder{color:", props => props.theme.gray, ";}" + ( false ? 0 : ";label:collapse;"),  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMkIrQiIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2lucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdFNlYXJjaEJveCB9IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcblxuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgU2VhcmNoIH0gZnJvbSAnQHN0eWxlZC1pY29ucy9mYS1zb2xpZC9TZWFyY2gnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMTVweDtcbiAgY29sb3I6ICMyZmQyYzU7XG5gO1xuXG5jb25zdCBmb2N1cyA9IChwcm9wcykgPT4gY3NzYFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgY29sb3I6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5kYXJrQmx1ZX07XG4gIGN1cnNvcjogdGV4dDtcbiAgd2lkdGg6IDVlbTtcbiAgKyAke1NlYXJjaEljb259IHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmRhcmtCbHVlfTtcbiAgICBtYXJnaW46IDAuM2VtO1xuICB9XG5gO1xuXG5jb25zdCBjb2xsYXBzZSA9IChwcm9wcykgPT4gY3NzYFxuICB3aWR0aDogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmxpZ2h0Qmx1ZX07XG4gICsgJHtTZWFyY2hJY29ufSB7XG4gICAgY29sb3I6IHdoaXRlO1xuICB9XG4gICR7KHByb3BzKSA9PiBwcm9wcy5mb2N1cyAmJiBmb2N1cygpfVxuICBtYXJnaW4tbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAtMS42ZW1gIDogYC0xZW1gKX07XG4gIHBhZGRpbmctbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAxLjZlbWAgOiBgMWVtYCl9O1xuICA6OnBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmdyYXl9O1xuICB9XG5gO1xuXG5jb25zdCBleHBhbmQgPSAocHJvcHMpID0+IGNzc2BcbiAgYmFja2dyb3VuZDogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLnZlcnlMaWdodEdyYXl9O1xuICB3aWR0aDogNmVtO1xuICBtYXJnaW4tbGVmdDogLTEuNmVtO1xuICBwYWRkaW5nLWxlZnQ6IDEuNmVtO1xuICArICR7U2VhcmNoSWNvbn0ge1xuICAgIG1hcmdpbjogMC4zZW07XG4gIH1cbmA7XG5cbmNvbnN0IGNvbGxhcHNlRXhwYW5kID0gKHByb3BzKSA9PiBjc3NgXG4gICR7KHByb3BzKSA9PiAocHJvcHMuY29sbGFwc2UgPyBjb2xsYXBzZSgpIDogZXhwYW5kKCkpfVxuYDtcblxuY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIG91dGxpbmU6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgZm9udC1zaXplOiAxZW07XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICB0cmFuc2l0aW9uOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUuc2hvcnRUcmFuc307XG4gIGJvcmRlci1yYWRpdXM6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gIHtjb2xsYXBzZUV4cGFuZH1cbmA7XG5cbmNvbnN0IEZvcm0gPSBzdHlsZWQuZm9ybWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0U2VhcmNoQm94KCh7IHJlZmluZSwgLi4ucmVzdCB9KSA9PiB7XG4gIGNvbnN0IHByZXZlbnRTdWJtaXQgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxGb3JtIGNsYXNzTmFtZT17J2Zvcm1FbGVtZW50J30gb25TdWJtaXQ9e3ByZXZlbnRTdWJtaXR9PlxuICAgICAgPFNlYXJjaEljb24gLz5cbiAgICAgIDxJbnB1dFxuICAgICAgICBjbGFzc05hbWU9eydzZWFyY2hJbnB1dCAnfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlNlYXJjaFwiXG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gcmVmaW5lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAvPlxuICAgIDwvRm9ybT5cbiAgKTtcbn0pO1xuIl19 */");

const expand = props => /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.css)("background:", props => props.theme.veryLightGray, ";width:6em;margin-left:-1.6em;padding-left:1.6em;+", SearchIcon, "{margin:0.3em;}" + ( false ? 0 : ";label:expand;"),  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMEM2QiIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2lucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdFNlYXJjaEJveCB9IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcblxuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgU2VhcmNoIH0gZnJvbSAnQHN0eWxlZC1pY29ucy9mYS1zb2xpZC9TZWFyY2gnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMTVweDtcbiAgY29sb3I6ICMyZmQyYzU7XG5gO1xuXG5jb25zdCBmb2N1cyA9IChwcm9wcykgPT4gY3NzYFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgY29sb3I6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5kYXJrQmx1ZX07XG4gIGN1cnNvcjogdGV4dDtcbiAgd2lkdGg6IDVlbTtcbiAgKyAke1NlYXJjaEljb259IHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmRhcmtCbHVlfTtcbiAgICBtYXJnaW46IDAuM2VtO1xuICB9XG5gO1xuXG5jb25zdCBjb2xsYXBzZSA9IChwcm9wcykgPT4gY3NzYFxuICB3aWR0aDogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmxpZ2h0Qmx1ZX07XG4gICsgJHtTZWFyY2hJY29ufSB7XG4gICAgY29sb3I6IHdoaXRlO1xuICB9XG4gICR7KHByb3BzKSA9PiBwcm9wcy5mb2N1cyAmJiBmb2N1cygpfVxuICBtYXJnaW4tbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAtMS42ZW1gIDogYC0xZW1gKX07XG4gIHBhZGRpbmctbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAxLjZlbWAgOiBgMWVtYCl9O1xuICA6OnBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmdyYXl9O1xuICB9XG5gO1xuXG5jb25zdCBleHBhbmQgPSAocHJvcHMpID0+IGNzc2BcbiAgYmFja2dyb3VuZDogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLnZlcnlMaWdodEdyYXl9O1xuICB3aWR0aDogNmVtO1xuICBtYXJnaW4tbGVmdDogLTEuNmVtO1xuICBwYWRkaW5nLWxlZnQ6IDEuNmVtO1xuICArICR7U2VhcmNoSWNvbn0ge1xuICAgIG1hcmdpbjogMC4zZW07XG4gIH1cbmA7XG5cbmNvbnN0IGNvbGxhcHNlRXhwYW5kID0gKHByb3BzKSA9PiBjc3NgXG4gICR7KHByb3BzKSA9PiAocHJvcHMuY29sbGFwc2UgPyBjb2xsYXBzZSgpIDogZXhwYW5kKCkpfVxuYDtcblxuY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIG91dGxpbmU6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgZm9udC1zaXplOiAxZW07XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICB0cmFuc2l0aW9uOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUuc2hvcnRUcmFuc307XG4gIGJvcmRlci1yYWRpdXM6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gIHtjb2xsYXBzZUV4cGFuZH1cbmA7XG5cbmNvbnN0IEZvcm0gPSBzdHlsZWQuZm9ybWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0U2VhcmNoQm94KCh7IHJlZmluZSwgLi4ucmVzdCB9KSA9PiB7XG4gIGNvbnN0IHByZXZlbnRTdWJtaXQgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxGb3JtIGNsYXNzTmFtZT17J2Zvcm1FbGVtZW50J30gb25TdWJtaXQ9e3ByZXZlbnRTdWJtaXR9PlxuICAgICAgPFNlYXJjaEljb24gLz5cbiAgICAgIDxJbnB1dFxuICAgICAgICBjbGFzc05hbWU9eydzZWFyY2hJbnB1dCAnfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlNlYXJjaFwiXG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gcmVmaW5lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAvPlxuICAgIDwvRm9ybT5cbiAgKTtcbn0pO1xuIl19 */");

const collapseExpand = props => /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.css)(props => props.collapse ? collapse() : expand(), ";" + ( false ? 0 : ";label:collapseExpand;"),  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBb0RxQyIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2lucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdFNlYXJjaEJveCB9IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcblxuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgU2VhcmNoIH0gZnJvbSAnQHN0eWxlZC1pY29ucy9mYS1zb2xpZC9TZWFyY2gnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMTVweDtcbiAgY29sb3I6ICMyZmQyYzU7XG5gO1xuXG5jb25zdCBmb2N1cyA9IChwcm9wcykgPT4gY3NzYFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgY29sb3I6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5kYXJrQmx1ZX07XG4gIGN1cnNvcjogdGV4dDtcbiAgd2lkdGg6IDVlbTtcbiAgKyAke1NlYXJjaEljb259IHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmRhcmtCbHVlfTtcbiAgICBtYXJnaW46IDAuM2VtO1xuICB9XG5gO1xuXG5jb25zdCBjb2xsYXBzZSA9IChwcm9wcykgPT4gY3NzYFxuICB3aWR0aDogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmxpZ2h0Qmx1ZX07XG4gICsgJHtTZWFyY2hJY29ufSB7XG4gICAgY29sb3I6IHdoaXRlO1xuICB9XG4gICR7KHByb3BzKSA9PiBwcm9wcy5mb2N1cyAmJiBmb2N1cygpfVxuICBtYXJnaW4tbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAtMS42ZW1gIDogYC0xZW1gKX07XG4gIHBhZGRpbmctbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAxLjZlbWAgOiBgMWVtYCl9O1xuICA6OnBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmdyYXl9O1xuICB9XG5gO1xuXG5jb25zdCBleHBhbmQgPSAocHJvcHMpID0+IGNzc2BcbiAgYmFja2dyb3VuZDogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLnZlcnlMaWdodEdyYXl9O1xuICB3aWR0aDogNmVtO1xuICBtYXJnaW4tbGVmdDogLTEuNmVtO1xuICBwYWRkaW5nLWxlZnQ6IDEuNmVtO1xuICArICR7U2VhcmNoSWNvbn0ge1xuICAgIG1hcmdpbjogMC4zZW07XG4gIH1cbmA7XG5cbmNvbnN0IGNvbGxhcHNlRXhwYW5kID0gKHByb3BzKSA9PiBjc3NgXG4gICR7KHByb3BzKSA9PiAocHJvcHMuY29sbGFwc2UgPyBjb2xsYXBzZSgpIDogZXhwYW5kKCkpfVxuYDtcblxuY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIG91dGxpbmU6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgZm9udC1zaXplOiAxZW07XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICB0cmFuc2l0aW9uOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUuc2hvcnRUcmFuc307XG4gIGJvcmRlci1yYWRpdXM6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gIHtjb2xsYXBzZUV4cGFuZH1cbmA7XG5cbmNvbnN0IEZvcm0gPSBzdHlsZWQuZm9ybWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0U2VhcmNoQm94KCh7IHJlZmluZSwgLi4ucmVzdCB9KSA9PiB7XG4gIGNvbnN0IHByZXZlbnRTdWJtaXQgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxGb3JtIGNsYXNzTmFtZT17J2Zvcm1FbGVtZW50J30gb25TdWJtaXQ9e3ByZXZlbnRTdWJtaXR9PlxuICAgICAgPFNlYXJjaEljb24gLz5cbiAgICAgIDxJbnB1dFxuICAgICAgICBjbGFzc05hbWU9eydzZWFyY2hJbnB1dCAnfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlNlYXJjaFwiXG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gcmVmaW5lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAvPlxuICAgIDwvRm9ybT5cbiAgKTtcbn0pO1xuIl19 */");

const Input = (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_2__["default"])("input",  false ? 0 : {
  target: "e4vpgao1",
  label: "Input"
})("outline:none;border:none;font-size:1em;background:white;transition:", props => props.theme.shortTrans, ";border-radius:", props => props.theme.smallBorderRadius, ";{}" + ( false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBd0QwQiIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2lucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdFNlYXJjaEJveCB9IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcblxuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgU2VhcmNoIH0gZnJvbSAnQHN0eWxlZC1pY29ucy9mYS1zb2xpZC9TZWFyY2gnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMTVweDtcbiAgY29sb3I6ICMyZmQyYzU7XG5gO1xuXG5jb25zdCBmb2N1cyA9IChwcm9wcykgPT4gY3NzYFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgY29sb3I6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5kYXJrQmx1ZX07XG4gIGN1cnNvcjogdGV4dDtcbiAgd2lkdGg6IDVlbTtcbiAgKyAke1NlYXJjaEljb259IHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmRhcmtCbHVlfTtcbiAgICBtYXJnaW46IDAuM2VtO1xuICB9XG5gO1xuXG5jb25zdCBjb2xsYXBzZSA9IChwcm9wcykgPT4gY3NzYFxuICB3aWR0aDogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmxpZ2h0Qmx1ZX07XG4gICsgJHtTZWFyY2hJY29ufSB7XG4gICAgY29sb3I6IHdoaXRlO1xuICB9XG4gICR7KHByb3BzKSA9PiBwcm9wcy5mb2N1cyAmJiBmb2N1cygpfVxuICBtYXJnaW4tbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAtMS42ZW1gIDogYC0xZW1gKX07XG4gIHBhZGRpbmctbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAxLjZlbWAgOiBgMWVtYCl9O1xuICA6OnBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmdyYXl9O1xuICB9XG5gO1xuXG5jb25zdCBleHBhbmQgPSAocHJvcHMpID0+IGNzc2BcbiAgYmFja2dyb3VuZDogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLnZlcnlMaWdodEdyYXl9O1xuICB3aWR0aDogNmVtO1xuICBtYXJnaW4tbGVmdDogLTEuNmVtO1xuICBwYWRkaW5nLWxlZnQ6IDEuNmVtO1xuICArICR7U2VhcmNoSWNvbn0ge1xuICAgIG1hcmdpbjogMC4zZW07XG4gIH1cbmA7XG5cbmNvbnN0IGNvbGxhcHNlRXhwYW5kID0gKHByb3BzKSA9PiBjc3NgXG4gICR7KHByb3BzKSA9PiAocHJvcHMuY29sbGFwc2UgPyBjb2xsYXBzZSgpIDogZXhwYW5kKCkpfVxuYDtcblxuY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIG91dGxpbmU6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgZm9udC1zaXplOiAxZW07XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICB0cmFuc2l0aW9uOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUuc2hvcnRUcmFuc307XG4gIGJvcmRlci1yYWRpdXM6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gIHtjb2xsYXBzZUV4cGFuZH1cbmA7XG5cbmNvbnN0IEZvcm0gPSBzdHlsZWQuZm9ybWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0U2VhcmNoQm94KCh7IHJlZmluZSwgLi4ucmVzdCB9KSA9PiB7XG4gIGNvbnN0IHByZXZlbnRTdWJtaXQgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxGb3JtIGNsYXNzTmFtZT17J2Zvcm1FbGVtZW50J30gb25TdWJtaXQ9e3ByZXZlbnRTdWJtaXR9PlxuICAgICAgPFNlYXJjaEljb24gLz5cbiAgICAgIDxJbnB1dFxuICAgICAgICBjbGFzc05hbWU9eydzZWFyY2hJbnB1dCAnfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlNlYXJjaFwiXG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gcmVmaW5lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAvPlxuICAgIDwvRm9ybT5cbiAgKTtcbn0pO1xuIl19 */"));

const Form = (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_2__["default"])("form",  false ? 0 : {
  target: "e4vpgao0",
  label: "Form"
})( false ? 0 : {
  name: "pxthj4",
  styles: "display:flex;align-items:center;@media only screen and (max-width: 767px){width:100%;margin-left:15px;}",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91cnZsL1Byb2plY3RzL19vcGVucy9jbG91ZHByby1jbHViL3dpa2kvZG9jcy9zcmMvY29tcG9uZW50cy9zZWFyY2gvaW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0V3QiIsImZpbGUiOiIvVXNlcnMvdXJ2bC9Qcm9qZWN0cy9fb3BlbnMvY2xvdWRwcm8tY2x1Yi93aWtpL2RvY3Mvc3JjL2NvbXBvbmVudHMvc2VhcmNoL2lucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdFNlYXJjaEJveCB9IGZyb20gJ3JlYWN0LWluc3RhbnRzZWFyY2gtZG9tJztcblxuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgU2VhcmNoIH0gZnJvbSAnQHN0eWxlZC1pY29ucy9mYS1zb2xpZC9TZWFyY2gnO1xuXG5jb25zdCBTZWFyY2hJY29uID0gc3R5bGVkKFNlYXJjaClgXG4gIHdpZHRoOiAxZW07XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMTVweDtcbiAgY29sb3I6ICMyZmQyYzU7XG5gO1xuXG5jb25zdCBmb2N1cyA9IChwcm9wcykgPT4gY3NzYFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgY29sb3I6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5kYXJrQmx1ZX07XG4gIGN1cnNvcjogdGV4dDtcbiAgd2lkdGg6IDVlbTtcbiAgKyAke1NlYXJjaEljb259IHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmRhcmtCbHVlfTtcbiAgICBtYXJnaW46IDAuM2VtO1xuICB9XG5gO1xuXG5jb25zdCBjb2xsYXBzZSA9IChwcm9wcykgPT4gY3NzYFxuICB3aWR0aDogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmxpZ2h0Qmx1ZX07XG4gICsgJHtTZWFyY2hJY29ufSB7XG4gICAgY29sb3I6IHdoaXRlO1xuICB9XG4gICR7KHByb3BzKSA9PiBwcm9wcy5mb2N1cyAmJiBmb2N1cygpfVxuICBtYXJnaW4tbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAtMS42ZW1gIDogYC0xZW1gKX07XG4gIHBhZGRpbmctbGVmdDogJHsocHJvcHMpID0+IChwcm9wcy5mb2N1cyA/IGAxLjZlbWAgOiBgMWVtYCl9O1xuICA6OnBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmdyYXl9O1xuICB9XG5gO1xuXG5jb25zdCBleHBhbmQgPSAocHJvcHMpID0+IGNzc2BcbiAgYmFja2dyb3VuZDogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLnZlcnlMaWdodEdyYXl9O1xuICB3aWR0aDogNmVtO1xuICBtYXJnaW4tbGVmdDogLTEuNmVtO1xuICBwYWRkaW5nLWxlZnQ6IDEuNmVtO1xuICArICR7U2VhcmNoSWNvbn0ge1xuICAgIG1hcmdpbjogMC4zZW07XG4gIH1cbmA7XG5cbmNvbnN0IGNvbGxhcHNlRXhwYW5kID0gKHByb3BzKSA9PiBjc3NgXG4gICR7KHByb3BzKSA9PiAocHJvcHMuY29sbGFwc2UgPyBjb2xsYXBzZSgpIDogZXhwYW5kKCkpfVxuYDtcblxuY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIG91dGxpbmU6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgZm9udC1zaXplOiAxZW07XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICB0cmFuc2l0aW9uOiAkeyhwcm9wcykgPT4gcHJvcHMudGhlbWUuc2hvcnRUcmFuc307XG4gIGJvcmRlci1yYWRpdXM6ICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5zbWFsbEJvcmRlclJhZGl1c307XG4gIHtjb2xsYXBzZUV4cGFuZH1cbmA7XG5cbmNvbnN0IEZvcm0gPSBzdHlsZWQuZm9ybWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjdweCkge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0U2VhcmNoQm94KCh7IHJlZmluZSwgLi4ucmVzdCB9KSA9PiB7XG4gIGNvbnN0IHByZXZlbnRTdWJtaXQgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxGb3JtIGNsYXNzTmFtZT17J2Zvcm1FbGVtZW50J30gb25TdWJtaXQ9e3ByZXZlbnRTdWJtaXR9PlxuICAgICAgPFNlYXJjaEljb24gLz5cbiAgICAgIDxJbnB1dFxuICAgICAgICBjbGFzc05hbWU9eydzZWFyY2hJbnB1dCAnfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIlNlYXJjaFwiXG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gcmVmaW5lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAvPlxuICAgIDwvRm9ybT5cbiAgKTtcbn0pO1xuIl19 */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_instantsearch_dom__WEBPACK_IMPORTED_MODULE_6__["default"])(_ref => {
  let {
    refine
  } = _ref,
      rest = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, _excluded);

  const preventSubmit = e => {
    e.preventDefault();
  };

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.jsx)(Form, {
    className: 'formElement',
    onSubmit: preventSubmit
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.jsx)(SearchIcon, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.jsx)(Input, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    className: 'searchInput ',
    type: "text",
    placeholder: "Search",
    "aria-label": "Search",
    onChange: e => refine(e.target.value)
  }, rest)));
}));

/***/ }),

/***/ "./src/components/search/styles.js":
/*!*****************************************!*\
  !*** ./src/components/search/styles.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PoweredBy": () => (/* binding */ PoweredBy)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styled_icons_fa_brands_Algolia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @styled-icons/fa-brands/Algolia */ "./node_modules/@styled-icons/fa-brands/Algolia/Algolia.esm.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.esm.js");



const PoweredBy = () => (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
  className: "poweredBy"
}, "Powered by", ` `, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
  href: "https://algolia.com"
}, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__.jsx)(_styled_icons_fa_brands_Algolia__WEBPACK_IMPORTED_MODULE_2__.Algolia, {
  size: "1em"
}), " Algolia"));

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/connectors/connectConfigure.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/connectors/connectConfigure.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/utils */ "./node_modules/react-instantsearch-core/dist/es/core/utils.js");
/* harmony import */ var _core_createConnector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/createConnector */ "./node_modules/react-instantsearch-core/dist/es/core/createConnector.js");
/* harmony import */ var _core_indexUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/indexUtils */ "./node_modules/react-instantsearch-core/dist/es/core/indexUtils.js");


var _excluded = ["children", "contextValue", "indexContextValue"],
    _excluded2 = ["children", "contextValue", "indexContextValue"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }





function getId() {
  return 'configure';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_core_createConnector__WEBPACK_IMPORTED_MODULE_2__["default"])({
  displayName: 'AlgoliaConfigure',
  getProvidedProps: function getProvidedProps() {
    return {};
  },
  getSearchParameters: function getSearchParameters(searchParameters, props) {
    var children = props.children,
        contextValue = props.contextValue,
        indexContextValue = props.indexContextValue,
        items = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(props, _excluded);

    return searchParameters.setQueryParameters(items);
  },
  transitionState: function transitionState(props, prevSearchState, nextSearchState) {
    var id = getId();

    var children = props.children,
        contextValue = props.contextValue,
        indexContextValue = props.indexContextValue,
        items = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(props, _excluded2);

    var propKeys = Object.keys(props);
    var nonPresentKeys = this._props ? Object.keys(this._props).filter(function (prop) {
      return propKeys.indexOf(prop) === -1;
    }) : [];
    this._props = props;

    var nextValue = (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, id, _objectSpread(_objectSpread({}, (0,_core_utils__WEBPACK_IMPORTED_MODULE_3__.omit)(nextSearchState[id], nonPresentKeys)), items));

    return (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_4__.refineValue)(nextSearchState, nextValue, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
  },
  cleanUp: function cleanUp(props, searchState) {
    var id = getId();
    var indexId = (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_4__.getIndexId)({
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
    var subState = (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_4__.hasMultipleIndices)({
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }) && searchState.indices ? searchState.indices[indexId] : searchState;
    var configureKeys = subState && subState[id] ? Object.keys(subState[id]) : [];
    var configureState = configureKeys.reduce(function (acc, item) {
      if (!props[item]) {
        acc[item] = subState[id][item];
      }

      return acc;
    }, {});

    var nextValue = (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, id, configureState);

    return (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_4__.refineValue)(searchState, nextValue, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
  }
}));

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/connectors/connectHighlight.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/connectors/connectHighlight.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_createConnector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/createConnector */ "./node_modules/react-instantsearch-core/dist/es/core/createConnector.js");
/* harmony import */ var _core_highlight__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/highlight */ "./node_modules/react-instantsearch-core/dist/es/core/highlight.js");



var highlight = function highlight(_ref) {
  var attribute = _ref.attribute,
      hit = _ref.hit,
      highlightProperty = _ref.highlightProperty,
      _ref$preTag = _ref.preTag,
      preTag = _ref$preTag === void 0 ? _core_highlight__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_TAGS.highlightPreTag : _ref$preTag,
      _ref$postTag = _ref.postTag,
      postTag = _ref$postTag === void 0 ? _core_highlight__WEBPACK_IMPORTED_MODULE_0__.HIGHLIGHT_TAGS.highlightPostTag : _ref$postTag;
  return (0,_core_highlight__WEBPACK_IMPORTED_MODULE_0__.parseAlgoliaHit)({
    attribute: attribute,
    highlightProperty: highlightProperty,
    hit: hit,
    preTag: preTag,
    postTag: postTag
  });
};
/**
 * connectHighlight connector provides the logic to create an highlighter
 * component that will retrieve, parse and render an highlighted attribute
 * from an Algolia hit.
 * @name connectHighlight
 * @kind connector
 * @category connector
 * @providedPropType {function} highlight - function to retrieve and parse an attribute from a hit. It takes a configuration object with 3 attributes: `highlightProperty` which is the property that contains the highlight structure from the records, `attribute` which is the name of the attribute (it can be either a string or an array of strings) to look for and `hit` which is the hit from Algolia. It returns an array of objects `{value: string, isHighlighted: boolean}`. If the element that corresponds to the attribute is an array of strings, it will return a nested array of objects.
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, SearchBox, Hits, connectHighlight } from 'react-instantsearch-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const CustomHighlight = connectHighlight(
 *   ({ highlight, attribute, hit, highlightProperty }) => {
 *     const highlights = highlight({
 *       highlightProperty: '_highlightResult',
 *       attribute,
 *       hit
 *     });
 *
 *     return highlights.map(part => part.isHighlighted ? (
 *       <mark>{part.value}</mark>
 *     ) : (
 *       <span>{part.value}</span>
 *     ));
 *   }
 * );
 *
 * const Hit = ({ hit }) => (
 *   <p>
 *     <CustomHighlight attribute="name" hit={hit} />
 *   </p>
 * );
 *
 * const App = () => (
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <SearchBox defaultRefinement="pho" />
 *     <Hits hitComponent={Hit} />
 *   </InstantSearch>
 * );
 */


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_core_createConnector__WEBPACK_IMPORTED_MODULE_1__["default"])({
  displayName: 'AlgoliaHighlighter',
  propTypes: {},
  getProvidedProps: function getProvidedProps() {
    return {
      highlight: highlight
    };
  }
}));

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/connectors/connectHits.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/connectors/connectHits.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_createConnector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/createConnector */ "./node_modules/react-instantsearch-core/dist/es/core/createConnector.js");
/* harmony import */ var _core_indexUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/indexUtils */ "./node_modules/react-instantsearch-core/dist/es/core/indexUtils.js");
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/utils */ "./node_modules/react-instantsearch-core/dist/es/core/utils.js");



/**
 * connectHits connector provides the logic to create connected
 * components that will render the results retrieved from
 * Algolia.
 *
 * To configure the number of hits retrieved, use [HitsPerPage widget](widgets/HitsPerPage.html),
 * [connectHitsPerPage connector](connectors/connectHitsPerPage.html) or pass the hitsPerPage
 * prop to a [Configure](guide/Search_parameters.html) widget.
 *
 * **Warning:** you will need to use the **objectID** property available on every hit as a key
 * when iterating over them. This will ensure you have the best possible UI experience
 * especially on slow networks.
 * @name connectHits
 * @kind connector
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, Highlight, connectHits } from 'react-instantsearch-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 * const CustomHits = connectHits(({ hits }) => (
 *   <div>
 *     {hits.map(hit =>
 *       <p key={hit.objectID}>
 *         <Highlight attribute="name" hit={hit} />
 *       </p>
 *     )}
 *   </div>
 * ));
 *
 * const App = () => (
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <CustomHits />
 *   </InstantSearch>
 * );
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_core_createConnector__WEBPACK_IMPORTED_MODULE_0__["default"])({
  displayName: 'AlgoliaHits',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var results = (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_1__.getResults)(searchResults, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });

    if (!results) {
      return {
        hits: []
      };
    }

    var hitsWithPositions = (0,_core_utils__WEBPACK_IMPORTED_MODULE_2__.addAbsolutePositions)(results.hits, results.hitsPerPage, results.page);
    var hitsWithPositionsAndQueryID = (0,_core_utils__WEBPACK_IMPORTED_MODULE_2__.addQueryID)(hitsWithPositions, results.queryID);
    return {
      hits: hitsWithPositionsAndQueryID
    };
  },

  /**
   * Hits needs to be considered as a widget to trigger a search,
   * even if no other widgets are used.
   *
   * To be considered as a widget you need either:
   * - getSearchParameters
   * - getMetadata
   * - transitionState
   *
   * See: createConnector.tsx
   */
  getSearchParameters: function getSearchParameters(searchParameters) {
    return searchParameters;
  }
}));

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/connectors/connectSearchBox.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/connectors/connectSearchBox.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_createConnector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/createConnector */ "./node_modules/react-instantsearch-core/dist/es/core/createConnector.js");
/* harmony import */ var _core_indexUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/indexUtils */ "./node_modules/react-instantsearch-core/dist/es/core/indexUtils.js");





function getId() {
  return 'query';
}

function getCurrentRefinement(props, searchState, context) {
  var id = getId(props);
  var currentRefinement = (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_2__.getCurrentRefinementValue)(props, searchState, context, id, '');

  if (currentRefinement) {
    return currentRefinement;
  }

  return '';
}

function _refine(props, searchState, nextRefinement, context) {
  var id = getId();

  var nextValue = (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, id, nextRefinement);

  var resetPage = true;
  return (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_2__.refineValue)(searchState, nextValue, context, resetPage);
}

function _cleanUp(props, searchState, context) {
  return (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_2__.cleanUpValue)(searchState, context, getId());
}
/**
 * connectSearchBox connector provides the logic to build a widget that will
 * let the user search for a query
 * @name connectSearchBox
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {function} refine - a function to change the current query
 * @providedPropType {string} currentRefinement - the current query used
 * @providedPropType {boolean} isSearchStalled - a flag that indicates if InstantSearch has detected that searches are stalled
 */


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_core_createConnector__WEBPACK_IMPORTED_MODULE_3__["default"])({
  displayName: 'AlgoliaSearchBox',
  propTypes: {
    defaultRefinement: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string)
  },
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    return {
      currentRefinement: getCurrentRefinement(props, searchState, {
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue
      }),
      isSearchStalled: searchResults.isSearchStalled
    };
  },
  refine: function refine(props, searchState, nextRefinement) {
    return _refine(props, searchState, nextRefinement, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
  },
  cleanUp: function cleanUp(props, searchState) {
    return _cleanUp(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQuery(getCurrentRefinement(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    }));
  },
  getMetadata: function getMetadata(props, searchState) {
    var id = getId(props);
    var currentRefinement = getCurrentRefinement(props, searchState, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
    return {
      id: id,
      index: (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_2__.getIndexId)({
        ais: props.contextValue,
        multiIndexContext: props.indexContextValue
      }),
      items: currentRefinement === null ? [] : [{
        label: "".concat(id, ": ").concat(currentRefinement),
        value: function value(nextState) {
          return _refine(props, nextState, '', {
            ais: props.contextValue,
            multiIndexContext: props.indexContextValue
          });
        },
        currentRefinement: currentRefinement
      }]
    };
  }
}));

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/connectors/connectStateResults.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/connectors/connectStateResults.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_createConnector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/createConnector */ "./node_modules/react-instantsearch-core/dist/es/core/createConnector.js");
/* harmony import */ var _core_indexUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/indexUtils */ "./node_modules/react-instantsearch-core/dist/es/core/indexUtils.js");


/**
 * The `connectStateResults` connector provides a way to access the `searchState` and the `searchResults`
 * of InstantSearch.
 * For instance this connector allows you to create results/noResults or query/noQuery pages.
 * @name connectStateResults
 * @kind connector
 * @providedPropType {object} searchState - The search state of the instant search component. <br/><br/> See: [Search state structure](https://community.algolia.com/react-instantsearch/guide/Search_state.html)
 * @providedPropType {object} searchResults - The search results. <br/><br/> In case of multiple indices: if used under `<Index>`, results will be those of the corresponding index otherwise it'll be those of the root index  See: [Search results structure](https://community.algolia.com/algoliasearch-helper-js/reference.html#searchresults)
 * @providedPropType {object} allSearchResults - In case of multiple indices you can retrieve all the results
 * @providedPropType {string} error - If the search failed, the error will be logged here.
 * @providedPropType {boolean} searching - If there is a search in progress.
 * @providedPropType {boolean} isSearchStalled - Flag that indicates if React InstantSearch has detected that searches are stalled.
 * @providedPropType {boolean} searchingForFacetValues - If there is a search in a list in progress.
 * @providedPropType {object} props - component props.
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, SearchBox, Hits, connectStateResults } from 'react-instantsearch-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const Content = connectStateResults(({ searchState, searchResults }) => {
 *   const hasResults = searchResults && searchResults.nbHits !== 0;
 *
 *    return (
 *      <div>
 *        <div hidden={!hasResults}>
 *          <Hits />
 *        </div>
 *        <div hidden={hasResults}>
 *          <div>No results has been found for {searchState.query}</div>
 *        </div>
 *      </div>
 *    );
 * });
 *
 * const App = () => (
 *   <InstantSearch
 *      searchClient={searchClient}
 *      indexName="instant_search"
 *    >
 *      <SearchBox />
 *      <Content />
 *    </InstantSearch>
 * );
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_core_createConnector__WEBPACK_IMPORTED_MODULE_0__["default"])({
  displayName: 'AlgoliaStateResults',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var results = (0,_core_indexUtils__WEBPACK_IMPORTED_MODULE_1__.getResults)(searchResults, {
      ais: props.contextValue,
      multiIndexContext: props.indexContextValue
    });
    return {
      searchState: searchState,
      searchResults: results,
      allSearchResults: searchResults.results,
      searching: searchResults.searching,
      isSearchStalled: searchResults.isSearchStalled,
      error: searchResults.error,
      searchingForFacetValues: searchResults.searchingForFacetValues,
      props: props
    };
  }
}));

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/context.js":
/*!***********************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/context.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "instantSearchContext": () => (/* binding */ instantSearchContext),
/* harmony export */   "InstantSearchConsumer": () => (/* binding */ InstantSearchConsumer),
/* harmony export */   "InstantSearchProvider": () => (/* binding */ InstantSearchProvider),
/* harmony export */   "IndexConsumer": () => (/* binding */ IndexConsumer),
/* harmony export */   "IndexProvider": () => (/* binding */ IndexProvider)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var instantSearchContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  onInternalStateUpdate: function onInternalStateUpdate() {
    return undefined;
  },
  createHrefForState: function createHrefForState() {
    return '#';
  },
  onSearchForFacetValues: function onSearchForFacetValues() {
    return undefined;
  },
  onSearchStateChange: function onSearchStateChange() {
    return undefined;
  },
  onSearchParameters: function onSearchParameters() {
    return undefined;
  },
  store: {},
  widgetsManager: {},
  mainTargetedIndex: ''
});
var InstantSearchConsumer = instantSearchContext.Consumer,
    InstantSearchProvider = instantSearchContext.Provider;


var _createContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined),
    IndexConsumer = _createContext.Consumer,
    IndexProvider = _createContext.Provider;



/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/createConnector.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/createConnector.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createConnectorWithoutContext": () => (/* binding */ createConnectorWithoutContext),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react_fast_compare__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-fast-compare */ "./node_modules/react-fast-compare/index.js");
/* harmony import */ var react_fast_compare__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_fast_compare__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils */ "./node_modules/react-instantsearch-core/dist/es/core/utils.js");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./context */ "./node_modules/react-instantsearch-core/dist/es/core/context.js");









var _excluded = ["contextValue"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }






/**
 * Connectors are the HOC used to transform React components
 * into InstantSearch widgets.
 * In order to simplify the construction of such connectors
 * `createConnector` takes a description and transform it into
 * a connector.
 * @param {ConnectorDescription} connectorDesc the description of the connector
 * @return {Connector} a function that wraps a component into
 * an instantsearch connected one.
 */
function createConnectorWithoutContext(connectorDesc) {
  if (!connectorDesc.displayName) {
    throw new Error('`createConnector` requires you to provide a `displayName` property.');
  }

  var isWidget = typeof connectorDesc.getSearchParameters === 'function' || typeof connectorDesc.getMetadata === 'function' || typeof connectorDesc.transitionState === 'function';
  return function (Composed) {
    var Connector = /*#__PURE__*/function (_Component) {
      (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(Connector, _Component);

      var _super = _createSuper(Connector);

      function Connector(props) {
        var _this;

        (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Connector);

        _this = _super.call(this, props);

        (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "unsubscribe", void 0);

        (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "unregisterWidget", void 0);

        (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "isUnmounting", false);

        (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "state", {
          providedProps: _this.getProvidedProps(_this.props)
        });

        (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "refine", function () {
          var _ref;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this.props.contextValue.onInternalStateUpdate( // refine will always be defined here because the prop is only given conditionally
          (_ref = connectorDesc.refine).call.apply(_ref, [(0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), _this.props, _this.props.contextValue.store.getState().widgets].concat(args)));
        });

        (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "createURL", function () {
          var _ref2;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return _this.props.contextValue.createHrefForState( // refine will always be defined here because the prop is only given conditionally
          (_ref2 = connectorDesc.refine).call.apply(_ref2, [(0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), _this.props, _this.props.contextValue.store.getState().widgets].concat(args)));
        });

        (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "searchForFacetValues", function () {
          var _ref3;

          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          _this.props.contextValue.onSearchForFacetValues( // searchForFacetValues will always be defined here because the prop is only given conditionally
          (_ref3 = connectorDesc.searchForFacetValues).call.apply(_ref3, [(0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), _this.props, _this.props.contextValue.store.getState().widgets].concat(args)));
        });

        if (connectorDesc.getSearchParameters) {
          _this.props.contextValue.onSearchParameters(connectorDesc.getSearchParameters.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this)), {
            ais: _this.props.contextValue,
            multiIndexContext: _this.props.indexContextValue
          }, _this.props, connectorDesc.getMetadata && connectorDesc.getMetadata.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this)));
        }

        return _this;
      }

      (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Connector, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          this.unsubscribe = this.props.contextValue.store.subscribe(function () {
            if (!_this2.isUnmounting) {
              _this2.setState({
                providedProps: _this2.getProvidedProps(_this2.props)
              });
            }
          });

          if (isWidget) {
            this.unregisterWidget = this.props.contextValue.widgetsManager.registerWidget(this);
          }
        }
      }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
          if (typeof connectorDesc.shouldComponentUpdate === 'function') {
            return connectorDesc.shouldComponentUpdate.call(this, this.props, nextProps, this.state, nextState);
          }

          var propsEqual = (0,_utils__WEBPACK_IMPORTED_MODULE_11__.shallowEqual)(this.props, nextProps);

          if (this.state.providedProps === null || nextState.providedProps === null) {
            if (this.state.providedProps === nextState.providedProps) {
              return !propsEqual;
            }

            return true;
          }

          return !propsEqual || !(0,_utils__WEBPACK_IMPORTED_MODULE_11__.shallowEqual)(this.state.providedProps, nextState.providedProps);
        }
      }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
          if (!react_fast_compare__WEBPACK_IMPORTED_MODULE_10___default()(prevProps, this.props)) {
            this.setState({
              providedProps: this.getProvidedProps(this.props)
            });

            if (isWidget) {
              this.props.contextValue.widgetsManager.update();

              if (typeof connectorDesc.transitionState === 'function') {
                this.props.contextValue.onSearchStateChange(connectorDesc.transitionState.call(this, this.props, this.props.contextValue.store.getState().widgets, this.props.contextValue.store.getState().widgets));
              }
            }
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.isUnmounting = true;

          if (this.unsubscribe) {
            this.unsubscribe();
          }

          if (this.unregisterWidget) {
            this.unregisterWidget();

            if (typeof connectorDesc.cleanUp === 'function') {
              var nextState = connectorDesc.cleanUp.call(this, this.props, this.props.contextValue.store.getState().widgets);
              this.props.contextValue.store.setState(_objectSpread(_objectSpread({}, this.props.contextValue.store.getState()), {}, {
                widgets: nextState
              }));
              this.props.contextValue.onSearchStateChange((0,_utils__WEBPACK_IMPORTED_MODULE_11__.removeEmptyKey)(nextState));
            }
          }
        }
      }, {
        key: "getProvidedProps",
        value: function getProvidedProps(props) {
          var _this$props$contextVa = this.props.contextValue.store.getState(),
              widgets = _this$props$contextVa.widgets,
              results = _this$props$contextVa.results,
              resultsFacetValues = _this$props$contextVa.resultsFacetValues,
              searching = _this$props$contextVa.searching,
              searchingForFacetValues = _this$props$contextVa.searchingForFacetValues,
              isSearchStalled = _this$props$contextVa.isSearchStalled,
              metadata = _this$props$contextVa.metadata,
              error = _this$props$contextVa.error;

          var searchResults = {
            results: results,
            searching: searching,
            searchingForFacetValues: searchingForFacetValues,
            isSearchStalled: isSearchStalled,
            error: error
          };
          return connectorDesc.getProvidedProps.call(this, props, widgets, searchResults, metadata, // @MAJOR: move this attribute on the `searchResults` it doesn't
          // makes sense to have it into a separate argument. The search
          // flags are on the object why not the results?
          resultsFacetValues);
        }
      }, {
        key: "getSearchParameters",
        value: function getSearchParameters(searchParameters) {
          if (typeof connectorDesc.getSearchParameters === 'function') {
            return connectorDesc.getSearchParameters.call(this, searchParameters, this.props, this.props.contextValue.store.getState().widgets);
          }

          return null;
        }
      }, {
        key: "getMetadata",
        value: function getMetadata(nextWidgetsState) {
          if (typeof connectorDesc.getMetadata === 'function') {
            return connectorDesc.getMetadata.call(this, this.props, nextWidgetsState);
          }

          return {};
        }
      }, {
        key: "transitionState",
        value: function transitionState(prevWidgetsState, nextWidgetsState) {
          if (typeof connectorDesc.transitionState === 'function') {
            return connectorDesc.transitionState.call(this, this.props, prevWidgetsState, nextWidgetsState);
          }

          return nextWidgetsState;
        }
      }, {
        key: "render",
        value: function render() {
          var _this$props = this.props,
              contextValue = _this$props.contextValue,
              props = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_this$props, _excluded);

          var providedProps = this.state.providedProps;

          if (providedProps === null) {
            return null;
          }

          var refineProps = typeof connectorDesc.refine === 'function' ? {
            refine: this.refine,
            createURL: this.createURL
          } : {};
          var searchForFacetValuesProps = typeof connectorDesc.searchForFacetValues === 'function' ? {
            searchForItems: this.searchForFacetValues
          } : {};
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default().createElement(Composed, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props, providedProps, refineProps, searchForFacetValuesProps));
        }
      }]);

      return Connector;
    }(react__WEBPACK_IMPORTED_MODULE_9__.Component);

    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Connector, "displayName", "".concat(connectorDesc.displayName, "(").concat((0,_utils__WEBPACK_IMPORTED_MODULE_11__.getDisplayName)(Composed), ")"));

    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Connector, "propTypes", connectorDesc.propTypes);

    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Connector, "defaultProps", connectorDesc.defaultProps);

    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Connector, "_connectorDesc", connectorDesc);

    return Connector;
  };
}

var createConnectorWithContext = function createConnectorWithContext(connectorDesc) {
  return function (Composed) {
    var Connector = createConnectorWithoutContext(connectorDesc)(Composed);

    var ConnectorWrapper = function ConnectorWrapper(props) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default().createElement(_context__WEBPACK_IMPORTED_MODULE_12__.InstantSearchConsumer, null, function (contextValue) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default().createElement(_context__WEBPACK_IMPORTED_MODULE_12__.IndexConsumer, null, function (indexContextValue) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default().createElement(Connector, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
            contextValue: contextValue,
            indexContextValue: indexContextValue
          }, props));
        });
      });
    };

    return ConnectorWrapper;
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createConnectorWithContext);

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/createInstantSearchManager.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/createInstantSearchManager.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createInstantSearchManager)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var algoliasearch_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! algoliasearch-helper */ "./node_modules/algoliasearch-helper/index.js");
/* harmony import */ var algoliasearch_helper__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(algoliasearch_helper__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _createWidgetsManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./createWidgetsManager */ "./node_modules/react-instantsearch-core/dist/es/core/createWidgetsManager.js");
/* harmony import */ var _createStore__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./createStore */ "./node_modules/react-instantsearch-core/dist/es/core/createStore.js");
/* harmony import */ var _highlight__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./highlight */ "./node_modules/react-instantsearch-core/dist/es/core/highlight.js");
/* harmony import */ var _indexUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./indexUtils */ "./node_modules/react-instantsearch-core/dist/es/core/indexUtils.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./version */ "./node_modules/react-instantsearch-core/dist/es/core/version.js");


var _excluded = ["resultsFacetValues"],
    _excluded2 = ["resultsFacetValues"],
    _excluded3 = ["resultsFacetValues"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }









function addAlgoliaAgents(searchClient) {
  if (typeof searchClient.addAlgoliaAgent === 'function') {
    searchClient.addAlgoliaAgent("react (".concat(react__WEBPACK_IMPORTED_MODULE_3__.version, ")"));
    searchClient.addAlgoliaAgent("react-instantsearch (".concat(_version__WEBPACK_IMPORTED_MODULE_4__["default"], ")"));
  }
}

var isMultiIndexContext = function isMultiIndexContext(widget) {
  return (0,_indexUtils__WEBPACK_IMPORTED_MODULE_5__.hasMultipleIndices)({
    ais: widget.props.contextValue,
    multiIndexContext: widget.props.indexContextValue
  });
};

var isTargetedIndexEqualIndex = function isTargetedIndexEqualIndex(widget, indexId) {
  return widget.props.indexContextValue.targetedIndex === indexId;
}; // Relying on the `indexId` is a bit brittle to detect the `Index` widget.
// Since it's a class we could rely on `instanceof` or similar. We never
// had an issue though. Works for now.


var isIndexWidget = function isIndexWidget(widget) {
  return Boolean(widget.props.indexId);
};

var isIndexWidgetEqualIndex = function isIndexWidgetEqualIndex(widget, indexId) {
  return widget.props.indexId === indexId;
};

var sortIndexWidgetsFirst = function sortIndexWidgetsFirst(firstWidget, secondWidget) {
  var isFirstWidgetIndex = isIndexWidget(firstWidget);
  var isSecondWidgetIndex = isIndexWidget(secondWidget);

  if (isFirstWidgetIndex && !isSecondWidgetIndex) {
    return -1;
  }

  if (!isFirstWidgetIndex && isSecondWidgetIndex) {
    return 1;
  }

  return 0;
}; // This function is copied from the algoliasearch v4 API Client. If modified,
// consider updating it also in `serializeQueryParameters` from `@algolia/transporter`.


function serializeQueryParameters(parameters) {
  var isObjectOrArray = function isObjectOrArray(value) {
    return Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]';
  };

  var encode = function encode(format) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var i = 0;
    return format.replace(/%s/g, function () {
      return encodeURIComponent(args[i++]);
    });
  };

  return Object.keys(parameters).map(function (key) {
    return encode('%s=%s', key, isObjectOrArray(parameters[key]) ? JSON.stringify(parameters[key]) : parameters[key]);
  }).join('&');
}
/**
 * Creates a new instance of the InstantSearchManager which controls the widgets and
 * trigger the search when the widgets are updated.
 * @param {string} indexName - the main index name
 * @param {object} initialState - initial widget state
 * @param {object} SearchParameters - optional additional parameters to send to the algolia API
 * @param {number} stalledSearchDelay - time (in ms) after the search is stalled
 * @return {InstantSearchManager} a new instance of InstantSearchManager
 */


function createInstantSearchManager(_ref) {
  var indexName = _ref.indexName,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === void 0 ? {} : _ref$initialState,
      searchClient = _ref.searchClient,
      resultsState = _ref.resultsState,
      stalledSearchDelay = _ref.stalledSearchDelay;
  var helper = algoliasearch_helper__WEBPACK_IMPORTED_MODULE_2___default()(searchClient, indexName, _objectSpread({}, _highlight__WEBPACK_IMPORTED_MODULE_6__.HIGHLIGHT_TAGS));
  addAlgoliaAgents(searchClient);
  helper.on('search', handleNewSearch).on('result', handleSearchSuccess({
    indexId: indexName
  })).on('error', handleSearchError);
  var skip = false;
  var stalledSearchTimer = null;
  var initialSearchParameters = helper.state;
  var widgetsManager = (0,_createWidgetsManager__WEBPACK_IMPORTED_MODULE_7__["default"])(onWidgetsUpdate);
  hydrateSearchClient(searchClient, resultsState);
  var store = (0,_createStore__WEBPACK_IMPORTED_MODULE_8__["default"])({
    widgets: initialState,
    metadata: hydrateMetadata(resultsState),
    results: hydrateResultsState(resultsState),
    error: null,
    searching: false,
    isSearchStalled: true,
    searchingForFacetValues: false
  });

  function skipSearch() {
    skip = true;
  }

  function updateClient(client) {
    addAlgoliaAgents(client);
    helper.setClient(client);
    search();
  }

  function clearCache() {
    helper.clearCache();
    search();
  }

  function getMetadata(state) {
    return widgetsManager.getWidgets().filter(function (widget) {
      return Boolean(widget.getMetadata);
    }).map(function (widget) {
      return widget.getMetadata(state);
    });
  }

  function getSearchParameters() {
    var sharedParameters = widgetsManager.getWidgets().filter(function (widget) {
      return Boolean(widget.getSearchParameters);
    }).filter(function (widget) {
      return !isMultiIndexContext(widget) && !isIndexWidget(widget);
    }).reduce(function (res, widget) {
      return widget.getSearchParameters(res);
    }, initialSearchParameters);
    var mainParameters = widgetsManager.getWidgets().filter(function (widget) {
      return Boolean(widget.getSearchParameters);
    }).filter(function (widget) {
      var targetedIndexEqualMainIndex = isMultiIndexContext(widget) && isTargetedIndexEqualIndex(widget, indexName);
      var subIndexEqualMainIndex = isIndexWidget(widget) && isIndexWidgetEqualIndex(widget, indexName);
      return targetedIndexEqualMainIndex || subIndexEqualMainIndex;
    }) // We have to sort the `Index` widgets first so the `index` parameter
    // is correctly set in the `reduce` function for the following widgets
    .sort(sortIndexWidgetsFirst).reduce(function (res, widget) {
      return widget.getSearchParameters(res);
    }, sharedParameters);
    var derivedIndices = widgetsManager.getWidgets().filter(function (widget) {
      return Boolean(widget.getSearchParameters);
    }).filter(function (widget) {
      var targetedIndexNotEqualMainIndex = isMultiIndexContext(widget) && !isTargetedIndexEqualIndex(widget, indexName);
      var subIndexNotEqualMainIndex = isIndexWidget(widget) && !isIndexWidgetEqualIndex(widget, indexName);
      return targetedIndexNotEqualMainIndex || subIndexNotEqualMainIndex;
    }) // We have to sort the `Index` widgets first so the `index` parameter
    // is correctly set in the `reduce` function for the following widgets
    .sort(sortIndexWidgetsFirst).reduce(function (indices, widget) {
      var indexId = isMultiIndexContext(widget) ? widget.props.indexContextValue.targetedIndex : widget.props.indexId;
      var widgets = indices[indexId] || [];
      return _objectSpread(_objectSpread({}, indices), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])({}, indexId, widgets.concat(widget)));
    }, {});
    var derivedParameters = Object.keys(derivedIndices).map(function (indexId) {
      return {
        parameters: derivedIndices[indexId].reduce(function (res, widget) {
          return widget.getSearchParameters(res);
        }, sharedParameters),
        indexId: indexId
      };
    });
    return {
      mainParameters: mainParameters,
      derivedParameters: derivedParameters
    };
  }

  function search() {
    if (!skip) {
      var _getSearchParameters = getSearchParameters(helper.state),
          mainParameters = _getSearchParameters.mainParameters,
          derivedParameters = _getSearchParameters.derivedParameters; // We have to call `slice` because the method `detach` on the derived
      // helpers mutates the value `derivedHelpers`. The `forEach` loop does
      // not iterate on each value and we're not able to correctly clear the
      // previous derived helpers (memory leak + useless requests).


      helper.derivedHelpers.slice().forEach(function (derivedHelper) {
        // Since we detach the derived helpers on **every** new search they
        // won't receive intermediate results in case of a stalled search.
        // Only the last result is dispatched by the derived helper because
        // they are not detached yet:
        //
        // - a -> main helper receives results
        // - ap -> main helper receives results
        // - app -> main helper + derived helpers receive results
        //
        // The quick fix is to avoid to detach them on search but only once they
        // received the results. But it means that in case of a stalled search
        // all the derived helpers not detached yet register a new search inside
        // the helper. The number grows fast in case of a bad network and it's
        // not deterministic.
        derivedHelper.detach();
      });
      derivedParameters.forEach(function (_ref2) {
        var indexId = _ref2.indexId,
            parameters = _ref2.parameters;
        var derivedHelper = helper.derive(function () {
          return parameters;
        });
        derivedHelper.on('result', handleSearchSuccess({
          indexId: indexId
        })).on('error', handleSearchError);
      });
      helper.setState(mainParameters);
      helper.search();
    }
  }

  function handleSearchSuccess(_ref3) {
    var indexId = _ref3.indexId;
    return function (event) {
      var state = store.getState();
      var isDerivedHelpersEmpty = !helper.derivedHelpers.length;
      var results = state.results ? state.results : {}; // Switching from mono index to multi index and vice versa must reset the
      // results to an empty object, otherwise we keep reference of stalled and
      // unused results.

      results = !isDerivedHelpersEmpty && results.getFacetByName ? {} : results;

      if (!isDerivedHelpersEmpty) {
        results = _objectSpread(_objectSpread({}, results), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])({}, indexId, event.results));
      } else {
        results = event.results;
      }

      var currentState = store.getState();
      var nextIsSearchStalled = currentState.isSearchStalled;

      if (!helper.hasPendingRequests()) {
        clearTimeout(stalledSearchTimer);
        stalledSearchTimer = null;
        nextIsSearchStalled = false;
      }

      var resultsFacetValues = currentState.resultsFacetValues,
          partialState = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(currentState, _excluded);

      store.setState(_objectSpread(_objectSpread({}, partialState), {}, {
        results: results,
        isSearchStalled: nextIsSearchStalled,
        searching: false,
        error: null
      }));
    };
  }

  function handleSearchError(_ref4) {
    var error = _ref4.error;
    var currentState = store.getState();
    var nextIsSearchStalled = currentState.isSearchStalled;

    if (!helper.hasPendingRequests()) {
      clearTimeout(stalledSearchTimer);
      nextIsSearchStalled = false;
    }

    var resultsFacetValues = currentState.resultsFacetValues,
        partialState = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(currentState, _excluded2);

    store.setState(_objectSpread(_objectSpread({}, partialState), {}, {
      isSearchStalled: nextIsSearchStalled,
      error: error,
      searching: false
    }));
  }

  function handleNewSearch() {
    if (!stalledSearchTimer) {
      stalledSearchTimer = setTimeout(function () {
        var _store$getState = store.getState(),
            resultsFacetValues = _store$getState.resultsFacetValues,
            partialState = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(_store$getState, _excluded3);

        store.setState(_objectSpread(_objectSpread({}, partialState), {}, {
          isSearchStalled: true
        }));
      }, stalledSearchDelay);
    }
  }

  function hydrateSearchClient(client, results) {
    if (!results) {
      return;
    } // Disable cache hydration on:
    // - Algoliasearch API Client < v4 with cache disabled
    // - Third party clients (detected by the `addAlgoliaAgent` function missing)


    if ((!client.transporter || client._cacheHydrated) && (!client._useCache || typeof client.addAlgoliaAgent !== 'function')) {
      return;
    } // Algoliasearch API Client >= v4
    // To hydrate the client we need to populate the cache with the data from
    // the server (done in `hydrateSearchClientWithMultiIndexRequest` or
    // `hydrateSearchClientWithSingleIndexRequest`). But since there is no way
    // for us to compute the key the same way as `algoliasearch-client` we need
    // to populate it on a custom key and override the `search` method to
    // search on it first.


    if (client.transporter && !client._cacheHydrated) {
      client._cacheHydrated = true;
      var baseMethod = client.search;

      client.search = function (requests) {
        for (var _len2 = arguments.length, methodArgs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          methodArgs[_key2 - 1] = arguments[_key2];
        }

        var requestsWithSerializedParams = requests.map(function (request) {
          return _objectSpread(_objectSpread({}, request), {}, {
            params: serializeQueryParameters(request.params)
          });
        });
        return client.transporter.responsesCache.get({
          method: 'search',
          args: [requestsWithSerializedParams].concat(methodArgs)
        }, function () {
          return baseMethod.apply(void 0, [requests].concat(methodArgs));
        });
      };
    }

    if (Array.isArray(results.results)) {
      hydrateSearchClientWithMultiIndexRequest(client, results.results);
      return;
    }

    hydrateSearchClientWithSingleIndexRequest(client, results);
  }

  function hydrateSearchClientWithMultiIndexRequest(client, results) {
    // Algoliasearch API Client >= v4
    // Populate the cache with the data from the server
    if (client.transporter) {
      client.transporter.responsesCache.set({
        method: 'search',
        args: [results.reduce(function (acc, result) {
          return acc.concat(result.rawResults.map(function (request) {
            return {
              indexName: request.index,
              params: request.params
            };
          }));
        }, [])]
      }, {
        results: results.reduce(function (acc, result) {
          return acc.concat(result.rawResults);
        }, [])
      });
      return;
    } // Algoliasearch API Client < v4
    // Prior to client v4 we didn't have a proper API to hydrate the client
    // cache from the outside. The following code populates the cache with
    // a single-index result. You can find more information about the
    // computation of the key inside the client (see link below).
    // https://github.com/algolia/algoliasearch-client-javascript/blob/c27e89ff92b2a854ae6f40dc524bffe0f0cbc169/src/AlgoliaSearchCore.js#L232-L240


    var key = "/1/indexes/*/queries_body_".concat(JSON.stringify({
      requests: results.reduce(function (acc, result) {
        return acc.concat(result.rawResults.map(function (request) {
          return {
            indexName: request.index,
            params: request.params
          };
        }));
      }, [])
    }));
    client.cache = _objectSpread(_objectSpread({}, client.cache), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])({}, key, JSON.stringify({
      results: results.reduce(function (acc, result) {
        return acc.concat(result.rawResults);
      }, [])
    })));
  }

  function hydrateSearchClientWithSingleIndexRequest(client, results) {
    // Algoliasearch API Client >= v4
    // Populate the cache with the data from the server
    if (client.transporter) {
      client.transporter.responsesCache.set({
        method: 'search',
        args: [results.rawResults.map(function (request) {
          return {
            indexName: request.index,
            params: request.params
          };
        })]
      }, {
        results: results.rawResults
      });
      return;
    } // Algoliasearch API Client < v4
    // Prior to client v4 we didn't have a proper API to hydrate the client
    // cache from the outside. The following code populates the cache with
    // a single-index result. You can find more information about the
    // computation of the key inside the client (see link below).
    // https://github.com/algolia/algoliasearch-client-javascript/blob/c27e89ff92b2a854ae6f40dc524bffe0f0cbc169/src/AlgoliaSearchCore.js#L232-L240


    var key = "/1/indexes/*/queries_body_".concat(JSON.stringify({
      requests: results.rawResults.map(function (request) {
        return {
          indexName: request.index,
          params: request.params
        };
      })
    }));
    client.cache = _objectSpread(_objectSpread({}, client.cache), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])({}, key, JSON.stringify({
      results: results.rawResults
    })));
  }

  function hydrateResultsState(results) {
    if (!results) {
      return null;
    }

    if (Array.isArray(results.results)) {
      return results.results.reduce(function (acc, result) {
        return _objectSpread(_objectSpread({}, acc), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])({}, result._internalIndexId, new (algoliasearch_helper__WEBPACK_IMPORTED_MODULE_2___default().SearchResults)(new (algoliasearch_helper__WEBPACK_IMPORTED_MODULE_2___default().SearchParameters)(result.state), result.rawResults)));
      }, {});
    }

    return new (algoliasearch_helper__WEBPACK_IMPORTED_MODULE_2___default().SearchResults)(new (algoliasearch_helper__WEBPACK_IMPORTED_MODULE_2___default().SearchParameters)(results.state), results.rawResults);
  } // Called whenever a widget has been rendered with new props.


  function onWidgetsUpdate() {
    var metadata = getMetadata(store.getState().widgets);
    store.setState(_objectSpread(_objectSpread({}, store.getState()), {}, {
      metadata: metadata,
      searching: true
    })); // Since the `getSearchParameters` method of widgets also depends on props,
    // the result search parameters might have changed.

    search();
  }

  function transitionState(nextSearchState) {
    var searchState = store.getState().widgets;
    return widgetsManager.getWidgets().filter(function (widget) {
      return Boolean(widget.transitionState);
    }).reduce(function (res, widget) {
      return widget.transitionState(searchState, res);
    }, nextSearchState);
  }

  function onExternalStateUpdate(nextSearchState) {
    var metadata = getMetadata(nextSearchState);
    store.setState(_objectSpread(_objectSpread({}, store.getState()), {}, {
      widgets: nextSearchState,
      metadata: metadata,
      searching: true
    }));
    search();
  }

  function onSearchForFacetValues(_ref5) {
    var facetName = _ref5.facetName,
        query = _ref5.query,
        _ref5$maxFacetHits = _ref5.maxFacetHits,
        maxFacetHits = _ref5$maxFacetHits === void 0 ? 10 : _ref5$maxFacetHits;
    // The values 1, 100 are the min / max values that the engine accepts.
    // see: https://www.algolia.com/doc/api-reference/api-parameters/maxFacetHits
    var maxFacetHitsWithinRange = Math.max(1, Math.min(maxFacetHits, 100));
    store.setState(_objectSpread(_objectSpread({}, store.getState()), {}, {
      searchingForFacetValues: true
    }));
    helper.searchForFacetValues(facetName, query, maxFacetHitsWithinRange).then(function (content) {
      var _objectSpread7;

      store.setState(_objectSpread(_objectSpread({}, store.getState()), {}, {
        error: null,
        searchingForFacetValues: false,
        resultsFacetValues: _objectSpread(_objectSpread({}, store.getState().resultsFacetValues), {}, (_objectSpread7 = {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(_objectSpread7, facetName, content.facetHits), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(_objectSpread7, "query", query), _objectSpread7))
      }));
    }, function (error) {
      store.setState(_objectSpread(_objectSpread({}, store.getState()), {}, {
        searchingForFacetValues: false,
        error: error
      }));
    }).catch(function (error) {
      // Since setState is synchronous, any error that occurs in the render of a
      // component will be swallowed by this promise.
      // This is a trick to make the error show up correctly in the console.
      // See http://stackoverflow.com/a/30741722/969302
      setTimeout(function () {
        throw error;
      });
    });
  }

  function updateIndex(newIndex) {
    initialSearchParameters = initialSearchParameters.setIndex(newIndex); // No need to trigger a new search here as the widgets will also update and trigger it if needed.
  }

  function getWidgetsIds() {
    return store.getState().metadata.reduce(function (res, meta) {
      return typeof meta.id !== 'undefined' ? res.concat(meta.id) : res;
    }, []);
  }

  return {
    store: store,
    widgetsManager: widgetsManager,
    getWidgetsIds: getWidgetsIds,
    getSearchParameters: getSearchParameters,
    onSearchForFacetValues: onSearchForFacetValues,
    onExternalStateUpdate: onExternalStateUpdate,
    transitionState: transitionState,
    updateClient: updateClient,
    updateIndex: updateIndex,
    clearCache: clearCache,
    skipSearch: skipSearch
  };
}

function hydrateMetadata(resultsState) {
  if (!resultsState) {
    return [];
  } // add a value noop, which gets replaced once the widgets are mounted


  return resultsState.metadata.map(function (datum) {
    return _objectSpread(_objectSpread({
      value: function value() {
        return {};
      }
    }, datum), {}, {
      items: datum.items && datum.items.map(function (item) {
        return _objectSpread(_objectSpread({
          value: function value() {
            return {};
          }
        }, item), {}, {
          items: item.items && item.items.map(function (nestedItem) {
            return _objectSpread({
              value: function value() {
                return {};
              }
            }, nestedItem);
          })
        });
      })
    });
  });
}

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/createStore.js":
/*!***************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/createStore.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createStore)
/* harmony export */ });
function createStore(initialState) {
  var state = initialState;
  var listeners = [];
  return {
    getState: function getState() {
      return state;
    },
    setState: function setState(nextState) {
      state = nextState;
      listeners.forEach(function (listener) {
        return listener();
      });
    },
    subscribe: function subscribe(listener) {
      listeners.push(listener);
      return function unsubscribe() {
        listeners.splice(listeners.indexOf(listener), 1);
      };
    }
  };
}

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/createWidgetsManager.js":
/*!************************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/createWidgetsManager.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createWidgetsManager)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/react-instantsearch-core/dist/es/core/utils.js");

function createWidgetsManager(onWidgetsUpdate) {
  var widgets = []; // Is an update scheduled?

  var scheduled = false; // The state manager's updates need to be batched since more than one
  // component can register or unregister widgets during the same tick.

  function scheduleUpdate() {
    if (scheduled) {
      return;
    }

    scheduled = true;
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.defer)(function () {
      scheduled = false;
      onWidgetsUpdate();
    });
  }

  return {
    registerWidget: function registerWidget(widget) {
      widgets.push(widget);
      scheduleUpdate();
      return function unregisterWidget() {
        widgets.splice(widgets.indexOf(widget), 1);
        scheduleUpdate();
      };
    },
    update: scheduleUpdate,
    getWidgets: function getWidgets() {
      return widgets;
    }
  };
}

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/highlight.js":
/*!*************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/highlight.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HIGHLIGHT_TAGS": () => (/* binding */ HIGHLIGHT_TAGS),
/* harmony export */   "parseAlgoliaHit": () => (/* binding */ parseAlgoliaHit)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/react-instantsearch-core/dist/es/core/utils.js");

var HIGHLIGHT_TAGS = {
  highlightPreTag: "<ais-highlight-0000000000>",
  highlightPostTag: "</ais-highlight-0000000000>"
};
/**
 * Parses an highlighted attribute into an array of objects with the string value, and
 * a boolean that indicated if this part is highlighted.
 *
 * @param {string} preTag - string used to identify the start of an highlighted value
 * @param {string} postTag - string used to identify the end of an highlighted value
 * @param {string} highlightedValue - highlighted attribute as returned by Algolia highlight feature
 * @return {object[]} - An array of {value: string, isHighlighted: boolean}.
 */

function parseHighlightedAttribute(_ref) {
  var preTag = _ref.preTag,
      postTag = _ref.postTag,
      _ref$highlightedValue = _ref.highlightedValue,
      highlightedValue = _ref$highlightedValue === void 0 ? '' : _ref$highlightedValue;
  var splitByPreTag = highlightedValue.split(preTag);
  var firstValue = splitByPreTag.shift();
  var elements = firstValue === '' ? [] : [{
    value: firstValue,
    isHighlighted: false
  }];

  if (postTag === preTag) {
    var isHighlighted = true;
    splitByPreTag.forEach(function (split) {
      elements.push({
        value: split,
        isHighlighted: isHighlighted
      });
      isHighlighted = !isHighlighted;
    });
  } else {
    splitByPreTag.forEach(function (split) {
      var splitByPostTag = split.split(postTag);
      elements.push({
        value: splitByPostTag[0],
        isHighlighted: true
      });

      if (splitByPostTag[1] !== '') {
        elements.push({
          value: splitByPostTag[1],
          isHighlighted: false
        });
      }
    });
  }

  return elements;
}
/**
 * Find an highlighted attribute given an `attribute` and an `highlightProperty`, parses it,
 * and provided an array of objects with the string value and a boolean if this
 * value is highlighted.
 *
 * In order to use this feature, highlight must be activated in the configuration of
 * the index. The `preTag` and `postTag` attributes are respectively highlightPreTag and
 * highlightPostTag in Algolia configuration.
 *
 * @param {string} preTag - string used to identify the start of an highlighted value
 * @param {string} postTag - string used to identify the end of an highlighted value
 * @param {string} highlightProperty - the property that contains the highlight structure in the results
 * @param {string} attribute - the highlighted attribute to look for
 * @param {object} hit - the actual hit returned by Algolia.
 * @return {object[]} - An array of {value: string, isHighlighted: boolean}.
 */


function parseAlgoliaHit(_ref2) {
  var _ref2$preTag = _ref2.preTag,
      preTag = _ref2$preTag === void 0 ? '<em>' : _ref2$preTag,
      _ref2$postTag = _ref2.postTag,
      postTag = _ref2$postTag === void 0 ? '</em>' : _ref2$postTag,
      highlightProperty = _ref2.highlightProperty,
      attribute = _ref2.attribute,
      hit = _ref2.hit;
  if (!hit) throw new Error('`hit`, the matching record, must be provided');
  var highlightObject = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getPropertyByPath)(hit[highlightProperty], attribute) || {};

  if (Array.isArray(highlightObject)) {
    return highlightObject.map(function (item) {
      return parseHighlightedAttribute({
        preTag: preTag,
        postTag: postTag,
        highlightedValue: item.value
      });
    });
  }

  return parseHighlightedAttribute({
    preTag: preTag,
    postTag: postTag,
    highlightedValue: highlightObject.value
  });
}

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/indexUtils.js":
/*!**************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/indexUtils.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getIndexId": () => (/* binding */ getIndexId),
/* harmony export */   "getResults": () => (/* binding */ getResults),
/* harmony export */   "hasMultipleIndices": () => (/* binding */ hasMultipleIndices),
/* harmony export */   "refineValue": () => (/* binding */ refineValue),
/* harmony export */   "getCurrentRefinementValue": () => (/* binding */ getCurrentRefinementValue),
/* harmony export */   "cleanUpValue": () => (/* binding */ cleanUpValue)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./node_modules/react-instantsearch-core/dist/es/core/utils.js");


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }


function getIndexId(context) {
  return hasMultipleIndices(context) ? context.multiIndexContext.targetedIndex : context.ais.mainTargetedIndex;
}
/**
 * @returns {import('algoliasearch-helper').SearchResults} results
 */

function getResults(searchResults, context) {
  if (searchResults.results) {
    if (searchResults.results.hits) {
      return searchResults.results;
    }

    var indexId = getIndexId(context);

    if (searchResults.results[indexId]) {
      return searchResults.results[indexId];
    }
  }

  return null;
}
function hasMultipleIndices(context) {
  return context && context.multiIndexContext;
}
function refineValue(searchState, nextRefinement, context, resetPage, namespace) {
  if (hasMultipleIndices(context)) {
    var indexId = getIndexId(context);
    return namespace ? refineMultiIndexWithNamespace(searchState, nextRefinement, indexId, resetPage, namespace) : refineMultiIndex(searchState, nextRefinement, indexId, resetPage);
  } else {
    // When we have a multi index page with shared widgets we should also
    // reset their page to 1 if the resetPage is provided. Otherwise the
    // indices will always be reset
    // see: https://github.com/algolia/react-instantsearch/issues/310
    // see: https://github.com/algolia/react-instantsearch/issues/637
    if (searchState.indices && resetPage) {
      Object.keys(searchState.indices).forEach(function (targetedIndex) {
        searchState = refineValue(searchState, {
          page: 1
        }, {
          multiIndexContext: {
            targetedIndex: targetedIndex
          }
        }, true, namespace);
      });
    }

    return namespace ? refineSingleIndexWithNamespace(searchState, nextRefinement, resetPage, namespace) : refineSingleIndex(searchState, nextRefinement, resetPage);
  }
}

function refineMultiIndex(searchState, nextRefinement, indexId, resetPage) {
  var page = resetPage ? {
    page: 1
  } : undefined;
  var state = searchState.indices && searchState.indices[indexId] ? _objectSpread(_objectSpread({}, searchState.indices), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, indexId, _objectSpread(_objectSpread(_objectSpread({}, searchState.indices[indexId]), nextRefinement), page))) : _objectSpread(_objectSpread({}, searchState.indices), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, indexId, _objectSpread(_objectSpread({}, nextRefinement), page)));
  return _objectSpread(_objectSpread({}, searchState), {}, {
    indices: state
  });
}

function refineSingleIndex(searchState, nextRefinement, resetPage) {
  var page = resetPage ? {
    page: 1
  } : undefined;
  return _objectSpread(_objectSpread(_objectSpread({}, searchState), nextRefinement), page);
}

function refineMultiIndexWithNamespace(searchState, nextRefinement, indexId, resetPage, namespace) {
  var _objectSpread4;

  var page = resetPage ? {
    page: 1
  } : undefined;
  var state = searchState.indices && searchState.indices[indexId] ? _objectSpread(_objectSpread({}, searchState.indices), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, indexId, _objectSpread(_objectSpread({}, searchState.indices[indexId]), {}, (_objectSpread4 = {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_objectSpread4, namespace, _objectSpread(_objectSpread({}, searchState.indices[indexId][namespace]), nextRefinement)), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_objectSpread4, "page", 1), _objectSpread4)))) : _objectSpread(_objectSpread({}, searchState.indices), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, indexId, _objectSpread((0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, namespace, nextRefinement), page)));
  return _objectSpread(_objectSpread({}, searchState), {}, {
    indices: state
  });
}

function refineSingleIndexWithNamespace(searchState, nextRefinement, resetPage, namespace) {
  var page = resetPage ? {
    page: 1
  } : undefined;
  return _objectSpread(_objectSpread({}, searchState), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, namespace, _objectSpread(_objectSpread({}, searchState[namespace]), nextRefinement)), page);
}

function getNamespaceAndAttributeName(id) {
  var parts = id.match(/^([^.]*)\.(.*)/);
  var namespace = parts && parts[1];
  var attributeName = parts && parts[2];
  return {
    namespace: namespace,
    attributeName: attributeName
  };
}

function hasRefinements(_ref) {
  var multiIndex = _ref.multiIndex,
      indexId = _ref.indexId,
      namespace = _ref.namespace,
      attributeName = _ref.attributeName,
      id = _ref.id,
      searchState = _ref.searchState;

  if (multiIndex && namespace) {
    return searchState.indices && searchState.indices[indexId] && searchState.indices[indexId][namespace] && Object.hasOwnProperty.call(searchState.indices[indexId][namespace], attributeName);
  }

  if (multiIndex) {
    return searchState.indices && searchState.indices[indexId] && Object.hasOwnProperty.call(searchState.indices[indexId], id);
  }

  if (namespace) {
    return searchState[namespace] && Object.hasOwnProperty.call(searchState[namespace], attributeName);
  }

  return Object.hasOwnProperty.call(searchState, id);
}

function getRefinements(_ref2) {
  var multiIndex = _ref2.multiIndex,
      indexId = _ref2.indexId,
      namespace = _ref2.namespace,
      attributeName = _ref2.attributeName,
      id = _ref2.id,
      searchState = _ref2.searchState;

  if (multiIndex && namespace) {
    return searchState.indices[indexId][namespace][attributeName];
  }

  if (multiIndex) {
    return searchState.indices[indexId][id];
  }

  if (namespace) {
    return searchState[namespace][attributeName];
  }

  return searchState[id];
}

function getCurrentRefinementValue(props, searchState, context, id, defaultValue) {
  var indexId = getIndexId(context);

  var _getNamespaceAndAttri = getNamespaceAndAttributeName(id),
      namespace = _getNamespaceAndAttri.namespace,
      attributeName = _getNamespaceAndAttri.attributeName;

  var multiIndex = hasMultipleIndices(context);
  var args = {
    multiIndex: multiIndex,
    indexId: indexId,
    namespace: namespace,
    attributeName: attributeName,
    id: id,
    searchState: searchState
  };
  var hasRefinementsValue = hasRefinements(args);

  if (hasRefinementsValue) {
    return getRefinements(args);
  }

  if (props.defaultRefinement) {
    return props.defaultRefinement;
  }

  return defaultValue;
}
function cleanUpValue(searchState, context, id) {
  var indexId = getIndexId(context);

  var _getNamespaceAndAttri2 = getNamespaceAndAttributeName(id),
      namespace = _getNamespaceAndAttri2.namespace,
      attributeName = _getNamespaceAndAttri2.attributeName;

  if (hasMultipleIndices(context) && Boolean(searchState.indices)) {
    return cleanUpValueWithMultiIndex({
      attribute: attributeName,
      searchState: searchState,
      indexId: indexId,
      id: id,
      namespace: namespace
    });
  }

  return cleanUpValueWithSingleIndex({
    attribute: attributeName,
    searchState: searchState,
    id: id,
    namespace: namespace
  });
}

function cleanUpValueWithSingleIndex(_ref3) {
  var searchState = _ref3.searchState,
      id = _ref3.id,
      namespace = _ref3.namespace,
      attribute = _ref3.attribute;

  if (namespace) {
    return _objectSpread(_objectSpread({}, searchState), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, namespace, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.omit)(searchState[namespace], [attribute])));
  }

  return (0,_utils__WEBPACK_IMPORTED_MODULE_1__.omit)(searchState, [id]);
}

function cleanUpValueWithMultiIndex(_ref4) {
  var searchState = _ref4.searchState,
      indexId = _ref4.indexId,
      id = _ref4.id,
      namespace = _ref4.namespace,
      attribute = _ref4.attribute;
  var indexSearchState = searchState.indices[indexId];

  if (namespace && indexSearchState) {
    return _objectSpread(_objectSpread({}, searchState), {}, {
      indices: _objectSpread(_objectSpread({}, searchState.indices), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, indexId, _objectSpread(_objectSpread({}, indexSearchState), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, namespace, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.omit)(indexSearchState[namespace], [attribute])))))
    });
  }

  if (indexSearchState) {
    return _objectSpread(_objectSpread({}, searchState), {}, {
      indices: _objectSpread(_objectSpread({}, searchState.indices), {}, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, indexId, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.omit)(indexSearchState, [id])))
    });
  }

  return searchState;
}

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/metadata.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/metadata.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isMetadataEnabled": () => (/* binding */ isMetadataEnabled),
/* harmony export */   "getMetadataPayload": () => (/* binding */ getMetadataPayload),
/* harmony export */   "injectMetadata": () => (/* binding */ injectMetadata)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function isMetadataEnabled() {
  return (typeof window === "undefined" ? "undefined" : (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(window)) === 'object' && (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(window.navigator) === 'object' && typeof window.navigator.userAgent === 'string' && window.navigator.userAgent.includes('Algolia Crawler') && (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(window.document) === 'object';
}
function getMetadataPayload(widgets, searchClient) {
  var internalProps = ['contextValue', 'indexContextValue'];
  var widgetsPayload = widgets.map(function (_ref) {
    var props = _ref.props,
        constructor = _ref.constructor;

    var _ref2 = constructor._connectorDesc || {},
        _ref2$defaultProps = _ref2.defaultProps,
        defaultProps = _ref2$defaultProps === void 0 ? {} : _ref2$defaultProps,
        _ref2$displayName = _ref2.displayName,
        displayName = _ref2$displayName === void 0 ? constructor.displayName : _ref2$displayName;

    return {
      displayName: displayName,
      params: Object.keys(props).filter(function (prop) {
        return !internalProps.includes(prop) && defaultProps[prop] !== props[prop] && props[prop] !== undefined;
      })
    };
  });
  var client = searchClient;
  var ua = client.transporter && client.transporter.userAgent ? client.transporter.userAgent.value : client._ua;
  return {
    ua: ua,
    widgets: widgetsPayload
  };
}
function injectMetadata(widgets, searchClient) {
  var payloadContainer = document.createElement('meta');
  var refNode = document.querySelector('head');
  payloadContainer.name = 'algolia:metadata';
  var payload = getMetadataPayload(widgets, searchClient);
  payloadContainer.content = JSON.stringify(payload);
  refNode.appendChild(payloadContainer);
}

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/utils.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/utils.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shallowEqual": () => (/* binding */ shallowEqual),
/* harmony export */   "getDisplayName": () => (/* binding */ getDisplayName),
/* harmony export */   "defer": () => (/* binding */ defer),
/* harmony export */   "removeEmptyKey": () => (/* binding */ removeEmptyKey),
/* harmony export */   "removeEmptyArraysFromObject": () => (/* binding */ removeEmptyArraysFromObject),
/* harmony export */   "addAbsolutePositions": () => (/* binding */ addAbsolutePositions),
/* harmony export */   "addQueryID": () => (/* binding */ addQueryID),
/* harmony export */   "find": () => (/* binding */ find),
/* harmony export */   "objectHasKeys": () => (/* binding */ objectHasKeys),
/* harmony export */   "omit": () => (/* binding */ omit),
/* harmony export */   "getPropertyByPath": () => (/* binding */ getPropertyByPath),
/* harmony export */   "getObjectType": () => (/* binding */ getObjectType)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// From https://github.com/reactjs/react-redux/blob/master/src/utils/shallowEqual.js
var shallowEqual = function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  } // Test for A's keys different from B.


  var hasOwn = Object.prototype.hasOwnProperty;

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
};
var getDisplayName = function getDisplayName(Component) {
  return Component.displayName || Component.name || 'UnknownComponent';
};
var resolved = Promise.resolve();
var defer = function defer(f) {
  resolved.then(f);
};

var isPlainObject = function isPlainObject(value) {
  return (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__["default"])(value) === 'object' && value !== null && !Array.isArray(value);
};

var removeEmptyKey = function removeEmptyKey(obj) {
  Object.keys(obj).forEach(function (key) {
    var value = obj[key];

    if (!isPlainObject(value)) {
      return;
    }

    if (!objectHasKeys(value)) {
      delete obj[key];
    } else {
      removeEmptyKey(value);
    }
  });
  return obj;
};
var removeEmptyArraysFromObject = function removeEmptyArraysFromObject(obj) {
  Object.keys(obj).forEach(function (key) {
    var value = obj[key];

    if (Array.isArray(value) && value.length === 0) {
      delete obj[key];
    }
  });
  return obj;
};
function addAbsolutePositions(hits, hitsPerPage, page) {
  return hits.map(function (hit, index) {
    return _objectSpread(_objectSpread({}, hit), {}, {
      __position: hitsPerPage * page + index + 1
    });
  });
}
function addQueryID(hits, queryID) {
  if (!queryID) {
    return hits;
  }

  return hits.map(function (hit) {
    return _objectSpread(_objectSpread({}, hit), {}, {
      __queryID: queryID
    });
  });
}
function find(array, comparator) {
  if (!Array.isArray(array)) {
    return undefined;
  }

  for (var i = 0; i < array.length; i++) {
    if (comparator(array[i])) {
      return array[i];
    }
  }

  return undefined;
}
function objectHasKeys(object) {
  return object && Object.keys(object).length > 0;
} // https://github.com/babel/babel/blob/3aaafae053fa75febb3aa45d45b6f00646e30ba4/packages/babel-helpers/src/helpers.js#L604-L620

function omit(source, excluded) {
  if (source === null || source === undefined) {
    return {};
  }

  var target = {};
  var sourceKeys = Object.keys(source);

  for (var i = 0; i < sourceKeys.length; i++) {
    var _key = sourceKeys[i];

    if (excluded.indexOf(_key) >= 0) {
      // eslint-disable-next-line no-continue
      continue;
    }

    target[_key] = source[_key];
  }

  return target;
}
/**
 * Retrieve the value at a path of the object:
 *
 * @example
 * getPropertyByPath(
 *   { test: { this: { function: [{ now: { everyone: true } }] } } },
 *   'test.this.function[0].now.everyone'
 * ); // true
 *
 * getPropertyByPath(
 *   { test: { this: { function: [{ now: { everyone: true } }] } } },
 *   ['test', 'this', 'function', 0, 'now', 'everyone']
 * ); // true
 *
 * @param object Source object to query
 * @param path either an array of properties, or a string form of the properties, separated by .
 */

var getPropertyByPath = function getPropertyByPath(object, path) {
  return (Array.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.')).reduce(function (current, key) {
    return current ? current[key] : undefined;
  }, object);
};
function getObjectType(object) {
  return Object.prototype.toString.call(object).slice(8, -1);
}

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/core/version.js":
/*!***********************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/core/version.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('6.15.0');

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/widgets/Configure.js":
/*!****************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/widgets/Configure.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _connectors_connectConfigure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../connectors/connectConfigure */ "./node_modules/react-instantsearch-core/dist/es/connectors/connectConfigure.js");

/**
 * Configure is a widget that lets you provide raw search parameters
 * to the Algolia API.
 *
 * Any of the props added to this widget will be forwarded to Algolia. For more information
 * on the different parameters that can be set, have a look at the
 * [reference](https://www.algolia.com/doc/api-client/javascript/search#search-parameters).
 *
 * This widget can be used either with react-dom and react-native. It will not render anything
 * on screen, only configure some parameters.
 *
 * Read more in the [Search parameters](guide/Search_parameters.html) guide.
 * @name Configure
 * @kind widget
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, Configure, Hits } from 'react-instantsearch-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <Configure hitsPerPage={5} />
 *     <Hits />
 *   </InstantSearch>
 * );
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_connectors_connectConfigure__WEBPACK_IMPORTED_MODULE_0__["default"])(function Configure() {
  return null;
}));

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/widgets/Index.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/widgets/Index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IndexComponentWithoutContext": () => (/* binding */ IndexComponentWithoutContext),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _core_context__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../core/context */ "./node_modules/react-instantsearch-core/dist/es/core/context.js");









function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }





function getIndexContext(props) {
  return {
    targetedIndex: props.indexId
  };
}

/**
 * The component that allows you to apply widgets to a dedicated index. It's
 * useful if you want to build an interface that targets multiple indices.
 *
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, Index, SearchBox, Hits, Configure } from 'react-instantsearch-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <Configure hitsPerPage={5} />
 *     <SearchBox />
 *     <Index indexName="instant_search">
 *       <Hits />
 *     </Index>
 *     <Index indexName="bestbuy">
 *       <Hits />
 *     </Index>
 *   </InstantSearch>
 * );
 */
var Index = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Index, _Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Index);

    _this = _super.call(this, props);

    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this), "state", {
      indexContext: getIndexContext(_this.props)
    });

    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this), "unregisterWidget", void 0);

    _this.props.contextValue.onSearchParameters(_this.getSearchParameters.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this)), {
      ais: _this.props.contextValue,
      multiIndexContext: _this.state.indexContext
    }, _this.props, undefined);

    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.unregisterWidget = this.props.contextValue.widgetsManager.registerWidget(this);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.indexName !== prevProps.indexName) {
        this.props.contextValue.widgetsManager.update();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (typeof this.unregisterWidget === 'function') {
        this.unregisterWidget();
      }
    }
  }, {
    key: "getSearchParameters",
    value: function getSearchParameters(searchParameters, props) {
      return searchParameters.setIndex(this.props ? this.props.indexName : props.indexName);
    }
  }, {
    key: "render",
    value: function render() {
      var childrenCount = react__WEBPACK_IMPORTED_MODULE_8__.Children.count(this.props.children);

      if (childrenCount === 0) {
        return null;
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(_core_context__WEBPACK_IMPORTED_MODULE_10__.IndexProvider, {
        value: this.state.indexContext
      }, this.props.children);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props) {
      return {
        indexContext: getIndexContext(props)
      };
    }
  }]);

  return Index;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

(0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(Index, "propTypes", {
  indexName: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  indexId: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node)
});

(0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(Index, "displayName", 'AlgoliaIndex');

var IndexWrapper = function IndexWrapper(props) {
  var inferredIndexId = props.indexName;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(_core_context__WEBPACK_IMPORTED_MODULE_10__.InstantSearchConsumer, null, function (contextValue) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8___default().createElement(Index, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      contextValue: contextValue,
      indexId: inferredIndexId
    }, props));
  });
};

IndexWrapper.propTypes = {
  indexName: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  indexId: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string)
};
var IndexComponentWithoutContext = Index;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IndexWrapper);

/***/ }),

/***/ "./node_modules/react-instantsearch-core/dist/es/widgets/InstantSearch.js":
/*!********************************************************************************!*\
  !*** ./node_modules/react-instantsearch-core/dist/es/widgets/InstantSearch.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_fast_compare__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-fast-compare */ "./node_modules/react-fast-compare/index.js");
/* harmony import */ var react_fast_compare__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_fast_compare__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _core_createInstantSearchManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../core/createInstantSearchManager */ "./node_modules/react-instantsearch-core/dist/es/core/createInstantSearchManager.js");
/* harmony import */ var _core_context__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../core/context */ "./node_modules/react-instantsearch-core/dist/es/core/context.js");
/* harmony import */ var _core_metadata__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../core/metadata */ "./node_modules/react-instantsearch-core/dist/es/core/metadata.js");








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }








function isControlled(props) {
  return Boolean(props.searchState);
}
/**
 * @description
 * `<InstantSearch>` is the root component of all React InstantSearch implementations.
 * It provides all the connected components (aka widgets) a means to interact
 * with the searchState.
 * @kind widget
 * @name <InstantSearch>
 * @requirements You will need to have an Algolia account to be able to use this widget.
 * [Create one now](https://www.algolia.com/users/sign_up).
 * @propType {string} indexName - Main index in which to search.
 * @propType {boolean} [refresh=false] - Flag to activate when the cache needs to be cleared so that the front-end is updated when a change occurs in the index.
 * @propType {object} [searchClient] - Provide a custom search client.
 * @propType {func} [onSearchStateChange] - Function to be called everytime a new search is done. Useful for [URL Routing](guide/Routing.html).
 * @propType {object} [searchState] - Object to inject some search state. Switches the InstantSearch component in controlled mode. Useful for [URL Routing](guide/Routing.html).
 * @propType {func} [createURL] - Function to call when creating links, useful for [URL Routing](guide/Routing.html).
 * @propType {SearchResults|SearchResults[]} [resultsState] - Use this to inject the results that will be used at first rendering. Those results are found by using the `findResultsState` function. Useful for [Server Side Rendering](guide/Server-side_rendering.html).
 * @propType {number} [stalledSearchDelay=200] - The amount of time before considering that the search takes too much time. The time is expressed in milliseconds.
 * @propType {{ Root: string|function, props: object }} [root] - Use this to customize the root element. Default value: `{ Root: 'div' }`
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <SearchBox />
 *     <Hits />
 *   </InstantSearch>
 * );
 */


var InstantSearch = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(InstantSearch, _Component);

  var _super = _createSuper(InstantSearch);

  function InstantSearch(props) {
    var _this;

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, InstantSearch);

    _this = _super.call(this, props);

    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this), "isUnmounting", false);

    var instantSearchManager = (0,_core_createInstantSearchManager__WEBPACK_IMPORTED_MODULE_10__["default"])({
      indexName: _this.props.indexName,
      searchClient: _this.props.searchClient,
      initialState: _this.props.searchState || {},
      resultsState: _this.props.resultsState,
      stalledSearchDelay: _this.props.stalledSearchDelay
    });
    var contextValue = {
      store: instantSearchManager.store,
      widgetsManager: instantSearchManager.widgetsManager,
      mainTargetedIndex: _this.props.indexName,
      onInternalStateUpdate: _this.onWidgetsInternalStateUpdate.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this)),
      createHrefForState: _this.createHrefForState.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this)),
      onSearchForFacetValues: _this.onSearchForFacetValues.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this)),
      onSearchStateChange: _this.onSearchStateChange.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this)),
      onSearchParameters: _this.onSearchParameters.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this))
    };
    _this.state = {
      isControlled: isControlled(_this.props),
      instantSearchManager: instantSearchManager,
      contextValue: contextValue
    };
    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(InstantSearch, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var prevIsControlled = isControlled(prevProps);

      if (prevIsControlled && !this.state.isControlled) {
        throw new Error("You can't switch <InstantSearch> from being controlled to uncontrolled");
      }

      if (!prevIsControlled && this.state.isControlled) {
        throw new Error("You can't switch <InstantSearch> from being uncontrolled to controlled");
      }

      if (this.props.refresh !== prevProps.refresh && this.props.refresh) {
        this.state.instantSearchManager.clearCache();
      }

      if (prevProps.indexName !== this.props.indexName) {
        this.state.instantSearchManager.updateIndex(this.props.indexName);
      }

      if (prevProps.searchClient !== this.props.searchClient) {
        this.state.instantSearchManager.updateClient(this.props.searchClient);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if ((0,_core_metadata__WEBPACK_IMPORTED_MODULE_11__.isMetadataEnabled)()) {
        (0,_core_metadata__WEBPACK_IMPORTED_MODULE_11__.injectMetadata)(this.state.instantSearchManager.widgetsManager.getWidgets(), this.props.searchClient);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.isUnmounting = true;
      this.state.instantSearchManager.skipSearch();
    }
  }, {
    key: "createHrefForState",
    value: function createHrefForState(searchState) {
      searchState = this.state.instantSearchManager.transitionState(searchState);
      return this.state.isControlled && this.props.createURL ? this.props.createURL(searchState, this.getKnownKeys()) : '#';
    }
  }, {
    key: "onWidgetsInternalStateUpdate",
    value: function onWidgetsInternalStateUpdate(searchState) {
      searchState = this.state.instantSearchManager.transitionState(searchState);
      this.onSearchStateChange(searchState);

      if (!this.state.isControlled) {
        this.state.instantSearchManager.onExternalStateUpdate(searchState);
      }
    }
  }, {
    key: "onSearchStateChange",
    value: function onSearchStateChange(searchState) {
      if (this.props.onSearchStateChange && !this.isUnmounting) {
        this.props.onSearchStateChange(searchState);
      }
    }
  }, {
    key: "onSearchParameters",
    value: function onSearchParameters(getSearchParameters, context, props, getMetadata) {
      if (this.props.onSearchParameters) {
        var _searchState = this.props.searchState ? this.props.searchState : {};

        this.props.onSearchParameters(getSearchParameters, context, props, _searchState);
      }

      if (this.props.widgetsCollector) {
        var _searchState2 = this.props.searchState ? this.props.searchState : {};

        this.props.widgetsCollector({
          getSearchParameters: getSearchParameters,
          getMetadata: getMetadata,
          context: context,
          props: props,
          searchState: _searchState2
        });
      }
    }
  }, {
    key: "onSearchForFacetValues",
    value: function onSearchForFacetValues(searchState) {
      this.state.instantSearchManager.onSearchForFacetValues(searchState);
    }
  }, {
    key: "getKnownKeys",
    value: function getKnownKeys() {
      return this.state.instantSearchManager.getWidgetsIds();
    }
  }, {
    key: "render",
    value: function render() {
      if (react__WEBPACK_IMPORTED_MODULE_7__.Children.count(this.props.children) === 0) {
        return null;
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(_core_context__WEBPACK_IMPORTED_MODULE_12__.InstantSearchProvider, {
        value: this.state.contextValue
      }, this.props.children);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var nextIsControlled = isControlled(nextProps);
      var previousSearchState = prevState.instantSearchManager.store.getState().widgets;
      var nextSearchState = nextProps.searchState;

      if (nextIsControlled && !react_fast_compare__WEBPACK_IMPORTED_MODULE_8___default()(previousSearchState, nextSearchState)) {
        prevState.instantSearchManager.onExternalStateUpdate(nextProps.searchState);
      }

      return {
        isControlled: nextIsControlled,
        contextValue: _objectSpread(_objectSpread({}, prevState.contextValue), {}, {
          mainTargetedIndex: nextProps.indexName
        })
      };
    }
  }]);

  return InstantSearch;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

(0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(InstantSearch, "defaultProps", {
  stalledSearchDelay: 200,
  refresh: false
});

(0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(InstantSearch, "propTypes", {
  // @TODO: These props are currently constant.
  indexName: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().string.isRequired),
  searchClient: prop_types__WEBPACK_IMPORTED_MODULE_9___default().shape({
    search: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func.isRequired),
    searchForFacetValues: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
    addAlgoliaAgent: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
    clearCache: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func)
  }).isRequired,
  createURL: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  refresh: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().bool),
  searchState: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().object),
  onSearchStateChange: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  onSearchParameters: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  widgetsCollector: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().func),
  resultsState: prop_types__WEBPACK_IMPORTED_MODULE_9___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_9___default().object), (prop_types__WEBPACK_IMPORTED_MODULE_9___default().array)]),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().node),
  stalledSearchDelay: (prop_types__WEBPACK_IMPORTED_MODULE_9___default().number)
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InstantSearch);

/***/ }),

/***/ "./node_modules/react-instantsearch-dom/dist/es/components/Highlight.js":
/*!******************************************************************************!*\
  !*** ./node_modules/react-instantsearch-dom/dist/es/components/Highlight.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/utils */ "./node_modules/react-instantsearch-dom/dist/es/core/utils.js");
/* harmony import */ var _Highlighter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Highlighter */ "./node_modules/react-instantsearch-dom/dist/es/components/Highlighter.js");




var cx = (0,_core_utils__WEBPACK_IMPORTED_MODULE_2__.createClassNames)('Highlight');

var Highlight = function Highlight(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Highlighter__WEBPACK_IMPORTED_MODULE_3__["default"], (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props, {
    highlightProperty: "_highlightResult",
    cx: cx
  }));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Highlight);

/***/ }),

/***/ "./node_modules/react-instantsearch-dom/dist/es/components/Highlighter.js":
/*!********************************************************************************!*\
  !*** ./node_modules/react-instantsearch-dom/dist/es/components/Highlighter.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Highlight": () => (/* binding */ Highlight),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);



var Highlight = function Highlight(_ref) {
  var cx = _ref.cx,
      value = _ref.value,
      highlightedTagName = _ref.highlightedTagName,
      isHighlighted = _ref.isHighlighted,
      nonHighlightedTagName = _ref.nonHighlightedTagName;
  var TagName = isHighlighted ? highlightedTagName : nonHighlightedTagName;
  var className = isHighlighted ? 'highlighted' : 'nonHighlighted';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(TagName, {
    className: cx(className)
  }, value);
};
Highlight.propTypes = {
  cx: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
  value: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
  isHighlighted: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool.isRequired),
  highlightedTagName: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
  nonHighlightedTagName: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired)
};

var Highlighter = function Highlighter(_ref2) {
  var cx = _ref2.cx,
      hit = _ref2.hit,
      attribute = _ref2.attribute,
      highlight = _ref2.highlight,
      highlightProperty = _ref2.highlightProperty,
      tagName = _ref2.tagName,
      nonHighlightedTagName = _ref2.nonHighlightedTagName,
      separator = _ref2.separator,
      className = _ref2.className;
  var parsedHighlightedValue = highlight({
    hit: hit,
    attribute: attribute,
    highlightProperty: highlightProperty
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(cx(''), className)
  }, parsedHighlightedValue.map(function (item, i) {
    if (Array.isArray(item)) {
      var isLast = i === parsedHighlightedValue.length - 1;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        key: i
      }, item.map(function (element, index) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Highlight, {
          cx: cx,
          key: index,
          value: element.value,
          highlightedTagName: tagName,
          nonHighlightedTagName: nonHighlightedTagName,
          isHighlighted: element.isHighlighted
        });
      }), !isLast && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: cx('separator')
      }, separator));
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Highlight, {
      cx: cx,
      key: i,
      value: item.value,
      highlightedTagName: tagName,
      nonHighlightedTagName: nonHighlightedTagName,
      isHighlighted: item.isHighlighted
    });
  }));
};

Highlighter.propTypes = {
  cx: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
  hit: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired),
  attribute: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_1___default().string)), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string)]).isRequired,
  highlight: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
  highlightProperty: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
  tagName: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  nonHighlightedTagName: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  className: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  separator: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node)
};
Highlighter.defaultProps = {
  tagName: 'em',
  nonHighlightedTagName: 'span',
  className: '',
  separator: ', '
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Highlighter);

/***/ }),

/***/ "./node_modules/react-instantsearch-dom/dist/es/components/Hits.js":
/*!*************************************************************************!*\
  !*** ./node_modules/react-instantsearch-dom/dist/es/components/Hits.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/utils */ "./node_modules/react-instantsearch-dom/dist/es/core/utils.js");




var cx = (0,_core_utils__WEBPACK_IMPORTED_MODULE_3__.createClassNames)('Hits');

var DefaultHitComponent = function DefaultHitComponent(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    style: {
      borderBottom: '1px solid #bbb',
      paddingBottom: '5px',
      marginBottom: '5px',
      wordBreak: 'break-all'
    }
  }, JSON.stringify(props).slice(0, 100), "...");
};

var Hits = function Hits(_ref) {
  var hits = _ref.hits,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$hitComponent = _ref.hitComponent,
      HitComponent = _ref$hitComponent === void 0 ? DefaultHitComponent : _ref$hitComponent;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(cx(''), className)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: cx('list')
  }, hits.map(function (hit) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: cx('item'),
      key: hit.objectID
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(HitComponent, {
      hit: hit
    }));
  })));
};

var HitPropTypes = prop_types__WEBPACK_IMPORTED_MODULE_1___default().shape({
  objectID: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_1___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number)]).isRequired
});
Hits.propTypes = {
  hits: prop_types__WEBPACK_IMPORTED_MODULE_1___default().arrayOf(HitPropTypes.isRequired).isRequired,
  className: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  // this is actually PropTypes.elementType, but our prop-types version is outdated
  hitComponent: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().any)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hits);

/***/ }),

/***/ "./node_modules/react-instantsearch-dom/dist/es/components/Snippet.js":
/*!****************************************************************************!*\
  !*** ./node_modules/react-instantsearch-dom/dist/es/components/Snippet.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/utils */ "./node_modules/react-instantsearch-dom/dist/es/core/utils.js");
/* harmony import */ var _Highlighter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Highlighter */ "./node_modules/react-instantsearch-dom/dist/es/components/Highlighter.js");




var cx = (0,_core_utils__WEBPACK_IMPORTED_MODULE_2__.createClassNames)('Snippet');

var Snippet = function Snippet(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Highlighter__WEBPACK_IMPORTED_MODULE_3__["default"], (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props, {
    highlightProperty: "_snippetResult",
    cx: cx
  }));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Snippet);

/***/ }),

/***/ "./node_modules/react-instantsearch-dom/dist/es/core/utils.js":
/*!********************************************************************!*\
  !*** ./node_modules/react-instantsearch-dom/dist/es/core/utils.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createClassNames": () => (/* binding */ createClassNames),
/* harmony export */   "isSpecialClick": () => (/* binding */ isSpecialClick),
/* harmony export */   "capitalize": () => (/* binding */ capitalize),
/* harmony export */   "range": () => (/* binding */ range),
/* harmony export */   "find": () => (/* binding */ find)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);


var createClassNames = function createClassNames(block) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ais';
  return function () {
    for (var _len = arguments.length, elements = new Array(_len), _key = 0; _key < _len; _key++) {
      elements[_key] = arguments[_key];
    }

    var suitElements = elements.filter(function (element) {
      return element || element === '';
    }).map(function (element) {
      var baseClassName = "".concat(prefix, "-").concat(block);
      return element ? "".concat(baseClassName, "-").concat(element) : baseClassName;
    });
    return classnames__WEBPACK_IMPORTED_MODULE_1___default()(suitElements);
  };
};
var isSpecialClick = function isSpecialClick(event) {
  var isMiddleClick = event.button === 1;
  return Boolean(isMiddleClick || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
};
var capitalize = function capitalize(key) {
  return key.length === 0 ? '' : "".concat(key[0].toUpperCase()).concat(key.slice(1));
};
// taken from InstantSearch.js/utils
function range(_ref) {
  var _ref$start = _ref.start,
      start = _ref$start === void 0 ? 0 : _ref$start,
      end = _ref.end,
      _ref$step = _ref.step,
      step = _ref$step === void 0 ? 1 : _ref$step;
  // We can't divide by 0 so we re-assign the step to 1 if it happens.
  var limitStep = step === 0 ? 1 : step; // In some cases the array to create has a decimal length.
  // We therefore need to round the value.
  // Example:
  //   { start: 1, end: 5000, step: 500 }
  //   => Array length = (5000 - 1) / 500 = 9.998

  var arrayLength = Math.round((end - start) / limitStep);
  return (0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(Array(arrayLength)).map(function (_, current) {
    return (start + current) * limitStep;
  });
}
function find(array, comparator) {
  if (!Array.isArray(array)) {
    return undefined;
  }

  for (var i = 0; i < array.length; i++) {
    if (comparator(array[i])) {
      return array[i];
    }
  }

  return undefined;
}

/***/ }),

/***/ "./node_modules/react-instantsearch-dom/dist/es/widgets/Highlight.js":
/*!***************************************************************************!*\
  !*** ./node_modules/react-instantsearch-dom/dist/es/widgets/Highlight.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_instantsearch_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-instantsearch-core */ "./node_modules/react-instantsearch-core/dist/es/connectors/connectHighlight.js");
/* harmony import */ var _components_Highlight__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Highlight */ "./node_modules/react-instantsearch-dom/dist/es/components/Highlight.js");


/**
 * Renders any attribute from a hit into its highlighted form when relevant.
 *
 * Read more about it in the [Highlighting results](guide/Highlighting_results.html) guide.
 * @name Highlight
 * @kind widget
 * @propType {string} attribute - location of the highlighted attribute in the hit (the corresponding element can be either a string or an array of strings)
 * @propType {object} hit - hit object containing the highlighted attribute
 * @propType {string} [tagName='em'] - tag to be used for highlighted parts of the hit
 * @propType {string} [nonHighlightedTagName='span'] - tag to be used for the parts of the hit that are not highlighted
 * @propType {node} [separator=',<space>'] - symbol used to separate the elements of the array in case the attribute points to an array of strings.
 * @themeKey ais-Highlight - root of the component
 * @themeKey ais-Highlight-highlighted - part of the text which is highlighted
 * @themeKey ais-Highlight-nonHighlighted - part of the text that is not highlighted
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
 *
 * const Hit = ({ hit }) => (
 *   <div>
 *     <Highlight attribute="name" hit={hit} />
 *   </div>
 * );
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <SearchBox defaultRefinement="Pho" />
 *     <Hits hitComponent={Hit} />
 *   </InstantSearch>
 * );
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_instantsearch_core__WEBPACK_IMPORTED_MODULE_0__["default"])(_components_Highlight__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/react-instantsearch-dom/dist/es/widgets/Hits.js":
/*!**********************************************************************!*\
  !*** ./node_modules/react-instantsearch-dom/dist/es/widgets/Hits.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_instantsearch_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-instantsearch-core */ "./node_modules/react-instantsearch-core/dist/es/connectors/connectHits.js");
/* harmony import */ var _components_Hits__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Hits */ "./node_modules/react-instantsearch-dom/dist/es/components/Hits.js");


/**
 * Displays a list of hits.
 *
 * To configure the number of hits being shown, use the [HitsPerPage widget](widgets/HitsPerPage.html),
 * [connectHitsPerPage connector](connectors/connectHitsPerPage.html) or the [Configure widget](widgets/Configure.html).
 *
 * @name Hits
 * @kind widget
 * @propType {Component} [hitComponent] - Component used for rendering each hit from
 *   the results. If it is not provided the rendering defaults to displaying the
 *   hit in its JSON form. The component will be called with a `hit` prop.
 * @themeKey ais-Hits - the root div of the widget
 * @themeKey ais-Hits-list - the list of results
 * @themeKey ais-Hits-item - the hit list item
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, Hits } from 'react-instantsearch-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 * const App = () => (
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <Hits />
 *   </InstantSearch>
 * );
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_instantsearch_core__WEBPACK_IMPORTED_MODULE_0__["default"])(_components_Hits__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/react-instantsearch-dom/dist/es/widgets/Snippet.js":
/*!*************************************************************************!*\
  !*** ./node_modules/react-instantsearch-dom/dist/es/widgets/Snippet.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_instantsearch_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-instantsearch-core */ "./node_modules/react-instantsearch-core/dist/es/connectors/connectHighlight.js");
/* harmony import */ var _components_Snippet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Snippet */ "./node_modules/react-instantsearch-dom/dist/es/components/Snippet.js");


/**
 * Renders any attribute from an hit into its highlighted snippet form when relevant.
 *
 * Read more about it in the [Highlighting results](guide/Highlighting_results.html) guide.
 * @name Snippet
 * @kind widget
 * @requirements To use this widget, the attribute name passed to the `attribute` prop must be
 * present in "Attributes to snippet" on the Algolia dashboard or configured as `attributesToSnippet`
 * via a set settings call to the Algolia API.
 * @propType {string} attribute - location of the highlighted snippet attribute in the hit (the corresponding element can be either a string or an array of strings)
 * @propType {object} hit - hit object containing the highlighted snippet attribute
 * @propType {string} [tagName='em'] - tag to be used for highlighted parts of the attribute
 * @propType {string} [nonHighlightedTagName='span'] - tag to be used for the parts of the hit that are not highlighted
 * @propType {node} [separator=',<space>'] - symbol used to separate the elements of the array in case the attribute points to an array of strings.
 * @themeKey ais-Snippet - the root span of the widget
 * @themeKey ais-Snippet-highlighted - the highlighted text
 * @themeKey ais-Snippet-nonHighlighted - the normal text
 * @example
 * import React from 'react';
 * import algoliasearch from 'algoliasearch/lite';
 * import { InstantSearch, SearchBox, Hits, Snippet } from 'react-instantsearch-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const Hit = ({ hit }) => (
 *   <div>
 *     <Snippet attribute="description" hit={hit} />
 *   </div>
 * );
 *
 * const App = () => (
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <SearchBox defaultRefinement="adjustable" />
 *     <Hits hitComponent={Hit} />
 *   </InstantSearch>
 * );
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_instantsearch_core__WEBPACK_IMPORTED_MODULE_0__["default"])(_components_Snippet__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./node_modules/shallowequal/index.js":
/*!********************************************!*\
  !*** ./node_modules/shallowequal/index.js ***!
  \********************************************/
/***/ ((module) => {

//

module.exports = function shallowEqual(objA, objB, compare, compareContext) {
  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

  if (ret !== void 0) {
    return !!ret;
  }

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // Test for A's keys different from B.
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    var valueA = objA[key];
    var valueB = objB[key];

    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (ret === false || (ret === void 0 && valueA !== valueB)) {
      return false;
    }
  }

  return true;
};


/***/ }),

/***/ "./node_modules/styled-components/dist/styled-components.esm.js":
/*!**********************************************************************!*\
  !*** ./node_modules/styled-components/dist/styled-components.esm.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "ServerStyleSheet": () => (/* binding */ Je),
/* harmony export */   "StyleSheetConsumer": () => (/* binding */ ue),
/* harmony export */   "StyleSheetContext": () => (/* binding */ ce),
/* harmony export */   "StyleSheetManager": () => (/* binding */ me),
/* harmony export */   "ThemeConsumer": () => (/* binding */ Ge),
/* harmony export */   "ThemeContext": () => (/* binding */ Me),
/* harmony export */   "ThemeProvider": () => (/* binding */ Le),
/* harmony export */   "__PRIVATE__": () => (/* binding */ Ke),
/* harmony export */   "createGlobalStyle": () => (/* binding */ $e),
/* harmony export */   "css": () => (/* binding */ Ae),
/* harmony export */   "isStyledComponent": () => (/* binding */ _),
/* harmony export */   "keyframes": () => (/* binding */ We),
/* harmony export */   "useTheme": () => (/* binding */ Ze),
/* harmony export */   "version": () => (/* binding */ A),
/* harmony export */   "withTheme": () => (/* binding */ Xe)
/* harmony export */ });
/* harmony import */ var react_is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var shallowequal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! shallowequal */ "./node_modules/shallowequal/index.js");
/* harmony import */ var shallowequal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(shallowequal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _emotion_stylis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/stylis */ "./node_modules/@emotion/stylis/dist/stylis.esm.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/unitless */ "./node_modules/@emotion/unitless/dist/unitless.esm.js");
/* harmony import */ var _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/is-prop-valid */ "./node_modules/@emotion/is-prop-valid/dist/is-prop-valid.esm.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_6__);
function y(){return(y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var v=function(e,t){for(var n=[e[0]],r=0,o=t.length;r<o;r+=1)n.push(t[r],e[r+1]);return n},g=function(t){return null!==t&&"object"==typeof t&&"[object Object]"===(t.toString?t.toString():Object.prototype.toString.call(t))&&!(0,react_is__WEBPACK_IMPORTED_MODULE_0__.typeOf)(t)},S=Object.freeze([]),w=Object.freeze({});function E(e){return"function"==typeof e}function b(e){return true&&"string"==typeof e&&e||e.displayName||e.name||"Component"}function _(e){return e&&"string"==typeof e.styledComponentId}var N="undefined"!=typeof process&&(({}).REACT_APP_SC_ATTR||({}).SC_ATTR)||"data-styled",A="5.3.3",C="undefined"!=typeof window&&"HTMLElement"in window,I=Boolean("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==({}).REACT_APP_SC_DISABLE_SPEEDY&&""!==({}).REACT_APP_SC_DISABLE_SPEEDY?"false"!==({}).REACT_APP_SC_DISABLE_SPEEDY&&({}).REACT_APP_SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==({}).SC_DISABLE_SPEEDY&&""!==({}).SC_DISABLE_SPEEDY?"false"!==({}).SC_DISABLE_SPEEDY&&({}).SC_DISABLE_SPEEDY:"production"!=="development"),P={},O= true?{1:"Cannot create styled-component for component: %s.\n\n",2:"Can't collect styles once you've consumed a `ServerStyleSheet`'s styles! `ServerStyleSheet` is a one off instance for each server-side render cycle.\n\n- Are you trying to reuse it across renders?\n- Are you accidentally calling collectStyles twice?\n\n",3:"Streaming SSR is only supported in a Node.js environment; Please do not try to call this method in the browser.\n\n",4:"The `StyleSheetManager` expects a valid target or sheet prop!\n\n- Does this error occur on the client and is your target falsy?\n- Does this error occur on the server and is the sheet falsy?\n\n",5:"The clone method cannot be used on the client!\n\n- Are you running in a client-like environment on the server?\n- Are you trying to run SSR on the client?\n\n",6:"Trying to insert a new style tag, but the given Node is unmounted!\n\n- Are you using a custom target that isn't mounted?\n- Does your document not have a valid head element?\n- Have you accidentally removed a style tag manually?\n\n",7:'ThemeProvider: Please return an object from your "theme" prop function, e.g.\n\n```js\ntheme={() => ({})}\n```\n\n',8:'ThemeProvider: Please make your "theme" prop an object.\n\n',9:"Missing document `<head>`\n\n",10:"Cannot find a StyleSheet instance. Usually this happens if there are multiple copies of styled-components loaded at once. Check out this issue for how to troubleshoot and fix the common cases where this situation can happen: https://github.com/styled-components/styled-components/issues/1941#issuecomment-417862021\n\n",11:"_This error was replaced with a dev-time warning, it will be deleted for v4 final._ [createGlobalStyle] received children which will not be rendered. Please use the component without passing children elements.\n\n",12:"It seems you are interpolating a keyframe declaration (%s) into an untagged string. This was supported in styled-components v3, but is not longer supported in v4 as keyframes are now injected on-demand. Please wrap your string in the css\\`\\` helper which ensures the styles are injected correctly. See https://www.styled-components.com/docs/api#css\n\n",13:"%s is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.\n\n",14:'ThemeProvider: "theme" prop is required.\n\n',15:"A stylis plugin has been supplied that is not named. We need a name for each plugin to be able to prevent styling collisions between different stylis configurations within the same app. Before you pass your plugin to `<StyleSheetManager stylisPlugins={[]}>`, please make sure each plugin is uniquely-named, e.g.\n\n```js\nObject.defineProperty(importedPlugin, 'name', { value: 'some-unique-name' });\n```\n\n",16:"Reached the limit of how many styled components may be created at group %s.\nYou may only create up to 1,073,741,824 components. If you're creating components dynamically,\nas for instance in your render method then you may be running into this limitation.\n\n",17:"CSSStyleSheet could not be found on HTMLStyleElement.\nHas styled-components' style tag been unmounted or altered by another script?\n"}:0;function R(){for(var e=arguments.length<=0?void 0:arguments[0],t=[],n=1,r=arguments.length;n<r;n+=1)t.push(n<0||arguments.length<=n?void 0:arguments[n]);return t.forEach((function(t){e=e.replace(/%[a-z]/,t)})),e}function D(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];throw false?0:new Error(R.apply(void 0,[O[e]].concat(n)).trim())}var j=function(){function e(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e}var t=e.prototype;return t.indexOfGroup=function(e){for(var t=0,n=0;n<e;n++)t+=this.groupSizes[n];return t},t.insertRules=function(e,t){if(e>=this.groupSizes.length){for(var n=this.groupSizes,r=n.length,o=r;e>=o;)(o<<=1)<0&&D(16,""+e);this.groupSizes=new Uint32Array(o),this.groupSizes.set(n),this.length=o;for(var s=r;s<o;s++)this.groupSizes[s]=0}for(var i=this.indexOfGroup(e+1),a=0,c=t.length;a<c;a++)this.tag.insertRule(i,t[a])&&(this.groupSizes[e]++,i++)},t.clearGroup=function(e){if(e<this.length){var t=this.groupSizes[e],n=this.indexOfGroup(e),r=n+t;this.groupSizes[e]=0;for(var o=n;o<r;o++)this.tag.deleteRule(n)}},t.getGroup=function(e){var t="";if(e>=this.length||0===this.groupSizes[e])return t;for(var n=this.groupSizes[e],r=this.indexOfGroup(e),o=r+n,s=r;s<o;s++)t+=this.tag.getRule(s)+"/*!sc*/\n";return t},e}(),T=new Map,x=new Map,k=1,V=function(e){if(T.has(e))return T.get(e);for(;x.has(k);)k++;var t=k++;return true&&((0|t)<0||t>1<<30)&&D(16,""+t),T.set(e,t),x.set(t,e),t},z=function(e){return x.get(e)},B=function(e,t){t>=k&&(k=t+1),T.set(e,t),x.set(t,e)},M="style["+N+'][data-styled-version="5.3.3"]',G=new RegExp("^"+N+'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)'),L=function(e,t,n){for(var r,o=n.split(","),s=0,i=o.length;s<i;s++)(r=o[s])&&e.registerName(t,r)},F=function(e,t){for(var n=(t.textContent||"").split("/*!sc*/\n"),r=[],o=0,s=n.length;o<s;o++){var i=n[o].trim();if(i){var a=i.match(G);if(a){var c=0|parseInt(a[1],10),u=a[2];0!==c&&(B(u,c),L(e,u,a[3]),e.getTag().insertRules(c,r)),r.length=0}else r.push(i)}}},Y=function(){return"undefined"!=typeof window&&void 0!==window.__webpack_nonce__?window.__webpack_nonce__:null},q=function(e){var t=document.head,n=e||t,r=document.createElement("style"),o=function(e){for(var t=e.childNodes,n=t.length;n>=0;n--){var r=t[n];if(r&&1===r.nodeType&&r.hasAttribute(N))return r}}(n),s=void 0!==o?o.nextSibling:null;r.setAttribute(N,"active"),r.setAttribute("data-styled-version","5.3.3");var i=Y();return i&&r.setAttribute("nonce",i),n.insertBefore(r,s),r},H=function(){function e(e){var t=this.element=q(e);t.appendChild(document.createTextNode("")),this.sheet=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets,n=0,r=t.length;n<r;n++){var o=t[n];if(o.ownerNode===e)return o}D(17)}(t),this.length=0}var t=e.prototype;return t.insertRule=function(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}},t.deleteRule=function(e){this.sheet.deleteRule(e),this.length--},t.getRule=function(e){var t=this.sheet.cssRules[e];return void 0!==t&&"string"==typeof t.cssText?t.cssText:""},e}(),$=function(){function e(e){var t=this.element=q(e);this.nodes=t.childNodes,this.length=0}var t=e.prototype;return t.insertRule=function(e,t){if(e<=this.length&&e>=0){var n=document.createTextNode(t),r=this.nodes[e];return this.element.insertBefore(n,r||null),this.length++,!0}return!1},t.deleteRule=function(e){this.element.removeChild(this.nodes[e]),this.length--},t.getRule=function(e){return e<this.length?this.nodes[e].textContent:""},e}(),W=function(){function e(e){this.rules=[],this.length=0}var t=e.prototype;return t.insertRule=function(e,t){return e<=this.length&&(this.rules.splice(e,0,t),this.length++,!0)},t.deleteRule=function(e){this.rules.splice(e,1),this.length--},t.getRule=function(e){return e<this.length?this.rules[e]:""},e}(),U=C,J={isServer:!C,useCSSOMInjection:!I},X=function(){function e(e,t,n){void 0===e&&(e=w),void 0===t&&(t={}),this.options=y({},J,{},e),this.gs=t,this.names=new Map(n),this.server=!!e.isServer,!this.server&&C&&U&&(U=!1,function(e){for(var t=document.querySelectorAll(M),n=0,r=t.length;n<r;n++){var o=t[n];o&&"active"!==o.getAttribute(N)&&(F(e,o),o.parentNode&&o.parentNode.removeChild(o))}}(this))}e.registerId=function(e){return V(e)};var t=e.prototype;return t.reconstructWithOptions=function(t,n){return void 0===n&&(n=!0),new e(y({},this.options,{},t),this.gs,n&&this.names||void 0)},t.allocateGSInstance=function(e){return this.gs[e]=(this.gs[e]||0)+1},t.getTag=function(){return this.tag||(this.tag=(n=(t=this.options).isServer,r=t.useCSSOMInjection,o=t.target,e=n?new W(o):r?new H(o):new $(o),new j(e)));var e,t,n,r,o},t.hasNameForId=function(e,t){return this.names.has(e)&&this.names.get(e).has(t)},t.registerName=function(e,t){if(V(e),this.names.has(e))this.names.get(e).add(t);else{var n=new Set;n.add(t),this.names.set(e,n)}},t.insertRules=function(e,t,n){this.registerName(e,t),this.getTag().insertRules(V(e),n)},t.clearNames=function(e){this.names.has(e)&&this.names.get(e).clear()},t.clearRules=function(e){this.getTag().clearGroup(V(e)),this.clearNames(e)},t.clearTag=function(){this.tag=void 0},t.toString=function(){return function(e){for(var t=e.getTag(),n=t.length,r="",o=0;o<n;o++){var s=z(o);if(void 0!==s){var i=e.names.get(s),a=t.getGroup(o);if(i&&a&&i.size){var c=N+".g"+o+'[id="'+s+'"]',u="";void 0!==i&&i.forEach((function(e){e.length>0&&(u+=e+",")})),r+=""+a+c+'{content:"'+u+'"}/*!sc*/\n'}}}return r}(this)},e}(),Z=/(a)(d)/gi,K=function(e){return String.fromCharCode(e+(e>25?39:97))};function Q(e){var t,n="";for(t=Math.abs(e);t>52;t=t/52|0)n=K(t%52)+n;return(K(t%52)+n).replace(Z,"$1-$2")}var ee=function(e,t){for(var n=t.length;n;)e=33*e^t.charCodeAt(--n);return e},te=function(e){return ee(5381,e)};function ne(e){for(var t=0;t<e.length;t+=1){var n=e[t];if(E(n)&&!_(n))return!1}return!0}var re=te("5.3.3"),oe=function(){function e(e,t,n){this.rules=e,this.staticRulesId="",this.isStatic= false&&0,this.componentId=t,this.baseHash=ee(re,t),this.baseStyle=n,X.registerId(t)}return e.prototype.generateAndInjectStyles=function(e,t,n){var r=this.componentId,o=[];if(this.baseStyle&&o.push(this.baseStyle.generateAndInjectStyles(e,t,n)),this.isStatic&&!n.hash)if(this.staticRulesId&&t.hasNameForId(r,this.staticRulesId))o.push(this.staticRulesId);else{var s=_e(this.rules,e,t,n).join(""),i=Q(ee(this.baseHash,s)>>>0);if(!t.hasNameForId(r,i)){var a=n(s,"."+i,void 0,r);t.insertRules(r,i,a)}o.push(i),this.staticRulesId=i}else{for(var c=this.rules.length,u=ee(this.baseHash,n.hash),l="",d=0;d<c;d++){var h=this.rules[d];if("string"==typeof h)l+=h, true&&(u=ee(u,h+d));else if(h){var p=_e(h,e,t,n),f=Array.isArray(p)?p.join(""):p;u=ee(u,f+d),l+=f}}if(l){var m=Q(u>>>0);if(!t.hasNameForId(r,m)){var y=n(l,"."+m,void 0,r);t.insertRules(r,m,y)}o.push(m)}}return o.join(" ")},e}(),se=/^\s*\/\/.*$/gm,ie=[":","[",".","#"];function ae(e){var t,n,r,o,s=void 0===e?w:e,i=s.options,a=void 0===i?w:i,c=s.plugins,u=void 0===c?S:c,l=new _emotion_stylis__WEBPACK_IMPORTED_MODULE_3__["default"](a),d=[],p=function(e){function t(t){if(t)try{e(t+"}")}catch(e){}}return function(n,r,o,s,i,a,c,u,l,d){switch(n){case 1:if(0===l&&64===r.charCodeAt(0))return e(r+";"),"";break;case 2:if(0===u)return r+"/*|*/";break;case 3:switch(u){case 102:case 112:return e(o[0]+r),"";default:return r+(0===d?"/*|*/":"")}case-2:r.split("/*|*/}").forEach(t)}}}((function(e){d.push(e)})),f=function(e,r,s){return 0===r&&-1!==ie.indexOf(s[n.length])||s.match(o)?e:"."+t};function m(e,s,i,a){void 0===a&&(a="&");var c=e.replace(se,""),u=s&&i?i+" "+s+" { "+c+" }":c;return t=a,n=s,r=new RegExp("\\"+n+"\\b","g"),o=new RegExp("(\\"+n+"\\b){2,}"),l(i||!s?"":s,u)}return l.use([].concat(u,[function(e,t,o){2===e&&o.length&&o[0].lastIndexOf(n)>0&&(o[0]=o[0].replace(r,f))},p,function(e){if(-2===e){var t=d;return d=[],t}}])),m.hash=u.length?u.reduce((function(e,t){return t.name||D(15),ee(e,t.name)}),5381).toString():"",m}var ce=react__WEBPACK_IMPORTED_MODULE_1___default().createContext(),ue=ce.Consumer,le=react__WEBPACK_IMPORTED_MODULE_1___default().createContext(),de=(le.Consumer,new X),he=ae();function pe(){return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ce)||de}function fe(){return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(le)||he}function me(e){var t=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(e.stylisPlugins),n=t[0],s=t[1],c=pe(),u=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)((function(){var t=c;return e.sheet?t=e.sheet:e.target&&(t=t.reconstructWithOptions({target:e.target},!1)),e.disableCSSOMInjection&&(t=t.reconstructWithOptions({useCSSOMInjection:!1})),t}),[e.disableCSSOMInjection,e.sheet,e.target]),l=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)((function(){return ae({options:{prefix:!e.disableVendorPrefixes},plugins:n})}),[e.disableVendorPrefixes,n]);return (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((function(){shallowequal__WEBPACK_IMPORTED_MODULE_2___default()(n,e.stylisPlugins)||s(e.stylisPlugins)}),[e.stylisPlugins]),react__WEBPACK_IMPORTED_MODULE_1___default().createElement(ce.Provider,{value:u},react__WEBPACK_IMPORTED_MODULE_1___default().createElement(le.Provider,{value:l}, true?react__WEBPACK_IMPORTED_MODULE_1___default().Children.only(e.children):0))}var ye=function(){function e(e,t){var n=this;this.inject=function(e,t){void 0===t&&(t=he);var r=n.name+t.hash;e.hasNameForId(n.id,r)||e.insertRules(n.id,r,t(n.rules,r,"@keyframes"))},this.toString=function(){return D(12,String(n.name))},this.name=e,this.id="sc-keyframes-"+e,this.rules=t}return e.prototype.getName=function(e){return void 0===e&&(e=he),this.name+e.hash},e}(),ve=/([A-Z])/,ge=/([A-Z])/g,Se=/^ms-/,we=function(e){return"-"+e.toLowerCase()};function Ee(e){return ve.test(e)?e.replace(ge,we).replace(Se,"-ms-"):e}var be=function(e){return null==e||!1===e||""===e};function _e(e,n,r,o){if(Array.isArray(e)){for(var s,i=[],a=0,c=e.length;a<c;a+=1)""!==(s=_e(e[a],n,r,o))&&(Array.isArray(s)?i.push.apply(i,s):i.push(s));return i}if(be(e))return"";if(_(e))return"."+e.styledComponentId;if(E(e)){if("function"!=typeof(l=e)||l.prototype&&l.prototype.isReactComponent||!n)return e;var u=e(n);return true&&(0,react_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(u)&&console.warn(b(e)+" is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details."),_e(u,n,r,o)}var l;return e instanceof ye?r?(e.inject(r,o),e.getName(o)):e:g(e)?function e(t,n){var r,o,s=[];for(var i in t)t.hasOwnProperty(i)&&!be(t[i])&&(Array.isArray(t[i])&&t[i].isCss||E(t[i])?s.push(Ee(i)+":",t[i],";"):g(t[i])?s.push.apply(s,e(t[i],i)):s.push(Ee(i)+": "+(r=i,null==(o=t[i])||"boolean"==typeof o||""===o?"":"number"!=typeof o||0===o||r in _emotion_unitless__WEBPACK_IMPORTED_MODULE_4__["default"]?String(o).trim():o+"px")+";"));return n?[n+" {"].concat(s,["}"]):s}(e):e.toString()}var Ne=function(e){return Array.isArray(e)&&(e.isCss=!0),e};function Ae(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return E(e)||g(e)?Ne(_e(v(S,[e].concat(n)))):0===n.length&&1===e.length&&"string"==typeof e[0]?e:Ne(_e(v(e,n)))}var Ce=/invalid hook call/i,Ie=new Set,Pe=function(e,t){if(true){var n="The component "+e+(t?' with the id of "'+t+'"':"")+" has been created dynamically.\nYou may see this warning because you've called styled inside another component.\nTo resolve this only create new StyledComponents outside of any render method and function component.",r=console.error;try{var o=!0;console.error=function(e){if(Ce.test(e))o=!1,Ie.delete(n);else{for(var t=arguments.length,s=new Array(t>1?t-1:0),i=1;i<t;i++)s[i-1]=arguments[i];r.apply(void 0,[e].concat(s))}},(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(),o&&!Ie.has(n)&&(console.warn(n),Ie.add(n))}catch(e){Ce.test(e.message)&&Ie.delete(n)}finally{console.error=r}}},Oe=function(e,t,n){return void 0===n&&(n=w),e.theme!==n.theme&&e.theme||t||n.theme},Re=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,De=/(^-|-$)/g;function je(e){return e.replace(Re,"-").replace(De,"")}var Te=function(e){return Q(te(e)>>>0)};function xe(e){return"string"==typeof e&&( false||e.charAt(0)===e.charAt(0).toLowerCase())}var ke=function(e){return"function"==typeof e||"object"==typeof e&&null!==e&&!Array.isArray(e)},Ve=function(e){return"__proto__"!==e&&"constructor"!==e&&"prototype"!==e};function ze(e,t,n){var r=e[n];ke(t)&&ke(r)?Be(r,t):e[n]=t}function Be(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];for(var o=0,s=n;o<s.length;o++){var i=s[o];if(ke(i))for(var a in i)Ve(a)&&ze(e,i[a],a)}return e}var Me=react__WEBPACK_IMPORTED_MODULE_1___default().createContext(),Ge=Me.Consumer;function Le(e){var t=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Me),n=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)((function(){return function(e,t){if(!e)return D(14);if(E(e)){var n=e(t);return false||null!==n&&!Array.isArray(n)&&"object"==typeof n?n:D(7)}return Array.isArray(e)||"object"!=typeof e?D(8):t?y({},t,{},e):e}(e.theme,t)}),[e.theme,t]);return e.children?react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Me.Provider,{value:n},e.children):null}var Fe={};function Ye(e,t,n){var o=_(e),i=!xe(e),a=t.attrs,c=void 0===a?S:a,d=t.componentId,h=void 0===d?function(e,t){var n="string"!=typeof e?"sc":je(e);Fe[n]=(Fe[n]||0)+1;var r=n+"-"+Te("5.3.3"+n+Fe[n]);return t?t+"-"+r:r}(t.displayName,t.parentComponentId):d,p=t.displayName,v=void 0===p?function(e){return xe(e)?"styled."+e:"Styled("+b(e)+")"}(e):p,g=t.displayName&&t.componentId?je(t.displayName)+"-"+t.componentId:t.componentId||h,N=o&&e.attrs?Array.prototype.concat(e.attrs,c).filter(Boolean):c,A=t.shouldForwardProp;o&&e.shouldForwardProp&&(A=t.shouldForwardProp?function(n,r,o){return e.shouldForwardProp(n,r,o)&&t.shouldForwardProp(n,r,o)}:e.shouldForwardProp);var C,I=new oe(n,g,o?e.componentStyle:void 0),P=I.isStatic&&0===c.length,O=function(e,t){return function(e,t,n,r){var o=e.attrs,i=e.componentStyle,a=e.defaultProps,c=e.foldedComponentIds,d=e.shouldForwardProp,h=e.styledComponentId,p=e.target; true&&(0,react__WEBPACK_IMPORTED_MODULE_1__.useDebugValue)(h);var m=function(e,t,n){void 0===e&&(e=w);var r=y({},t,{theme:e}),o={};return n.forEach((function(e){var t,n,s,i=e;for(t in E(i)&&(i=i(r)),i)r[t]=o[t]="className"===t?(n=o[t],s=i[t],n&&s?n+" "+s:n||s):i[t]})),[r,o]}(Oe(t,(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Me),a)||w,t,o),v=m[0],g=m[1],S=function(e,t,n,r){var o=pe(),s=fe(),i=t?e.generateAndInjectStyles(w,o,s):e.generateAndInjectStyles(n,o,s);return true&&(0,react__WEBPACK_IMPORTED_MODULE_1__.useDebugValue)(i), true&&!t&&r&&r(i),i}(i,r,v, true?e.warnTooManyClasses:0),b=n,_=g.$as||t.$as||g.as||t.as||p,N=xe(_),A=g!==t?y({},t,{},g):t,C={};for(var I in A)"$"!==I[0]&&"as"!==I&&("forwardedAs"===I?C.as=A[I]:(d?d(I,_emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_5__["default"],_):!N||(0,_emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_5__["default"])(I))&&(C[I]=A[I]));return t.style&&g.style!==t.style&&(C.style=y({},t.style,{},g.style)),C.className=Array.prototype.concat(c,h,S!==h?S:null,t.className,g.className).filter(Boolean).join(" "),C.ref=b,(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(_,C)}(C,e,t,P)};return O.displayName=v,(C=react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(O)).attrs=N,C.componentStyle=I,C.displayName=v,C.shouldForwardProp=A,C.foldedComponentIds=o?Array.prototype.concat(e.foldedComponentIds,e.styledComponentId):S,C.styledComponentId=g,C.target=o?e.target:e,C.withComponent=function(e){var r=t.componentId,o=function(e,t){if(null==e)return{};var n,r,o={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(t,["componentId"]),s=r&&r+"-"+(xe(e)?e:je(b(e)));return Ye(e,y({},o,{attrs:N,componentId:s}),n)},Object.defineProperty(C,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(t){this._foldedDefaultProps=o?Be({},e.defaultProps,t):t}}), true&&(Pe(v,g),C.warnTooManyClasses=function(e,t){var n={},r=!1;return function(o){if(!r&&(n[o]=!0,Object.keys(n).length>=200)){var s=t?' with the id of "'+t+'"':"";console.warn("Over 200 classes were generated for component "+e+s+".\nConsider using the attrs method, together with a style object for frequently changed styles.\nExample:\n  const Component = styled.div.attrs(props => ({\n    style: {\n      background: props.background,\n    },\n  }))`width: 100%;`\n\n  <Component />"),r=!0,n={}}}}(v,g)),C.toString=function(){return"."+C.styledComponentId},i&&hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_6___default()(C,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0,withComponent:!0}),C}var qe=function(e){return function e(t,r,o){if(void 0===o&&(o=w),!(0,react_is__WEBPACK_IMPORTED_MODULE_0__.isValidElementType)(r))return D(1,String(r));var s=function(){return t(r,o,Ae.apply(void 0,arguments))};return s.withConfig=function(n){return e(t,r,y({},o,{},n))},s.attrs=function(n){return e(t,r,y({},o,{attrs:Array.prototype.concat(o.attrs,n).filter(Boolean)}))},s}(Ye,e)};["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","textPath","tspan"].forEach((function(e){qe[e]=qe(e)}));var He=function(){function e(e,t){this.rules=e,this.componentId=t,this.isStatic=ne(e),X.registerId(this.componentId+1)}var t=e.prototype;return t.createStyles=function(e,t,n,r){var o=r(_e(this.rules,t,n,r).join(""),""),s=this.componentId+e;n.insertRules(s,s,o)},t.removeStyles=function(e,t){t.clearRules(this.componentId+e)},t.renderStyles=function(e,t,n,r){e>2&&X.registerId(this.componentId+e),this.removeStyles(e,n),this.createStyles(e,t,n,r)},e}();function $e(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];var i=Ae.apply(void 0,[e].concat(n)),a="sc-global-"+Te(JSON.stringify(i)),u=new He(i,a);function l(e){var t=pe(),n=fe(),o=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Me),u=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(t.allocateGSInstance(a)).current;return true&&react__WEBPACK_IMPORTED_MODULE_1___default().Children.count(e.children)&&console.warn("The global style component "+a+" was given child JSX. createGlobalStyle does not render children."), true&&i.some((function(e){return"string"==typeof e&&-1!==e.indexOf("@import")}))&&console.warn("Please do not use @import CSS syntax in createGlobalStyle at this time, as the CSSOM APIs we use in production do not handle it well. Instead, we recommend using a library such as react-helmet to inject a typical <link> meta tag to the stylesheet, or simply embedding it manually in your index.html <head> section for a simpler app."),t.server&&d(u,e,t,o,n),null}function d(e,t,n,r,o){if(u.isStatic)u.renderStyles(e,P,n,o);else{var s=y({},t,{theme:Oe(t,r,l.defaultProps)});u.renderStyles(e,s,n,o)}}return true&&Pe(a),react__WEBPACK_IMPORTED_MODULE_1___default().memo(l)}function We(e){ true&&"undefined"!=typeof navigator&&"ReactNative"===navigator.product&&console.warn("`keyframes` cannot be used on ReactNative, only on the web. To do animation in ReactNative please use Animated.");for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];var o=Ae.apply(void 0,[e].concat(n)).join(""),s=Te(o);return new ye(s,o)}var Ue=/^\s*<\/[a-z]/i,Je=function(){function e(){var e=this;this._emitSheetCSS=function(){var t=e.instance.toString();if(!t)return"";var n=Y();return"<style "+[n&&'nonce="'+n+'"',N+'="true"','data-styled-version="5.3.3"'].filter(Boolean).join(" ")+">"+t+"</style>"},this.getStyleTags=function(){return e.sealed?D(2):e._emitSheetCSS()},this.getStyleElement=function(){var t;if(e.sealed)return D(2);var n=((t={})[N]="",t["data-styled-version"]="5.3.3",t.dangerouslySetInnerHTML={__html:e.instance.toString()},t),o=Y();return o&&(n.nonce=o),[react__WEBPACK_IMPORTED_MODULE_1___default().createElement("style",y({},n,{key:"sc-0-0"}))]},this.seal=function(){e.sealed=!0},this.instance=new X({isServer:!0}),this.sealed=!1}var t=e.prototype;return t.collectStyles=function(e){return this.sealed?D(2):react__WEBPACK_IMPORTED_MODULE_1___default().createElement(me,{sheet:this.instance},e)},t.interleaveWithNodeStream=function(e){if(C)return D(3);if(this.sealed)return D(2);this.seal();var t=__webpack_require__(/*! stream */ "stream"),n=(t.Readable,t.Transform),r=e,o=this.instance,s=this._emitSheetCSS,i=new n({transform:function(e,t,n){var r=e.toString(),i=s();if(o.clearTag(),Ue.test(r)){var a=r.indexOf(">")+1,c=r.slice(0,a),u=r.slice(a);this.push(c+i+u)}else this.push(i+r);n()}});return r.on("error",(function(e){i.emit("error",e)})),r.pipe(i)},e}(),Xe=function(e){var t=react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef((function(t,n){var o=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Me),i=e.defaultProps,a=Oe(t,o,i);return true&&void 0===a&&console.warn('[withTheme] You are not using a ThemeProvider nor passing a theme prop or a theme in defaultProps in component class "'+b(e)+'"'),react__WEBPACK_IMPORTED_MODULE_1___default().createElement(e,y({},t,{theme:a,ref:n}))}));return hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_6___default()(t,e),t.displayName="WithTheme("+b(e)+")",t},Ze=function(){return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Me)},Ke={StyleSheet:X,masterSheet:de}; true&&"undefined"!=typeof navigator&&"ReactNative"===navigator.product&&console.warn("It looks like you've imported 'styled-components' on React Native.\nPerhaps you're looking to import 'styled-components/native'?\nRead more about this at https://www.styled-components.com/docs/basics#react-native"), true&&"undefined"!=typeof window&&(window["__styled-components-init__"]=window["__styled-components-init__"]||0,1===window["__styled-components-init__"]&&console.warn("It looks like there are several instances of 'styled-components' initialized in this application. This may cause dynamic styles to not render properly, errors during the rehydration process, a missing theme prop, and makes your application bigger without good reason.\n\nSee https://s-c.sh/2BAXzed for more info."),window["__styled-components-init__"]+=1);/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (qe);
//# sourceMappingURL=styled-components.esm.js.map


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithoutHoles)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inherits)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableSpread)
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _possibleConstructorReturn)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toConsumableArray)
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ })

};
;
//# sourceMappingURL=src_components_search_index_js.js.map