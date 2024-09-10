/**
 * @name Detect Adobe Analytics Web Trackers and IP Tracking
 * @description Finds references to Adobe Analytics scripts and potential IP tracking in JavaScript code.
 * @kind path-problem
 * @id js/detect-adobe-analytics-ip-tracking
 */

import javascript

// Matches script inclusion using common Adobe Analytics file names
class AdobeAnalyticsScriptInclusion extends Import {
  AdobeAnalyticsScriptInclusion() {
    this.getSource().regexpMatch(".*(appmeasurement|s_code|pagetracker)\\.js$")
  }
}

// Matches function calls commonly used in Adobe Analytics
class AdobeAnalyticsFunctionCall extends CallExpression {
  AdobeAnalyticsFunctionCall() {
    exists(string fnName |
      this.getCallee().getQualifiedName() = fnName and
      fnName.regexpMatch("^(s\\.|assetAnalytics\\.|s_t\\.|s_code\\.|assetImpression|assetClick|dispatcher\\.)")
    )
  }
}

// Matches common methods used for IP tracking
class IPTrackingCode extends CallExpression {
  IPTrackingCode() {
    // Look for common patterns used to track IP addresses
    this.getCallee().getQualifiedName().regexpMatch("^(fetch|XMLHttpRequest|getClientIP|geoip|jQuery\\.get|jQuery\\.ajax|axios\\.get)$") or
    this.getArgument(0).regexpMatch(".*\\b(ip|client_ip|user_ip|geoip)\\b.*") or
    this.getCallee().getName().regexpMatch(".*(trackIp|getIp|logIp|ipCapture).*")
  }
}

// Query to find the inclusion of Adobe Analytics scripts
from AdobeAnalyticsScriptInclusion scriptInclusion
select scriptInclusion, "Possible Adobe Analytics script inclusion detected."

// Query to find calls to Adobe Analytics functions
from AdobeAnalyticsFunctionCall fnCall
select fnCall, "Adobe Analytics function call detected."

// Query to find potential IP tracking code
from IPTrackingCode ipTrackingCall
select ipTrackingCall, "Potential IP tracking code detected."