FROM php:7.4.1-apache

RUN sed -i 's/80/8080/' /etc/apache2/ports.conf /etc/apache2/sites-enabled/000-default.conf
RUN sed -i 's#/var/www/html#/var/www/html/public#' /etc/apache2/sites-enabled/000-default.conf
RUN a2enmod rewrite

RUN mkdir -p /var/stockd/stockd-api/logs
RUN chown -R www-data:www-data /var/stockd/

RUN docker-php-ext-install pdo_mysql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git \
    zip \
    unzip

WORKDIR /var/www/html
COPY composer.* ./
RUN composer install

EXPOSE 8080
