FROM node:11-alpine

COPY . /app

WORKDIR /app

RUN adduser -D app && \
    chown -R app /app && \
    npm install

USER app

CMD ["npm", "start"]

