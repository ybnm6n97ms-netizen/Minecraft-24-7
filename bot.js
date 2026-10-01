const mineflayer = require('mineflayer');

let reconnectTimer = null;
let loopTimer = null;

function createBot() {
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }

    const bot = mineflayer.createBot({
        host: 'Trujillozorra.aternos.me',
        port: 49016,
        username: 'Raboot_356',
        auth: 'offline',
        version: '1.20.4'
    });

    bot.on('spawn', () => {
        console.log('[NPC] El bot ha aparecido correctamente en el mapa.');
    });

    bot.on('login', () => {
        console.log('[NPC] Conexión establecida con el servidor.');
    });

    loopTimer = setInterval(async () => {
        if (!bot || !bot.entity) return;
        try {
            const chestBlock = bot.findBlock({
                matching: bot.registry.blocksByName.chest.id,
                maxDistance: 5
            });
            if (chestBlock) {
                console.log('[NPC] Interactuando con el contenedor...');
                const chest = await bot.openChest(chestBlock);
                await new Promise(r => setTimeout(r, 2000));
                chest.close();
                console.log('[NPC] Contenedor cerrado.');
            } else {
                console.log('[NPC] No hay cofre cerca.');
            }
            await new Promise(r => setTimeout(r, 1000));
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
            console.log('[NPC] Anti-AFK ejecutado.');
        } catch (err) {
            console.log(`[NPC] Error: ${err.message}`);
        }
    }, 45000);

    bot.on('end', (reason) => {
        console.log(`[NPC] Desconectado: ${reason}. Reintentando en 25s...`);
        if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }
        reconnectTimer = setTimeout(createBot, 25000);
    });

    bot.on('error', (err) => console.log(`[NPC] Error: ${err.message}`));
}

createBot();
