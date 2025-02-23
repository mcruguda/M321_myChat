# Use the official Node.js image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/app

# Copy files to the container
COPY ./ /usr/app

# Install the dependencies
RUN npm install

# Start the server when the container starts
CMD ["npm", "run", "prod"]