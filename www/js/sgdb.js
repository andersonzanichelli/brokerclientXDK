var sgdb = {};

sgdb.db = false;

sgdb.getopenDb = function() {
    try {
        if (window.openDatabase) {                    
            return window.openDatabase;                    
        } else {
            alert('No HTML5 support');
            return undefined;
        }
    }
    catch (e) {
        alert(e);
        return undefined;
    }            
};

sgdb.createTable = function() {
    var openDB = sgdb.getopenDb();
    if(!openDB) {
        return;
    } else {
        sgdb.db = openDB('database', '1.0', 'mydb', 2*1024*1024);
        sgdb.db.transaction(function (t) {
            t.executeSql('CREATE TABLE IF NOT EXISTS config('
                         + '  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
                         + ', serverAddress TEXT NOT NULL'
                         + ', serverPort INT NOT NULL);', [], null, null);
        });
        
        return sgdb.db;
    }            
};

sgdb.save = function(params){
    if(params.id === "0") {
        sgdb.insertConfig(params);
    } else {
        sgdb.updateConfig(params);
    }
}

sgdb.insertConfig = function(params) {
    if(!sgdb.db) {                
        return;                
    }
    
    var serverAddress = params.serverAddress;
    var serverPort = params.serverPort;

    sgdb.db.transaction(function (t) { 
        t.executeSql("INSERT INTO config('serverAddress','serverPort') values('" + serverAddress + "','" + serverPort + "')", [], null, null);
    });
}

sgdb.updateConfig = function(params) {
    if(!sgdb.db) {                
        return;                
    }
    
    var id = params.id;
    var serverAddress = params.serverAddress;
    var serverPort = params.serverPort;

    sgdb.db.transaction(function (t) { 
        t.executeSql("UPDATE config set serverAddress = '" + serverAddress + "' ,serverPort = " + serverPort + " WHERE id = " + id, [], null, null);
    });
}

sgdb.selectConfig = function() {
    var q = "select * from config";

    sgdb.db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
            for (var i = 0; i < data.rows.length; i++) {
                $('#idConfig').val(data.rows.item(i).id);
                $('#txtServerAddress').val(data.rows.item(i).serverAddress);
                $('#txtServerPort').val(data.rows.item(i).serverPort);
            }
        });
    });
}
