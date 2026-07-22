/*=========================================================
    SCHOOL WALL CHART DESIGNER PRO
    canvas.js - Optimized Editor Engine
=========================================================*/

"use strict";

/*=========================================================
    GLOBALS
=========================================================*/

let canvas = null;
let clipboard = null;

let currentPaper = "A4";
let currentOrientation = "portrait";
let currentZoom = 1;

let isHistoryAction = false;
let history = [];
let historyIndex = -1;


/*=========================================================
    PAPER SIZES (96 DPI)
=========================================================*/

const PAPER_SIZES = {

    A4:{
        width:794,
        height:1123
    },

    A3:{
        width:1123,
        height:1587
    },

    A2:{
        width:1587,
        height:2245
    },

    A1:{
        width:2245,
        height:3179
    },

    A0:{
        width:3179,
        height:4494
    }

};


/*=========================================================
    INITIALIZATION
=========================================================*/

window.addEventListener(
    "DOMContentLoaded",
    initCanvas
);


function initCanvas(){

    canvas = new fabric.Canvas(
        "designerCanvas",
        {

            preserveObjectStacking:true,

            selection:true,

            backgroundColor:"#ffffff",

            renderOnAddRemove:true,

            stopContextMenu:true,

            fireRightClick:true

        }
    );


    canvas.setControlsVisibility({

        mt:true,
        mb:true,
        ml:true,
        mr:true,
        mtr:true

    });


    applyPaperSize(currentPaper);


    registerCanvasEvents();

    registerToolbarEvents();

    registerPropertyEvents();


    saveHistory();


    canvas.renderAll();


    refreshLayers();


}



/*=========================================================
    PAPER SIZE MANAGEMENT
=========================================================*/


function applyPaperSize(size){

    if(!PAPER_SIZES[size]) return;


    currentPaper = size;


    let width = PAPER_SIZES[size].width;
    let height = PAPER_SIZES[size].height;


    if(currentOrientation==="landscape"){

        let temp = width;

        width = height;

        height = temp;

    }


    canvas.setDimensions({

        width:width,

        height:height

    });


    canvas.calcOffset();


    canvas.requestRenderAll();


    setTimeout(()=>{

        fitPage();

        centerWorkspaceCanvas();

    },100);

}



function setOrientation(mode){

    currentOrientation = mode;

    applyPaperSize(currentPaper);

}



/*=========================================================
    WORKSPACE CENTERING
=========================================================*/


function centerWorkspaceCanvas(){

    const workspace =
        document.querySelector(".workspace");


    if(!workspace) return;


    requestAnimationFrame(()=>{


        workspace.scrollLeft =
        (workspace.scrollWidth -
        workspace.clientWidth) / 2;



        workspace.scrollTop =
        (workspace.scrollHeight -
        workspace.clientHeight) / 2;


    });

}



/*=========================================================
    ZOOM SYSTEM
=========================================================*/


function setZoom(value){


    if(!canvas) return;


    value =
    Math.max(
        0.05,
        Math.min(
            Number(value),
            3
        )
    );


    currentZoom=value;



    const center =
    new fabric.Point(

        canvas.getWidth()/2,

        canvas.getHeight()/2

    );


    canvas.zoomToPoint(

        center,

        value

    );


    canvas.requestRenderAll();



    const slider =
    document.getElementById(
        "zoomSlider"
    );


    if(slider){

        slider.value =
        Math.round(value*100);

    }



    const label =
    document.getElementById(
        "zoomValue"
    );


    if(label){

        label.textContent =
        Math.round(value*100)+"%";

    }


    centerWorkspaceCanvas();

}



function fitPage(){


    if(!canvas) return;


    const workspace =
    document.querySelector(".workspace");


    if(!workspace) return;



    const padding=100;



    const zoomX =
    (workspace.clientWidth-padding)
    /
    canvas.getWidth();



    const zoomY =
    (workspace.clientHeight-padding)
    /
    canvas.getHeight();



    const zoom =
    Math.min(
        zoomX,
        zoomY
    );



    setZoom(zoom);

}



function resetZoom(){

    setZoom(1);

}

/*=========================================================
    BACKGROUND & NEW PROJECT
=========================================================*/


function setCanvasBackground(color){

    if(!canvas) return;


    canvas.backgroundColor=color;


    canvas.requestRenderAll();


    saveHistory();

}




function clearCanvas(){


    if(
        !confirm(
        "Create a new project? Unsaved work will be lost."
        )
    ) return;



    canvas.getObjects()
    .forEach(obj=>{

        canvas.remove(obj);

    });



    canvas.backgroundColor="#ffffff";


    canvas.discardActiveObject();


    canvas.requestRenderAll();


    refreshLayers();


    saveHistory();

}



/*=========================================================
    TOOLBAR EVENTS
=========================================================*/


