<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="http://localhost:4502/xxxx/etc.clientlibs/dam/clientlibs/sitecatalyst/appmeasurement.js"></script>
    <script type="text/javascript" src="http://localhost:4502/xxxx/etc.clientlibs/dam/clientlibs/assetinsights/pagetracker.js"></script>
    <script type="text/javascript">
      // Initialize assetAnalytics object and configure settings
      var assetAnalytics = window.assetAnalytics || {};

      // Configure Adobe Analytics asset tracking
      (function() {
        assetAnalytics.attrTrackable = 'trackable'; // Attribute used to mark trackable assets
        assetAnalytics.defaultTrackable = false; // Default tracking state for assets
        assetAnalytics.attrAssetID = 'aem-asset-id'; // Attribute used to assign unique IDs to assets
        assetAnalytics.assetImpressionPollInterval = 200; // Time interval for polling asset impressions (in milliseconds)
        assetAnalytics.charsLimitForGET = 2000; // Maximum size of the GET request payload (in bytes)

        // Initialize the asset dispatcher for Adobe Analytics tracking
        assetAnalytics.dispatcher = {
          init: function(env, rsid, trackServer, listVar, eVar3, eventImpression, eventClick) {
            console.log("Initializing asset tracking with Adobe Analytics...");
            // Example initialization logic for Adobe Analytics
            // Replace this with actual Adobe Analytics integration settings
          }
        };

        assetAnalytics.dispatcher.init(
          "assetstesting", // Environment or test mode
          "xxxx",          // Report Suite ID or similar identifier
          "xxx",           // Tracking server URL or identifier
          "list1",         // List variable for tracking
          "eVar3",         // Adobe Analytics variable
          "event8",        // Event for impressions
          "event7"         // Event for clicks
        );

        // Function to track asset loading
        assetAnalytics.core = {
          assetLoaded: function(element) {
            console.log("Asset loaded:", element.getAttribute('data-aem-asset-id'));
            // Logic to handle asset loaded events
            // Implement Adobe Analytics tracking call for impressions
          },

          assetClicked: function(element) {
            console.log("Asset clicked:", element.getAttribute('data-aem-asset-id'));
            // Logic to handle asset click events
            // Implement Adobe Analytics tracking call for clicks
            return false; // Prevent default action
          }
        };
      })();
    </script>
  </head>

  <body>
    <!-- Trackable assets (images) with associated click and load handlers -->
    <img
      src="https://10.41.52.147:4502/xxxx/content/dam/test/abc.jpg"
      data-aem-asset-id="aaid:a386f2cd78234becb66bd11575f9452d"
      data-trackable="true"
      onload="assetAnalytics.core.assetLoaded(this)">

    <a
      href="https://www.adobe.com"
      onclick="assetAnalytics.core.assetClicked(this); return false;">
      <img
        src="http://localhost/xxxx/content/dam/test/xyz.jpg"
        data-aem-asset-id="aaid:7fa01fce0ebe40268cd6dcf07e2d9cb1"
        data-trackable="true"
        onload="assetAnalytics.core.assetLoaded(this)">
    </a>
  </body>
</html>
