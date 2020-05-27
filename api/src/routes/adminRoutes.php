<?php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->post('/user/add', function (Request $request, Response $response) {
    return AdminRequests::addUser($request, $response, $this);
})->add($adminRole)->add($protected);

$app->post('/user/resetPassword', function (Request $request, Response $response) {
    return AdminRequests::resetPassword($request, $response, $this);
})->add($adminRole)->add($protected);

$app->post('/user/delete', function (Request $request, Response $response) {
    return AdminRequests::deleteUser($request, $response, $this);
})->add($adminRole)->add($protected);

$app->get('/roles', function (Request $request, Response $response) {
    return AdminRequests::getRoles($request, $response, $this);
})->add($adminRole)->add($protected);
