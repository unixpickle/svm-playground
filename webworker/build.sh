rm -f ../assets/webworker.js
rm -f ../assets/webworker.js.map
gopherjs build -m
mv *.js *.js.map ../assets
