import retry from '@skidding/async-retry';
import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { ReactTestRenderer } from 'react-test-renderer';
import { FixtureContext } from '../FixtureContext';
import { runFixtureLoaderTests } from '../testHelpers';

function MyComponent() {
  const { setFixtureState } = React.useContext(FixtureContext);

  function setCustomState() {
    setFixtureState(() => ({ props: [], customFixtureState: true }));
  }

  function clearCustomState() {
    setFixtureState(() => ({ props: [] }));
  }

  return (
    <>
      <button onClick={setCustomState}>Set custom state</button>
      <button onClick={clearCustomState}>Clear custom state</button>
    </>
  );
}

const rendererId = uuid();
const fixtures = {
  first: MyComponent
};
const decorators = {};

runFixtureLoaderTests(mount => {
  it('creates fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId: { path: 'first', name: null },
          fixtureState: { props: [] }
        });

        // Retry until button is rendered
        await retry(() => clickButtonByLabel(renderer, 'Set custom state'));
        await fixtureStateChange({
          rendererId,
          fixtureId: { path: 'first', name: null },
          fixtureState: { props: [], customFixtureState: true }
        });

        // Catches regression where changed state wouldn't be properly handled
        // Fixed in https://github.com/react-cosmos/react-cosmos/pull/1008
        clickButtonByLabel(renderer, 'Clear custom state');
        await fixtureStateChange({
          rendererId,
          fixtureId: { path: 'first', name: null },
          fixtureState: { props: [] }
        });
      }
    );
  });
});

function clickButtonByLabel(renderer: ReactTestRenderer, label: string) {
  renderer.root.findByProps({ children: label }).props.onClick();
}
