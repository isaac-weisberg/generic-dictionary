BUILDDIR=./dist/

default: build run

build:
	tsc

run:
	node $(BUILDDIR)index.js 

clean:
	-rm -rf $(BUILDDIR)*