<?php

class ModeratorRequests
{
    public static function filterUsers($request, $response, $app)
    {
        $name = "%" . $request->getAttribute('name') . "%";
        $query = "SELECT id, firstname, middlename, lastname, phone_number, picture, email, role FROM sd_users WHERE active = 1 and role > 0 and CONCAT( firstname,  ' ', lastname ) LIKE :name limit 20";
        $users = DBUtils::read($app, $query, array("name" => $name));
        return Utils::successMessage($response, 'success', $users);
    }

    public static function updateUser($request, $response, $app)
    {
        $allVars = $request->getParsedBody();
        $firstname = $allVars['firstname'];
        $middlename = $allVars['middlename'];
        $lastname = $allVars['lastname'];
        $email = $allVars['email'];
        $picture = $allVars['picture'];
        $role = $allVars['role'];
        $phone_number = $allVars['phone_number'];

        if (!$role || $role < 1) {
            $role = 15;
        }
        $id = $allVars['id'];
        $record = DBUtils::read($app, "SELECT udid, picture FROM sd_users where id = :id", array("id" => $id));
        if (!$record) {
            return Utils::errorMessage($response, "Wrong user id");
        }
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
        $pictureurl = $record[0]['picture'];
        if ($picture) {
            $udid = $record[0]['udid'];
            $pictureurl = $app->bucketurl . "media/users/$udid/profile/img_low.jpg";
            ImageUtils::uploadImage($app, $picture, "media/users/$udid/profile/img.jpg");
        }

        DBUtils::write($app, "UPDATE sd_users SET firstname = :firstname, middlename = :middlename, lastname = :lastname, email = :email, picture = :pictureurl, phone_number = :phonenumber, role = :role WHERE id = :id", array("firstname" => $firstname, "middlename" => $middlename, "lastname" => $lastname, "pictureurl" => $pictureurl, "email" => $email, "phonenumber" => $phone_number, "role" => $role, "id" => $id));
        return Utils::successMessage($response, "User updated successfully");
    }

    public static function getUsers($request, $response, $app)
    {
        $query = "SELECT id, firstname, lastname, phone_number, picture FROM sd_users WHERE active = 1 and role > 1 and role < 15";
        $users = DBUtils::read($app, $query);
        return Utils::successMessage($response, 'success', $users);
    }
}
