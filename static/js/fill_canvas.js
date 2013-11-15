function draw_matrix(array, row_size) {
    c = document.getElementById("laplace");
    ctx = c.getContext("2d");

    width = row_size;
    height = array.length/row_size;

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    imgData = ctx.createImageData(width, height);

    for (var i = 0; i < imgData.data.length; i+=4) {
        //TODO: Write a function that determines RGB values from data in array
        imgData.data[i] = 0;
        imgData.data[i+1] = 0;
        imgData.data[i+2] = 255;
        imgData.data[i+3] = 255;
    }
    ctx.putImageData(imgData, 100, 100);

}