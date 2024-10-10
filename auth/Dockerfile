FROM node:20.17.0-alpine
ENV NODE_VERSION 20.17.0
ENV NODE_ENV=dev
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
COPY . .
EXPOSE 4001
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "deploy"]