SRCS=Laconica.js

MINS=${SRCS:.js=${MINSUFFIX}.js}

MINSUFFIX=-min

JSMIN=~/Desktop/yuicompressor-2.4.jar

%-min.js: %.js
	java -jar ${JSMIN} $< -o ${<:.js=$(MINSUFFIX).js}

minify: ${MINS}

clean:
	rm -f *$(MINSUFFIX).js ${DEST}

all: minify
