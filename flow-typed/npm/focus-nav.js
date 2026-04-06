declare module "focus-nav" {
  import type { Context } from 'react';

  declare export type Direction = 'up' | 'down' | 'left' | 'right';

  declare export type UseFocusableConfig = {
    autoRestoreFocus?: ?boolean,
    focusable?: ?boolean,
    focusBoundaryDirections?: ?$ReadOnlyArray<Direction>,
    focusContainer?: ?boolean,
    focusKey?: ?string,
    forceFocus?: ?boolean,
    isFocusBoundary?: ?boolean,
    onBlur?: (...args: Array<any>) => mixed,
    onFocus?: (...args: Array<any>) => mixed,
    saveLastFocusedChild?: ?boolean,
    simulateClick?: ?boolean,
    ...
  };

  declare export type UseFocusableResult = {
    focusKey: string,
    focusSelf: (...args: Array<any>) => mixed,
    focused: boolean,
    hasFocusedChild: boolean,
    ref: { current: null | HTMLElement, ... },
    ...
  };

  declare export var FocusContext: Context<string>;

  declare export var SpatialNavigation: {
    destroy: () => void,
    getCurrentFocusKey: () => null | string,
    init: (config?: {
      shouldFocusDOMNode?: boolean,
      useGetBoundingClientRect?: boolean,
      ...
    }) => void,
    setDestination: (
      focusKey: string,
      destinationFocusKey?: null | string
    ) => void,
    setFocus: (focusKey: string, details?: mixed) => void,
    ...
  };

  declare export function useFocusable(
    config?: UseFocusableConfig
  ): UseFocusableResult;
}
