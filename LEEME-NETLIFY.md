# Biblioteca de Enmanuel — Netlify + Google

Esta carpeta contiene la aplicación editable por proyectos, adaptada a Next.js para Netlify.
Incluye temas, bibliografías, archivos, códigos/QR por proyecto y registro privado de accesos.
La cuenta administradora predeterminada es enmanuelrosa02@gmail.com. Se comprueba en el servidor el correo verificado por Google, no un nombre escrito por el visitante.

## Qué necesitas configurar

El código está preparado, pero Google no funcionará hasta que configures un cliente OAuth propio.
No se incluyen claves, contraseñas, sesiones ni datos personales de visitantes.

1. Descomprime el ZIP y sube el CONTENIDO de esta carpeta a un repositorio de GitHub.
2. En Netlify, importa ese repositorio. Este proyecto necesita compilación y funciones: no sirve arrastrar la carpeta fuente a Netlify Drop como si fuera HTML estático.
3. Configuración de compilación (también incluida en netlify.toml):
   - Comando: `npm run build`
   - Directorio de publicación: `.next`
   - Node.js: 22
4. Obtén la dirección definitiva del sitio, por ejemplo `https://tu-biblioteca.netlify.app`.
5. Configura Google siguiendo el apartado siguiente.
6. Añade las variables de entorno indicadas más abajo en Netlify, disponibles para compilación y funciones.
7. Vuelve a desplegar el sitio. Inicia sesión con Google desde la página pública.
8. Si entras con el correo ADMIN_EMAIL, aparecerá Administración. Los demás usuarios solo pueden consultar.

## Google Cloud: inicio de sesión

Abre https://console.cloud.google.com/auth/overview

1. Crea o selecciona un proyecto y configura Google Auth Platform.
2. Define el nombre de la aplicación y el correo de soporte.
3. Selecciona la audiencia adecuada. Si está en modo de prueba, añade las cuentas de prueba (incluida la tuya). Para permitir visitantes generales, completa los requisitos de publicación que Google muestre.
4. Crea un cliente OAuth de tipo «Aplicación web».
5. Origen JavaScript autorizado: `https://tu-biblioteca.netlify.app`.
6. URI de redirección autorizada: `https://tu-biblioteca.netlify.app/api/auth/callback/google`.
7. Copia el Client ID y el Client Secret a las variables de Netlify. No los pongas en el código ni en un repositorio público.

Sustituye el ejemplo por TU dominio real. Si cambias de dominio, actualiza Google y NEXTAUTH_URL.

## Variables de Netlify

| Variable | Valor |
|---|---|
| NEXTAUTH_URL | Tu URL completa, por ejemplo https://tu-biblioteca.netlify.app |
| NEXTAUTH_SECRET | Una clave aleatoria larga generada por ti |
| GOOGLE_CLIENT_ID | Client ID de Google Cloud |
| GOOGLE_CLIENT_SECRET | Client Secret de Google Cloud |
| ADMIN_EMAIL | enmanuelrosa02@gmail.com, o tu cuenta Google administradora verificada |

Genera NEXTAUTH_SECRET en una terminal con Node.js:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

`.env.example` es una plantilla vacía. Para desarrollo puedes copiarla a `.env.local` y rellenarla. Nunca publiques `.env.local`.

## Guardado de datos y archivos

Esta versión utiliza Netlify Blobs: los proyectos, recursos, archivos e historial se guardan en el servidor y persisten entre despliegues del mismo sitio. No necesita Firebase ni una base de datos SQL externa.

Las subidas están limitadas a 4 MB por archivo para ajustarse al límite de peticiones binarias de las funciones de Netlify. Para archivos mayores puedes añadir un enlace de descarga externo como bibliografía/recurso. La versión alojada anteriormente admitía 20 MB: esta limitación sí cambia en esta exportación.

El historial solo se muestra a la cuenta administradora; registra solicitudes de apertura/descarga, no confirma lectura ni descarga completada. El visitante recibe un aviso y debe confirmar antes del registro. Para bibliotecas muy grandes conviene migrar el historial a una base de datos con consultas y paginación; esta versión carga sus registros desde Blobs.

## Qué incluye y qué no se migra

- Se incluyen las seis referencias originales y el proyecto inicial «Español dominicano» (DOM-001).
- Se incluyen todos los componentes y funciones de administración por proyectos.
- Este ZIP es una exportación de código, NO una copia de la base de datos del sitio de ChatGPT.
- Proyectos añadidos desde el panel, archivos subidos, cambios de bibliografías e historial del sitio anterior no se transfieren automáticamente. Debes volver a cargarlos o realizar una migración separada.
- La página anterior de ChatGPT no se modifica al usar este ZIP.
- Los códigos identifican proyectos públicos; no son contraseñas.
- Los nuevos QR se generan con NEXTAUTH_URL. Los QR ya impresos del sitio anterior siguen apuntando a su dirección anterior.

## Desarrollo y comprobación

```sh
npm ci
npm run typecheck
npm run build
```

Para probar el almacenamiento local usa Netlify Dev con tu proyecto vinculado (y credenciales de desarrollo), pues `next dev` por sí solo no proporciona el contexto de Netlify Blobs. En Google, añade como origen y callback el host/puerto local exacto que uses; configura NEXTAUTH_URL con ese mismo origen.

Tras desplegar, comprueba con tu cuenta: crear proyecto, cambiar tema, añadir bibliografía, subir y descargar un archivo pequeño y ver historial. Con otra cuenta: confirmar que no aparecen opciones de administrador y que /admin no permite editar. No se ha realizado un inicio de sesión real con tus credenciales desde este entorno.

## Archivos principales

- `app/hub.tsx`: biblioteca y administración de proyectos.
- `app/project-editor.tsx`: nombre, colores, iconos y presentación.
- `app/library.tsx`: bibliografías y archivos de un proyecto.
- `lib/auth.ts`: Google y validación del correo verificado.
- `app/chatgpt-auth.ts`: puente de compatibilidad de nombres; usa Google/NextAuth, NO ChatGPT.
- `lib/storage.ts`: datos y archivos persistentes en Netlify Blobs.
- `app/api/`: operaciones protegidas del servidor.
- `netlify.toml`: configuración de alojamiento.

## Documentación consultada

https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
https://docs.netlify.com/build/data-and-storage/netlify-blobs/
https://docs.netlify.com/build/functions/configuration/
https://next-auth.js.org/providers/google
https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
