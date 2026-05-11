# ruby-starter

Boilerplate code for starting a ruby project with docker / docker-compose

## Set up

Run the setup script

```bash
./init.sh
```

This will:

* copy `env.example` to `.env`
* enable the precommit hook which wil lint the code before committing.  Uncomment
  those lines in `.git/hooks/precommit` to enable running tests.
* build the docker image
* install the gems
* pull the staff photos into `public/images/specialists` (if there aren't already images in that directory)

The script does not overwrite `.env` or `/git/hooks/precommit`.

## Update profile photos for specialists

The `init.sh` script will load the photos once if they don't already exist. To
update photos on demand you can run the rake task in the terminal:

```bash
docker compose run --rm app rake update_profile_photos
```

## Tests

This has rspec initialialized and has one sample test in `spec/sample_spec.rb`.

A github actions workflow is included that runs standard linting and the tests

## Profiler

To run the profiler middleware, set the "PROFILE_ON" environment variable to something. This will cause profile reports to be generated per endpoint in `tmp/profile`

## Background

This repository goes with this documentation:
<https://mlit.atlassian.net/wiki/spaces/LD/pages/2404090314/Getting+Started+with+Docker+and+Docker-Compose>
