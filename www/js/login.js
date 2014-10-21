var login = {};

login.componentes = function(){
    login.serverAddress = $('#txtServerAddress');
    login.serverPort = $('#txtServerPort');
    login.btnLogin = $('#btnLogin');
    login.btnCancel = $('#btnCancel');
    login.warning = $('#warning');
    login.email = $('#txtEmail');
    login.password = $('#txtPassword');
};

login.init = function(){
    login.componentes();
    sgdb.selectConfig();
    login.btnLogin.attr('disabled', 'disabled');
    login.btnLogin.on('click', function() {
        if(login.email.val() !== '' && login.password.val() !== '') {
            login.doLogin();
        } else {
            intel.xdk.notification.alert('Fill the fields email and password', 'Atention', 'OK');
        }
    });
};

login.doLogin = function(){
    var user = 'email=' + login.email.val() + '&password=' + calcSHA1(login.password.val());
    intel.xdk.device.getRemoteData(login.serverAddress.val() + "/users/login", "POST", user, "successLogin", "errorLogin");
};

function successLogin(data) {
    var result = $.parseJSON(data);
    if(result.success) {
        login.btnLogin.attr('onclick', "window.location.href='home.html'");
        login.btnLogin.trigger('click');
    } else {
        login.warning.removeClass('alert alert-warning');
        login.warning.addClass('alert alert-danger');
        login.warning.html('Please, verify your email and password.');
    }
};

function errorLogin(data) {
    intel.xdk.notification.alert('Error on login', 'Error', 'OK');
};

login.verifyConfig = function() {
    if(login.serverAddress.val() === "" && login.serverPort.val() === "") {
        login.btnLogin.attr('disabled', 'disabled');
        login.warning.html("Please, you need configure the server address.");
    } else {
        login.warning.removeClass('alert alert-warning');
        login.btnLogin.removeAttr('disabled');
        login.warning.html('');
    }
};

$( document ).ready(function() {

    if(sgdb.getopenDb()) {
        sgdb.db = sgdb.createTable();
    } else {
        intel.xdk.notification.alert('No database connection', 'Warning', 'OK');
    }
    
    login.init();
    
    setTimeout(function() {
        login.verifyConfig();    
    }, 500);
});