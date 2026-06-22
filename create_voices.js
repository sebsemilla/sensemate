// create_voices.js - Script único para crear voces clonadas
import { Mistral } from '@mistralai/mistralai';
import { readFileSync } from 'fs';
import path from 'path';
import 'dotenv/config';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

async function createCustomVoice(name, sampleAudioPath, languages, gender) {
    console.log(`🎙️ Creando voz para: ${name}...`);
    try {
        const sampleAudio = readFileSync(sampleAudioPath).toString('base64');
        const voice = await client.audio.voices.create({
            name: name,
            sampleAudio: sampleAudio,
            sampleFilename: path.basename(sampleAudioPath),
            languages: languages,
            gender: gender,
        });
        console.log(`✅ Voz creada: ${voice.id}`);
        console.log(`   Nombre: ${voice.name}`);
        console.log(`   Idiomas: ${voice.languages}`);
        return voice.id;
    } catch (error) {
        console.error(`❌ Error creando voz para ${name}:`, error.message);
        return null;
    }
}

// --- Lista de personajes y la ruta a sus muestras de audio ---
// Puedes ir añadiendo más personajes aquí a medida que consigas las muestras.

const voicesToCreate = [
    { name: "Diego Maradona",         samplePath: "./samples/maradona_sample.mp3", languages: ["es"], gender: "male"   },
    { name: "Martin Luther King Jr.", samplePath: "./samples/mlk_sample.mp3",      languages: ["en"], gender: "male"   },
    { name: "Marilyn Monroe",         samplePath: "./samples/marilyn_sample.mp3",  languages: ["en"], gender: "female" },
];

async function main() {
    for (const voiceConfig of voicesToCreate) {
        const voiceId = await createCustomVoice(voiceConfig.name, voiceConfig.samplePath, voiceConfig.languages, voiceConfig.gender);
        if (voiceId) {
            console.log(`Importante: Guarda este ID para usarlo luego en la app: ${voiceId} (para ${voiceConfig.name})`);
        }
    }
    console.log("✨ Proceso de creación de voces finalizado.");
}

main();