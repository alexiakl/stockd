<?php

$server = $_SERVER["REMOTE_ADDR"];
$host = 'db-stockd';
$pass = 'stockd';
$dbname = 'stockd';
$writeuser = 'stockd';
$readuser = 'stockd';

return [
    'settings' => [
        'displayErrorDetails' => false, // set to false in production
        'addContentLengthHeader' => true, // Allow the web server to send the content-length header
        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        'firebasekey' => '',
        'JWTsecretkey' => 'Th1s. %4Qd-9mKEy 1809a fRar JwtT11 T00.0Kn',
        'GoogleApiKey' => '',
        'GoogleProjectID' => 'xxxxx-170718',
        'bucketurl' => "https://storage.googleapis.com/stockd/",

        'roles' => [
            'DEV_ADMIN' => 0,
            'ADMIN' => 1,
            'MODERATOR' => 5,
            'USER' => 15,
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
            'host' => $host,
            'user' => $readuser,
            'pass' => $pass,
            'dbname' => $dbname,
        ],
        // DB write settings
        'dbwrite' => [
            'host' => $host,
            'user' => $writeuser,
            'pass' => $pass,
            'dbname' => $dbname,
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
