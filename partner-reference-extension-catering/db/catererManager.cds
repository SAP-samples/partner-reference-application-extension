namespace  x_sap.samples.poetryslams.catering;
using {sap.samples.poetryslams.PoetrySlams, cuid, managed,sap } from 'partner-reference-application';

entity x_CuisineTypeCodes: sap.common.CodeList {
  key code : String(25) default '1' @title : '{i18n>cuisineType}'
}

entity x_Caterers : cuid,managed {
  name               : String(255) @mandatory @title : '{i18n>name}'; 
  contactPerson      : String(255) @title : '{i18n>contactPerson}';
  phone              : String(30) @title : '{i18n>phone}';
  email              : String @assert.format: '^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$' @title : '{i18n>email}';
  cuisine            : Association to one x_CuisineTypeCodes;
  maxServiceCapacity : Integer @title : '{i18n>maxServiceCapacity}';
}

// x_ is based on the configuration maintained in the base app. https://cap.cloud.sap/docs/guides/multitenancy/mtxs#extensibility-config
extend PoetrySlams with {
  x_caterer : Association to one x_Caterers @title: '{i18n>caterer}';
}

annotate x_Caterers with {
  cuisine @Common : { 
    Label : '{i18n>cuisine}',
    Text : {
      $value : cuisine.name,
      ![@UI.TextArrangement]: #TextOnly,
    },
   }
} ;
