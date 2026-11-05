# JSanturArchivo — Skill de análisis, diseño y desarrollo

> **Propósito:** orientar el análisis, diseño, programación y evolución de un sistema web de consulta para el área de Archivo, utilizando como fuente de datos el inventario documental existente en `BD ARCHIVO 2026.xlsx` (convertido a Google Sheets para su consumo desde Google Apps Script).
>
> **Fase prioritaria:** consulta y localización rápida de documentos. No implementar todavía operaciones CRUD para registrar, editar o eliminar documentos.

---

## 1. Rol que debe asumir el agente

Actúa como diseñador Full-Stack, programador senior y arquitecto de software con criterio de archivo institucional. Integra simultáneamente:

1. **Diseño UX/UI:** interfaz clara, sobria, profesional, accesible, responsive y optimizada para personal administrativo que necesita consultar documentos con rapidez.
2. **Ingeniería de software:** código modular, mantenible, seguro, eficiente, documentado y con responsabilidades separadas.
3. **Arquitectura de sistemas:** fuente de datos protegida, estructura de indexación consistente, trazabilidad de cada resultado, rendimiento medible y prevención de errores de interpretación documental.

No te limites a programar literalmente una solicitud. Primero comprende el flujo real de trabajo del archivo, identifica riesgos, valida la estructura del libro y después propone o implementa la solución más simple que sea fiable y ampliable.

## 2. Contexto operativo del Archivo

El archivo Excel representa un inventario de documentos físicos.

- Cada **pestaña** representa una serie o grupo documental, por ejemplo: `DECRETOS`, `ACUERDOS CONCEJO`, `CONST.POSESION` o `RES. ALCALDIA`.
- Cada **columna** representa normalmente un **file físico**.
- El texto del encabezado de esa columna es el **rótulo del file** que se encuentra físicamente en el archivo.
- Cada **celda ocupada debajo del encabezado** representa una referencia o registro de un documento contenido en ese file.
- El contenido de la celda puede incluir número o código del documento, fecha, nombre(s) de persona(s), asociación, urbanización, dirección, manzana, lote, asunto u otros datos descriptivos.
- La ubicación física verificable en la primera versión es el nombre del file/rótulo y su referencia de origen en la hoja. No inventar estante, pasillo, caja, archivador ni ubicación que no esté registrada.

### Ejemplo conceptual

Pestaña: `CONST.POSESION`

Rótulo de la columna/file:

`CONSTANCIAS DE POSESIÓN N° 500-549 AÑO 2014`

Registro ubicado en esa columna:

`CP. N° 500-6-2014 / Luz Petronila Llenque Galan / AH Sol de Oro Mz A1 Lote 7`

El sistema debe devolver, como mínimo:

- Serie documental: Constancias de Posesión.
- Referencia del documento: CP. N° 500-6-2014.
- Año identificado: 2014.
- Persona: Luz Petronila Llenque Galan.
- Ubicación/dirección registrada: AH Sol de Oro Mz A1 Lote 7.
- Pestaña de origen: `CONST.POSESION`.
- File físico: `CONSTANCIAS DE POSESIÓN N° 500-549 AÑO 2014`.
- Celda de origen: coordenada Excel, por ejemplo `K2`.

La coordenada es una referencia de auditoría; el elemento que debe guiar al personal hacia el documento físico es el rótulo completo del file.

## 3. Perfil real de la base revisada

Fuente revisada: `BD ARCHIVO 2026.xlsx`.

| Pestaña | Fila de encabezados de files | Primera fila de registros | Encabezados de files identificados | Celdas documentales no vacías |
|---|---:|---:|---:|---:|
| LATERALES | 1 | 2 | 69 | 1,627 |
| RES. GERENCIA | 1 | 2 | 12 | 613 |
| ACUERDOS CONCEJO | 1 | 2 | 45 | 1,001 |
| DECRETOS | 1 | 2 | 23 | 1,498 |
| RES. ALCALDIA | 2 | 3 | 151 | 11,106 |
| CONST.POSESION | 1 | 2 | 17 | 644 |
| RES MUNIC | 2 | 3 | 11 | 1,024 |
| **TOTAL** | — | — | **328** | **17,513** |

