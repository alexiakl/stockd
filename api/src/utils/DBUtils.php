<?php
class DBUtils
{
    public static function read($app, $query, $params = null)
    {
        if ($query) {
            $sth = $app->dbread->prepare($query);
            if ($params) {
                foreach ($params as $key => &$value) {
                    $sth->bindParam($key, $value);
                }
            }
            $sth->execute();
            return $sth->fetchAll();
        }
    }

    public static function write($app, $query, $params = null)
    {
        if ($query) {
            $sth = $app->dbwrite->prepare($query);
            if ($params) {
                foreach ($params as $key => &$value) {
                    $sth->bindParam($key, $value);
                }
            }
            return $sth->execute();
        }
    }

    public static function getLastInsertID($app)
    {
        return $app->dbwrite->lastInsertId();
    }
}
