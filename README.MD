![Stockd Web App](static/stockd.gif)

# Stockd

Using this app you can:

- Create multiple portfolios to track profits or watch stocks
- Compare the performance of different stocks

Currently only US stocks are supported

## Install

Stockd uses [IEX Cloud](https://iexcloud.io/) API to get Stocks data.
To spin up this project:

- Sign up for an account at [IEX Cloud](https://iexcloud.io/) and generate production and test API tokens
- Under `api/src/` directory, rename `configs-sample.php` to `configs.php`
- Provide DEV_TOKEN and PROD_TOKEN that you generated earlier, and make sure to provide a proper JWT_SECRET_KEY
- Make sure you have docker installed, and then from project root run:

```
docker-compose up -d
```

The following containers will spin up:

- Web App - built using [React](https://reactjs.org/) + [Redux](https://redux.js.org/)
- API - built using [Slim PHP](http://www.slimframework.com/)
- MariaDB - Database to store user data

Once done, you can check it out at: http://localhost:8080
Login credentials: sherlock@holmes.com / doctorwatson

## TODO

- User sign up
