define(
  'ephox.alloy.api.ui.TabSection',

  [
    'ephox.alloy.api.behaviour.Replacing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.ui.CompositeBuilder',
    'ephox.alloy.api.ui.Tabbar',
    'ephox.alloy.api.ui.Tabview',
    'ephox.alloy.parts.PartType',
    'ephox.alloy.ui.composite.TabSectionSpec',
    'ephox.boulder.api.FieldSchema',
    'ephox.compass.Arr',
    'ephox.peanut.Fun'
  ],

  function (Replacing, Representing, CompositeBuilder, Tabbar, Tabview, PartType, TabSectionSpec, FieldSchema, Arr, Fun) {
    var schema = [
      FieldSchema.defaulted('selectFirst', true),
      FieldSchema.defaulted('tabs', [ ])
    ];

    var barPart = PartType.internal(
      Tabbar,
      'tabbar',
      '<alloy.tab-section.tabbar>',
      function (detail) {
        return {
          onExecute: function (tabbar, button) {
            var tabValue = Representing.getValue(button);
            button.getSystem().getByUid(detail.partUids().tabview).each(function (tabview) {
              console.log('tabValue', tabValue, 'tabview', tabview);

              var tabData = Arr.find(detail.tabs(), function (t) {
                return t.value === tabValue;
              });

              console.log('tabData', tabData);
              var panel = tabData.view();
              Replacing.set(tabview, panel);
              // Transitioning.transition(viewer, tabValue);
            });
          },
          selectFirst: detail.selectFirst(),
          tabs: detail.tabs()
        };
      },
      Fun.constant({ })
    );

    var viewPart = PartType.internal(
      Tabview,
      'tabview',
      '<alloy.tab-section.tabview>',
      Fun.constant({ }),
      Fun.constant({ })
    );


    var partTypes = [
      barPart,
      viewPart
    ];

    var build = function (f) {
      return CompositeBuilder.build('tab-section', schema, partTypes, TabSectionSpec.make, f);
    };

    var parts = PartType.generate('tab-section', partTypes);

    return {
      build: build,
      parts: Fun.constant(parts)
    };
  }
);

/*
'<alloy.tabbar>': UiSubstitutes.single(true,  
          Merger.deepMerge(
            detail.parts().tabbar(),
            detail.parts().tabbar().base,
            {
              uid: detail.partUids().tabbar,
              uiType: 'tabbar',
              onExecute: function (tabbar, button) {
                var tabValue = Representing.getValue(button);
                button.getSystem().getByUid(detail.partUids().tabview).each(function (viewer) {
                  Transitioning.transition(viewer, tabValue);
                });
              },
              selectFirst: detail.selectFirst(),
              tabs: detail.tabs()
            }
          )
        ),
        '<alloy.tabview>': UiSubstitutes.single(true,  
          Merger.deepMerge(
            detail.parts().tabview(),
            detail.parts().tabview().base,
            {
              uid: detail.partUids().tabview,
              uiType: 'container',
              transitioning: {
                views: views,
                base: detail.defaultView()
              }
            }
          )
        )
        */