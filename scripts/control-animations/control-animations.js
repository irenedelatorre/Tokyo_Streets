class controlAnimation {
    constructor(range, years, months, areaChart) {
        this.range = range;
        this.years = years;
        this.months = months;
        this.margin = {
            t: 7,
            l: 15,
            r: 15,
            b: 25
        };
        this.width = document.getElementById('time-controls').clientWidth -this. margin.r - this.margin.l - 16;
        this.height = document.getElementById('time-controls').clientHeight - this.margin.t - this.margin.b;
        this.timePointSlider = range[1];
        this.areaChart = areaChart;
        this.createSlider();
        console.log(areaChart)
    }

    createSlider() {
        const sliderTime = d3.sliderBottom()
            .min(this.range[0])
            .max(this.range[1])
            .marks(this.months)
            .width(this.width)
            .tickFormat(d => {
                if (this.width < 300) {
                    return d3.timeFormat('%y')(d);
                } else {
                    return d3.timeFormat('%Y')(d);
                }

            })
            .tickValues(this.years)
            .default(this.range[1])
            .on("onchange", (d) => {
                this.timePointSlider = d;
                this.areaChart.timeLine(d);
                plotSlider.dispatch("input")
            });

        const plotSlider = d3.select('#time-controls')
            .append('svg')
            .attr('width', this.width + this.margin.r + this.margin.l)
            .attr('height', this.height + this.margin.t + this.margin.b)
            .append('g', 'slider-years')
            .attr('transform', `translate(${this.margin.l}, ${this.margin.t})`)
            .call(sliderTime);

        plotSlider.selectAll('.tick')
            .selectAll('line')
            .attr('y1', -9)
            .attr('y2', -1);

        plotSlider
            .selectAll('.tick')
            .selectAll('text')
            .attr('y', 5);

        plotSlider
            .selectAll('.slider')
            .selectAll('text')
            .attr('y', 12);

        plotSlider  
            .selectAll('.parameter-value')
            .select('path')
            .attr('d', 'M-2.83-2.83h0A4,4,0,0,1,0-4,4,4,0,0,1,2.83-2.83h0A4,4,0,0,1,4,0,4,4,0,0,1,2.83,2.83h0A4,4,0,0,1,0,4,4,4,0,0,1-2.83,2.83h0A4,4,0,0,1-4,0,4,4,0,0,1-2.83-2.83Z')
            .style('fill', '#e02e0b')
            .style('stroke', 'none');
    }
}


// function createSlider(range, years, months) {


//     // console.log(years, months);

//     const sliderTime = d3.sliderBottom()
//         .min(range[0])
//         .max(range[1])
//         .marks(months)
//         .width(widthSlider)
//         .tickFormat(d => {
//             if (widthSlider < 300) {
//                 return d3.timeFormat('%y')(d);
//             } else {
//                 return d3.timeFormat('%Y')(d);
//             }

//         })
//         .tickValues(years)
//         .default(range[1])
//         .on("onchange", (d) => {
//             console.log(d);
//             plotSlider.dispatch("input")
//         });

//     const plotSlider = d3.select('#time-controls')
//         .append('svg')
//         .attr('width', widthSlider + margin.r + margin.l)
//         .attr('height', heightSlider + margin.t + margin.b)
//         .append('g', 'slider-years')
//         .attr('transform', `translate(${margin.l}, ${margin.t})`)
//         .call(sliderTime);

//     plotSlider.selectAll('.tick')
//         .selectAll('line')
//         .attr('y1', -9)
//         .attr('y2', -1);

//     plotSlider
//         .selectAll('.tick')
//         .selectAll('text')
//         .attr('y', 5);

//     plotSlider
//         .selectAll('.slider')
//         .selectAll('text')
//         .attr('y', 12);

//     plotSlider  
//         .selectAll('.parameter-value')
//         .select('path')
//         .attr('d', 'M-2.83-2.83h0A4,4,0,0,1,0-4,4,4,0,0,1,2.83-2.83h0A4,4,0,0,1,4,0,4,4,0,0,1,2.83,2.83h0A4,4,0,0,1,0,4,4,4,0,0,1-2.83,2.83h0A4,4,0,0,1-4,0,4,4,0,0,1-2.83-2.83Z')
//         .style('fill', '#e02e0b')
//         .style('stroke', 'none');

// }