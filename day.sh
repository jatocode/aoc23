#!/bin/bash

day=$1

echo "-- Dag $day --"

if [ $# -gt 0 ] && [ $2 = "test" ] 
then
    if [ -z $3 ] 
    then
        input="data/$day-ex.txt"
    else
        input="data/$day-ex$3.txt"
    fi
else
    input="data/$day-input.txt"
fi
echo $input
time node "$day.js" $input
echo
