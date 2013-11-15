__kernel void matmul(__global float *Y, __global float *A, __global float *B, 
	 int n)
{
    int idx = get_global_id(0);
    int idy = get_global_id(1);

    /* Make sure within bounds */
    if(idx < n && idy < n)
    {
        float value = 0;
        /* Perform matrix multiply arithmetic */
        for(int k=0; k<n; k++){
            value += A[idy*n+k]*B[k*n+idx];
        }
        Y[idy*n+idx] = value;
    }
}
