# Use the latest LTS nodejs docker image as a builder image
FROM node:20.10.0 AS builder

# Set the working directory in the builder image
WORKDIR /app

# Copy the package.json and package-lock.json files to the builder image
COPY package*.json ./

# Install dependencies in the builder image
RUN npm install

# Copy the entire project to the builder image
COPY . .

# Generate static files of the current project on the builder image via npx expo export:web
RUN NODE_ENV="production" npx expo export:web

# Use the nginx image as the final image
FROM nginx:1.25.2

# Create the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the web-build directory from the builder image to the final nginx image
COPY --from=builder /app/web-build /usr/share/nginx/html

# Expose port 80 for the nginx server
EXPOSE 80
