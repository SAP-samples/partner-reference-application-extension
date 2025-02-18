sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'caterer',
            componentId: 'x_CaterersObjectPage',
            contextPath: '/x_Caterers'
        },
        CustomPageDefinitions
    );
});