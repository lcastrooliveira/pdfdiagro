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
        //downloadFile("http://www.fab.mil.br/cabine/concursos/IE_EA_EAOEAR_2017.pdf",null,false,true);
        var f = new FileDownloader("http://www.fab.mil.br/cabine/concursos/IE_EA_EAOEAR_2017.pdf",null,false,true);
        f.startDownload();
    });
};

function FileDownloader(URL, successCallback, failCallback, openFileAfterDownload, forceOverwrite) {
    var URL = URL;
    var successCallback = successCallback;
    var failCallback = failCallback;
    var openFileAfterDownload = openFileAfterDownload || false;
    var forceOverwrite = forceOverwrite || false;
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(URL);
    // File name only
    var filename = uri.split("/").pop();
    // Save location
    var fileURL = cordova.file.externalDataDirectory + filename;

    this.startDownload = function() {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, checkDir,
            function() {console.log("fail resolve");});
    };

    var checkDir = function (directoryEntry) {
        if(forceOverwrite) {
            executeDownload();
        } else {
            var directoryReader = directoryEntry.createReader();
            directoryReader.readEntries(getNewName,function() {console.log("fail entry()");})
        }
    };

    var getNewName = function (entries) {
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
        fileURL = cordova.file.externalDataDirectory + filename;
        executeDownload();
        //file:///storage/emulated/0/Android/data/py.com.diagro/files/IE_EA_EAOEAR_2017.pdf
    };

    var executeDownload = function() {
        fileTransfer.download(
            uri,
            fileURL,
            //successCallback(fileURL),
            function() {
                console.log('success');
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

}

// TODO:

// use properly the errorHandle variable

// Implement forceOverwrite parameter

// Separate the downloadFile function from openFile function

// Call it downloadFile and openPdf respectively

function downloadFile(URL, successCallback, openFileAfterDownload, forceOverwrite){

    // Set default value for openFileAfterDownload to False (So, if I want to open it after download set it to true when call the function)

    openFileAfterDownload = openFileAfterDownload || false;
    forceOverwrite = forceOverwrite || true;

    var fileTransfer = new FileTransfer();
    var uri = encodeURI(URL);


    // File name only
    var filename = uri.split("/").pop();


    // Save location
    var fileURL = cordova.file.externalDataDirectory + filename;
    // TODO:

    // -- check if the file exists before start the download
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, logFileName, function() {console.log("fail resolve");});
    /*
    fileTransfer.download(
        uri,
        fileURL,
        //successCallback(fileURL),
        function() {
            console.log('success');
        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);
        },
        true,
        {}
    );
    */
}

function logFileName(directoryEntry) {
    console.log(forceOverwrite);
    var directoryReader = directoryEntry.createReader();
    directoryReader.readEntries(logEntries,function() {console.log("fail entry()");})
}

function logEntries(entries) {
    var i;
    for (i=0; i<entries.length; i++) {
        console.log(entries[i].name);
    }
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

function openPdf(path) {

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