function registerToolbarEvents(){



const paper =
document.getElementById(
    "paperSize"
);


if(paper){

paper.addEventListener(
"change",
e=>{

applyPaperSize(
e.target.value
);

});


}



const orientation =
document.getElementById(
"orientation"
);


if(orientation){

orientation.addEventListener(
"change",
e=>{

setOrientation(
e.target.value
);

});


}



const zoom =
document.getElementById(
"zoomSlider"
);


if(zoom){

zoom.addEventListener(
"input",
e=>{

setZoom(
e.target.value/100
);

});


}




const buttons=[

["newBtn",clearCanvas],

["undoBtn",undo],

["redoBtn",redo],

["deleteObject",deleteSelected],

["duplicateBtn",duplicateSelected],

["copyBtn",copySelected],

["pasteBtn",pasteSelected],

["frontBtn",bringForward],

["backBtn",sendBackward]

];



buttons.forEach(item=>{


const btn =
document.getElementById(
item[0]
);


if(btn){

btn.onclick=item[1];

}


});




const align=[

["leftBtn","left"],

["centerBtn","center"],

["rightBtn","right"],

["topBtn","top"],

["middleBtn","middle"],

["bottomBtn","bottom"]

];



align.forEach(item=>{


const btn =
document.getElementById(
item[0]
);



if(btn){

btn.onclick=()=>{

alignObject(
item[1]
);

};


}



});


}




/*=========================================================
    CANVAS EVENTS
=========================================================*/


function registerCanvasEvents(){


canvas.on(
"selection:created",
selectionChanged
);


canvas.on(
"selection:updated",
selectionChanged
);


canvas.on(
"selection:cleared",
selectionChanged
);



canvas.on(
"object:added",
()=>{

if(!isHistoryAction){

saveHistory();

}

refreshLayers();

}

);



canvas.on(
"object:removed",
()=>{

if(!isHistoryAction){

saveHistory();

}

refreshLayers();

}

);



canvas.on(
"object:modified",
()=>{

saveHistory();

refreshLayers();

}

);



canvas.on(
"mouse:wheel",
opt=>{


let zoom =
canvas.getZoom();


zoom *=
0.999 ** opt.e.deltaY;


zoom =
Math.max(
0.05,
Math.min(
zoom,
3
)
);



setZoom(zoom);



opt.e.preventDefault();

opt.e.stopPropagation();



});



}



function selectionChanged(){

updateProperties();

refreshLayers();

}


/*=========================================================
    OBJECT OPERATIONS
=========================================================*/


function deleteSelected(){

    if(!canvas) return;


    const objects =
    canvas.getActiveObjects();


    if(!objects.length) return;



    objects.forEach(obj=>{

        canvas.remove(obj);

    });



    canvas.discardActiveObject();


    canvas.requestRenderAll();


    refreshLayers();


    saveHistory();

}





function duplicateSelected(){

const obj = canvas.getActiveObject();

if(!obj)return;


obj.clone(cloned=>{

cloned.set({
left:cloned.left+30,
top:cloned.top+30,
evented:true
});


if(cloned.type==="activeSelection"){

cloned.canvas=canvas;

cloned.forEachObject(o=>{
canvas.add(o);
});

cloned.setCoords();

}else{

canvas.add(cloned);

}



canvas.setActiveObject(cloned);

canvas.requestRenderAll();

refreshLayers();

saveHistory();


});

}


function copySelected(){


    const obj =
    canvas.getActiveObject();


    if(!obj) return;



    obj.clone(cloned=>{

        clipboard=cloned;

    });


}




function pasteSelected(){


    if(!clipboard) return;



    clipboard.clone(cloned=>{


        cloned.set({

            left:cloned.left+30,

            top:cloned.top+30,

            evented:true

        });



        canvas.add(cloned);



        canvas.setActiveObject(
            cloned
        );


        canvas.requestRenderAll();


        refreshLayers();


        saveHistory();


    });


}





function bringForward(){


    const obj =
    canvas.getActiveObject();


    if(!obj)return;



    canvas.bringForward(obj);


    canvas.requestRenderAll();


    saveHistory();


}




function sendBackward(){


    const obj =
    canvas.getActiveObject();


    if(!obj)return;



    canvas.sendBackwards(obj);


    canvas.requestRenderAll();


    saveHistory();


}




function centerObject(){


    const obj =
    canvas.getActiveObject();


    if(!obj)return;



    obj.center();


    obj.setCoords();


    canvas.requestRenderAll();


    saveHistory();


}




function moveSelected(x,y){


    const obj =
    canvas.getActiveObject();


    if(!obj)return;



    obj.left += x;

    obj.top += y;


    obj.setCoords();


    canvas.requestRenderAll();


}





/*=========================================================
    KEYBOARD SHORTCUTS
=========================================================*/


