FROM alpine:latest

ARG PB_VERSION=0.27.1

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Copy entrypoint script
COPY deployment/pocketbase/entrypoint.sh /pb/entrypoint.sh
RUN chmod +x /pb/entrypoint.sh

# Copy hooks
COPY pb_hooks /pb/pb_hooks

# Skip migrations when syncing local data (local DB already has schema)
# COPY pb_migrations /pb/pb_migrations

# Copy seed data to a separate location (not directly to pb_data)
# The entrypoint script will copy it to pb_data if the volume is empty
COPY deployment/seed_data /pb/seed_data

EXPOSE 8090

# start PocketBase via entrypoint
ENTRYPOINT ["/pb/entrypoint.sh"]
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
