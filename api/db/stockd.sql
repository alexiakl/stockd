-- MySQL dump 10.13  Distrib 5.7.14, for Linux (x86_64)
--
-- Host: localhost    Database: stockd
-- ------------------------------------------------------
-- Server version	5.7.14-google-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `stockd`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `stockd` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `stockd`;

--
-- Table structure for table `sd_portfolio_json`
--

DROP TABLE IF EXISTS `sd_portfolio_json`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sd_portfolio_json` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `portfolio` json NOT NULL,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(200) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sd_portfolio_json`
--

LOCK TABLES `sd_portfolio_json` WRITE;
/*!40000 ALTER TABLE `sd_portfolio_json` DISABLE KEYS */;
INSERT INTO `sd_portfolio_json` VALUES (1,1,'{\"MSFT\": {\"symbol\": \"MSFT\", \"records\": [{\"buy\": true, \"date\": \"2018-10-03\", \"fees\": 45, \"total\": \"9286.19\", \"symbol\": \"MSFT\", \"quantity\": 40, \"unitPrice\": 115.5149}, {\"buy\": false, \"date\": \"2018-10-03\", \"fees\": 45, \"sdate\": \"2019-03-26\", \"sfees\": 45, \"total\": \"4665.60\", \"action\": \"add\", \"stotal\": \"4845.00\", \"symbol\": \"MSFT\", \"quantity\": 40, \"squantity\": 40, \"unitPrice\": 115.5149, \"sunitPrice\": 120}]}, \"GOOGL\": {\"symbol\": \"GOOGL\", \"records\": [{\"buy\": true, \"date\": \"2019-03-25\", \"fees\": 45, \"sdate\": \"2019-03-25\", \"sfees\": 0, \"total\": \"1245.00\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"GOOGL\", \"quantity\": 1, \"squantity\": null, \"unitPrice\": 1200, \"sunitPrice\": null}, {\"buy\": true, \"date\": \"2018-10-05\", \"fees\": 45, \"sdate\": \"2019-03-25\", \"sfees\": 0, \"total\": \"3645.00\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"GOOGL\", \"quantity\": 3, \"squantity\": null, \"unitPrice\": 1200, \"sunitPrice\": null}]}}','2019-03-26 18:20:56','2019-03-19 18:01:54','Testing',0),(2,1,'{\"AMZN\": {\"symbol\": \"AMZN\", \"records\": [{\"buy\": true, \"date\": \"2018-10-03\", \"sdate\": \"2019-04-06\", \"total\": \"9935.00\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"AMZN\", \"quantity\": 5, \"squantity\": null, \"unitPrice\": 1986.9999, \"sunitPrice\": null, \"originalUnitPrice\": 1977.9999, \"soriginalUnitPrice\": 0}]}, \"MSFT\": {\"symbol\": \"MSFT\", \"records\": [{\"buy\": true, \"date\": \"2018-10-03\", \"sdate\": \"2019-04-06\", \"total\": \"9286.19\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"MSFT\", \"quantity\": 80, \"squantity\": null, \"unitPrice\": 116.0774, \"sunitPrice\": null, \"originalUnitPrice\": 115.5149, \"soriginalUnitPrice\": 0}]}}','2019-04-06 10:34:02','2019-03-24 07:52:17','US Tech',1),(3,1,'{}','2019-03-25 15:53:12','2019-03-25 15:33:31','xx3',0),(4,1,'{}','2019-03-26 07:19:24','2019-03-25 20:23:32','Imagine',0),(5,1,'{\"FB\": {\"symbol\": \"FB\", \"records\": [{\"buy\": true, \"date\": \"2019-03-26\", \"fees\": 45, \"sdate\": \"2019-03-26\", \"sfees\": 0, \"total\": \"2445.00\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"FB\", \"quantity\": 20, \"squantity\": null, \"unitPrice\": 120, \"sunitPrice\": null}]}, \"TSLA\": {\"symbol\": \"TSLA\", \"records\": [{\"buy\": true, \"date\": \"2019-03-28\", \"fees\": 45, \"sdate\": \"2019-03-28\", \"sfees\": 0, \"total\": \"6045.00\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"TSLA\", \"quantity\": 20, \"squantity\": null, \"unitPrice\": 300, \"sunitPrice\": null}]}}','2019-03-31 04:12:37','2019-03-26 07:19:38','Sim1',0),(6,1,'{\"AMZN\": {\"symbol\": \"AMZN\", \"records\": [{\"buy\": true, \"date\": \"2019-04-06\", \"sdate\": \"2019-04-06\", \"total\": \"9935.00\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"AMZN\", \"quantity\": 5, \"squantity\": null, \"unitPrice\": 1986.9999, \"sunitPrice\": null, \"originalUnitPrice\": 1977.9999, \"soriginalUnitPrice\": 0}]}, \"MSFT\": {\"symbol\": \"MSFT\", \"records\": [{\"buy\": true, \"date\": \"2019-04-06\", \"sdate\": \"2019-04-06\", \"total\": \"9286.19\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"MSFT\", \"quantity\": 50, \"squantity\": null, \"unitPrice\": 116.0774, \"sunitPrice\": null, \"originalUnitPrice\": 115.5149, \"soriginalUnitPrice\": 0}, {\"buy\": false, \"date\": \"2019-04-06\", \"fees\": 30, \"sdate\": \"2019-04-06\", \"total\": \"8125.42\", \"action\": \"add\", \"stotal\": \"1198.90\", \"symbol\": \"MSFT\", \"quantity\": 70, \"squantity\": 10, \"unitPrice\": 116.0774, \"sunitPrice\": 119.89, \"originalUnitPrice\": 115.5149}, {\"buy\": false, \"date\": \"2019-04-06\", \"fees\": 30, \"sdate\": \"2019-04-06\", \"total\": \"5803.87\", \"action\": \"add\", \"stotal\": \"2900.00\", \"symbol\": \"MSFT\", \"quantity\": 50, \"squantity\": 20, \"unitPrice\": 116.0774, \"sunitPrice\": 145, \"originalUnitPrice\": 115.5149}, {\"buy\": true, \"date\": \"2019-04-06\", \"fees\": 0, \"sdate\": \"2019-04-06\", \"total\": \"2500.00\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"MSFT\", \"quantity\": 20, \"squantity\": null, \"unitPrice\": 125, \"sunitPrice\": null, \"originalUnitPrice\": 124}]}, \"TSLA\": {\"symbol\": \"TSLA\", \"records\": [{\"buy\": true, \"date\": \"2019-04-07\", \"fees\": 0, \"sdate\": \"2019-04-07\", \"total\": \"24300.00\", \"action\": \"add\", \"stotal\": \"NaN\", \"symbol\": \"TSLA\", \"quantity\": 90, \"squantity\": null, \"unitPrice\": 270, \"sunitPrice\": null, \"originalUnitPrice\": 269}]}}','2019-04-07 05:13:41','2019-03-29 09:02:41','Sim2',1),(7,1,'{}','2019-03-31 04:12:29','2019-03-30 09:22:00','Empty',0),(8,1,'{}','2019-04-20 15:03:17','2019-03-31 04:17:08','Sim3',0),(9,1,'{}','2019-03-31 04:38:48','2019-03-31 04:38:41','empty',0),(10,1,'{}','2019-03-31 04:40:37','2019-03-31 04:40:32','x',0),(11,1,'{}','2019-03-31 04:42:19','2019-03-31 04:42:15','x',0),(12,1,'{}','2019-03-31 04:44:16','2019-03-31 04:44:10','x',0);
/*!40000 ALTER TABLE `sd_portfolio_json` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sd_users`
--

DROP TABLE IF EXISTS `sd_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sd_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL DEFAULT '',
  `middlename` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) NOT NULL DEFAULT '',
  `phone_number` varchar(50) NOT NULL DEFAULT '',
  `udid` varchar(100) DEFAULT NULL,
  `os` varchar(10) DEFAULT NULL,
  `app_version` varchar(100) DEFAULT NULL,
  `push_token` varchar(200) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `valid` tinyint(1) NOT NULL DEFAULT '0',
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) DEFAULT NULL,
  `jwtversion` int(11) DEFAULT NULL,
  `lastactive` timestamp NULL DEFAULT NULL,
  `lastauth` timestamp NULL DEFAULT NULL,
  `role` int(11) NOT NULL DEFAULT '15',
  `picture` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`),
  UNIQUE KEY `email` (`email`),
  KEY `active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sd_users`
--

LOCK TABLES `sd_users` WRITE;
/*!40000 ALTER TABLE `sd_users` DISABLE KEYS */;
INSERT INTO `sd_users` VALUES (1,'Sherlock',NULL,'Holmes','+96100000000','f3f4b42f-6272-4ca9-b101-d2ca9b582f29',NULL,NULL,NULL,'sherlock@holmes.com',1,1,'2019-04-05 15:19:51','2019-03-09 10:24:29','$1$zNM80cyL$TqfOeLRlFlag5nNxHIbwX1',28,NULL,'2019-04-05 18:19:51',0,NULL);
/*!40000 ALTER TABLE `sd_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sd_watch_list_json`
--

DROP TABLE IF EXISTS `sd_watch_list_json`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sd_watch_list_json` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `symbols` json NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sd_watch_list_json`
--

LOCK TABLES `sd_watch_list_json` WRITE;
/*!40000 ALTER TABLE `sd_watch_list_json` DISABLE KEYS */;
/*!40000 ALTER TABLE `sd_watch_list_json` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-25  7:10:24
