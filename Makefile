CONTAINER_NAME = make_runner
IMAGE_NAME := 3844320/$(CONTAINER_NAME)
PORT = 3020

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run -d -p $(PORT):$(PORT) -v logs:/app/data --rm --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)
