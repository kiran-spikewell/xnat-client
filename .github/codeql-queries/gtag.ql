/**
 * @name Detect Google Tag Manager (gtag.js)
 * @description Identifies the inclusion of Google Tag Manager (`gtag.js`) and usage of the `gtag` function in JavaScript files.
 * @kind path-problem
 * @id js/google-tag-manager
 * @tags tracking
 */

import javascript

/**
 * Predicate to detect if a script includes Google Tag Manager (`gtag.js`).
 */
predicate isGoogleTagManager(Script s) {
  exists (string url |
    s.getAStringLiteral().getValue() = url and
    url = "https://www.googletagmanager.com/gtag/js?id=" or
    url.matches("https://www.googletagmanager.com/gtag/js\\?id=.*")
  )
}

/**
 * Predicate to detect usage of the `gtag` function in JavaScript.
 */
predicate isGtagFunctionCall(CallExpr call) {
  call.getCallee().(RefersTo).getAnIdentifier().getName() = "gtag"
}

from Script s, CallExpr call
where isGoogleTagManager(s) or isGtagFunctionCall(call)
select s, "This file includes Google Tag Manager (gtag.js) or uses the 'gtag' function."
