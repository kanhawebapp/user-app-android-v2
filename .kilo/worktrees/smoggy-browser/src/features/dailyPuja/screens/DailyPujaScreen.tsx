import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Animated, Text, StatusBar} from 'react-native';

import TempleBackground from '../components/TempleBackground';
import PujaItems from '../components/pujaItems/PujaItems';
import BellChain from '../components/bellchain/BellChain';
import Icon from '../../../components/Icon/Icon';
import GodSelectorModal from '../components/godSelectorModal/GodSelectorModal';
import ItemSelectorModal from '../components/itemselectorModal/ItemSelectorModal';
import HeaderSelectorModal from '../components/headerSelectorModal/HeaderSelectorModal';
import PujaThali from '../components/pujaThali/PujaThali';
import SpecialPujaItems from '../components/specialPujaItem/SpecialPujaItems';
import {useDailyPuja} from '../hooks';
import {POOJA_ITEM_OPTIONS} from '../helpers/pujaItemHelpers';
import {dailyPujaScreenStyles} from './dailyPujaScreenStyles';
import {DailyPujaScreenProps} from './dailyPujaScreenTypes';
import FlowerRain from '../components/flowerRain/FlowerRain';
import GodSelector from '../components/godSelector/GodSelector';
import TempleDoor from '../components/TempleDoor';
import TopHeader from '../components/topheader/TopHeader';

