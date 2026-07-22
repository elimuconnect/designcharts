/*=========================================================
    SCHOOL WALL CHART DESIGNER PRO
    charts.js - Auto-Bounding Chart Builder Engine
=========================================================*/

"use strict";

window.ChartEngine = {
    /**
     * Calculates safe dimensions so objects never exceed remaining canvas space.
     * @param {Object} targetOpts - Desired position and initial size.
     * @returns {Object} Safe position and scaled dimensions.
     */
    getBoundedDimensions(targetOpts = {}) {
        if (!canvas) return { left: 50, top: 50, width: 400, height: 300, scale: 1 };

        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const padding = targetOpts.padding || 40;

        // Default insertion starting point
        let left = targetOpts.left !== undefined ? targetOpts.left : padding;
        let top = targetOpts.top !== undefined ? targetOpts.top : padding;

        // Calculate maximum allowed bounds from start position
        const maxWidth = canvasWidth - left - padding;
        const maxHeight = canvasHeight - top - padding;

        let width = targetOpts.width || 600;
        let height = targetOpts.height || 400;

        // Calculate scaling ratio if chart exceeds available area
        const scaleX = maxWidth / width;
        const scaleY = maxHeight / height;
        const autoScale = Math.min(1, scaleX, scaleY);

        return {
            left: Math.max(padding, left),
            top: Math.max(padding, top),
            width: width * autoScale,
            height: height * autoScale,
            scale: autoScale
        };
    },

    /**
     * Creates a standard Bar Chart safely contained inside paper bounds.
     */
    addBarChart(chartData, options = {}) {
        if (!canvas) return;

        const bounds = this.getBoundedDimensions(options);
        const data = chartData || {
            labels: ["Math", "Eng", "Kisw", "Sci", "Soc"],
            values: [85, 72, 90, 68, 78],
            color: "#1565C0"
        };

        const chartElements = [];
        const chartW = bounds.width;
        const chartH = bounds.height;

        // Background Card Frame
        const bgRect = new fabric.Rect({
            width: chartW,
            height: chartH,
            fill: "#ffffff",
            stroke: "#CBD5E1",
            strokeWidth: 1,
            rx: 8,
            ry: 8
        });
        chartElements.push(bgRect);

        // Calculate axis margins
        const margin = { top: 40, right: 20, bottom: 50, left: 50 };
        const plotWidth = chartW - margin.left - margin.right;
        const plotHeight = chartH - margin.top - margin.bottom;

        // Y-Axis line
        const yAxis = new fabric.Line(
            [margin.left, margin.top, margin.left, margin.top + plotHeight],
            { stroke: "#64748B", strokeWidth: 2 }
        );
        // X-Axis line
        const xAxis = new fabric.Line(
            [margin.left, margin.top + plotHeight, margin.left + plotWidth, margin.top + plotHeight],
            { stroke: "#64748B", strokeWidth: 2 }
        );
        chartElements.push(yAxis, xAxis);

        // Chart Title
        if (options.title) {
            const title = new fabric.Text(options.title, {
                left: chartW / 2,
                top: 12,
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: "Poppins",
                fill: "#1565C0",
                originX: "center"
            });
            chartElements.push(title);
        }

        // Render Bars & Labels
        const maxValue = Math.max(...data.values, 100);
        const barSpacing = plotWidth / data.labels.length;
        const barWidth = barSpacing * 0.55;

        data.values.forEach((val, index) => {
            const barH = (val / maxValue) * plotHeight;
            const barX = margin.left + (index * barSpacing) + (barSpacing - barWidth) / 2;
            const barY = margin.top + plotHeight - barH;

            // Bar shape
            const bar = new fabric.Rect({
                left: barX,
                top: barY,
                width: barWidth,
                height: barH,
                fill: data.color || "#1565C0",
                rx: 3,
                ry: 3
            });

            // Value label above bar
            const valLabel = new fabric.Text(String(val), {
                left: barX + barWidth / 2,
                top: barY - 16,
                fontSize: 11,
                fontFamily: "Poppins",
                fill: "#334155",
                originX: "center"
            });

            // Category X label
            const xLabel = new fabric.Text(data.labels[index], {
                left: barX + barWidth / 2,
                top: margin.top + plotHeight + 8,
                fontSize: 12,
                fontFamily: "Poppins",
                fill: "#475569",
                originX: "center"
            });

            chartElements.push(bar, valLabel, xLabel);
        });

        // Group all elements together into a single fabric object
        const chartGroup = new fabric.Group(chartElements, {
            left: bounds.left,
            top: bounds.top,
            customType: "Bar Chart",
            name: options.title || "Bar Chart"
        });

        canvas.add(chartGroup);
        canvas.setActiveObject(chartGroup);
        canvas.requestRenderAll();

        if (typeof saveHistory === "function") saveHistory();
        if (typeof refreshLayers === "function") refreshLayers();
    }
};
