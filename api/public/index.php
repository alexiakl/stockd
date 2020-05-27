<?php
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

date_default_timezone_set('Asia/Beirut');
require __DIR__ . '/../vendor/autoload.php';

spl_autoload_register(function ($classname) {
    require ("../classes/" . $classname . ".php");
});

// session_start();

$settings = require __DIR__ . '/../src/settings.php';
$app = new \Slim\App($settings);

require __DIR__ . '/../src/middleware.php';
require __DIR__ . '/../src/dependencies.php';
require __DIR__ . '/../src/roles.php';
require __DIR__ . '/../src/routes.php';
require __DIR__ . '/../src/utils/Utils.php';
require __DIR__ . '/../src/utils/DBUtils.php';
require __DIR__ . '/../src/utils/GoogleUtils.php';
require __DIR__ . '/../src/utils/ImageUtils.php';

$app->run();
