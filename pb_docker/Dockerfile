FROM alpine:3.19

ARG PB_VERSION=0.34.2

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget

# Download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && rm /tmp/pb.zip

# Copy local migrations and hooks into the image
# Build context should be project root, so paths are relative to that
COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks

WORKDIR /pb
EXPOSE 8090

# Start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]

