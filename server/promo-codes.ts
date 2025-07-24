// Beta Testing Promo Code System - Simple Implementation
export interface PromoCode {
  code: string;
  description: string;
  freeMonths: number;
  maxUses: number;
  currentUses: number;
  active: boolean;
  validUntil: Date;
}

export interface PromoCodeUsage {
  code: string;
  userEmail: string;
  userName: string;
  usedAt: Date;
}

// In-memory storage for promo codes
let promoCodes: PromoCode[] = [
  {
    code: 'BETA3MONTHS',
    description: 'Beta Tester - 3 Months Free Access',
    freeMonths: 3,
    maxUses: 100,
    currentUses: 0,
    active: true,
    validUntil: new Date('2025-12-31')
  },
  {
    code: 'EARLYACCESS',
    description: 'Early Access Program - 3 Months Free',
    freeMonths: 3,
    maxUses: 50,
    currentUses: 0,
    active: true,
    validUntil: new Date('2025-10-31')
  }
];

let promoCodeUsages: PromoCodeUsage[] = [];

export class PromoCodeService {
  static validatePromoCode(code: string): { valid: boolean; promoCode?: PromoCode; error?: string } {
    const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    
    if (!promo) {
      return { valid: false, error: 'Invalid promo code' };
    }
    
    if (!promo.active) {
      return { valid: false, error: 'This promo code is no longer active' };
    }
    
    if (new Date() > promo.validUntil) {
      return { valid: false, error: 'This promo code has expired' };
    }
    
    if (promo.currentUses >= promo.maxUses) {
      return { valid: false, error: 'This promo code has reached its usage limit' };
    }
    
    return { valid: true, promoCode: promo };
  }
  
  static usePromoCode(code: string, userEmail: string, userName: string): boolean {
    const validation = this.validatePromoCode(code);
    
    if (!validation.valid || !validation.promoCode) {
      return false;
    }
    
    // Check if user already used this code
    const alreadyUsed = promoCodeUsages.find(
      usage => usage.code.toUpperCase() === code.toUpperCase() && 
               usage.userEmail.toLowerCase() === userEmail.toLowerCase()
    );
    
    if (alreadyUsed) {
      return false;
    }
    
    // Use the promo code
    validation.promoCode.currentUses++;
    promoCodeUsages.push({
      code: code.toUpperCase(),
      userEmail,
      userName,
      usedAt: new Date()
    });
    
    return true;
  }
  
  static getPromoCodeUsage(code: string): PromoCodeUsage[] {
    return promoCodeUsages.filter(usage => usage.code.toUpperCase() === code.toUpperCase());
  }
  
  static getAllPromoCodes(): PromoCode[] {
    return promoCodes;
  }
  
  static addPromoCode(promoCode: Omit<PromoCode, 'currentUses'>): void {
    promoCodes.push({
      ...promoCode,
      currentUses: 0
    });
  }
}