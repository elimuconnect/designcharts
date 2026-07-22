/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    sidebar.js
==================================================*/

const toolContent = document.getElementById("toolContent");

/*=========================================
REGISTER ALL SIDEBAR BUTTONS
=========================================*/

const sidebarButtons = {

    templates: document.getElementById("toolTemplates"),

    text: document.getElementById("toolText"),

    images: document.getElementById("toolImages"),

    shapes: document.getElementById("toolShapes"),

    tables: document.getElementById("toolTables"),

    icons: document.getElementById("toolIcons"),

    charts: document.getElementById("toolCharts"),

    backgrounds: document.getElementById("toolBackground"),

    uploads: document.getElementById("toolUploads"),

    logos: document.getElementById("toolLogos")

};

/*=========================================
REMOVE ACTIVE
=========================================*/

function clearActive(){

    Object.values(sidebarButtons).forEach(btn=>{

        btn.classList.remove("active");

    });

}

/*=========================================
OPEN TOOL
=========================================*/

function openTool(name){

    clearActive();

    sidebarButtons[name].classList.add("active");

    switch(name){

        case "text":

            showTextTools();

            break;

        case "shapes":

            showShapeTools();

            break;

        case "templates":

            showTemplates();

            break;

        case "images":

            showImages();

            break;

        case "tables":

            showTables();

            break;

        case "icons":

            showIcons();

            break;

        case "charts":

            showCharts();

            break;

        case "backgrounds":

            showBackgrounds();

            break;

        case "uploads":

            showUploads();

            break;

        case "logos":

            showLogos();

            break;

    }

}

/*=========================================
TEXT
=========================================*/

function showTextTools(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Text</h3>

<button onclick="addTitle()">

Main Title

</button>

<button onclick="addSubtitle()">

Subtitle

</button>

<button onclick="addParagraph()">

Paragraph

</button>

<button onclick="addBulletList()">

Bullet List

</button>

</div>

`;

}

/*=========================================
SHAPES
=========================================*/

function showShapeTools(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Shapes</h3>

<div class="shape-grid">

<div class="shape-item"
onclick="addRectangle()">⬜</div>

<div class="shape-item"
onclick="addCircle()">⚪</div>

<div class="shape-item"
onclick="addLine()">➖</div>

<div class="shape-item"
onclick="addArrow()">➡</div>

<div class="shape-item"
onclick="addTriangle()">🔺</div>

<div class="shape-item"
onclick="addStar()">⭐</div>

</div>

</div>

`;

}

/*=========================================
TEMPLATES
=========================================*/

function showTemplates(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Educational Templates</h3>

<button onclick="chartTemplates.loadTemplate('math')">

Mathematics

</button>

<button onclick="chartTemplates.loadTemplate('science')">

Science

</button>

<button onclick="chartTemplates.loadTemplate('english')">

English

</button>

<button onclick="chartTemplates.loadTemplate('ict')">

ICT

</button>

<button onclick="chartTemplates.loadTemplate('agriculture')">

Agriculture

</button>

<button onclick="chartTemplates.loadTemplate('cbc')">

CBC Competencies

</button>

</div>

`;

}

/*=========================================
IMAGES
=========================================*/

function showImages(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Images</h3>

<button onclick="addImage()">

Upload Image

</button>

<p>

Drag images after uploading.

</p>

</div>

`;

}

/*=========================================
TABLES
=========================================*/

function showTables(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Tables</h3>

<button onclick="createTable(3,3)">

3 × 3

</button>

<button onclick="createTable(4,4)">

4 × 4

</button>

<button onclick="createTable(5,5)">

5 × 5

</button>

</div>

`;

}

/*=========================================
ICONS
=========================================*/

function showIcons(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Icons</h3>

<input
placeholder="Search icons">

<p>

Icon library coming next.

</p>

</div>

`;

}

/*=========================================
CHARTS
=========================================*/

function showCharts(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Charts</h3>

<button onclick="insertBarChart()">

Bar Chart

</button>

<button onclick="insertPieChart()">

Pie Chart

</button>

<button onclick="insertLineChart()">

Line Chart

</button>

</div>

`;

}

/* Chart Handlers connected to ChartEngine */
function insertBarChart() {
    if (window.ChartEngine && window.ChartEngine.addBarChart) {
        window.ChartEngine.addBarChart(
            {
                labels: ["Term 1", "Term 2", "Term 3"],
                values: [78, 85, 92],
                color: "#1565C0"
            },
            { title: "Subject Performance", width: 480, height: 320 }
        );
    }
}

function insertPieChart() {
    if (window.ChartEngine && window.ChartEngine.addBarChart) {
        window.ChartEngine.addBarChart(
            {
                labels: ["Exceeding", "Meeting", "Approaching", "Below"],
                values: [40, 35, 15, 10],
                color: "#2E7D32"
            },
            { title: "CBC Competency Levels", width: 480, height: 320 }
        );
    }
}

function insertLineChart() {
    if (window.ChartEngine && window.ChartEngine.addBarChart) {
        window.ChartEngine.addBarChart(
            {
                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                values: [60, 68, 75, 82, 90],
                color: "#D84315"
            },
            { title: "Monthly Attendance (%)", width: 480, height: 320 }
        );
    }
}

/*=========================================
BACKGROUND
=========================================*/

function showBackgrounds(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Background</h3>

<input
type="color"
id="bgPicker">

</div>

`;

setTimeout(()=>{

const picker=document.getElementById("bgPicker");

picker.oninput=function(){

canvas.backgroundColor=this.value;

canvas.renderAll();

}

},100);

}

/*=========================================
UPLOADS
=========================================*/

function showUploads(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>Uploads</h3>

<button onclick="addImage()">

Upload Photo

</button>

</div>

`;

}

/*=========================================
SCHOOL LOGO
=========================================*/

function showLogos(){

toolContent.innerHTML=`

<div class="tool-card fadeIn">

<h3>School Logo</h3>

<button onclick="addImage()">

Upload Logo

</button>

</div>

`;

}

/*=========================================
EVENTS
=========================================*/

sidebarButtons.templates.onclick=()=>openTool("templates");

sidebarButtons.text.onclick=()=>openTool("text");

sidebarButtons.images.onclick=()=>openTool("images");

sidebarButtons.shapes.onclick=()=>openTool("shapes");

sidebarButtons.tables.onclick=()=>openTool("tables");

sidebarButtons.icons.onclick=()=>openTool("icons");

sidebarButtons.charts.onclick=()=>openTool("charts");

sidebarButtons.backgrounds.onclick=()=>openTool("backgrounds");

sidebarButtons.uploads.onclick=()=>openTool("uploads");

sidebarButtons.logos.onclick=()=>openTool("logos");

/*=========================================
START
=========================================*/

openTool("templates");
