import { useState } from 'react';

type Theme = 'dark' | 'light' | 'high-contrast';
type Direction = 'ltr' | 'rtl';
type Density = 'compact' | 'comfortable' | 'touch';

const labels: Record<Theme, string> = {
  dark: 'Dark',
  light: 'Light',
  'high-contrast': 'High contrast',
};

export default function LiveExamples() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [density, setDensity] = useState<Density>('comfortable');

  return (
    <section
      aria-labelledby="live-example-heading"
      className="dui-doc-example"
      data-density={density}
      data-theme={theme}
      dir={direction}
    >
      <h2 id="live-example-heading">Try the adaptive states</h2>
      <div aria-label="Example controls" className="dui-doc-example__controls" role="group">
        {(Object.keys(labels) as Theme[]).map((value) => (
          <button
            aria-pressed={theme === value}
            className="dui-doc-button dui-doc-button--secondary"
            key={value}
            onClick={() => setTheme(value)}
            type="button"
          >
            {labels[value]}
          </button>
        ))}
        <button
          aria-pressed={direction === 'rtl'}
          className="dui-doc-button dui-doc-button--secondary"
          onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
          type="button"
        >
          {direction === 'ltr' ? 'RTL' : 'LTR'}
        </button>
        <label>
          Density
          <select onChange={(event) => setDensity(event.target.value as Density)} value={density}>
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="touch">Touch</option>
          </select>
        </label>
      </div>
      <div className="dui-doc-example__surface" data-direction={direction}>
        <strong>Depo UI adapts to its container.</strong>
        <p>
          Long labels and CJK text remain readable: これは狭いコンテナでも折り返される説明文です。
        </p>
        <button className="dui-doc-button dui-doc-button--primary" type="button">
          Continue
        </button>
      </div>
    </section>
  );
}
