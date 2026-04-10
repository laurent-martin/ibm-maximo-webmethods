# Generate PDF from Markdown
include $(DIR_PANDOC)/pandoc.mak
all: README.pdf
clean:
	rm -f README.pdf
