/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    toolbar.js
==================================================*/

let clipboardObject = null;

/*-----------------------------------------
UNDO / REDO STACKS
-----------------------------------------*/

let undoStack = [];
let redoStack = [];

/*-----------------------------------------
SAVE STATE
-----------------------------------------*/

function saveState(){

    if(!canvas) return;

    undoStack.push(JSON.stringify(canvas));

    if(undoStack.length > 50){

        undoStack.shift();

    }

    redoStack = [];

}

/*-----------------------------------------
UNDO
-----------------------------------------*/

function undo(){

    if(undoStack.length < 2) return;

    redoStack.push(undoStack.pop());

    let previous = undoStack[undoStack.length-1];

    canvas.loadFromJSON(previous,function(){

        canvas.renderAll();

    });

}

/*-----------------------------------------
REDO
-----------------------------------------*/

function redo(){

    if(redoStack.length===0) return;

    let next = redoStack.pop();

    undoStack.push(next);

    canvas.loadFromJSON(next,function(){

        canvas.renderAll();

    });

}

/*-----------------------------------------
COPY
-----------------------------------------*/

function copyObject(){

    let active = canvas.getActiveObject();

    if(!active) return;

    active.clone(function(clone){

        clipboardObject = clone;

    });

}

/*-----------------------------------------
PASTE
-----------------------------------------*/

function pasteObject(){

    if(!clipboardObject) return;

    clipboardObject.clone(function(clone){

        canvas.discardActiveObject();

        clone.set({

            left:clone.left+30,

            top:clone.top+30,

            evented:true

        });

        if(clone.type==="activeSelection"){

            clone.canvas=canvas;

            clone.forEachObject(function(obj){

                canvas.add(obj);

            });

            clone.setCoords();

        }else{

            canvas.add(clone);

        }

        clipboardObject=clone;

        canvas.setActiveObject(clone);

        canvas.renderAll();

        saveState();

    });

}

/*-----------------------------------------
DUPLICATE
-----------------------------------------*/

function duplicateObject(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    obj.clone(function(clone){

        clone.left+=40;

        clone.top+=40;

        canvas.add(clone);

        canvas.setActiveObject(clone);

        canvas.renderAll();

        saveState();

    });

}

/*-----------------------------------------
DELETE
-----------------------------------------*/

function deleteObject(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    canvas.remove(obj);

    canvas.discardActiveObject();

    canvas.renderAll();

    saveState();

}

/*-----------------------------------------
BRING TO FRONT
-----------------------------------------*/

function bringToFront(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    canvas.bringToFront(obj);

    canvas.renderAll();

    saveState();

}

/*-----------------------------------------
SEND TO BACK
-----------------------------------------*/

function sendToBack(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    canvas.sendToBack(obj);

    canvas.renderAll();

    saveState();

}

/*-----------------------------------------
ALIGN LEFT
-----------------------------------------*/

function alignLeft(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    obj.left=20;

    obj.setCoords();

    canvas.renderAll();

}

/*-----------------------------------------
ALIGN CENTER
-----------------------------------------*/

function alignCenter(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    obj.centerH();

    obj.setCoords();

    canvas.renderAll();

}

/*-----------------------------------------
ALIGN RIGHT
-----------------------------------------*/

function alignRight(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    obj.left=canvas.width-obj.getScaledWidth()-20;

    obj.setCoords();

    canvas.renderAll();

}

/*-----------------------------------------
ALIGN TOP
-----------------------------------------*/

function alignTop(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    obj.top=20;

    obj.setCoords();

    canvas.renderAll();

}

/*-----------------------------------------
ALIGN MIDDLE
-----------------------------------------*/

function alignMiddle(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    obj.centerV();

    obj.setCoords();

    canvas.renderAll();

}

/*-----------------------------------------
ALIGN BOTTOM
-----------------------------------------*/

function alignBottom(){

    let obj=canvas.getActiveObject();

    if(!obj) return;

    obj.top=canvas.height-obj.getScaledHeight()-20;

    obj.setCoords();

    canvas.renderAll();

}

/*-----------------------------------------
AUTO SAVE HISTORY
-----------------------------------------*/

canvas.on("object:added",function(){

    saveState();

});

canvas.on("object:modified",function(){

    saveState();

});

canvas.on("object:removed",function(){

    saveState();

});

/*-----------------------------------------
KEYBOARD SHORTCUTS
-----------------------------------------*/

document.addEventListener("keydown",function(e){

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

});

/*-----------------------------------------
OPTIONAL BUTTONS
-----------------------------------------*/

[
["undoBtn",undo],
["redoBtn",redo],
["copyBtn",copyObject],
["pasteBtn",pasteObject],
["duplicateBtn",duplicateObject],
["frontBtn",bringToFront],
["backBtn",sendToBack],
["leftBtn",alignLeft],
["centerBtn",alignCenter],
["rightBtn",alignRight],
["topBtn",alignTop],
["middleBtn",alignMiddle],
["bottomBtn",alignBottom]
].forEach(([id,fn])=>{

    const btn=document.getElementById(id);

    if(btn){

        btn.onclick=fn;

    }

});

/*-----------------------------------------
INITIAL STATE
-----------------------------------------*/

window.addEventListener("load",function(){

    setTimeout(function(){

        saveState();

    },500);

});
