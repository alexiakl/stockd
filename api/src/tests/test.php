<?php
date_default_timezone_set('Asia/Beirut');
require __DIR__ . '/../../vendor/autoload.php';

spl_autoload_register(function ($classname) {
    require ("../../classes/" . $classname . ".php");
});

$settings = require __DIR__ . '/../settings.php';
$env = \Slim\Http\Environment::mock([
    'REQUEST_METHOD' => 'GET',
    'REQUEST_URI' => '/cron/test',
]);
$settings['environment'] = $env;

$app = new \Slim\App($settings);

require __DIR__ . '/../middleware.php';
require __DIR__ . '/../dependencies.php';
require __DIR__ . '/../roles.php';
require __DIR__ . '/../routes.php';
require __DIR__ . '/../utils/Utils.php';
require __DIR__ . '/../utils/DBUtils.php';
require __DIR__ . '/../utils/ImageUtils.php';
require __DIR__ . '/../utils/PushNotificationUtils.php';
require __DIR__ . '/../utils/GoogleUtils.php';

$app->map(['GET'], '/cron/test', function () {
    $password_string = 'abcdefghijklmnpqrstuwxyzABCDEFGHJKLMNPQRSTUWXYZ23456789';

//  $users = DBUtils::read($this, "SELECT id, firstname, lastname, phone_number FROM sd_users where active = 1 and role > 14 and created > '2017-09-13 14:05:45'");
    //  foreach ($users as $user) {
    //
    //    $id = $user['id'];
    //    $firstname = $user['firstname'];
    //    $lastname = $user['lastname'];
    //    $phone_number = $user['phone_number'];
    //
    //    $password = substr(str_shuffle($password_string), 0, 8);
    //
    //         $hpsasword = password_hash($password, PASSWORD_BCRYPT);
    //    DBUtils::write($this, "UPDATE sd_users SET password = :password WHERE id = :id", array("password" => $hpsasword, "id" => $id));
    //
    //    var_dump($firstname . " " . $lastname . " (" . $phone_number . ") : " . $password);
    //  }
});

$app->run();
