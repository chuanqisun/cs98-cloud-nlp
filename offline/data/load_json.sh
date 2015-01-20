#!/bin/sh

####################################################
# use course urls to download content into a json file
####################################################
output=course.json
touch $output
rm $output
echo "[" >> $output
for line in `cat ./shorturls.txt`; do
	curl -s $line > temp.html
	echo -n "{" >> $output
	echo -n "\"code\": '" >> $output
	hxselect '#main' -c < temp.html | hxselect 'span' -c | html2text | sed s/\'/\\\\\'/g | sed -e 's/^[ \t]*//' | tr -d '\012\015' >> $output
	echo -n "'," >> $output
	echo -n "\"url\": '" >> $output
	echo -n $line >> $output
	echo -n "'," >> $output
	echo -n "\"title\": '" >> $output
	hxselect '#main' -c < temp.html | hxselect 'h1' -c | cut -d ">" -f3 | html2text | sed s/\'/\\\\\'/g | sed -e 's/^[ \t]*//' | tr -d '\012\015' >> $output
	echo -n "'," >> $output
	echo -n "\"description\": '" >> $output
	hxselect '.desc' -c < temp.html | html2text | sed s/\'/\\\\\'/g | sed -e 's/^[ \t]*//' | grep [0-9A-Za-z] | tr -d '\012\015' >> $output
	echo -n "'," >> $output
	echo -n "\"instructor\": '" >> $output
	hxselect '#instructor' -c < temp.html | html2text | tail -1 | sed s/\'/\\\\\'/g | sed -e 's/^[ \t]*//' | tr -d '\012\015' >> $output 
	echo -n "'," >> $output
	echo -n "\"distribution\": '" >> $output
	grep "<div id=\"distribution\">.*</div>" temp.html -o | html2text | head -2 | tail -1 | tr -d '\012\015' >> $output
	echo -n "'," >> $output
	echo -n "\"offered\": '" >> $output
	hxselect '#offered' -c < temp.html | html2text | tail -1 | sed s/\'/\\\\\'/g | sed -e 's/^[ \t]*//'| tr -d '\012\015' >> $output		
	echo "'}," >> $output
done;
echo -n "]" >> $output

# remove last comma
sed -n 'x;${s/,$//;p;x}; 2,$ p' $output > temp
mv temp $output
rm temp.html