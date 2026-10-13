'use strict';

import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
  TVFocusGuideView
} from 'react-native';

const theme = {
  background: '#000',
  label: '#fff',
  card: 'rgba(118, 118, 128, 0.24)',
  cardAlt: 'rgba(118, 118, 128, 0.4)',
  border: '#0a84ff',
  accent: '#ff375f'
};

const screenHeight = Dimensions.get('window').height;
const scale = screenHeight / 1080;

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const Text = ({
  style,
  children
}: {
  style?: any;
  children: React.ReactNode;
}) => (
  <RNText style={[styles.text, { color: theme.label }, style]}>
    {children}
  </RNText>
);

type CardProps = {
  width?: number;
  height?: number;
  label?: string | number;
  color?: string;
  scrollSnapAlign?: 'start' | 'center' | 'end';
  style?: any;
  onPress?: () => void;
};

const Card = ({
  width = 280 * scale,
  height = 160 * scale,
  label,
  color = theme.card,
  scrollSnapAlign,
  style,
  onPress
}: CardProps) => (
  <Pressable
    onPress={onPress}
    scrollSnapAlign={scrollSnapAlign}
    style={(state) => [
      styles.card,
      { width, height, backgroundColor: color },
      state.focused && styles.cardFocused,
      style
    ]}
  >
    {label !== undefined ? <Text style={styles.cardLabel}>{label}</Text> : null}
  </Pressable>
);

/**
 * 1. Horizontal ScrollView, snap each item to the start.
 * Classic "rail" pattern — items left-aligned to viewport edge.
 */
const SectionStartAligned = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>1. Horizontal · snap start</Text>
    <Text style={styles.sectionSubtitle}>
      Items use scrollSnapAlign="start" · snap to the left edge
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        horizontal
        snapToAlignment="item"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hListContainer}
      >
        {range(12).map((i) => (
          <Card key={i} label={i} scrollSnapAlign="start" />
        ))}
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 2. Horizontal ScrollView, items snap to the center.
 * Useful for "spotlight" UIs where active card is centered.
 */
const SectionCenterAligned = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>2. Horizontal · snap center</Text>
    <Text style={styles.sectionSubtitle}>
      Items use scrollSnapAlign="center" · active card sits in the middle
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        horizontal
        snapToAlignment="item"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hListContainer}
      >
        {range(12).map((i) => (
          <Card key={i} label={i} scrollSnapAlign="center" />
        ))}
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 3. Horizontal ScrollView, items snap to end.
 */
const SectionEndAligned = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>3. Horizontal · snap end</Text>
    <Text style={styles.sectionSubtitle}>
      Items use scrollSnapAlign="end" · snap to the right edge
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        horizontal
        snapToAlignment="item"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hListContainer}
      >
        {range(12).map((i) => (
          <Card key={i} label={i} scrollSnapAlign="end" />
        ))}
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 4. Horizontal with snapToItemPadding.
 * Adds scroll-padding-left so the snap stops with breathing room
 * and the previous/next item peeks in.
 */
const SectionWithPadding = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>4. Horizontal · snap with padding</Text>
    <Text style={styles.sectionSubtitle}>
      snapToItemPadding · creates "peek" of the previous item
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        horizontal
        snapToAlignment="item"
        snapToItemPadding={120 * scale}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hListContainer}
      >
        {range(12).map((i) => (
          <Card key={i} label={i} scrollSnapAlign="start" />
        ))}
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 5. Mixed-alignment children inside a single horizontal ScrollView.
 * Demonstrates that each item can opt into a different snap point —
 * the first stays pinned start, the middle snaps center, the last snaps end.
 */
const SectionMixedAlignment = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>5. Horizontal · mixed per-item</Text>
    <Text style={styles.sectionSubtitle}>
      Each child sets its own scrollSnapAlign — only the red cards are snap
      stops
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        horizontal
        snapToAlignment="item"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hListContainer}
      >
        <Card label="START" color={theme.accent} scrollSnapAlign="start" />
        {range(4).map((i) => (
          <Card key={`a${i}`} label={i} />
        ))}
        <Card label="CENTER" color={theme.accent} scrollSnapAlign="center" />
        {range(4).map((i) => (
          <Card key={`b${i}`} label={i} />
        ))}
        <Card label="END" color={theme.accent} scrollSnapAlign="end" />
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 6. Variable-width children with snap.
 * Real-world rails often mix wide hero cards with narrow tile cards;
 * verify snap still lands sensibly on each.
 */
