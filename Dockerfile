FROM node:12.16.3-alpine as ts-build

# Arguments
ARG NODE_ENV
ARG NPM_TOKEN
ARG SERVICE_PORT
ENV NODE_ENV=$NODE_ENV \
    SERVICE_PORT=$SERVICE_PORT \
    APP_DIR="/usr/src/pharmacy" \
    YARN_CACHE="/tmp/ycache"

RUN mkdir -p $APP_DIR
RUN mkdir -p $YARN_CACHE

RUN apk --no-cache add \
      bash \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl-dev \
      make \
      python

RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash


WORKDIR $APP_DIR

# Install app dependencies
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
COPY package* $APP_DIR
COPY yarn.lock $APP_DIR

RUN yarn config set cache-folder $YARN_CACHE
RUN yarn install

# Bundle app source
COPY . .

# Compile TS to JS
RUN yarn build


FROM node:12.16.3-alpine as build

# Create app directory
ENV APP_DIR=/usr/src/pharmacy \
YARN_CACHE="/tmp/ycache" \
    NODE_ENV=$NODE_ENV \
    NPM_TOKEN=$NPM_TOKEN \
    SERVICE_PORT=$SERVICE_PORT

RUN mkdir -p $APP_DIR
RUN mkdir -p $YARN_CACHE


WORKDIR $APP_DIR

COPY --from=ts-build $APP_DIR/lib $APP_DIR/lib
COPY --from=ts-build $YARN_CACHE $YARN_CACHE
COPY --from=ts-build $APP_DIR/config $APP_DIR/config
COPY --from=ts-build $APP_DIR/package.json $APP_DIR/package.json
COPY --from=ts-build $APP_DIR/yarn.lock $APP_DIR/yarn.lock
COPY --from=ts-build $APP_DIR/.env $APP_DIR/.env

# Install app dependencies
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
RUN yarn install --prod --cache-folder $YARN_CACHE; rm -Rf $YARN_CACHE


# Production container
FROM node:12.16.2-alpine

# Arguments
ARG NODE_ENV
ARG SERVICE_PORT

# Configuration
ENV SERVICE_PORT=$SERVICE_PORT \
    SERVICE_USER=Pharmacy \
    SERVICE_USER_ID=1001 \
    SERVICE_GROUP=Pharmacy \
    SERVICE_GROUP_ID=1001 \
    APP_DIR=/usr/src/pharmacy \
    NODE_ENV=$NODE_ENV

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR
RUN addgroup -g $SERVICE_GROUP_ID $SERVICE_GROUP \
  && adduser -D -u $SERVICE_USER_ID -G $SERVICE_GROUP $SERVICE_USER \
  && chown -R $SERVICE_USER:$SERVICE_GROUP $APP_DIR

USER $SERVICE_USER

COPY --chown=$SERVICE_USER:$SERVICE_GROUP --from=build $APP_DIR/ $APP_DIR/


EXPOSE $SERVICE_PORT

CMD ["yarn", "start"]
