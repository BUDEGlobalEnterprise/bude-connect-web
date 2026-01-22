/**
 * E2E Test: Complete Profile Form
 * Tests: Login -> Profile form fill and save
 */

import { test, expect } from '@playwright/test';

// Test data based on Aravind's profile
const TEST_PROFILE = {
  // Basic Info
  email: 'ara', // Using default admin for testing if possible, or a real user
  password: 'admin',      // Default Frappe password usually
  firstName: 'Aravind',
  middleName: 'Kumar',
  lastName: 'Govindhasamy',
  fullName: 'Aravind Kumar Govindhasamy',
  language: 'English (United Kingdom)',
  timezone: 'Asia/Kolkata',
  country: 'India',
  openTo: 'Freelance projects, Consulting, Full-time opportunities',
  
  // More Information
  gender: 'Male',
  birthDate: '1995-06-15',
  phone: '+91 98765 43210',
  location: 'Chennai, Tamil Nadu, India',
  profession: 'Senior Full Stack Developer',
  interests: 'Web Development, Cloud Architecture, AI/ML, Open Source',
  bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications.',
  
  // Career Preferences
  preferredFunctions: 'Engineering, Product Development',
  preferredIndustries: 'Technology, SaaS, Fintech',
};

test.describe('Complete Profile Form Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Go to Profile Page directly
    await page.goto('/profile/complete');
    
    // 2. Perform Login only if we are redirected to login page
    if (page.url().includes('/login')) {
      const emailInput = page.locator('input[placeholder="you@example.com"]');
      const passwordInput = page.locator('input[placeholder="••••••••"]');
      
      if (await emailInput.isVisible({ timeout: 10000 }).catch(() => false)) {
        await emailInput.fill('aravindapg06@gmail.com');
        await passwordInput.fill('aj2p4.gjkjU2P5n');
        await page.click('button:has-text("Sign In")');
        
        // Wait for redirect back to profile page or some other page
        await page.waitForURL(url => !url.href.includes('/login'), { timeout: 30000 });
        await page.goto('/profile/complete'); // Ensure we are on the right page
      }
    }
    
    // Wait for the form title to be visible as a proxy for page load
    await page.waitForSelector('text=Complete Freelancer Profile', { timeout: 30000 });
  });

  test('should load profile form and display all tabs', async ({ page }) => {
    await page.goto('/profile/complete');
    
    // Wait for form to load
    await page.waitForSelector('text=Complete Freelancer Profile', { timeout: 15000 });
    
    // Verify all tabs are present
    await expect(page.locator('button:has-text("User Details")')).toBeVisible();
    await expect(page.locator('button:has-text("More Information")')).toBeVisible();
    await expect(page.locator('button:has-text("Education & Experience")')).toBeVisible();
    await expect(page.locator('button:has-text("Certification & Skills")')).toBeVisible();
    await expect(page.locator('button:has-text("Career Preferences")')).toBeVisible();
    
    console.log('✅ All tabs loaded successfully');
  });

  test('should fill and save basic profile info', async ({ page }) => {
    await page.goto('/profile/complete');
    await page.waitForSelector('text=Complete Freelancer Profile');
    
    // Fill Basic Info
    await page.click('button:has-text("User Details")');
    await page.fill('input[id="firstName"]', TEST_PROFILE.firstName);
    await page.fill('input[id="lastName"]', TEST_PROFILE.lastName);
    
    // Click Save button
    await page.click('button:has-text("Save Profile")');
    
    // Check for success message
    const successMsg = page.locator('text=Profile saved successfully');
    await expect(successMsg).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Basic info saved successfully');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/profile/complete');
    await page.waitForSelector('text=Complete Freelancer Profile');
    
    // Clear required field (e.g. Email in BasicInfo)
    await page.click('button:has-text("User Details")');
    await page.fill('input[id="email"]', '');
    
    // Try to save
    await page.click('button:has-text("Save Profile")');
    
    // Should show validation error
    await expect(page.locator('text=Email is required')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Validation working correctly');
  });
});
