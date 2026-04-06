/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import TVFocusGuideView from '../';
import View from '../../View';
import { act, render } from '@testing-library/react';
import { SpatialNavigation } from '@react-native-tvos/focus-nav';

describe('components/TVFocusGuideView', () => {
  let didInit = false;

  function initSpatialNavigation() {
    act(() => {
      SpatialNavigation.init({
        shouldFocusDOMNode: true,
        useGetBoundingClientRect: true
      });
    });

    didInit = true;
  }

  afterEach(() => {
    if (didInit) {
      act(() => {
        SpatialNavigation.destroy();
      });
      didInit = false;
    }
  });

  test('default', () => {
    const { container } = render(<TVFocusGuideView />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('node can request TV focus imperatively', () => {
    const guideRef = React.createRef();
    const childRef = React.createRef();
    let didFocus = false;

    initSpatialNavigation();

    act(() => {
      render(
        <TVFocusGuideView id="guide:test-request-focus" ref={guideRef}>
          <View
            focusable={true}
            id="guide:test-request-focus-child"
            ref={childRef}
          />
        </TVFocusGuideView>
      );
    });

    expect(guideRef.current.__spatialFocusKey).toBe('guide:test-request-focus');
    expect(typeof guideRef.current.setDestinations).toBe('function');

    act(() => {
      didFocus = guideRef.current.requestTVFocus();
    });

    expect(didFocus).toBe(true);
    expect(SpatialNavigation.getCurrentFocusKey()).toBe(
      'guide:test-request-focus-child'
    );
    expect(document.activeElement).toBe(childRef.current);
  });

  test('node can set destinations imperatively', () => {
    const guideRef = React.createRef();
    const secondRef = React.createRef();
    let didFocus = false;

    initSpatialNavigation();

    act(() => {
      render(
        <TVFocusGuideView id="guide:test-destination" ref={guideRef}>
          <View focusable={true} id="guide:test-destination-first" />
          <View
            focusable={true}
            id="guide:test-destination-second"
            ref={secondRef}
          />
        </TVFocusGuideView>
      );
    });

    act(() => {
      guideRef.current.setDestinations([secondRef.current]);
      didFocus = guideRef.current.requestTVFocus();
    });

    expect(didFocus).toBe(true);
    expect(SpatialNavigation.getCurrentFocusKey()).toBe(
      'guide:test-destination-second'
    );
    expect(document.activeElement).toBe(secondRef.current);
  });

  test('destinations prop redirects focus when refs are available', () => {
    const guideRef = React.createRef();
    const secondRef = React.createRef();
    let rerender;

    initSpatialNavigation();

    act(() => {
      ({ rerender } = render(
        <TVFocusGuideView id="guide:test-prop-destination" ref={guideRef}>
          <View focusable={true} id="guide:test-prop-destination-first" />
          <View
            focusable={true}
            id="guide:test-prop-destination-second"
            ref={secondRef}
          />
        </TVFocusGuideView>
      ));
    });

    act(() => {
      rerender(
        <TVFocusGuideView
          destinations={[secondRef]}
          id="guide:test-prop-destination"
          ref={guideRef}
        >
          <View focusable={true} id="guide:test-prop-destination-first" />
          <View
            focusable={true}
            id="guide:test-prop-destination-second"
            ref={secondRef}
          />
        </TVFocusGuideView>
      );
    });

    act(() => {
      guideRef.current.requestTVFocus();
    });

    expect(SpatialNavigation.getCurrentFocusKey()).toBe(
      'guide:test-prop-destination-second'
    );
    expect(document.activeElement).toBe(secondRef.current);
  });
});
