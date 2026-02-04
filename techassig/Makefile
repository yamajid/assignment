.DEFAULT_GOAL := help

COMPOSE_FILE := deployment/docker-compose.yml

start: build up

build:
	docker-compose -f $(COMPOSE_FILE) build

up:
	docker-compose -f $(COMPOSE_FILE) up -d

stop:
	docker-compose -f $(COMPOSE_FILE) down

restart: stop start

logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

rebuild: stop
	docker-compose -f $(COMPOSE_FILE) build --no-cache
	docker-compose -f $(COMPOSE_FILE) up -d

clean:
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans

status:
	docker-compose -f $(COMPOSE_FILE) ps


.PHONY: start build up stop restart logs rebuild clean status help
