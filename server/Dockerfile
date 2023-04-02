FROM node:16-alpine

WORKDIR /app

# copy package.json and package-lock.json to the container:
COPY package*.json ./

# install dependencies:
RUN npm install

# copy the rest of the application files:
COPY . .

EXPOSE 3001

# run the application:
CMD ["npm", "start"]
