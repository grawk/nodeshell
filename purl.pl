#!/usr/bin/perl

# make directory based on timestamp

my $time = time();
chdir 'ws/cdep';
`mkdir $time`;
chdir $time;
`pwd`;
#my $copy = `cp -r ../../cont/ .`;
#my $add = `git add .`;
#my $com = `git status`;
print `pwd`;