const DailyPujaScreen: React.FC<DailyPujaScreenProps> = ({onNavigateBack}) => {
  // Use the custom hook for all state and logic
  const {
    // State
    selectedGod,
    isFlowerRainActive,
    isPujaStarted,
    isPujaComplete,
    showSpecialItems,
    activeSpecialItem,
    showThali,
    selectedItems,

    // Animation refs
    startButtonScaleAnim,
    startButtonGlowAnim,

    // Modal states
    isGodSelectorVisible,
    isItemSelectorVisible,
    selectedItemId,

    // Header selector state
    selectedHeaderImage,
    isHeaderSelectorVisible,
    headerImageOptions,

    // Computed
    preparedGods,
    hasItems,

    // Handlers
    handleFlowerPress,
    handleGodSelect,
    handleOpenGodSelector,
    handleCloseGodSelector,
    handleSelectGodFromModal,
    handleItemPress,
    handleCloseItemSelector,
    handleSelectItemOption,
    handleStartPuja,
    handleSpecialItemPress,
    handleCompletePuja,
    handleResetPuja,
    handleToggleThali,
    handleOpenHeaderSelector,
    handleCloseHeaderSelector,
    handleSelectHeaderImage,
    //door
    doorOpen,
    setDoorOpen,
    handleBack,
  } = useDailyPuja();

  // Interpolate glow animation values
  const glowOpacity = startButtonGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = startButtonGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <View style={dailyPujaScreenStyles.container}>
      {/* <StatusBar backgroundColor="transparent" barStyle="light-content" /> */}
      <TopHeader
        onBack={onNavigateBack}
        headerImage={selectedHeaderImage.image}
        onSettingsPress={handleOpenHeaderSelector}
        setDoorOpen={setDoorOpen}
        completePuja={handleBack}
      />
      {/* door */}
      <View style={{zIndex: 999, marginTop: 210}}>
        <TempleDoor isOpen={doorOpen} />
      </View>

      {/* Temple Background */}
      <TempleBackground
        backgroundImage={selectedGod.background}
        lordImage={selectedGod.image}
        animationTrigger={0}
      />
      {/* <TempleDoor isOpen={true} /> */}

      {/* Flower Rain Effect */}
      <FlowerRain isActive={isFlowerRainActive} />

      {/* God Selector - hidden when puja is started */}
      {!isPujaStarted && (
        <GodSelector
          gods={preparedGods}
          onSelect={handleGodSelect}
          selectedId={selectedGod.id}
          onOpenGodSelector={handleOpenGodSelector}
        />
      )}

      {/* Bell Chain Animation */}
      <BellChain />

      {/* Special Puja Items - visible after puja starts */}
      {showThali && isPujaStarted && (
        <SpecialPujaItems
          onItemPress={handleSpecialItemPress}
          activeItemId={activeSpecialItem}
          onPressFlower={handleFlowerPress}
        />
      )}

      {/* Puja Thali - only visible after puja is started */}
      {isPujaStarted && (
        <PujaThali
          selectedItems={selectedItems}
          onItemPress={handleItemPress}
        />
      )}

      {/* Puja Items selection - only visible before puja starts */}
      {!isPujaStarted && (
        <PujaItems
          onItemPress={handleItemPress}
          onFlowerPress={handleFlowerPress}
          selectedItems={selectedItems}
        />
      )}

      {/* Toggle Button - only visible when puja is started */}
      {isPujaStarted && (
        <TouchableOpacity
          style={dailyPujaScreenStyles.toggleButton}
          onPress={handleToggleThali}
          activeOpacity={0.8}>
          <Icon
            name="view-grid"
            size={24}
            color="#FFF"
            library="MaterialCommunityIcons"
          />
        </TouchableOpacity>
      )}

      {/* Complete Puja Button - only visible during puja */}
      {isPujaStarted && (
        <TouchableOpacity
          style={dailyPujaScreenStyles.completePujaButton}
          onPress={handleCompletePuja}
          activeOpacity={0.8}>
          <Icon
            name="check-circle"
            size={28}
            color="#FFF"
            library="MaterialCommunityIcons"
          />
          <Text style={dailyPujaScreenStyles.completePujaButtonText}>
            Complete Puja
          </Text>
          <Text style={dailyPujaScreenStyles.completePujaButtonTextHindi}>
            पूजा समाप्त
          </Text>
        </TouchableOpacity>
      )}

      {/* Reset Button - visible when puja is complete */}
      {isPujaComplete && !isPujaStarted && (
        <View style={dailyPujaScreenStyles.resetButtonContainer}>
          <TouchableOpacity
            style={dailyPujaScreenStyles.resetButton}
            onPress={handleResetPuja}
            activeOpacity={0.8}>
            <Icon
              name="refresh"
              size={32}
              color="#FFF"
              library="MaterialCommunityIcons"
            />
            <Text style={dailyPujaScreenStyles.resetButtonText}>
              Start New Puja
            </Text>
            <Text style={dailyPujaScreenStyles.resetButtonTextHindi}>
              नई पूजा शुरू करें
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Start Puja Button - only visible when items are selected and puja not started */}
      {!isPujaStarted && hasItems && !isPujaComplete && (
        <View style={dailyPujaScreenStyles.startButtonContainer}>
          <Animated.View
            style={[
              dailyPujaScreenStyles.startButtonGlow,
              {
                opacity: glowOpacity,
                transform: [{scale: glowScale}],
              },
            ]}
          />
          <Animated.View
            style={{
              transform: [{scale: startButtonScaleAnim}],
            }}>
            <TouchableOpacity
              onPress={handleStartPuja}
              style={[
                dailyPujaScreenStyles.startButton,
                isPujaStarted && dailyPujaScreenStyles.startButtonActive,
              ]}
              activeOpacity={0.8}>
              <Icon
                name={isPujaStarted ? 'check-circle' : 'play-circle'}
                size={40}
                color="#FFF"
                library="MaterialCommunityIcons"
              />
              <Text style={dailyPujaScreenStyles.startButtonText}>
                {isPujaStarted ? 'Puja Started' : 'Start Puja'}
              </Text>
              <Text style={dailyPujaScreenStyles.startButtonSubText}>
                {isPujaStarted ? 'जय श्री कृष्ण' : 'आरंभ करें'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* God Selector Modal */}
      <GodSelectorModal
        visible={isGodSelectorVisible}
        onClose={handleCloseGodSelector}
        gods={preparedGods}
        selectedGod={selectedGod}
        onSelect={handleSelectGodFromModal}
      />

      {/* Item Selector Modal */}
      <ItemSelectorModal
        visible={isItemSelectorVisible}
        onClose={handleCloseItemSelector}
        item={
          selectedItemId
            ? {
                id: selectedItemId,
                name:
                  POOJA_ITEM_OPTIONS[selectedItemId]?.[0]?.name ||
                  selectedItemId,
                nameHindi: '',
                iconName: '',
                color: '#000',
                options: POOJA_ITEM_OPTIONS[selectedItemId],
              }
            : null
        }
        selectedOption={
          selectedItemId ? selectedItems[selectedItemId] : undefined
        }
        onSelect={handleSelectItemOption}
      />

      {/* Header Selector Modal */}
      <HeaderSelectorModal
        visible={isHeaderSelectorVisible}
        onClose={handleCloseHeaderSelector}
        options={headerImageOptions}
        selectedOption={selectedHeaderImage}
        onSelect={handleSelectHeaderImage}
      />
    </View>
  );
};

export default DailyPujaScreen;
