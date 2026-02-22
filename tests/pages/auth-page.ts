import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
    readonly page: Page;

    // Common selectors
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly nameInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly registerLink: Locator;
    readonly loginLink: Locator;
    readonly logoutButton: Locator;
    readonly googleSignInButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize common selectors using data-testid attributes
        this.emailInput = page.locator('[data-testid="email-input"]');
        this.passwordInput = page.locator('[data-testid="password-input"]');
        this.nameInput = page.locator('[data-testid="name-input"]');
        this.submitButton = page.locator('[data-testid="submit-button"]');
        this.errorMessage = page.locator('[data-testid="error-message"]');
        this.registerLink = page.locator('[data-testid="register-link"]');
        this.loginLink = page.locator('[data-testid="login-link"]');
        this.logoutButton = page.locator('[data-testid="logout-button"], [data-testid="logout-button-mobile"]');
        this.googleSignInButton = page.locator('[data-testid="google-signin-button"]');
    }

    // Navigation methods
    async gotoLogin() {
        await this.page.goto('/login');
        await this.page.waitForLoadState('networkidle');
    }

    async gotoRegister() {
        await this.page.goto('/register');
        await this.page.waitForLoadState('networkidle');
    }

    async gotoHome() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    // Form interaction methods
    async fillLoginForm(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async fillRegisterForm(name: string, email: string, password: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async submitForm() {
        await this.submitButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // Authentication methods
    async login(email: string, password: string) {
        await this.gotoLogin();
        await this.fillLoginForm(email, password);
        await this.submitForm();
    }

    async register(name: string, email: string, password: string) {
        await this.gotoRegister();
        await this.fillRegisterForm(name, email, password);
        await this.submitForm();
    }

    async createAccount(name: string, email: string, password: string) {
        await this.register(name, email, password);
        // Wait for navigation to home page after successful registration
        await this.page.waitForURL('/', { timeout: 10000 });
    }

    // Google OAuth methods
    async clickGoogleSignIn() {
        await this.googleSignInButton.click();
        // Note: In a real test environment, you'd need to handle the Google OAuth flow
        // This might involve mocking the OAuth response or using test credentials
    }

    // Navigation between auth pages
    async goToLoginFromRegister() {
        await this.loginLink.click();
        await expect(this.page).toHaveURL('/login');
    }

    async goToRegisterFromLogin() {
        await this.registerLink.click();
        await expect(this.page).toHaveURL('/register');
    }

    // Assertion methods
    async expectLoggedIn() {
        // Wait for URL to change to indicate successful login
        await this.page.waitForURL('**/', { timeout: 10000 }).catch(() => {});
        await expect(this.page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 10000 });
        await expect(this.page.locator('a[href="/my-outfits"]').first()).toBeVisible();
    }

    async expectLoggedOut() {
        await expect(this.page.locator('a[href="/login"]').first()).toBeVisible();
    }

    async expectErrorVisible() {
        await expect(this.errorMessage).toBeVisible();
    }

    async expectErrorNotVisible() {
        await expect(this.errorMessage).not.toBeVisible();
    }

    async expectOnLoginPage() {
        await expect(this.page).toHaveURL('/login');
    }

    async expectOnRegisterPage() {
        await expect(this.page).toHaveURL('/register');
    }

    async expectOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }

    // Utility methods
    async waitForAuthComplete() {
        await this.page.waitForLoadState('networkidle');
        // Wait a bit more for any redirects
        await this.page.waitForTimeout(1000);
    }

    generateTestEmail(): string {
        return `test-${Date.now()}@example.com`;
    }

    generateTestPassword(): string {
        return 'password123';
    }

    generateTestName(): string {
        return 'Test User';
    }
} 