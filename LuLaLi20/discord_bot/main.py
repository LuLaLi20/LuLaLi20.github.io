import discord
import os
import json
from PIL import Image, ImageDraw, ImageFont, ImageOps
import aiohttp
import io

# --- CONFIGURACIÓN ---
# Carga el token de forma segura desde las variables de entorno de Render
TOKEN = os.getenv("DISCORD_TOKEN") 
# Nombre del canal donde se enviarán los mensajes de bienvenida
WELCOME_CHANNEL_NAME = "bienvenida" 
# Archivo para guardar los datos de niveles
DATA_FILE = "levels.json"

# Niveles y la cantidad de XP (mensajes) necesaria para alcanzarlos
# Puedes ajustar estos valores como quieras
LEVELS = [
    (1, 10), (2, 20), (5, 50), (10, 100), (25, 250), (50, 500), 
    (100, 1000), (250, 2500), (500, 5000), (1000, 10000)
]

# --- INTENTS DEL BOT ---
intents = discord.Intents.default()
intents.members = True  # Necesario para on_member_join
intents.message_content = True  # Necesario para on_message
client = discord.Client(intents=intents)

# --- MANEJO DE DATOS DE NIVELES ---
def load_data():
    """Carga los datos de los usuarios desde el archivo JSON."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_data(data):
    """Guarda los datos de los usuarios en el archivo JSON."""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# Cargar los datos al iniciar el bot
user_data = load_data()

# --- FUNCIÓN PARA CREAR LA IMAGEN DE BIENVENIDA ---
async def create_welcome_image(member):
    """Crea una imagen de bienvenida personalizada."""
    try:
        # Abrir la imagen de fondo
        background = Image.open("welcome_background.png").convert("RGBA")
        draw = ImageDraw.Draw(background)

        # Cargar la fuente
        font = ImageFont.truetype("arial.ttf", 40)
        
        # Obtener el avatar del usuario
        async with aiohttp.ClientSession() as session:
            async with session.get(str(member.display_avatar.url)) as resp:
                if resp.status != 200:
                    return None # No se pudo descargar el avatar
                avatar_data = io.BytesIO(await resp.read())
        
        avatar = Image.open(avatar_data).convert("RGBA")
        
        # Crear una máscara circular para el avatar
        size = (150, 150)
        mask = Image.new('L', size, 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((0, 0) + size, fill=255)
        
        # Redimensionar y aplicar la máscara al avatar
        avatar = avatar.resize(size)
        avatar.putalpha(mask)

        # Pegar el avatar en el fondo (ajusta las coordenadas x, y según tu imagen)
        background.paste(avatar, (75, 75), avatar)

        # Escribir el nombre del usuario (ajusta las coordenadas x, y)
        draw.text((250, 120), f"{member.name}", font=font, fill="#FFFFFF")

        # Guardar la imagen final en un buffer de bytes
        final_buffer = io.BytesIO()
        background.save(final_buffer, "PNG")
        final_buffer.seek(0)
        
        return discord.File(final_buffer, filename="welcome.png")
        
    except Exception as e:
        print(f"Error creando la imagen de bienvenida: {e}")
        return None

# --- EVENTOS DEL BOT ---

@client.event
async def on_ready():
    """Se ejecuta cuando el bot se conecta correctamente."""
    print(f'¡Bot conectado como {client.user}!')
    print('El bot está listo y funcionando.')

@client.event
async def on_member_join(member):
    """Se ejecuta cuando un nuevo miembro se une al servidor."""
    print(f'{member.name} se ha unido al servidor.')
    channel = discord.utils.get(member.guild.text_channels, name=WELCOME_CHANNEL_NAME)
    
    if not channel:
        print(f"ADVERTENCIA: No se encontró el canal '{WELCOME_CHANNEL_NAME}'.")
        return

    # Crear y enviar la imagen de bienvenida
    welcome_image = await create_welcome_image(member)
    if welcome_image:
        await channel.send(f"¡Bienvenido al servidor, {member.mention}!", file=welcome_image)
    else:
        # Fallback por si la imagen falla
        await channel.send(f"¡Bienvenido al servidor, {member.mention}!")


@client.event
async def on_message(message):
    """Se ejecuta cada vez que se envía un mensaje."""
    # Ignorar mensajes del propio bot y mensajes privados
    if message.author == client.user or message.guild is None:
        return
    
    user_id = str(message.author.id)
    
    # Inicializar datos del usuario si no existen
    if user_id not in user_data:
        user_data[user_id] = {"xp": 0, "level": 0}
    
    # Añadir XP por cada mensaje
    user_data[user_id]["xp"] += 1
    
    current_level = user_data[user_id]["level"]
    current_xp = user_data[user_id]["xp"]
    
    # Comprobar si el usuario ha subido de nivel
    new_level = current_level
    for level_num, xp_req in LEVELS:
        if current_xp >= xp_req and level_num > current_level:
            new_level = level_num

    if new_level > current_level:
        user_data[user_id]["level"] = new_level
        await message.channel.send(f"🎉 ¡Felicidades, {message.author.mention}! Has subido al **Nivel {new_level}**.")

    # Guardar los datos actualizados
    save_data(user_data)


# --- INICIAR EL BOT ---
client.run(TOKEN)
