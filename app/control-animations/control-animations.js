class controlAnimation {
    constructor(range, years, months, areaChart, table, map, legend) {
        this.range = range;
        this.years = years;
        this.months = months;
        this.margin = {
            t: 7,
            l: 15,
            r: 15,
            b: 25,
            btn: 36 * 3 + 16
        };
        const width = document.getElementById("buttons-div").clientWidth;
        const height = document.getElementById("time-controls").clientHeight;
        this.width = width - this. margin.r - this.margin.l - this.margin.btn;
        this.height = height - this.margin.t - this.margin.b;
        this.timePointSlider = range[1];
        this.t = this.timePointSlider;
        this.areaChart = areaChart;
        this.table = table;
        this.map = map;
        this.legend = legend;
        this.animation = false;
        this.animationBtn = "play";
        this.nextBtn = d3.select("#skip_next");
        this.previousBtn = d3.select("#skip_previous");
        this.playBtn = d3.select("#play");
        this.frameRate = 10;

        this.plotSlider = d3.select("#time-controls")
            .append("svg")
            .attr("width", this.width + this.margin.r + this.margin.l)
            .attr("height", this.height + this.margin.t + this.margin.b)
            .append("g", "slider-years")
            .attr("transform", `translate(${this.margin.l}, ${this.margin.t})`);

        this.createSlider();
        this.playButton();
        this.nextButton();
        this.previousButton();
    }

    createSlider() {
        this.sliderTime = d3.sliderBottom()
            .min(this.range[0])
            .max(this.range[1])
            .marks(this.months)
            .width(this.width)
            .tickFormat(d => {
                if (this.width < 300) {
                    return d3.timeFormat("%y")(d);
                } else {
                    return d3.timeFormat("%Y")(d);
                }

            })
            .tickValues(this.years)
            .default(this.range[1])
            .displayValue(false)
            .on("drag", (d) => {
                this.t = d;
                if (this.animation === true) {
                    this.animation === false;
                    this.animationBtn = "play";
                    clearInterval(this.timer);

                }
            })
            .on("onchange", (d) => {
                this.timePointSlider = d;
                this.areaChart.timeLine(d);
                this.table.update(d);
                this.map.drawGrid(d);
                this.legend.updateLegendDate(d);
                this.plotSlider.dispatch("input");
            });

        this.plotSlider
            .call(this.sliderTime);
        
        this.styleSlider();
    }

    styleSlider() {
        this.plotSlider.selectAll(".tick")
            .selectAll("line")
            .attr("y1", -9)
            .attr("y2", -1);

        this.plotSlider
            .selectAll(".tick")
            .selectAll("text")
            .attr("y", 5);

        this.plotSlider
            .selectAll(".slider")
            .selectAll("text")
            .attr("y", 12);

        this.plotSlider  
            .selectAll(".parameter-value")
            .select("path")
            .attr("d", "M-2.83-2.83h0A4,4,0,0,1,0-4,4,4,0,0,1,2.83-2.83h0A4," +
                "4,0,0,1,4,0,4,4,0,0,1,2.83,2.83h0A4,4,0,0,1,0,4,4,4,0,0," +
                "1-2.83,2.83h0A4,4,0,0,1-4,0,4,4,0,0,1-2.83-2.83Z")
            .style("fill", "#e02e0b")
            .style("stroke", "none");
    }

    playButton() {

        this.playBtn
            .on("click", d => {
                const btn = this.playBtn
                    .select("svg")
                    .select(".icon-btn");

                if (this.animationBtn === "play") {
                    btn
                        .attr("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z");

                    this.animation = true;
                    this.animationBtn = "pause";

                    // if starts from the last point go to beginning
                    if (this.t >= this.range[1]) {
                        this.t = this.range[0];
                    } else {
                        const month = this.t.getMonth();
                        this.t = new Date(this.t.setMonth(month + 1));
                    }

                    this.timer = setInterval(() => this.step(), 1000)

                } else if (this.animationBtn === "pause") {
                    btn.attr("d", "M8 5v14l11-7z");

                    this.animation = false;
                    this.animationBtn = "play";
                    clearInterval(this.timer);
                }
            })
    }

    nextButton() {
        this.nextBtn
            .on("click", d => {
                
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
            .on("click", d => {
                
                if (this.animation === true){
                    this.t = this.range[0];
                } else {
                    this.t = new Date(this.t.setMonth(this.t.getMonth() - 1));
                    this.update();
                }
            })
    }

    step() {
        this.update();
        // if it goes to the end of the animation
        if (this.t >= this.range[1]) {
            this.t = this.range[0];
            this.animation = false;
            this.animationBtn = "play";

            clearInterval(this.timer);
            const btn = this.playBtn
                .select("svg")
                .select(".icon-btn")
                .attr("d", "M8 5v14l11-7z");
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

    resize(){
        const width = document.getElementById("buttons-div").clientWidth;
        this.width = width - this. margin.r - this.margin.l - this.margin.btn;

        d3.select("#time-controls")
            .select("svg")
            .attr("width", this.width + this.margin.r + this.margin.l)
            .select(".slider-years")
            .attr("transform", `translate(${this.margin.l}, ${this.margin.t})`);

        this.sliderTime
            .width(this.width)
            .tickFormat(d => {
                if (this.width < 300) {
                    return d3.timeFormat("%y")(d);
                } else {
                    return d3.timeFormat("%Y")(d);
                }
            });

        this.plotSlider
            .call(this.sliderTime);

        this.styleSlider();
    }
}