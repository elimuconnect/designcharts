/*=========================================================
    SCHOOL WALL CHART DESIGNER PRO
    canvas.js - Fully Fixed & Optimized
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

// History control flag to prevent event feedback loops
let isHistoryAction = false;
let history = [];
let historyIndex = -1;

/*=========================================================
    PAPER SIZES (96 DPI Editing Sizes)
=========================================================*/

const PAPER_SIZES = {
    A4: { width: 794, height: 1123 },
    A3: { width: 1123, height: 1587 },
    A2: { width: 1587, height: 2245 },
    A1: { width: 2245, height: 3179 },
    A0: { width: 3179, height: 4494 }
};

/*=========================================================
    AUTO-CENTER & FIT HELPERS
=========================================================*/

function centerWorkspaceCanvas() {
    const workspace = document.querySelector('.workspace');
    if (workspace) {
        // Automatically scroll to center the wall chart in view
        workspace.scrollLeft = (workspace.scrollWidth - workspace.clientWidth) / 2;
        workspace.scrollTop = (workspace.scrollHeight - workspace.clientHeight) / 2;
    }
}

/*=========================================================
    INITIALIZE
=========================================================*/

window.addEventListener("DOMContentLoaded", initCanvas);

function initCanvas() {
    canvas = new fabric.Canvas("designerCanvas", {
        preserveObjectStacking: true,
        selection: true,
        fireRightClick: true,
        stopContextMenu: true,
        backgroundColor: "#ffffff"
    });

    applyPaperSize(currentPaper);
    registerCanvasEvents();
    registerToolbarEvents();
    registerPropertyEvents();

    // Save initial canvas state for History
    saveHistory();

    canvas.renderAll();
    refreshLayers();
}

/*=========================================================
    PAPER SIZE & ORIENTATION
=========================================================*/

function applyPaperSize(size) {
    currentPaper = size;
    let width = PAPER_SIZES[size].width;
    let height = PAPER_SIZES[size].height;

    if (currentOrientation === "landscape") {
        const temp = width;
        width = height;
        height = temp;
    }

    canvas.setDimensions({ width, height });
    canvas.requestRenderAll();

    // Automatically fit any page format (A4 to A0) inside the workspace view
    requestAnimationFrame(() => {
        fitPage();
        centerWorkspaceCanvas();
    });
}

function setOrientation(mode) {
    currentOrientation = mode;
    applyPaperSize(currentPaper);
}

/*=========================================================
    ZOOM CONTROLS
=========================================================*/

function setZoom(value) {
    value = Math.max(0.05, Math.min(value, 3)); // Lower floor (0.05) to accommodate huge A0 charts
    currentZoom = value;

    // Zoom from center of viewport
    const center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
    canvas.zoomToPoint(center, value);
    canvas.requestRenderAll();

    const slider = document.getElementById("zoomSlider");
    if (slider) slider.value = value * 100;

    const label = document.getElementById("zoomValue");
    if (label) label.textContent = Math.round(value * 100) + "%";

    centerWorkspaceCanvas();
}

function fitPage() {
    const workspace = document.querySelector(".workspace");
    if (!workspace || !canvas) return;

    const padding = 80;
    const zoomX = (workspace.clientWidth - padding) / canvas.getWidth();
    const zoomY = (workspace.clientHeight - padding) / canvas.getHeight();
    let zoom = Math.min(zoomX, zoomY);

    // Caps zoom at 100% max, but lets large charts (A2/A1/A0) zoom out as far as needed to fit
    setZoom(zoom);
}

function resetZoom() {
    setZoom(1);
}

/*=========================================================
    BACKGROUND & CLEAR
=========================================================*/

function setCanvasBackground(color) {
    if (!canvas) return;
    canvas.backgroundColor = color;
    canvas.requestRenderAll();
    saveHistory();
}

function clearCanvas() {
    if (!confirm("Create a new project? Unsaved work will be lost.")) return;

    // Safely remove objects without destroying background or handlers
    canvas.discardActiveObject();
    canvas.getObjects().slice().forEach(obj => canvas.remove(obj));
    
    canvas.backgroundColor = "#ffffff";
    applyPaperSize(currentPaper);
    canvas.requestRenderAll();
    
    saveHistory();
    refreshLayers();
}

/*=========================================================
    EVENT REGISTRATIONS
=========================================================*/

