/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    toolbar.js
==================================================*/


let clipboardObject = null;


/*=========================================
HISTORY SYSTEM
=========================================*/

let undoStack = [];
let redoStack = [];

let historyLock = false;



function saveState(){

    if(!canvas || historyLock)
        return;


    undoStack.push(

        JSON.stringify(

            canvas.toJSON([
                "id",
                "name",
                "locked"
            ])

        )

    );


    if(undoStack.length > 60){

        undoStack.shift();

    }


    redoStack=[];

}




function loadState(state){

    historyLock=true;


    canvas.loadFromJSON(

        state,

        function(){

            canvas.renderAll();

            historyLock=false;

            if(typeof refreshLayers==="function")
                refreshLayers();

        }

    );

}




function undo(){

    if(undoStack.length<=1)
        return;


    let current =
        undoStack.pop();


    redoStack.push(current);


    loadState(
        undoStack[
            undoStack.length-1
        ]
    );

}




function redo(){

    if(redoStack.length===0)
        return;


    let state =
        redoStack.pop();


    undoStack.push(state);


    loadState(state);

}





/*=========================================
COPY
=========================================*/


function copyObject(){

    let obj =
        canvas.getActiveObject();


    if(!obj)
        return;


    obj.clone(function(clone){

        clipboardObject=clone;

    });

}





/*=========================================
PASTE
=========================================*/


function pasteObject(){

    if(!clipboardObject)
        return;


    clipboardObject.clone(function(clone){


        canvas.discardActiveObject();


        clone.set({

            left:clone.left+40,

            top:clone.top+40,

            evented:true,

            id:crypto.randomUUID()

        });



        canvas.add(clone);


        canvas.setActiveObject(clone);


        canvas.renderAll();


        saveState();


    });

}





/*=========================================
DUPLICATE
=========================================*/


function duplicateObject(){

    let obj =
        canvas.getActiveObject();


    if(!obj)
        return;


    obj.clone(function(clone){


        clone.set({

            left:obj.left+40,

            top:obj.top+40,

            id:crypto.randomUUID()

        });



        canvas.add(clone);


        canvas.setActiveObject(clone);


        canvas.renderAll();


        saveState();


    });

}





/*=========================================
DELETE
=========================================*/


function deleteObject(){

    let obj =
        canvas.getActiveObject();


    if(!obj)
        return;


    canvas.remove(obj);


    canvas.discardActiveObject();


    canvas.renderAll();


    saveState();

}





/*=========================================
LAYERS
=========================================*/


function bringToFront(){

    let obj =
        canvas.getActiveObject();


    if(!obj)
        return;


    canvas.bringToFront(obj);


    canvas.renderAll();


    saveState();

}




function sendToBack(){

    let obj =
        canvas.getActiveObject();


    if(!obj)
        return;


    canvas.sendToBack(obj);


    canvas.renderAll();


    saveState();

}





/*=========================================
ALIGNMENT
=========================================*/


function alignLeft(){

    let obj=canvas.getActiveObject();

    if(!obj)return;


    obj.left=20;

    obj.setCoords();

    canvas.renderAll();

}




function alignCenter(){

    let obj=canvas.getActiveObject();

    if(!obj)return;


    obj.centerH();

    obj.setCoords();

    canvas.renderAll();

}




function alignRight(){

    let obj=canvas.getActiveObject();

    if(!obj)return;


    obj.left =
    canvas.width -
    obj.getScaledWidth() -
    20;


    obj.setCoords();

    canvas.renderAll();

}




function alignTop(){

    let obj=canvas.getActiveObject();

    if(!obj)return;


    obj.top=20;

    obj.setCoords();

    canvas.renderAll();

}




function alignMiddle(){

    let obj=canvas.getActiveObject();

    if(!obj)return;


    obj.centerV();

    obj.setCoords();

    canvas.renderAll();

}




function alignBottom(){

    let obj=canvas.getActiveObject();

    if(!obj)return;


    obj.top =
    canvas.height -
    obj.getScaledHeight() -
    20;


    obj.setCoords();

    canvas.renderAll();

}





/*=========================================
LOCK OBJECT
=========================================*/


function toggleLock(){

    let obj =
        canvas.getActiveObject();


    if(!obj)
        return;


    obj.locked =
    !obj.locked;


    obj.set({

        selectable:!obj.locked,

        evented:!obj.locked

    });


    canvas.renderAll();


    saveState();

}





/*=========================================
ZOOM
=========================================*/


function zoomIn(){

    canvas.setZoom(
        canvas.getZoom()+0.1
    );

    canvas.renderAll();

}



function zoomOut(){

    canvas.setZoom(
        canvas.getZoom()-0.1
    );

    canvas.renderAll();

}



function resetZoom(){

    canvas.setZoom(1);

    canvas.renderAll();

}





/*=========================================
AUTO HISTORY
=========================================*/


canvas.on("object:added",function(){

    saveState();

});


canvas.on("object:modified",function(){

    saveState();

});


canvas.on("object:removed",function(){

    saveState();

});





/*=========================================
KEYBOARD SHORTCUTS
=========================================*/


document.addEventListener(
"keydown",
function(e){


if(e.ctrlKey && e.key==="c"){

    e.preventDefault();

    copyObject();

}



if(e.ctrlKey && e.key==="v"){

    e.preventDefault();

    pasteObject();

}



if(e.ctrlKey && e.key==="d"){

    e.preventDefault();

    duplicateObject();

}



if(e.ctrlKey && e.key==="z"){

    e.preventDefault();

    undo();

}



if(e.ctrlKey && e.key==="y"){

    e.preventDefault();

    redo();

}



if(e.key==="Delete"){

    deleteObject();

}



if(e.key==="Escape"){

    canvas.discardActiveObject();

    canvas.renderAll();

}



});





/*=========================================
BUTTON CONNECTOR
=========================================*/


[
["undoBtn",undo],
["redoBtn",redo],

["copyBtn",copyObject],
["pasteBtn",pasteObject],
["duplicateBtn",duplicateObject],

["deleteBtn",deleteObject],

["frontBtn",bringToFront],
["backBtn",sendToBack],

["lockBtn",toggleLock],

["zoomInBtn",zoomIn],
["zoomOutBtn",zoomOut],
["resetZoomBtn",resetZoom],

["leftBtn",alignLeft],
["centerBtn",alignCenter],
["rightBtn",alignRight],

["topBtn",alignTop],
["middleBtn",alignMiddle],
["bottomBtn",alignBottom]

]
.forEach(([id,fn])=>{


let btn=document.getElementById(id);


if(btn){

    btn.onclick=fn;

}


});





/*=========================================
INITIAL HISTORY
=========================================*/


window.addEventListener(
"load",
function(){


setTimeout(function(){

    saveState();

},500);


});
