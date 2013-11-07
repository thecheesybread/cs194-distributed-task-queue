CL_vectorAdd = function () {
    //============================GENERATES 2 RANDOM VECTOR ARRAYS==============================
    // All output is written to element by id "output"
    var output = document.getElementById("output");
    output.innerHTML = "";

    try {
  
	// First check if the WebCL extension is installed at all 
	if (window.WebCL == undefined) {
	    alert("Unfortunately your system does not support WebCL. " +
		  "Make sure that you have both the OpenCL driver " +
		  "and the WebCL browser extension installed.");
	    return false;
	}

	// Generate input vectors
	var vectorLength = 30;
	var UIvector1 = new Uint32Array(vectorLength);    
	var UIvector2 = new Uint32Array(vectorLength);
	for ( var i=0; i<vectorLength;  i=i+1) {
	    UIvector1[i] = Math.floor(Math.random() * 100); //Random number 0..99
	    UIvector2[i] = Math.floor(Math.random() * 100); //Random number 0..99
	}
    
	output.innerHTML += "<br>Vector length = " + vectorLength;
	//============================SET UP WEBCL CONTEXT USING DEFAULT DEVICE=====================
	// Setup WebCL context using the default device of the first platform 
	var platforms = WebCL.getPlatformIDs();
	var ctx = WebCL.createContextFromType ([WebCL.CL_CONTEXT_PLATFORM, 
						platforms[0]],
					       WebCL.CL_DEVICE_TYPE_DEFAULT);
                     
	// Reserve buffers
	var bufSize = vectorLength * 4; // size in bytes
	output.innerHTML += "<br>Buffer size: " + bufSize + " bytes";
	var bufIn1 = ctx.createBuffer (WebCL.CL_MEM_READ_ONLY, bufSize);
	var bufIn2 = ctx.createBuffer (WebCL.CL_MEM_READ_ONLY, bufSize);
	var bufOut = ctx.createBuffer (WebCL.CL_MEM_WRITE_ONLY, bufSize);
	//=====================CREATE START BUILDING PROGRAM KERNEL AND ADD ARGUMENTS TO KERNEL=====================
	// Create and build program for the first device
	var kernelSrc = loadKernel("clProgramVectorAdd");
	var program = ctx.createProgramWithSource(kernelSrc);
	var devices = ctx.getContextInfo(WebCL.CL_CONTEXT_DEVICES);

	try {
	    program.buildProgram ([devices[0]], "");
	} catch(e) {
	    alert ("Failed to build WebCL program. Error "
		   + program.getProgramBuildInfo (devices[0], 
						  WebCL.CL_PROGRAM_BUILD_STATUS)
		   + ":  " 
		   + program.getProgramBuildInfo (devices[0], 
						  WebCL.CL_PROGRAM_BUILD_LOG));
	    throw e;
	}

	// Create kernel and set arguments
	var kernel = program.createKernel ("ckVectorAdd");
	kernel.setKernelArg (0, bufIn1);
	kernel.setKernelArg (1, bufIn2);    
	kernel.setKernelArg (2, bufOut);
	kernel.setKernelArg (3, vectorLength, WebCL.types.UINT);


	//============================INSTANTIATE COMMAND QUEUE AND EXECUTE PROGRAM AND SET LOCAL AND GLOBAL WORK SIZES=====================
	// Create command queue using the first available device
	var cmdQueue = ctx.createCommandQueue (devices[0], 0);
    
	// Write the buffer to OpenCL device memory
	cmdQueue.enqueueWriteBuffer (bufIn1, false, 0, bufSize, UIvector1, []);
	cmdQueue.enqueueWriteBuffer (bufIn2, false, 0, bufSize, UIvector2, []);
 
	// Init ND-range
	var localWS = [8];
	var globalWS = [Math.ceil (vectorLength / localWS) * localWS];

	output.innerHTML += "<br>Global work item size: " + globalWS;
	output.innerHTML += "<br>Local work item size: " + localWS;
    
	// Execute (enqueue) kernel
	cmdQueue.enqueueNDRangeKernel(kernel, globalWS.length, [], 
				      globalWS, localWS, []);

	// Read the result buffer from OpenCL device
	outBuffer = new Uint32Array(vectorLength);
	cmdQueue.enqueueReadBuffer (bufOut, false, 0, bufSize, outBuffer, []);    
	cmdQueue.finish (); //Finish all the operations

	//Print input vectors and result vector
	output.innerHTML += "<br>Vector1 = "; 
	for (var i = 0; i < vectorLength; i = i + 1) {
	    output.innerHTML += UIvector1[i] + ", ";
	}
	output.innerHTML += "<br>Vector2 = ";
	for (var i = 0; i < vectorLength; i = i + 1) {
	    output.innerHTML += UIvector2[i] + ", ";
	}
	output.innerHTML += "<br>Result = ";
	for (var i = 0; i < vectorLength; i = i + 1) {
	    output.innerHTML += outBuffer[i] + ", ";
	}

    } catch(e) {
	document.getElementById("output").innerHTML 
	+= "<h3>ERROR:</h3><pre style=\"color:red;\">" + e.message + "</pre>";
	throw e;
    }
}
