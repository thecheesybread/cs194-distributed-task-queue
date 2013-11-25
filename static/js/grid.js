/**
*   calendarWeekHour    Setup a week-hour grid: 
*                           7 Rows (days), 24 Columns (hours)
*   @param id           div id tag starting with #
*   @param width        width of the grid in pixels
*   @param height       height of the grid in pixels
*   @param square       true/false if you want the height to 
*                           match the (calculated first) width
*/
function calendarWeekHour(id, width, height, numRows, numCols, vals)
{
    var calData = randomData(width, height, numRows, numCols);
    console.log(calData);
    var grid = d3.select(id).append("svg")
                    .attr("width", width+20)
                    .attr("height", height+20)
                    .attr("class", "chart");

    var row = grid.selectAll(".row")
                  .data(calData)
                .enter().append("svg:g")
                  .attr("class", "row");

    var col = row.selectAll(".cell")
                 .data(function (d) { return d; })
                .enter().append("svg:rect")
                 .attr("class", "cell")
                 .attr("x", function(d) { return d.x; })
                 .attr("y", function(d) { return d.y; })
                 .attr("width", function(d) { return d.width; })
                 .attr("height", function(d) { return d.height; })
                 .style("stroke", '#555');
    grid.selectAll(".cell").style("fill", function(d,i) {var color = String(vals[i]%255); return "rgb("+color+","+color+","+color+")";})
}

////////////////////////////////////////////////////////////////////////

/**
*   randomData()        returns an array: [
                                            [{id:value, ...}],
                                            [{id:value, ...}],
                                            [...],...,
                                            ];
                        ~ [
                            [hour1, hour2, hour3, ...],
                            [hour1, hour2, hour3, ...]
                          ]

*/
function randomData(gridWidth, gridHeight, numRows, numCols)
{
    var data = new Array();
    var gridItemWidth = gridWidth / numCols;
    var gridItemHeight = gridHeight / numRows;
    var startX = gridItemWidth / 2;
    var startY = gridItemHeight / 2;
    var stepX = gridItemWidth;
    var stepY = gridItemHeight;
    var xpos = startX;
    var ypos = startY;
    var newValue = 0;
    var count = 0;

    for (var index_a = 0; index_a < numRows; index_a++)
    {
        data.push(new Array());
        for (var index_b = 0; index_b < numCols; index_b++)
        {
            newValue = Math.round(Math.random() * (100 - 1) + 1);
            data[index_a].push({ 
                                time: index_b, 
                                value: newValue,
                                width: gridItemWidth,
                                height: gridItemHeight,
                                x: xpos,
                                y: ypos,
                                count: count
                            });
            xpos += stepX;
            count += 1;
        }
        xpos = startX;
        ypos += stepY;
    }
    return data;
}