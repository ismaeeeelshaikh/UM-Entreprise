"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/me/route";
exports.ids = ["app/api/me/route"];
exports.modules = {

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fme%2Froute&page=%2Fapi%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Froute.js&appDir=C%3A%5CUsers%5CIsmaeel%20Shaikh%5CDownloads%5Cum-entreprise%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CIsmaeel%20Shaikh%5CDownloads%5Cum-entreprise&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fme%2Froute&page=%2Fapi%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Froute.js&appDir=C%3A%5CUsers%5CIsmaeel%20Shaikh%5CDownloads%5Cum-entreprise%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CIsmaeel%20Shaikh%5CDownloads%5Cum-entreprise&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Ismaeel_Shaikh_Downloads_um_entreprise_app_api_me_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/me/route.js */ \"(rsc)/./app/api/me/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/me/route\",\n        pathname: \"/api/me\",\n        filename: \"route\",\n        bundlePath: \"app/api/me/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Ismaeel Shaikh\\\\Downloads\\\\um-entreprise\\\\app\\\\api\\\\me\\\\route.js\",\n    nextConfigOutput,\n    userland: C_Users_Ismaeel_Shaikh_Downloads_um_entreprise_app_api_me_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/me/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZtZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbWUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZtZSUyRnJvdXRlLmpzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNJc21hZWVsJTIwU2hhaWtoJTVDRG93bmxvYWRzJTVDdW0tZW50cmVwcmlzZSU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDSXNtYWVlbCUyMFNoYWlraCU1Q0Rvd25sb2FkcyU1Q3VtLWVudHJlcHJpc2UmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQzJCO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdW0tZW50cmVwcmlzZS8/M2NkZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxJc21hZWVsIFNoYWlraFxcXFxEb3dubG9hZHNcXFxcdW0tZW50cmVwcmlzZVxcXFxhcHBcXFxcYXBpXFxcXG1lXFxcXHJvdXRlLmpzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9tZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL21lXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9tZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXElzbWFlZWwgU2hhaWtoXFxcXERvd25sb2Fkc1xcXFx1bS1lbnRyZXByaXNlXFxcXGFwcFxcXFxhcGlcXFxcbWVcXFxccm91dGUuanNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL21lL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fme%2Froute&page=%2Fapi%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Froute.js&appDir=C%3A%5CUsers%5CIsmaeel%20Shaikh%5CDownloads%5Cum-entreprise%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CIsmaeel%20Shaikh%5CDownloads%5Cum-entreprise&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/me/route.js":
/*!*****************************!*\
  !*** ./app/api/me/route.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.js\");\n/* harmony import */ var _lib_models_User__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/models/User */ \"(rsc)/./lib/models/User.js\");\n\n\n\n\n\nasync function GET() {\n    try {\n        const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)();\n        const token = cookieStore.get(\"token\")?.value;\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                user: null\n            });\n        }\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, process.env.JWT_SECRET || \"your-secret-key\");\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n        const user = await _lib_models_User__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findById(decoded.id).select(\"-password\");\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                user: null\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            user: {\n                id: user._id,\n                name: user.name,\n                email: user.email,\n                role: user.role\n            }\n        });\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            user: null\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21lL3JvdXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMkM7QUFDWjtBQUNRO0FBQ047QUFDSTtBQUU5QixlQUFlSztJQUNwQixJQUFJO1FBQ0YsTUFBTUMsY0FBY0oscURBQU9BO1FBQzNCLE1BQU1LLFFBQVFELFlBQVlFLEdBQUcsQ0FBQyxVQUFVQztRQUV4QyxJQUFJLENBQUNGLE9BQU87WUFDVixPQUFPUCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDO2dCQUFFQyxNQUFNO1lBQUs7UUFDeEM7UUFFQSxNQUFNQyxVQUFVWCwwREFBVSxDQUFDTSxPQUFPTyxRQUFRQyxHQUFHLENBQUNDLFVBQVUsSUFBSTtRQUU1RCxNQUFNYixtREFBU0E7UUFDZixNQUFNUSxPQUFPLE1BQU1QLHdEQUFJQSxDQUFDYSxRQUFRLENBQUNMLFFBQVFNLEVBQUUsRUFBRUMsTUFBTSxDQUFDO1FBRXBELElBQUksQ0FBQ1IsTUFBTTtZQUNULE9BQU9YLHFEQUFZQSxDQUFDVSxJQUFJLENBQUM7Z0JBQUVDLE1BQU07WUFBSztRQUN4QztRQUVBLE9BQU9YLHFEQUFZQSxDQUFDVSxJQUFJLENBQUM7WUFDdkJDLE1BQU07Z0JBQ0pPLElBQUlQLEtBQUtTLEdBQUc7Z0JBQ1pDLE1BQU1WLEtBQUtVLElBQUk7Z0JBQ2ZDLE9BQU9YLEtBQUtXLEtBQUs7Z0JBQ2pCQyxNQUFNWixLQUFLWSxJQUFJO1lBQ2pCO1FBQ0Y7SUFDRixFQUFFLE9BQU9DLE9BQU87UUFDZCxPQUFPeEIscURBQVlBLENBQUNVLElBQUksQ0FBQztZQUFFQyxNQUFNO1FBQUs7SUFDeEM7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3VtLWVudHJlcHJpc2UvLi9hcHAvYXBpL21lL3JvdXRlLmpzP2Y5MGQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5pbXBvcnQgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XHJcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xyXG5pbXBvcnQgY29ubmVjdERCIGZyb20gJ0AvbGliL2RiJztcclxuaW1wb3J0IFVzZXIgZnJvbSAnQC9saWIvbW9kZWxzL1VzZXInO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgY29va2llU3RvcmUgPSBjb29raWVzKCk7XHJcbiAgICBjb25zdCB0b2tlbiA9IGNvb2tpZVN0b3JlLmdldCgndG9rZW4nKT8udmFsdWU7XHJcblxyXG4gICAgaWYgKCF0b2tlbikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB1c2VyOiBudWxsIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRlY29kZWQgPSBqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8ICd5b3VyLXNlY3JldC1rZXknKTtcclxuICAgIFxyXG4gICAgYXdhaXQgY29ubmVjdERCKCk7XHJcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kQnlJZChkZWNvZGVkLmlkKS5zZWxlY3QoJy1wYXNzd29yZCcpO1xyXG5cclxuICAgIGlmICghdXNlcikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB1c2VyOiBudWxsIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XHJcbiAgICAgIHVzZXI6IHtcclxuICAgICAgICBpZDogdXNlci5faWQsXHJcbiAgICAgICAgbmFtZTogdXNlci5uYW1lLFxyXG4gICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgIHJvbGU6IHVzZXIucm9sZSxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB1c2VyOiBudWxsIH0pO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiand0IiwiY29va2llcyIsImNvbm5lY3REQiIsIlVzZXIiLCJHRVQiLCJjb29raWVTdG9yZSIsInRva2VuIiwiZ2V0IiwidmFsdWUiLCJqc29uIiwidXNlciIsImRlY29kZWQiLCJ2ZXJpZnkiLCJwcm9jZXNzIiwiZW52IiwiSldUX1NFQ1JFVCIsImZpbmRCeUlkIiwiaWQiLCJzZWxlY3QiLCJfaWQiLCJuYW1lIiwiZW1haWwiLCJyb2xlIiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/me/route.js\n");

