__kernel void combineGhost (__global float *in,
                            __global float *inGhost,
                            int rowSize,
                            int ghostRowSize,
                            int columnSize,
                            int isRightGhost)
{
  // as many x as ghostRowSize
  unsigned int x = get_global_id(0);
  // as many y as columnSize
  unsigned int y = get_global_id(1);
  unsigned int index = x + y * rowSize;
  if (y >= columnSize || x >= ghostRowSize) {
    return;
  }

  if (isRightGhost == 1) {
    // Ghost cells should be on the right columns of the array meaning we're dealing with left node
    in[x + rowSize + y * (rowSize + ghostRowSize)] = inGhost[x + y * ghostRowSize];
  } else if (isRightGhost == 0) {
    // Ghost cell should be on the left columns of the array meaning we're dealing with right node
    in[x + y * (rowSize + ghostRowSize)] = inGhost[x + y * ghostRowSize];
  }
}
