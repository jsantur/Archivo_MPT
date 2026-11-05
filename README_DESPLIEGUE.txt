JSANTURARCHIVO — INSTRUCCIONES DE INSTALACIÓN
==============================================

ARCHIVOS DEL PROYECTO
---------------------
1. Code.gs   -> Backend de Google Apps Script.
2. Index.html -> Interfaz web (crear un archivo HTML llamado exactamente Index).

IMPORTANTE SOBRE EL EXCEL
-------------------------
Google Apps Script / SpreadsheetApp no consulta un archivo .xlsx directamente como si
fuera una hoja de cálculo nativa. Primero debes convertir una COPIA del Excel a Google
Sheets. El archivo .xlsx original puede conservarse intacto como respaldo.

PASO 1 — CONVERTIR EL ARCHIVO
-----------------------------
1. Sube BD ARCHIVO 2026.xlsx a Google Drive.
2. Abre el archivo con Hojas de cálculo de Google.
3. En Google Sheets, usa Archivo > Guardar como Hojas de cálculo de Google
   (la opción puede aparecer como “Guardar como Google Sheets”).
4. Trabaja con ese documento convertido. No reemplaces ni borres el Excel original.
5. Copia el ID del documento convertido desde su URL:
   https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit

PASO 2 — CREAR EL PROYECTO APPS SCRIPT
--------------------------------------
1. Abre el Google Sheets convertido.
2. Entra a Extensiones > Apps Script.
3. En el editor, abre Code.gs y reemplaza su contenido por el archivo Code.gs entregado.
4. Pulsa + > HTML. Crea un archivo llamado Index (sin escribir .html en el nombre).
5. Reemplaza el contenido de Index por el archivo Index.html entregado.
6. Guarda el proyecto.

PASO 3 — CONFIGURAR EL ID DE LA BASE
-----------------------------------
En Apps Script:
1. Abre Configuración del proyecto (icono de engranaje).
2. Busca Propiedades de la secuencia de comandos.
3. Añade esta propiedad:

   Propiedad: SPREADSHEET_ID
   Valor:     el ID del Google Sheets convertido, copiado de su URL.

4. Guarda la propiedad.

Esto hace que la aplicación abra explícitamente el documento indicado. No pegues la URL
completa, solo el ID que aparece entre /d/ y /edit.

PASO 4 — AUTORIZAR Y PROBAR ANTES DEL DESPLIEGUE
------------------------------------------------
1. En el selector de funciones del editor, ejecuta testConnection.
2. Autoriza los permisos que Google solicite.
3. Comprueba el registro de ejecución. Deben aparecer las siete pestañas configuradas
   y el número de registros que se leyó de cada una.
4. Ejecuta testCesarAlex.
5. La prueba debe devolver:

   Pestaña: CONST.POSESION
   Celda:   L4
   FILE:    CONSTANCIAS DE POSESIÓN N° 001-50 AÑO 2015
   Texto:   CP. N° 003-1-2015 / Cesar Alex Fiestas Robles -
            Gleen Katheen Rivera Renteria / AH. Nuevo Horizonte MZ F1 lote 15 - Talara Alta

Si la prueba falla, no despliegues todavía: revisa que SPREADSHEET_ID apunte al Google
Sheets convertido que contiene la base correcta y que la cuenta que ejecuta el script
tenga acceso al documento.

PASO 5 — DESPLEGAR COMO APLICACIÓN WEB
--------------------------------------
1. En Apps Script, pulsa Implementar > Nueva implementación.
2. Selecciona el tipo Aplicación web.
3. Ejecutar como: Yo (propietario del proyecto).
4. Quién tiene acceso: limita el acceso al personal autorizado o al dominio institucional.
   Evita “Cualquier persona” porque el inventario contiene nombres y direcciones.
5. Pulsa Implementar y copia la URL de la aplicación web.

Cuando modifiques el código, crea una nueva versión de la implementación para que el
personal use la versión actualizada.

CÓMO TRABAJA ESTA VERSIÓN
-------------------------
- Cada búsqueda vuelve a leer las siete pestañas configuradas desde el Google Sheets.
- No usa RAW_RECORDS ni datos de muestra.
- No guarda el inventario completo en CacheService; evita el límite reducido de caché.
- Mantiene la relación pestaña > columna > rótulo del FILE > celda > documento.
- Busca sin distinguir mayúsculas, minúsculas ni tildes; trata saltos de línea, NBSP,
  espacios invisibles y algunas entidades HTML como separadores.
- Los documentos en columnas sin rótulo no se descartan: aparecen con advertencia.
- El botón “Actualizar lectura” vuelve a consultar las hojas fuente.
- La aplicación es de solo lectura. No crea, modifica ni elimina documentos.
- Se muestran hasta 500 resultados por consulta; si hay más, refina el término.

ESTRUCTURA DE PESTAÑAS CONFIGURADA
----------------------------------
Pestaña             Fila de rótulo FILE     Inicio de documentos
LATERALES           1                       2
RES. GERENCIA       1                       2
ACUERDOS CONCEJO    1                       2
DECRETOS            1                       2
RES. ALCALDIA       2                       3
CONST.POSESION      1                       2
RES MUNIC           2                       3

NOTAS
-----
- La aplicación consulta el Google Sheets convertido, no el archivo .xlsx original.
- Los cambios que se guarden en Google Sheets estarán disponibles en la siguiente búsqueda.
- La búsqueda es en vivo por petición (lee las pestañas en cada búsqueda), no una
  sincronización continua mientras la pantalla está abierta.
- Mantén la copia fuente en Drive y controla quién puede editarla. La aplicación web
  limita sus resultados al acceso configurado al desplegarla.


****-------JSANTURARCHIVO------****

------**** ID de implementación
AKfycbwUzlFc2fmpf_smxa_ceQGIBeMKmNYC4YU25gBP2LdW8w42AVRiESq4ohKhVDAdWFtNuA

------**** URL App web
https://script.google.com/macros/s/AKfycbwUzlFc2fmpf_smxa_ceQGIBeMKmNYC4YU25gBP2LdW8w42AVRiESq4ohKhVDAdWFtNuA/exec