/***/ }),

/***/ "(rsc)/./lib/db.js":
/*!*******************!*\
  !*** ./lib/db.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\n/**\r\n * Global cache for MongoDB connection to prevent multiple connections\r\n * in serverless environments (Vercel)\r\n */ let cached = global.mongoose;\nif (!cached) {\n    cached = global.mongoose = {\n        conn: null,\n        promise: null\n    };\n}\n/**\r\n * Connect to MongoDB Atlas\r\n * @returns {Promise<typeof mongoose>} Mongoose connection instance\r\n */ async function connectDB() {\n    // Return cached connection if available\n    if (cached.conn) {\n        return cached.conn;\n    }\n    // Create new connection if promise doesn't exist\n    if (!cached.promise) {\n        const opts = {\n            bufferCommands: false,\n            maxPoolSize: 10\n        };\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(process.env.MONGODB_URI, opts).then((mongoose)=>{\n            console.log(\"✅ MongoDB connected successfully\");\n            return mongoose;\n        }).catch((error)=>{\n            console.error(\"❌ MongoDB connection error:\", error);\n            throw error;\n        });\n    }\n    try {\n        cached.conn = await cached.promise;\n    } catch (e) {\n        cached.promise = null;\n        throw e;\n    }\n    return cached.conn;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectDB);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWdDO0FBRWhDOzs7Q0FHQyxHQUNELElBQUlDLFNBQVNDLE9BQU9GLFFBQVE7QUFFNUIsSUFBSSxDQUFDQyxRQUFRO0lBQ1hBLFNBQVNDLE9BQU9GLFFBQVEsR0FBRztRQUFFRyxNQUFNO1FBQU1DLFNBQVM7SUFBSztBQUN6RDtBQUVBOzs7Q0FHQyxHQUNELGVBQWVDO0lBQ2Isd0NBQXdDO0lBQ3hDLElBQUlKLE9BQU9FLElBQUksRUFBRTtRQUNmLE9BQU9GLE9BQU9FLElBQUk7SUFDcEI7SUFFQSxpREFBaUQ7SUFDakQsSUFBSSxDQUFDRixPQUFPRyxPQUFPLEVBQUU7UUFDbkIsTUFBTUUsT0FBTztZQUNYQyxnQkFBZ0I7WUFDaEJDLGFBQWE7UUFDZjtRQUVBUCxPQUFPRyxPQUFPLEdBQUdKLHVEQUFnQixDQUFDVSxRQUFRQyxHQUFHLENBQUNDLFdBQVcsRUFBRU4sTUFDeERPLElBQUksQ0FBQyxDQUFDYjtZQUNMYyxRQUFRQyxHQUFHLENBQUM7WUFDWixPQUFPZjtRQUNULEdBQ0NnQixLQUFLLENBQUMsQ0FBQ0M7WUFDTkgsUUFBUUcsS0FBSyxDQUFDLCtCQUErQkE7WUFDN0MsTUFBTUE7UUFDUjtJQUNKO0lBRUEsSUFBSTtRQUNGaEIsT0FBT0UsSUFBSSxHQUFHLE1BQU1GLE9BQU9HLE9BQU87SUFDcEMsRUFBRSxPQUFPYyxHQUFHO1FBQ1ZqQixPQUFPRyxPQUFPLEdBQUc7UUFDakIsTUFBTWM7SUFDUjtJQUVBLE9BQU9qQixPQUFPRSxJQUFJO0FBQ3BCO0FBRUEsaUVBQWVFLFNBQVNBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91bS1lbnRyZXByaXNlLy4vbGliL2RiLmpzPzNkYzkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbi8qKlxyXG4gKiBHbG9iYWwgY2FjaGUgZm9yIE1vbmdvREIgY29ubmVjdGlvbiB0byBwcmV2ZW50IG11bHRpcGxlIGNvbm5lY3Rpb25zXHJcbiAqIGluIHNlcnZlcmxlc3MgZW52aXJvbm1lbnRzIChWZXJjZWwpXHJcbiAqL1xyXG5sZXQgY2FjaGVkID0gZ2xvYmFsLm1vbmdvb3NlO1xyXG5cclxuaWYgKCFjYWNoZWQpIHtcclxuICBjYWNoZWQgPSBnbG9iYWwubW9uZ29vc2UgPSB7IGNvbm46IG51bGwsIHByb21pc2U6IG51bGwgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbm5lY3QgdG8gTW9uZ29EQiBBdGxhc1xyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx0eXBlb2YgbW9uZ29vc2U+fSBNb25nb29zZSBjb25uZWN0aW9uIGluc3RhbmNlXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBjb25uZWN0REIoKSB7XHJcbiAgLy8gUmV0dXJuIGNhY2hlZCBjb25uZWN0aW9uIGlmIGF2YWlsYWJsZVxyXG4gIGlmIChjYWNoZWQuY29ubikge1xyXG4gICAgcmV0dXJuIGNhY2hlZC5jb25uO1xyXG4gIH1cclxuXHJcbiAgLy8gQ3JlYXRlIG5ldyBjb25uZWN0aW9uIGlmIHByb21pc2UgZG9lc24ndCBleGlzdFxyXG4gIGlmICghY2FjaGVkLnByb21pc2UpIHtcclxuICAgIGNvbnN0IG9wdHMgPSB7XHJcbiAgICAgIGJ1ZmZlckNvbW1hbmRzOiBmYWxzZSxcclxuICAgICAgbWF4UG9vbFNpemU6IDEwLFxyXG4gICAgfTtcclxuXHJcbiAgICBjYWNoZWQucHJvbWlzZSA9IG1vbmdvb3NlLmNvbm5lY3QocHJvY2Vzcy5lbnYuTU9OR09EQl9VUkksIG9wdHMpXHJcbiAgICAgIC50aGVuKChtb25nb29zZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCfinIUgTW9uZ29EQiBjb25uZWN0ZWQgc3VjY2Vzc2Z1bGx5Jyk7XHJcbiAgICAgICAgcmV0dXJuIG1vbmdvb3NlO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcign4p2MIE1vbmdvREIgY29ubmVjdGlvbiBlcnJvcjonLCBlcnJvcik7XHJcbiAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNhY2hlZC5jb25uID0gYXdhaXQgY2FjaGVkLnByb21pc2U7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY2FjaGVkLnByb21pc2UgPSBudWxsO1xyXG4gICAgdGhyb3cgZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjYWNoZWQuY29ubjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdERCO1xyXG4iXSwibmFtZXMiOlsibW9uZ29vc2UiLCJjYWNoZWQiLCJnbG9iYWwiLCJjb25uIiwicHJvbWlzZSIsImNvbm5lY3REQiIsIm9wdHMiLCJidWZmZXJDb21tYW5kcyIsIm1heFBvb2xTaXplIiwiY29ubmVjdCIsInByb2Nlc3MiLCJlbnYiLCJNT05HT0RCX1VSSSIsInRoZW4iLCJjb25zb2xlIiwibG9nIiwiY2F0Y2giLCJlcnJvciIsImUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.js\n");

/***/ }),

