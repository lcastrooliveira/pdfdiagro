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

// TODO:

// use properly the errorHandle variable

// Implement forceOverwrite parameter

// Separate the downloadFile function from openFile function

// Call it downloadFile and openPdf respectively

function downloadFile(URL, successCallback, openFileAfterDownload){

    // Set default value for openFileAfterDownload to False (So, if I want to open it after download set it to true when call the function)

    openFileAfterDownload = openFleAfterDownload || false;

    var fileTransfer = new FileTransfer();
    var uri = encodeURI("http://www.fab.mil.br/cabine/concursos/IE_EA_EAOEAR_2017.pdf");

    // File name only
    var filename = uri.split("/").pop();

    // Save location
    var fileURL = cordova.file.externalDataDirectory + filename;

    // TODO:

    // -- check if the file exists before start the download

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

			// call the successCallback 

			if(typeof(successCallback) === "function"){
				
				// finally call the valid callback
				successCallback(fileURL);

			}

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


// TODO: Create a recursive function example

// downloadPdfArray([URL1, URL2, URL3], function(pdfCount){ alert("Job completed, downloaded "+pdfCount);  });

function downloadPdfArray(URLArray, successCallback){

	var i = 0;

	var pdfCount = URLArray.length;

	// Recursive function

	function downloadNextPdf(){

		if(i > pdfCount){

			// call the successCallback on complete

			successCallback(pdfCount);

			return;

		}

		downloadFile(URLArray[i], function(){

			downloadNextPdf();		
	
		});
	
	}

}
