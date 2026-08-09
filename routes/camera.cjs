'use strict';
const axios = require('axios');
const { verifyToken, optionalAuth, dbSaveScan, dbLoadScans } = require('../auth_db.cjs');

module.exports = function registerCameraRoutes(app) {

    // POST /translate-image — OCR with Mistral Pixtral + translate with Cohere
    app.post('/translate-image', optionalAuth, async (req, res) => {
        const { imageBase64, targetLang = 'es' } = req.body;
        if (!imageBase64) return res.status(400).json({ error: 'Falta imageBase64' });

        const mistralKey = process.env.MISTRAL_API_KEY;
        const cohereKey  = process.env.COHERE_API_KEY;
        if (!mistralKey) return res.status(503).json({ error: 'MISTRAL_API_KEY no configurada' });
        if (!cohereKey)  return res.status(503).json({ error: 'COHERE_API_KEY no configurada' });

        try {
            // Step 1: Extract text with Mistral Pixtral
            const ocrRes = await axios.post(
                'https://api.mistral.ai/v1/chat/completions',
                {
                    model: 'pixtral-12b-2409',
                    messages: [{
                        role: 'user',
                        content: [
                            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
                            { type: 'text', text: 'Extract all visible text from this image. Return only the raw text preserving line breaks. If no text is visible, return exactly: [sin texto]' }
                        ]
                    }],
                    max_tokens: 1500
                },
                { headers: { 'Authorization': `Bearer ${mistralKey}`, 'Content-Type': 'application/json' }, timeout: 30000 }
            );

            const originalText = ocrRes.data.choices?.[0]?.message?.content?.trim() || '[sin texto]';

            if (originalText === '[sin texto]') {
                return res.json({ originalText: '', translatedText: '', ts: Date.now() });
            }

            // Step 2: Translate with Cohere
            const langNames = { es: 'Spanish', en: 'English', fr: 'French', pt: 'Portuguese', de: 'German', it: 'Italian' };
            const targetName = langNames[targetLang] || targetLang;

            const cohereRes = await axios.post(
                'https://api.cohere.com/v2/chat',
                {
                    model: 'command-a-translate-08-2025',
                    messages: [{
                        role: 'user',
                        content: `Translate the following text to ${targetName}. Return only the translation, no explanations or notes:\n\n${originalText}`
                    }]
                },
                { headers: { 'Authorization': `Bearer ${cohereKey}`, 'Content-Type': 'application/json' }, timeout: 20000 }
            );

            const translatedText = cohereRes.data.message?.content?.[0]?.text?.trim()
                || cohereRes.data.text?.trim()
                || '';

            const result = { originalText, translatedText, sourceLang: 'auto', targetLang, ts: Date.now() };

            // Save to history if user is logged in
            if (req.jwtUser?.id) {
                try { dbSaveScan(req.jwtUser.id, result); } catch {}
            }

            res.json(result);
        } catch (err) {
            const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            console.error('[translate-image]', detail);
            res.status(500).json({ error: 'Error procesando la imagen. Intentá de nuevo.' });
        }
    });

    // GET /user/scan-history — returns user's scan history
    app.get('/user/scan-history', verifyToken, (req, res) => {
        try {
            const scans = dbLoadScans(req.jwtUser.id, 100);
            res.json({ scans });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};
