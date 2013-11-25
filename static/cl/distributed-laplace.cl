__kernel void clLaplace (__global float *in,
                         __global float *out,
                         int rowSize,
                         int columnSize,
                         int n,
                         __global float *lGhostIn,
                         __global float *rGhostIn,
                         __global float *lGhostOut,
                         __global float *rGhostOut,
                         int ghostDepth,
                         int currentDepth,
                         int type
                         ) // 0 type: only left ghost cells, 1 type: only right ghost cells
/**         __global float *tGhost,
            __global float *bGhost,
            __global float *lbGhost,
            __global float *rbGhost,
            __global float *ltGhost,
            __global float *rtGhost,*/

{
  unsigned int x = get_global_id(0);
  unsigned int y = get_global_id(1);
  unsigned int index = x + y * rowSize;
  if (x >= rowSize + ghostDepth)
    return;
  if (y >= columnSize)
    return;
  float num = 0;
  float denom = 0;

  if (x < rowSize) {
    if (x > 0) {
      num += in[index - 1];
      denom+=1;
    }
    if (x < rowSize - 1) {
      num += in[index + 1];
      denom+=1;
    }
    if (type == 0 && x == 0) {
      num += lGhostIn[ghostDepth * y + ghostDepth - 1]; // get the rightmost entry in the ghost cells for this row
      denom += 1;
    }
    if (type == 1 && x == rowSize - 1) {
      num += rGhostIn[ghostDepth * y]; // get the leftmost entry in the ghost for this row
      denom += 1;
    }
    if (y > 0) {
      num += in[index - rowSize];
      denom+=1;
    }
    if (y < columnSize - 1) {
      num += in[index + rowSize];
      denom+=1;
    }
    out[index] = num / denom;
  } else {
    float *ghostIn;
    float *ghostOut;
    if (type == 0) {
      if (x == ghostDepth - 1) {
        num += in[rowSize * y]; // get the rightmost entry in the actual cells for this row
        denom += 1;
      }
      ghostIn = lGhostIn;
      ghostOut = lGhostOut;
    } else {
      // type == 1
      if (x == 0) {
        num += in[rowSize * y + rowSize - 1 ]; // get the rightmost entry in the actual cells for this row
        denom += 1;
      }
      ghostIn = rGhostIn;
      ghostOut = rGhostOut;
    }
    x -= rowSize;
    index = x + y * ghostDepth;

    if (x > 0) {
      num += ghostIn[index - 1];
      denom+=1;
    }
    if (x <  ghostDepth - 1) {
      num += ghostIn[index + 1];
      denom+=1;
    }
    if (y > 0) {
      num += ghostIn[index - ghostDepth];
      denom+=1;
    }
    if (y < columnSize - 1) {
      num += ghostIn[index + ghostDepth];
      denom+=1;
    }


  }
}
