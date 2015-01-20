#!/bin/sh

####################################################
# use base_urls to get urls of all the courses
####################################################
touch outtemp.txt
rm outtemp.txt

headcut=http://dartmouth.smartcatalogiq.com/
for line in `cat ./base_urls`; do
	curl -s $line > temp.html
	pattern=`echo $line | cut -d '/' -f4-` # cut leading characters
	for url in `grep -o \/$pattern\/[A-Z]*-[0-9]*-*[0-9]*[^\"] temp.html`; do
		echo $headcut$url >> outtemp.txt
	done;
	# grep -o \/$pattern\/[A-Z]*-[0-9]*-*[0-9]*[^\"] temp.html | sort -u >> urls.txt
done;

cat outtemp.txt | sort -u > urls.txt
rm outtemp.txt
rm temp.html

