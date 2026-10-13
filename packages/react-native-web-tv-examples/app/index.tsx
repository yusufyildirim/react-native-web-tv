import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TVFocusGuideView
} from 'react-native';

import { Text, View } from '@/components/Themed';

type Example = {
  href: '/tv-focus-guide-auto-focus' | '/scroll-snapping';
  title: string;
  description: string;
};

const EXAMPLES: Example[] = [
  {
    href: '/tv-focus-guide-auto-focus',
    title: 'TVFocusGuide autoFocus',
    description: 'Focus guide autoFocus usage.'
  },
  {
    href: '/scroll-snapping',
    title: 'Scroll snapping',
    description:
      'snapToAlignment, pagingEnabled, scrollSnapAlign, padding, nesting.'
  }
];

export default function Index() {
  return (
    <TVFocusGuideView autoFocus>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>react-native-web-tv examples</Text>
        <View style={styles.list}>
          {EXAMPLES.map((example) => (
            <Pressable
              key={example.href}
              onPress={() => router.push(example.href)}
              style={(state) => [
                styles.item,
                state.focused && styles.itemFocused
              ]}
            >
              <Text style={styles.itemTitle}>{example.title}</Text>
              <Text style={styles.itemDescription}>
                {example.description}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    gap: 24
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  list: {
    gap: 12
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  itemFocused: {
    borderColor: '#0a84ff'
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  itemDescription: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7
  }
});
