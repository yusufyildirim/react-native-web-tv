import { Link } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

type Example = {
  href: '/tv-focus-guide-auto-focus';
  title: string;
  description: string;
};

const EXAMPLES: Example[] = [
  {
    href: '/tv-focus-guide-auto-focus',
    title: 'TVFocusGuide autoFocus',
    description: 'Focus guide autoFocus usage.'
  }
];

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>react-native-web-tv examples</Text>
      <View style={styles.list}>
        {EXAMPLES.map((example) => (
          <Link key={example.href} href={example.href} style={styles.item}>
            <Text style={styles.itemTitle}>{example.title}</Text>
            <Text style={styles.itemDescription}>{example.description}</Text>
          </Link>
        ))}
      </View>
    </ScrollView>
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
    borderWidth: StyleSheet.hairlineWidth
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
