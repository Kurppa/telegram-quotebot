FROM node:11-alpine

COPY telegram-quotebot /app

WORKDIR /app

RUN adduser -D app && \
    chown -R app /app && \
    npm install

USER app

CMD ["npm", "start"]

