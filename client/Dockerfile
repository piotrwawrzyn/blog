FROM node:alpine
ENV CI=true
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY ./ ./
ENV CI=true
CMD ["npm", "start"]