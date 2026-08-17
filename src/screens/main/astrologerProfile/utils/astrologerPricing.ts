interface PricingItem {
  type: string;
  price: number;
  offerPrice?: number;
}

export const getAstrologerPrice = (
  astrologer: any,
  type: 'CHAT' | 'CALL' | 'VIDEO' | 'AUDIO',
) => {
  if (!astrologer) {
    return {
      currentPrice: 0,
      oldPrice: undefined,
    };
  }

  const pricingItem = astrologer?.pricing?.find(
    (p: PricingItem) => p?.type?.toUpperCase() === type,
  );

  const currentPrice = pricingItem?.price || 0;
  const oldPrice = pricingItem?.offerPrice;

  return {
    currentPrice,
    oldPrice:
      oldPrice && oldPrice !== currentPrice ? oldPrice : undefined,
  };
};
