<?php

class UserRequests
{
    public static function ping($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $pushtoken = $allVars['pushtoken'];
        $os = $allVars['os'];
        $appversion = $allVars['appversion'];
        $id = $request->getAttribute('userid');
        if ($pushtoken && strlen($pushtoken) > 0) {
            DBUtils::write($app, "UPDATE sd_users SET os = :os, app_version = :app_version, push_token = :push_token WHERE id = :id", array("os" => $os, "app_version" => $appversion, "push_token" => $pushtoken, "id" => $id));
        } else {
            DBUtils::write($app, "UPDATE sd_users SET os = :os, app_version = :app_version WHERE id = :id", array("os" => $os, "app_version" => $appversion, "id" => $id));
        }

        return Utils::successMessage($response);
    }

    public static function iex($request, $response, $app, $args, $sandbox = false)
    {
        $param = $args['query'];
        $query = base64_decode($param);
        $api = 'https://cloud.iexapis.com/stable/';
        $token = '&token=' . $app->token['prod'];
        if ($sandbox) {
            $api = 'https://sandbox.iexapis.com/stable/';
            $token = '&token=' . $app->token['dev'];
        }

        $ch = curl_init();
        $url = $api . $query . $token;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $data = json_decode(curl_exec($ch), true);
        curl_close($ch);
        return Utils::successMessage($response, "success", $data);
    }

    public static function changePassword($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $oldpassword = $allVars['oldpassword'];
        $newpassword = $allVars['newpassword'];
        $id = $request->getAttribute('userid');
        $nhpassword = password_hash($newpassword, PASSWORD_BCRYPT);
        if (!$newpassword || strlen($newpassword) < 6) {
            return Utils::errorMessage($response, "Password must be at least 6 characters");
        }

        $user = DBUtils::read($app, "SELECT id, password, jwtversion, phone_number, role FROM sd_users where id = :id and active = 1", array("id" => $id));
        if ($user) {
            $dbpassword = $user[0]['password'];
            if (password_verify($oldpassword, $dbpassword)) {
                $jwtversion = $user[0]['jwtversion'] + 1;
                $phone_number = $user[0]['phone_number'];
                $jwtToken = Utils::generateJWTToken($app, $user[0]['id'], $user[0]['role'], $phone_number, $jwtversion);
                DBUtils::write($app, "UPDATE sd_users SET password = :password, lastauth = :lastauth, jwtversion = :jwtversion WHERE id = :id", array("password" => $nhpassword, "jwtversion" => $jwtversion, "lastauth" => date("Y-m-d H:i:s"), "id" => $id));
                return Utils::successMessage($response, "Password updated successfully", array("jwtToken" => $jwtToken));
            }
        }

        return Utils::errorMessage($response, "Wrong password");
    }

    public static function logout($request, $response, $app)
    {
        $id = $request->getAttribute('userid');
        DBUtils::write($app, "UPDATE sd_users SET jwtversion = jwtversion+1 where id = :id", array("id" => $id));
        return Utils::successMessage($response, "Logged out successfully");
    }

    public static function deletePortfolio($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $user_id = $request->getAttribute('userid');
        $id = $allVars['id'];
        DBUtils::write($app, "UPDATE sd_portfolio_json SET active = 0 where user_id = :user_id and id = :id", array("user_id" => $user_id, "id" => $id));
        return Utils::successMessage($response, "Portfolio deleted successfully");
    }

    public static function addPortfolio($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $name = $allVars['name'];
        $user_id = $request->getAttribute('userid');
        $portfolio = '{}';
        DBUtils::write($app, "INSERT INTO sd_portfolio_json(user_id, name, portfolio) VALUES(:user_id, :name, :portfolio)", array("name" => $name, "user_id" => $user_id, "portfolio" => $portfolio));
        return Utils::successMessage($response, "Synced successfully");
    }

    public static function savePortfolio($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $portfolio = $allVars['portfolio'];
        $id = $allVars['id'];
        $user_id = $request->getAttribute('userid');
        DBUtils::write($app, "UPDATE sd_portfolio_json SET portfolio = :portfolio where user_id = :user_id and id = :id", array("portfolio" => $portfolio, "user_id" => $user_id, "id" => $id));
        return Utils::successMessage($response, "Synced successfully");
    }

    public static function updatePortfolioName($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $name = $allVars['name'];
        $id = $allVars['id'];
        $user_id = $request->getAttribute('userid');
        DBUtils::write($app, "UPDATE sd_portfolio_json SET name = :name where user_id = :user_id and id = :id", array("name" => $name, "user_id" => $user_id, "id" => $id));
        return Utils::successMessage($response, "Synced successfully");
    }

    public static function getPortfolio($request, $response, $app)
    {
        $user_id = $request->getAttribute('userid');
        $portfolio = DBUtils::read($app, "SELECT id, name, portfolio FROM sd_portfolio_json where active = 1 and user_id = :user_id", array("user_id" => $user_id));
        return Utils::successMessage($response, "success", $portfolio);
    }
}
