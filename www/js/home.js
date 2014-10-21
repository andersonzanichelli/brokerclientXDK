var home = {};

home.componentes = function(){
    home.serverAddress = $('#txtServerAddress');
    home.serverPort = $('#txtServerPort');
    home.divServices = $('#services');
    
    home.btnServices = $('#btnServices');
    home.btnUser = $('#btnUser');
    home.btnPreferences = $('#btnPreferences');
};

home.init = function() {
    home.componentes();
    sgdb.selectConfig();
    
    home.btnServices.on('click', home.showServices);
    home.btnUser.on('click', home.showUser);
    home.btnPreferences.on('click', home.showPreferences);
};

home.showServices = function() {
    home.findServices();
    if(! home.divServices.is(':visible')) {
        home.divServices.show();
    }
    //home.divUser.hide();
    //home.divPreferences.hide();
};

home.showUser = function() {
    home.divServices.hide();
    //home.divUser.show();
    //home.divPreferences.hide();
};

home.showPreferences = function() {
    home.divServices.hide();
    //home.divUser.hide();
    //home.divPreferences.show();
};

home.findServices = function() {
    intel.xdk.device.getRemoteData(home.serverAddress.val() + "/services/serviceslist", "POST", "", "successServicesList", "errorServicesList");
};

function successServicesList(data) {
    var result = $.parseJSON(data);
    intel.xdk.notification.alert(result,'Error', 'OK');
};

function errorServicesList(data) {
    intel.xdk.notification.alert('Error on find services!','Error', 'OK');
};

$( document ).ready(function() {
    if(sgdb.getopenDb()) {
        sgdb.db = sgdb.createTable();
    } else {
        intel.xdk.notification.alert('No database connection', 'Warning', 'OK');
    }
    
    home.init();
});