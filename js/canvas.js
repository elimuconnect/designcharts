/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    canvas.js
==================================================*/

let canvas;

/*-----------------------------------------------
Paper Sizes (Pixels @ Approx. 96 DPI)
These are for editing. High-resolution export
will be handled separately.
------------------------------------------------*/

const PAPER_SIZES = {

    A4: { width: 794, height: 1123 },

    A3: { width: 1123, height: 1587 },

    A2: { width: 1587, height: 2245 },

    A1: { width: 2245, height: 3179 },

    A0: { width: 3179, height: 4494 }

};


/*-----------------------------------------------
Current Settings
------------------------------------------------*/

let currentPaper = "A4";

let currentOrientation = "portrait";

let currentZoom = 1;


/*-----------------------------------------------
Initialize Canvas
------------------------------------------------*/

window.addEventListener("load", () => {

    canvas = new fabric.Canvas("designerCanvas",{

        preserveObjectStacking:true,

        selection:true,

        backgroundColor:"#ffffff"

    });

    initializeCanvas();

});


/*-----------------------------------------------
Canvas Setup
------------------------------------------------*/

function initializeCanvas(){

    applyPaperSize(currentPaper);

    canvas.renderAll();

}


/*-----------------------------------------------
Apply Paper Size
------------------------------------------------*/

function applyPaperSize(size){

    currentPaper = size;

    let width = PAPER_SIZES[size].width;

    let height = PAPER_SIZES[size].height;

    if(currentOrientation==="landscape"){

        [width,height]=[height,width];

    }

    canvas.setWidth(width);

    canvas.setHeight(height);

    canvas.calcOffset();

    canvas.renderAll();

}


/*-----------------------------------------------
Orientation
------------------------------------------------*/

function setOrientation(mode){

    currentOrientation = mode;

    applyPaperSize(currentPaper);

}


/*-----------------------------------------------
Zoom
------------------------------------------------*/

function setZoom(level){

    currentZoom = level;

    canvas.setZoom(level);

    canvas.renderAll();

}


/*-----------------------------------------------
Fit Canvas to Screen
------------------------------------------------*/

function fitCanvas(){

    const workspace = document.querySelector(".workspace");

    const padding = 150;

    const scaleX = (workspace.clientWidth-padding)/canvas.getWidth();

    const scaleY = (workspace.clientHeight-padding)/canvas.getHeight();

    let zoom = Math.min(scaleX,scaleY);

    if(zoom>1){

        zoom=1;

    }

    setZoom(zoom);

}


/*-----------------------------------------------
Reset Zoom
------------------------------------------------*/

function resetZoom(){

    setZoom(1);

}


/*-----------------------------------------------
Canvas Background
------------------------------------------------*/

function setCanvasBackground(color){

    canvas.backgroundColor=color;

    canvas.renderAll();

}


/*-----------------------------------------------
Clear Canvas
------------------------------------------------*/

function clearCanvas(){

    if(confirm("Create a new project?")){

        canvas.clear();

        canvas.backgroundColor="#ffffff";

        applyPaperSize(currentPaper);

    }

}


/*-----------------------------------------------
Delete Selected Object
------------------------------------------------*/

function deleteSelected(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    canvas.remove(obj);

    canvas.discardActiveObject();

    canvas.renderAll();

}


/*-----------------------------------------------
Duplicate Selected Object
------------------------------------------------*/

function duplicateSelected(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    obj.clone(function(clone){

        clone.left+=40;

        clone.top+=40;

        canvas.add(clone);

        canvas.setActiveObject(clone);

        canvas.renderAll();

    });

}


/*-----------------------------------------------
Bring Forward
------------------------------------------------*/

function bringForward(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    canvas.bringForward(obj);

    canvas.renderAll();

}


/*-----------------------------------------------
Send Backward
------------------------------------------------*/

function sendBackward(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    canvas.sendBackwards(obj);

    canvas.renderAll();

}


/*-----------------------------------------------
Center Object
------------------------------------------------*/

function centerObject(){

    const obj=canvas.getActiveObject();

    if(!obj) return;

    obj.center();

    obj.setCoords();

    canvas.renderAll();

}


/*-----------------------------------------------
Grid (Optional)
------------------------------------------------*/

function drawGrid(){

    const size=50;

    const width=canvas.getWidth();

    const height=canvas.getHeight();

    for(let i=0;i<(width/size);i++){

        canvas.add(new fabric.Line(

            [i*size,0,i*size,height],

            {

                stroke:"#eeeeee",

                selectable:false,

                evented:false

            }

        ));

    }

    for(let i=0;i<(height/size);i++){

        canvas.add(new fabric.Line(

            [0,i*size,width,i*size],

            {

                stroke:"#eeeeee",

                selectable:false,

                evented:false

            }

        ));

    }

}


/*-----------------------------------------------
Events
------------------------------------------------*/

document.getElementById("paperSize").addEventListener("change",(e)=>{

    applyPaperSize(e.target.value);

});

document.getElementById("orientation").addEventListener("change",(e)=>{

    setOrientation(e.target.value);

});

document.getElementById("zoomSlider").addEventListener("input",(e)=>{

    const zoom=e.target.value/100;

    setZoom(zoom);

    document.getElementById("zoomValue").innerHTML=e.target.value+"%";

});

document.getElementById("deleteObject").addEventListener("click",()=>{

    deleteSelected();

});

document.getElementById("newProject").addEventListener("click",()=>{

    clearCanvas();

});


/*-----------------------------------------------
Resize Window
------------------------------------------------*/

window.addEventListener("resize",()=>{

    canvas.calcOffset();

});


/*-----------------------------------------------
Expose Functions
------------------------------------------------*/

window.canvasEditor={

    canvas,

    applyPaperSize,

    setOrientation,

    setZoom,

    fitCanvas,

    resetZoom,

    deleteSelected,

    duplicateSelected,

    bringForward,

    sendBackward,

    centerObject,

    setCanvasBackground

};
