const parse = {
    parseValues : function(d) {
        const thisDate = (d.date).split("-");
        const date = new Date(`${thisDate[0]}-${thisDate[1]}-1`);

        return {
            cell_id : d.cell_id,
            date : date,
            value : +d.value
        }
    },

    parseWards : function(d) {
        return {
            cell_id : d.cell_id,
            name_en : d.name_en, 
            name_ja : d.name_ja,
            value : 0
        }
    },

    wards_meters : function(values, wards) {

        const dates = d3.groupSort(values,
            d => d.date,
            d => d.date
        )
    
        const groupedByDateCell = d3.rollup(values,
            v => d3.sum(v, d => Math.round(d.value)),
            d => d.date,
            e => e.cell_id);
    
        // match neighborhood with cell id
        const groupByWard = d3.groups(wards,
            d => d.name_en,
        );
    
        let max = 0;

        // filter by time
        for (var i = 0; i < dates.length; i++) {
            const thisDate = new Date(dates[i]);
            const cellDate = groupedByDateCell.get(thisDate);
            const month = thisDate.getMonth();
            const year = thisDate.getFullYear();
            
            // pick Ward
            for (var j = 0; j < groupByWard.length; j++) {
                let meters = 0;
                const cells = groupByWard[j][1];
    
                // pick cell
                for (var k = 0; k < cells.length; k++) {
                    // value is in
                    const thisValue = cellDate.get(cells[k].cell_id)
                    if (thisValue > 0) meters = meters + thisValue;
                    if (meters > max) max = meters;
                    // console.log(thisValue)
                }
                groupByWard[j][thisDate] = meters;
            }
        }

        return [groupByWard, max];
    }
}
