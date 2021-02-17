#!/usr/bin/env perl

use IO::Socket::INET;

$server=$ARGV[0];

$r=IO::Socket::INET->new($server);

if ($r) {
  exit 0;
} else {
 exit 1;
}
