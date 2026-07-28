interface PricingItem {
  type: string;
  price: number;
  offerPrice?: number;
}

export const getAstrologerPrice = (astrologer: any, type: 'CHAT' | 'CALL') => {
  if (!astrologer) {
    return {
      currentPrice: 0,
      oldPrice: undefined,
    };
  }

  const pricingItem = astrologer?.pricing?.find(
    (p: PricingItem) => p?.type?.toUpperCase() === type,
  );

  // Active Offer has highest priority
  if (astrologer?.activeOffer?.price) {
    return {
      currentPrice: astrologer.activeOffer.price,
      oldPrice: pricingItem?.offerPrice || pricingItem?.price,
    };
  }

  return {
    currentPrice: pricingItem?.offerPrice || pricingItem?.price || 0,

    oldPrice: pricingItem?.offerPrice ? pricingItem?.price : undefined,
  };
};
