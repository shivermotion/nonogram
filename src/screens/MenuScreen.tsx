import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
} from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { playClick } from '../utils/audio';
import { NonogramPuzzle, Difficulty, Category } from '../types/game';
import { PUZZLES, getPuzzlesByDifficulty, getPuzzlesByCategory } from '../data/puzzles';
import { getCompletedPuzzles } from '../utils/storage';
import DepthFog from '../components/DepthFog';
import LightRays from '../components/LightRays';
import GridBackground from '../components/GridBackground';

interface MenuScreenProps {
  onPuzzleSelect: (puzzle: NonogramPuzzle) => void;
  onBack: () => void;
}

enum FilterType {
  ALL = 'all',
  DIFFICULTY = 'difficulty',
  CATEGORY = 'category',
  SIZE = 'size',
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onPuzzleSelect, onBack }) => {
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
      <View style={{
        width,
        height,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
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
      <TouchableOpacity style={{
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
      }} onPress={() => onPuzzleSelect(item)}>
        <View style={{ marginRight: 12 }}>
          {isCompleted ? (
            <MiniPreview solution={item.solution} width={56} height={56} />
          ) : (
            <View style={{
              width: 56,
              height: 56,
              borderWidth: 1,
              borderColor: '#e0e0e0',
              borderRadius: 8,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
            }}>
              <Ionicons name="help-circle-outline" size={20} color="#999" />
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[
            {
              fontSize: 18,
              fontWeight: '600',
              color: '#333',
              fontFamily: 'Kenney-Future',
            },
            !isCompleted && { color: '#999' }
          ]}>
            {isCompleted ? item.name : '???'}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginTop: 2,
            fontFamily: 'Kenney-Future',
          }}>
            {item.size.width}×{item.size.height}
          </Text>
        </View>

        <View style={{
          marginLeft: 12,
          alignItems: 'flex-end',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}>
            <Ionicons
              name={getDifficultyIcon(item.difficulty)}
              size={16}
              color={getDifficultyColor(item.difficulty)}
            />
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: getDifficultyColor(item.difficulty),
              marginLeft: 4,
              textTransform: 'capitalize',
              fontFamily: 'Kenney-Future',
            }}>
              {item.difficulty}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}>
            <Ionicons name={getCategoryIcon(item.category) as any} size={16} color="#666" />
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: '#666',
              marginLeft: 4,
              textTransform: 'capitalize',
              fontFamily: 'Kenney-Future',
            }}>{item.category}</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  marginRight: 8,
                  borderRadius: 16,
                  backgroundColor: '#f1f3f4',
                },
                selectedFilter === 'all' && { backgroundColor: '#007AFF' }
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  {
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#333',
                    marginLeft: 4,
                    textTransform: 'capitalize',
                    fontFamily: 'Kenney-Future',
                  },
                  selectedFilter === 'all' && { color: '#fff' }
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {Object.values(Difficulty).map(difficulty => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginRight: 8,
                    borderRadius: 16,
                    backgroundColor: '#f1f3f4',
                  },
                  selectedFilter === difficulty && { backgroundColor: '#007AFF' }
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
                    {
                      fontSize: 14,
                      fontWeight: '500',
                      color: '#333',
                      marginLeft: 4,
                      textTransform: 'capitalize',
                      fontFamily: 'Kenney-Future',
                    },
                    selectedFilter === difficulty && { color: '#fff' }
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  marginRight: 8,
                  borderRadius: 16,
                  backgroundColor: '#f1f3f4',
                },
                selectedFilter === 'all' && { backgroundColor: '#007AFF' }
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  {
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#333',
                    marginLeft: 4,
                    textTransform: 'capitalize',
                    fontFamily: 'Kenney-Future',
                  },
                  selectedFilter === 'all' && { color: '#fff' }
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {Object.values(Category).map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginRight: 8,
                    borderRadius: 16,
                    backgroundColor: '#f1f3f4',
                  },
                  selectedFilter === category && { backgroundColor: '#007AFF' }
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
                    {
                      fontSize: 14,
                      fontWeight: '500',
                      color: '#333',
                      marginLeft: 4,
                      textTransform: 'capitalize',
                      fontFamily: 'Kenney-Future',
                    },
                    selectedFilter === category && { color: '#fff' }
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  marginRight: 8,
                  borderRadius: 16,
                  backgroundColor: '#f1f3f4',
                },
                selectedFilter === 'all' && { backgroundColor: '#007AFF' }
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  {
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#333',
                    marginLeft: 4,
                    textTransform: 'capitalize',
                    fontFamily: 'Kenney-Future',
                  },
                  selectedFilter === 'all' && { color: '#fff' }
                ]}
              >
                All Sizes
              </Text>
            </TouchableOpacity>
            {sizes.map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginRight: 8,
                    borderRadius: 16,
                    backgroundColor: '#f1f3f4',
                  },
                  selectedFilter === size && { backgroundColor: '#007AFF' }
                ]}
                onPress={() => setSelectedFilter(size)}
              >
                <Text
                  style={[
                    {
                      fontSize: 14,
                      fontWeight: '500',
                      color: '#333',
                      marginLeft: 4,
                      textTransform: 'capitalize',
                      fontFamily: 'Kenney-Future',
                    },
                    selectedFilter === size && { color: '#fff' }
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
    <View style={{ flex: 1, backgroundColor: '#F8F9FF' }}>
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#e9ecef',
        }}>
          <TouchableOpacity
            onPress={async () => {
              await playClick();
              onBack();
            }}
            style={{ padding: 8 }}
          >
            <Image
              source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/arrow_basic_w_small.png')}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <Text style={{
            fontSize: 28,
            fontWeight: '700',
            color: '#333',
            fontFamily: 'Kenney-Future',
          }}>Puzzles</Text>
          <View style={{ padding: 8 }} />
        </View>

        {/* Filter Tabs */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#e9ecef',
        }}>
          <TouchableOpacity
            onPress={() => {
              setFilterType(FilterType.ALL);
              setSelectedFilter('all');
            }}
            style={[
              {
                flex: 1,
                paddingVertical: 8,
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                marginHorizontal: 2,
                borderRadius: 6,
              },
              filterType === FilterType.ALL && { backgroundColor: '#007AFF' }
            ]}
          >
            <Text
              style={[
                {
                  fontSize: 12,
                  fontWeight: '500',
                  color: '#666',
                  fontFamily: 'Kenney-Future',
                  textAlign: 'center',
                },
                filterType === FilterType.ALL && { color: '#fff' }
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFilterType(FilterType.DIFFICULTY);
              setSelectedFilter('all');
            }}
            style={[
              {
                flex: 1,
                paddingVertical: 8,
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                marginHorizontal: 2,
                borderRadius: 6,
              },
              filterType === FilterType.DIFFICULTY && { backgroundColor: '#007AFF' }
            ]}
          >
            <Text
              style={[
                {
                  fontSize: 12,
                  fontWeight: '500',
                  color: '#666',
                  fontFamily: 'Kenney-Future',
                  textAlign: 'center',
                },
                filterType === FilterType.DIFFICULTY && { color: '#fff' }
              ]}
            >
              Difficulty
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFilterType(FilterType.CATEGORY);
              setSelectedFilter('all');
            }}
            style={[
              {
                flex: 1,
                paddingVertical: 8,
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                marginHorizontal: 2,
                borderRadius: 6,
              },
              filterType === FilterType.CATEGORY && { backgroundColor: '#007AFF' }
            ]}
          >
            <Text
              style={[
                {
                  fontSize: 12,
                  fontWeight: '500',
                  color: '#666',
                  fontFamily: 'Kenney-Future',
                  textAlign: 'center',
                },
                filterType === FilterType.CATEGORY && { color: '#fff' }
              ]}
            >
              Category
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFilterType(FilterType.SIZE);
              setSelectedFilter('all');
            }}
            style={[
              {
                flex: 1,
                paddingVertical: 8,
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                marginHorizontal: 2,
                borderRadius: 6,
              },
              filterType === FilterType.SIZE && { backgroundColor: '#007AFF' }
            ]}
          >
            <Text
              style={[
                {
                  fontSize: 12,
                  fontWeight: '500',
                  color: '#666',
                  fontFamily: 'Kenney-Future',
                  textAlign: 'center',
                },
                filterType === FilterType.SIZE && { color: '#fff' }
              ]}
            >
              Size
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Options */}
        {filterType !== FilterType.ALL && (
          <View style={{
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#e9ecef',
            paddingVertical: 8,
          }}>{renderFilterOptions()}</View>
        )}

        {/* Puzzles List */}
        <FlatList
          data={filteredPuzzles}
          keyExtractor={item => item.id}
          renderItem={renderPuzzleItem}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={{
              paddingHorizontal: 16,
              paddingTop: 8,
            }}>
              <Text style={{
                fontSize: 14,
                color: '#666',
                fontWeight: '500',
                fontFamily: 'Kenney-Future',
              }}>Choose a puzzle to solve</Text>
            </View>
          }
        />

        {/* Footer Info */}
        <View style={{
          padding: 16,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 12,
            color: '#666',
            fontFamily: 'Kenney-Future',
          }}>
            {filteredPuzzles.length} puzzle{filteredPuzzles.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MenuScreen;
