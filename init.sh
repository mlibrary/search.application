if [ -f ".env" ]; then
  echo "🌎 .env exists. Leaving alone"
else
  echo "🌎 .env does not exist. Copying .env-example to .env"
  cp env.example .env
  YOUR_UID=$(id -u)
  YOUR_GID=$(id -g)
  echo "🙂 Setting your UID (${YOUR_UID}) and GID (${YOUR_UID}) in .env"
  docker run --rm -v ./.env:/.env alpine echo "$(sed s/YOUR_UID/${YOUR_UID}/ .env)" >.env
  docker run --rm -v ./.env:/.env alpine echo "$(sed s/YOUR_GID/${YOUR_GID}/ .env)" >.env
fi

echo "🚢 Build docker images"
docker compose build

echo "⬇️ Pull dependent service images"
docker compose pull

echo "📦 Installing Gems"
docker compose run --rm app bundle

echo "📦 Installing Node modules"
docker compose run --rm js npm install

echo "📦 Building js and css"
docker compose run --rm js npm run build

echo "📦 Installing Gems"
docker compose run --rm app bundle

staff_photos_count=`find public/images/specialists/. -maxdepth 1 -type f -name *.jpg | wc -l`
if [ $staff_photos_count != 0 ]; then
  echo "🖼️ staff photos already exist. Not rerunning"
else
  echo "🖼️ pulling staff photos"
  docker compose run --rm app rake get_profile_photos
fi
