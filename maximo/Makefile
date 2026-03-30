.PHONY: all

SPEC_BASE=api/oas

all:
	redocly bundle $(SPEC_BASE).json -o $(SPEC_BASE).yaml
	redocly bundle $(SPEC_BASE).json --ext json -o $(SPEC_BASE).tmp.json
	redocly bundle $(SPEC_BASE).tmp.json --remove-unused-components --ext json -o $(SPEC_BASE).small.json
	rm -f $(SPEC_BASE).tmp.json
	node fix-oas.js $(SPEC_BASE).small.json
	redocly lint $(SPEC_BASE).small.json
	redocly bundle $(SPEC_BASE).small.json -o $(SPEC_BASE).small.yaml
	ls -alh $(SPEC_BASE).small.json
