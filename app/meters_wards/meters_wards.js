class meters_by_wards {
    constructor(data, extentDate, scaleColor, formatTime) {
        this.data = data[0];
        this.max = data[1];
        this.extentDate = extentDate;
        this.formatTime = formatTime;
        this.margin = {
            t: 1.5,
            b: 1.5
        };
        this.scaleColor = scaleColor;
        this.format = d3.format(",");

        this.t = formatTime(this.extentDate[1]);
        this.dateSummary = (Array.from(this.data, (d) => {
            return {
                key: d[0],
                value: d[this.t]
            }
        })
        ).sort((a,b) => b.value - a.value);

        this.wards = this.dateSummary.map(d => d.key);

        this.table = d3.select("#meters-by-district-table").selectAll('tbody');

        this.width = document.getElementById('barchart-head').clientWidth;
        this.height = 20 - this.margin.t - this.margin.b;
        this.scaleX = d3.scaleLinear()
            .domain([0, 100])
            .range([0, this.width]);

        this.table_ward = d3.select('#t-ward');
        this.table_perc = d3.select('#t-perc');
        this.table_chart = d3.select('#barchart-head');
        this.table_meters = d3.select('#t-meters');

        this.createTable(this.t);
        this.table_ward_btn();
        this.table_perc_btn();
        this.table_meters_btn();
    }

    update(t) {
        this.t = this.formatTime(t);

        this.dateSummary = (Array.from(this.data, (d) => {
                return {
                    key: d[0],
                    value: d[this.t]
                }
            })
        ).sort((a,b) => b.value - a.value);

        this.createTable();
    }

    createTable() {
        d3.select('#walkability-date')
            .html(`(${this.t})`);
            
        this.thisRow = this.table
            .selectAll('.row')
            .data(this.dateSummary)
            .join('tr')
            .attr('class', d => `${d.key}_row row`);

        this.thisRow
            .selectAll('td')
            .data(d => [
                {
                    value: d.key,
                    class: 'name'
                }, {
                    key: d.key,
                    value: Math.round(10000 * d.value / this.max) / 100,
                    class: 'perc'
                }, {
                    value: '',
                    class: 'svg-data',
                    key: d.key,
                    meters: d.value
                }, {
                    key: d.key,
                    value: this.format(d.value),
                    class: 'meters'
                }
            ])
            .join('td')
            .attr('class', d => d.class)
            .html(d => d.value);

        this.plotSVGs = this.thisRow
            .selectAll('.svg-data')
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
            .attr('width', d => this.scaleX(100 * d.meters / this.max))
            .attr('height', this.height)
            .style('fill', d => this.scaleColor(100 * d.meters / this.max))
    }

    reset(id) {
        d3.selectAll(".th-sm")
            .selectAll('a')
            .attr('active', function (d) {
                const thisId = d3.select(this).attr('id');

                d3.select(this)
                    .selectAll('svg')
                    .style('opacity', d => {
                        if (thisId !== id) return 0.5;
                        return 1;
                    });

                if (thisId !== id) return 'false'; 
            });
    }

    sortIcon(plot, sort) {
        if (sort === 'desc') {
            plot
                .select('svg')
                .attr('transform', 'scale(1, 1)');
        } else {
            plot
                .select('svg')
                .attr('transform', 'scale(1, -1)');
        }
    }

    table_ward_btn() {
        this.table_ward
            .on('click', d => {
                const status = this.table_ward.attr('active');
                let sort = this.table_ward.attr('sort');

                // reset all other btns
                this.reset('t-ward')

                if((status === 'false' && sort === 'asc') ||
                    (status === 'true' && sort === 'desc')) {

                    this.dateSummary.sort((a, b) => d3.ascending(a.key, b.key));
                    this.table_ward
                        .attr('active', 'true')
                        .attr('sort', 'asc');
                    sort = 'asc';

                } else if ((status === 'false' && sort === 'desc') ||
                    (status === 'true' && sort === 'asc')) {

                    this.dateSummary.sort((a, b) => d3.descending(
                        a.key,
                        b.key));

                    this.table_ward
                        .attr('active', 'true')
                        .attr('sort', 'desc');
                    sort = 'desc';
                }

                this.createTable();
                this.sortIcon(this.table_ward, sort);
            })
    }

    table_perc_btn() {
        this.table_perc
            .on('click', d => {
                const status = this.table_perc.attr('active');
                let sort = this.table_perc.attr('sort');
                // reset all other btns
                this.reset('t-perc')

                if((status === 'false' && sort === 'asc') ||
                    (status === 'true' && sort === 'desc')) {

                    this.dateSummary.sort((a, b) => d3.ascending(
                        a.value / this.max,
                        b.value / this.max));

                    this.table_perc
                        .attr('active', 'true')
                        .attr('sort', 'asc');
                    sort = 'asc';

                } else if ((status === 'false' && sort === 'desc') ||
                    (status === 'true' && sort === 'asc')) {

                    this.dateSummary.sort((a, b) => d3.descending(
                        a.value / this.max,
                        b.value / this.max));

                    this.table_perc
                        .attr('active', 'true')
                        .attr('sort', 'desc');
                    sort = 'desc';
                }

                this.createTable();
                this.sortIcon(this.table_perc, sort);
            })
    }

    table_meters_btn() {
        this.table_meters
            .on('click', d => {
                const status = this.table_meters.attr('active');
                let sort = this.table_meters.attr('sort');
                // reset all other btns
                this.reset('t-meters')

                if((status === 'false' && sort === 'asc') ||
                    (status === 'true' && sort === 'desc')) {

                    this.dateSummary.sort((a, b) => d3.ascending(
                        a.value,
                        b.value));

                    this.table_meters
                        .attr('active', 'true')
                        .attr('sort', 'asc');
                    sort = 'asc';

                } else if ((status === 'false' && sort === 'desc') ||
                    (status === 'true' && sort === 'asc')) {

                    this.dateSummary.sort((a, b) => d3.descending(
                        a.value,
                        b.value));

                    this.table_meters
                        .attr('active', 'true')
                        .attr('sort', 'desc');
                    sort = 'desc';

                }
                this.createTable();
                this.sortIcon(this.table_meters, sort);
            })
    }

    resize() {
        console.log('resize table');
        this.width = document.getElementById('barchart-head').clientWidth;
        this.height = 20 - this.margin.t - this.margin.b;
        this.scaleX.range([0, this.width]);

        this.thisRow
            .selectAll('.svg-data')
            .selectAll('svg')
            .attr('width', this.width);
        
        this.thisRow
            .selectAll('.svg-data')
            .selectAll('svg')
            .selectAll('rect')
            .attr('x', 0)
            .attr('width', d => this.scaleX(100 * d.meters / this.max));
    }
}