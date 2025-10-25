import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NonogramPuzzle, Difficulty, Category } from '../types/game';
import { PUZZLES, getPuzzlesByDifficulty, getPuzzlesByCategory } from '../data/puzzles';
import { getCompletedPuzzles } from '../utils/storage';

interface MenuScreenProps {
  onPuzzleSelect: (puzzle: NonogramPuzzle) => void;
}

enum FilterType {
  ALL = 'all',
  DIFFICULTY = 'difficulty',
  CATEGORY = 'category',
  SIZE = 'size',
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onPuzzleSelect }) => {
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [completedMap, setCompletedMap] = useState<Record<string, any>>({});

  useEffect(() => {
    (async () => {
      const data = await getCompletedPuzzles();
      setCompletedMap(data);
    })();
  }, []);

  const getFilteredPuzzles = (): NonogramPuzzle[] => {
    switch (filterType) {
      case FilterType.DIFFICULTY:
        if (selectedFilter === 'all') return PUZZLES;
        return getPuzzlesByDifficulty(selectedFilter as Difficulty);
      case FilterType.CATEGORY:
        if (selectedFilter === 'all') return PUZZLES;
        return getPuzzlesByCategory(selectedFilter as Category);
      case FilterType.SIZE:
        if (selectedFilter === 'all') return PUZZLES;
        const [width, height] = selectedFilter.split('x').map(Number);
        return PUZZLES.filter(p => p.size.width === width && p.size.height === height);
      default:
        return PUZZLES;
    }
  };

  const getDifficultyIcon = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'star-outline' as const;
      case Difficulty.MEDIUM:
        return 'star-half-outline' as const;
      case Difficulty.HARD:
        return 'star' as const;
      case Difficulty.EXPERT:
        return 'diamond-outline' as const;
      default:
        return 'star-outline' as const;
    }
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case Difficulty.EASY:
        return '#4CAF50';
      case Difficulty.MEDIUM:
        return '#FF9800';
      case Difficulty.HARD:
        return '#F44336';
      case Difficulty.EXPERT:
        return '#9C27B0';
      default:
        return '#4CAF50';
    }
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case Category.ANIMALS:
        return 'paw-outline' as const;
      case Category.OBJECTS:
        return 'cube-outline' as const;
      case Category.NATURE:
        return 'leaf-outline' as const;
      case Category.FOOD:
        return 'restaurant-outline' as const;
      case Category.VEHICLES:
        return 'car-outline' as const;
      case Category.ABSTRACT:
        return 'shapes-outline' as const;
      default:
        return 'shapes-outline' as const;
    }
  };

  const MiniPreview: React.FC<{ solution: boolean[][]; width: number; height: number }> = ({
    solution,
    width,
    height,
  }) => {
    const rows = solution.length;
    const cols = solution[0]?.length ?? 0;
    const cellSize = Math.max(1, Math.floor(Math.min(width / cols, height / rows)));
    return (
      <View style={[styles.previewBox, { width, height }]}>
        {solution.map((row, rIdx) => (
          <View key={rIdx} style={{ flexDirection: 'row', height: cellSize }}>
            {row.map((filled, cIdx) => (
              <View
                key={cIdx}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: filled ? '#333' : '#fff',
                }}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderPuzzleItem = ({ item }: { item: NonogramPuzzle }) => {
    const isCompleted = !!completedMap[item.id];
    return (
      <TouchableOpacity style={styles.puzzleItem} onPress={() => onPuzzleSelect(item)}>
        <View style={styles.previewContainer}>
          {isCompleted ? (
            <MiniPreview solution={item.solution} width={56} height={56} />
          ) : (
            <View style={[styles.previewBox, styles.previewLocked]}>
              <Ionicons name="help-circle-outline" size={20} color="#999" />
            </View>
          )}
        </View>

        <View style={styles.puzzleInfo}>
          <Text style={[styles.puzzleName, !isCompleted && { color: '#999' }]}>
            {isCompleted ? item.name : '???'}
          </Text>
          <Text style={styles.puzzleSize}>
            {item.size.width}×{item.size.height}
          </Text>
        </View>

        <View style={styles.puzzleMeta}>
          <View style={styles.metaRow}>
            <Ionicons
              name={getDifficultyIcon(item.difficulty)}
              size={16}
              color={getDifficultyColor(item.difficulty)}
            />
            <Text style={[styles.metaText, { color: getDifficultyColor(item.difficulty) }]}>
              {item.difficulty}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name={getCategoryIcon(item.category) as any} size={16} color="#666" />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  const renderFilterOptions = () => {
    switch (filterType) {
      case FilterType.DIFFICULTY:
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterOption, selectedFilter === 'all' && styles.filterOptionActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  selectedFilter === 'all' && styles.filterOptionTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {Object.values(Difficulty).map(difficulty => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterOption,
                  selectedFilter === difficulty && styles.filterOptionActive,
                ]}
                onPress={() => setSelectedFilter(difficulty)}
              >
                <Ionicons
                  name={getDifficultyIcon(difficulty)}
                  size={16}
                  color={selectedFilter === difficulty ? '#fff' : getDifficultyColor(difficulty)}
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedFilter === difficulty && styles.filterOptionTextActive,
                  ]}
                >
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case FilterType.CATEGORY:
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterOption, selectedFilter === 'all' && styles.filterOptionActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  selectedFilter === 'all' && styles.filterOptionTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {Object.values(Category).map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterOption,
                  selectedFilter === category && styles.filterOptionActive,
                ]}
                onPress={() => setSelectedFilter(category)}
              >
                <Ionicons
                  name={getCategoryIcon(category) as any}
                  size={16}
                  color={selectedFilter === category ? '#fff' : '#666'}
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedFilter === category && styles.filterOptionTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case FilterType.SIZE:
        const sizes = Array.from(
          new Set(PUZZLES.map(p => `${p.size.width}x${p.size.height}`))
        ).sort();
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterOption, selectedFilter === 'all' && styles.filterOptionActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  selectedFilter === 'all' && styles.filterOptionTextActive,
                ]}
              >
                All Sizes
              </Text>
            </TouchableOpacity>
            {sizes.map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.filterOption, selectedFilter === size && styles.filterOptionActive]}
                onPress={() => setSelectedFilter(size)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedFilter === size && styles.filterOptionTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  const filteredPuzzles = getFilteredPuzzles();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header removed */}

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filterType === FilterType.ALL && styles.filterTabActive]}
          onPress={() => {
            setFilterType(FilterType.ALL);
            setSelectedFilter('all');
          }}
        >
          <Text
            style={[
              styles.filterTabText,
              filterType === FilterType.ALL && styles.filterTabTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filterType === FilterType.DIFFICULTY && styles.filterTabActive]}
          onPress={() => {
            setFilterType(FilterType.DIFFICULTY);
            setSelectedFilter('all');
          }}
        >
          <Text
            style={[
              styles.filterTabText,
              filterType === FilterType.DIFFICULTY && styles.filterTabTextActive,
            ]}
          >
            Difficulty
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filterType === FilterType.CATEGORY && styles.filterTabActive]}
          onPress={() => {
            setFilterType(FilterType.CATEGORY);
            setSelectedFilter('all');
          }}
        >
          <Text
            style={[
              styles.filterTabText,
              filterType === FilterType.CATEGORY && styles.filterTabTextActive,
            ]}
          >
            Category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filterType === FilterType.SIZE && styles.filterTabActive]}
          onPress={() => {
            setFilterType(FilterType.SIZE);
            setSelectedFilter('all');
          }}
        >
          <Text
            style={[
              styles.filterTabText,
              filterType === FilterType.SIZE && styles.filterTabTextActive,
            ]}
          >
            Size
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      {filterType !== FilterType.ALL && (
        <View style={styles.filterOptions}>{renderFilterOptions()}</View>
      )}

      {/* Puzzles List */}
      <FlatList
        data={filteredPuzzles}
        keyExtractor={item => item.id}
        renderItem={renderPuzzleItem}
        style={styles.puzzlesList}
        contentContainerStyle={styles.puzzlesListContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>Choose a puzzle to solve</Text>
          </View>
        }
      />

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {filteredPuzzles.length} puzzle{filteredPuzzles.length !== 1 ? 's' : ''} available
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filterTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTabTextActive: {
    color: '#007AFF',
  },
  filterOptions: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f1f3f4',
  },
  filterOptionActive: {
    backgroundColor: '#007AFF',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  puzzlesList: {
    flex: 1,
  },
  puzzlesListContent: {
    padding: 16,
  },
  promptContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  puzzleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewContainer: {
    marginRight: 12,
  },
  previewBox: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  previewLocked: {
    backgroundColor: '#f5f5f5',
  },
  puzzleInfo: {
    flex: 1,
  },
  puzzleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  puzzleSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  puzzleDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  puzzleMeta: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});

export default MenuScreen;
