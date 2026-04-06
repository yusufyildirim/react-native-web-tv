/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

'use client';

import type { PlatformMethods } from '../../types';
import type { ViewProps } from '../View/types';

import * as React from 'react';
import {
  FocusContext,
  SpatialNavigation,
  useFocusable
} from '@react-native-tvos/focus-nav';
import useMergeRefs from '../../modules/useMergeRefs';
import View from '../View';

export type FocusableElement = HTMLElement &
  PlatformMethods & {
    requestTVFocus?: () => boolean,
    __spatialFocusKey?: string,
    setDestinations?: (destinations: $ReadOnlyArray<FocusDestination>) => void
  };

export type FocusDestination =
  | FocusableElement
  | { current: null | FocusableElement };

export type FocusGuideMethods = FocusableElement & {
  requestTVFocus: () => boolean,
  setDestinations: (destinations: $ReadOnlyArray<FocusDestination>) => void
};

export type TVFocusGuideViewProps = {
  ...ViewProps,
  autoFocus?: ?boolean,
  destinations?: ?$ReadOnlyArray<FocusDestination>,
  trapFocusDown?: ?boolean,
  trapFocusLeft?: ?boolean,
  trapFocusRight?: ?boolean,
  trapFocusUp?: ?boolean
};

function resolveDestinationNode(
  destination: ?FocusDestination
): null | FocusableElement {
  if (destination == null) {
    return null;
  }

  const maybeRef = (destination: any);

  if (
    typeof maybeRef === 'object' &&
    maybeRef !== null &&
    Object.prototype.hasOwnProperty.call(maybeRef, 'current')
  ) {
    return maybeRef.current;
  }

  return maybeRef;
}

function getFirstDestinationFocusKey(
  destinations: ?$ReadOnlyArray<FocusDestination>
): void | string {
  if (destinations == null) {
    return undefined;
  }

  for (let index = 0; index < destinations.length; index += 1) {
    const node = resolveDestinationNode(destinations[index]);
    const focusKey = node != null ? node.__spatialFocusKey : null;

    if (focusKey != null) {
      return focusKey;
    }
  }

  return undefined;
}

const TVFocusGuideView: React.AbstractComponent<
  TVFocusGuideViewProps,
  FocusGuideMethods
> = React.forwardRef((props, forwardedRef) => {
  const {
    autoFocus = true,
    children,
    destinations,
    focusable,
    hasTVPreferredFocus,
    trapFocusDown,
    trapFocusLeft,
    trapFocusRight,
    trapFocusUp,
    ...rest
  } = props;

  void focusable;

  const hostRef = React.useRef<?FocusGuideMethods>(null);
  const setHostRef = useMergeRefs(hostRef, forwardedRef);
  const focusBoundaryDirections = React.useMemo(() => {
    const nextFocusBoundaryDirections = [];

    if (trapFocusUp) nextFocusBoundaryDirections.push('up');
    if (trapFocusRight) nextFocusBoundaryDirections.push('right');
    if (trapFocusDown) nextFocusBoundaryDirections.push('down');
    if (trapFocusLeft) nextFocusBoundaryDirections.push('left');

    return nextFocusBoundaryDirections;
  }, [trapFocusDown, trapFocusLeft, trapFocusRight, trapFocusUp]);

  const {
    ref: focusableRef,
    focusKey,
    focusSelf
  } = useFocusable({
    focusContainer: true,
    focusable: true,
    forceFocus: true,
    autoRestoreFocus: autoFocus,
    saveLastFocusedChild: autoFocus,

    focusKey: props.id ?? props.nativeID,
    isFocusBoundary: focusBoundaryDirections.length > 0,
    focusBoundaryDirections
  });

  const applyDestinations = React.useCallback(
    (nextDestinations: ?$ReadOnlyArray<FocusDestination>) => {
      SpatialNavigation.setDestination(
        focusKey,
        getFirstDestinationFocusKey(nextDestinations)
      );
    },
    [focusKey]
  );

  const setGuideRef = React.useCallback(
    (node: HTMLElement | null) => {
      focusableRef.current = node;

      if (node != null) {
        const guideNode: FocusGuideMethods = (node: any);

        guideNode.__spatialFocusKey = focusKey;
        guideNode.requestTVFocus = () => {
          focusSelf();

          if (typeof document === 'undefined') {
            return SpatialNavigation.getCurrentFocusKey() === focusKey;
          }

          const activeElement = document.activeElement;

          return (
            activeElement != null &&
            (activeElement === node || node.contains(activeElement))
          );
        };
        guideNode.setDestinations = (nextDestinations) => {
          applyDestinations(nextDestinations);
        };
      }

      setHostRef(node);
    },
    [applyDestinations, focusKey, focusSelf, focusableRef, setHostRef]
  );

  React.useEffect(() => {
    applyDestinations(destinations);
  }, [applyDestinations, destinations]);

  React.useEffect(() => {
    if (hasTVPreferredFocus === true) {
      focusSelf();
    }
  }, [focusSelf, hasTVPreferredFocus]);

  return (
    <FocusContext.Provider value={focusKey}>
      <View {...rest} ref={setGuideRef}>
        {children}
      </View>
    </FocusContext.Provider>
  );
});

TVFocusGuideView.displayName = 'TVFocusGuideView';

export default TVFocusGuideView;
