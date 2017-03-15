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

# Run care test script.
echo ' → Checking kamerbotchi care functionality..'
node --harmony-async-await test/care.js
echo " ✓ Care points can be spent as expected."

# Run claim test script.
echo ' → Checking kamerbotchi claim functionality..'
node --harmony-async-await test/claim.js
echo " ✓ Score bonus can be claimed as expected."

# Run register test script.
echo ' → Checking kamerbotchi register functionality..'
node --harmony-async-await test/register.js
echo " ✓ Registering works as expected."

echo " ✴ Finished with test, build should pass."
