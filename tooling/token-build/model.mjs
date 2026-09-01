import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
export const tokenSourceRoot = path.join(repoRoot, 'packages/tokens/src');
export const generatedRoot = path.join(repoRoot, 'packages/tokens/generated');
export const themeNames = ['dark', 'light', 'high-contrast'];

const referenceFiles = [
  'color.json',
  'spacing.json',
  'typography.json',
  'sizing.json',
  'radius.json',
  'border.json',
  'elevation.json',
  'motion.json',
  'layout.json',
  'density.json',
];
const semanticFiles = [
  'color.json',
  'spacing.json',
  'typography.json',
  'sizing.json',
  'motion.json',
  'layout.json',
  'density.json',
];

const requiredPalette = {
  'color.brand.600': '#6C6FF6',
  'color.brand.500': '#8588FF',
  'color.brand.900': '#262A5F',
  'color.brand.100': '#C8CBFF',
  'color.accent.600': '#4B8DFF',
  'color.accent.500': '#72A6FF',
  'color.accent.900': '#14345F',
  'color.accent.100': '#C7DCFF',
  'color.success.600': '#35B779',
  'color.success.900': '#153B2A',
  'color.success.100': '#BEF4D8',
  'color.warning.600': '#C79240',
  'color.warning.900': '#3C2F18',
  'color.warning.100': '#F5D7A3',
  'color.danger.600': '#E06A6A',
  'color.danger.900': '#461F25',
  'color.danger.100': '#FFC4C4',
  'color.neutral.950': '#05060A',
  'color.neutral.925': '#08090D',
  'color.neutral.900': '#0D0F14',
  'color.neutral.850': '#14161D',
  'color.neutral.800': '#1D2029',
  'color.neutral.50': '#F8FAFC',
  'color.neutral.200': '#D8DDE6',
  'color.neutral.400': '#858C9B',
  'color.neutral.750': '#20232D',
  'color.neutral.700': '#2C303B',
  'color.neutral.600': '#414753',
};

const aliasPattern = /^\{([^{}]+)\}$/;

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const relativeRepoPath = (filePath) => path.relative(repoRoot, filePath).split(path.sep).join('/');

export const aliasTarget = (value) => {
  if (typeof value !== 'string') return null;
  return value.match(aliasPattern)?.[1] ?? null;
};

export const parseJson = (text, sourceFile = '<json>') => {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(sourceFile + ': invalid JSON: ' + error.message, { cause: error });
  }
};

export const flattenTokens = (document, sourceFile, tier) => {
  const tokens = new Map();
  const errors = [];

  const visit = (value, parts, inheritedType) => {
    if (!isRecord(value)) return;
    if (Object.hasOwn(value, '$value')) {
      const tokenPath = parts.join('.');
      if (!tokenPath) {
        errors.push(`${sourceFile}: token has no name`);
        return;
      }
      if (tokens.has(tokenPath)) {
        errors.push(`${sourceFile}: duplicate token ${tokenPath}`);
        return;
      }
      tokens.set(tokenPath, {
        path: tokenPath,
        sourceFile,
        tier,
        type: value.$type ?? inheritedType,
        value: value.$value,
        description: value.$description,
        extensions: value.$extensions,
      });
      return;
    }

    const nextType = value.$type ?? inheritedType;
    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith('$')) continue;
      visit(child, [...parts, key], nextType);
    }
  };

  visit(document, [], undefined);
  return { tokens, errors };
};