Estas cifras representan encabezados y celdas con contenido observados en el archivo revisado; no equivalen necesariamente a 17,513 documentos físicos únicos. Puede haber referencias repetidas, duplicados o registros incompletos.

### Particularidades que deben conservarse

- `LATERALES`: los rótulos están en la fila 1; las referencias empiezan en la fila 2. Tiene 69 columnas con rótulo.
- `RES. GERENCIA`: los encabezados no son contiguos; hay files en columnas A:J y O:P. No asumir que los files están uno al lado del otro ni renumerar columnas.
- `ACUERDOS CONCEJO`: hay 45 rótulos en la fila 1. Se detectó una celda con contenido en la columna AY sin rótulo asociado en esa columna. Debe conservarse y marcarse como `RÓTULO NO IDENTIFICADO — REVISAR`, sin asignarle un file inventado.
- `DECRETOS`: encabezados en fila 1 y documentos desde fila 2.
- `RES. ALCALDIA`: los 151 rótulos están en la fila 2 y los registros empiezan en la fila 3.
- `CONST.POSESION`: hay 17 rótulos en fila 1; la columna P está vacía. No desplazar columnas para compactar los datos.
- `RES MUNIC`: los rótulos están en fila 2 y los registros empiezan en fila 3.
- Algunas dimensiones del libro incluyen celdas solamente formateadas. Para contar y buscar documentos, considerar las celdas con valor visible no vacío, no solamente el rango de formato de la hoja.

**Regla innegociable:** conservar siempre la coordenada original de la celda. No modificar el libro original para que encaje en una estructura supuesta.

## 4. Problema que debe resolver el sistema

Actualmente, cuando otra oficina remite un memorando o solicita verificar si existe un documento de un año, serie, número, persona o ubicación, el personal debe revisar manualmente varias pestañas y columnas. Esto provoca demoras, búsquedas repetidas y dificultad para identificar el file físico correcto.

El sistema debe convertir esa consulta manual en una búsqueda centralizada que responda:

1. ¿Aparece el documento solicitado en la base digital?
2. ¿En qué serie documental/pestaña aparece?
3. ¿Cuál es el número o referencia del documento?
4. ¿Qué año se identifica en el registro o rótulo?
5. ¿Qué datos descriptivos coinciden con la consulta?
6. ¿En qué file físico debe buscar el personal?
7. ¿En qué celda de la hoja de origen está registrado?

## 5. Alcance de la Fase 1: buscador documental

### Incluido

- Aplicación web interna desarrollada con Google Apps Script.
- Consulta global en las siete pestañas actuales.
- Búsqueda por texto libre: número, código, nombres, apellidos, dirección, urbanización, asociación, manzana, lote y asunto, cuando existan en la celda.
- Búsqueda por número exacto o parcial, tolerando diferencias de espacios, guiones, puntos, símbolos `N°`, `Nº` y variaciones de mayúsculas/minúsculas.
- Filtros por pestaña/serie documental y año.
- Filtro por área únicamente después de confirmar qué significa “área” para el usuario (serie documental, área física/frontal/lateral, oficina solicitante u otra categoría).
- Resultados múltiples ordenados por relevancia.
- Presentación del rótulo del file físico y de la procedencia exacta del dato.
- Opción para copiar los datos de referencia o un texto preliminar de respuesta.
- Mensajes diferenciados para coincidencia exacta, coincidencia parcial, múltiples coincidencias y ausencia de coincidencias.
- Índice auxiliar de búsqueda reconstruible a partir de la fuente, sin cambiar el contenido de los registros originales.
- Control de errores, indicador de actualización del índice y opción restringida para reconstruirlo.

