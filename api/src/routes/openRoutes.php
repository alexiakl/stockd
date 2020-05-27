<?php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->get('/hello', function (Request $request, Response $response) {
    return OpenRequests::hello($request, $response, $this);
});

$app->post('/login', function (Request $request, Response $response) {
    return OpenRequests::authUser($request, $response, $this);
});
