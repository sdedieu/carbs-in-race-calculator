#!/usr/bin/env node

/**
 * Generate application food objects from Ciqual.
 *
 * Usage:
 *   node extract.js "Pasted text.txt"
 *
 * Or if your input is valid JSON:
 *   node extract.js ciqual.json
 *
 * Output:
 *   foods.js
 */

const fs = require('node:fs/promises');
const path = require('node:path');

const API_URL = 'https://ciqual.anses.fr/esearch/aliments/_search';
const OUTPUT_FILE = path.resolve(
  'src/app/services/ciqual-food.data.ts',
);

export const EMPTY_NUTRITION = Object.freeze({
  calories: 0,
  carbs: 0,
  sugar: 0,
  fiber: 0,
  fat: 0,
  protein: 0,
  sodium: 0,
  caffeine: 0,
  salt: 0,
  potassium: 0,
  magnesium: 0,
  calcium: 0,
});

// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

const inputFile = process.argv[2];

if (!inputFile) {
  console.error('Usage: node generate-ciqual.js <ciqual-response.json>');
  process.exit(1);
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(value) {
  return String(value)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  // Ciqual can contain values such as "<10", "traces", "-".
  const match = String(value)
    .replace(',', '.')
    .match(/-?\d+(?:\.\d+)?/);

  return match ? Number(match[0]) : null;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

/**
 * Try several possible field names because the exact Elasticsearch
 * document shape can vary between Ciqual versions/endpoints.
 */


function parseCiqualValue(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const stringValue = String(value).trim();

  // Valeurs comme "< 0,15"
  // On conserve ici la valeur numérique comme approximation.
  const normalized = stringValue.replace(',', '.').replace(/\s+/g, ' ');

  const match = normalized.match(/-?\d+(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const number = Number(match[0]);

  return Number.isFinite(number) ? number : null;
}

function getNutrition(source) {
  const nutrition = {
    ...EMPTY_NUTRITION,
  };

  if (!Array.isArray(source.compos)) {
    return nutrition;
  }

  for (const compo of source.compos) {
    const name = String(compo.constNomEng || '').toLowerCase();

    const value = parseCiqualValue(compo.compoTeneur);

    if (value === null) {
      continue;
    }

    // Energy: specifically kcal, NOT kJ
    if (name === 'energy, regulation eu no 1169/2011 (kcal/100g)') {
      nutrition.calories = value;
      continue;
    }

    // Carbohydrates
    if (name === 'carbohydrate (g/100g)') {
      nutrition.carbs = value;
      continue;
    }

    // Sugars
    if (name === 'sugars (g/100g)') {
      nutrition.sugar = value;
      continue;
    }

    // Fibre
    if (name === 'fibres (g/100g)') {
      nutrition.fiber = value;
      continue;
    }

    // Fat
    if (name === 'fat (g/100g)') {
      nutrition.fat = value;
      continue;
    }

    // Protein
    if (name === 'protein (g/100g)') {
      nutrition.protein = value;
      continue;
    }
  }

  return nutrition;
}

/**
 * Infer a broad "kind" from the Ciqual food group.
 *
 * This is deliberately conservative. Adjust this mapping to your
 * application's taxonomy.
 */
function inferKind(source) {
  const group = String(source.groupeAfficheEng || '').toLowerCase();
  const name = String(source.nomEng || '').toLowerCase();

  if (
    group.includes('fruit') ||
    /\bapple\b|\bbanana\b|\borange\b|\bpear\b|\bpeach\b|\bplum\b|\bgrape\b|\bkiwi\b/.test(name)
  ) {
    return 'fruit';
  }

  if (group.includes('vegetable') || group.includes('salad') || group.includes('legume')) {
    return 'vegetable';
  }

  if (group.includes('nuts') || group.includes('seeds')) {
    return 'nuts';
  }

  if (group.includes('fish') || group.includes('seafood')) {
    return 'fish';
  }

  if (group.includes('meat') || group.includes('game') || group.includes('poultry')) {
    return 'meat';
  }

  if (
    group.includes('cheese') ||
    group.includes('dairy') ||
    group.includes('yogurt') ||
    group.includes('milk')
  ) {
    return 'dairy';
  }

  return 'food';
}

/**
 * Decide whether this is suitable for both food databases.
 *
 * Change this if "type" has a specific meaning in your application.
 */
function inferType(source) {
  return 'both';
}

/**
 * The Ciqual database is expressed per 100 g.
 * The application example uses a serving in grams, so unless you
 * have a separate serving-size database, we leave this undefined.
 */
function inferServing(source) {
  return {
    serving: null,
    servingGrams: null,
    servingSuggestion: null,
  };
}

function transformFood(source) {
  const code = source.code;
  const name = source.nomEng || `Ciqual ${code}`;

  const serving = inferServing(source);

  return {
    id: slugify(name),
    name: titleCase(name),
    type: inferType(source),
    kind: inferKind(source),

    nutritionPer100g: getNutrition(source)
  };
}

// ------------------------------------------------------------
// Ciqual API
// ------------------------------------------------------------

async function fetchCiqualByCode(code) {
  const payload = {
    from: 0,
    size: 10000,
    query: {
      match_phrase: {
        code: {
          query: String(code),
        },
      },
    },
    sort: 'nomSortEng',
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Ciqual request failed for ${code}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ------------------------------------------------------------
// Extract codes from your existing response
// ------------------------------------------------------------

function extractCodes(data) {
  const hits = data?.hits?.hits;

  if (!Array.isArray(hits)) {
    throw new Error(
      'Input does not look like a Ciqual Elasticsearch response: hits.hits not found.',
    );
  }

  return [
    ...new Set(
      hits
        .map((hit) => hit?._source?.code)
        .filter((code) => code !== undefined && code !== null)
        .map(String),
    ),
  ];
}

// ------------------------------------------------------------
// Concurrency limiter
// ------------------------------------------------------------

async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;

      if (index >= items.length) {
        return;
      }

      results[index] = await fn(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());

  await Promise.all(workers);

  return results;
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------

async function main() {
  console.log(`Reading ${inputFile}...`);

  const text = await fs.readFile(inputFile, 'utf8');

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      'The input file is not valid JSON. Save the Elasticsearch response as JSON first.',
    );
  }

  const codes = extractCodes(data);

  console.log(`Found ${codes.length} unique Ciqual codes.`);

  const errors = [];

  const foods = (
    await mapWithConcurrency(codes, 5, async (code, index) => {
      console.log(`[${index + 1}/${codes.length}] Fetching ${code}...`);

      try {
        const result = await fetchCiqualByCode(code);

        const hits = result?.hits?.hits || [];

        if (hits.length === 0) {
          console.warn(`  No result for ${code}`);
          return null;
        }

        // A code should normally identify one food.
        // Keep all matches in case Ciqual returns more than one.
        return hits.reduce((acc, hit) => {
          const transformed = transformFood(hit._source);
          if (
            transformed &&
            transformed.nutritionPer100g.calories !== null &&
            transformed.nutritionPer100g.carbs !== null &&
            transformed.nutritionPer100g.protein !== null &&
            transformed.nutritionPer100g.fat !== null &&
            transformed.nutritionPer100g.sugar !== null
          ) {
            acc.push(transformed);
          }
          return acc;
        }, []);
      } catch (error) {
        console.error(`  ERROR ${code}: ${error.message}`);

        errors.push({
          code,
          error: error.message,
        });

        return null;
      }
    })
  )
    .flat()
    .filter(Boolean);

  const output = `// Generated from Ciqual\n// Generated at ${new Date().toISOString()}\n\nexport const foods = ${JSON.stringify(
    foods,
    null,
    2,
  )};\n`;

  await fs.writeFile(OUTPUT_FILE, output, 'utf8');

  console.log('');
  console.log(`Done.`);
  console.log(`Foods generated: ${foods.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);

  if (errors.length) {
    await fs.writeFile(path.resolve('ciqual-errors.json'), JSON.stringify(errors, null, 2), 'utf8');

    console.log(`Errors written to ciqual-errors.json`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
