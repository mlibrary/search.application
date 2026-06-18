################################################################################
# Node Assets
################################################################################
FROM node:26.3.1@sha256:3c05c2cf0f6a5795dfb7abefb2a4e31a78d6271a99962531c48315ced17d618a AS assets

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
  git \
  imagemagick


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
