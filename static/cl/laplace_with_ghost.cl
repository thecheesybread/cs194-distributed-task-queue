__kernel void clLaplace (__global float *in,
   		     __global float *out,
           __global float *ghostOut,
 		     int rowSize,
         int ghostRowSize,
		     int columnSize,
		     int n,
         int isRightGhost,
         int setGhost)
{

  unsigned int x = get_global_id(0);
  unsigned int y = get_global_id(1);
  int totalRowSize = rowSize + ghostRowSize;
  unsigned int index = x + y * totalRowSize;

  if (x >= totalRowSize)
    return;
  if (y >= columnSize)
    return;



  float num = 0;
  float denom = 0;
  if (x > 0) {
    num += in[index - 1];
    denom+=1;
  }
  if (x < totalRowSize - 1) {
    num += in[index + 1];
    denom+=1;
  }
  if (y > 0) {
    num += in[index - totalRowSize];
    denom+=1;
  }
  if (y < columnSize - 1) {
    num += in[index + totalRowSize];
    denom+=1;
  }
  out[index] = num / denom;

  if (setGhost == 1) {
    if (isRightGhost == 1) {
      // Ghost cells should be on the right columns of the array meaning we're dealing with left node
      if (x >= rowSize - ghostRowSize && x < rowSize) {
        ghostOut[(x - (rowSize - ghostRowSize)) + y * ghostRowSize] = num/denom;
      }
    } else if(isRightGhost == 0) {
      // Ghost cell should be on the left columns of the array meaning we're dealing with right node
      if (x < ghostRowSize * 2 && x >= ghostRowSize) {
        ghostOut[(x - ghostRowSize) + y * ghostRowSize] = num/denom;
      }
    }
  }
 }
