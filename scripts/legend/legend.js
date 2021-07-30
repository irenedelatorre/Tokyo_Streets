class mapLegend {
    constructor(dateExtent, scaleColor, formatDate) {
        this.dateExtent = dateExtent;
        this.t = this.dateExtent[1];
        this.formatDate = formatDate;
        this.scaleColor = scaleColor;
        this.margin = {
            t: 7,
            l: 20,
            r: 18,
            b: 25,
            middle: 10,
            bottom: 8
        };

        this.legendWidth = document.getElementById("plot-legend").clientWidth -this. margin.r - this.margin.l;
        this.legendHeight = document.getElementById("plot-legend").clientHeight - this.margin.t - this.margin.b;

        this.legendData = [
            {value: 0, text: "0 - 0.125", y: 0, x: 0},
            {value: 0.126, text: "0.125", y: 1, x: 0},
            {value: 5, text: "5", y: 1, x: 1},
            {value: 12, text: "11", y: 1, x: 2},
            {value: 17, text: "17", y: 1, x: 3},
            {value: 22, text: "22", y: 1, x: 4},
            {value: 100, text: "100%", y: 1, x: 5}
        ];

        this.createSVG();
        this.createLegend();
    }

    createSVG() {
        this.legendContainer = d3.select("#plot-legend")
            .append("svg")
            .attr("width", this.legendWidth + this.margin.r + this.margin.l)
            .attr("height", this.legendHeight + this.margin.b + this.margin.t);

        this.plotLegend = this.legendContainer
            .append("g")
            .attr("transform", `translate(${this.margin.l}, ${this.margin.t})`);
    }

    createLegend() {
        this.updateLegendDate(this.t);

        this.itemLegendW = this.legendWidth / (this.legendData.length - 2);
        this.itemLegendH = this.legendHeight * 0.5 - this.margin.middle;

        this.plotLegend
            .selectAll(".legend-item-rect")
            .data(this.legendData.filter(d => d.value !== 100))
            .join("rect")
            .attr("class", d => `legend-item-rect ${d.text}`)
            .attr("width", this.itemLegendW)
            .attr("height", this.itemLegendH)
            .attr("x", d => d.x * this.itemLegendW)
            .attr("y", d => d.y * (this.itemLegendH + this.margin.middle))
            .style("stroke", d => (d.value === 0) ? "#E6E6E6" : "#ffffff")
            .style("fill", d => this.scaleColor(d.value));

        this.plotLegend
            .selectAll(".legend-item-line")
            .data(this.legendData.filter(d => d.value !== 0))
            .join("line")
            .attr("class", d => `legend-item-line ${d.text}`)
            .attr("x1", d => d.x * this.itemLegendW)
            .attr("x2", d => d.x * this.itemLegendW)
            .attr("y1", this.itemLegendH * 3)
            .attr("y2", this.itemLegendH * 3 + this.margin.bottom / 3);

        this.plotLegend
            .selectAll(".legend-item-text")
            .data(this.legendData)
            .join("text")
            .attr("class", d => `legend-item-text ${d.text}`)
            .text(d => d.text)
            .attr("text-anchor", d => (d.value === 0) ? "start" : "middle")
            .attr("x", d => (d.value === 0) ? this.itemLegendW + this.margin.middle : d.x * this.itemLegendW)
            .attr("y", d => (d.value === 0) ? this.itemLegendH : d.y * (this.itemLegendH * 3 + 10 + this.margin.bottom));

        
    }

    updateLegendDate(t) {
        d3.selectAll("#map-date")
            .html(this.formatDate(t))
    }
}