# kyutai_service.py
import sys
import json
import torch
import soundfile as sf
from moshi.models import load_hibiki_model

def main():
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Uso: python kyutai_service.py <audio_path> <source_lang> <target_lang>"}))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    source_lang = sys.argv[2]
    target_lang = sys.argv[3]
    
    try:
        print("Cargando modelo Hibiki-Zero...", file=sys.stderr)
        model = load_hibiki_model()
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = model.to(device)
        
        audio, sr = sf.read(audio_path)
        audio_tensor = torch.tensor(audio).unsqueeze(0).to(device)
        
        with torch.no_grad():
            # Esta es una API hipotética; consulta la documentación real
            translated_audio, translated_text = model.translate(
                audio_tensor, source_lang=source_lang, target_lang=target_lang
            )
        
        output_path = audio_path.replace(".wav", "_translated.wav")
        sf.write(output_path, translated_audio.cpu().numpy(), sr)
        
        # Devolver JSON con el texto y la ruta
        print(json.dumps({"text": translated_text, "audioPath": output_path}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()