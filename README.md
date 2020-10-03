# 📆 Mi horario UN
> Import your Uninorte schedule to Google Calendar.
<div align="center">
    <a href="https://mihorarioun.web.app">
        <img src="/client/src/assets/screens.svg" alt="Mi horario UN" width="800px" />
    </a>
</div>

## How to run?
* Please write me an email for sharing to you the Google oauth env variables, otherwise you can create your own credentials [more info](https://support.google.com/cloud/answer/6158849)
### Server

```shell
  cd server
  docker-compose rm -f
  docker-compose up --build
```
### Client

```shell
  cd client
  npm install
  npm start
```

## Want to help?
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing][contributing].

## External dependencies
* **Uninorte API connection:** Unofficial GraphQL wrapper for Uninorte API: [uninorte.js](https://github.com/Cronun/uninorte.js)

## Contributors
<table>
  <tr>
    <td align="center"><a href="https://github.com/sjdonado"><img src="https://avatars0.githubusercontent.com/u/27580836?s=460&v=4" width="100px;" alt="Juan Rodriguez"/><br /><sub><b>Juan Rodriguez</b></sub></a></td>
  </tr>
<table>

## Credits
Original idea: [mihorario](https://uncal.herokuapp.com) made by [krthr](https://github.com/krthr)

#### mihorarioUN is an open source project that is not associated directly with Universidad del Norte.

[contributing]: https://github.com/sjdonado/quevent/blob/master/CONTRIBUTING.md
