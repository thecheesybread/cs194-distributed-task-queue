function draw_matrix(array, row_size, max_num) {
    c = document.getElementById("laplace");
    ctx = c.getContext("2d");

    width = row_size;
    height = array.length/row_size;

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    imgData = ctx.createImageData(width, height);

    for (var i = 0; i < imgData.data.length; i+=4) {
        rgb = calculate_color_intensity(array[i/4], max_num);
        imgData.data[i] = rgb[0];
        imgData.data[i+1] = rgb[1];
        imgData.data[i+2] = rgb[2];
        imgData.data[i+3] = 255;
    }
    ctx.putImageData(imgData, 100, 100);

}

function calculate_color_intensity(x, max) {

    red = x/max * 255 ;
    green = (1 - (max-x)/max) * 255;
    // red = x/max * 255;
    // green = (1-(x/max)) * 255;
    blue = 0;

    return [red, green, blue]
}