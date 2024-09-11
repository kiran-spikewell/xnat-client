/**
 * @name Detect Hotjar Tracker URLs
 * @description Identifies JavaScript strings that match the Hotjar tracker URL pattern and initialization code.
 * @kind path-problem
 * @id js/detect-hotjar-tracker
 * @tags data, tracking, JavaScript
 */

import javascript

/**
 * Predicate to check if a given string is a Hotjar tracker URL.
 */
predicate isHotjarTrackerUrl(string url) {
  url.matches("https://static.hotjar.com/c/hotjar-[0-9]+.js")
}

from Literal urlString
where urlString.getValue() = result and
      (urlString.getValue().matches("hotjar") or
       urlString.getValue().matches("hj") or
       urlString.getValue().matches("hj('init')") or
       isHotjarTrackerUrl(urlString.getValue()))
select urlString, "This string contains a Hotjar tracker URL or initialization code."
