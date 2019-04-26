![Stockd Web App](static/stockd.gif)

# Stockd

Using this app you can:

- Create multiple portfolios to track profits or watch stocks
- Compare the performance of different stocks

Currently only US stocks are supported

# Install

Stockd uses [IEX Cloud](https://iexcloud.io/) API to get Stocks data.
To spin up this project:

- Sign up for an account at [IEX Cloud](https://iexcloud.io/) and generate production and test API tokens
- Under `api/src/` directory, rename `configs-sample.php` to `configs.php`
- Provide DEV_TOKEN and PROD_TOKEN that you generated earlier, and make sure to provide a proper JWT_SECRET_KEY
- Make sure you have docker installed, and then from project root run:

```
docker-compose up -d
```

That's it! Once done, check the app out: http://localhost:8080
Login credentials:

- user: `sherlock@holmes.com`
- pass: `doctorwatson`

# API

API is available on port 8000: http://localhost:8000/hello

# React Web App

The frontend is developed using React and Redux

# Database

To connect to the database, use the following configs:

- db name: `stockd`
- user: `stockd`
- pass: `stockd`
- host: `127.0.0.1`
- port: `3308`

# TODO

- User sign up
