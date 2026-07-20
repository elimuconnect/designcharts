/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    export.js
==================================================*/


const {jsPDF}=window.jspdf;



/*=========================================
DOWNLOAD HELPER
=========================================*/


function downloadFile(dataURL,filename){


    const link=document.createElement("a");


    link.href=dataURL;


    link.download=filename;


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


}




/*=========================================
TIMESTAMP
=========================================*/


function timestamp(){


    const d=new Date();


    return d.getFullYear()
    +
    "-"
    +
    String(d.getMonth()+1).padStart(2,"0")
    +
    "-"
    +
    String(d.getDate()).padStart(2,"0")
    +
    "-"
    +
    Date.now();

}





/*=========================================
EXPORT SETTINGS
=========================================*/


function getExportImage(multiplier=3){


    return canvas.toDataURL({

        format:"png",

        multiplier,

        enableRetinaScaling:true


    });


}





/*=========================================
PNG
=========================================*/


function exportPNG(){


    downloadFile(

        getExportImage(3),

        "Wall-Chart-"+timestamp()+".png"

    );

}





/*=========================================
JPG
=========================================*/


function exportJPG(){


    let dataURL =
    canvas.toDataURL({

        format:"jpeg",

        quality:1,

        multiplier:3

    });



    downloadFile(

        dataURL,

        "Wall-Chart-"+timestamp()+".jpg"

    );


}





/*=========================================
SVG
=========================================*/


function exportSVG(){


    let svg =
    canvas.toSVG();


    let blob =
    new Blob(

        [svg],

        {
            type:"image/svg+xml"
        }

    );


    let url =
    URL.createObjectURL(blob);



    let a=document.createElement("a");


    a.href=url;


    a.download=
    "Wall-Chart-"+timestamp()+".svg";


    a.click();



    URL.revokeObjectURL(url);


}





/*=========================================
PDF PRINT EXPORT
=========================================*/


function exportPDF(){


    let image =
    getExportImage(4);



    let width =
    canvas.width;


    let height =
    canvas.height;



    let orientation =
    width>height
    ?
    "landscape"
    :
    "portrait";



    let pdf =
    new jsPDF({

        orientation,

        unit:"mm",

        format:"a1"

    });



    let pageWidth =
    pdf.internal.pageSize.getWidth();


    let pageHeight =
    pdf.internal.pageSize.getHeight();



    pdf.addImage(

        image,

        "PNG",

        0,

        0,

        pageWidth,

        pageHeight

    );



    pdf.save(

        "Wall-Chart-"+timestamp()+".pdf"

    );


}





/*=========================================
HIGH QUALITY EXPORT
=========================================*/


function exportHighResPNG(){


    downloadFile(

        getExportImage(6),

        "Wall-Chart-HD-"+timestamp()+".png"

    );


}





function exportPrintPNG(){


    downloadFile(

        getExportImage(8),

        "Wall-Chart-Print-"+timestamp()+".png"

    );


}





/*=========================================
SAVE PROJECT
=========================================*/


function saveProject(){


    let project={


        app:
        "School Wall Chart Designer Pro",


        version:"1.0",


        created:
        new Date(),


        paper:
        currentPaper || null,


        canvas:
        canvas.toJSON([

            "id",

            "name",

            "locked"

        ])

    };



    let blob =
    new Blob(

        [
            JSON.stringify(
                project,
                null,
                2
            )
        ],

        {
            type:"application/json"
        }

    );



    let url =
    URL.createObjectURL(blob);



    let a=document.createElement("a");


    a.href=url;


    a.download=
    "Project-"+timestamp()+".json";


    a.click();


    URL.revokeObjectURL(url);


}





/*=========================================
LOAD PROJECT
=========================================*/


function loadProject(){


    let input =
    document.createElement("input");


    input.type="file";


    input.accept=".json";


    input.click();



    input.onchange=function(e){


        let file=e.target.files[0];


        if(!file)return;



        let reader=new FileReader();



        reader.onload=function(){


            let project =
            JSON.parse(reader.result);



            let data =
            project.canvas ||
            project;



            canvas.loadFromJSON(

                data,

                function(){


                    canvas.renderAll();



                    if(typeof refreshLayers==="function")

                        refreshLayers();


                }

            );


        };


        reader.readAsText(file);


    };


}





/*=========================================
PRINT
=========================================*/


function printCanvas(){


    let image =
    getExportImage(3);



    let win =
    window.open("");



    win.document.write(`

        <html>

        <body style="margin:0">

        <img src="${image}"
        style="width:100%">


        </body>

        </html>

    `);



    win.document.close();


    win.print();


}





/*=========================================
BUTTONS
=========================================*/


[
["exportPNG",exportPNG],
["exportPDF",exportPDF],
["exportJPG",exportJPG],
["exportSVG",exportSVG],
["saveProject",saveProject],
["loadProject",loadProject],
["printCanvas",printCanvas]

]
.forEach(([id,fn])=>{


let btn=document.getElementById(id);


if(btn)

btn.onclick=fn;


});





/*=========================================
GLOBAL
=========================================*/


window.exportTools={


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
