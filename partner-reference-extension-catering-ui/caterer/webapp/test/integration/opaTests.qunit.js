sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'caterer/test/integration/FirstJourney',
		'caterer/test/integration/pages/x_CaterersList',
		'caterer/test/integration/pages/x_CaterersObjectPage'
    ],
    function(JourneyRunner, opaJourney, x_CaterersList, x_CaterersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start test/flpSandbox.html?sap-ui-xx-viewCache=false#caterer-tile in web folder
            launchUrl: sap.ui.require.toUrl('caterer') + '/test/flpSandbox.html?sap-ui-xx-viewCache=false#caterer-tile'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThex_CaterersList: x_CaterersList,
					onThex_CaterersObjectPage: x_CaterersObjectPage
                }
            },
            opaJourney.run
        );
    }
);