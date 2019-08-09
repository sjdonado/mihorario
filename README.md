# 📆 mihorarioUN
Import your Uninorte schedule to Google Calendar.

## Run in development env
### api
```
  docker-compose up
```
#### Serverless
* Required tools:
```
  npm install -g serverless
  brew install brotli
```
* Compress required libaries
```
  cd src/lambdaFunctions/scraper
  nvm use 8.11
  ./create-layer
```
* Upload mihorarioun-scraper-layer.zip layer
* Deploy
```
  serverless config credentials --provider aws --key KEY --secret SECRET_KEY
  serverless deploy
```
### ui
```
  cd ui && ng serve
```

## Credits
Original idea: [mihorario](https://uncal.herokuapp.com) made by [krthr](https://github.com/krthr)

#### mihorarioUN is an open source project that is not associated directly with Universidad del Norte.
