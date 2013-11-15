$(document).ready(function() {
	dumpCLData = function () {
	    var s = "";
	    try {
		// First check if the WebCL extension is installed at all

		if (window.WebCL == undefined) {
		    alert("Unfortunately your system does not support WebCL. " +
			  "Make sure that you have both the OpenCL driver " +
			  "and the WebCL browser extension installed.");
		    return false;
		}

		// List of OpenCL information parameter names.

		var infos = [ [ "CL_DEVICE_ADDRESS_BITS", WebCL.CL_DEVICE_ADDRESS_BITS ],
			      [ "CL_DEVICE_AVAILABLE", WebCL.CL_DEVICE_AVAILABLE ],
			      [ "CL_DEVICE_COMPILER_AVAILABLE", WebCL.CL_DEVICE_COMPILER_AVAILABLE ],
			      [ "CL_DEVICE_DOUBLE_FP_CONFIG", WebCL.CL_DEVICE_DOUBLE_FP_CONFIG ],
			      [ "CL_DEVICE_ENDIAN_LITTLE", WebCL.CL_DEVICE_ENDIAN_LITTLE ],
			      [ "CL_DEVICE_ERROR_CORRECTION_SUPPORT", WebCL.CL_DEVICE_ERROR_CORRECTION_SUPPORT ],
			      [ "CL_DEVICE_EXECUTION_CAPABILITIES", WebCL.CL_DEVICE_EXECUTION_CAPABILITIES ],
			      [ "CL_DEVICE_EXTENSIONS", WebCL.CL_DEVICE_EXTENSIONS ],
			      [ "CL_DEVICE_GLOBAL_MEM_CACHE_SIZE", WebCL.CL_DEVICE_GLOBAL_MEM_CACHE_SIZE ],
			      [ "CL_DEVICE_GLOBAL_MEM_CACHE_TYPE", WebCL.CL_DEVICE_GLOBAL_MEM_CACHE_TYPE ],
			      [ "CL_DEVICE_GLOBAL_MEM_CACHELINE_SIZE", WebCL.CL_DEVICE_GLOBAL_MEM_CACHELINE_SIZE ],
			      [ "CL_DEVICE_GLOBAL_MEM_SIZE", WebCL.CL_DEVICE_GLOBAL_MEM_SIZE ],
			      [ "CL_DEVICE_HALF_FP_CONFIG", WebCL.CL_DEVICE_HALF_FP_CONFIG ],
			      [ "CL_DEVICE_IMAGE_SUPPORT", WebCL.CL_DEVICE_IMAGE_SUPPORT ],
			      [ "CL_DEVICE_IMAGE2D_MAX_HEIGHT", WebCL.CL_DEVICE_IMAGE2D_MAX_HEIGHT ],
			      [ "CL_DEVICE_IMAGE2D_MAX_WIDTH", WebCL.CL_DEVICE_IMAGE2D_MAX_WIDTH ],
			      [ "CL_DEVICE_IMAGE3D_MAX_DEPTH", WebCL.CL_DEVICE_IMAGE3D_MAX_DEPTH ],
			      [ "CL_DEVICE_IMAGE3D_MAX_HEIGHT", WebCL.CL_DEVICE_IMAGE3D_MAX_HEIGHT ],
			      [ "CL_DEVICE_IMAGE3D_MAX_WIDTH", WebCL.CL_DEVICE_IMAGE3D_MAX_WIDTH ],
			      [ "CL_DEVICE_LOCAL_MEM_SIZE", WebCL.CL_DEVICE_LOCAL_MEM_SIZE ],
			      [ "CL_DEVICE_LOCAL_MEM_TYPE", WebCL.CL_DEVICE_LOCAL_MEM_TYPE ],
			      [ "CL_DEVICE_MAX_CLOCK_FREQUENCY", WebCL.CL_DEVICE_MAX_CLOCK_FREQUENCY ],
			      [ "CL_DEVICE_MAX_COMPUTE_UNITS", WebCL.CL_DEVICE_MAX_COMPUTE_UNITS ],
			      [ "CL_DEVICE_MAX_CONSTANT_ARGS", WebCL.CL_DEVICE_MAX_CONSTANT_ARGS ],
			      [ "CL_DEVICE_MAX_CONSTANT_BUFFER_SIZE", WebCL.CL_DEVICE_MAX_CONSTANT_BUFFER_SIZE ],
			      [ "CL_DEVICE_MAX_MEM_ALLOC_SIZE", WebCL.CL_DEVICE_MAX_MEM_ALLOC_SIZE ],
			      [ "CL_DEVICE_MAX_PARAMETER_SIZE", WebCL.CL_DEVICE_MAX_PARAMETER_SIZE ],
			      [ "CL_DEVICE_MAX_READ_IMAGE_ARGS", WebCL.CL_DEVICE_MAX_READ_IMAGE_ARGS ],
			      [ "CL_DEVICE_MAX_SAMPLERS", WebCL.CL_DEVICE_MAX_SAMPLERS ],
			      [ "CL_DEVICE_MAX_WORK_GROUP_SIZE", WebCL.CL_DEVICE_MAX_WORK_GROUP_SIZE ],
			      [ "CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS", WebCL.CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS ],
			      [ "CL_DEVICE_MAX_WORK_ITEM_SIZES", WebCL.CL_DEVICE_MAX_WORK_ITEM_SIZES ],
			      [ "CL_DEVICE_MAX_WRITE_IMAGE_ARGS", WebCL.CL_DEVICE_MAX_WRITE_IMAGE_ARGS ],
			      [ "CL_DEVICE_MEM_BASE_ADDR_ALIGN", WebCL.CL_DEVICE_MEM_BASE_ADDR_ALIGN ],
			      [ "CL_DEVICE_MIN_DATA_TYPE_ALIGN_SIZE", WebCL.CL_DEVICE_MIN_DATA_TYPE_ALIGN_SIZE ],
			      [ "CL_DEVICE_NAME", WebCL.CL_DEVICE_NAME ],
			      [ "CL_DEVICE_PLATFORM", WebCL.CL_DEVICE_PLATFORM ],
			      [ "CL_DEVICE_PREFERRED_VECTOR_WIDTH_CHAR", WebCL.CL_DEVICE_PREFERRED_VECTOR_WIDTH_CHAR ],
			      [ "CL_DEVICE_PREFERRED_VECTOR_WIDTH_SHORT", WebCL.CL_DEVICE_PREFERRED_VECTOR_WIDTH_SHORT ],
			      [ "CL_DEVICE_PREFERRED_VECTOR_WIDTH_INT", WebCL.CL_DEVICE_PREFERRED_VECTOR_WIDTH_INT ],
			      [ "CL_DEVICE_PREFERRED_VECTOR_WIDTH_LONG", WebCL.CL_DEVICE_PREFERRED_VECTOR_WIDTH_LONG ],
			      [ "CL_DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT", WebCL.CL_DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT ],
			      [ "CL_DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE", WebCL.CL_DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE ],
			      [ "CL_DEVICE_PROFILE", WebCL.CL_DEVICE_PROFILE ],
			      [ "CL_DEVICE_PROFILING_TIMER_RESOLUTION", WebCL.CL_DEVICE_PROFILING_TIMER_RESOLUTION ],
			      [ "CL_DEVICE_QUEUE_PROPERTIES", WebCL.CL_DEVICE_QUEUE_PROPERTIES ],
			      [ "CL_DEVICE_SINGLE_FP_CONFIG", WebCL.CL_DEVICE_SINGLE_FP_CONFIG ],
			      [ "CL_DEVICE_TYPE", WebCL.CL_DEVICE_TYPE ],
			      [ "CL_DEVICE_VENDOR", WebCL.CL_DEVICE_VENDOR ],
			      [ "CL_DEVICE_VENDOR_ID", WebCL.CL_DEVICE_VENDOR_ID ],
			      [ "CL_DEVICE_VERSION", WebCL.CL_DEVICE_VERSION ],
			      [ "CL_DRIVER_VERSION", WebCL.CL_DRIVER_VERSION ] ];


		// Get a list of available CL platforms, and another list of the
		// available devices on each platform. Platform and device information
		// is inquired into string s.

		var platforms = WebCL.getPlatformIDs ();
		s += "Found " + platforms.length + " platform"
		    + (platforms.length == 1 ? "" : "s")
		    + "." + "<br><br>";
		for (var i in platforms) {
		    var plat = platforms[i];

		    var name = plat.getPlatformInfo (WebCL.CL_PLATFORM_NAME);
		    s += "[" + i + "] \"<b>" + name + "</b>\"<br>";
		    s += "<div style='padding-left:2em;'>";
		    s += "<b>vendor:</b> "
			+ plat.getPlatformInfo (WebCL.CL_PLATFORM_VENDOR) + "<br>";
		    s += "<b>version:</b> "
			+ plat.getPlatformInfo (WebCL.CL_PLATFORM_VERSION) + "<br>";
		    s += "<b>profile:</b> "
			+ plat.getPlatformInfo (WebCL.CL_PLATFORM_PROFILE) + "<br>";
		    s += "<b>extensions:</b> "
			+ plat.getPlatformInfo (WebCL.CL_PLATFORM_EXTENSIONS) + "<br>";

		    var devices = plat.getDeviceIDs (WebCL.CL_DEVICE_TYPE_ALL);
		    s += "<b>Devices:</b> " + devices.length + "<br>";
		    for (var j in devices) {
			var dev = devices[j];
			s += "[" + j + "] \"<b>" + dev.getDeviceInfo(WebCL.CL_DEVICE_NAME)
			    + "</b>\"<br>";
			s += "<div style='padding-left:2em;'>";

			for (var k in infos) {
			    s += infos[k][0] + ":   ";
			    try {
				if (infos[k][1] == WebCL.CL_DEVICE_PLATFORM) {
				    s += "<b>"
					+ dev.getDeviceInfo(infos[k][1]).getPlatformInfo(WebCL.CL_PLATFORM_NAME)
					+ "</b>";
				} else {
				    s += "<b>" + dev.getDeviceInfo(infos[k][1]) + "</b>";
				}
			    } catch (e) {
				s += "<b>Info not available</b>";
			    }
			    s += "<br>";
			}
			s += "</div>";
		    }
		    s += "</div>";
		}

		// String s is printed out to div element output

		var output = document.getElementById ("output");
		output.innerHTML = s + "<br>";
	    } catch(e) {
		var output = document.getElementById ("output");
		output.innerHTML = s + "<br>";
		output.innerHTML += "<b>Error:</b> <pre style='color:red;'>"
		    + e.toString()+"</pre>";
		throw e;
	    }
	}
	loadKernel = function (id){
	    var kernelElement = document.getElementById(id);
	    var kernelSource = kernelElement.text;
	    if (kernelElement.src != "") {
		var mHttpReq = new XMLHttpRequest();
		mHttpReq.open("GET", kernelElement.src, false);
		mHttpReq.send(null);
		kernelSource = mHttpReq.responseText;
	    }
	    return kernelSource;
	}



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

	// each element in host_args is an array so that we call var host_arg=host_args.shift(); cl_vector_add(host_arg);
	// for cl_vector_add each host_arg will be a uint32Array.
	host_args = new Array();
	//in_data.push(
	out_data = new Array();
	get_host_args = function() {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', '/get_host_args/', true); //true means async is true
	    xhr.responseType = 'arraybuffer';

	    xhr.onload = function(e) {
		    if (this.status == 200) {
		      var array_buffer = xhr.response;
		      if (array_buffer) {
			      //https://developer.mozilla.org/en-US/docs/Web/API/Uint32Array
           			      var bytes_per_block = 1024 * 1024; // 1mb per block

			      for (var current_byte = 0; current_byte < array_buffer.byteLength; current_byte += bytes_per_block) {
			        //var byte_array = new Uint32Array(array_buffer, current_byte, bytes_per_block / 4); // read 1024 * 1024 / 4 ints of 4 bytes
              var byte_array = new Float32Array(array_buffer, current_byte, bytes_per_block / 4); // read 1024 * 1024 / 4 ints of 4 bytes
			        host_args.push(byte_array);
			        alert(byte_array[0] + "," + byte_array[1] + "," + byte_array[2] + "," + byte_array[3]);
			      }
		      }
		    }
	    };
	  xhr.send();
	}
	export_out_data = function() {
	    // do something pretty simple here to send the data out. convert out_data into json and send it out.
	}
    });
