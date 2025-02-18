sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'caterer',
            componentId: 'x_CaterersList',
            contextPath: '/x_Caterers'
        },
        CustomPageDefinitions
    );
});