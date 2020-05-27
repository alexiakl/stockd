<?php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$container = $app->getContainer();

// $container['cache'] = function () {
//     return new \Slim\HttpCache\CacheProvider();
// };

$container['bucketurl'] = function ($c) {
    $bucketurl = $c['settings']['bucketurl'];
    return $bucketurl;
};

$container['JWTsecretkey'] = function ($c) {
    $JWTsecretkey = $c['settings']['JWTsecretkey'];
    return $JWTsecretkey;
};

$container['firebasekey'] = function ($c) {
    $firebasekey = $c['settings']['firebasekey'];
    return $firebasekey;
};

$container['GoogleApiKey'] = function ($c) {
    $GoogleApiKey = $c['settings']['GoogleApiKey'];
    return $GoogleApiKey;
};

$container['GoogleProjectID'] = function ($c) {
    $GoogleProjectID = $c['settings']['GoogleProjectID'];
    return $GoogleProjectID;
};

$container['roles'] = function ($c) {
    $roles = $c['settings']['roles'];
    return $roles;
};

$container['token'] = function ($c) {
    $token = $c['settings']['token'];
    return $token;
};

$container['notifications'] = function ($c) {
    $notifications = $c['settings']['notifications'];
    return $notifications;
};

$container['imgconfig'] = function ($c) {
    $imgres = $c['settings']['imgconfig'];
    return $imgres;
};

$container['dbwrite'] = function ($c) {
    $db = $c['settings']['dbwrite'];
    $pdo = new PDO("mysql:host=" . $db['host'] . ";dbname=" . $db['dbname'], $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

$container['dbread'] = function ($c) {
    $db = $c['settings']['dbread'];
    $pdo = new PDO("mysql:host=" . $db['host'] . ";dbname=" . $db['dbname'], $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

//$container['logger'] = function($c) {
//  $logger = new \Monolog\Logger('my_logger');
//  $file_handler = new \Monolog\Handler\StreamHandler("../logs/app.log");
//  $logger->pushHandler($file_handler);
//  return $logger;
//};

$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
    return $logger;
};

$container['errorHandler'] = function ($c) {
    return function (Request $request, Response $response, $exception) use ($c) {
        $errorstr = "";
        if ($exception) {
            $errorstr = "File: " . $exception->getFile();
            $errorstr .= ", Line: " . $exception->getLine();
            $errorstr .= ", Message: " . $exception->getMessage();
        }
        $c->logger->addError($errorstr);
        return $c['response']->withStatus(500)
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->write("Something went wrong :( ");
    };
};

$container['phpErrorHandler'] = function ($c) {
    return function (Request $request, Response $response, $exception) use ($c) {
        $errorstr = "";
        if ($exception) {
            $errorstr = "File: " . $exception->getFile();
            $errorstr .= ", Line: " . $exception->getLine();
            $errorstr .= ", Message: " . $exception->getMessage();
        }
        $c->logger->addError($errorstr);
        return $c['response']->withStatus(500)
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->write("Something went wrong :( ");
    };
};
