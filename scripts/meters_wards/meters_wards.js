class meters_by_wards {
    constructor(data, extentDate, scaleColor) {
        this.data = data[0];
        this.max = data[1];
        this.extentDate = extentDate;
        this.margin = {
            t: 30,
            l: 160,
            r: 30,
            b: 25
        };
        this.scaleColor = scaleColor;

        this.t = this.extentDate[1];
        this.dateSummary = (Array.from(this.data, (d) => {
            return {
                key: d[0],
                value: d[this.t]
            }
        })
        ).sort((a,b) => a.value - b.value);

        console.log(this.dateSummary)
        this.wards = this.dateSummary.map(d => d.key);

        this.width = document.getElementById('meters-by-district-plot').clientWidth - this.margin.r - this.margin.l;
        this.height = document.getElementById('meters-by-district-plot').clientHeight - this.margin.t - this.margin.b;

        this.scaleX = d3.scaleLinear()
            .domain([0, this.max]).nice()
            .range([0, this.width]);

        this.scaleY = d3.scaleBand()
            .domain(this.wards)
            .range([this.height, 0])
            .padding(0.1);


        // svg
        this.plot = d3.select('#meters-by-district-plot')
            .append('svg')
            .attr('width', this.width + this.margin.r + this.margin.l)
            .attr('height', this.height + this.margin.t + this.margin.b);

        this.createBarChart();

    }

    createBarChart() {
        // axis
        const axisX = d3.axisTop(this.scaleX)
            .tickPadding(8)
            .tickSize(-this.height)
            .ticks(5);
    
        const axisY = d3.axisLeft()
            .scale(this.scaleY)
            .ticks(6)
            .tickPadding(5);

        this.plot
            .append('g')
            .attr('class', 'axis axis-y')
            .attr('transform', `translate(${this.margin.l}, ${this.margin.t})`);

        this.plotBars = this.plot
            .append('g')
            .attr('class', 'bars')
            .attr('transform', `translate(${this.margin.l}, ${this.margin.t})`);

        this.plot
            .append('g')
            .attr('class', 'axis axis-x')
            .attr(
                'transform',
                `translate(${this.margin.l}, ${this.margin.t})`
            );

        this.plot
            .selectAll('.axis-x')
            .call(axisX);
    
        this.plot
            .selectAll('.axis-y')
            .call(axisY);

        this.plotBars
            .selectAll('rect')
            .data(this.dateSummary)
            .join("rect")
            .style("fill", d => this.scaleColor(100 * d.value / this.max))
            .attr("y", d => this.scaleY(d.key))
            .attr("x", d => this.scaleX(0))
            .attr("width", d => this.scaleX(d.value))
            .attr("height", this.scaleY.bandwidth());

        this.plotBars
            .selectAll('text')
            .data(this.dateSummary)
            .join("text")
            .style("fill", d => this.scaleColor(100 * d.value / this.max))
            .attr("y", d => this.scaleY(d.key))
            .attr("x", d => this.scaleX(0))
            .attr("width", d => this.scaleX(d.value))
            .attr("height", this.scaleY.bandwidth());

    
    }
}