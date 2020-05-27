<?php
require 'configs.php';

return [
    'settings' => [
        'displayErrorDetails' => false, // set to false in production
        'addContentLengthHeader' => true, // Allow the web server to send the content-length header
        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        'firebasekey' => '',
        'JWTsecretkey' => JWT_SECRET_KEY,
        'GoogleApiKey' => '',
        'GoogleProjectID' => '',
        'bucketurl' => '',

        'roles' => [
            'DEV_ADMIN' => 0,
            'ADMIN' => 1,
            'MODERATOR' => 5,
            'USER' => 15,
        ],
        'token' => [
            'dev' => DEV_TOKEN,
            'prod' => PROD_TOKEN,
        ],
        'notifications' => [
            'SMALLTALK' => 1,
            'ANNOUNCEMENT' => 2,
            'EVENT' => 3,
            'DAYCLOSED' => 4,
            'PHOTO' => 5,
            'OTHER' => 99,
        ],
        // DB read settings
        'dbread' => [
            'host' => HOST,
            'user' => READ_DB,
            'pass' => DB_PASS,
            'dbname' => DB_NAME,
        ],
        // DB write settings
        'dbwrite' => [
            'host' => HOST,
            'user' => WRITE_DB,
            'pass' => DB_PASS,
            'dbname' => DB_NAME,
        ],
        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => '/var/stockd/stockd-api/logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],

        'imgconfig' => [
            'high' => 3000,
            'medium' => 1000,
            'low' => 200,
        ],
    ],
];
