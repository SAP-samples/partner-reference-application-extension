using { PoetrySlamService } from '../srv/catererManagerService';

annotate PoetrySlamService.x_Caterers @odata.draft.enabled @cds.odata.valuelist; 

annotate PoetrySlamService.x_Caterers {
 ID @UI.Hidden;
}

annotate PoetrySlamService.PoetrySlams:x_caterer with @(
     Common : { 
      Text : x_caterer.name,
      ValueListWithFixedValues : false,
      TextArrangement : #TextOnly,
      ValueList: {
        Label: '{i18n>caterer}',
        CollectionPath: 'x_Caterers',
        Parameters: [
          { $Type: 'Common.ValueListParameterInOut',
            ValueListProperty: 'ID',
            LocalDataProperty: x_caterer_ID
          },
          { $Type: 'Common.ValueListParameterDisplayOnly',
            ValueListProperty: 'name'
          },
           {
            $Type:'Common.ValueListParameterDisplayOnly',
            ValueListProperty : 'cuisine_code', 
            @title: '{i18n>cuisine}'
          },
          { $Type: 'Common.ValueListParameterDisplayOnly',
            ValueListProperty: 'contactPerson'

          } 

      ],
      }
     }
);

annotate PoetrySlamService.PoetrySlams with @(
  UI : {
    Facets                        : [
      ... up to {ID    : 'GeneralData'},
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'CatererData',
        Label : '{i18n>caterer}',
        Target: '@UI.FieldGroup#Caterer'
      },
      ...
    ],
    FieldGroup #Caterer : {
      Data : [
        {$Type : 'UI.DataField',
        Value : x_caterer_ID,
        Label : '{i18n>name}',
        },
        {$Type : 'UI.DataField',
        Value : x_caterer.cuisine.name,
        Label : '{i18n>Cuisine}',
        ![@Common.FieldControl] : #ReadOnly,
        ![@UI.Hidden]: {$edmJson: {$If: [
            {$Ne: [
              {$Path: 'x_caterer_ID'},
              {$Null: true }
            ]},
            false,
            true
        ]}},
        },
        {$Type : 'UI.DataField',
        Value : x_caterer.contactPerson,
        Label : '{i18n>contactPerson}',
        ![@Common.FieldControl] : #ReadOnly,
        ![@UI.Hidden]: {$edmJson: {$If: [
            {$Ne: [
              {$Path: 'x_caterer_ID'},
              {$Null: true}
            ]},
            false,
            true
        ]}},
        },
        {$Type : 'UI.DataField',
        Value : x_caterer.phone,
        Label : '{i18n>phone}',
        ![@Common.FieldControl] : #ReadOnly,
        ![@UI.Hidden]: {$edmJson: {$If: [
            {$Ne: [
              {$Path: 'x_caterer_ID'},
              {$Null: true}
            ]},
            false,
            true
        ]}},
        },
        {$Type : 'UI.DataField',
        Value : x_caterer.email,
        Label : '{i18n>email}',
        ![@Common.FieldControl] : #ReadOnly,
        ![@UI.Hidden]: {$edmJson: {$If: [
            {$Ne: [
              {$Path: 'x_caterer_ID'},
              {$Null: true}
            ]},
            false,
            true
        ]}},
        },
      ]
    },
  }
);