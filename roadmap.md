# Roadmap del Proyecto: iPad Viewer (Kiosco Multimedia)

## 📌 Tecnologías Base
- **Frontend:** Vite + React (recomendado por la facilidad para crear componentes aislados para los módulos y manejar estados de APIs) o Vanilla JS + HTML.
- **Estilos:** Tailwind CSS (Dark Mode por defecto, diseño limpio, sin scroll `h-screen`).
- **Hosting:** GitHub Pages con despliegue automatizado vía GitHub Actions.

## 🚀 Fases de Desarrollo

### Fase 1: Setup y Estructura (MVP)
- [ ] Inicializar el proyecto con Vite y configurar Tailwind CSS.
- [ ] Crear el layout principal usando CSS Grid o Flexbox, asegurando que ocupe exactamente el 100% de la pantalla (`100vh`) sin permitir scroll.
- [ ] Configurar el sistema de paleta de colores (Dark Theme) con fuentes grandes y legibles.
- [ ] **Módulo 1:** Reloj digital y Fecha actual (hora en grande, minutos, fecha completa).

### Fase 2: Consumo de APIs Públicas
- [ ] **Módulo 2:** Clima local (Ramos Mejía, AR). Integración con OpenWeatherMap o WeatherAPI. Mostrar temperatura actual, min/max, sensación térmica e ícono/texto de estado (lluvia, nublado, etc.).
- [ ] **Módulo X:** Implementación del primer módulo sugerido de utilidad pública (ej. Cotización del Dólar).

### Fase 3: Integraciones Personales
- [ ] **Módulo 3:** Lista de tareas "Pendientes". Conectar a Google Sheets API, Google Tasks, o un archivo JSON remoto como fuente de verdad.
- [ ] Diseñar el layout responsivo: probar cómo se adapta la cuadrícula (grid) en resolución de iPad Mini 1ra gen y en resolución de TV 1080p.

### Fase 4: Módulos Adicionales (A elección)
- [ ] Implementar 3-5 módulos extra de la lista de propuestas (ver abajo).
- [ ] Refinar animaciones sutiles (micro-interacciones) y actualizar datos periódicamente en segundo plano (ej. cada 5 min para clima, cada 1 seg para reloj).

### Fase 5: CI/CD y Producción
- [ ] Configurar GitHub Actions (workflow) para construir (build) y desplegar automáticamente en `gh-pages` con cada push a la rama principal.
- [ ] Configurar el iPad para correr Safari en modo Kiosco apuntando a la URL final.

---

## 💡 Propuesta de 10 Módulos Adicionales

Para mantener la pantalla dinámica y útil, aquí te propongo 10 módulos que podríamos agregar a la cuadrícula. Todos deben mantener el diseño minimalista:

1. **💸 Cotización del Dólar:** Dólar Blue, Oficial, MEP, CCL. Información vital y de actualización diaria/horaria en Argentina.
2. **📅 Próxima Reunión / Evento:** Conectado a Google Calendar para mostrarte tu próxima actividad y cuánto falta para ella.
3. **🚗 Tráfico y Tiempo de Viaje:** Estimación de tiempo real hacia tu oficina o un destino frecuente (vía Google Maps API).
4. **📰 Titulares Destacados:** Un scroll lento o un carrusel estático con las 3 noticias principales del día de un portal local (Infobae, La Nación) o tech (Hacker News).
5. **📈 Cripto / Acciones:** Un ticker con el precio y porcentaje de variación de Bitcoin, Ethereum, o el índice Merval.
6. **🐙 GitHub Contributions:** Tu grilla de contribuciones de GitHub del día o de la semana para motivar tu racha de programación.
7. **🎵 Now Playing (Spotify/Apple Music):** La portada del disco y el nombre de la canción que estás escuchando actualmente en tus dispositivos.
8. **🍅 Pomodoro / Timer de Enfoque:** Un pequeño módulo con un timer que puedas iniciar para sesiones de trabajo concentrado.
9. **✉️ Bandeja de Entrada (Unread Emails):** Un contador simple que te indique si tenés correos importantes sin leer en Gmail.
10. **💬 Frase del Día / Stoic Quote:** Una frase motivacional, filosófica o de programación que cambie cada 24 horas para dar un respiro mental.
*(Bonus)* **🏠 Home Assistant / Monitor:** Estado de servidores locales, temperatura de la casa, o cámaras si tenés domótica.

### Fase 2.5: Configuración y Seguridad (Sin Backend)
- [ ] Crear un modal oculto de "Ajustes" (accesible mediante un botón invisible en una esquina o doble click).
- [ ] Formulario para ingresar credenciales: ID de la planilla de Google, Client ID de Spotify, etc.
- [ ] Guardar estas credenciales exclusivamente en el `localStorage` del iPad.
- [ ] Lógica para ocultar los módulos o mostrar un estado "Desconectado" si las credenciales no están configuradas (protegiendo tus datos de cualquiera que visite la URL pública).

### Fase 3: Integraciones Personales (Protegidas)
- [ ] **Módulo 3:** Lista de Tareas y Próximo Evento. Ambos alimentados desde tu planilla de Google Sheets privada (usando el ID guardado en LocalStorage).
- [ ] **Módulo 4:** Spotify "Now Playing". Implementar el flujo de autenticación PKCE de Spotify (ideal para SPAs sin backend), permitiendo iniciar sesión una vez y mantener el acceso usando el Client ID local.
- [ ] **Módulo 5:** Pomodoro Timer. Un reloj de enfoque simple e interactivo.
