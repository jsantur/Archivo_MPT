# 🗂️ JSanturArchivo_MPT
### Sistema Inteligente de Consulta y Gestión Documental — MPT

<p align="center">
  <strong>Plataforma de consulta documental del Archivo Institucional</strong>
</p>

<p align="center">
  <a href="https://script.google.com/macros/s/AKfycbwUzlFc2fmpf_smxa_ceQGIBeMKmNYC4YU25gBP2LdW8w42AVRiESq4ohKhVDAdWFtNuA/exec">
    🚀 **ABRIR JSanturArchivo_MPT**
  </a>
</p>

<p align="center">
  ![Aplicación Web](https://img.shields.io/badge/Aplicación-Web-blue)
  ![Google Apps Script](https://img.shields.io/badge/Google-Apps%20Script-orange)
  ![Google Sheets](https://img.shields.io/badge/Google-Sheets-green)
  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
  ![Responsive](https://img.shields.io/badge/Responsive-Mobile-purple)
  ![JSANTUR](https://img.shields.io/badge/Developer-JSANTUR-black)
</p>

---

## 📌 Acerca del Proyecto

**JSanturArchivo_MPT** es una aplicación web desarrollada para facilitar la consulta, localización y recuperación de referencias documentales del Archivo Institucional de la Municipalidad Provincial de Talara (MPT).

El sistema permite realizar búsquedas de documentos mediante diferentes criterios, como números de documentos, nombres, direcciones, urbanizaciones, manzanas, lotes y asuntos.

Su finalidad es optimizar el tiempo de consulta del personal, facilitar la identificación de expedientes y mejorar la localización de los archivos físicos mediante un inventario documental digital.

La plataforma centraliza la información de consulta y permite identificar tanto la referencia registrada digitalmente como el rótulo correspondiente al **FILE físico** donde se encuentra el documento.

## 🎯 Objetivos

- Digitalizar y facilitar los procesos de consulta documental.
- Reducir el tiempo empleado en localizar documentos.
- Centralizar las referencias del archivo institucional.
- Facilitar la búsqueda por nombres, números y direcciones.
- Identificar la ubicación de los documentos físicos.
- Organizar la información por series documentales.
- Mejorar la recuperación de información histórica.
- Facilitar el trabajo administrativo y archivístico.
- Proporcionar una herramienta de consulta accesible desde diferentes dispositivos.

## ⚡ Funcionalidades Principales

### 🔎 Búsqueda Inteligente

Permite localizar referencias documentales utilizando diferentes criterios:

- Búsqueda por número de documento.
- Búsqueda por nombres y apellidos.
- Búsqueda por direcciones.
- Búsqueda por urbanizaciones.
- Búsqueda por manzana y lote.
- Búsqueda por asunto.
- Normalización de términos para facilitar coincidencias.
- Identificación de coincidencias exactas y parciales.
- Resaltado de términos encontrados.
- Limpieza rápida de búsquedas.

### 🗂️ Clasificación Documental

El sistema permite consultar información organizada por series documentales:

- LATERALES.
- RES. GERENCIA.
- ACUERDOS CONCEJO.
- DECRETOS.
- RES. ALCALDIA.
- CONST.POSESION.
- RES MUNIC.

La clasificación facilita la identificación de la procedencia documental y la organización de las consultas.

### 📅 Filtros de Consulta

- Filtro por serie documental.
- Filtro por año.
- Filtro por tipo de coincidencia.
- Ordenamiento por relevancia.
- Ordenamiento por año.
- Ordenamiento alfabético por serie.
- Restablecimiento de filtros.

### 📁 Identificación del FILE Físico

Una de las funcionalidades principales consiste en facilitar la ubicación del documento dentro del archivo físico.

Los resultados muestran:

- Referencia documental.
- Rótulo del FILE físico.
- Serie documental.
- Año del documento.
- Pestaña de origen.
- Celda de referencia.
- Número de fila.

Esto permite utilizar la información digital como guía para localizar posteriormente el documento físico.

### 📋 Resultados de Consulta

Cada resultado presenta información organizada para facilitar su identificación:

- Estado de coincidencia.
- Serie documental.
- Año.
- Referencia principal.
- Ubicación del FILE físico.
- Texto registrado en el inventario.
- Información de procedencia.

### 📄 Herramientas de Copiado

El sistema incorpora herramientas para facilitar el trabajo administrativo:

- Copiar referencia documental.
- Copiar texto de respuesta.
- Generar textos de respuesta basados en la información localizada.

### 📊 Información del Índice Documental

El sistema permite visualizar:

- Total de registros disponibles.
- Fecha de última lectura.
- Estado de conexión con la base documental.
- Observaciones relacionadas con la información.
- Actualización de lectura.

### 📑 Paginación

Los resultados se presentan de manera organizada para facilitar su revisión, evitando mostrar demasiados registros en una sola pantalla.

### 🌙 Modo Claro y Oscuro

La interfaz incorpora alternativas de visualización:

- Tema claro.
- Tema oscuro.
- Cambio de tema desde la interfaz.
- Conservación de la preferencia seleccionada.

### 📱 Diseño Responsive

La plataforma está preparada para utilizarse desde:

- Computadoras de escritorio.
- Laptops.
- Tablets.
- Teléfonos móviles.

## 🏛️ Aplicación Institucional

**JSanturArchivo_MPT** está orientado a apoyar los procesos de consulta del Archivo Institucional, facilitando el acceso a referencias documentales y la identificación de expedientes registrados en el inventario digital.

Su utilización permite disponer de una herramienta de apoyo para las actividades de búsqueda, verificación y localización de documentación.

## 🔄 Flujo de Consulta

```text
             USUARIO
                │
                ▼
        INGRESO AL SISTEMA
                │
                ▼
        BÚSQUEDA DOCUMENTAL
                │
                ▼
       APLICACIÓN DE FILTROS
                │
                ▼
       CONSULTA DE REGISTROS
                │
                ▼
       RESULTADOS ENCONTRADOS
                │
                ▼
       IDENTIFICACIÓN DEL FILE
                │
                ▼
        LOCALIZACIÓN FÍSICA
                │
                ▼
       VERIFICACIÓN DOCUMENTAL
```

## 🛠️ Tecnologías Utilizadas

### Backend / Plataforma

- Google Apps Script.
- Google Sheets.

### Frontend

- HTML5.
- CSS3.
- JavaScript.
- Diseño responsive.
- Componentes de interfaz personalizados.

### Gestión de información

- Google Sheets como fuente de información documental.
- Consultas mediante Google Apps Script.
- Lectura y procesamiento de registros.
- Organización por series documentales.
- Identificación de referencias de origen.

### Despliegue

Aplicación web implementada mediante **Google Apps Script Web App**.

## ☁️ Arquitectura Tecnológica

```text
                  USUARIO
                     │
                     ▼
              INTERFAZ WEB
             HTML + CSS + JS
                     │
                     ▼
            GOOGLE APPS SCRIPT
                     │
                     ▼
             PROCESAMIENTO
             DE CONSULTAS
                     │
                     ▼
               GOOGLE SHEETS
                     │
                     ▼
            REGISTROS DOCUMENTALES
                     │
                     ▼
             RESULTADOS DE BÚSQUEDA
                     │
                     ▼
              INTERFAZ DE USUARIO
```

## 🔐 Consideraciones de Seguridad

El sistema está orientado a la consulta documental de solo lectura.

La información presentada corresponde a los registros disponibles en el inventario digital.

La aplicación no sustituye la verificación física de los documentos ni acredita por sí sola su existencia, disponibilidad, integridad o estado de conservación.

Toda respuesta oficial debe validarse con la documentación correspondiente en el archivo físico.

## 🚀 Acceso al Sistema

**Aplicación desplegada:**

[🚀 Acceder a JSanturArchivo_MPT](https://script.google.com/macros/s/AKfycbwUzlFc2fmpf_smxa_ceQGIBeMKmNYC4YU25gBP2LdW8w42AVRiESq4ohKhVDAdWFtNuA/exec)

## 👨‍💻 Desarrollo

### Full Stack / Web Developer — JSANTUR

**Creador y desarrollador del sistema.**

Responsable del diseño, desarrollo, implementación y mantenimiento de JSanturArchivo_MPT.

#### Principales aportes

- Diseño y desarrollo de la interfaz web.
- Implementación del módulo de búsqueda documental.
- Desarrollo de filtros por serie y año.
- Implementación del procesamiento de coincidencias.
- Organización de resultados documentales.
- Integración con Google Sheets.
- Implementación de consultas mediante Google Apps Script.
- Desarrollo de herramientas para copiar referencias y respuestas.
- Implementación de paginación.
- Diseño adaptable a dispositivos móviles.
- Implementación de temas claro y oscuro.
- Despliegue de la aplicación como Web App.

## 📈 Beneficios del Sistema

- ⚡ Mayor rapidez en las consultas documentales.
- 🔎 Búsqueda por diferentes criterios.
- 📁 Identificación del FILE físico.
- 🗂️ Organización por series documentales.
- 📅 Filtrado por año.
- 📋 Copiado rápido de referencias.
- 📄 Facilita la elaboración de respuestas.
- ☁️ Información centralizada.
- 📱 Acceso desde diferentes dispositivos.
- 📊 Mejor organización de las consultas.
- 🏛️ Apoyo a las actividades del Archivo Institucional.

## 🎯 Impacto Operativo

**JSanturArchivo_MPT** busca contribuir a la modernización de los procesos de consulta documental mediante una herramienta digital que facilite la recuperación de información.

```text
       CONSULTA TRADICIONAL       JSanturArchivo_MPT

       Búsqueda manual       →   Búsqueda digital
       Revisión prolongada   →   Consulta rápida
       Ubicación complicada →   Referencia del FILE
       Información dispersa →   Inventario centralizado
       Consulta por hojas    →   Búsqueda organizada
```

## 📌 Consideraciones

La confiabilidad de las consultas depende de la correcta actualización y organización del inventario documental.

Los resultados proporcionados por el sistema deben utilizarse como referencias de localización y ser contrastados con los documentos físicos correspondientes.

## 📄 Licencia

Software desarrollado para fines de consulta, localización y apoyo a la gestión documental institucional.

© 2026 **JSANTUR** — Todos los derechos reservados.

---

<p align="center">
  <strong>JSanturArchivo_MPT</strong><br>
  Sistema Inteligente de Consulta Documental
</p>

<p align="center">
  Desarrollado por <strong>JSANTUR</strong>
</p>
