FROM --platform=linux/amd64 node
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
CMD ["npm", "run", "dev"]