<?php
class AdminRequests
{
    public static function addUser($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $phone_number = $allVars['phone_number'];
        $firstname = $allVars['firstname'];
        $middlename = $allVars['middlename'];
        $lastname = $allVars['lastname'];
        $email = $allVars['email'];
        $password_string = 'abcdefghijklmnpqrstuwxyzABCDEFGHJKLMNPQRSTUWXYZ23456789';
        $password = substr(str_shuffle($password_string), 0, 8);

        $picture = $allVars['picture'];
        $udid = Utils::generateUniqueId(openssl_random_pseudo_bytes(16));
        $hpsasword = password_hash($password, PASSWORD_BCRYPT);
        $role = $allVars['role'];

        $phone_number = preg_replace('/[^+a0-9]/', '', $phone_number);
        if (!$phone_number || strlen($phone_number) < 8) {
            return Utils::errorMessage($response, "Phone number should be more than 8 digits");
        }
        if (!$firstname || strlen($firstname) < 2) {
            return Utils::errorMessage($response, "First name missing");
        }
        if (!$lastname || strlen($lastname) < 2) {
            return Utils::errorMessage($response, "Last name missing");
        }
        if (!$middlename || strlen($middlename) < 2) {
            $middlename = '';
        }
        if (!$password || strlen($password) < 6) {
            return Utils::errorMessage($response, "Password must be at least 6 characters");
        }
        if (!$role || intval($role) < 1) {
            return Utils::errorMessage($response, "Role is missing");
        }
        if ($picture) {
            $pictureurl = $app->bucketurl . "media/users/$udid/profile/img_low.jpg";
            ImageUtils::uploadImage($app, $picture, "media/users/$udid/profile/img.jpg");
        }

        $query = "INSERT INTO sd_users(phone_number,firstname,middlename,lastname,udid,email,password,role,picture) VALUES(:phone_number,:firstname,:middlename,:lastname,:udid,:email,:password,:role,:pictureurl)";
        $params = array("phone_number" => $phone_number, "firstname" => $firstname, "middlename" => $middlename, "lastname" => $lastname, "udid" => $udid, "email" => $email, "password" => $hpsasword, "role" => $role, "pictureurl" => $pictureurl);
        DBUtils::write($app, $query, $params);

        return Utils::successMessage($response, $password);
    }

    public static function resetPassword($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $password = $allVars['password'];
        $id = $allVars['id'];
        $hpsasword = password_hash($password, PASSWORD_BCRYPT);
        if (!$password || strlen($password) < 6) {
            return Utils::errorMessage($response, "Password must be at least 6 characters");
        }
        DBUtils::write($app, "UPDATE sd_users SET password = :password, jwtversion = jwtversion + 1 WHERE id = :id", array("password" => $hpsasword, "id" => $id));
        return Utils::successMessage($response, "Password reset successfully");
    }

    public static function getRoles($request, $response, $app)
    {
        $roles = DBUtils::read($app, "SELECT * FROM sd_roles");
        return Utils::successMessage($response, "roles", $roles);
    }

    public static function deleteUser($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $id = $allVars['id'];

        if ($id) {
            DBUtils::write($app, "UPDATE sd_users SET active = 0 WHERE id = :id", array("id" => $id));
            return Utils::successMessage($response, "User deleted successfully");
        }
        return Utils::errorMessage($response, "User id not available");
    }

    public static function editUserRole($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $role = $allVars['role'];
        if (!$role || intval($role) < 1) {
            return Utils::errorMessage($response, "Role is missing");
        }
        DBUtils::write($app, "UPDATE sd_users SET role = :role WHERE id = :id", array("role" => $role, "id" => $id));
    }
}
