sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/f/library",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast"
        
    ],
    function(Controller, JSONModel, library,  Filter, FilterOperator, MessageToast) {
      "use strict";
  
      return Controller.extend("odata.controller.View1", {
        onInit: function () {
          var oData = {
            oTableData : [],
            mTableData : [],
            sSearchPlant : null,
            sSearchRoomid  : null,
            sSearchFloor : null,
            sSearchRoomtp : null,
            vPlant  : null, //   지점
            vFloor  : null, //   층
            vRoomid : null, // room id
            vRoomno : null, // 방 호수
            vCondx  : null  // 방 상태 
            
          }

          var oDataModel = new JSONModel(oData);
          this.getView().setModel(oDataModel, "Main");

        },

      
        onBeforeRendering: function() { //데이터를 갖고오는 곳
          var oModel = this.getView().getModel();
          var oViewModel = this.getView().getModel("Main")

          oModel.read("/RoomHouseKeeperSet" , {
            success: function(oModelData){
              var data = oModelData; 
              var aData = data.results;
              var oData = [];

              oData.push(aData);
              oViewModel.setProperty("/oTableData", aData);

            }
          })
          var oModel2 = this.getView().getModel();
          var oViewModel2 = this.getView().getModel("all")

          oModel2.read("/RoomMaterialSet" , {
            success: function(oModelData){
              var data = oModelData; 
              var aData = data.results;
              var tpData = []; // roomtp 필터

              tpData.push(aData);
              oViewModel2.setProperty("/mTableData", aData);

            }
          })


        },

        onSearch: function() {


        },

        onFilterChange: function () {
          this.onSearch();
        },

        onPressSave: function(oEvent) {
          var oViewModel = this.getView().getModel('app');

           var vPlant = oViewModel.oData.detail.Plant;
           var vFloor = oViewModel.oData.detail.Floor;
           var vRoomid = oViewModel.oData.detail.Roomid;
           var vRoomno = oViewModel.oData.detail.Roomno;
           var vCondx = oViewModel.oData.detail.Condx;

           var oDataModel = this.getView().getModel(); //??

           var oData = { Plant : vPlant,
                         Floor : vFloor,
                         Roomid : vRoomid,
                         Roomno : vRoomno,
                         Condx : vCondx };

           var sPath = "/RoomHouseKeeperSet(Plant='"+ vPlant + "',Roomid='"+vRoomid+"')"
  
           oDataModel.update(sPath,oData, {
             success : function () {
              MessageToast.show("변경 되었습니다.");
             }
           })

        },

        onListItemPress: function(oEvent) {
          var oFCL = this.getView()
                         .getParent()
                         .getParent();

          var oControl = oEvent.getSource(), // oEvent가 발생된 주체 Control // row
              oBindingContext = oControl.getBindingContext('Main'), // row에 바인딩되어있는 정보
              sPath = oBindingContext.getPath() // row에 바인딩되어있는 정보중에 Path /table/0/Pernr

          var oRow = this.getView()
                          .getModel('Main')
                          .getProperty(sPath);

          this.getView().getModel('app').setProperty('/detail', oRow);

          var oViewModel = this.getView().getModel("app");
          var sSearchRoomtp = oViewModel.oData.detail.Roomtp //룸타입
          
          var oTable = this.getView().byId("RoomTable"); 
          var oBinding = oTable.getBinding("items"); 
          
          // All Model을 가져온다.
          var oAllModel = this.getView().getModel('all');
          // All Model 안에 mTableData라는 속성을 가져온다.
          // mTable은 위 onBeforeRendering에서 세팅한 데이터를 가지고 있다.
          var oMTableData = oAllModel.getProperty('/mTableData');

          // mTable에 들어있던 데이터를 가진 변수 oMTableData는 Array (배열)이다.
          // 배열의 내장메소드 filter 를 사용해서 반복문을 돌린다.
          // filter로 item.Roomtp 와 sSearchRoomtp가 같은 object들을 [ {} ] 문으로 추출한다.
          var aFilterData = oMTableData.filter(function(item) {
            return item.Roomtp === sSearchRoomtp;
          });

          // 추출된 데이터를 filterMTable이라는 속성에 데이터를 저장한다.
          oAllModel.setProperty('/filterMTable', aFilterData);
  

          oFCL.setLayout(library.LayoutType.TwoColumnsBeginExpanded);
        },

        
      });
    }
  );
  