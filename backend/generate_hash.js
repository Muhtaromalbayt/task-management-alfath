const bcrypt = require('bcryptjs');

async function main() {
    const hash = await bcrypt.hash('alfath20252026', 10);
    console.log('Hash:', hash);
}

main();
