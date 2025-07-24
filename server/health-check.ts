// Production Health Check System
import { storage } from "./storage";

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: boolean;
    storage: boolean;
    stripe: boolean;
    email: boolean;
  };
  details: Record<string, any>;
}

export async function performHealthCheck(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  const checks = {
    database: false,
    storage: false,
    stripe: false,
    email: false
  };
  const details: Record<string, any> = {};

  try {
    // Test storage operations
    const services = await storage.getServices();
    checks.storage = Array.isArray(services);
    details.servicesCount = services.length;
  } catch (error) {
    details.storageError = (error as Error).message;
  }

  try {
    // Test Stripe configuration
    checks.stripe = !!process.env.STRIPE_SECRET_KEY;
    details.stripeConfigured = checks.stripe;
  } catch (error) {
    details.stripeError = (error as Error).message;
  }

  try {
    // Test email configuration
    checks.email = !!process.env.RESEND_API_KEY;
    details.emailConfigured = checks.email;
  } catch (error) {
    details.emailError = (error as Error).message;
  }

  // Test database connection
  try {
    const currentIndustry = storage.getCurrentIndustry();
    checks.database = !!currentIndustry;
    details.currentIndustry = currentIndustry?.name;
  } catch (error) {
    details.databaseError = (error as Error).message;
  }

  // Determine overall status
  const healthyCount = Object.values(checks).filter(Boolean).length;
  let status: 'healthy' | 'degraded' | 'unhealthy';
  
  if (healthyCount === 4) {
    status = 'healthy';
  } else if (healthyCount >= 2) {
    status = 'degraded';
  } else {
    status = 'unhealthy';
  }

  return {
    status,
    timestamp,
    checks,
    details
  };
}

export function getSystemInfo() {
  return {
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    platform: process.platform,
    timestamp: new Date().toISOString()
  };
}