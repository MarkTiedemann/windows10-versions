.PHONY: all clean clean-html format

ids := $(shell node -pe "Object.keys(require('./release_kbs')).join(' ')")

html := $(patsubst %,%.html,$(ids))
tmp := $(patsubst %,%.tmp,$(ids))
json := $(patsubst %,%.json,$(ids))

all: versions.tsv $(html)

versions.tsv: $(json) join.js release_kbs.json
	node join.js

$(json): clean.js

%.json: %.tmp
	node clean.js $(basename $@)

$(tmp): extract.js

%.tmp: %.html
	node extract.js $(basename $@)

$(html): download.js

%.html:
	node download.js $(basename $@)

clean:
	rm -f releases.tsv $(json) $(tmp)

clean-html:
	rm -f $(html)

format:
	prettier --write "*.js"
