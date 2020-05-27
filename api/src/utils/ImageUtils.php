<?php
use Psr\Http\Message\UploadedFileInterface as UploadedFile;

class ImageUtils
{

    public static function moveUploadedFile($directory, UploadedFile $uploadedFile)
    {
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
        $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
        $filename = sprintf('%s.%0.8s', $basename, $extension);

        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

        return $filename;
    }

    public static function decodeImage($base64)
    {
        $picture = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64));
        return imagecreatefromstring($picture);
    }

    public static function uploadImage($app, $image, $fullpath)
    {
        $image = self::decodeImage($image);

        $highres = $app->imgconfig['high'];
        $mediumres = $app->imgconfig['medium'];
        $lowres = $app->imgconfig['low'];

        $seppos = strrpos($fullpath, "/") + 1;
        $pointpos = strrpos($fullpath, ".");

        $path = substr($fullpath, 0, $seppos);
        $name = substr($fullpath, $seppos, $pointpos - $seppos);
        $ext = substr($fullpath, $pointpos);
        $image = self::resizeImage($image, $highres);
        GoogleUtils::uploadImageToBucket($app, $image, $path . $name . "_high" . $ext);

        $image = self::resizeImage($image, $mediumres);
        GoogleUtils::uploadImageToBucket($app, $image, $path . $name . "_medium" . $ext);

        $image = self::resizeImage($image, $lowres);
        GoogleUtils::uploadImageToBucket($app, $image, $path . $name . "_low" . $ext);
    }

    public static function resizeImage($original, $targetDim)
    {
        $originalWidth = imagesx($original);
        $originalHeight = imagesy($original);

        $widthRatio = $targetDim / $originalWidth;
        $heightRatio = $targetDim / $originalHeight;

        if ($widthRatio > 1 && $heightRatio > 1) { // don't scale up
            return $original;
        } else if ($widthRatio < $heightRatio) {
            $dstHeight = ($originalHeight * $targetDim) / $originalWidth;
            $dstWidth = $targetDim;
        } else {
            $dstHeight = $targetDim;
            $dstWidth = ($originalWidth * $targetDim) / $originalHeight;
        }

        $new = imagecreatetruecolor($dstWidth, $dstHeight);
        if ($new === false) {
            return false;
        }

        imagecopyresampled($new, $original, 0, 0, 0, 0, $dstWidth, $dstHeight, $originalWidth, $originalHeight);
        return $new;
    }
}
