export type DietPreference = 'Veg' | 'Non-veg' | 'Eggetarian' | 'Vegan';

export type OnboardingState = {
  isOnboarded: boolean;
  phone?: string;
  address?: string;
  swiggyLinked: boolean;
  diet: DietPreference;
  staples: string[];
};

let onboardingState: OnboardingState = {
  isOnboarded: true,
  swiggyLinked: false,
  diet: 'Veg',
  staples: ['Salt', 'Oil', 'Onion'],
};

export function getOnboardingState(): OnboardingState {
  return { ...onboardingState, staples: [...onboardingState.staples] };
}

export function isOnboarded(): boolean {
  return onboardingState.isOnboarded;
}

export function completeLogin(phone: string): void {
  onboardingState = { ...onboardingState, phone };
}

export function completeAddressSetup(address: string, swiggyLinked: boolean): void {
  onboardingState = { ...onboardingState, address, swiggyLinked };
}

export function completePantrySetup(diet: DietPreference, staples: string[]): void {
  onboardingState = {
    ...onboardingState,
    diet,
    staples: [...staples],
    isOnboarded: true,
  };
}

export function skipOnboarding(): void {
  onboardingState = { ...onboardingState, isOnboarded: true };
}

export function resetOnboardingForDev(): void {
  onboardingState = {
    isOnboarded: false,
    swiggyLinked: false,
    diet: 'Veg',
    staples: [],
  };
}

export const DIET_OPTIONS: DietPreference[] = ['Veg', 'Non-veg', 'Eggetarian', 'Vegan'];

export const SETUP_STAPLE_OPTIONS = [
  'Salt',
  'Oil',
  'Onion',
  'Garlic',
  'Rice',
  'Atta',
  'Turmeric',
] as const;
