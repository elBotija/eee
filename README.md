# iPad Viewer 📱♻️

**Reviví tu viejo iPad dándole una segunda oportunidad como el Dashboard definitivo para tu escritorio.**

iPad Viewer es una Single Page Application (SPA) diseñada específicamente para funcionar sin problemas en dispositivos antiguos (compatibilidad comprobada desde **iOS 9**). En lugar de dejar ese iPad obsoleto juntando polvo en un cajón, esta app lo convierte en un centro de productividad y control que siempre podés tener a la vista mientras trabajás.

## 🚀 Motivación

La obsolescencia programada hace que dispositivos que aún tienen pantallas increíbles queden inservibles porque las apps modernas ya no se pueden instalar. Este proyecto nace con la idea de **"Upcycling"** (supra-reciclaje tecnológico): aprovechar la pantalla de un iPad viejo para correr un dashboard web ligero, moderno, oscuro (para no molestar a la vista) y, sobre todo, compatible con versiones de Safari antiguas.

## ✨ Características (Features)

- 🕰️ **Reloj y Fecha**: Tipografía limpia y gigante para verse a la distancia.
- ⛅️ **Clima en Tiempo Real**: Widget meteorológico que muestra temperatura, sensación térmica, mín/máx y descripción.
- 🍅 **Pomodoro Timer**: Temporizador integrado (5, 10, 15, 20 o 25 minutos) ideal para sesiones de enfoque y estudio.
- 📋 **Gestor de Tareas (Google Sheets)**: Integración sin bases de datos complejas. Lee tus próximos pendientes directamente desde una hoja de cálculo de Google.
- 🎵 **Spotify "Now Playing"**: Muestra la portada del álbum, canción y artista de lo que estás escuchando actualmente en Spotify (con un bypass especial de autenticación para que funcione en dispositivos que no soportan los flujos de login modernos).
- 🌙 **Screensaver Automático**: La pantalla se oscurece automáticamente tras un minuto de inactividad para evitar el "burn-in" y reducir el consumo, despertando con cualquier toque.
- ⚙️ **Configuración Local**: Los datos sensibles (Tokens, IDs) se guardan en el `localStorage` del dispositivo mediante un panel de ajustes oculto.

## 🛠️ Stack Tecnológico

- **Vanilla JavaScript** (ES Modules)
- **Vite** (con `@vitejs/plugin-legacy` para transpilar el código y garantizar que funcione en Safari de iOS 9)
- **Tailwind CSS v3** (Estilizado moderno mediante utilidades)
- **HTML5 & CSS3**

## ⚙️ Instalación y Desarrollo Local

1. Cloná este repositorio:
   ```bash
   git clone https://github.com/elBotija/eee.git
   cd ipdaviewer
   ```

2. Instalá las dependencias:
   ```bash
   npm install
   ```

3. Levantá el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Para compilar la versión de producción (con soporte Legacy para iOS viejo):
   ```bash
   npm run build
   ```

## 🔧 Configuración (Panel de Ajustes)

Para que el dashboard funcione al 100%, necesitás configurarlo haciendo clic en el ícono de "engranaje" (⚙️) abajo a la derecha, en la misma interfaz de la app:

### 1. Google Sheets ID (Para las Tareas)
- Creá una hoja de cálculo de Google Sheets.
- Andá a `Archivo > Compartir > Publicar en la web` (o dale acceso a "Cualquiera con el enlace").
- Copiá el **ID** que se encuentra en la URL de tu hoja (ej: `1BxiMvs0XRYFgwn...`) y pegalo en el panel.

### 2. Spotify Client ID & Refresh Token
Debido a las limitaciones de los navegadores viejos para manejar redirecciones de OAuth complejas, se implementó un sistema de bypass:
- Creá una app en el [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
- Obtené tu **Client ID**.
- Para obtener el **Refresh Token**, logueate la primera vez desde un navegador moderno (tu PC o Mac), obtené el token generado y pegalo manualmente en el campo del iPad viejo. Esto mantendrá la sesión viva indefinidamente sin requerir que el iPad procese el Login de Spotify.

### 3. Configurar el Clima
Por defecto, las coordenadas están configuradas para *Ramos Mejía, Buenos Aires* (-34.6406, -58.5636). Podés editarlas directamente desde el panel de Ajustes en los campos **Latitud** y **Longitud** para ajustar tu ubicación usando la API abierta de Open-Meteo (sin necesidad de API keys).

---

*Hecho con 💡 para darle nueva vida a la tecnología vieja.*
