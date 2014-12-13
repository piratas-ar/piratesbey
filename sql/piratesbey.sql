-- phpMyAdmin SQL Dump
-- version 4.2.13.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 11, 2014 at 08:08 AM
-- Server version: 10.0.15-MariaDB-log
-- PHP Version: 5.6.3
DROP TABLE IF EXISTS comments, torrents;

--
-- Database: piratesbey
--

-- --------------------------------------------------------

--
-- Table structure for table comments
--

CREATE TABLE IF NOT EXISTS comments (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  torrent_id int(11) NOT NULL,
  date datetime NOT NULL,
  author varchar(127) NOT NULL DEFAULT '',
  comment text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table torrents
--

CREATE TABLE IF NOT EXISTS torrents (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uploaded datetime NOT NULL,
  hash char(40) NOT NULL,
  source varchar(255) NOT NULL UNIQUE,
  title varchar(511) NOT NULL,
  size int(11) NOT NULL DEFAULT 0,
  nfo text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
