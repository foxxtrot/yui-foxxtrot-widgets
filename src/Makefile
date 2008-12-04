SUBDIRS=Foxxtrot

subdir-recurse:
	list='$(SUBDIRS)'; for subdir in $$list; do \
		echo "Making $$target in $$subdir"; \
		$(MAKE) -C $$subdir $$target; \
	done;

all: subdir-recurse
