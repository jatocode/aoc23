#!/bin/bash

today=$(date +%d)

echo "-- Dag $today --"

if [ $# -gt 0 ] && [ $1 = "test" ] 
then
    if [ -z $2 ] 
    then
        input="data/$today-ex.txt"
    else
        input="data/$today-ex$2.txt"
    fi
else
    input="data/$today-input.txt"
fi
echo $input
time node "$today.js" $input
echo
