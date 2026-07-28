// import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
// import {
//   FlatList,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
// } from 'react-native';
// import { HeroBannerData, ExtendedHeroBannerData } from '../type';
// import { ITEM_WIDTH } from '../styles';
// import { images } from '../../../../../../assets/images';

// // Default banner images fallback when API doesn't return data
// const DEFAULT_BANNER_IMAGES = [images.Banner1, images.Banner2, images.Banner3];

// export const useHeroBanner = (data: HeroBannerData[]) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const flatListRef = useRef<FlatList>(null);
//   const isManualScrolling = useRef(false);

//   // Memoize and triple the data for infinite scroll simulation
//   // const banners = useMemo(() => {
//   //   const baseData =
//   //     data.length > 0
//   //       ? data
//   //       : [
//   //           {
//   //             id: '1',
//   //             // title: 'Welcome to Dhwani Astro',
//   //             // subtitle: 'Your spiritual journey starts here',
//   //             // ctaText: 'Explore Now',
//   //             // ctaAction: 'explore',
//   //             imageUrl: DEFAULT_BANNER_IMAGES[0],
//   //           } as HeroBannerData,
//   //           {
//   //             id: '2',
//   //             // title: 'Consult Expert Astrologers',
//   //             // subtitle: 'Get accurate predictions for your future',
//   //             // ctaText: 'Chat Now',
//   //             // ctaAction: 'chat',
//   //             imageUrl: DEFAULT_BANNER_IMAGES[1],
//   //           } as HeroBannerData,
//   //           {
//   //             id: '3',
//   //             // title: 'Live Sessions',
//   //             // subtitle: 'Join interactive sessions with top astrologers',
//   //             // ctaText: 'Join Live',
//   //             // ctaAction: 'live',
//   //             imageUrl: DEFAULT_BANNER_IMAGES[2],
//   //           } as HeroBannerData,
//   //         ];

//   //   const tripled: ExtendedHeroBannerData[] = [];

//   //   for (let i = 0; i < 3; i++) {
//   //     baseData.forEach((item, index) => {
//   //       tripled.push({
//   //         ...item,
//   //         id: `${item.id}-copy-${i}`,
//   //         originalIndex: index,
//   //       });
//   //     });
//   //   }

//   //   return tripled;
//   // }, [data]);

//   const banners = useMemo(() => {
//     const baseData =
//       data.length > 0
//         ? data
//         : [
//             { id: '1', imageUrl: DEFAULT_BANNER_IMAGES[0] },
//             { id: '2', imageUrl: DEFAULT_BANNER_IMAGES[1] },
//             { id: '3', imageUrl: DEFAULT_BANNER_IMAGES[2] },
//           ];

//     if (baseData.length <= 1) return baseData;

//     const first = baseData[0];
//     const last = baseData[baseData.length - 1];

//     return [
//       { ...last, id: `${last.id}-clone-last` },
//       ...baseData,
//       { ...first, id: `${first.id}-clone-first` },
//     ];
//   }, [data]);

//   // Handle manual scroll momentum end to check for infinite loop jumps
//   // const handleMomentumScrollEnd = useCallback(
//   //   (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//   //     const x = event.nativeEvent.contentOffset.x;
//   //     const index = Math.round(x / ITEM_WIDTH);

//   //     const baseLength = banners.length / 3;

//   //     // If reached near start -> jump to middle copy
//   //     if (index < baseLength) {
//   //       flatListRef.current?.scrollToIndex({
//   //         index: index + baseLength,
//   //         animated: false,
//   //       });
//   //       setActiveIndex(index + baseLength);
//   //       return;
//   //     }

//   //     // If reached near end -> jump back to middle copy
//   //     if (index >= baseLength * 2) {
//   //       flatListRef.current?.scrollToIndex({
//   //         index: index - baseLength,
//   //         animated: false,
//   //       });
//   //       setActiveIndex(index - baseLength);
//   //       return;
//   //     }

//   //     setActiveIndex(index);
//   //   },
//   //   [banners.length],
//   // );

//   const handleMomentumScrollEnd = useCallback(
//     (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//       const x = event.nativeEvent.contentOffset.x;
//       const index = Math.round(x / ITEM_WIDTH);

//       const lastIndex = banners.length - 1;

//       // If reached fake last → jump to real first
//       if (index === lastIndex) {å
//         flatListRef.current?.scrollToIndex({
//           index: 1,
//           animated: false,
//         });
//         setActiveIndex(1);
//         return;
//       }

//       // If reached fake first → jump to real last
//       if (index === 0) {
//         flatListRef.current?.scrollToIndex({
//           index: lastIndex - 1,
//           animated: false,
//         });
//         setActiveIndex(lastIndex - 1);
//         return;
//       }

//       setActiveIndex(index);
//     },
//     [banners.length],
//   );

//   const handleScrollBeginDrag = useCallback(() => {
//     isManualScrolling.current = true;
//   }, []);

