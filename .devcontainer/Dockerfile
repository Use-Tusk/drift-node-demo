FROM node:22-alpine

# Install git, bash, and curl (required for Tusk CLI and git operations)
RUN apk add --no-cache \
    git \
    bash \
    curl \
    && rm -rf /var/cache/apk/*

# Set bash as default shell
SHELL ["/bin/bash", "-c"]

# Switch to node user
USER node
WORKDIR /home/node

# Set default shell for the user
ENV SHELL=/bin/bash

