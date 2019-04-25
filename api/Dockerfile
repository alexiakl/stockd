FROM php:7.2-apache

RUN sed -i 's/80/8080/' /etc/apache2/ports.conf /etc/apache2/sites-enabled/000-default.conf
RUN sed -i 's#/var/www/html#/var/www/html/public#' /etc/apache2/sites-enabled/000-default.conf
RUN a2enmod rewrite

RUN mkdir -p /var/stockd/stockd-api/logs
RUN chown -R www-data:www-data /var/stockd/

RUN docker-php-ext-install pdo_mysql

EXPOSE 8080