export const validateDtcgDocument = (document, sourceFile = '<document>') => {
  const errors = [];
  const visit = (value, parts = [], inheritedType) => {
    if (!isRecord(value)) {
      errors.push(sourceFile + ': ' + (parts.join('.') || '<root>') + ' must be an object');
      return;
    }
    const tokenPath = parts.join('.');
    const currentType = value.$type ?? inheritedType;
    if (Object.hasOwn(value, '$value')) {
      if (!currentType) errors.push(sourceFile + ': ' + tokenPath + ' is missing $type');
      if (typeof value.$description !== 'string' || value.$description.trim() === '') {
        errors.push(sourceFile + ': ' + tokenPath + ' is missing $description');
      }
      if (!isRecord(value.$extensions) || !isRecord(value.$extensions['depo-ui'])) {
        errors.push(sourceFile + ': ' + tokenPath + ' is missing $extensions.depo-ui');
      }
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith('$')) continue;
      if (!isRecord(child))
        errors.push(sourceFile + ': ' + [...parts, key].join('.') + ' must be an object');
      else visit(child, [...parts, key], currentType);
    }
  };
  visit(document);
  return errors;
};

const readJson = async (filePath) =>
  parseJson(await readFile(filePath, 'utf8'), relativeRepoPath(filePath));

const loadDirectory = async (directory, files, tier) => {
  const documents = [];
  const tokens = new Map();
  const errors = [];
  for (const fileName of files) {
    const relativeFile = path.join(directory, fileName);
    const document = await readJson(relativeFile);
    const normalizedFile = relativeRepoPath(relativeFile);
    const flattened = flattenTokens(document, normalizedFile, tier);
    documents.push({ file: normalizedFile, document });
    errors.push(...validateDtcgDocument(document, normalizedFile));
    errors.push(...flattened.errors);
    for (const [tokenPath, token] of flattened.tokens) {
      if (tokens.has(tokenPath)) errors.push(`${tier}: duplicate token ${tokenPath}`);
      else tokens.set(tokenPath, token);
    }
  }
  return { documents, tokens, errors };
};

export const createTokenModel = ({ reference, semantic, themes }) => ({
  reference,
  semantic,
  themes,
});

export const mergeTokenMaps = (maps, tier = 'token') => {
  const tokens = new Map();
  const errors = [];
  for (const map of maps) {
    for (const [tokenPath, token] of map) {
      if (tokens.has(tokenPath)) errors.push(tier + ': duplicate token ' + tokenPath);
      else tokens.set(tokenPath, token);
    }
  }
  return { tokens, errors };
};

export const loadTokenModel = async ({ sourceRoot = tokenSourceRoot } = {}) => {
  const reference = await loadDirectory(
    path.join(sourceRoot, 'reference'),
    referenceFiles,
    'reference',
  );
  const semantic = await loadDirectory(
    path.join(sourceRoot, 'semantic'),
    semanticFiles,
    'semantic',
  );
  const themes = new Map();
  const errors = [...reference.errors, ...semantic.errors];
  const themeDocuments = [];

  for (const themeName of themeNames) {
    const filePath = path.join(sourceRoot, 'themes', `${themeName}.json`);
    const document = await readJson(filePath);
    const normalizedFile = relativeRepoPath(filePath);
    const flattened = flattenTokens(document, normalizedFile, 'theme');
    const themeMap = new Map();
    errors.push(...flattened.errors);
    for (const [tokenPath, token] of flattened.tokens) {
      if (themeMap.has(tokenPath)) errors.push(`theme ${themeName}: duplicate token ${tokenPath}`);
      else themeMap.set(tokenPath, token);
    }
    themes.set(themeName, themeMap);
    themeDocuments.push({ file: normalizedFile, document });
    errors.push(...validateDtcgDocument(document, normalizedFile));
  }

  return {
    ...createTokenModel({ reference: reference.tokens, semantic: semantic.tokens, themes }),
    documents: [...reference.documents, ...semantic.documents, ...themeDocuments],
    sourceErrors: errors,
  };
};

const extensionTier = (token) => token.extensions?.['depo-ui']?.tier;

