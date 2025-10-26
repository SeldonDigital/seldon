FROM node:22-slim

WORKDIR /app

RUN apt update -y
RUN apt install -y bash curl unzip openssl

COPY package.json package-lock.json ./

RUN npm install

EXPOSE 2300 2301

# Default command
CMD ["npm", "run", "dev"]
