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
        downloadFile();
    });
};

function downloadFile() {

    var fileTransfer = new FileTransfer();
    var uri = encodeURI("http://www.fab.mil.br/cabine/concursos/IE_EA_EAOEAR_2017.pdf");

    // File name only
    var filename = uri.split("/").pop();

    // Save location
    var fileURL = cordova.file.externalDataDirectory + filename;

    fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
            console.log("download complete: "+entry.toURL());
            cordova.plugins.fileOpener2.open(
                entry.toURL(),
                'application/pdf',
                {
                    error : function(e) {
                        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                    },
                    success : function () {
                        console.log('file opened successfully');
                    }
                }
            );

        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);
        },
        true,
        {}
    );
}