//   const handleScrollEndDrag = useCallback(() => {
//     isManualScrolling.current = false;
//   }, []);

//   const handleScrollToIndexFailed = useCallback(
//     (info: {
//       index: number;
//       highestMeasuredFrameIndex: number;
//       averageItemLength: number;
//     }) => {
//       const wait = new Promise((resolve: any) => setTimeout(resolve, 500));
//       wait.then(() => {
//         flatListRef.current?.scrollToIndex({
//           index: info.index,
//           animated: true,
//         });
//       });
//     },
//     [],
//   );

//   // Initial scroll to middle set
//   // useEffect(() => {
//   //   if (banners.length > 0) {
//   //     const middleIndex = Math.floor(banners.length / 3);
//   //     // Small timeout ensures list is ready
//   //     setTimeout(() => {
//   //       flatListRef.current?.scrollToIndex({
//   //         index: middleIndex,
//   //         animated: false,
//   //       });
//   //       setActiveIndex(middleIndex);
//   //     }, 0);
//   //   }
//   // }, [banners.length]);
//   useEffect(() => {
//     if (banners.length > 1) {
//       setTimeout(() => {
//         flatListRef.current?.scrollToIndex({
//           index: 1,
//           animated: false,
//         });
//         setActiveIndex(1);
//       }, 0);
//     }
//   }, [banners.length]);

//   // Auto-scroll logic triggered by activeIndex change
//   useEffect(() => {
//     if (banners.length <= 1) return;

//     const timer = setTimeout(() => {
//       if (!isManualScrolling.current) {
//         const nextIndex = activeIndex + 1;

//         // Ensure we don't scroll past array bounds even if logic suggests it (safety check)
//         if (nextIndex < banners.length) {
//           flatListRef.current?.scrollToIndex({
//             index: nextIndex,
//             animated: true,
//           });
//         }
//       }
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [activeIndex, banners.length]);

//   const getItemLayout = useCallback(
//     (_: any, index: number) => ({
//       length: ITEM_WIDTH,
//       offset: ITEM_WIDTH * index,
//       index,
//     }),
//     [],
//   );

//   return {
//     banners,
//     activeIndex,
//     flatListRef,
//     getItemLayout,
//     handleMomentumScrollEnd,
//     handleScrollBeginDrag,
//     handleScrollEndDrag,
//     handleScrollToIndexFailed,
//   };
// };

import {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {FlatList, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {HeroBannerData} from '../type';
import {ITEM_WIDTH} from '../styles';
import {images} from '../../../../../../assets/images';

const DEFAULT_BANNER_IMAGES = [images.Banner1, images.Banner2, images.Banner3];

export const useHeroBanner = (data: HeroBannerData[]) => {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const isManualScrolling = useRef(false);

  const banners = useMemo(() => {
    const baseData =
      data.length > 0
        ? data
        : [
            {id: '1', imageUrl: DEFAULT_BANNER_IMAGES[0]},
            {id: '2', imageUrl: DEFAULT_BANNER_IMAGES[1]},
            {id: '3', imageUrl: DEFAULT_BANNER_IMAGES[2]},
          ];

    if (baseData.length <= 1) {
      return baseData;
    }

    const first = baseData[0];
    const last = baseData[baseData.length - 1];

    return [
      {...last, id: `${last.id}-clone-last`},
      ...baseData,
      {...first, id: `${first.id}-clone-first`},
    ];
  }, [data]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / ITEM_WIDTH);

      const lastIndex = banners.length - 1;

      // reached fake last
      if (index === lastIndex) {
        flatListRef.current?.scrollToOffset({
          offset: ITEM_WIDTH,
          animated: false,
        });
        setActiveIndex(1);
        return;
      }

      // reached fake first
      if (index === 0) {
        flatListRef.current?.scrollToOffset({
          offset: ITEM_WIDTH * (lastIndex - 1),
          animated: false,
        });
        setActiveIndex(lastIndex - 1);
        return;
      }

      setActiveIndex(index);
    },
    [banners.length],
  );

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      if (!isManualScrolling.current) {
        const nextIndex = activeIndex + 1;
        const lastIndex = banners.length - 1;

        // If we're at the fake first (last item in array), silently jump to real first
        // without animation to create smooth infinite scroll effect
        if (nextIndex > lastIndex) {
          flatListRef.current?.scrollToOffset({
            offset: ITEM_WIDTH,
            animated: false,
          });
          setActiveIndex(1);
          return;
        }

        flatListRef.current?.scrollToOffset({
          offset: ITEM_WIDTH * nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [activeIndex, banners.length]);

  const handleScrollBeginDrag = () => {
    isManualScrolling.current = true;
  };

  const handleScrollEndDrag = () => {
    isManualScrolling.current = false;
  };

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  return {
    banners,
    activeIndex,
    flatListRef,
    handleMomentumScrollEnd,
    handleScrollBeginDrag,
    handleScrollEndDrag,
    getItemLayout,
  };
};
