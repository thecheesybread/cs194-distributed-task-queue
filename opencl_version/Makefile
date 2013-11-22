OBJS = laplace.o clhelp.o
UNAME_S := $(shell uname -s)

ifeq ($(UNAME_S), Linux)
OCL_INC=/usr/local/cuda-4.2/include
OCL_LIB=/usr/local/cuda-4.2/lib64

%.o: %.cpp clhelp.h
	g++ -msse4 -O2 -c $< -I$(OCL_INC)

all: $(OBJS)
	g++ laplace.o clhelp.o -o laplace -L$(OCL_LIB) -lOpenCL
endif

ifeq ($(UNAME_S), Darwin)
%.o: %.cpp clhelp.h
	g++ -O2 -c $<

all: $(OBJS)
	g++ laplace.o clhelp.o -o laplace -framework OpenCL
endif


clean:
	rm -rf $(OBJS) matmul laplace incr
