const parse = {
    parseValues : function(d) {
        const thisDate = (d.date).split("-");
        const date = new Date(`${thisDate[0]}-${thisDate[1]}-1`);

        return {
            cell_id : d.cell_id,
            date : date,
            value : +d.value
        }
    }
}
