/**
 * JSanturArchivo — Backend de Google Apps Script
 * Fase 1: consulta documental de solo lectura.
 * La fuente es un archivo de Google Sheets (copia convertida del XLSX original).
 * Cada búsqueda vuelve a leer los datos reales; no utiliza registros de demostración
 * ni conserva una copia desactualizada del inventario en CacheService.
 */

const APP_CONFIG = {
  // Opcional: pega aquí el ID del Google Sheets convertido.
  // También puedes configurar la propiedad de secuencia de comandos SPREADSHEET_ID.
  // Si el proyecto está vinculado directamente al Google Sheets, se intentará usarlo.
  SPREADSHEET_ID: '',
  MAX_RESULTS: 500
};

// Estructura comprobada en el archivo BD ARCHIVO 2026.xlsx adjunto.
// headerRow: fila que contiene el rótulo del FILE físico.
// dataStartRow: primera fila donde comienzan los documentos.
const SHEET_CONFIG = [
  { name: 'LATERALES',        label: 'Áreas Laterales',          headerRow: 1, dataStartRow: 2 },
  { name: 'RES. GERENCIA',    label: 'Resolución de Gerencia',   headerRow: 1, dataStartRow: 2 },
  { name: 'ACUERDOS CONCEJO', label: 'Acuerdos de Concejo',      headerRow: 1, dataStartRow: 2 },
  { name: 'DECRETOS',         label: 'Decretos de Alcaldía',     headerRow: 1, dataStartRow: 2 },
  { name: 'RES. ALCALDIA',    label: 'Resolución de Alcaldía',   headerRow: 2, dataStartRow: 3 },
  { name: 'CONST.POSESION',   label: 'Constancias de Posesión',  headerRow: 1, dataStartRow: 2 },
  { name: 'RES MUNIC',        label: 'Resolución Municipal',     headerRow: 2, dataStartRow: 3 },
  { name: 'CONST.POS.EN.ELEC',        label: 'Constancias de Posesión Eléctrico',     headerRow: 1, dataStartRow: 2 },
  { name: 'BUNGALO',        label: 'Bungalo',     headerRow: 1, dataStartRow: 2 }

  
];

/** Punto de entrada de la aplicación web. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('JSanturArchivo — Consulta documental')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Abre el Google Sheets fuente.
 * Prioridad: propiedad SPREADSHEET_ID, configuración del código y hoja activa vinculada.
 */
function openDatabase_() {
  const properties = PropertiesService.getScriptProperties();
  const propertyId = (properties.getProperty('SPREADSHEET_ID') || '').trim();
  const configuredId = (APP_CONFIG.SPREADSHEET_ID || '').trim();
  const id = propertyId || configuredId;

  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (err) {
      throw new Error(
        'No se pudo abrir el Google Sheets configurado. Verifica el ID, los permisos y que el archivo sea Google Sheets, no un .xlsx sin convertir. Detalle: ' + err.message
      );
    }
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  throw new Error(
    'Falta configurar la base de datos. Convierte el Excel a Google Sheets y configura la propiedad de secuencia de comandos SPREADSHEET_ID con el ID que aparece en la URL del documento.'
  );
}

/**
 * Lee las pestañas configuradas por bloques y genera registros de consulta en memoria.
 * No escribe, modifica, borra ni agrega nada a las hojas fuente.
 */
