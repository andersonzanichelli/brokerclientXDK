var home = {};

home.componentes = function(){
    home.serverAddress = $('#txtServerAddress');
    home.serverPort = $('#txtServerPort');
    home.divServices = $('#services');
    home.lista = $('#lista');
    
    home.btnServices = $('#btnServices');
    home.btnUser = $('#btnUser');
    home.btnPreferences = $('#btnPreferences');
    
    home.preenchido = false;
};

home.init = function() {
    home.componentes();
    sgdb.selectConfig();
    
    home.btnServices.on('click', home.showServices);
    home.btnUser.on('click', home.showUser);
    home.btnPreferences.on('click', home.showPreferences);
};

home.showServices = function() {
    if(!home.preenchido) {
        home.findServices();
    }
    
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
    
    $.each(result, function(idx, key){
        var a = $('<a class="list-group-item allow-badge widget uib_w_7" data-uib="twitter%20bootstrap/list_item" data-ver="0">');
        var h = $('<h4 class="list-group-item-heading">');
        a.attr('id', key._id);
        a.on('click', home.useservice);
        h.html(key.service);
        a.append(h);
        home.lista.append(a);
    });
    
    home.preenchido = true;
};

function errorServicesList(data) {
    intel.xdk.notification.alert('Error on find services!','Error', 'OK');
};

home.useservice = function() {
    $('#teste').html(this.id);
}

$( document ).ready(function() {
    if(sgdb.getopenDb()) {
        sgdb.db = sgdb.createTable();
    } else {
        intel.xdk.notification.alert('No database connection', 'Warning', 'OK');
    }
    
    home.init();
});