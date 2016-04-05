/**
 * Created by Lucas on 10/03/2016.
 */
$(document).ready(function() {

    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});

function onDeviceReady() {
    $('.acao-abrir').on('click',function() {
        console.log("Cliquei no botao");
        //Instanciar o objeto FileDownloader e setar os parametros
        var f = new FileDownloader(function(m) {console.log(m);},true,false);
        var array = ["http://www.fab.mil.br/cabine/concursos/IE_EA_EAOEAR_2017.pdf","http://www.fab.mil.br/cabine/concursos/01_IE_EA_CFOINF_2017.pdf","http://www.fab.mil.br/cabine/concursos/01_IE_EA_CFOINT_2017.pdf"];
        //Passar o array para fazer os downloads
        f.downloadPdfArray(array)
        //f.startDownload();
    });
};

function FileDownloader(successCallback,openFileAfterDownload, forceOverwrite) {
    var successCallback = successCallback;
    var openFileAfterDownload = openFileAfterDownload || false;
    var forceOverwrite = forceOverwrite || false;

    var fileTransfer = new FileTransfer();
    console.log("start download Array");
    this.downloadPdfArray = function (URLArray) {

        if(URLArray.length == 0 ) {
            return;
        }
        var url = URLArray.shift();
        this.startDownload(url);
        this.downloadPdfArray(URLArray);
    };

    this.startDownload = function(url) {
        var uri = encodeURI(url);
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(directoryEntry) {
            checkDir(directoryEntry,uri);
        }, function() {console.log("fail resolve");});
    };

    var checkDir = function (directoryEntry,uri) {
        if(forceOverwrite) {
            var filename = uri.split("/").pop();
            executeDownload(uri,filename);
        } else {
            var directoryReader = directoryEntry.createReader();
            directoryReader.readEntries(function(entries) {getNewName(entries,uri);},function() {console.log("fail entry()");})
        }
    };

    var getNewName = function (entries,uri) {
        var filename = uri.split("/").pop();
        while(true) {
            var changed = false;
            var i;
            for (i=0; i<entries.length; i++) {
                //console.log(entries[i].name);
                if(entries[i].name == filename) {
                    var dot = filename.lastIndexOf('.');
                    var close = filename.lastIndexOf(')');
                    if(close != -1) {
                        var open = filename.lastIndexOf('(');
                        var version = Number(filename.substring(open+1,close))+1;
                        filename = filename.substring(0,open)+"("+version+")"+filename.substring(close+1,filename.length);
                    } else {
                        filename = filename.substring(0,dot)+"(1)"+filename.substring(dot,filename.length);
                    }
                    changed = true;
                    break;
                }
            }
            if(!changed) {
                break;
            }
        }
        console.log(filename);
        executeDownload(uri,filename);
        //file:///storage/emulated/0/Android/data/py.com.diagro/files/IE_EA_EAOEAR_2017.pdf
    };

    var executeDownload = function(uri,filename) {
        var fileURL = cordova.file.externalDataDirectory + filename;
        fileTransfer.download(
            uri,
            fileURL,
            function(entry) {
                successCallback("download complete: "+entry.toURL());
                //console.log('success');
                if(openFileAfterDownload) {
                    openPdf(entry);
                }
            },
            function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code" + error.code);
            },
            true,
            {}
        );
    };

    var openPdf = function (path) {

        cordova.plugins.fileOpener2.open(
            path.toURL(),
            'application/pdf',
            {
                error : function(e) {
                    console.log('error: '+e);
                },
                success : function() {
                    console.log('file opened successfully');
                }
            }
        );

    }

};