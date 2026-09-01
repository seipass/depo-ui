import { loadTokenModel, validateContrast, validateTokenModel } from '../token-build/model.mjs';

const model = await loadTokenModel();
const errors = [...validateTokenModel(model), ...validateContrast(model)];

if (errors.length > 0) {
  console.error('Token lint failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log(
    'Token lint passed: DTCG metadata, tier boundaries, aliases, themes, palette anchors, and contrast are valid.',
  );
}
