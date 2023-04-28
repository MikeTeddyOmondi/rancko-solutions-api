FROM node:18.13.0-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install --silent

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . /app/

USER 1000

ENV PORT 5000

EXPOSE $PORT

CMD ["node", "server.js"]
