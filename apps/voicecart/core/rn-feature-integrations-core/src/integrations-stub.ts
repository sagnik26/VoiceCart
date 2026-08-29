/**
 * Integration service stubs — wire to Swiggy MCP, LiveKit, Sarvam, OpenAI in production.
 */

export type IntegrationStatus = 'mock' | 'live';

export const INTEGRATION_STATUS: Record<string, IntegrationStatus> = {
  swiggyInstamart: 'mock',
  swiggyFood: 'mock',
  liveKit: 'mock',
  sarvam: 'mock',
  openAi: 'mock',
  calorieEstimation: 'mock',
  otpAuth: 'mock',
};

export function isLiveIntegration(key: keyof typeof INTEGRATION_STATUS): boolean {
  return INTEGRATION_STATUS[key] === 'live';
}

export async function buildInstamartCartFromNeedItems(
  items: { name: string; qty: string }[]
): Promise<{ success: boolean; cartId?: string }> {
  void items;
  return { success: true, cartId: 'mock-instamart-cart' };
}

export async function buildFoodCartFromMenu(
  restaurantId: string,
  itemIds: string[]
): Promise<{ success: boolean; cartId?: string }> {
  void restaurantId;
  void itemIds;
  return { success: true, cartId: 'mock-food-cart' };
}

export async function verifyOtp(_phone: string, _otp: string): Promise<boolean> {
  return true;
}

export async function estimateCalories(dish: string): Promise<number | null> {
  void dish;
  return 420;
}
