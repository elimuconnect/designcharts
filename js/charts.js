/*=========================================================
    SCHOOL WALL CHART DESIGNER PRO
    charts.js - Auto-Bounding Chart Builder Engine
=========================================================*/

"use strict";

window.ChartEngine = {
    /**
     * Calculates safe dimensions so objects never exceed remaining canvas space.
     */
    getBoundedDimensions(targetOpts = {}) {
        if (typeof canvas === "undefined" || !canvas) {
            return { left: 50, top: 50, width: 400, height: 300, scale: 1 };
        }

        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const padding = targetOpts.padding || 40;

        let left = targetOpts.left !== undefined ? targetOpts.left : padding;
        let top = targetOpts.top !== undefined ? targetOpts.top : padding;

        const maxWidth = canvasWidth - left - padding;
        const maxHeight = canvasHeight - top - padding;

        let width = targetOpts.width || 500;
        let height = targetOpts.height || 350;

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
     * BAR CHART
     */
    addBarChart(chartData, options = {}) {
        if (typeof canvas === "undefined" || !canvas) return;

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

        const margin = { top: 40, right: 20, bottom: 50, left: 50 };
        const plotWidth = chartW - margin.left - margin.right;
        const plotHeight = chartH - margin.top - margin.bottom;

        // Axes
        const yAxis = new fabric.Line(
            [margin.left, margin.top, margin.left, margin.top + plotHeight],
            { stroke: "#64748B", strokeWidth: 2 }
        );
        const xAxis = new fabric.Line(
            [margin.left, margin.top + plotHeight, margin.left + plotWidth, margin.top + plotHeight],
            { stroke: "#64748B", strokeWidth: 2 }
        );
        chartElements.push(yAxis, xAxis);

        // Title
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

            const bar = new fabric.Rect({
                left: barX,
                top: barY,
                width: barWidth,
                height: barH,
                fill: data.color || "#1565C0",
                rx: 3,
                ry: 3
            });

            const valLabel = new fabric.Text(String(val), {
                left: barX + barWidth / 2,
                top: barY - 16,
                fontSize: 11,
                fontFamily: "Poppins",
                fill: "#334155",
                originX: "center"
            });

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
    },

    /**
     * PIE CHART
     */
    addPieChart(chartData, options = {}) {
        if (typeof canvas === "undefined" || !canvas) return;

        const bounds = this.getBoundedDimensions(options);
        const data = chartData || {
            labels: ["Exceeding", "Meeting", "Approaching", "Below"],
            values: [40, 35, 15, 10],
            colors: ["#2E7D32", "#1565C0", "#F57C00", "#C62828"]
        };

        const chartElements = [];
        const chartW = bounds.width;
        const chartH = bounds.height;

        // Background Frame
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

        // Title
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

        const centerX = chartW * 0.38;
        const centerY = chartH * 0.55;
        const radius = Math.min(chartW, chartH) * 0.3;
        const total = data.values.reduce((a, b) => a + b, 0);

        let startAngle = -Math.PI / 2;

        data.values.forEach((val, i) => {
            const sliceAngle = (val / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const wedge = new fabric.Path(pathData, {
                fill: data.colors[i % data.colors.length],
                stroke: "#ffffff",
                strokeWidth: 1.5
            });
            chartElements.push(wedge);

            // Legend item
            const legendX = chartW * 0.7;
            const legendY = chartH * 0.3 + (i * 22);

            const legendBox = new fabric.Rect({
                left: legendX,
                top: legendY,
                width: 12,
                height: 12,
                fill: data.colors[i % data.colors.length],
                rx: 2,
                ry: 2
            });

            const legendText = new fabric.Text(`${data.labels[i]} (${val})`, {
                left: legendX + 18,
                top: legendY - 1,
                fontSize: 11,
                fontFamily: "Poppins",
                fill: "#334155"
            });

            chartElements.push(legendBox, legendText);
            startAngle = endAngle;
        });

        const chartGroup = new fabric.Group(chartElements, {
            left: bounds.left,
            top: bounds.top,
            customType: "Pie Chart",
            name: options.title || "Pie Chart"
        });

        canvas.add(chartGroup);
        canvas.setActiveObject(chartGroup);
        canvas.requestRenderAll();

        if (typeof saveHistory === "function") saveHistory();
        if (typeof refreshLayers === "function") refreshLayers();
    },

    /**
     * LINE CHART
     */
    addLineChart(chartData, options = {}) {
        if (typeof canvas === "undefined" || !canvas) return;

        const bounds = this.getBoundedDimensions(options);
        const data = chartData || {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            values: [60, 68, 75, 82, 90],
            color: "#D84315"
        };

        const chartElements = [];
        const chartW = bounds.width;
        const chartH = bounds.height;

        // Background Frame
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

        const margin = { top: 40, right: 30, bottom: 50, left: 50 };
        const plotWidth = chartW - margin.left - margin.right;
        const plotHeight = chartH - margin.top - margin.bottom;

        // Axes
        const yAxis = new fabric.Line(
            [margin.left, margin.top, margin.left, margin.top + plotHeight],
            { stroke: "#64748B", strokeWidth: 2 }
        );
        const xAxis = new fabric.Line(
            [margin.left, margin.top + plotHeight, margin.left + plotWidth, margin.top + plotHeight],
            { stroke: "#64748B", strokeWidth: 2 }
        );
        chartElements.push(yAxis, xAxis);

        // Title
        if (options.title) {
            const title = new fabric.Text(options.title, {
                left: chartW / 2,
                top: 12,
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: "Poppins",
                fill: "#D84315",
                originX: "center"
            });
            chartElements.push(title);
        }

        const maxValue = Math.max(...data.values, 100);
        const pointSpacing = plotWidth / (data.labels.length - 1 || 1);
        const points = [];

        data.values.forEach((val, i) => {
            const px = margin.left + i * pointSpacing;
            const py = margin.top + plotHeight - (val / maxValue) * plotHeight;
            points.push({ x: px, y: py });

            // Plot Point Circle
            const dot = new fabric.Circle({
                left: px,
                top: py,
                radius: 4,
                fill: data.color,
                originX: "center",
                originY: "center"
            });

            // Point Value
            const valText = new fabric.Text(String(val), {
                left: px,
                top: py - 14,
                fontSize: 10,
                fontFamily: "Poppins",
                fill: "#334155",
                originX: "center"
            });

            // X-Axis Label
            const xLabel = new fabric.Text(data.labels[i], {
                left: px,
                top: margin.top + plotHeight + 8,
                fontSize: 11,
                fontFamily: "Poppins",
                fill: "#475569",
                originX: "center"
            });

            chartElements.push(dot, valText, xLabel);
        });

        // Connecting Lines
        for (let i = 0; i < points.length - 1; i++) {
            const line = new fabric.Line(
                [points[i].x, points[i].y, points[i + 1].x, points[i + 1].y],
                { stroke: data.color, strokeWidth: 2.5 }
            );
            chartElements.push(line);
        }

        const chartGroup = new fabric.Group(chartElements, {
            left: bounds.left,
            top: bounds.top,
            customType: "Line Chart",
            name: options.title || "Line Chart"
        });

        canvas.add(chartGroup);
        canvas.setActiveObject(chartGroup);
        canvas.requestRenderAll();

        if (typeof saveHistory === "function") saveHistory();
        if (typeof refreshLayers === "function") refreshLayers();
    }
};
