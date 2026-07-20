/*=========================================================
    SCHOOL WALL CHART DESIGNER PRO
    editor.js
=========================================================*/

"use strict";

/*=========================================================
    IMAGE INPUT SETUP
=========================================================*/

const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

/*=========================================================
    COMMON ADD FUNCTION
=========================================================*/

function addObject(obj) {
    if (typeof canvas === "undefined" || !canvas) {
        console.error("Fabric canvas instance is not defined.");
        return;
    }

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();

    if (typeof saveHistory === "function") {
        saveHistory();
    }

    if (typeof refreshLayers === "function") {
        refreshLayers();
    }
}

/*=========================================================
    PART 1: BASIC ELEMENTS
=========================================================*/

function addTitle() {
    addObject(
        new fabric.Textbox("MAIN TITLE", {
            left: 120,
            top: 80,
            width: 900,
            fontFamily: "Poppins",
            fontSize: 64,
            fontWeight: "bold",
            fill: "#1565C0",
            editable: true,
            name: "Main Title"
        })
    );
}

function addSubtitle() {
    addObject(
        new fabric.Textbox("Subtitle", {
            left: 120,
            top: 180,
            width: 800,
            fontFamily: "Poppins",
            fontSize: 36,
            fill: "#333333",
            name: "Subtitle"
        })
    );
}

function addParagraph() {
    addObject(
        new fabric.Textbox(
`Type your educational content here.

This text automatically wraps.

Perfect for school wall charts.`,
            {
                left: 120,
                top: 280,
                width: 900,
                fontFamily: "Poppins",
                fontSize: 28,
                lineHeight: 1.35,
                fill: "#222222",
                name: "Paragraph"
            }
        )
    );
}

function addTextbox() {
    addObject(
        new fabric.Textbox("Text", {
            left: 150,
            top: 150,
            width: 300,
            fontFamily: "Poppins",
            fontSize: 30,
            fill: "#000000",
            name: "Text Box"
        })
    );
}

function addRectangle() {
    addObject(
        new fabric.Rect({
            left: 180,
            top: 180,
            width: 300,
            height: 180,
            fill: "#90CAF9",
            stroke: "#1565C0",
            strokeWidth: 2,
            rx: 12,
            ry: 12,
            name: "Rectangle"
        })
    );
}

function addCircle() {
    addObject(
        new fabric.Circle({
            left: 200,
            top: 200,
            radius: 80,
            fill: "#4CAF50",
            stroke: "#2E7D32",
            strokeWidth: 2,
            name: "Circle"
        })
    );
}

function addEllipse() {
    addObject(
        new fabric.Ellipse({
            left: 220,
            top: 220,
            rx: 120,
            ry: 70,
            fill: "#FFF176",
            stroke: "#F9A825",
            strokeWidth: 2,
            name: "Ellipse"
        })
    );
}

function addTriangle() {
    addObject(
        new fabric.Triangle({
            left: 220,
            top: 220,
            width: 180,
            height: 180,
            fill: "#EF5350",
            stroke: "#C62828",
            strokeWidth: 2,
            name: "Triangle"
        })
    );
}

function addLine() {
    addObject(
        new fabric.Line([0, 0, 300, 0], {
            left: 200,
            top: 250,
            stroke: "#000000",
            strokeWidth: 4,
            name: "Line"
        })
    );
}

function addArrow() {
    const arrow = new fabric.Group(
        [
            new fabric.Line([0, 0, 220, 0], {
                stroke: "#E53935",
                strokeWidth: 5
            }),
            new fabric.Triangle({
                width: 25,
                height: 25,
                fill: "#E53935",
                left: 210,
                top: -10,
                angle: 90
            })
        ],
        {
            left: 180,
            top: 300,
            name: "Arrow"
        }
    );

    addObject(arrow);
}

function addImage() {
    imageInput.click();
}

imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const imgObj = new Image();
        imgObj.src = e.target.result;
        imgObj.onload = function () {
            const fabricImg = new fabric.Image(imgObj);
            fabricImg.scaleToWidth(350);
            fabricImg.set({
                left: 150,
                top: 120,
                name: "Image"
            });
            addObject(fabricImg);
        };
    };

    reader.readAsDataURL(file);
    // Reset value so re-uploading the same image triggers 'change'
    this.value = "";
});

/*=========================================================
    PART 2: ADVANCED ELEMENTS
=========================================================*/

function addRoundedBox() {
    addObject(
        new fabric.Rect({
            left: 150,
            top: 150,
            width: 350,
            height: 180,
            rx: 25,
            ry: 25,
            fill: "#E3F2FD",
            stroke: "#1565C0",
            strokeWidth: 3,
            name: "Rounded Box"
        })
    );
}

function addDiamond() {
    addObject(
        new fabric.Rect({
            left: 220,
            top: 180,
            width: 170,
            height: 170,
            angle: 45,
            fill: "#FFF59D",
            stroke: "#F9A825",
            strokeWidth: 3,
            name: "Diamond"
        })
    );
}

