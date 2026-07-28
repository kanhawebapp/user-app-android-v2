import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {HeroBannerProps, HeroBannerData} from './type';
import {useTheme} from '../../../../../theme';
import {styles, ITEM_WIDTH} from './styles';
import {images} from '../../../../../assets/images';

const DEFAULT_BANNER_IMAGE = images.Banner1;

const DEFAULT_BANNER_IMAGES = [images.Banner1, images.Banner2, images.Banner3];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  data = [],
  onCtaPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const scrollViewRef = useRef<ScrollView>(null);
  // const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(
    data.length > 1 || DEFAULT_BANNER_IMAGES.length > 1 ? 1 : 0,
  );

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const isScrolling = useRef(false);

  // Create infinite scroll data: [last, ...original, first]
  const infiniteBanners = useMemo(() => {
    const baseData =
      data.length > 0
        ? data
        : [
            {id: '1', title: '', imageUrl: DEFAULT_BANNER_IMAGES[0]},
            {id: '2', title: '', imageUrl: DEFAULT_BANNER_IMAGES[1]},
            {id: '3', title: '', imageUrl: DEFAULT_BANNER_IMAGES[2]},
          ];

    if (baseData.length <= 1) {
      return baseData;
    }

    const first = baseData[0];
    const last = baseData[baseData.length - 1];

    return [
      {...last, id: `clone-${last.id}`, isClone: true},
      ...baseData,
      {...first, id: `clone-${first.id}-first`, isClone: true},
    ];
  }, [data]);

  const originalLength = useMemo(() => {
    const baseData = data.length > 0 ? data : DEFAULT_BANNER_IMAGES;
    return baseData.length;
  }, [data]);

  // Initial scroll to position 1 (first real item)
  useEffect(() => {
    if (infiniteBanners.length > 1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: ITEM_WIDTH,
          animated: false,
        });
      }, 100);
    }
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (infiniteBanners.length <= 1 || !isAutoScrolling) {
      return;
    }

    const interval = setInterval(() => {
      if (!isScrolling.current) {
        setActiveIndex(prevIndex => {
          const lastIndex = infiniteBanners.length - 1;
          let nextIndex = prevIndex + 1;

          // If we've reached the last clone, jump back to first real item
          if (nextIndex >= lastIndex) {
            scrollViewRef.current?.scrollTo({
              x: ITEM_WIDTH,
              animated: false,
            });
            return 1;
          }

          scrollViewRef.current?.scrollTo({
            x: nextIndex * ITEM_WIDTH,
            animated: true,
          });
          return nextIndex;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [infiniteBanners.length, isAutoScrolling]);

  const handleScrollBeginDrag = useCallback(() => {
    isScrolling.current = true;
    setIsAutoScrolling(false);
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    isScrolling.current = false;
    setIsAutoScrolling(true);
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const currentIndex = Math.round(offsetX / ITEM_WIDTH);
      const lastIndex = infiniteBanners.length - 1;

      // If scrolled to the last clone, jump to first real item (index 1)
      if (currentIndex === lastIndex) {
        scrollViewRef.current?.scrollTo({
          x: ITEM_WIDTH,
          animated: false,
        });
        setActiveIndex(1);
        return;
      }

      // If scrolled to the first clone (index 0), jump to last real item
      if (currentIndex === 0) {
        scrollViewRef.current?.scrollTo({
          x: ITEM_WIDTH * (lastIndex - 1),
          animated: false,
        });
        setActiveIndex(lastIndex - 1);
        return;
      }

      // Reset if currentIndex goes beyond bounds (fallback safety check)
      if (currentIndex >= lastIndex || currentIndex < 0) {
        scrollViewRef.current?.scrollTo({
          x: ITEM_WIDTH,
          animated: false,
        });
        setActiveIndex(1);
        return;
      }

      setActiveIndex(currentIndex);
    },
    [infiniteBanners.length],
  );

  const renderPagination = () => {
    const realIndex =
      activeIndex === 0
        ? originalLength - 1
        : activeIndex === infiniteBanners.length - 1
        ? 0
        : (activeIndex - 1) % originalLength;

    return (
      <View style={styles.paginationContainer}>
        {Array.from({length: originalLength}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  index === realIndex
                    ? colors.primary.main
                    : colors.common.gray[300],
                width: index === realIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        bounces={false}
        contentContainerStyle={{width: ITEM_WIDTH * infiniteBanners.length}}>
        {infiniteBanners.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.slideContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onCtaPress?.(item.ctaAction)}
              style={styles.slideTouchable}>
              <ImageBackground
                source={item.imageUrl || DEFAULT_BANNER_IMAGE}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {originalLength > 1 && renderPagination()}
    </View>
  );
};

export default HeroBanner;
