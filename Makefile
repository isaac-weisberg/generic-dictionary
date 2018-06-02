EXEC=index.js
BUILDFILES=\
	./*.js \
	./*.js.map \
	./*.d.ts \
	./src/*.d.ts \
	./src/*.js \
	./src/*.js.map \

default: build run

build:
	tsc

run:
	node $(EXEC)

clean:
	-rm -rf $(BUILDFILES)