/***/ "(rsc)/./lib/models/User.js":
/*!****************************!*\
  !*** ./lib/models/User.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst UserSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n    name: {\n        type: String,\n        required: [\n            true,\n            \"Please provide a name\"\n        ],\n        trim: true\n    },\n    email: {\n        type: String,\n        required: [\n            true,\n            \"Please provide an email\"\n        ],\n        unique: true,\n        lowercase: true,\n        trim: true\n    },\n    password: {\n        type: String,\n        required: [\n            true,\n            \"Please provide a password\"\n        ],\n        minlength: 6,\n        select: false\n    },\n    role: {\n        type: String,\n        enum: [\n            \"user\",\n            \"admin\"\n        ],\n        default: \"user\"\n    },\n    phone: {\n        type: String,\n        trim: true\n    },\n    address: {\n        street: String,\n        city: String,\n        state: String,\n        pincode: String,\n        country: {\n            type: String,\n            default: \"India\"\n        }\n    }\n}, {\n    timestamps: true\n});\n// REMOVE THIS LINE if it exists:\n// UserSchema.index({ email: 1 });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).User || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model(\"User\", UserSchema));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9kZWxzL1VzZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWdDO0FBRWhDLE1BQU1DLGFBQWEsSUFBSUQsd0RBQWUsQ0FDcEM7SUFDRUcsTUFBTTtRQUNKQyxNQUFNQztRQUNOQyxVQUFVO1lBQUM7WUFBTTtTQUF3QjtRQUN6Q0MsTUFBTTtJQUNSO0lBQ0FDLE9BQU87UUFDTEosTUFBTUM7UUFDTkMsVUFBVTtZQUFDO1lBQU07U0FBMEI7UUFDM0NHLFFBQVE7UUFDUkMsV0FBVztRQUNYSCxNQUFNO0lBQ1I7SUFDQUksVUFBVTtRQUNSUCxNQUFNQztRQUNOQyxVQUFVO1lBQUM7WUFBTTtTQUE0QjtRQUM3Q00sV0FBVztRQUNYQyxRQUFRO0lBQ1Y7SUFDQUMsTUFBTTtRQUNKVixNQUFNQztRQUNOVSxNQUFNO1lBQUM7WUFBUTtTQUFRO1FBQ3ZCQyxTQUFTO0lBQ1g7SUFDQUMsT0FBTztRQUNMYixNQUFNQztRQUNORSxNQUFNO0lBQ1I7SUFDQVcsU0FBUztRQUNQQyxRQUFRZDtRQUNSZSxNQUFNZjtRQUNOZ0IsT0FBT2hCO1FBQ1BpQixTQUFTakI7UUFDVGtCLFNBQVM7WUFBRW5CLE1BQU1DO1lBQVFXLFNBQVM7UUFBUTtJQUM1QztBQUNGLEdBQ0E7SUFDRVEsWUFBWTtBQUNkO0FBR0YsaUNBQWlDO0FBQ2pDLGtDQUFrQztBQUVsQyxpRUFBZXhCLHdEQUFlLENBQUMwQixJQUFJLElBQUkxQixxREFBYyxDQUFDLFFBQVFDLFdBQVdBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91bS1lbnRyZXByaXNlLy4vbGliL21vZGVscy9Vc2VyLmpzPzNjNzQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IFVzZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gIHtcclxuICAgIG5hbWU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdQbGVhc2UgcHJvdmlkZSBhIG5hbWUnXSxcclxuICAgICAgdHJpbTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBlbWFpbDoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ1BsZWFzZSBwcm92aWRlIGFuIGVtYWlsJ10sXHJcbiAgICAgIHVuaXF1ZTogdHJ1ZSxcclxuICAgICAgbG93ZXJjYXNlOiB0cnVlLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIHBhc3N3b3JkOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgcmVxdWlyZWQ6IFt0cnVlLCAnUGxlYXNlIHByb3ZpZGUgYSBwYXNzd29yZCddLFxyXG4gICAgICBtaW5sZW5ndGg6IDYsXHJcbiAgICAgIHNlbGVjdDogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgcm9sZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsndXNlcicsICdhZG1pbiddLFxyXG4gICAgICBkZWZhdWx0OiAndXNlcicsXHJcbiAgICB9LFxyXG4gICAgcGhvbmU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGFkZHJlc3M6IHtcclxuICAgICAgc3RyZWV0OiBTdHJpbmcsXHJcbiAgICAgIGNpdHk6IFN0cmluZyxcclxuICAgICAgc3RhdGU6IFN0cmluZyxcclxuICAgICAgcGluY29kZTogU3RyaW5nLFxyXG4gICAgICBjb3VudHJ5OiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJ0luZGlhJyB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHtcclxuICAgIHRpbWVzdGFtcHM6IHRydWUsXHJcbiAgfVxyXG4pO1xyXG5cclxuLy8gUkVNT1ZFIFRISVMgTElORSBpZiBpdCBleGlzdHM6XHJcbi8vIFVzZXJTY2hlbWEuaW5kZXgoeyBlbWFpbDogMSB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5Vc2VyIHx8IG1vbmdvb3NlLm1vZGVsKCdVc2VyJywgVXNlclNjaGVtYSk7XHJcbiJdLCJuYW1lcyI6WyJtb25nb29zZSIsIlVzZXJTY2hlbWEiLCJTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwidHJpbSIsImVtYWlsIiwidW5pcXVlIiwibG93ZXJjYXNlIiwicGFzc3dvcmQiLCJtaW5sZW5ndGgiLCJzZWxlY3QiLCJyb2xlIiwiZW51bSIsImRlZmF1bHQiLCJwaG9uZSIsImFkZHJlc3MiLCJzdHJlZXQiLCJjaXR5Iiwic3RhdGUiLCJwaW5jb2RlIiwiY291bnRyeSIsInRpbWVzdGFtcHMiLCJtb2RlbHMiLCJVc2VyIiwibW9kZWwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/models/User.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/jws","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/safe-buffer","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fme%2Froute&page=%2Fapi%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fme%2Froute.js&appDir=C%3A%5CUsers%5CIsmaeel%20Shaikh%5CDownloads%5Cum-entreprise%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CIsmaeel%20Shaikh%5CDownloads%5Cum-entreprise&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();