from flask import Flask, render_template, request, jsonify, send_file
import edge_tts
import asyncio
import os
from datetime import datetime
import json

app = Flask(__name__)

# Configurações
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Cache de vozes
VOICES_CACHE = None

async def get_voices():
    """Obtém todas as vozes disponíveis do Edge TTS"""
    global VOICES_CACHE
    if VOICES_CACHE is None:
        voices = await edge_tts.list_voices()
        VOICES_CACHE = voices
    return VOICES_CACHE

def get_voices_sync():
    """Versão síncrona para obter vozes"""
    return asyncio.run(get_voices())

async def generate_audio(text, voice, output_path, rate="+0%", volume="+0%"):
    """Gera um arquivo de áudio a partir do texto"""
    communicate = edge_tts.Communicate(text, voice, rate=rate, volume=volume)
    await communicate.save(output_path)

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/api/languages', methods=['GET'])
def get_languages():
    """Retorna lista de idiomas disponíveis"""
    try:
        voices = get_voices_sync()
        languages = {}

        for voice in voices:
            locale = voice['Locale']
            if locale not in languages:
                language_name = voice['Locale'].split('-')[0].upper()
                # Mapeamento de códigos de idioma para nomes
                language_map = {
                    'pt': 'Português',
                    'en': 'English',
                    'es': 'Español',
                    'fr': 'Français',
                    'de': 'Deutsch',
                    'it': 'Italiano',
                    'ja': '日本語',
                    'ko': '한국어',
                    'zh': '中文',
                    'ru': 'Русский',
                    'ar': 'العربية',
                    'hi': 'हिन्दी'
                }
                lang_code = locale.split('-')[0].lower()
                display_name = language_map.get(lang_code, language_name)

                languages[locale] = {
                    'code': locale,
                    'name': f"{display_name} ({locale})"
                }

        return jsonify(sorted(languages.values(), key=lambda x: x['name']))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voices', methods=['GET'])
def get_voices_by_language():
    """Retorna vozes filtradas por idioma"""
    try:
        language = request.args.get('language', '')
        voices = get_voices_sync()

        filtered_voices = []
        for voice in voices:
            if not language or voice['Locale'] == language:
                filtered_voices.append({
                    'name': voice['ShortName'],
                    'displayName': f"{voice['FriendlyName']} ({voice['Gender']})",
                    'gender': voice['Gender'],
                    'locale': voice['Locale']
                })

        return jsonify(sorted(filtered_voices, key=lambda x: x['displayName']))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate_audios():
    """Gera áudios para múltiplos roteiros"""
    try:
        data = request.json
        scripts = data.get('scripts', [])
        voice = data.get('voice', '')
        rate = data.get('rate', '+0%')
        volume = data.get('volume', '+0%')

        if not scripts:
            return jsonify({'error': 'Nenhum roteiro fornecido'}), 400

        if not voice:
            return jsonify({'error': 'Nenhuma voz selecionada'}), 400

        results = []
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        async def generate_all():
            tasks = []
            for idx, script in enumerate(scripts):
                if not script.get('text', '').strip():
                    continue

                filename = f"audio_{timestamp}_{idx+1:02d}.mp3"
                output_path = os.path.join(OUTPUT_DIR, filename)

                task = generate_audio(
                    script['text'],
                    voice,
                    output_path,
                    rate=rate,
                    volume=volume
                )
                tasks.append({
                    'task': task,
                    'filename': filename,
                    'title': script.get('title', f'Roteiro {idx+1}')
                })

            for item in tasks:
                await item['task']
                results.append({
                    'filename': item['filename'],
                    'title': item['title'],
                    'url': f'/api/download/{item["filename"]}'
                })

        asyncio.run(generate_all())

        return jsonify({
            'success': True,
            'message': f'{len(results)} áudio(s) gerado(s) com sucesso',
            'files': results
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>')
def download_file(filename):
    """Download de arquivo de áudio"""
    try:
        file_path = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'Arquivo não encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files', methods=['GET'])
def list_files():
    """Lista todos os arquivos de áudio gerados"""
    try:
        files = []
        if os.path.exists(OUTPUT_DIR):
            for filename in os.listdir(OUTPUT_DIR):
                if filename.endswith('.mp3') or filename.endswith('.wav'):
                    file_path = os.path.join(OUTPUT_DIR, filename)
                    files.append({
                        'filename': filename,
                        'size': os.path.getsize(file_path),
                        'created': datetime.fromtimestamp(os.path.getctime(file_path)).strftime('%Y-%m-%d %H:%M:%S'),
                        'url': f'/api/download/{filename}'
                    })

        return jsonify(sorted(files, key=lambda x: x['created'], reverse=True))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
