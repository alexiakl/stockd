<?php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->post('/user/changePassword', function (Request $request, Response $response) {
    return UserRequests::changePassword($request, $response, $this);
})->add($userRole)->add($protected);

$app->post('/ping', function (Request $request, Response $response) {
    return UserRequests::ping($request, $response, $this);
})->add($userRole)->add($protected);

$app->get('/iexsandbox/{query}', function (Request $request, Response $response, $args) {
    return UserRequests::iex($request, $response, $this, $args, true);
})->add($userRole)->add($protected);

$app->get('/iex/{query}', function (Request $request, Response $response, $args) {
    return UserRequests::iex($request, $response, $this, $args);
})->add($userRole)->add($protected);

$app->post('/user/logout', function (Request $request, Response $response) {
    return UserRequests::logout($request, $response, $this);
})->add($userRole)->add($protected);

$app->post('/user/portfolio', function (Request $request, Response $response) {
    return UserRequests::addPortfolio($request, $response, $this);
})->add($userRole)->add($protected);

$app->put('/user/portfolio/name', function (Request $request, Response $response) {
    return UserRequests::updatePortfolioName($request, $response, $this);
})->add($userRole)->add($protected);

$app->put('/user/portfolio', function (Request $request, Response $response) {
    return UserRequests::savePortfolio($request, $response, $this);
})->add($userRole)->add($protected);

$app->get('/user/portfolio', function (Request $request, Response $response) {
    return UserRequests::getPortfolio($request, $response, $this);
})->add($userRole)->add($protected);

$app->put('/user/portfolio/delete', function (Request $request, Response $response) {
    return UserRequests::deletePortfolio($request, $response, $this);
})->add($userRole)->add($protected);
