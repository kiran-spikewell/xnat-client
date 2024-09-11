/**
 * @name Detect Facebook Pixel Tracker
 * @description Identifies the inclusion of Facebook Pixel tracking code (`fbq` function) in JavaScript files.
 * @kind path-problem
 * @id js/facebook-pixel-tracker
 * @tags tracking
 */

import javascript

/**
 * Predicate to detect if a script includes Facebook Pixel (`fbevents.js`).
 */
predicate isFacebookPixel(Script s) {
  exists (string url |
    s.getAStringLiteral().getValue() = url and
    url.matches("https://connect.facebook.net/.*/fbevents.js")
  )
}

/**
 * Predicate to detect usage of the `fbq` function in JavaScript.
 */
predicate isFbqFunctionCall(CallExpr call) {
  call.getCallee().(RefersTo).getAnIdentifier().getName() = "fbq"
}

from Script s, CallExpr call
where isFacebookPixel(s) or isFbqFunctionCall(call)
select s, "This file includes Facebook Pixel (`fbevents.js`) or uses the 'fbq' function."