function registerToolbarEvents() {
    const paper = document.getElementById("paperSize");
    if (paper) paper.addEventListener("change", e => applyPaperSize(e.target.value));

    const orientation = document.getElementById("orientation");
    if (orientation) orientation.addEventListener("change", e => setOrientation(e.target.value));

    const zoom = document.getElementById("zoomSlider");
    if (zoom) zoom.addEventListener("input", e => setZoom(e.target.value / 100));

    // Fit & Reset Zoom UI Handlers
    const fitBtn = document.getElementById("fitBtn");
    if (fitBtn) fitBtn.addEventListener("click", fitPage);

    const resetZoomBtn = document.getElementById("resetZoomBtn");
    if (resetZoomBtn) resetZoomBtn.addEventListener("click", resetZoom);

    const newBtn = document.getElementById("newBtn");
    if (newBtn) newBtn.addEventListener("click", clearCanvas);

    const undoBtn = document.getElementById("undoBtn");
    if (undoBtn) undoBtn.onclick = undo;

    const redoBtn = document.getElementById("redoBtn");
    if (redoBtn) redoBtn.onclick = redo;

    // Action buttons
    const actions = [
        ["deleteObject", deleteSelected],
        ["duplicateBtn", duplicateSelected],
        ["copyBtn", copySelected],
        ["pasteBtn", pasteSelected],
        ["frontBtn", bringForward],
        ["backBtn", sendBackward]
    ];

    actions.forEach(([id, fn]) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", fn);
    });

    // Alignment buttons
    [
        ["leftBtn", "left"],
        ["centerBtn", "center"],
        ["rightBtn", "right"],
        ["topBtn", "top"],
        ["middleBtn", "middle"],
        ["bottomBtn", "bottom"]
    ].forEach(([id, pos]) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", () => alignObject(pos));
    });
}

function registerCanvasEvents() {
    canvas.on("selection:created", selectionChanged);
    canvas.on("selection:updated", selectionChanged);
    canvas.on("selection:cleared", selectionChanged);

    canvas.on("object:modified", saveHistory);

    // Mouse wheel zoom
    canvas.on("mouse:wheel", opt => {
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** opt.e.deltaY;
        zoom = Math.min(3, Math.max(0.05, zoom));
        setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });
}

function selectionChanged() {
    updateProperties();
    refreshLayers();
}

/*=========================================================
    OBJECT EDITING & SHORTCUTS
=========================================================*/

function deleteSelected() {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects.length) return;

    activeObjects.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    saveHistory();
}

function duplicateSelected() {
    const obj = canvas.getActiveObject();
    if (!obj) return;

    obj.clone(cloned => {
        canvas.discardActiveObject();
        cloned.set({
            left: cloned.left + 20,
            top: cloned.top + 20,
            evented: true
        });

        if (cloned.type === "activeSelection") {
            cloned.canvas = canvas;
            cloned.forEachObject(o => canvas.add(o));
            cloned.setCoords();
        } else {
            canvas.add(cloned);
        }

        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
        saveHistory();
    });
}

function copySelected() {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.clone(cloned => {
        clipboard = cloned;
    });
}

function pasteSelected() {
    if (!clipboard) return;

    clipboard.clone(cloned => {
        canvas.discardActiveObject();
        cloned.set({
            left: cloned.left + 20,
            top: cloned.top + 20,
            evented: true
        });

        if (cloned.type === "activeSelection") {
            cloned.canvas = canvas;
            cloned.forEachObject(o => canvas.add(o));
            cloned.setCoords();
        } else {
            canvas.add(cloned);
        }

        clipboard.top += 20;
        clipboard.left += 20;

        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
        saveHistory();
    });
}

function bringForward() {
    const obj = canvas.getActiveObject();
    if (obj) {
        canvas.bringForward(obj);
        canvas.requestRenderAll();
        saveHistory();
    }
}

function sendBackward() {
    const obj = canvas.getActiveObject();
    if (obj) {
        canvas.sendBackwards(obj);
        canvas.requestRenderAll();
        saveHistory();
    }
}

function centerObject() {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.center();
    obj.setCoords();
    canvas.requestRenderAll();
    saveHistory();
}

function moveSelected(dx, dy) {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.left += dx;
    obj.top += dy;
    obj.setCoords();
    canvas.requestRenderAll();
}

/* Keyboard Shortcuts */
document.addEventListener("keydown", e => {
    if (!canvas) return;

    const active = document.activeElement;
    if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) {
        return;
    }

    if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
    }

    if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === "d") { e.preventDefault(); duplicateSelected(); }
        if (key === "c") { e.preventDefault(); copySelected(); }
        if (key === "v") { e.preventDefault(); pasteSelected(); }
        if (key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
        if (key === "y" || (key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
    }

    const step = e.shiftKey ? 10 : 1;
    switch (e.key) {
        case "ArrowLeft": e.preventDefault(); moveSelected(-step, 0); break;
        case "ArrowRight": e.preventDefault(); moveSelected(step, 0); break;
        case "ArrowUp": e.preventDefault(); moveSelected(0, -step); break;
        case "ArrowDown": e.preventDefault(); moveSelected(0, step); break;
    }
});

/*=========================================================
    ALIGNMENT & PROPERTIES
=========================================================*/

function alignObject(position) {
    const obj = canvas.getActiveObject();
    if (!obj) return;

    const w = canvas.getWidth();
    const h = canvas.getHeight();

    let targetX = obj.left;
    let targetY = obj.top;
    let originX = "left";
    let originY = "top";

    switch (position) {
        case "left":
            targetX = 0;
            originX = "left";
            break;
        case "center":
            targetX = w / 2;
            originX = "center";
            break;
        case "right":
            targetX = w;
            originX = "right";
            break;
        case "top":
            targetY = 0;
            originY = "top";
            break;
        case "middle":
            targetY = h / 2;
            originY = "center";
            break;
        case "bottom":
            targetY = h;
            originY = "bottom";
            break;
    }

    obj.setPositionByOrigin(
        new fabric.Point(targetX, targetY),
        originX,
        originY
    );

    obj.setCoords();
    canvas.requestRenderAll();
    saveHistory();
}

