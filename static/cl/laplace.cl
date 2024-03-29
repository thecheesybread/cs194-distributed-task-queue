__kernel void clLaplace (__global float *in,
   		     __global float *out,
 		     int rowSize,
		     int columnSize,
		     int n)
{

  unsigned int x = get_global_id(0);
  unsigned int y = get_global_id(1);
  unsigned int index = x + y * rowSize;

  if (x >= rowSize)
    return;
  if (y >= columnSize)
    return;



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

 }
