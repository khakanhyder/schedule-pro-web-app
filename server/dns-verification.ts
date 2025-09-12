import { promisify } from "util";
import { resolve as dnsResolve } from "dns";

const resolveTxt = promisify(dnsResolve);

export interface DNSVerificationResult {
  success: boolean;
  errorMessage?: string;
  verificationData: {
    expected: string;
    found: string[] | null;
    recordName: string;
  };
  responseTime: number;
}

export class DNSVerificationService {
  /**
   * Verify domain ownership via DNS TXT record
   */
  async verifyDomainViaDNS(domain: string, expectedToken: string): Promise<DNSVerificationResult> {
    const startTime = Date.now();
    const recordName = `_scheduled-verification.${domain}`;
    
    try {
      // Look up TXT records for the verification subdomain
      const txtRecords = await resolveTxt(recordName, 'TXT') as string[][];
      const responseTime = Date.now() - startTime;
      
      // Flatten the TXT record arrays and check for our token
      const flatRecords = txtRecords.flat();
      const foundToken = flatRecords.find(record => record.includes(expectedToken));
      
      if (foundToken) {
        return {
          success: true,
          verificationData: {
            expected: expectedToken,
            found: flatRecords,
            recordName
          },
          responseTime
        };
      } else {
        return {
          success: false,
          errorMessage: `Verification token not found in DNS TXT records. Expected: ${expectedToken}`,
          verificationData: {
            expected: expectedToken,
            found: flatRecords.length > 0 ? flatRecords : null,
            recordName
          },
          responseTime
        };
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      // Handle specific DNS errors
      let errorMessage = "DNS lookup failed";
      if (error.code === 'ENOTFOUND') {
        errorMessage = `DNS TXT record not found for ${recordName}`;
      } else if (error.code === 'ENODATA') {
        errorMessage = `No TXT records found for ${recordName}`;
      } else if (error.code === 'ETIMEOUT') {
        errorMessage = `DNS lookup timeout for ${recordName}`;
      } else {
        errorMessage = `DNS error: ${error.message}`;
      }
      
      return {
        success: false,
        errorMessage,
        verificationData: {
          expected: expectedToken,
          found: null,
          recordName
        },
        responseTime
      };
    }
  }

  /**
   * Verify domain ownership via CNAME record
   */
  async verifyDomainViaCNAME(domain: string, expectedTarget: string): Promise<DNSVerificationResult> {
    const startTime = Date.now();
    
    try {
      const cnameRecords = await resolveTxt(domain) as string[];
      const responseTime = Date.now() - startTime;
      
      const foundRecord = cnameRecords.find(record => record === expectedTarget);
      
      if (foundRecord) {
        return {
          success: true,
          verificationData: {
            expected: expectedTarget,
            found: cnameRecords,
            recordName: domain
          },
          responseTime
        };
      } else {
        return {
          success: false,
          errorMessage: `CNAME record does not match expected target: ${expectedTarget}`,
          verificationData: {
            expected: expectedTarget,
            found: cnameRecords.length > 0 ? cnameRecords : null,
            recordName: domain
          },
          responseTime
        };
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        success: false,
        errorMessage: `CNAME lookup failed: ${error.message}`,
        verificationData: {
          expected: expectedTarget,
          found: null,
          recordName: domain
        },
        responseTime
      };
    }
  }

  /**
   * Check if domain resolves to any IP (basic connectivity test)
   */
  async checkDomainConnectivity(domain: string): Promise<{ success: boolean; errorMessage?: string; responseTime: number }> {
    const startTime = Date.now();
    
    try {
      const addresses = await resolveTxt(domain);
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        success: false,
        errorMessage: `Domain connectivity check failed: ${error.message}`,
        responseTime
      };
    }
  }
}

export const dnsVerificationService = new DNSVerificationService();