var signin = {};

signin.componentes = function() {
    signin.serverAddress = $('#txtServerAddress');
    signin.serverPort = $('#txtServerPort');
    signin.warning = $('#warning');
    signin.btnSave = $('#btnSave');
    signin.btnCancel = $('#btnCancel');
    
    signin.name = $('#txtName');
    signin.email = $('#txtEmail');
    signin.password = $('#txtPassword');
    signin.confirm = $('#txtConfirm');
    signin.emailCheck = $("#emailCheck");
    
    signin.emailAvailable = false;
    signin.passwordValid = false;
    signin.nameValid = false;
    
    signin.emailWidth = signin.email.width();
};

signin.init = function(){
    signin.componentes();
    sgdb.selectConfig();
    signin.name.on('focusout', signin.verifyName);
    signin.email.on('focusout', signin.verifyEmail);
    signin.confirm.on('focusout', signin.verifyPassword);
    signin.btnSave.on('click', signin.save);
    signin.btnCancel.on('click', signin.cancel);
};

signin.verifyName = function() {
    if(signin.name.val().length < 4) {
        intel.xdk.notification.alert('The name need at least 4 characters.', 'Warning', 'OK');
    } else {
        signin.nameValid = true;
    }
}

signin.verifyPassword = function(){
    if(signin.password.val() === signin.confirm.val()) {
        //var pattern = new RegExp('^[a-zA-Z]\w{3,14}$');
        var pattern = /^(?=.*\d).{4,8}$/;
        signin.passwordValid = pattern.test(signin.password.val());
        if(!signin.passwordValid) {
            intel.xdk.notification.alert('The password need at least 4 alfanumeric characters, mix numbers and letters', 'Warning', 'OK');
        }
    } else {
        intel.xdk.notification.alert('The password not match', 'Warning', 'OK');
    }
}

signin.verifyEmail = function(){
    
    signin.clearEmail();

    if(signin.email.val() === "") {
        return false;
    }
    
    intel.xdk.device.getRemoteData(signin.serverAddress.val() + "/users/email?email=" + signin.email.val(), "POST", "", "success_handler", "error_handler");
    
    //POST method example
    //AppMobi.device.getRemoteData("http://twitter.com/statuses/public_timeline.xml","POST","E-MAIL=html5tools@intel.com&TEST=1&MAX=0","success_handler","error_handler");

};

signin.save = function() {
    
    if(signin.emailAvailable && signin.passwordValid && signin.nameValid) {
        signin.warning.html("Please wait. Saving...");
        var user = 'username=' + signin.name.val() + '&email=' + signin.email.val() + '&password=' + calcSHA1(signin.password.val());
        
        intel.xdk.device.getRemoteData(signin.serverAddress.val() + "/users/adduser", "POST", user, "success_add", "error_add");
    }
}

function success_add(data) {
    var result = $.parseJSON(data);
    signin.warning.removeClass('alert alert-warning');
    signin.warning.addClass('alert alert-success');
    signin.warning.html('Success on save!');
    setTimeout(function(){signin.btnCancel.trigger('click')}, 800);
};

function error_add(data) {
    intel.xdk.notification.alert('Error on saving user!','Error', 'OK');
};

signin.verifyConfig = function() {
    if(signin.serverAddress.val() === "" && signin.serverPort.val() === "") {
        signin.btnSave.attr('disabled', 'disabled');
        signin.warning.html("Please, you need configure the server address.");
    } else {
        signin.btnSave.removeAttr('disabled');
        signin.warning.html("");
    }
};

function success_handler (data) {
    var result = $.parseJSON(data);
    //intel.xdk.notification.alert('Verificando email: ' + result, 'Alert', 'OK');
    signin.emailIsAvailable(result.available);
}

function error_handler(data) {
    intel.xdk.notification.alert('Error on verify email avaliability!','Error', 'OK');
}

signin.emailIsAvailable = function(available) {
    signin.emailAvailable = available;
    
    if(signin.emailAvailable) {
        signin.emailCheck.addClass('glyphicon glyphicon-ok-circle');
        signin.emailCheck.html('');
        signin.email.width(signin.emailWidth - signin.emailCheck.width());
    } else {
        signin.emailCheck.addClass('label label-danger glyphicon glyphicon-exclamation-sign')
        signin.emailCheck.html('Email not available');
        signin.email.addClass('alert alert-danger');
        signin.email.width(signin.emailWidth);
    }
};

signin.clearEmail = function() {
    signin.email.removeClass('alert alert-danger');
    signin.emailCheck.removeClass('label label-danger glyphicon glyphicon-exclamation-sign glyphicon glyphicon-ok-circle');
    signin.emailCheck.html('');
    signin.email.width(signin.emailWidth);
};

$( document ).ready(function() {

    if(sgdb.getopenDb()) {
        sgdb.db = sgdb.createTable();
    } else {
        alert('No database connection');
    }
    
    signin.init();
    
    setTimeout(function() {
        signin.verifyConfig();    
    }, 500);
});