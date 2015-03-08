#!/bin/sh

# PBPL 49 has title issue
# ENGL 53 has title issue
# COLT 7 has title issue

####################################################
# use course urls to download content into a json file
####################################################
output=course.json
touch $output
rm $output
echo "[" >> $output
for line in `cat ./urls.txt`; do
  curl -s $line > temp.html
  echo -n "{" >> $output
  echo -n "\"code\": '" >> $output
  hxselect '#main' -c < temp.html | grep -o -P '(?<=<span>).*(?=</span>)' | sed s/\'/\\\\\'/g | sed -e 's/^[ \t]*//' | tr -d '\012\015' >> $output
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
  hxselect '#main' -c < temp.html | grep "Distributive and/or World Culture" -A 100 | grep -o -P '(?<=</h3>).*(?=<div id="offered")' | tr -d '\012\015' >> $output
  echo -n "'," >> $output

  echo -n "\"prerequisites\": " >> $output
  echo -n "[" >> $output
  hxselect '#main' -c < temp.html | grep  "Prerequisite" -A 100 | grep -oP "<a.*" | hxselect -c 'a' -s '\n' > prereq.temp
  linecount=`wc -l < prereq.temp`
  currentline=0
  while read innerline; do
    currentline=$((currentline + 1))
    echo -n "\"" >> $output
    echo -n $innerline >> $output
    echo -n "\"" >> $output
    if [ "$currentline" -ne "$linecount" ]; then
      echo -n "," >> $output
    fi
  done < prereq.temp
  echo -n "]" >> $output
  echo -n "," >> $output

  echo -n "\"offered\": '" >> $output
  hxselect '#offered' -c < temp.html | html2text | tail -1 | sed s/\'/\\\\\'/g | sed -e 's/^[ \t]*//'| tr -d '\012\015' >> $output    
  echo "'}," >> $output
done;

# remove last comma
tac $output  | awk '/,$/ && !handled { sub(/,$/, ""); handled++ } {print}' | tac > temp
# sed -n 'x;${s/,$//;p;x}; 2,$ p' $output > temp
mv temp $output
echo -n "]" >> $output

rm temp.html