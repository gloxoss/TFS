FROM alpine:latest

ARG PB_VERSION=0.26.5

RUN apk add --no-cache unzip ca-certificates

# Download PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Copy local migrations to the image
COPY ./pb_migrations /pb/pb_migrations

# Expose port
EXPOSE 8090

# Start server
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
