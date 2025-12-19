#!/usr/bin/env python3
"""
Gerador de Vozes com Edge TTS
Aplicativo web para gerar múltiplos áudios a partir de roteiros
Com divisão automática em chunks de 2000 caracteres para processamento mais rápido
"""

import os
import asyncio
import edge_tts
from flask import Flask, render_template, request, jsonify, send_file
from datetime import datetime
import json
import tempfile
from pydub import AudioSegment
import re

app = Flask(__name__)
app.config['OUTPUTS_FOLDER'] = 'outputs'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
app.config['CHUNK_SIZE'] = 2000  # Tamanho máximo de cada parte do texto

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


def split_text_smart(text, max_length=2000):
    """
    Divide o texto em partes de até max_length caracteres,
    tentando quebrar em pontos naturais (frases completas)
    """
    if len(text) <= max_length:
        return [text]

    chunks = []
    current_chunk = ""

    # Dividir por sentenças (pontos, exclamações, interrogações)
    sentences = re.split(r'([.!?]+\s+)', text)

    for i in range(0, len(sentences), 2):
        sentence = sentences[i]
        separator = sentences[i + 1] if i + 1 < len(sentences) else ""

        full_sentence = sentence + separator

        # Se a sentença sozinha é maior que max_length, dividir por palavras
        if len(full_sentence) > max_length:
            words = full_sentence.split()
            temp_chunk = ""

            for word in words:
                if len(temp_chunk) + len(word) + 1 <= max_length:
                    temp_chunk += word + " "
                else:
                    if temp_chunk:
                        chunks.append(temp_chunk.strip())
                    temp_chunk = word + " "

            if temp_chunk:
                current_chunk = temp_chunk
        else:
            # Se adicionar esta sentença ultrapassar o limite, salvar chunk atual
            if len(current_chunk) + len(full_sentence) > max_length:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = full_sentence
            else:
                current_chunk += full_sentence

    # Adicionar o último chunk
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks


async def generate_audio_chunk(text, voice, output_path):
    """Gera um arquivo de áudio para um chunk de texto"""
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


async def generate_audio_chunks_parallel(chunks, voice, temp_dir):
    """Gera áudios de todos os chunks em paralelo"""
    tasks = []
    temp_files = []

    for i, chunk in enumerate(chunks):
        temp_file = os.path.join(temp_dir, f"chunk_{i:03d}.mp3")
        temp_files.append(temp_file)
        task = generate_audio_chunk(chunk, voice, temp_file)
        tasks.append(task)

    # Executar todas as tarefas em paralelo
    await asyncio.gather(*tasks)

    return temp_files


def concatenate_audio_files(audio_files, output_path):
    """Concatena múltiplos arquivos de áudio em um único arquivo"""
    if len(audio_files) == 1:
        # Se houver apenas um arquivo, apenas copiar
        os.rename(audio_files[0], output_path)
        return

    # Combinar todos os áudios
    combined = AudioSegment.empty()

    for audio_file in audio_files:
        audio = AudioSegment.from_mp3(audio_file)
        combined += audio

    # Exportar o áudio combinado
    combined.export(output_path, format="mp3")


async def generate_audio_with_chunking(text, voice, output_path):
    """
    Gera áudio dividindo o texto em chunks de 2000 caracteres,
    processa em paralelo e concatena o resultado final
    """
    # Dividir texto em chunks
    chunks = split_text_smart(text, app.config['CHUNK_SIZE'])

    print(f"  📊 Texto dividido em {len(chunks)} partes")

    # Criar diretório temporário para chunks
    with tempfile.TemporaryDirectory() as temp_dir:
        # Gerar áudios de todos os chunks em paralelo
        print(f"  🚀 Gerando {len(chunks)} áudios em paralelo...")
        temp_files = await generate_audio_chunks_parallel(chunks, voice, temp_dir)

        # Concatenar todos os áudios
        print(f"  🔗 Concatenando {len(chunks)} áudios...")
        concatenate_audio_files(temp_files, output_path)

    print(f"  ✅ Áudio final gerado!")


def generate_audio_sync(text, voice, output_path):
    """Versão síncrona para gerar áudio com chunking"""
    asyncio.run(generate_audio_with_chunking(text, voice, output_path))


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
    """Gera múltiplos áudios a partir dos roteiros com processamento em chunks"""
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

            # Gerar áudio com chunking
            try:
                print(f"\n🎙️  Processando roteiro {idx}/{len(scripts)}:")
                print(f"  📝 Tamanho: {len(script)} caracteres")

                generate_audio_sync(script, voice, output_path)

                # Obter tamanho do arquivo gerado
                file_size = os.path.getsize(output_path)
                file_size_mb = file_size / (1024 * 1024)

                generated_files.append({
                    'index': idx,
                    'filename': filename,
                    'text_preview': script[:50] + ('...' if len(script) > 50 else ''),
                    'text_length': len(script),
                    'file_size': f"{file_size_mb:.2f} MB",
                    'success': True
                })
            except Exception as e:
                print(f"  ❌ Erro: {str(e)}")
                generated_files.append({
                    'index': idx,
                    'filename': None,
                    'text_preview': script[:50] + ('...' if len(script) > 50 else ''),
                    'text_length': len(script),
                    'success': False,
                    'error': str(e)
                })

        success_count = len([f for f in generated_files if f["success"]])
        print(f"\n✅ Concluído! {success_count}/{len(generated_files)} áudios gerados com sucesso\n")

        return jsonify({
            'success': True,
            'message': f'{success_count} áudios gerados com sucesso',
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
    print("⚡ Com processamento paralelo em chunks de 2000 caracteres")
    print("\n📝 Carregando vozes disponíveis...")

    # Pré-carregar vozes
    voices = get_voices_sync()
    print(f"✅ {len(voices)} vozes carregadas com sucesso!")

    print("\n🌐 Iniciando servidor web...")
    print("📍 Acesse: http://localhost:5000")
    print("\n💡 Recursos:")
    print("  • Divisão automática de textos grandes")
    print("  • Processamento paralelo para maior velocidade")
    print("  • Concatenação automática dos áudios")
    print("\n⌨️  Pressione CTRL+C para encerrar\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
