import { FixtureStateValueType } from 'react-cosmos-shared2/fixtureState';
import { useCreateFixtureState } from './useCreateFixtureState';
import { useCurrentValue } from './useCurrentValue';
import { useSetValue } from './useSetValue';
import { SetValue } from './shared';

type Opts<T extends FixtureStateValueType> = {
  defaultValue: T;
};

export function useValue<T extends FixtureStateValueType>(
  inputName: string,
  { defaultValue }: Opts<T>
): [T, SetValue<T>] {
  useCreateFixtureState(inputName, defaultValue);
  const currentValue = useCurrentValue(inputName, defaultValue);
  const setValue = useSetValue(inputName, defaultValue);
  return [currentValue, setValue];
}
