
// Script de Inyección Manual de Token (Native Fetch)
// Uso: node scripts/inject-token.mjs "TU_TOKEN_AQUI"

const BACKEND_URL = 'https://sub-son1k-2-2.fly.dev';
const SECRET = 'son1k-backend-secret-2024-prod';

async function injectToken() {
    const token = process.argv[2];

    if (!token) {
        console.error('❌ Error: Debes proporcionar el token como argumento.');
        process.exit(1);
    }

    console.log('💉 Iniciando inyección de token en Backend Enterprise...');
    console.log(`Target: ${BACKEND_URL}`);

    try {
        const response = await fetch(`${BACKEND_URL}/api/tokens/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SECRET}`
            },
            body: JSON.stringify({
                tokens: [token],
                tier: 'PREMIUM'
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error ${response.status}: ${error}`);
        }

        const data = await response.json();
        console.log('✅ Inyección Exitosa!');
        console.log('Respuesta:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('💥 Fallo en inyección:', error.message);
    }
}

injectToken();