const SectionVariableWidth = () => {
  const widths = [400, 200, 320, 240, 480, 200, 280, 360, 200, 300];
  return (
    <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
      <Text style={styles.sectionTitle}>6. Horizontal · variable widths</Text>
      <Text style={styles.sectionSubtitle}>
        Snap holds even when child widths differ
      </Text>
      <TVFocusGuideView autoFocus>
        <ScrollView
          horizontal
          snapToAlignment="item"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hListContainer}
        >
          {widths.map((w, i) => (
            <Card
              key={i}
              label={`${w}px`}
              width={w * scale}
              scrollSnapAlign="start"
            />
          ))}
        </ScrollView>
      </TVFocusGuideView>
    </TVFocusGuideView>
  );
};

/**
 * 7. Vertical ScrollView with snap — cards as full sections.
 */
const SectionVerticalSnap = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>7. Vertical · snap start</Text>
    <Text style={styles.sectionSubtitle}>
      Vertical scroll inside a fixed-height frame
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        snapToAlignment="item"
        showsVerticalScrollIndicator={false}
        style={styles.verticalFrame}
        contentContainerStyle={styles.verticalContent}
      >
        {range(8).map((i) => (
          <Card
            key={i}
            label={`Row ${i}`}
            width={'100%' as any}
            height={140 * scale}
            scrollSnapAlign="start"
            color={i % 2 ? theme.card : theme.cardAlt}
          />
        ))}
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 8. Paging-enabled vertical ScrollView.
 * pagingEnabled implies snap=mandatory and child-level snap=start.
 */
