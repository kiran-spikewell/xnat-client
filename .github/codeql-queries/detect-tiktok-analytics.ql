/**
 * @name Detect TikTok-Compliant Adjust Callback Strings
 * @description Identifies URLs that match the Adjust callback string format for TikTok impression-based activities.
 * @kind path-problem
 * @id js/detect-adjust-tiktok-callback
 * @tags data, tracking, JavaScript
 */

import javascript

/**
 * Predicate to check if a given string is a TikTok-compliant Adjust callback URL.
 */
predicate isTikTokCompliantAdjustCallback(string url) {
  url.matches("https://mydatawarehouse.com/adjust/info\\?tracker=(tt_inst|ts_inst)&tracker_name=TikTok%20SAN&network_name=TikTok%20SAN*")
}

from Literal urlString
where urlString.getValue() = result and isTikTokCompliantAdjustCallback(urlString.getValue())
select urlString, "This string contains a TikTok-compliant Adjust callback URL."
