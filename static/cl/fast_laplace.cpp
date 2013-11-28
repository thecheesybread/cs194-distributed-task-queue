__kernel void clLaplace (__global float *in,
                         __global float *out,
                         int rowSize,
                         int columnSize,
                         int n,
                         int numIterations)
{

  unsigned int x = get_global_id(0);
  unsigned int y = get_global_id(1);
  unsigned int index = x + y * rowSize;
  float *temp;
  float *currentIn = in;
  float *currentOut = out;
  if (x >= rowSize)
    return;
  if (y >= columnSize)
    return;

  for (int i = 0; i < numIteration; i++) {
    float num = 0;
    float denom = 0;
    if (x > 0) {
      num += in[index - 1];
      denom+=1;
    }
    if (x < rowSize - 1) {
      num += in[index + 1];
      denom+=1;
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
    //barrier(CLK_LOCAL_MEM_FENCE);
    barrier(CLK_GLOBAL_MEM_FENCE);
    // do a swap
    temp = currentIn;
    currentIn = currentOut;
    currentOut = temp;
  }
}
