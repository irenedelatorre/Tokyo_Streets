class meters_through_time {
    constructor(data, extentDate, years) {
        this.data = data;
        this.extentDate = extentDate;
        this.years = years;
        this.margin = {
            t: 15,
            l: 60,
            r: 15,
            b: 25,
            text: 10
        };
        const width = document.getElementById("meters-time-plot").clientWidth;
        const height = document.getElementById("meters-time-plot").clientHeight;
        this.width = width - this.margin.r - this.margin.l;
        this.height = height - this.margin.t - this.margin.b;

        // svg
        this.plot = d3.select("#meters-time-plot")
            .append("svg")
            .attr("width", this.width + this.margin.r + this.margin.l)
            .attr("height", this.height + this.margin.t + this.margin.b);

        // scales
        this.scaleX = d3.scaleTime()
            .domain(this.extentDate)
            .range([0, this.width]);

        this.extentValue = d3.extent(data, d => d[1]);

        this.scaleY = d3.scaleLinear()
            .domain([0, this.extentValue[1]]).nice()
            .range([this.height, 0]);

        this.createAreaChart(this.years, "build");
        this.timeLine(this.extentDate[1]);
    }

    // creates the area chart
    createAreaChart(years, action) {

        // axis
        const axisX = d3.axisBottom(this.scaleX)
            .tickFormat(d => {
                if (this.width < 300) {
                    return d3.timeFormat("%y")(d);
                } else {
                    return d3.timeFormat("%Y")(d);
                }
            })
            .tickPadding(8)
            .tickValues(years);

        const axisY = d3.axisLeft()
            .scale(this.scaleY)
            .tickSize(-this.width)
            .ticks(6)
            .tickPadding(5);

        // area function
        const area = d3.area()
            .x(d => this.scaleX(d[0]))
            .y0(d => this.scaleY(0))
            .y1(d => this.scaleY(d[1]));

        // if it"s the first time the SVG is being drawn
        if (action === "build") {
            this.axisY = this.plot
                .append("g")
                .attr("class", "axis axis-y");

            this.plotChart = this.plot
                .append("g")
                .attr("class", "area");

            this.plotTimeLine = this.plot
                .append("g")
                .attr("class", "timeLine");

            this.axisX = this.plot
                .append("g")
                .attr("class", "axis axis-x");
        }

        this.axisY
            .attr("transform", `translate(${this.margin.l}, ${this.margin.t})`);

        this.plotChart
            .attr("transform", `translate(${this.margin.l}, ${this.margin.t})`);

        this.plotTimeLine
            .attr("transform", `translate(${this.margin.l}, ${this.margin.t})`);

        this.axisX
            .attr("transform",
                `translate(${this.margin.l}, ${this.height + this.margin.t})`);

        this.plotChart
            .selectAll("path")
            .data([this.data])
            .join("path")
            .attr("d", area);

        this.plot
            .selectAll(".axis-x")
            .call(axisX);

        this.plot
            .selectAll(".axis-y")
            .call(axisY);
    }

    timeLine(date) {
        const format = d3.format(",");

        const scaleText = d3.scaleLinear()
            .domain([40, this.width - 30])
            .range([40, this.width - 30])
            .clamp(true);

        const formatDate = d3.timeFormat("%B %Y");

        this.plotTimeLine
            .selectAll("line")
            .data([date])
            .join("line")
            .attr("x1", this.scaleX(date))
            .attr("y1", this.scaleY(0))
            .attr("x2", this.scaleX(date))
            .attr("y2", this.scaleY(this.extentValue[1]) - 5);

        this.plotTimeLine
            .selectAll("text")
            .data((this.data).filter(d =>
                formatDate(d[0]) === formatDate(date)
            ))
            .join("text")
            .text(d => `${format(d[1])} m`)
            .attr("x", scaleText(this.scaleX(date)))
            .attr("y", this.scaleY(this.extentValue[1]) - this.margin.text);
    }

    resize() {
        const width = document.getElementById("meters-time-plot").clientWidth;
        const height = document.getElementById("meters-time-plot").clientHeight;
        this.width = width - this.margin.r - this.margin.l;
        this.height = height - this.margin.t - this.margin.b;

        // svg
        this.plot
            .attr("width", this.width + this.margin.r + this.margin.l)
            .attr("height", this.height + this.margin.t + this.margin.b);

        this.scaleX.range([0, this.width]);

        this.createAreaChart(this.years, "resize");
        this.timeLine(this.extentDate[1]);
    }
}