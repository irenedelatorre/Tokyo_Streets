class meters_by_wards {
    constructor(data, extentDate, scaleColor) {
        this.data = data[0];
        this.max = data[1];
        this.extentDate = extentDate;
        this.margin = {
            t: 1.5,
            b: 1.5
        };
        this.scaleColor = scaleColor;
        this.format = d3.format(",");

        this.t = this.extentDate[1];
        this.dateSummary = (Array.from(this.data, (d) => {
            return {
                key: d[0],
                value: d[this.t]
            }
        })
        ).sort((a,b) => b.value - a.value);

        console.log(this.dateSummary)
        this.wards = this.dateSummary.map(d => d.key);

        this.table = d3.select("#meters-by-district-table").selectAll('tbody');

        this.width = document.getElementById('barchart-head').clientWidth;
        this.height = 20 - this.margin.t - this.margin.b;
        this.scaleX = d3.scaleLinear()
            .domain([0, this.max]).nice()
            .range([0, 232]);

        this.createTable();
        // // svg
        // this.plot = d3.select('#meters-by-district-plot')
        //     .append('svg')
        //     .attr('width', this.width + this.margin.r + this.margin.l)
        //     .attr('height', this.height + this.margin.t + this.margin.b);

        // this.createBarChart();
        

    }

    createTable() {
        const thisRow = this.table
            .selectAll('.row')
            .data(this.dateSummary)
            .join('tr')
            .attr('class', d => `${d.key}_row row`);

        thisRow
            .selectAll('td')
            .data(d => [{
                value: d.key,
                class: 'name'
            }, {
                value: Math.round(10000 * d.value / this.max) / 100,
                class: 'perc'
            }, {
                value: '',
                class: 'svg',
                meters: d.value
            }, {
                value: this.format(d.value),
                class: 'meters'
            }])
            .join('td')
            .attr('class', d => d.class)
            .html(d => d.value);

        const plotSVG = thisRow
            .selectAll('.svg')
            .selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('class', d => `svg_${d.key}`)
            .attr('width', this.width)
            .attr('height', this.height + this.margin.t + this.margin.b)
            .selectAll('rect')
            .data(d => [d])
            .join('rect')
            .attr('x', 0)
            .attr('y', this.margin.t)
            .attr('width', d => this.scaleX(d.meters))
            .attr('height', this.height)
            .style('fill', d => this.scaleColor(100 * d.meters / this.max))

        // thisRow
        //     .selectAll('.perc')
        //     .data(d => [d])
        //     .join('td')
        //     .attr('class', 'perc')
        //     .html(d => Math.round(10000 * d.value / this.max) / 100);

        // this.bars = thisRow
        //     .selectAll('.bars')
        //     .data(d => [d])
        //     .join('td')
        //     .attr('class', 'bars')
        //     .selectAll('svg')
        //     .data(d => [d])
        //     .join('svg')
        //     .call(this.createBar(d));

        // thisRow
        //     .selectAll('.meters')
        //     .data(d => [d])
        //     .join('td')
        //     .attr('class', 'meters')
        //     .html(d => d.value);
    }
    createBar(d) {

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