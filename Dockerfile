################################################################################
# Node Assets
################################################################################
FROM node:25.9.0@sha256:c69f4e0640e5b065f2694579793e4309f1e0e49868b0f2fea29c44d9c0dc2caf AS assets

# Use non-root "app" user in directory /app
ARG UID=1000
ARG GID=1000

RUN groupadd -g ${GID} -o app
RUN useradd -m -d /app -u ${UID} -g ${GID} -o -s /bin/bash app

USER app

WORKDIR /app

# Install packages
COPY package.json package-lock.json ./
RUN npm ci

COPY eslint.config.js ./
COPY ./assets ./assets
COPY ./test ./test

RUN npm run build

################################################################################
# BASE
################################################################################
FROM ruby:4.0-slim AS base

ARG UID=1000
ARG GID=1000

RUN apt-get update -yqq && apt-get install -yqq --no-install-recommends \
  build-essential \
  libtool \ 
  libyaml-dev \
  curl \
  gpg \
  vim\
  git


RUN groupadd -g ${GID} -o app
RUN useradd -m -d /app -u ${UID} -g ${GID} -o -s /bin/bash app

ENV GEM_HOME=/gems
ENV PATH="$PATH:/gems/bin"
RUN mkdir -p /gems && chown ${UID}:${GID} /gems


ENV BUNDLE_PATH /app/vendor/bundle

# Change to app and back so that bundler created files in /gems are owned by the
# app user
USER app
RUN gem install bundler
USER root

WORKDIR /app

CMD ["bundle", "exec", "puma", "-b", "tcp://0.0.0.0:4567"]

################################################################################
# DEVELOPMENT                                           								       # 
################################################################################
FROM base AS development

RUN apt-get update -yqq && apt-get install -yqq --no-install-recommends \
  git


USER app

################################################################################
# PRODUCTION                                                                   #
################################################################################
FROM base AS production


ENV BUNDLE_WITHOUT=development:test

COPY --chown=${UID}:${GID} . /app

USER app

RUN bundle install

COPY --chown=${UID}:{GID} --from=assets /app/public/scripts /app/public/scripts
COPY --chown=${UID}:{GID} --from=assets /app/public/styles /app/public/styles
