<?php

class OpenRequests
{
    public static function authUser($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $email = $allVars['email'];
        $password = $allVars['password'];

        $query = "SELECT password, jwtversion, role, id, firstname, lastname, picture, email FROM sd_users where email = :email and active = 1";
        $user = DBUtils::read($app, $query, array("email" => $email));
        if ($user) {
            $dbpassword = $user[0]['password'];
            $jwtversion = $user[0]['jwtversion'];
            $firstname = $user[0]['firstname'];
            $lastname = $user[0]['lastname'];
            $picture = $user[0]['picture'];
            $role = $user[0]['role'];
            $email = $user[0]['email'];
            if (!$jwtversion) {
                $jwtversion = 1;
            }
            if (password_verify($password, $dbpassword)) {
                $jwtToken = Utils::generateJWTToken($app, $user[0]['id'], $user[0]['role'], $email, $jwtversion);

                $params = array("email" => $email, "jwtversion" => $jwtversion, "lastauth" => date("Y-m-d H:i:s"));
                DBUtils::write($app, "UPDATE sd_users set lastauth = :lastauth, jwtversion = :jwtversion where email = :email", $params);
                return Utils::successMessage($response, "Success", array("jwtToken" => $jwtToken, "firstname" => $firstname, "lastname" => $lastname, "email" => $email, "picture" => $picture, "role" => $role));
            }
        } else {
            return Utils::errorMessage($response, "Username does not exist", $user);
        }

        return Utils::errorMessage($response, "Username or password not matching");
    }

    public static function hello($request, $response, $app)
    {
        return Utils::successMessage($response, "Hello!");
    }
}
