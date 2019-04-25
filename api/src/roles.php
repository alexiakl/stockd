<?php
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \Firebase\JWT\JWT;

$protected = function (Request $request, Response $response, $next) {
    $jwtToken = substr($request->getHeader('authorization')[0], 7);
    $authenticated = false;

    $secretKey = $this->JWTsecretkey;
    try {
        $jwtuser = JWT::decode($jwtToken, $secretKey, array('HS512'));
    } catch (Exception $e) {
        return Utils::errorMessage($response, "Failed to decode Token, You are not authorized", array("retry" => true));
    }
    $jwtuser = json_decode(json_encode($jwtuser), true);
    if ($jwtuser) {
        $email = $jwtuser['data']['email'];
        $jwtid = $jwtuser['data']['userId'];
        $jwtrole = $jwtuser['data']['role'];
        $jwtversion = $jwtuser['data']['jwtversion'];
        $user = DBUtils::read($this, "SELECT jwtversion, role, id, udid FROM sd_users where email = :email and active = 1", array("email" => $email));
        if ($user) {
            $dbid = $user[0]['id'];
            $dbrole = $user[0]['role'];
            $dbudid = $user[0]['udid'];
            $dbjwtversion = $user[0]['jwtversion'];
            if ($dbid == $jwtid && $dbrole == $jwtrole && $dbjwtversion == $jwtversion) {
                $request = $request->withAttribute('role', $dbrole);
                $request = $request->withAttribute('phone_number', $phone_number);
                $request = $request->withAttribute('userid', $jwtid);
                $request = $request->withAttribute('udid', $dbudid);
                $response = $next($request, $response);
                $authenticated = true;
            }
        }
    }

    if (!$authenticated) {
        return Utils::errorMessage($response, "You are not authorized", array("logout" => true));
    }
    return $response;
};

$devAdminRole = function (Request $request, Response $response, $next) {
    $role = $request->getAttribute('role');
    if (intval($role) <= $this->roles['DEV_ADMIN']) {
        $response = $next($request, $response);
        return $response;
    }

    return Utils::errorMessage($response, "You are not authorized");
};

$adminRole = function (Request $request, Response $response, $next) {
    $role = $request->getAttribute('role');
    if (intval($role) <= $this->roles['ADMIN']) {
        $response = $next($request, $response);
        return $response;
    }

    return Utils::errorMessage($response, "You are not authorized");
};

$moderatorRole = function (Request $request, Response $response, $next) {
    $role = $request->getAttribute('role');
    if (intval($role) <= $this->roles['MODERATOR']) {
        $response = $next($request, $response);
        return $response;
    }

    return Utils::errorMessage($response, "You are not authorized");
};

$userRole = function (Request $request, Response $response, $next) {
    $role = $request->getAttribute('role');
    if (intval($role) <= $this->roles['USER']) {
        $response = $next($request, $response);
        return $response;
    }

    return Utils::errorMessage($response, "You are not authorized");
};
