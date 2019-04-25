<?php
use Google\Cloud\Storage\StorageClient;

class GoogleUtils
{

    public static function uploadImageToBucket($app, $image, $name)
    {
        $storage = new StorageClient([
            'projectId' => $app->GoogleProjectID,
        ]);

        ob_start();
        imagejpeg($image);
        $image_data = ob_get_contents();
        ob_end_clean();

        $bucket = $storage->bucket('stockd');
        $bucket->upload($image_data, ['name' => $name, 'predefinedAcl' => 'publicRead', 'Cache-Control' => 'public, max-age=0']);
    }

    public static function uploadFileToBucket($app, $fileName, $name)
    {
        $storage = new StorageClient([
            'projectId' => $app->GoogleProjectID,
        ]);

        try {
            if (!file_exists($fileName)) {
                $app->logger->addError("file not found " . $fileName);
            }

            $fp = fopen($fileName, "rb");
            if (!$fp) {
                $app->logger->addError("file open failed");
            }
            $str = stream_get_contents($fp);

            $bucket = $storage->bucket('stockd');
            $bucket->upload($fp, ['name' => $name, 'predefinedAcl' => 'publicRead', 'Cache-Control' => 'public, max-age=0']);

            fclose($fp);
        } catch (Exception $e) {
            $app->logger->addError("file open exception");
        }
    }
}
