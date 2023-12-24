# Use a lightweight base image
FROM nginx:alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Copy the contents of the web-build directory to the container
COPY web-build/ .

# Expose port 80 for the NGINX server
EXPOSE 80

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
