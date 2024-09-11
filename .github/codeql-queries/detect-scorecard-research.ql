/**
 * @name Detect Scorecard Research Tracker
 * @description Identifies the inclusion of Scorecard Research tracking code (`sb.scorecardresearch.com`) in JavaScript files.
 * @kind path-problem
 * @id js/scorecard-research-tracker
 * @tags tracking
 */

import javascript

/**
 * Predicate to detect if a script includes Scorecard Research tracker (`sb.scorecardresearch.com`).
 */
predicate isScorecardResearchTracker(Script s) {
  exists (string url |
    s.getAStringLiteral().getValue() = url and
    url.matches("https://sb.scorecardresearch.com")
  )
}

/**
 * Predicate to detect the usage of the `c2` parameter, which is often associated with Scorecard Research.
 */
predicate hasScorecardResearchParameter(Element e) {
  exists (Attribute a |
    a.getName() = "c2" and
    a.getValue().toString().matches("[0-9]{7}")
  )
}

from Script s, Element e
where isScorecardResearchTracker(s) or hasScorecardResearchParameter(e)
select s, "This file includes Scorecard Research (`sb.scorecardresearch.com`) tracking script or uses the 'c2' parameter."
