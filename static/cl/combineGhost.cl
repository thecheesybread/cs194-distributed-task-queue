__kernel void combineGhost (__global float *in,
                            __global float *inGhost,
                            __global float *out,
                            int rowSize,
                            int ghostRowSize,
                            int columnSize,
                            int isRightGhost)
{
  unsigned int x = get_global_id(0);
  unsigned int y = get_global_id(1);
  unsigned int index = x + y * rowSize;
  if (y >= columnSize || x >= rowSize + ghostRowSize) {
    return;
  }

  if (isRightGhost == 1) {
    // Ghost cells should be on the right columns of the array meaning we're dealing with left node
    if (x >= rowSize) {
      // this means that we're trying to fill x with the ghostCell instead of regular cell
      out[x][y] = inGhost[x - rowSize][y];
    } else {
      // if x is within the range of [0, rowSize), then we take it from in
      out[x][y] = in[x][y];
    }
  } else if (isRightGhost == 0) {
    // Ghost cell should be on the left columns of the array meaning we're dealing with right node
    if (x < ghostRowSize) {
      out[x][y] = inGhost[x][y];
    } else {
      out[x][y] = in[x - ghostRowSize][y];
    }
  }
}
