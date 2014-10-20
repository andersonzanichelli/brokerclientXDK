var config = {};

config.componentes = function(){
    config.id = $('#idConfig');
    config.serverAddress = $('#txtServerAddress');
    config.serverPort = $('#txtServerPort');
    config.btnOk = $('#btnOk');
    config.btnCancel = $('#btnCancel');
    config.saved = $('#saved');
};

config.init = function() {
    config.componentes();
    config.saved.html("");
    config.btnOk.on('click', config.saveData);
    config.btnCancel.on('click', config.cancel);
    sgdb.selectConfig();
};

config.saveData = function(){
    var params = {'id': config.id.val(),
                  'serverAddress': config.serverAddress.val(), 
                  'serverPort': config.serverPort.val()};
    
    if(params.serverAddress !== "" && params.serverPort !== "") {
        sgdb.save(params);
        sgdb.selectConfig();
        
        if(config.verifySave(params)) {
            config.saved.removeClass('alert alert-danger');
            config.saved.addClass('alert alert-success');
            config.saved.html("Configuration saved!");
            setTimeout(function(){config.btnCancel.trigger('click')}, 800);
        }
    } else {
        config.saved.addClass('alert alert-danger');
        config.saved.html("Not saved!");
    }
};

config.verifySave = function(params) {
    return params.serverAddress === config.serverAddress.val() && params.serverPort === config.serverPort.val();
};

$( document ).ready(function() {

    if(sgdb.getopenDb()) {
        sgdb.db = sgdb.createTable();
    } else {
        alert('No database connection');
    }
    
    config.init();
});