const checkMetadata = (token, expectedTier, errors) => {
  if (!token.type) errors.push(`${token.sourceFile}: ${token.path} is missing $type`);
  if (typeof token.description !== 'string' || token.description.trim() === '') {
    errors.push(`${token.sourceFile}: ${token.path} is missing $description`);
  }
  if (extensionTier(token) !== expectedTier) {
    errors.push(
      `${token.sourceFile}: ${token.path} must declare $extensions.depo-ui.tier=${expectedTier}`,
    );
  }
};

const compatibleType = (left, right) => left === right || (!left && !right);

export const resolveToken = (model, tokenPath, themeName, stack = [], useTheme = true) => {
  if (stack.includes(tokenPath)) {
    throw new Error(`alias cycle: ${[...stack, tokenPath].join(' -> ')}`);
  }

  const themeToken = useTheme ? model.themes.get(themeName)?.get(tokenPath) : undefined;
  const token = themeToken ?? model.semantic.get(tokenPath) ?? model.reference.get(tokenPath);
  if (!token) throw new Error(`unknown token: ${tokenPath}`);

  const target = aliasTarget(token.value);
  if (!target) return { value: token.value, type: token.type, token };

  const targetToken = model.semantic.get(target) ?? model.reference.get(target);
  if (!targetToken) throw new Error(`${tokenPath} references unknown token ${target}`);
  if (!compatibleType(token.type, targetToken.type)) {
    throw new Error(
      `${tokenPath} type ${token.type} does not match ${target} type ${targetToken.type}`,
    );
  }
  return resolveToken(model, target, themeName, [...stack, tokenPath], false);
};

export const resolvedTheme = (model, themeName) => {
  const values = new Map();
  for (const tokenPath of model.semantic.keys()) {
    values.set(tokenPath, resolveToken(model, tokenPath, themeName));
  }
  return values;
};

export const validateTokenModel = (model) => {
  const errors = [...(model.sourceErrors ?? [])];

  for (const token of model.reference.values()) {
    checkMetadata(token, 'reference', errors);
    if (aliasTarget(token.value))
      errors.push(`${token.sourceFile}: reference token ${token.path} cannot alias another token`);
  }
  for (const token of model.semantic.values()) {
    checkMetadata(token, 'semantic', errors);
    const target = aliasTarget(token.value);
    if (!target)
      errors.push(`${token.sourceFile}: semantic token ${token.path} must alias a reference token`);
    else if (!model.reference.has(target))
      errors.push(
        `${token.sourceFile}: semantic token ${token.path} must reference Reference, not ${target}`,
      );
    else if (!compatibleType(token.type, model.reference.get(target).type)) {
      errors.push(
        `${token.sourceFile}: semantic token ${token.path} type does not match ${target}`,
      );
    }
  }
  for (const [themeName, tokens] of model.themes) {
    for (const token of tokens.values()) {
      checkMetadata(token, 'theme', errors);
      if (token.extensions?.['depo-ui']?.theme !== themeName) {
        errors.push(`${token.sourceFile}: ${token.path} must declare theme=${themeName}`);
      }
      const target = aliasTarget(token.value);
      if (target) {
        const targetToken = model.reference.get(target) ?? model.semantic.get(target);
        if (!targetToken)
          errors.push(
            `${token.sourceFile}: theme token ${token.path} references unknown token ${target}`,
          );
        else if (!compatibleType(token.type, targetToken.type))
          errors.push(
            `${token.sourceFile}: theme token ${token.path} type does not match ${target}`,
          );
      }
      const semanticToken = model.semantic.get(token.path);
      if (!semanticToken)
        errors.push(`${token.sourceFile}: theme token ${token.path} has no semantic role`);
      else if (!compatibleType(token.type, semanticToken.type))
        errors.push(
          `${token.sourceFile}: theme token ${token.path} type does not match semantic role`,
        );
    }
  }

  for (const themeName of themeNames) {
    if (!model.themes.has(themeName)) errors.push(`missing theme ${themeName}`);
    else {
      for (const tokenPath of model.semantic.keys()) {
        try {
          resolveToken(model, tokenPath, themeName);
        } catch (error) {
          errors.push(`${themeName}: ${error.message}`);
        }
      }
    }
  }

  for (const [tokenPath, expectedValue] of Object.entries(requiredPalette)) {
    const token = model.reference.get(tokenPath);
    if (!token) errors.push(`required palette anchor is missing: ${tokenPath}`);
    else if (token.value !== expectedValue)
      errors.push(`required palette anchor changed: ${tokenPath}`);
  }

  return errors;
};

