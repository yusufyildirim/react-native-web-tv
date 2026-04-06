/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use client';

import type { PlatformMethods } from '../../types';
import type { ViewProps } from './types';

import * as React from 'react';
import { useFocusable } from 'focus-nav';
import createElement from '../createElement';
import * as forwardedProps from '../../modules/forwardedProps';
import pick from '../../modules/pick';
import useElementLayout from '../../modules/useElementLayout';
import useMergeRefs from '../../modules/useMergeRefs';
import usePlatformMethods from '../../modules/usePlatformMethods';
import useResponderEvents from '../../modules/useResponderEvents';
import StyleSheet from '../StyleSheet';
import TextAncestorContext from '../Text/TextAncestorContext';
import { useLocaleContext, getLocaleDirection } from '../../modules/useLocale';

const forwardPropsList = Object.assign(
  {},
  forwardedProps.defaultProps,
  forwardedProps.accessibilityProps,
  forwardedProps.clickProps,
  forwardedProps.focusProps,
  forwardedProps.keyboardProps,
  forwardedProps.mouseProps,
  forwardedProps.touchProps,
  forwardedProps.styleProps,
  {
    href: true,
    lang: true,
    onScroll: true,
    onWheel: true,
    pointerEvents: true
  }
);

const pickProps = (props) => pick(props, forwardPropsList);

function createSpatialFocusEvent(type, node) {
  return {
    type,
    target: node,
    currentTarget: node,
    nativeEvent: {
      type,
      target: node
    },
    preventDefault() {},
    stopPropagation() {}
  };
}

function useViewProps(props, forwardedRef, hostRef, focusableRef) {
  const {
    hrefAttrs,
    onLayout,
    onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture,
    onResponderEnd,
    onResponderGrant,
    onResponderMove,
    onResponderReject,
    onResponderRelease,
    onResponderStart,
    onResponderTerminate,
    onResponderTerminationRequest,
    onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder,
    onStartShouldSetResponderCapture,
    ...rest
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    React.Children.toArray(props.children).forEach((item) => {
      if (typeof item === 'string') {
        console.error(
          `Unexpected text node: ${item}. A text node cannot be a child of a <View>.`
        );
      }
    });
  }

  const hasTextAncestor = React.useContext(TextAncestorContext);
  const { direction: contextDirection } = useLocaleContext();

  useElementLayout(hostRef, onLayout);
  useResponderEvents(hostRef, {
    onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture,
    onResponderEnd,
    onResponderGrant,
    onResponderMove,
    onResponderReject,
    onResponderRelease,
    onResponderStart,
    onResponderTerminate,
    onResponderTerminationRequest,
    onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder,
    onStartShouldSetResponderCapture
  });

  let component = 'div';

  const langDirection =
    props.lang != null ? getLocaleDirection(props.lang) : null;
  const componentDirection = props.dir || langDirection;
  const writingDirection = componentDirection || contextDirection;

  const supportedProps = pickProps(rest);
  supportedProps.dir = componentDirection;
  supportedProps.style = [
    styles.view$raw,
    hasTextAncestor && styles.inline,
    props.style
  ];
  if (props.href != null) {
    component = 'a';
    if (hrefAttrs != null) {
      const { download, rel, target } = hrefAttrs;
      if (download != null) {
        supportedProps.download = download;
      }
      if (rel != null) {
        supportedProps.rel = rel;
      }
      if (typeof target === 'string') {
        supportedProps.target =
          target.charAt(0) !== '_' ? '_' + target : target;
      }
    }
  }

  const platformMethodsRef = usePlatformMethods(supportedProps);
  const setRef = useMergeRefs(
    hostRef,
    platformMethodsRef,
    focusableRef,
    forwardedRef
  );

  supportedProps.ref = setRef;

  return { component, supportedProps, writingDirection };
}

const BaseView = React.forwardRef((props, forwardedRef) => {
  const hostRef = React.useRef(null);
  const { component, supportedProps, writingDirection } = useViewProps(
    props,
    forwardedRef,
    hostRef
  );

  return createElement(component, supportedProps, { writingDirection });
});

const FocusableView = React.forwardRef((props, forwardedRef) => {
  const hostRef = React.useRef(null);
  const focusHandledByDOMRef = React.useRef(false);
  const focusKey = props.id ?? props.nativeID;
  const {
    ref: focusableRef,
    focusKey: spatialFocusKey,
    focusSelf
  } = useFocusable({
    focusKey,
    onBlur: () => {
      const node = hostRef.current;
      const onBlur = props.onBlur;

      if (node != null && !focusHandledByDOMRef.current && onBlur != null) {
        onBlur(createSpatialFocusEvent('blur', node));
      }

      focusHandledByDOMRef.current = false;
    },
    onFocus: () => {
      const node = hostRef.current;
      const onFocus = props.onFocus;
      const focusHandledByDOM =
        typeof document !== 'undefined' && document.activeElement === node;

      focusHandledByDOMRef.current = focusHandledByDOM;

      if (node != null && !focusHandledByDOM && onFocus != null) {
        onFocus(createSpatialFocusEvent('focus', node));
      }
    },
    simulateClick: true
  });

  const setSpatialRef = React.useCallback(
    (node) => {
      if (node == null) return;
      focusableRef.current = node;

      const focusableNode = (node: any);

      focusableNode.__spatialFocusKey = spatialFocusKey;
      focusableNode.requestTVFocus = () => {
        focusSelf();

        return document.activeElement === node;
      };
    },
    [focusSelf, focusableRef, spatialFocusKey]
  );

  React.useEffect(() => {
    if (props.hasTVPreferredFocus === true) {
      focusSelf();
    }
  }, [focusSelf, props.hasTVPreferredFocus]);

  const { component, supportedProps, writingDirection } = useViewProps(
    {
      ...props,
      focusable: true
    },
    forwardedRef,
    hostRef,
    setSpatialRef
  );

  return createElement(component, supportedProps, { writingDirection });
});

const View: React.AbstractComponent<ViewProps, HTMLElement & PlatformMethods> =
  React.forwardRef((props, forwardedRef) =>
    props.focusable === true || props.hasTVPreferredFocus === true ? (
      <FocusableView {...props} ref={forwardedRef} />
    ) : (
      <BaseView {...props} ref={forwardedRef} />
    )
  );

View.displayName = 'View';

const styles = StyleSheet.create({
  view$raw: {
    alignContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    border: '0 solid black',
    boxSizing: 'border-box',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    flexShrink: 0,
    listStyle: 'none',
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: 'relative',
    textDecoration: 'none',
    zIndex: 0
  },
  inline: {
    display: 'inline-flex'
  }
});

export type { ViewProps };

export default View;