### Fuera de alcance por ahora

- Crear documentos o agregar filas nuevas.
- Editar o eliminar registros existentes.
- Cambiar nombres de pestañas, rótulos de files o coordenadas.
- Adjuntar, descargar o digitalizar documentos escaneados.
- Autorizar copias o determinar validez legal, vigencia o integridad del expediente.
- Responder automáticamente un memorando como comunicación oficial sin revisión de un funcionario.
- Inferir una ubicación física que no exista en la base.

No implementar CRUD hasta que el usuario lo solicite expresamente y se haya definido un flujo de permisos, auditoría y respaldo.

## 6. Arquitectura recomendada

### 6.1 Fuente de datos

- Mantener el libro como fuente maestra.
- Google Apps Script `SpreadsheetApp` necesita una hoja de cálculo nativa de Google Sheets. Convertir una copia del `.xlsx` a Google Sheets en Drive para la primera implementación y conservar el Excel original como respaldo.
- Guardar el identificador del documento en `PropertiesService`, no en el HTML del navegador.
- No hacer público el libro ni publicar el buscador para cualquier persona.

### 6.2 Componentes

**Frontend — HTML/CSS/JavaScript**

- `Index.html`: estructura de la aplicación.
- `Styles.html` o CSS incluido: sistema visual y responsive.
- `Client.html` o JavaScript incluido: eventos, validación de consulta, filtros y renderizado.

**Backend — Google Apps Script**

- `Main.gs`: punto de entrada y funciones expuestas al frontend.
- `Config.gs`: nombres de pestañas, filas de encabezado, filas de datos y parámetros.
- `Repository.gs`: lectura en bloque de la hoja de cálculo.
- `Normalizer.gs`: normalización de texto, números y términos de búsqueda.
- `Indexer.gs`: conversión de celdas documentales a registros de índice.
- `SearchService.gs`: filtros, puntuación, ordenamiento y paginación.
- `Security.gs`: autorización, validación de entradas y control de operaciones administrativas.
- `ResponseService.gs`: generación de texto preliminar para copiar, no comunicación oficial automática.

Se pueden agrupar archivos si el entorno de Apps Script lo hace más práctico, pero cada módulo debe mantener una única responsabilidad lógica.

### 6.3 Modelo normalizado de un registro

Cada celda documental no vacía debe convertirse en un registro de índice con, al menos, estos campos:

```js
{
  id: "CONST.POSESION!K2",
  spreadsheetId: "referencia interna, nunca visible al público",
  sheetName: "CONST.POSESION",
  seriesName: "Constancias de Posesión",
  fileLabel: "CONSTANCIAS DE POSESIÓN N° 500-549 AÑO 2014",
  headerRow: 1,
  dataRow: 2,
  columnIndex: 11,
  columnLetter: "K",
  sourceCell: "K2",
  rawText: "CP. N° 500-6-2014 / Luz Petronila Llenque Galan / AH Sol de Oro Mz A1 Lote 7",
  normalizedText: "cp n 500 6 2014 luz petronila llenque galan ah sol de oro mz a1 lote 7",
  documentNumber: "500-6-2014",
  documentPrefix: "CP",
  year: "2014",
  extractionStatus: "PARSED_OR_UNPARSED"
}
```

El modelo es orientativo. No rellenar campos mediante suposiciones. Cuando el parser no pueda identificar con suficiente seguridad un número, fecha o año, conservar el texto íntegro y dejar el campo estructurado vacío o como `NO IDENTIFICADO`.

### 6.4 Tabla de configuración por pestaña

Usar configuración explícita. No inferir la fila de inicio en tiempo de consulta.