function updateProperties() {
    const obj = canvas.getActiveObject();
    if (!obj) return;

    const text = document.getElementById("objectText");
    const font = document.getElementById("fontFamily");
    const size = document.getElementById("fontSize");
    const color = document.getElementById("textColor");
    const opacity = document.getElementById("opacity");

    if (text) text.value = obj.text !== undefined ? obj.text : "";
    if (font && obj.fontFamily) font.value = obj.fontFamily;
    if (size && obj.fontSize) size.value = obj.fontSize;
    if (color && obj.fill) color.value = obj.fill;
    if (opacity) opacity.value = Math.round((obj.opacity ?? 1) * 100);
}

/*=========================================================
    LAYERS PANEL
=========================================================*/

function getLayerLabel(obj) {
    if (obj.name) return obj.name;
    if (obj.customType) return obj.customType;

    switch (obj.type) {
        case "i-text":
        case "textbox":
        case "text":
            if (obj.text) {
                const cleanText = obj.text.trim();
                return cleanText.length > 15 ? cleanText.substring(0, 15) + "..." : cleanText;
            }
            return "Text Block";
        case "rect":
            return "Rectangle";
        case "circle":
            return "Circle";
        case "triangle":
            return "Triangle";
        case "image":
            return "Image / Logo";
        case "group":
            return "Grouped Object";
        case "path":
            return "Drawing / Shape";
        default:
            return obj.type ? obj.type.charAt(0).toUpperCase() + obj.type.slice(1) : "Object";
    }
}

function refreshLayers() {
    const list = document.getElementById("layersList");
    if (!list || !canvas) return;

    list.innerHTML = "";
    const objects = canvas.getObjects().slice().reverse();

    objects.forEach((obj) => {
        const li = document.createElement("li");
        li.textContent = getLayerLabel(obj);

        if (canvas.getActiveObject() === obj) {
            li.classList.add("active-layer");
        }

        li.onclick = () => {
            canvas.setActiveObject(obj);
            canvas.requestRenderAll();
        };
        list.appendChild(li);
    });
}

function registerPropertyEvents() {
    const text = document.getElementById("objectText");
    if (text) {
        text.addEventListener("input", () => {
            const obj = canvas.getActiveObject();
            if (obj && obj.text !== undefined) {
                obj.set("text", text.value);
                canvas.requestRenderAll();
            }
        });
    }

    const font = document.getElementById("fontFamily");
    if (font) {
        font.addEventListener("change", () => {
            const obj = canvas.getActiveObject();
            if (obj) {
                obj.set("fontFamily", font.value);
                canvas.requestRenderAll();
            }
        });
    }

    const size = document.getElementById("fontSize");
    if (size) {
        size.addEventListener("input", () => {
            const obj = canvas.getActiveObject();
            if (obj) {
                obj.set("fontSize", Number(size.value));
                canvas.requestRenderAll();
            }
        });
    }

    const color = document.getElementById("textColor");
    if (color) {
        color.addEventListener("input", () => {
            const obj = canvas.getActiveObject();
            if (obj) {
                obj.set("fill", color.value);
                canvas.requestRenderAll();
            }
        });
    }

    const bg = document.getElementById("backgroundColor");
    if (bg) {
        bg.addEventListener("input", () => setCanvasBackground(bg.value));
    }

    const opacity = document.getElementById("opacity");
    if (opacity) {
        opacity.addEventListener("input", () => {
            const obj = canvas.getActiveObject();
            if (obj) {
                obj.set("opacity", opacity.value / 100);
                canvas.requestRenderAll();
            }
        });
    }
}

/*=========================================================
    HISTORY (UNDO / REDO)
=========================================================*/

function saveHistory() {
    if (isHistoryAction || !canvas) return;

    history = history.slice(0, historyIndex + 1);
    history.push(JSON.stringify(canvas));
    historyIndex++;
}

function undo() {
    if (historyIndex <= 0) return;

    isHistoryAction = true;
    historyIndex--;

    canvas.loadFromJSON(history[historyIndex], () => {
        canvas.renderAll();
        refreshLayers();
        isHistoryAction = false;
    });
}

function redo() {
    if (historyIndex >= history.length - 1) return;

    isHistoryAction = true;
    historyIndex++;

    canvas.loadFromJSON(history[historyIndex], () => {
        canvas.renderAll();
        refreshLayers();
        isHistoryAction = false;
    });
}

/*=========================================================
    WINDOW RESIZE & PUBLIC API
=========================================================*/

window.addEventListener("resize", () => {
    if (canvas) {
        canvas.calcOffset();
        fitPage();
    }
});

window.canvasEditor = {
    get canvas() { return canvas; },
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
    updateProperties,
    refreshLayers,
    saveHistory,
    undo,
    redo
};
