<?php
use \Firebase\JWT\JWT;

class Utils
{
    public static function errorMessage($response, $msg = 'error', $data = null)
    {
        $resp = array('error' => 1, "message" => $msg);
        if ($data) {
            $resp['data'] = $data;
        }

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json')->write(json_encode($resp));
    }

    public static function successMessage($response, $msg = 'success', $data = null, $headers = null)
    {
        $resp = array('success' => 1, "message" => $msg);
        if ($headers) {
            foreach ($headers as $key => $value) {
                $resp[$key] = $value;
            }
        }
        if ($data) {
            $resp['data'] = $data;
        }

        return $response->withStatus(200)->withHeader('Content-Type', 'application/json')->write(json_encode($resp));
    }

    public static function generateUniqueId($data)
    {
        assert(strlen($data) == 16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public static function formatDate($year, $month, $day, $morning)
    {
        $time = "23:59:59";
        if ($morning) {
            $time = "00:00:01";
        }
        if (strlen($day) == 1) {
            $day = "0" . $day;
        }
        if (strlen($month) == 1) {
            $month = "0" . $month;
        }
        return $year . "-" . $month . "-" . $day . " " . $time;
    }

    public static function formatDay($year, $month, $day)
    {
        if (strlen($day) == 1) {
            $day = "0" . $day;
        }
        if (strlen($month) == 1) {
            $month = "0" . $month;
        }
        return $year . "-" . $month . "-" . $day;
    }

    public static function generateJWTToken($app, $userid, $role, $email, $jwtversion)
    {
        $tokenId = Utils::generateUniqueId(openssl_random_pseudo_bytes(16));
        $issuedAt = time();
        $notBefore = $issuedAt + 1; //Adding 10 seconds
        $expire = $notBefore + 1000000000; // Adding > 31 years
        $data = [
            'iat' => $issuedAt, // Issued at: time when the token was generated
            'jti' => $tokenId, // Json Token Id: an unique identifier for the token
            'iss' => "ServerIP", // Issuer
            'nbf' => $notBefore, // Not before
            'exp' => $expire, // Expire
            'data' => [ // Data related to the signer user
                'userId' => $userid, // userid from the users table
                'email' => $email, // email
                'role' => $role,
                'jwtversion' => $jwtversion,
            ],
        ];

        $secretKey = $app->JWTsecretkey;
        $jwtToken = JWT::encode(
            $data, //Data to be encoded in the JWT
            $secretKey, // The signing key
            'HS512' // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        );

        return $jwtToken;
    }
}