```js
const SHEET_CONFIG = [
  { name: "LATERALES", headerRow: 1, dataStartRow: 2 },
  { name: "RES. GERENCIA", headerRow: 1, dataStartRow: 2 },
  { name: "ACUERDOS CONCEJO", headerRow: 1, dataStartRow: 2 },
  { name: "DECRETOS", headerRow: 1, dataStartRow: 2 },
  { name: "RES. ALCALDIA", headerRow: 2, dataStartRow: 3 },
  { name: "CONST.POSESION", headerRow: 1, dataStartRow: 2 },
  { name: "RES MUNIC", headerRow: 2, dataStartRow: 3 }
];
```

Leer cada pestaña en bloque con `getDisplayValues()` o el método de lectura apropiado. Mantener la matriz, el número de fila, número de columna y coordenada original. Leer únicamente rangos realmente utilizados cuando sea posible.

### 6.5 Índice y rendimiento

- No ejecutar una llamada a SpreadsheetApp por cada celda.
- No releer siete pestañas completas por cada pulsación de una tecla.
- Construir un índice auxiliar de registros y normalizaciones a partir de la lectura en bloque.
- Para este volumen inicial (aproximadamente 17,513 celdas documentales no vacías), medir tiempos reales antes de introducir infraestructura adicional.
- Elegir entre caché por fragmentos o una pestaña técnica auxiliar oculta/protegida según los límites reales de tamaño, cuotas y pruebas del proyecto. No almacenar un JSON grande en una sola clave de caché.
- El índice es derivado, reconstruible y nunca sustituye la fuente maestra.
- Mostrar `Última actualización del índice` y habilitar su reconstrucción solo para usuarios autorizados.
- Definir una estrategia de actualización: reconstrucción manual por administrador en la Fase 1; después podrá evaluarse una actualización programada o por evento, tras medir las limitaciones.
- Si se utiliza una pestaña técnica auxiliar, nombrarla de forma inequívoca, por ejemplo `_INDICE_BUSQUEDA`; ocultarla y protegerla. No mezclarla con los datos documentales fuente.
- Implementar paginación o límite de resultados para no devolver miles de coincidencias en una sola respuesta.

## 7. Reglas de búsqueda

### 7.1 Normalización de texto

La búsqueda debe tolerar diferencias comunes de escritura:

- Mayúsculas/minúsculas.
- Tildes y caracteres acentuados (`Peña` / `Pena`, `Gonzáles` / `Gonzales`).
- Espacios repetidos y espacios al inicio/final.
- Separadores como guiones, puntos, barras y dos puntos.
- Símbolos de número (`N°`, `Nº`, `Nro.`) y espacios entre los componentes del código.

La normalización debe utilizarse para comparar; nunca reemplazar el texto original que se presenta como evidencia del registro.

### 7.2 Búsquedas admitidas

Ejemplos de consultas que deben funcionar:

- `500-6-2014`
- `CP 500 2014`
- `Luz Petronila Llenque Galan`
- `Petronila Llenque`
- `Sol de Oro Mz A1 Lote 7`
- `2014` con filtro de serie `CONST.POSESION`
- `DECRETO 2005` con términos adicionales si están disponibles en el texto de las celdas.

### 7.3 Relevancia

Orden sugerido:

1. Número de documento coincidente exactamente después de normalizar.
2. Referencia documental coincidente parcialmente.
3. Nombre completo o frase exacta coincidente.
4. Coincidencia de varias palabras del nombre.
5. Coincidencia de dirección, urbanización, manzana, lote o asunto.
6. Coincidencia general en el texto íntegro.

Si hay varios resultados válidos, mostrarlos todos (con paginación), no seleccionar uno arbitrariamente. El orden de relevancia no debe ocultar coincidencias secundarias.

### 7.4 Año

- Priorizar el año explícito del código o contenido del documento cuando pueda leerse con seguridad.
- Utilizar el año del rótulo del file como referencia auxiliar, no como sustituto automático del año documental.
- Si el año del documento y el del file parecen diferir, mostrar ambos como datos separados y marcar posible discrepancia.
- No inferir un año de dos dígitos sin una regla validada para esa serie documental.