const hexToRgb = (value) => {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) return null;
  return value
    .slice(1)
    .match(/../g)
    .map((part) => Number.parseInt(part, 16) / 255);
};

const channel = (value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);

export const relativeLuminance = (value) => {
  const rgb = hexToRgb(value);
  if (!rgb) return null;
  const [red, green, blue] = rgb.map(channel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  if (foregroundLuminance === null || backgroundLuminance === null) return null;
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

const contrastPairs = [
  ['color.fg.primary', 'color.bg.canvas', 4.5],
  ['color.fg.secondary', 'color.bg.canvas', 4.5],
  ['color.fg.muted', 'color.bg.canvas', 4.5],
  ['color.fg.link', 'color.bg.canvas', 4.5],
  ['color.fg.primary', 'color.bg.surface', 4.5],
  ['color.action.on-primary', 'color.action.primary', 4.5],
  ['color.action.on-primary-container', 'color.action.primary-container', 4.5],
  ['color.action.on-secondary-container', 'color.action.secondary-container', 4.5],
  ['color.fg.success', 'color.status.success-container', 4.5],
  ['color.fg.warning', 'color.status.warning-container', 4.5],
  ['color.fg.danger', 'color.status.danger-container', 4.5],
  ['color.focus.ring', 'color.bg.canvas', 3],
];

export const validateContrast = (model) => {
  const errors = [];
  for (const themeName of ['dark', 'light']) {
    const values = resolvedTheme(model, themeName);
    for (const [foregroundPath, backgroundPath, minimum] of contrastPairs) {
      const foreground = values.get(foregroundPath)?.value;
      const background = values.get(backgroundPath)?.value;
      const ratio = contrastRatio(foreground, background);
      if (ratio !== null && ratio < minimum) {
        errors.push(
          `${themeName}: ${foregroundPath} on ${backgroundPath} is ${ratio.toFixed(2)}:1; expected at least ${minimum}:1`,
        );
      }
    }
  }
  return errors;
};

export const cssVariableName = (tokenPath) =>
  `--dui-${tokenPath
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[._]/g, '-')
    .toLowerCase()}`;

export const formatCssValue = (value, type) => {
  if (isRecord(value) && typeof value.value === 'number' && typeof value.unit === 'string')
    return `${value.value}${value.unit}`;
  if (type === 'fontFamily' && Array.isArray(value)) {
    return value.map((font) => (/^[a-z-]+$/i.test(font) ? font : JSON.stringify(font))).join(', ');
  }
  if (type === 'cubicBezier' && Array.isArray(value)) return `cubic-bezier(${value.join(', ')})`;
  if (type === 'shadow' && isRecord(value)) {
    return [
      value.color,
      formatCssValue(value.offsetX),
      formatCssValue(value.offsetY),
      formatCssValue(value.blur),
      formatCssValue(value.spread),
    ].join(' ');
  }
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
};

export const sourceHash = (model) => {
  const stableSource = model.documents.map(({ file, document }) => ({ file, document }));
  return JSON.stringify(stableSource);
};

export const sourceFiles = () => [
  ...referenceFiles.map((file) => `packages/tokens/src/reference/${file}`),
  ...semanticFiles.map((file) => `packages/tokens/src/semantic/${file}`),
  ...themeNames.map((theme) => `packages/tokens/src/themes/${theme}.json`),
];

export const listJsonFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();
};
