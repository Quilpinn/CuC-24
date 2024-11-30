# Use a lightweight Node.js base image
FROM node:20-alpine

WORKDIR /app

# Copy only package files for dependency installation
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set build-time argument for the API URL and make it available as an environment variable
ARG API_URL=https://probable-halibut-qg5pq4pg566c9vr6-8484.app.github.dev/
ENV NEXT_PUBLIC_API_URL=$API_URL

# Expose the port your application runs on
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
