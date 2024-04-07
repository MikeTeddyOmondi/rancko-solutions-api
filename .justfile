# Default
default:
  just --list

# Build Docker Image
build-image:
  docker build -t ranckosolutionsinc/rancko-solutions-api:v2.0 . 

# Run Docker Container
run-container:
  docker run -d -p 5000:5000 --restart always --name rancko-solutions-api ranckosolutionsinc/rancko-solutions-api:v2.0 

# Docker compose 
run-compose:
  docker compose up -d --force-recreate -V

# Docker compose down
run-compose-down:
  docker compose down