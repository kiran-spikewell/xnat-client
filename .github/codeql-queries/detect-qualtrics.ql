

import semmle.code.r.DataFlow
import semmle.code.r.AST

predicate isQualtricsFunction(string functionName) {
  functionName = "all_surveys" or
  functionName = "fetch_survey" or
  functionName = "read_survey" or
  functionName = "qualtrics_api_credentials" or
  functionName = "survey_questions" or
  functionName = "extract_colmap" or
  functionName = "metadata"
}

from FunctionCall call
where isQualtricsFunction(call.getTarget().getName())
select call, "This file contains a call to the Qualtrics function '" + call.getTarget().getName() + "'."
