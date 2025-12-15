#!/usr/bin/env python3
"""
Gerador de Vozes com Edge TTS
Aplicativo web para gerar múltiplos áudios a partir de roteiros
"""

import os
import asyncio
import edge_tts
from flask import Flask, render_template, request, jsonify, send_file
from datetime import datetime
import json

app = Flask(__name__)
app.config['OUTPUTS_FOLDER'] = 'outputs'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Criar pasta de outputs se não existir
os.makedirs(app.config['OUTPUTS_FOLDER'], exist_ok=True)

# Cache de vozes
VOICES_CACHE = None


async def get_all_voices():
    """Obtém todas as vozes disponíveis do Edge TTS"""
    voices = await edge_tts.list_voices()
    return voices


def get_voices_sync():
    """Versão síncrona para obter vozes"""
    global VOICES_CACHE
    if VOICES_CACHE is None:
        VOICES_CACHE = asyncio.run(get_all_voices())
    return VOICES_CACHE


async def generate_audio(text, voice, output_path):
    """Gera um arquivo de áudio usando Edge TTS"""
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


def generate_audio_sync(text, voice, output_path):
    """Versão síncrona para gerar áudio"""
    asyncio.run(generate_audio(text, voice, output_path))


@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')


@app.route('/api/languages', methods=['GET'])
def get_languages():
    """Retorna lista de idiomas disponíveis"""
    try:
        voices = get_voices_sync()

        # Extrair idiomas únicos
        languages = {}
        for voice in voices:
            locale = voice['Locale']
            lang_name = voice['Locale'].split('-')[0].upper()

            if locale not in languages:
                # Mapear códigos de idioma para nomes
                lang_names = {
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
                display_name = lang_names.get(lang_code, locale)

                languages[locale] = {
                    'code': locale,
                    'name': f"{display_name} ({locale})"
                }

        # Ordenar por nome
        sorted_languages = sorted(languages.values(), key=lambda x: x['name'])

        return jsonify({
            'success': True,
            'languages': sorted_languages
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/voices', methods=['GET'])
def get_voices_by_language():
    """Retorna vozes filtradas por idioma"""
    try:
        language = request.args.get('language', '')

        voices = get_voices_sync()

        # Filtrar vozes pelo idioma
        filtered_voices = []
        for voice in voices:
            if not language or voice['Locale'] == language:
                filtered_voices.append({
                    'name': voice['ShortName'],
                    'displayName': f"{voice['FriendlyName']} ({voice['Gender']})",
                    'gender': voice['Gender'],
                    'locale': voice['Locale']
                })

        # Ordenar por nome
        filtered_voices.sort(key=lambda x: x['displayName'])

        return jsonify({
            'success': True,
            'voices': filtered_voices
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/generate', methods=['POST'])
def generate_audios():
    """Gera múltiplos áudios a partir dos roteiros"""
    try:
        data = request.get_json()

        scripts = data.get('scripts', [])
        voice = data.get('voice', '')
        language = data.get('language', '')

        if not scripts:
            return jsonify({
                'success': False,
                'error': 'Nenhum roteiro fornecido'
            }), 400

        if not voice:
            return jsonify({
                'success': False,
                'error': 'Nenhuma voz selecionada'
            }), 400

        # Gerar timestamp para esta sessão
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        # Gerar todos os áudios
        generated_files = []

        for idx, script in enumerate(scripts, 1):
            if not script.strip():
                continue

            # Nome do arquivo
            filename = f"audio_{timestamp}_{idx:02d}.mp3"
            output_path = os.path.join(app.config['OUTPUTS_FOLDER'], filename)

            # Gerar áudio
            try:
                generate_audio_sync(script, voice, output_path)
                generated_files.append({
                    'index': idx,
                    'filename': filename,
                    'text_preview': script[:50] + ('...' if len(script) > 50 else ''),
                    'success': True
                })
            except Exception as e:
                generated_files.append({
                    'index': idx,
                    'filename': None,
                    'text_preview': script[:50] + ('...' if len(script) > 50 else ''),
                    'success': False,
                    'error': str(e)
                })

        return jsonify({
            'success': True,
            'message': f'{len([f for f in generated_files if f["success"]])} áudios gerados com sucesso',
            'files': generated_files
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/download/<filename>')
def download_file(filename):
    """Download de arquivo de áudio"""
    try:
        file_path = os.path.join(app.config['OUTPUTS_FOLDER'], filename)

        if not os.path.exists(file_path):
            return jsonify({
                'success': False,
                'error': 'Arquivo não encontrado'
            }), 404

        return send_file(file_path, as_attachment=True)

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("🎙️  GERADOR DE VOZES COM EDGE TTS")
    print("=" * 60)
    print("\n📝 Carregando vozes disponíveis...")

    # Pré-carregar vozes
    voices = get_voices_sync()
    print(f"✅ {len(voices)} vozes carregadas com sucesso!")

    print("\n🌐 Iniciando servidor web...")
    print("📍 Acesse: http://localhost:5000")
    print("\n⌨️  Pressione CTRL+C para encerrar\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
