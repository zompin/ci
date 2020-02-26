FROM node:latest
WORKDIR /app
ADD back /app/back
ADD config /app/config
ADD package.json /app
ADD yarn.lock /app
RUN yarn
EXPOSE 5556
ENTRYPOINT ["/usr/local/bin/node"]
CMD ["back/index.js"]