const SectionPagingVertical = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>8. Vertical · pagingEnabled</Text>
    <Text style={styles.sectionSubtitle}>
      pagingEnabled snaps one full viewport at a time
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        style={styles.pagingFrame}
      >
        {range(4).map((i) => (
          <Pressable
            key={i}
            style={(state) => [
              styles.page,
              { backgroundColor: i % 2 ? theme.card : theme.cardAlt },
              state.focused && styles.cardFocused
            ]}
          >
            <Text style={styles.pageLabel}>Page {i}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 9. Paging-enabled horizontal ScrollView.
 */
const SectionPagingHorizontal = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>9. Horizontal · pagingEnabled</Text>
    <Text style={styles.sectionSubtitle}>
      Full-width pages, swipe one at a time
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.pagingHorizontalFrame}
      >
        {range(5).map((i) => (
          <Pressable
            key={i}
            style={(state) => [
              styles.hPage,
              { backgroundColor: i % 2 ? theme.card : theme.cardAlt },
              state.focused && styles.cardFocused
            ]}
          >
            <Text style={styles.pageLabel}>Slide {i}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 10. snapToAlignment="item" with center-aligned narrow tiles.
 * Useful for "carousel" UIs where the focused tile sits in the center.
 */
const SectionSnapToItem = () => (
  <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
    <Text style={styles.sectionTitle}>
      10. Horizontal · narrow tile carousel
    </Text>
    <Text style={styles.sectionSubtitle}>
      Items use scrollSnapAlign="center" · narrow tiles, each a snap stop
    </Text>
    <TVFocusGuideView autoFocus>
      <ScrollView
        horizontal
        snapToAlignment="item"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hListContainer}
      >
        {range(12).map((i) => (
          <Card
            key={i}
            label={i}
            width={220 * scale}
            scrollSnapAlign="center"
          />
        ))}
      </ScrollView>
    </TVFocusGuideView>
  </TVFocusGuideView>
);

/**
 * 11. Nested: vertical outer scroll containing many horizontal snap rails.
 * The classic OTT/Netflix layout.
 */
const SectionNestedRails = () => {
  const rails = [
    'Trending',
    'Continue Watching',
    'New Releases',
    'Because You Watched',
    'Top Picks'
  ];
  return (
    <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
      <Text style={styles.sectionTitle}>
        11. Nested · vertical of horizontals
      </Text>
      <Text style={styles.sectionSubtitle}>
        Outer vertical snap, each row is a horizontal snap rail
      </Text>
      <TVFocusGuideView autoFocus>
        <ScrollView
          snapToAlignment="item"
          showsVerticalScrollIndicator={false}
          style={styles.nestedFrame}
        >
          {rails.map((title, r) => (
            <View key={title} scrollSnapAlign="start" style={styles.railWrap}>
              <Text style={styles.railTitle}>{title}</Text>
              <TVFocusGuideView autoFocus>
                <ScrollView
                  horizontal
                  snapToAlignment="item"
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hListContainer}
                >
                  {range(10).map((i) => (
                    <Card
                      key={i}
                      label={`${r}-${i}`}
                      width={240 * scale}
                      height={130 * scale}
                      scrollSnapAlign="start"
                    />
                  ))}
                </ScrollView>
              </TVFocusGuideView>
            </View>
          ))}
        </ScrollView>
      </TVFocusGuideView>
    </TVFocusGuideView>
  );
};

/**
 * 12. Programmatic scrollTo — verify snap still resolves
 * after imperative scrolls.
 */
const SectionProgrammatic = () => {
  const ref = React.useRef<ScrollView | null>(null);
  const itemWidth = 280 * scale;
  const gap = 5 * scale;

  const scrollToIndex = (i: number) => {
    ref.current?.scrollTo({
      x: i * (itemWidth + gap),
      animated: true
    });
  };

  return (
    <TVFocusGuideView autoFocus scrollSnapAlign="start" style={styles.section}>
      <Text style={styles.sectionTitle}>12. Programmatic scrollTo + snap</Text>
      <Text style={styles.sectionSubtitle}>
        Buttons jump to indices; snap engages after the animation
      </Text>
      <TVFocusGuideView autoFocus style={styles.controls}>
        {[0, 3, 6, 9].map((i) => (
          <Pressable
            key={i}
            onPress={() => scrollToIndex(i)}
            style={(state) => [
              styles.controlBtn,
              state.focused && styles.controlBtnFocused
            ]}
          >
            <Text style={styles.controlLabel}>Go to {i}</Text>
          </Pressable>
        ))}
      </TVFocusGuideView>
      <TVFocusGuideView autoFocus>
        <ScrollView
          ref={ref}
          horizontal
          snapToAlignment="item"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hListContainer}
        >
          {range(12).map((i) => (
            <Card key={i} label={i} scrollSnapAlign="start" />
          ))}
        </ScrollView>
      </TVFocusGuideView>
    </TVFocusGuideView>
  );
};

const ScrollSnappingExample = () => (
  <TVFocusGuideView
    autoFocus
    style={[styles.container, { backgroundColor: theme.background }]}
  >
    <ScrollView
      snapToAlignment="item"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.pageContent}
    >
      <Text style={styles.pageTitle}>Scroll Snapping</Text>
      <Text style={styles.pageSubtitle}>
        A tour of scroll-snap behaviors with focusable items
      </Text>

      <SectionStartAligned />
      <SectionCenterAligned />
      <SectionEndAligned />
      <SectionWithPadding />
      <SectionMixedAlignment />
      <SectionVariableWidth />
      <SectionVerticalSnap />
      <SectionPagingVertical />
      <SectionPagingHorizontal />
      <SectionSnapToItem />
      <SectionNestedRails />
      <SectionProgrammatic />
    </ScrollView>
  </TVFocusGuideView>
);

export default ScrollSnappingExample;

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageContent: { paddingVertical: 32 * scale, paddingHorizontal: 16 * scale },
  pageTitle: {
    fontSize: 48 * scale,
    fontWeight: 'bold',
    marginBottom: 4 * scale
  },
  pageSubtitle: {
    fontSize: 18 * scale,
    opacity: 0.6,
    marginBottom: 24 * scale
  },
  text: { fontWeight: '600', fontSize: 16 * scale },
  section: {
    marginBottom: 28 * scale
  },
  sectionTitle: {
    fontSize: 22 * scale,
    fontWeight: 'bold',
    marginBottom: 2 * scale
  },
  sectionSubtitle: {
    fontSize: 14 * scale,
    opacity: 0.55,
    marginBottom: 12 * scale
  },
  hListContainer: {
    paddingHorizontal: 16 * scale,
    gap: 5 * scale
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 4,
    borderColor: 'transparent'
  },
  cardFocused: {
    borderColor: theme.border
  },
  cardLabel: { fontSize: 24 * scale, fontWeight: 'bold' },
  verticalFrame: {
    height: 360 * scale,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  verticalContent: { padding: 8 * scale, gap: 8 * scale },
  pagingFrame: {
    height: 320 * scale,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  page: {
    height: 320 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'transparent'
  },
  pageLabel: { fontSize: 32 * scale, fontWeight: 'bold' },
  pagingHorizontalFrame: {
    height: 240 * scale,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  hPage: {
    width: Dimensions.get('window').width - 32 * scale,
    height: 240 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'transparent'
  },
  nestedFrame: {
    height: 540 * scale,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  railWrap: { paddingVertical: 8 * scale },
  railTitle: {
    fontSize: 18 * scale,
    fontWeight: '600',
    paddingHorizontal: 16 * scale,
    marginBottom: 6 * scale
  },
  controls: {
    flexDirection: 'row',
    gap: 8 * scale,
    paddingHorizontal: 16 * scale,
    marginBottom: 12 * scale
  },
  controlBtn: {
    paddingVertical: 8 * scale,
    paddingHorizontal: 16 * scale,
    borderRadius: 6,
    backgroundColor: theme.card,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  controlBtnFocused: {
    borderColor: theme.border
  },
  controlLabel: { fontSize: 16 * scale, fontWeight: '600' }
});
