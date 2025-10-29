import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { playClick } from '../utils/audio';
import { hapticLight, hapticSelection } from '../utils/haptics';
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

  // Sophisticated animation values for high art aesthetic
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-20);
  const filterTabsOpacity = useSharedValue(0);
  const filterTabsTranslateY = useSharedValue(20);
  const listOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(30);

  useEffect(() => {
    (async () => {
      const data = await getCompletedPuzzles();
      setCompletedMap(data);
    })();

    // Sophisticated staggered entrance animations
    headerOpacity.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });
    headerTranslateY.value = withTiming(0, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });

    titleOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      })
    );
    titleTranslateY.value = withDelay(
      200,
      withTiming(0, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      })
    );

    filterTabsOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      })
    );
    filterTabsTranslateY.value = withDelay(
      400,
      withTiming(0, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      })
    );

    listOpacity.value = withDelay(
      600,
      withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      })
    );
    listTranslateY.value = withDelay(
      600,
      withTiming(0, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      })
    );
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
      case Category.EDUCATIONAL:
        return 'school-outline' as const;
      default:
        return 'shapes-outline' as const;
    }
  };

  const AnimatedPlaceholderIcon: React.FC = () => {
    // Sophisticated animation values for placeholder icon
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(0.6);
    const pulseScale = useSharedValue(1);

    useEffect(() => {
      // Gentle floating animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Subtle rotation
      rotation.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-5, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Breathing opacity
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Pulse effect
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value * pulseScale.value }, { rotate: `${rotation.value}deg` }],
        opacity: opacity.value,
      };
    });

    return (
      <Animated.View style={animatedStyle}>
        <View
          style={{
            width: 56,
            height: 56,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            borderRadius: 8,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Ionicons name="help-circle-outline" size={20} color="#999" />
        </View>
      </Animated.View>
    );
  };

  const MiniPreview: React.FC<{ solution: boolean[][]; width: number; height: number }> = ({
    solution,
    width,
    height,
  }) => {
    const rows = solution.length;
    const cols = solution[0]?.length ?? 0;
    const cellSize = Math.max(1, Math.floor(Math.min(width / cols, height / rows)));

    // Sophisticated animation values for continuous high art effects
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(1);
    const shadowOpacity = useSharedValue(0.1);
    const glowIntensity = useSharedValue(0);

    useEffect(() => {
      // Continuous subtle breathing animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Gentle rotation animation
      rotation.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-2, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Elegant opacity pulsing
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Dynamic shadow animation
      shadowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.1, { duration: 5000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );

      // Sophisticated glow effect
      glowIntensity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
        opacity: opacity.value,
        shadowColor: '#2D1B3D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: shadowOpacity.value,
        shadowRadius: 8,
        elevation: 8,
      };
    });

    return (
      <Animated.View style={animatedStyle}>
        <View
          style={{
            width,
            height,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            borderRadius: 8,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
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
      </Animated.View>
    );
  };

  const renderPuzzleItem = ({ item }: { item: NonogramPuzzle }) => {
    const isCompleted = !!completedMap[item.id];
    return (
      <TouchableOpacity
        style={{
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
        }}
        onPress={() => {
          hapticLight();
          onPuzzleSelect(item);
        }}
      >
        <View style={{ marginRight: 12 }}>
          {isCompleted ? (
            <MiniPreview solution={item.solution} width={56} height={56} />
          ) : (
            <AnimatedPlaceholderIcon />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              {
                fontSize: 18,
                fontWeight: '600',
                color: '#333',
                fontFamily: 'Kenney-Future',
              },
              !isCompleted && { color: '#999' },
            ]}
          >
            {isCompleted ? item.name : '???'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#666',
              marginTop: 2,
              fontFamily: 'Kenney-Future',
            }}
          >
            {item.size.width}×{item.size.height}
          </Text>
        </View>

        <View
          style={{
            marginLeft: 12,
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Ionicons
              name={getDifficultyIcon(item.difficulty)}
              size={16}
              color={getDifficultyColor(item.difficulty)}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: getDifficultyColor(item.difficulty),
                marginLeft: 4,
                textTransform: 'capitalize',
                fontFamily: 'Kenney-Future',
              }}
            >
              {item.difficulty}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Ionicons name={getCategoryIcon(item.category) as any} size={16} color="#666" />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: '#666',
                marginLeft: 4,
                textTransform: 'capitalize',
                fontFamily: 'Kenney-Future',
              }}
            >
              {item.category}
            </Text>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 16 }}
          >
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
                selectedFilter === 'all' && { backgroundColor: '#007AFF' },
              ]}
              onPress={() => {
                hapticSelection();
                setSelectedFilter('all');
              }}
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
                  selectedFilter === 'all' && { color: '#fff' },
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
                  selectedFilter === difficulty && { backgroundColor: '#007AFF' },
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedFilter(difficulty);
                }}
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
                    selectedFilter === difficulty && { color: '#fff' },
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 16 }}
          >
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
                selectedFilter === 'all' && { backgroundColor: '#007AFF' },
              ]}
              onPress={() => {
                hapticSelection();
                setSelectedFilter('all');
              }}
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
                  selectedFilter === 'all' && { color: '#fff' },
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
                  selectedFilter === category && { backgroundColor: '#007AFF' },
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedFilter(category);
                }}
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
                    selectedFilter === category && { color: '#fff' },
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 16 }}
          >
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
                selectedFilter === 'all' && { backgroundColor: '#007AFF' },
              ]}
              onPress={() => {
                hapticSelection();
                setSelectedFilter('all');
              }}
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
                  selectedFilter === 'all' && { color: '#fff' },
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
                  selectedFilter === size && { backgroundColor: '#007AFF' },
                ]}
                onPress={() => {
                  hapticSelection();
                  setSelectedFilter(size);
                }}
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
                    selectedFilter === size && { color: '#fff' },
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

  // Animated styles for sophisticated entrance effects
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: titleTranslateY.value }],
    };
  });

  const animatedFilterTabsStyle = useAnimatedStyle(() => {
    return {
      opacity: filterTabsOpacity.value,
      transform: [{ translateY: filterTabsTranslateY.value }],
    };
  });

  const animatedListStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      transform: [{ translateY: listTranslateY.value }],
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FF' }}>
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        edges={['top', 'bottom', 'left', 'right']}
      >
        {/* Header */}
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: '#fff',
              borderBottomWidth: 1,
              borderBottomColor: '#e9ecef',
            },
            animatedHeaderStyle,
          ]}
        >
          <TouchableOpacity
            onPress={async () => {
              hapticLight();
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
          <Animated.Text
            style={[
              {
                fontSize: 28,
                fontWeight: '700',
                color: '#333',
                fontFamily: 'Kenney-Future',
              },
              animatedTitleStyle,
            ]}
          >
            Puzzles
          </Animated.Text>
          <View style={{ padding: 8 }} />
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              backgroundColor: '#fff',
              borderBottomWidth: 1,
              borderBottomColor: '#e9ecef',
            },
            animatedFilterTabsStyle,
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              hapticSelection();
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
              filterType === FilterType.ALL && { backgroundColor: '#007AFF' },
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
                filterType === FilterType.ALL && { color: '#fff' },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              hapticSelection();
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
              filterType === FilterType.DIFFICULTY && { backgroundColor: '#007AFF' },
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
                filterType === FilterType.DIFFICULTY && { color: '#fff' },
              ]}
            >
              Difficulty
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              hapticSelection();
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
              filterType === FilterType.CATEGORY && { backgroundColor: '#007AFF' },
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
                filterType === FilterType.CATEGORY && { color: '#fff' },
              ]}
            >
              Category
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              hapticSelection();
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
              filterType === FilterType.SIZE && { backgroundColor: '#007AFF' },
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
                filterType === FilterType.SIZE && { color: '#fff' },
              ]}
            >
              Size
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Filter Options */}
        {filterType !== FilterType.ALL && (
          <Animated.View
            style={[
              {
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: '#e9ecef',
                paddingVertical: 8,
              },
              animatedFilterTabsStyle,
            ]}
          >
            {renderFilterOptions()}
          </Animated.View>
        )}

        {/* Puzzles List */}
        <Animated.View style={[{ flex: 1 }, animatedListStyle]}>
          <FlatList
            data={filteredPuzzles}
            keyExtractor={item => item.id}
            renderItem={renderPuzzleItem}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: '#666',
                    fontWeight: '500',
                    fontFamily: 'Kenney-Future',
                  }}
                >
                  Choose a puzzle to solve
                </Text>
              </View>
            }
          />
        </Animated.View>

        {/* Footer Info */}
        <Animated.View
          style={[
            {
              padding: 16,
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e9ecef',
              alignItems: 'center',
            },
            animatedListStyle,
          ]}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#666',
              fontFamily: 'Kenney-Future',
            }}
          >
            {filteredPuzzles.length} puzzle{filteredPuzzles.length !== 1 ? 's' : ''} available
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default MenuScreen;
