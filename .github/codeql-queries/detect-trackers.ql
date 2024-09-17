import javascript

from FunctionCall call, StringLiteral url
where
  url.getValue() = "https://www.google-analytics.com/analytics.js" or
  url.getValue() = "https://connect.facebook.net/en_US/fbevents.js" or
  url.getValue().regexpMatch(".*track.*") or
  url.getValue().regexpMatch(".*analytics.*")
select url, "Tracker or tracking-related URL detected: " + url.getValue()
