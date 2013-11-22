#include <cstring>
#include <cstdio>
#include <cstdlib>
#include <string>

#include "clhelp.h"

int main(int argc, char *argv[])
{
  std::string vvadd_kernel_str;

  /* Provide names of the OpenCL kernels
   * and cl file that they're kept in */
  std::string vvadd_name_str = 
    std::string("vvadd");
  std::string vvadd_kernel_file = 
    std::string("vvadd.cl");

  cl_vars_t cv; 
  cl_kernel vvadd;

  /* Read OpenCL file into STL string */
  readFile(vvadd_kernel_file,
	   vvadd_kernel_str);
  
  /* Initialize the OpenCL runtime 
   * Source in clhelp.cpp */
  initialize_ocl(cv);
  
  /* Compile all OpenCL kernels */
  compile_ocl_program(vvadd, cv, vvadd_kernel_str.c_str(),
		      vvadd_name_str.c_str());
  
  /* Arrays on the host (CPU) */
  float *h_in, *h_out;
  /* Arrays on the device (GPU) */
  cl_mem g_in, g_out;

  /* Allocate arrays on the host
   * and fill with random data */
  int n = (1<<20);
  h_in = new float[n];
  h_out = new float[n];
  bzero(h_out, sizeof(float)*n);
  
  for(int i = 0; i < n; i++)
    {
      h_in[i] = (float)drand48();
    }

  /* CS194: Allocate memory for arrays on 
   * the GPU. Matrix Y, A, and B.*/
  cl_int err = CL_SUCCESS;
  g_in = clCreateBuffer(cv.context,CL_MEM_READ_WRITE,sizeof(float)*n,NULL,&err);
  CHK_ERR(err);
  g_out = clCreateBuffer(cv.context,CL_MEM_READ_WRITE,sizeof(float)*n,NULL,&err);
  CHK_ERR(err);
  

  /* CS194: Copy Y array data from host CPU to GPU */
  err = clEnqueueWriteBuffer(cv.commands, g_out, true, 0, sizeof(float)*n,
           h_out, 0, NULL, NULL);

  err = clEnqueueWriteBuffer(cv.commands, g_in, true, 0, sizeof(float)*n,
           h_in, 0, NULL, NULL);
  
  /* CS194: Define the global and local workgroup sizes */
  int rowSize = 1<<11;
  int colSize = n / rowSize;
  size_t global_work_size[2] = {rowSize, colSize};
  size_t local_work_size[2] = {8, 8};

  /* CS194: Set Kernel Arguments Y, A, B, n*/
  err = clSetKernelArg(vvadd, 0, sizeof(cl_mem), &g_in);
  CHK_ERR(err);
  err = clSetKernelArg(vvadd, 1, sizeof(cl_mem), &g_out);
  CHK_ERR(err);
  err = clSetKernelArg(vvadd, 2, sizeof(int), &rowSize);
  CHK_ERR(err);
  err = clSetKernelArg(vvadd, 3, sizeof(int), &colSize);
  CHK_ERR(err);
  err = clSetKernelArg(vvadd, 4, sizeof(int), &n);
  CHK_ERR(err);

  /* CS194: Call kernel vvadd on the GPU */
  err = clEnqueueNDRangeKernel(cv.commands, //command_queue
             vvadd, //kernel
             2,//work_dim,
             NULL, //global_work_offset
             global_work_size, //global_work_size
             local_work_size, //local_work_size
             0, //num_events_in_wait_list
             NULL, //event_wait_list
             NULL //event
             );
  CHK_ERR(err);

  /* Read result of GPU on host CPU */
  err = clEnqueueReadBuffer(cv.commands, g_out, true, 0, sizeof(float)*n,
			    h_out, 0, NULL, NULL);
  CHK_ERR(err);
  err = clEnqueueReadBuffer(cv.commands, g_in, true, 0, sizeof(float)*n,
          h_in, 0, NULL, NULL);
  CHK_ERR(err);

  for (int i=0; i<25; i++){
    printf("index %d: %f\n", i, h_out[i]);
  }

/*
  bool er = false;
  for(int i = 0; i < n; i++)
    {
      float d = h_A[i] + h_B[i];
      if(h_Y[i] != d)
	{
	  printf("error at %d :(\n", i);
    er = true;
	  break;
	}
    }
  if(!er)
    {
      printf("CPU and GPU results match\n");
    }
*/

  /* Shut down the OpenCL runtime */
  uninitialize_ocl(cv);
  
  delete [] h_in; 
  delete [] h_out;
  
  clReleaseMemObject(g_in); 
  clReleaseMemObject(g_out); 
  
  return 0;
}
