# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-alpine

# Use development node environment by default.
ENV NODE_ENV development


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm i -g @nestjs/cli

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD npm run start:dev