document.addEventListener(
"keydown",
e=>{


if(!canvas)return;



const active =
document.activeElement;



if(
active &&
[
"INPUT",
"TEXTAREA",
"SELECT"
]
.includes(active.tagName)
){

return;

}




if(
e.key==="Delete" ||
e.key==="Backspace"
){

deleteSelected();

}




if(e.ctrlKey){


switch(
e.key.toLowerCase()
){


case "d":

e.preventDefault();

duplicateSelected();

break;



case "c":

e.preventDefault();

copySelected();

break;



case "v":

e.preventDefault();

pasteSelected();

break;



case "z":

e.preventDefault();

undo();

break;



case "y":

e.preventDefault();

redo();

break;


}


}





const step =
e.shiftKey ? 10 : 1;



if(e.key==="ArrowLeft")
moveSelected(-step,0);



if(e.key==="ArrowRight")
moveSelected(step,0);



if(e.key==="ArrowUp")
moveSelected(0,-step);



if(e.key==="ArrowDown")
moveSelected(0,step);



});


/*=========================================================
    ALIGNMENT
=========================================================*/


function alignObject(position){


const obj =
canvas.getActiveObject();


if(!obj)return;



const w =
canvas.getWidth();


const h =
canvas.getHeight();



switch(position){


case "left":

obj.set({
left:0
});

break;



case "center":

obj.set({
left:w/2
});

break;



case "right":

obj.set({
left:w-obj.width
});

break;



case "top":

obj.set({
top:0
});

break;



case "middle":

obj.set({
top:h/2
});

break;



case "bottom":

obj.set({
top:h-obj.height
});

break;


}



obj.setCoords();


canvas.requestRenderAll();


saveHistory();


}



/*=========================================================
    PROPERTY PANEL
=========================================================*/


function updateProperties(){


const obj =
canvas.getActiveObject();



if(!obj)return;



const text =
document.getElementById(
"objectText"
);



const font =
document.getElementById(
"fontFamily"
);



const size =
document.getElementById(
"fontSize"
);



const color =
document.getElementById(
"textColor"
);



const opacity =
document.getElementById(
"opacity"
);



if(text)
text.value =
obj.text || "";



if(font && obj.fontFamily)
font.value =
obj.fontFamily;



if(size && obj.fontSize)
size.value =
obj.fontSize;



if(color && obj.fill)
color.value =
obj.fill;



if(opacity)
opacity.value =
(obj.opacity || 1)*100;



}






function registerPropertyEvents(){



bindProperty(
"objectText",
"text"
);



bindProperty(
"fontFamily",
"fontFamily"
);



bindProperty(
"fontSize",
"fontSize"
);



bindProperty(
"textColor",
"fill"
);




const opacity =
document.getElementById(
"opacity"
);



if(opacity){

opacity.oninput=()=>{


const obj =
canvas.getActiveObject();


if(obj){

obj.opacity =
opacity.value/100;


canvas.requestRenderAll();

}


};


}



const bg =
document.getElementById(
"backgroundColor"
);



if(bg){

bg.oninput=()=>{

setCanvasBackground(
bg.value
);

};

}



}



function bindProperty(id,property){


const input =
document.getElementById(id);


if(!input)return;



input.oninput=()=>{


const obj =
canvas.getActiveObject();



if(!obj)return;



let value =
input.value;



if(property==="fontSize")
value =
Number(value);



obj.set(
property,
value
);



canvas.requestRenderAll();


};



}



/*=========================================================
    LAYERS
=========================================================*/


function refreshLayers(){


const list =
document.getElementById(
"layersList"
);



if(!list || !canvas)return;



list.innerHTML="";



canvas.getObjects()
.slice()
.reverse()
.forEach(obj=>{


const li =
document.createElement(
"li"
);



li.textContent =
getLayerLabel(obj);



li.onclick=()=>{


canvas.setActiveObject(obj);


canvas.requestRenderAll();


};



list.appendChild(li);



});


}





function getLayerLabel(obj){


if(obj.name)
return obj.name;



if(obj.text)
return obj.text.substring(
0,
20
);



return obj.type;

}




/*=========================================================
    HISTORY
=========================================================*/


function saveHistory(){


if(
!canvas ||
isHistoryAction
)return;



history =
history.slice(
0,
historyIndex+1
);



history.push(
JSON.stringify(canvas)
);



historyIndex++;

}




function undo(){


if(historyIndex<=0)return;



isHistoryAction=true;



historyIndex--;



canvas.loadFromJSON(
history[historyIndex],
()=>{


canvas.renderAll();


refreshLayers();


isHistoryAction=false;


});


}





function redo(){


if(
historyIndex>=history.length-1
)return;



isHistoryAction=true;



historyIndex++;



canvas.loadFromJSON(
history[historyIndex],
()=>{


canvas.renderAll();


refreshLayers();


isHistoryAction=false;


});


}




/*=========================================================
    RESIZE + API
=========================================================*/


window.addEventListener(
"resize",
()=>{


if(canvas){

canvas.calcOffset();

fitPage();

}


});





window.canvasEditor={


get canvas(){

return canvas;

},


applyPaperSize,

setOrientation,

setZoom,

fitPage,

resetZoom,

centerWorkspaceCanvas,

setCanvasBackground,

clearCanvas,

deleteSelected,

duplicateSelected,

copySelected,

pasteSelected,

bringForward,

sendBackward,

centerObject,

alignObject,

refreshLayers,

saveHistory,

undo,

redo


};
