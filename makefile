PWD = $(shell pwd)
PORT ?= "3000"
npm:
	@docker run --rm -w /app -v ${PWD}:/app \
		-e PORT=${PORT} \
        -e FILE_SHARED_NAME=${FILE_SHARED_NAME} \
        -e STORAGE_KEY='${STORAGE_KEY}' \
		-p ${PORT}:${PORT} \
	node:12 npm ${CMD}
install:
	$(MAKE) npm CMD="i"
run:
	$(MAKE) npm CMD="start"
