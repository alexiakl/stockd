<?php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->get('/users/{name}', function (Request $request, Response $response) {
    return ModeratorRequests::filterUsers($request, $response, $this);
})->add($moderatorRole)->add($protected);

$app->post('/user/update', function (Request $request, Response $response) {
    return ModeratorRequests::updateUser($request, $response, $this);
})->add($moderatorRole)->add($protected);

$app->get('/users', function (Request $request, Response $response) {
    return ModeratorRequests::getUsers($request, $response, $this);
})->add($moderatorRole)->add($protected);
