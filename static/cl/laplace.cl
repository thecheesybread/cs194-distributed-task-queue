__kernel void clLaplace(__global float4* bufIn,
                        __global float4* bufOut,
                        unsigned int rowSize,
                        unsigned int columnSize,
                        unsigned int n) {
  unsigned int x = get_global_id(0);
  unsigned int y = get_global_id(1);
  unsigned int index = x + y * rowSize;
  if (index >= n) {
    return;
  }
  float4 num = 0;
  float4 denom = 0;
  if (x > 0) {
    num += bufIn[index - 1];
    denom+=1;
  }
  if (x < rowSize - 1) {
    num += bufIn[index + 1];
    denom+=1;
  }
  if (y > 0) {
    num += bufIn[index - rowSize];
    denom+=1;
  }
  if (y < columnSize - 1) {
    num += bufIn[index +  rowSize];
    denom+=1;
  }
  bufOut[index] = num / denom;
}
