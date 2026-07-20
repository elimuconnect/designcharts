/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    export.js
==================================================*/

const { jsPDF } = window.jspdf;

/*----------------------------------------
DOWNLOAD HELPER
----------------------------------------*/

function downloadFile(dataURL, filename){

    const link = document.createElement("a");

    link.href = dataURL;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}

/*----------------------------------------
TIMESTAMP
----------------------------------------*/

function timestamp(){

    const d = new Date();

    return d.getFullYear()+"-"
        +(d.getMonth()+1).toString().padStart(2,"0")+"-"
        +d.getDate().toString().padStart(2,"0")+"-"
        +d.getHours().toString().padStart(2,"0")
        +d.getMinutes().toString().padStart(2,"0")
        +d.getSeconds().toString().padStart(2,"0");

}

/*----------------------------------------
PNG EXPORT
----------------------------------------*/

function exportPNG(){

    const dataURL = canvas.toDataURL({

        format:"png",

        multiplier:2

    });

    downloadFile(
        dataURL,
        "Chart-"+timestamp()+".png"
    );

}

/*----------------------------------------
JPG EXPORT
----------------------------------------*/

function exportJPG(){

    const dataURL = canvas.toDataURL({

        format:"jpeg",

        quality:1,

        multiplier:2

    });

    downloadFile(
        dataURL,
        "Chart-"+timestamp()+".jpg"
    );

}

/*----------------------------------------
SVG EXPORT
----------------------------------------*/

function exportSVG(){

    const svg = canvas.toSVG();

    const blob = new Blob([svg],{

        type:"image/svg+xml"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Chart-"+timestamp()+".svg";

    a.click();

    URL.revokeObjectURL(url);

}

/*----------------------------------------
PDF EXPORT
----------------------------------------*/

function exportPDF(){

    const img = canvas.toDataURL({

        format:"png",

        multiplier:2

    });

    const pdf = new jsPDF({

        orientation:

            canvas.width>canvas.height

            ?"landscape"

            :"portrait",

        unit:"px",

        format:[canvas.width,canvas.height]

    });

    pdf.addImage(

        img,

        "PNG",

        0,

        0,

        canvas.width,

        canvas.height

    );

    pdf.save(

        "Chart-"+timestamp()+".pdf"

    );

}

/*----------------------------------------
HIGH RES PNG
----------------------------------------*/

function exportHighResPNG(){

    const dataURL = canvas.toDataURL({

        format:"png",

        multiplier:4

    });

    downloadFile(

        dataURL,

        "Chart-HD-"+timestamp()+".png"

    );

}

/*----------------------------------------
300 DPI EXPORT
----------------------------------------*/

function exportPrintPNG(){

    const dataURL = canvas.toDataURL({

        format:"png",

        multiplier:6

    });

    downloadFile(

        dataURL,

        "Chart-Print-300DPI-"+timestamp()+".png"

    );

}

/*----------------------------------------
JSON SAVE
----------------------------------------*/

function saveProject(){

    const json = JSON.stringify(canvas);

    const blob = new Blob([json],{

        type:"application/json"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Project-"+timestamp()+".json";

    a.click();

    URL.revokeObjectURL(url);

}

/*----------------------------------------
LOAD PROJECT
----------------------------------------*/

function loadProject(){

    const input = document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.click();

    input.onchange = function(e){

        const file = e.target.files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.onload = function(f){

            canvas.loadFromJSON(

                f.target.result,

                function(){

                    canvas.renderAll();

                }

            );

        };

        reader.readAsText(file);

    };

}

/*----------------------------------------
PRINT
----------------------------------------*/

function printCanvas(){

    const win = window.open("");

    win.document.write(

        "<img src='"

        +canvas.toDataURL({

            format:"png",

            multiplier:2

        })

        +"' style='width:100%'>"

    );

    win.document.close();

    win.focus();

    win.print();

}

/*----------------------------------------
BUTTONS
----------------------------------------*/

document.getElementById("exportPNG")
.onclick = exportPNG;

document.getElementById("exportPDF")
.onclick = exportPDF;

document.getElementById("saveProject")
.onclick = saveProject;

document.getElementById("loadProject")
.onclick = loadProject;

/*----------------------------------------
GLOBAL ACCESS
----------------------------------------*/

window.exportTools = {

    exportPNG,

    exportJPG,

    exportSVG,

    exportPDF,

    exportHighResPNG,

    exportPrintPNG,

    saveProject,

    loadProject,

    printCanvas

};