function readRecords_() {
  const ss = openDatabase_();
  const records = [];
  const warnings = [];
  const years = {};
  const sheetCounts = {};

  SHEET_CONFIG.forEach(function (cfg) {
    const sheet = ss.getSheetByName(cfg.name);
    if (!sheet) {
      warnings.push('No se encontró la pestaña: ' + cfg.name);
      return;
    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (!lastRow || !lastCol || lastRow < cfg.dataStartRow) {
      sheetCounts[cfg.name] = 0;
      return;
    }

    // Una lectura por pestaña; conserva los saltos de línea de las celdas.
    const values = sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
    const headerValues = values[cfg.headerRow - 1] || [];
    const columns = [];

    for (let c = 0; c < lastCol; c++) {
      const label = cleanDisplay_(headerValues[c]);
      if (label) {
        columns.push({ index: c, label: label });
      }
    }

    const columnIndexes = {};
    columns.forEach(function (col) { columnIndexes[col.index] = true; });

    // No se descartan celdas que tengan información bajo una columna sin rótulo:
    // se registran con un rótulo explícito para que puedan ser revisadas.
    let sheetCount = 0;
    for (let r = cfg.dataStartRow - 1; r < values.length; r++) {
      const row = values[r] || [];
      for (let c = 0; c < lastCol; c++) {
        const raw = row[c] == null ? '' : String(row[c]);
        if (!cleanDisplay_(raw)) continue;

        const cell = colLetter_(c) + (r + 1);
        const fileLabel = columnIndexes[c]
          ? columns.find(function (item) { return item.index === c; }).label
          : 'RÓTULO DE FILE NO IDENTIFICADO — REVISAR COLUMNA ' + colLetter_(c);

        if (!columnIndexes[c]) {
          warnings.push(cfg.name + '! Columna ' + colLetter_(c) + ' contiene documentos, pero no tiene rótulo en la fila ' + cfg.headerRow + '.');
        }

        const year = extractYear_(raw) || extractYear_(fileLabel);
        if (year) years[year] = true;

        records.push({
          id: cfg.name + '!' + cell,
          sheetName: cfg.name,
          seriesLabel: cfg.label,
          fileLabel: fileLabel,
          sourceCell: cell,
          rowNumber: r + 1,
          columnIndex: c,
          rawText: raw,
          normalizedText: normalize_(raw + ' ' + fileLabel),
          year: year,
          incomplete: !columnIndexes[c]
        });
        sheetCount++;
      }
    }
    sheetCounts[cfg.name] = sheetCount;
  });

  return {
    records: records,
    totalRecords: records.length,
    years: Object.keys(years).sort(function (a, b) { return b.localeCompare(a); }),
    warnings: unique_(warnings),
    sheetCounts: sheetCounts,
    generatedAt: new Date().toISOString(),
    spreadsheetName: ss.getName()
  };
}

/** Devuelve el estado real de la base para la pantalla inicial. */
function getStats() {
  const data = readRecords_();
  return {
    ready: true,
    totalRecords: data.totalRecords,
    generatedAt: data.generatedAt,
    years: data.years,
    warnings: data.warnings,
    spreadsheetName: data.spreadsheetName,
    sheetCounts: data.sheetCounts
  };
}

/**
 * Busca sobre los datos reales de Google Sheets en cada llamada.
 * La consulta es insensible a mayúsculas, tildes, puntuación, NBSP y saltos de línea.
 */
function search(query, filters) {
  filters = filters || {};
  const data = readRecords_();
  const normalizedQuery = normalize_(query || '');
  const tokens = unique_(normalizedQuery.split(' ').filter(function (token) { return token.length >= 2; }));
  const hasFilters = !!(filters.series || filters.year);

  if (!normalizedQuery && !hasFilters) {
    return makeSearchResponse_([], data, false);
  }

  const matches = [];
  data.records.forEach(function (record) {
    if (filters.series && record.sheetName !== String(filters.series)) return;
    if (filters.year && record.year !== String(filters.year)) return;

    let score = 1;
    let matchType = 'partial';

    if (normalizedQuery) {
      const fullText = record.normalizedText;
      const phraseMatch = normalizedQuery.length >= 3 && fullText.indexOf(normalizedQuery) !== -1;
      let matchedTokens = 0;
      tokens.forEach(function (token) {
        if (fullText.indexOf(token) !== -1) matchedTokens++;
      });

      const requiredMatches = tokens.length <= 1 ? tokens.length : Math.max(1, Math.ceil(tokens.length * 0.70));
      if (!tokens.length || matchedTokens < requiredMatches) return;

      score = (phraseMatch ? 150 : 0) + matchedTokens * 20 + (matchedTokens === tokens.length ? 35 : 0);
      matchType = phraseMatch ? 'exact' : 'partial';
    }

    if (filters.match === 'exact' && matchType !== 'exact') return;
    if (filters.match === 'partial' && matchType !== 'partial') return;

    matches.push({
      id: record.id,
      sheetName: record.sheetName,
      seriesLabel: record.seriesLabel,
      fileLabel: record.fileLabel,
      sourceCell: record.sourceCell,
      rowNumber: record.rowNumber,
      rawText: record.rawText,
      year: record.year,
      score: score,
      matchType: matchType,
      incomplete: record.incomplete
    });
  });

  const sort = filters.sort || 'relevance';
  if (sort === 'year') {
    matches.sort(function (a, b) { return (b.year || '').localeCompare(a.year || '') || b.score - a.score; });
  } else if (sort === 'series') {
    matches.sort(function (a, b) { return a.seriesLabel.localeCompare(b.seriesLabel, 'es') || b.score - a.score; });
  } else {
    matches.sort(function (a, b) { return b.score - a.score || a.sheetName.localeCompare(b.sheetName, 'es'); });
  }

  return makeSearchResponse_(matches, data, true);
}

function makeSearchResponse_(matches, data, queried) {
  const limit = APP_CONFIG.MAX_RESULTS;
  return {
    results: matches.slice(0, limit),
    total: matches.length,
    totalRecords: data.totalRecords,
    generatedAt: data.generatedAt,
    years: data.years,
    warnings: data.warnings,
    truncated: matches.length > limit,
    maxResults: limit,
    queried: queried
  };
}

/** Botón de actualización: vuelve a leer y verificar la fuente real. */
function rebuildIndex() {
  const data = readRecords_();
  return {
    totalRecords: data.totalRecords,
    generatedAt: data.generatedAt,
    years: data.years,
    warnings: data.warnings,
    spreadsheetName: data.spreadsheetName,
    sheetCounts: data.sheetCounts
  };
}

/**
 * Ejecuta esta función desde el editor para verificar conexión y el caso de prueba.
 * Debe encontrar CONST.POSESION!L4 asociado al file de la columna L.
 */
function testCesarAlex() {
  const response = search('Cesar Alex Fiestas Robles', { series: 'CONST.POSESION', sort: 'relevance' });
  const target = response.results.find(function (item) {
    return item.sheetName === 'CONST.POSESION' && item.sourceCell === 'L4';
  });

  if (!target) {
    throw new Error('La prueba no encontró Cesar Alex Fiestas Robles en CONST.POSESION!L4. Verifica que la fuente conectada sea la copia correcta del Excel. Coincidencias obtenidas: ' + response.total);
  }
  if (normalize_(target.fileLabel).indexOf(normalize_('CONSTANCIAS DE POSESIÓN N° 001-50 AÑO 2015')) === -1) {
    throw new Error('Se encontró CONST.POSESION!L4, pero el rótulo del file no coincide con el esperado: ' + target.fileLabel);
  }

  Logger.log(JSON.stringify({
    prueba: 'CORRECTA',
    documento: target.rawText,
    pestaña: target.sheetName,
    fileFisico: target.fileLabel,
    celda: target.sourceCell,
    totalRegistros: response.totalRecords
  }, null, 2));
  return target;
}

/** Comprueba conexión, pestañas detectadas y recuento de registros. */
function testConnection() {
  const data = readRecords_();
  Logger.log(JSON.stringify({
    spreadsheetName: data.spreadsheetName,
    totalRecords: data.totalRecords,
    sheetCounts: data.sheetCounts,
    warnings: data.warnings
  }, null, 2));
  return data;
}

// -------------------- UTILIDADES --------------------

function normalize_(value) {
  if (value == null) return '';
  let text = String(value);

  // Decodifica entidades HTML comunes/numericas que a veces quedan pegadas al texto.
  text = text
    .replace(/&nbsp;|&#160;|&#x0*a0;|&#x20;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, function (match, code) {
      const n = parseInt(code, 10);
      return n >= 0 && n <= 0x10FFFF ? String.fromCodePoint(n) : ' ';
    })
    .replace(/&#x([0-9a-f]+);/gi, function (match, code) {
      const n = parseInt(code, 16);
      return n >= 0 && n <= 0x10FFFF ? String.fromCodePoint(n) : ' ';
    });

  return text
    .replace(/[\u00A0\u2007\u202F]/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/n°|nº|nro\.?|num\.?/gi, 'n')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanDisplay_(value) {
  if (value == null) return '';
  return String(value)
    .replace(/[\u00A0\u2007\u202F]/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractYear_(text) {
  const match = String(text || '').match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : '';
}

function colLetter_(zeroBasedIndex) {
  let n = zeroBasedIndex + 1;
  let result = '';
  while (n > 0) {
    const remainder = (n - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    n = Math.floor((n - 1) / 26);
  }
  return result;
}

function unique_(items) {
  return Array.from(new Set(items));
}
