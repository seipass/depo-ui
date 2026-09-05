import { useState } from 'react';

type Direction = 'ltr' | 'rtl';
type Density = 'compact' | 'comfortable' | 'touch';

export default function LiveExamples() {
  const [direction, setDirection] = useState<Direction>('ltr');
  const [density, setDensity] = useState<Density>('comfortable');

  return (
    <section
      aria-labelledby="live-example-heading"
      className="dui-doc-example"
      data-density={density}
      dir={direction}
    >
      <h2 id="live-example-heading">Try density and direction</h2>
      <div aria-label="Example controls" className="dui-doc-example__controls" role="group">
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
      <p>
        Depo UI uses its dark appearance by default. OS forced-colors settings remain supported.
      </p>
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
