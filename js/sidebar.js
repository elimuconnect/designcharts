/*==================================================
    SCHOOL WALL CHART DESIGNER PRO
    sidebar.js
==================================================*/

const toolContent = document.getElementById("toolContent");
const toolPanel = document.querySelector(".tool-panel");

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
PANEL COLLAPSE HELPERS
=========================================*/

function closeToolbox() {
    if (toolPanel) {
        toolPanel.classList.add("collapsed");
    }
}

function openToolbox() {
    if (toolPanel) {
        toolPanel.classList.remove("collapsed");
    }
}

function toggleToolbox() {
    if (toolPanel) {
        toolPanel.classList.toggle("collapsed");
    }
}

/*=========================================
REMOVE ACTIVE
=========================================*/

function clearActive() {
    Object.values(sidebarButtons).forEach(btn => {
        if (btn) btn.classList.remove("active");
    });
}

/*=========================================
OPEN / TOGGLE TOOL
=========================================*/

function openTool(name) {
    const targetBtn = sidebarButtons[name];
    if (!targetBtn) return;

    // If clicking the already active tool, toggle panel open/closed
    if (targetBtn.classList.contains("active") && toolPanel) {
        toggleToolbox();
        return;
    }

    clearActive();
    targetBtn.classList.add("active");
    openToolbox();

    switch (name) {
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

function showTextTools() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Text</h3>
            <button onclick="addTitle(); closeToolbox();">Main Title</button>
            <button onclick="addSubtitle(); closeToolbox();">Subtitle</button>
            <button onclick="addParagraph(); closeToolbox();">Paragraph</button>
            <button onclick="addBulletList(); closeToolbox();">Bullet List</button>
        </div>
    `;
}

/*=========================================
SHAPES
=========================================*/

function showShapeTools() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Shapes</h3>
            <div class="shape-grid">
                <div class="shape-item" onclick="addRectangle(); closeToolbox();">⬜</div>
                <div class="shape-item" onclick="addCircle(); closeToolbox();">⚪</div>
                <div class="shape-item" onclick="addLine(); closeToolbox();">➖</div>
                <div class="shape-item" onclick="addArrow(); closeToolbox();">➡</div>
                <div class="shape-item" onclick="addTriangle(); closeToolbox();">🔺</div>
                <div class="shape-item" onclick="addStar(); closeToolbox();">⭐</div>
            </div>
        </div>
    `;
}

/*=========================================
TEMPLATES
=========================================*/

function showTemplates() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Educational Templates</h3>
            <button onclick="chartTemplates.loadTemplate('math'); closeToolbox();">Mathematics</button>
            <button onclick="chartTemplates.loadTemplate('science'); closeToolbox();">Science</button>
            <button onclick="chartTemplates.loadTemplate('english'); closeToolbox();">English</button>
            <button onclick="chartTemplates.loadTemplate('ict'); closeToolbox();">ICT</button>
            <button onclick="chartTemplates.loadTemplate('agriculture'); closeToolbox();">Agriculture</button>
            <button onclick="chartTemplates.loadTemplate('cbc'); closeToolbox();">CBC Competencies</button>
        </div>
    `;
}

/*=========================================
IMAGES
=========================================*/

function showImages() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Images</h3>
            <button onclick="addImage(); closeToolbox();">Upload Image</button>
            <p>Drag images after uploading.</p>
        </div>
    `;
}

/*=========================================
TABLES
=========================================*/

function showTables() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Tables</h3>
            <button onclick="createTable(3,3); closeToolbox();">3 × 3</button>
            <button onclick="createTable(4,4); closeToolbox();">4 × 4</button>
            <button onclick="createTable(5,5); closeToolbox();">5 × 5</button>
        </div>
    `;
}

/*=========================================
ICONS
=========================================*/

function showIcons() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Icons</h3>
            <input placeholder="Search icons">
            <p>Icon library coming next.</p>
        </div>
    `;
}

/*=========================================
CHARTS
=========================================*/

function showCharts() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Charts</h3>
            <button onclick="insertBarChart(); closeToolbox();">Bar Chart</button>
            <button onclick="insertPieChart(); closeToolbox();">Pie Chart</button>
            <button onclick="insertLineChart(); closeToolbox();">Line Chart</button>
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
    if (window.ChartEngine && window.ChartEngine.addPieChart) {
        window.ChartEngine.addPieChart(
            {
                labels: ["Exceeding Expectations", "Meeting Expectations", "Approaching Expectations", "Below Expectations"],
                values: [40, 35, 15, 10],
                colors: ["#2E7D32", "#1565C0", "#F57C00", "#C62828"]
            },
            { title: "CBC Competency Levels", width: 480, height: 320 }
        );
    }
}

function insertLineChart() {
    if (window.ChartEngine && window.ChartEngine.addLineChart) {
        window.ChartEngine.addLineChart(
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

function showBackgrounds() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Background</h3>
            <input type="color" id="bgPicker">
        </div>
    `;

    setTimeout(() => {
        const picker = document.getElementById("bgPicker");
        if (picker) {
            picker.oninput = function() {
                canvas.backgroundColor = this.value;
                canvas.renderAll();
            };
        }
    }, 100);
}

/*=========================================
UPLOADS
=========================================*/

function showUploads() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>Uploads</h3>
            <button onclick="addImage(); closeToolbox();">Upload Photo</button>
        </div>
    `;
}

/*=========================================
SCHOOL LOGO
=========================================*/

function showLogos() {
    toolContent.innerHTML = `
        <div class="tool-card fadeIn">
            <h3>School Logo</h3>
            <button onclick="addImage(); closeToolbox();">Upload Logo</button>
        </div>
    `;
}

/*=========================================
EVENTS
=========================================*/

if (sidebarButtons.templates) sidebarButtons.templates.onclick = () => openTool("templates");
if (sidebarButtons.text) sidebarButtons.text.onclick = () => openTool("text");
if (sidebarButtons.images) sidebarButtons.images.onclick = () => openTool("images");
if (sidebarButtons.shapes) sidebarButtons.shapes.onclick = () => openTool("shapes");
if (sidebarButtons.tables) sidebarButtons.tables.onclick = () => openTool("tables");
if (sidebarButtons.icons) sidebarButtons.icons.onclick = () => openTool("icons");
if (sidebarButtons.charts) sidebarButtons.charts.onclick = () => openTool("charts");
if (sidebarButtons.backgrounds) sidebarButtons.backgrounds.onclick = () => openTool("backgrounds");
if (sidebarButtons.uploads) sidebarButtons.uploads.onclick = () => openTool("uploads");
if (sidebarButtons.logos) sidebarButtons.logos.onclick = () => openTool("logos");

/*=========================================
START
=========================================*/

openTool("templates");
