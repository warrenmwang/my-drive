# Start with the official MongoDB image
FROM mongo:latest

# Set environment variables for MongoDB configuration
ENV MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME
ENV MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD
ENV MONGO_INITDB_DATABASE=$MONGO_INITDB_DATABASE

# Copy custom MongoDB configuration file
COPY mongod.conf /etc/mongod.conf

# Start MongoDB with the custom configuration
CMD ["mongod", "--config", "/etc/mongod.conf"]
