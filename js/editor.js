/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    editor.js
==================================================*/

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";

/*--------------------------------------------------
ADD TITLE
--------------------------------------------------*/

function addTitle(){

    const title = new fabric.Textbox("Main Title",{

        left:120,
        top:80,

        width:700,

        fontFamily:"Poppins",

        fontSize:64,

        fontWeight:"bold",

        fill:"#1565C0",

        editable:true

    });

    canvas.add(title);

    canvas.setActiveObject(title);

    canvas.renderAll();

}


/*--------------------------------------------------
ADD SUBTITLE
--------------------------------------------------*/

function addSubtitle(){

    const subtitle = new fabric.Textbox("Subtitle",{

        left:120,
        top:180,

        width:700,

        fontFamily:"Poppins",

        fontSize:36,

        fill:"#333333"

    });

    canvas.add(subtitle);

    canvas.setActiveObject(subtitle);

    canvas.renderAll();

}


/*--------------------------------------------------
ADD PARAGRAPH
--------------------------------------------------*/

function addParagraph(){

    const paragraph = new fabric.Textbox(

`Type your content here.

This paragraph automatically wraps.

Perfect for educational wall charts.`,

    {

        left:120,

        top:280,

        width:900,

        fontFamily:"Poppins",

        fontSize:28,

        lineHeight:1.35,

        fill:"#222"

    });

    canvas.add(paragraph);

    canvas.setActiveObject(paragraph);

    canvas.renderAll();

}


/*--------------------------------------------------
RECTANGLE
--------------------------------------------------*/

function addRectangle(){

    const rect = new fabric.Rect({

        left:150,

        top:150,

        width:300,

        height:180,

        fill:"#90CAF9",

        stroke:"#1565C0",

        strokeWidth:2,

        rx:10,

        ry:10

    });

    canvas.add(rect);

    canvas.setActiveObject(rect);

}


/*--------------------------------------------------
CIRCLE
--------------------------------------------------*/

function addCircle(){

    const circle = new fabric.Circle({

        radius:80,

        fill:"#4CAF50",

        left:180,

        top:180

    });

    canvas.add(circle);

    canvas.setActiveObject(circle);

}


/*--------------------------------------------------
LINE
--------------------------------------------------*/

function addLine(){

    const line = new fabric.Line(

        [0,0,300,0],

        {

            left:200,

            top:250,

            stroke:"#000",

            strokeWidth:4

        }

    );

    canvas.add(line);

    canvas.setActiveObject(line);

}


/*--------------------------------------------------
ARROW
(Simple Version)
--------------------------------------------------*/

function addArrow(){

    const group = new fabric.Group([

        new fabric.Line([0,0,220,0],{

            stroke:"red",

            strokeWidth:5

        }),

        new fabric.Triangle({

            width:25,

            height:25,

            fill:"red",

            left:210,

            top:-12,

            angle:90

        })

    ],{

        left:180,

        top:300

    });

    canvas.add(group);

    canvas.setActiveObject(group);

}


/*--------------------------------------------------
IMAGE
--------------------------------------------------*/

function addImage(){

    fileInput.click();

}

fileInput.onchange=function(e){

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(f){

        fabric.Image.fromURL(f.target.result,function(img){

            img.scaleToWidth(350);

            img.set({

                left:150,

                top:120

            });

            canvas.add(img);

            canvas.setActiveObject(img);

            canvas.renderAll();

        });

    };

    reader.readAsDataURL(file);

};


/*--------------------------------------------------
PROPERTY PANEL
--------------------------------------------------*/

canvas.on("selection:created",loadProperties);

canvas.on("selection:updated",loadProperties);

function loadProperties(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    if(obj.text!==undefined){

        document.getElementById("objectText").value=obj.text;

    }

    document.getElementById("fontSize").value=obj.fontSize || 24;

    document.getElementById("textColor").value=obj.fill || "#000000";

    document.getElementById("opacity").value=Math.round((obj.opacity||1)*100);

}


/*--------------------------------------------------
TEXT
--------------------------------------------------*/

document.getElementById("objectText").addEventListener("input",function(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    if(obj.text!==undefined){

        obj.text=this.value;

        canvas.renderAll();

    }

});


/*--------------------------------------------------
FONT SIZE
--------------------------------------------------*/

document.getElementById("fontSize").addEventListener("input",function(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    if(obj.fontSize!==undefined){

        obj.set({

            fontSize:Number(this.value)

        });

        canvas.renderAll();

    }

});


/*--------------------------------------------------
FONT
--------------------------------------------------*/

document.getElementById("fontFamily").addEventListener("change",function(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    if(obj.fontFamily!==undefined){

        obj.set({

            fontFamily:this.value

        });

        canvas.renderAll();

    }

});


/*--------------------------------------------------
COLOR
--------------------------------------------------*/

document.getElementById("textColor").addEventListener("input",function(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    obj.set({

        fill:this.value

    });

    canvas.renderAll();

});


/*--------------------------------------------------
BACKGROUND
--------------------------------------------------*/

document.getElementById("backgroundColor").addEventListener("input",function(){

    canvas.backgroundColor=this.value;

    canvas.renderAll();

});


/*--------------------------------------------------
OPACITY
--------------------------------------------------*/

document.getElementById("opacity").addEventListener("input",function(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    obj.set({

        opacity:this.value/100

    });

    canvas.renderAll();

});


/*--------------------------------------------------
BUTTONS
--------------------------------------------------*/

document.getElementById("addTitle").onclick=addTitle;

document.getElementById("addSubtitle").onclick=addSubtitle;

document.getElementById("addParagraph").onclick=addParagraph;

document.getElementById("addRectangle").onclick=addRectangle;

document.getElementById("addCircle").onclick=addCircle;

document.getElementById("addLine").onclick=addLine;

document.getElementById("addArrow").onclick=addArrow;

document.getElementById("addImage").onclick=addImage;