### 7.5 Duplicados y datos incompletos

- No eliminar automáticamente referencias repetidas.
- Si la misma referencia aparece en más de un file o pestaña, mostrar cada ubicación por separado.
- Marcar registros sin encabezado de file, encabezados vacíos o datos de identificación incompletos.
- Mantener el texto original para revisión humana.

## 8. Diseño de la interfaz

### Principios visuales

- Apariencia institucional, moderna, limpia y sobria.
- Priorizar legibilidad, contraste y jerarquía visual.
- Evitar efectos, animaciones o elementos ornamentales que retrasen la consulta.
- Diseñar primero para escritorio de oficina y adaptar a tabletas y móviles.
- Usar etiquetas claras en español; evitar jerga técnica para el personal de archivo.

### Pantalla principal sugerida

1. Encabezado con nombre `JSanturArchivo` y subtítulo `Sistema de consulta documental`.
2. Buscador grande con placeholder: `Busca por número, nombre, dirección o asunto...`.
3. Filtros compactos: `Serie documental`, `Año` y `Área` (solo cuando su significado esté confirmado).
4. Acción principal `Buscar` y soporte para ejecutar con Enter.
5. Resumen de la consulta: término usado, filtros activos y cantidad de coincidencias.
6. Lista de resultados en tarjetas o filas legibles.
7. Cada resultado debe destacar el **FILE FÍSICO** y luego la referencia documental.
8. Acciones secundarias: `Copiar referencia` y `Copiar texto de respuesta`.
9. Indicador de fecha/hora de actualización del índice.

### Contenido mínimo de cada resultado

- Estado de coincidencia.
- Serie/pestaña.
- Referencia o número de documento.
- Año, si fue identificado.
- Texto descriptivo original.
- **Rótulo completo del file físico**.
- Celda de origen (hoja + coordenada).
- Términos que coincidieron o explicación breve de la coincidencia.

No mostrar información no existente en la base como si estuviera verificada.

## 9. Semántica de resultados y respuesta al solicitante

El sistema debe diferenciar estos estados:

### A. ENCONTRADO

Existe una o más coincidencias en el inventario digital. Presentar las ubicaciones documentales y el file físico correspondiente.

### B. POSIBLE COINCIDENCIA

Hay coincidencias parciales, por ejemplo por apellido, dirección incompleta o número parecido. Requiere comprobación manual antes de responder que existe.

### C. SIN COINCIDENCIAS EN LA BASE DIGITAL

No se encontró coincidencia con el criterio utilizado. No afirmar que el documento no existe físicamente; la base puede estar incompleta, contener errores de escritura o no incluir un registro.

### D. REGISTRO INCOMPLETO / POR VERIFICAR

El registro aparece, pero carece de rótulo asociado, año claro u otro dato crítico. Mostrar la evidencia y advertir la limitación.

### Plantilla preliminar para copiar cuando se encuentra

`Según la consulta realizada en el inventario digital del Archivo, se ubicó una referencia correspondiente a [TIPO DE DOCUMENTO / NÚMERO / AÑO], registrada en la pestaña [SERIE] y asociada al file físico “[RÓTULO DEL FILE]”. Referencia de origen: [CELDA]. Se requiere verificación física para confirmar disponibilidad, integridad y condiciones de reproducción.`

### Plantilla preliminar cuando no hay coincidencias

`Luego de consultar el inventario digital del Archivo con los datos proporcionados, no se encontraron coincidencias para el criterio de búsqueda utilizado. Este resultado no acredita por sí solo la inexistencia física del documento; corresponde verificar posibles variantes de número, nombres y el file físico relacionado.`

Estos textos son borradores de apoyo. La respuesta oficial debe ser validada y emitida por el funcionario competente.

## 10. Seguridad, privacidad y trazabilidad

