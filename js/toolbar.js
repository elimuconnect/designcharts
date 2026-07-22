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

function saveState() {
    if (typeof canvas === "undefined" || !canvas || historyLock)
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

    if (undoStack.length > 60) {
        undoStack.shift();
    }

    redoStack = [];
}

function loadState(state) {
    if (typeof canvas === "undefined" || !canvas) return;

    historyLock = true;

    canvas.loadFromJSON(
        state,
        function() {
            canvas.renderAll();
            historyLock = false;

            if (typeof refreshLayers === "function")
                refreshLayers();
        }
    );
}

function undo() {
    if (undoStack.length <= 1)
        return;

    let current = undoStack.pop();
    redoStack.push(current);

    loadState(
        undoStack[undoStack.length - 1]
    );
}

function redo() {
    if (redoStack.length === 0)
        return;

    let state = redoStack.pop();
    undoStack.push(state);

    loadState(state);
}

/*=========================================
COPY
=========================================*/

function copyObject() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.clone(function(clone) {
        clipboardObject = clone;
    });
}

/*=========================================
PASTE
=========================================*/

function pasteObject() {
    if (typeof canvas === "undefined" || !canvas || !clipboardObject)
        return;

    clipboardObject.clone(function(clone) {
        canvas.discardActiveObject();

        clone.set({
            left: clone.left + 40,
            top: clone.top + 40,
            evented: true,
            id: crypto.randomUUID()
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

function duplicateObject() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.clone(function(clone) {
        clone.set({
            left: obj.left + 40,
            top: obj.top + 40,
            id: crypto.randomUUID()
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

function deleteObject() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
    saveState();
}

/*=========================================
LAYERS
=========================================*/

function bringToFront() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    canvas.bringToFront(obj);
    canvas.renderAll();
    saveState();
}

function sendToBack() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    canvas.sendToBack(obj);
    canvas.renderAll();
    saveState();
}

/*=========================================
ALIGNMENT
=========================================*/

function alignLeft() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.left = 20;
    obj.setCoords();
    canvas.renderAll();
}

function alignCenter() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.centerH();
    obj.setCoords();
    canvas.renderAll();
}

function alignRight() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.left = canvas.width - obj.getScaledWidth() - 20;
    obj.setCoords();
    canvas.renderAll();
}

function alignTop() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.top = 20;
    obj.setCoords();
    canvas.renderAll();
}

function alignMiddle() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.centerV();
    obj.setCoords();
    canvas.renderAll();
}

function alignBottom() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.top = canvas.height - obj.getScaledHeight() - 20;
    obj.setCoords();
    canvas.renderAll();
}

/*=========================================
LOCK OBJECT
=========================================*/

function toggleLock() {
    if (typeof canvas === "undefined" || !canvas) return;

    let obj = canvas.getActiveObject();
    if (!obj) return;

    obj.locked = !obj.locked;

    obj.set({
        selectable: !obj.locked,
        evented: !obj.locked
    });

    canvas.renderAll();
    saveState();
}

/*=========================================
ZOOM
=========================================*/

function zoomIn() {
    if (typeof canvas === "undefined" || !canvas) return;

    canvas.setZoom(canvas.getZoom() + 0.1);
    canvas.renderAll();
}

function zoomOut() {
    if (typeof canvas === "undefined" || !canvas) return;

    canvas.setZoom(canvas.getZoom() - 0.1);
    canvas.renderAll();
}

function resetZoom() {
    if (typeof canvas === "undefined" || !canvas) return;

    canvas.setZoom(1);
    canvas.renderAll();
}

/*=========================================
AUTO HISTORY & EVENT LISTENERS
=========================================*/

function setupCanvasListeners() {
    if (typeof canvas === "undefined" || !canvas) return;

    canvas.on("object:added", function() {
        saveState();
    });

    canvas.on("object:modified", function() {
        saveState();
    });

    canvas.on("object:removed", function() {
        saveState();
    });
}

/*=========================================
KEYBOARD SHORTCUTS
=========================================*/

document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        copyObject();
    }

    if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        pasteObject();
    }

    if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        duplicateObject();
    }

    if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
    }

    if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
    }

    if (e.key === "Delete") {
        deleteObject();
    }

    if (e.key === "Escape") {
        if (typeof canvas !== "undefined" && canvas) {
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    }
});

/*=========================================
BUTTON CONNECTOR
=========================================*/

[
    ["undoBtn", undo],
    ["redoBtn", redo],
    ["copyBtn", copyObject],
    ["pasteBtn", pasteObject],
    ["duplicateBtn", duplicateObject],
    ["deleteBtn", deleteObject],
    ["frontBtn", bringToFront],
    ["backBtn", sendToBack],
    ["lockBtn", toggleLock],
    ["zoomInBtn", zoomIn],
    ["zoomOutBtn", zoomOut],
    ["resetZoomBtn", resetZoom],
    ["leftBtn", alignLeft],
    ["centerBtn", alignCenter],
    ["rightBtn", alignRight],
    ["topBtn", alignTop],
    ["middleBtn", alignMiddle],
    ["bottomBtn", alignBottom]
].forEach(([id, fn]) => {
    let btn = document.getElementById(id);
    if (btn) {
        btn.onclick = fn;
    }
});

/*=========================================
INITIALIZATION
=========================================*/

window.addEventListener("load", function() {
    setTimeout(function() {
        setupCanvasListeners();
        saveState();
    }, 300);
});
