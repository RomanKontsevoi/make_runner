include .env
CONTAINER_NAME = make_runner
IMAGE_NAME := 3844320/$(CONTAINER_NAME)
PORT = 3020
export $(shell sed 's/=.*//' .env)

build:
	docker build -t $(IMAGE_NAME) .  --network host | tee error.log

run:
	docker run -d -p $(PORT):$(PORT) -v $(TARGET_FOLDER):/app/target -v logs:/app/data --rm \
	-v /var/run/docker.sock:/var/run/docker.sock --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)

restart: stop run
