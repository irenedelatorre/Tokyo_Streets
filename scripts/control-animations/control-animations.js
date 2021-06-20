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
        this.t = this.timePointSlider;
        this.areaChart = areaChart;
        this.animation = false;
        this.animationBtn = 'play';
        this.nextBtn = d3.select('#skip_next');
        this.previousBtn = d3.select('#skip_previous');
        this.playBtn = d3.select("#play");
        this.frameRate = 10;

        this.plotSlider = d3.select('#time-controls')
            .append('svg')
            .attr('width', this.width + this.margin.r + this.margin.l)
            .attr('height', this.height + this.margin.t + this.margin.b)
            .append('g', 'slider-years')
            .attr('transform', `translate(${this.margin.l}, ${this.margin.t})`);

        this.createSlider();
        this.playButton();
        this.nextButton();
        this.previousButton();
        console.log(areaChart)
    }

    createSlider() {
        this.sliderTime = d3.sliderBottom()
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
            .on("drag", (d) => {
                this.t = d;
                if (this.animation === true) {
                    this.animation === false;
                    this.animationBtn = 'play';
                    this.playBtn
                        .select('.material-icons')
                        .html('play_arrow');
                    clearInterval(this.timer);

                }
            })
            .on("onchange", (d) => {
                this.timePointSlider = d;
                this.areaChart.timeLine(d);
                this.plotSlider.dispatch("input");
            });

        this.plotSlider
            .call(this.sliderTime);

        this.plotSlider.selectAll('.tick')
            .selectAll('line')
            .attr('y1', -9)
            .attr('y2', -1);

        this.plotSlider
            .selectAll('.tick')
            .selectAll('text')
            .attr('y', 5);

        this.plotSlider
            .selectAll('.slider')
            .selectAll('text')
            .attr('y', 12);

        this.plotSlider  
            .selectAll('.parameter-value')
            .select('path')
            .attr('d', 'M-2.83-2.83h0A4,4,0,0,1,0-4,4,4,0,0,1,2.83-2.83h0A4,4,0,0,1,4,0,4,4,0,0,1,2.83,2.83h0A4,4,0,0,1,0,4,4,4,0,0,1-2.83,2.83h0A4,4,0,0,1-4,0,4,4,0,0,1-2.83-2.83Z')
            .style('fill', '#e02e0b')
            .style('stroke', 'none');
    }

    playButton() {

        this.playBtn
            .on('click', d => {
                const btn = this.playBtn
                    .select('.material-icons');

                if (this.animationBtn === 'play') {
                    this.playBtn
                        .select('.material-icons')
                        .html('pause');

                    this.animation = true;
                    this.animationBtn = 'pause';

                    // if starts from the last point go to beginning
                    if (this.t >= this.range[1]) {
                        this.t = this.range[0];
                    } else {
                        this.t = new Date(this.t.setMonth(this.t.getMonth() + 1))
                    }

                    // console.log( this.timePointSlider);
                    this.timer = setInterval(() => this.step(), 1000)

                } else if (this.animationBtn === 'pause') {
                    this.playBtn
                        .select('.material-icons')
                        .html('play_arrow');

                    this.animation = false;
                    this.animationBtn = 'play';
                    clearInterval(this.timer);
                }
            })
    }

    nextButton() {
        this.nextBtn
            .on('click', d => {
                const btn = this.playBtn
                    .select('.material-icons');
                
                if (this.animation === true){
                    this.t = this.range[1];
                } else {
                    this.t = new Date(this.t.setMonth(this.t.getMonth() + 1));
                    this.update();
                }
            })
    }

    previousButton() {
        this.previousBtn
            .on('click', d => {
                const btn = this.playBtn
                    .select('.material-icons');
                
                if (this.animation === true){
                    this.t = this.range[0];
                } else {
                    this.t = new Date(this.t.setMonth(this.t.getMonth() - 1));
                    this.update();
                }
            })
    }

    step() {
        console.log(this.timePointSlider, this.t);
        this.update();
        // if it goes to the end of the animation
        if (this.t >= this.range[1]) {
            this.t = this.range[0];
            this.animation = false;
            this.animationBtn = 'play';

            clearInterval(this.timer);
            this.playBtn
                .select('.material-icons')
                .html('play_arrow');
        } else {
            this.t = new Date(this.t.setMonth(this.t.getMonth() + 1))
        }
    }
 
    update() {
        // update pos X of circle
        // update label
        this.sliderTime
            .value([this.t]);
    }

}