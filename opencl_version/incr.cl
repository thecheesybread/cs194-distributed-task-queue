__kernel void incr (__global float *Y, int n)
{
  /* Gets the unique global work-item ID value for dimension 0 */
  int idx = get_global_id(0);
  /* increment value in array Y by 1 */
  if(idx < n)
    {
      Y[idx] = Y[idx] + 1.0f;
    }
}
