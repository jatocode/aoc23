#!/bin/bash

for day in $(seq -f "%02g" 1 25)
do
    exe=$day.js
    if [ $# -gt 0 ] && [ $1 = "test" ] 
    then
        input="data/$day-ex.txt"
    else
        input="data/$day-input.txt"
    fi
    if test -f "$exe"; then
        echo "-- Dag $day --"
        node $exe $input
        echo
    fi
done
