// load data
Promise.all([
    d3.json('./assets/data/tokyo_grid.json'),
    d3.json('./assets/data/tokyo_wards_admin_level_7.json'),
    d3.csv('./assets/data/tokyo_long_data.csv', parse.parseValues)
])
.then(function (files) {
    console.log(files);
    const grid = files[0];
    const ward = files[1];
    const values = files[2];
    
})
.catch(function(error){
    console.log(error);
     // handle error   
});