Los registros pueden contener nombres y direcciones de personas. Por tanto:

- Desplegar como aplicación de acceso restringido a personal autorizado.
- No publicar el buscador ni la hoja como recurso público.
- No incrustar el identificador del archivo fuente ni credenciales en el frontend.
- Validar y limitar las consultas en el backend, aunque también se validen en el navegador.
- No usar `eval` ni construir HTML con texto del usuario o de la hoja mediante concatenación insegura.
- Mostrar el texto de los registros como texto plano mediante mecanismos seguros (`textContent` o equivalentes).
- Separar operaciones de lectura y futuras operaciones de escritura.
- El usuario ordinario de consulta no debe poder modificar datos ni reconstruir el índice.
- Registrar eventos administrativos relevantes (por ejemplo, reconstrucción de índice) sin almacenar innecesariamente búsquedas personales.
- Aplicar el principio de mínimo privilegio a la hoja y al despliegue de la aplicación.

La configuración de ejecución debe seleccionarse de acuerdo con las cuentas reales del personal y permisos del entorno de Google Workspace/Drive. Nunca resolver un problema de permisos haciendo público el archivo.

## 11. Requisitos de calidad y aceptación

La primera versión se considera lista solo cuando cumple los siguientes puntos:

### Exactitud documental

- [ ] Busca en las siete pestañas.
- [ ] Respeta las filas de encabezado particulares de cada pestaña.
- [ ] Cada resultado conserva la pestaña, el rótulo del file, la fila, columna y celda original.
- [ ] No pierde las celdas de columnas no contiguas.
- [ ] El registro sin rótulo de `ACUERDOS CONCEJO!AY` se conserva y se marca para revisión.
- [ ] No afirma inexistencia física por una búsqueda sin resultados.
- [ ] No descarta posibles duplicados.

### Búsqueda

- [ ] Busca número completo y parcial.
- [ ] Tolera tildes, mayúsculas y separadores.
- [ ] Busca nombres, apellidos, direcciones y términos descriptivos.
- [ ] Permite filtrar por serie y año.
- [ ] Explica claramente cuándo la coincidencia es parcial.
- [ ] Presenta resultados múltiples sin ocultarlos.

### Usabilidad

- [ ] La búsqueda principal se entiende sin capacitación técnica.
- [ ] El file físico destaca visualmente.
- [ ] Los resultados pueden copiarse de forma útil.
- [ ] Funciona en pantalla de escritorio y móvil.
- [ ] Presenta estados de carga, sin resultados y error.

### Rendimiento y operación

- [ ] La lectura de datos se realiza por bloques.
- [ ] No se consulta la hoja por cada celda ni por cada carácter escrito.
- [ ] El índice tiene mecanismo de reconstrucción y fecha/hora de actualización.
- [ ] Se mide el tiempo de búsqueda con el conjunto real de datos.
- [ ] El acceso está restringido a personal autorizado.
- [ ] El libro original queda intacto y respaldado.

Objetivo de experiencia recomendado: una consulta habitual debe responder en pocos segundos una vez preparado el índice. Medir el comportamiento real antes de prometer tiempos específicos.

## 12. Estrategia de implementación

### Etapa 0 — Confirmaciones

Antes de desplegar, confirmar:

1. Que el archivo se convertirá a Google Sheets (manteniendo el `.xlsx` original como respaldo).
2. Qué significa exactamente el filtro `Área` en el proceso de solicitudes.
3. Qué cuentas o personal deben poder acceder al sistema.

### Etapa 1 — Inspección y lectura

- Validar la hoja de cálculo convertida contra el perfil de siete pestañas.
- Verificar encabezados, filas de inicio, columnas vacías, rótulos y registros sin file asignado.
- No corregir automáticamente errores del inventario.

### Etapa 2 — Índice documental

