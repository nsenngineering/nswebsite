# Minimal image that just serves db.json via json-server
FROM node:20-alpine

WORKDIR /app

# json-server is already listed in package.json dependencies,
# but we only need it (and its deps) for this container.
RUN npm install json-server@0.17.4

COPY db.json ./db.json

EXPOSE 5002

# --host 0.0.0.0 is REQUIRED inside Docker.
# json-server's default host is 127.0.0.1, which only accepts
# connections from inside the container itself. Docker's port
# mapping (5002:5002) talks to the container's network interface,
# not its loopback, so without this flag every external request
# gets refused/reset -> ERR_EMPTY_RESPONSE.
CMD ["npx", "json-server", "--watch", "db.json", "--port", "5002", "--host", "0.0.0.0"]
