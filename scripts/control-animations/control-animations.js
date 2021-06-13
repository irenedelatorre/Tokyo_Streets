function createSlider(range) {
    console.log(range);

    const margin = {
        t: 7,
        l: 15,
        r: 15,
        b: 25
    };

    const widthSlider = document.getElementById('time-controls').clientWidth - margin.r - margin.l - 16;
    const heightSlider = document.getElementById('time-controls').clientHeight - margin.t - margin.b;
    const years = d3.utcYears(range[0], range[1]);
    const months =  d3.utcMonths(range[0], range[1]);

    console.log(years, months);

    const sliderTime = d3.sliderBottom()
        .min(range[0])
        .max(range[1])
        .marks(months)
        .width(widthSlider)
        .tickFormat(function(d) {
            if (widthSlider < 300) {
                return d3.timeFormat('%y')(d);
            } else {
                return d3.timeFormat('%Y')(d);
            }

        })
        .tickValues(years)
        .default(range[1])
        .on("onchange", () => plotSlider.dispatch("input"));

    const plotSlider = d3.select('#time-controls')
        .append('svg')
        .attr('width', widthSlider + margin.r + margin.l)
        .attr('height', heightSlider + margin.t + margin.b)
        .append('g', 'slider-years')
        .attr('transform', `translate(${margin.l}, ${margin.t})`)
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

}