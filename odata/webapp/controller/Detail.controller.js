sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
    
  ],
  function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("odata.controller.Detail", {
      onInit: function () {

      },

      onParentClicked: function (oEvent) {
        var bSelected = oEvent.getParameter("selected");
        this.oModel.setData({ child1: bSelected });
      }
      
    });
  }
);
