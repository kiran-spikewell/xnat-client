/**
 * @name Detect Cloudflare Web Analytics Tracker
 * @description Identifies the inclusion of Cloudflare Web Analytics tracking code (`beacon.min.js`) in JavaScript files.
 * @kind path-problem
 * @id js/cloudflare-web-analytics-tracker
 * @tags tracking
 */

import javascript

/**
 * Predicate to detect if a script includes Cloudflare Web Analytics (`beacon.min.js`).
 */
predicate isCloudflareWebAnalytics(Script s) {
  exists (string url |
    s.getAStringLiteral().getValue() = url and
    url.matches("https://static.cloudflareinsights.com/beacon.min.js")
  )
}

/**
 * Predicate to detect the presence of a `data-cf-beacon` attribute, which is a part of Cloudflare Web Analytics.
 */
predicate hasCfBeaconAttribute(Element e) {
  exists (Attribute a |
    a.getName() = "data-cf-beacon" and
    a.getValue().toString().matches("\\{\"token\":\\s*\"[a-fA-F0-9]{32}\"\\}")
  )
}

from Script s, Element e
where isCloudflareWebAnalytics(s) or hasCfBeaconAttribute(e)
select s, "This file includes Cloudflare Web Analytics (`beacon.min.js`) script or uses the 'data-cf-beacon' attribute."