function addCallout() {
    const rect = new fabric.Rect({
        width: 320,
        height: 150,
        rx: 15,
        ry: 15,
        fill: "#FFFDE7",
        stroke: "#F9A825",
        strokeWidth: 2
    });

    const tri = new fabric.Triangle({
        width: 35,
        height: 35,
        fill: "#FFFDE7",
        stroke: "#F9A825",
        strokeWidth: 2,
        angle: 180,
        left: 75,
        top: 180
    });

    const txt = new fabric.Textbox("Callout", {
        width: 280,
        left: 20,
        top: 20,
        fontSize: 28,
        fontFamily: "Poppins",
        fill: "#333333"
    });

    addObject(
        new fabric.Group([rect, tri, txt], {
            left: 180,
            top: 180,
            name: "Callout"
        })
    );
}

function addNumberBox() {
    const circle = new fabric.Circle({
        radius: 35,
        fill: "#1565C0"
    });

    const num = new fabric.Text("1", {
        left: 25,
        top: 18,
        fill: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 30
    });

    const text = new fabric.Textbox("Learning Point", {
        left: 90,
        top: 18,
        width: 280,
        fontSize: 28,
        fontFamily: "Poppins",
        fill: "#222222"
    });

    addObject(
        new fabric.Group([circle, num, text], {
            left: 120,
            top: 120,
            name: "Number Box"
        })
    );
}

function addTable(rows = 4, cols = 4) {
    const objects = [];
    const cellW = 170;
    const cellH = 70;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            objects.push(
                new fabric.Rect({
                    left: c * cellW,
                    top: r * cellH,
                    width: cellW,
                    height: cellH,
                    fill: r === 0 ? "#1565C0" : "#FFFFFF",
                    stroke: "#333333"
                })
            );

            objects.push(
                new fabric.Text(r === 0 ? "Heading" : "", {
                    left: c * cellW + 15,
                    top: r * cellH + 20,
                    fill: r === 0 ? "#FFFFFF" : "#000000",
                    fontSize: 22,
                    fontFamily: "Poppins"
                })
            );
        }
    }

    addObject(
        new fabric.Group(objects, {
            left: 100,
            top: 120,
            name: "Table"
        })
    );
}

function addLogoPlaceholder() {
    const circle = new fabric.Circle({
        radius: 70,
        fill: "#ECEFF1",
        stroke: "#90A4AE",
        strokeWidth: 2
    });

    const txt = new fabric.Text("LOGO", {
        left: 36,
        top: 55,
        fontSize: 24,
        fontWeight: "bold",
        fill: "#455A64"
    });

    addObject(
        new fabric.Group([circle, txt], {
            left: 120,
            top: 100,
            name: "School Logo"
        })
    );
}

function addContentBox() {
    const rect = new fabric.Rect({
        width: 500,
        height: 260,
        fill: "#FFFFFF",
        stroke: "#1565C0",
        strokeWidth: 3,
        rx: 12,
        ry: 12
    });

    const title = new fabric.Text("CONTENT TITLE", {
        left: 20,
        top: 15,
        fontSize: 32,
        fontWeight: "bold",
        fill: "#1565C0"
    });

    const body = new fabric.Textbox(
`• Point One
• Point Two
• Point Three`,
        {
            left: 20,
            top: 70,
            width: 450,
            fontSize: 26,
            fontFamily: "Poppins",
            fill: "#333333"
        }
    );

    addObject(
        new fabric.Group([rect, title, body], {
            left: 120,
            top: 120,
            name: "Content Box"
        })
    );
}

function addDivider() {
    addObject(
        new fabric.Line([0, 0, 900, 0], {
            left: 80,
            top: 200,
            stroke: "#1565C0",
            strokeWidth: 6,
            name: "Divider"
        })
    );
}

/*=========================================================
    BUTTON EVENT BINDINGS
=========================================================*/

const editorButtons = [
    ["addTitle", addTitle],
    ["addSubtitle", addSubtitle],
    ["addParagraph", addParagraph],
    ["addTextbox", addTextbox],
    ["addRectangle", addRectangle],
    ["addCircle", addCircle],
    ["addEllipse", addEllipse],
    ["addTriangle", addTriangle],
    ["addLine", addLine],
    ["addArrow", addArrow],
    ["addImage", addImage],
    ["addRoundedBox", addRoundedBox],
    ["addDiamond", addDiamond],
    ["addCallout", addCallout],
    ["addNumberBox", addNumberBox],
    ["addTable", () => addTable(4, 4)],
    ["addLogoPlaceholder", addLogoPlaceholder],
    ["addContentBox", addContentBox],
    ["addDivider", addDivider]
];

document.addEventListener("DOMContentLoaded", () => {
    editorButtons.forEach(([id, fn]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", fn);
        }
    });
});

/*=========================================================
    GLOBAL PUBLIC API EXPOSE
=========================================================*/

window.editor = {
    addTitle,
    addSubtitle,
    addParagraph,
    addTextbox,
    addRectangle,
    addCircle,
    addEllipse,
    addTriangle,
    addLine,
    addArrow,
    addImage,
    addRoundedBox,
    addDiamond,
    addCallout,
    addNumberBox,
    addTable,
    addLogoPlaceholder,
    addContentBox,
    addDivider
};
