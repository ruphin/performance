.PHONY: dev
dev:
	docker run -it --rm -v $$PWD:/app -p 3000:3000 ruphin/webdev npm run start

.PHONY: shell
shell:
	docker run -it --rm -v $$PWD:/app ruphin/webdev bash

.PHONY: test
test:
	docker run -it --rm -v $$PWD:/app ruphin/webdev npm run test

.PHONY: build
build:
	docker run -it --rm -v $$PWD:/app ruphin/webdev npm run build

.PHONY: production
production:
	docker build -t ruphin/performance .
