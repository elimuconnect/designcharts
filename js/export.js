/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    export.js
==================================================*/


"use strict";


const PDF =
window.jspdf ? window.jspdf.jsPDF : null;




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


    return (

        d.getFullYear()
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
        Date.now()

    );


}





/*=========================================
EXPORT IMAGE
=========================================*/


function getExportImage(multiplier=3){


    if(!canvas)
        return null;



    return canvas.toDataURL({

        format:"png",

        multiplier,

        enableRetinaScaling:true

    });


}





/*=========================================
PNG EXPORT
=========================================*/


function exportPNG(){


    let image=getExportImage(3);


    if(!image)return;


    downloadFile(

        image,

        "Wall-Chart-"+timestamp()+".png"

    );


}





/*=========================================
JPG EXPORT
=========================================*/


function exportJPG(){


    let image=canvas.toDataURL({

        format:"jpeg",

        quality:1,

        multiplier:3

    });



    downloadFile(

        image,

        "Wall-Chart-"+timestamp()+".jpg"

    );


}





/*=========================================
SVG EXPORT
=========================================*/


function exportSVG(){


    if(!canvas)
        return;



    let svg=canvas.toSVG();



    let blob=new Blob(

        [svg],

        {
            type:"image/svg+xml"
        }

    );



    let url=
    URL.createObjectURL(blob);



    let link=document.createElement("a");


    link.href=url;


    link.download=
    "Wall-Chart-"+timestamp()+".svg";


    link.click();



    URL.revokeObjectURL(url);


}





/*=========================================
PDF EXPORT
=========================================*/


function exportPDF(){


    if(!PDF || !canvas)
        return;



    let image=
    getExportImage(4);



    let orientation =
    canvas.width > canvas.height
    ?
    "landscape"
    :
    "portrait";



    let pdf=new PDF({

        orientation,

        unit:"mm",

        format:"a1"

    });



    let width =
    pdf.internal.pageSize.getWidth();


    let height =
    pdf.internal.pageSize.getHeight();



    pdf.addImage(

        image,

        "PNG",

        0,

        0,

        width,

        height

    );



    pdf.save(

        "Wall-Chart-"+timestamp()+".pdf"

    );


}





/*=========================================
HIGH RES EXPORT
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


    if(!canvas)
        return;



    let project={


        app:
        "School Wall Chart Designer Pro",


        version:"1.0",


        created:
        new Date(),


        paper:
        currentPaper,


        orientation:
        currentOrientation,


        zoom:
        currentZoom,


        canvas:

        canvas.toJSON([

            "id",

            "name",

            "customType",

            "locked"

        ])

    };



    let blob=new Blob(

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



    let url=
    URL.createObjectURL(blob);



    let link=document.createElement("a");


    link.href=url;


    link.download=
    "Project-"+timestamp()+".json";


    link.click();



    URL.revokeObjectURL(url);


}





/*=========================================
LOAD PROJECT
=========================================*/


function loadProject(){


    let input=
    document.createElement("input");


    input.type="file";


    input.accept=".json";


    input.click();



    input.onchange=function(e){


        let file=e.target.files[0];


        if(!file)
            return;



        let reader=new FileReader();



        reader.onload=function(){


            let project=
            JSON.parse(reader.result);



            if(project.paper){

                currentPaper=
                project.paper;

            }



            if(project.orientation){

                currentOrientation=
                project.orientation;

            }



            if(project.canvas){


                canvas.loadFromJSON(

                    project.canvas,

                    function(){


                        canvas.renderAll();



                        if(typeof refreshLayers==="function")

                            refreshLayers();



                        if(typeof saveHistory==="function")

                            saveHistory();


                    }

                );


            }


        };


        reader.readAsText(file);


    };


}





/*=========================================
PRINT
=========================================*/


function printCanvas(){


    let image=
    getExportImage(4);



    let win=
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


    win.focus();


    win.print();


}





/*=========================================
BUTTON EVENTS
=========================================*/


[
["exportPNG",exportPNG],
["exportJPG",exportJPG],
["exportSVG",exportSVG],
["exportPDF",exportPDF],
["saveProject",saveProject],
["loadProject",loadProject],
["printCanvas",printCanvas]

]
.forEach(([id,fn])=>{


    let btn=
    document.getElementById(id);


    if(btn)

        btn.onclick=fn;


});





/*=========================================
GLOBAL API
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
