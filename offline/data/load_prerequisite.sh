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
for line in `cat ./shorturls.txt`; do
  hxselect '#main' -c < temp.html | grep  "Prerequisite" -A 100 | grep -oP "<a.*" | hxselect -c 'a' -s '\n' > prereq.temp

  curl -s $line > temp.html
  echo -n "{" >> $output
  echo -n "\"code\": \"" >> $output
  hxselect '#main' -c < temp.html | grep -o -P '(?<=<span>).*(?=</span>)' | sed s/\'/\\\\\'/g | sed -e 's/^[ \t]*//' | tr -d '\012\015' >> $output
  echo -n "\"," >> $output
  echo -n "\"prerequisites\": " >> $output
  echo -n "[" >> $output
  while read innerline; do
    echo -n "\"" >> $output
    echo -n $innerline >> $output
    echo -n "\"" >> $output
    echo -n "," >> $output
  done < prereq.temp
  
  sed 's/,$//' $output > temp
  mv temp $output

  echo -n "]" >> $output

  echo -n "}," >> $output

  rm prereq.temp
done;
echo -n "]" >> $output

# remove last comma
sed -n 'x;${s/,$//;p;x}; 2,$ p' $output > temp
mv temp $output
# rm temp.html