- Leer bloques de cada pestaña.
- Crear un registro de índice por celda documental no vacía.
- Normalizar el texto sin perder el original.
- Guardar la procedencia física y coordenadas exactas.
- Marcar excepciones e inconsistencias.

### Etapa 3 — Buscador funcional

- Crear la interfaz de consulta.
- Añadir filtros, relevancia, paginación y acciones para copiar.
- Implementar estados de búsqueda y manejo de errores.

### Etapa 4 — Validación con casos reales

Probar por lo menos:

- Un número documental exacto conocido.
- Un número escrito sin guiones o sin símbolos.
- Un nombre completo.
- Un apellido parcial.
- Una dirección/manzana/lote.
- Un año filtrado con su serie documental.
- Una referencia duplicada.
- Una búsqueda sin resultados.
- Un registro de una pestaña cuyo encabezado empieza en la fila 2.
- El registro de `ACUERDOS CONCEJO!AY`.

Comparar cada respuesta con su celda y file físico reales.

### Etapa 5 — Despliegue controlado

- Desplegar con acceso restringido.
- Probar desde una cuenta autorizada y otra no autorizada.
- Confirmar que el personal solo puede consultar.
- Entregar instrucciones breves para buscar, interpretar coincidencias y verificar físicamente el file.

### Etapa futura — CRUD (no iniciar en Fase 1)

Cuando se solicite, diseñar un módulo separado de alta, modificación y baja lógica o controlada, con:

- Campos normalizados.
- Validaciones de duplicidad.
- Roles y permisos.
- Confirmación antes de cambiar registros.
- Bitácora de cambios (usuario, fecha, dato anterior y nuevo).
- Copias de seguridad y recuperación.
- Actualización sincronizada del índice.

No habilitar edición directa desde el buscador de la primera fase.

## 13. Forma de trabajo obligatoria del agente

Cuando el usuario pida un cambio o una nueva función:

1. Comprende el proceso del personal de Archivo antes de diseñar la pantalla.
2. Inspecciona el archivo real o su esquema actualizado; no supongas que sigue igual.
3. Analiza el requerimiento desde diseño, programación y arquitectura.
4. Identifica datos faltantes, riesgos, permisos y posibles falsos positivos.
5. Si hay una decisión imprescindible sin resolver, formula como máximo tres preguntas concretas. No preguntes de nuevo información ya entregada.
6. Recomienda primero una solución mínima y fiable; evita complejidad innecesaria.
7. No alteres, renombres, ordenes ni limpies la fuente maestra sin autorización expresa.
8. Entrega código completo, modular, comentado y con instrucciones de instalación/despliegue cuando se solicite implementación.
9. Prueba con registros reales y comunica resultados, limitaciones y errores encontrados.
10. Separa claramente lo que está verificado de lo que está pendiente de confirmación.

## 14. Decisiones pendientes de confirmar con el responsable del Archivo

Estas preguntas deben resolverse antes del despliegue definitivo:

1. **Fuente en Google:** ¿Se acepta convertir una copia del Excel a Google Sheets para que Apps Script pueda consultarla, manteniendo intacto el `.xlsx` original como respaldo?
2. **Significado de Área:** cuando una solicitud menciona un área, ¿se refiere a la serie documental/pestaña (Decretos, Acuerdos, Resoluciones, etc.), al área/sector físico (Lateral, Frontal, Talara Alta, etc.) o a otra clasificación?
3. **Acceso:** ¿el buscador será utilizado solo por personal autorizado del área de Archivo o también por otras oficinas de la institución? La recomendación inicial es acceso interno restringido.

---

## Principio rector del proyecto

**JSanturArchivo no debe limitarse a encontrar texto: debe decirle al personal qué documento coincide, en qué serie está registrado y, sobre todo, en qué FILE físico debe buscarlo.**

La fuente original se conserva. El índice acelera la consulta. Cada resultado es trazable. La ausencia de coincidencia digital nunca se presenta como prueba definitiva de inexistencia física.
