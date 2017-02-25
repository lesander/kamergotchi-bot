#/usr/bin/env/sh
set -e

# Run StandardJS.
echo ' → Running StandardJS (http://standardjs.com)..'
standard index.js
echo ' ✓ Finished code style checks.'

# Check for runtime errors.
echo ' → Checking index.js for runtime error(s)..'
node --harmony-async-await index.js
echo ' ✓ No syntax errors found.'

# Run status test script.
echo ' → Checking kamerbotchi status functionality..'
node --harmony-async-await test/status.js
echo " ✓ Statuses are being handled as expected."

echo " ✴ Finished with test, build should pass."
