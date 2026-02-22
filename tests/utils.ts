import { Page, Locator, expect } from '@playwright/test';
import { getDefaultOutfitData } from './test-data';
import { ITEM_CATEGORIES } from "@/lib/constants";

// Page Object for common form interactions
class FormPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly nameInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('[data-testid="email-input"]');
        this.passwordInput = page.locator('[data-testid="password-input"]');
        this.nameInput = page.locator('[data-testid="name-input"]');
        this.submitButton = page.locator('[data-testid="submit-button"]');
        this.errorMessage = page.locator('[data-testid="error-message"]');
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async fillName(name: string) {
        await this.nameInput.fill(name);
    }

    async submit() {
        await this.submitButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async waitForNavigation() {
        // Wait for any navigation to complete, regardless of destination
        // This is more flexible and should work regardless of where NextAuth redirects
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });

        // Log the current URL for debugging
        console.log('Navigation completed, current URL:', this.page.url());
    }
}

// Page Object for outfit creation
class OutfitFormPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly descriptionTextarea: Locator;
    readonly tagsInput: Locator;
    readonly imageUrlButton: Locator;
    readonly imageUrlInput: Locator;
    readonly privateCheckbox: Locator;
    readonly addItemButton: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator('[data-testid="outfit-name-input"]');
        this.descriptionTextarea = page.locator('[data-testid="outfit-description-textarea"]');
        this.tagsInput = page.locator('[data-testid="outfit-tags-input"]');
        this.imageUrlButton = page.locator('button:has-text("Image URL")');
        this.imageUrlInput = page.locator('input[id="imageUrl"]');
        this.privateCheckbox = page.locator('[data-testid="outfit-private-checkbox"]');
        this.addItemButton = page.locator('[data-testid="add-item-button"]');
        this.submitButton = page.locator('[data-testid="save-outfit-button"]');
    }

    async fillBasicInfo(name: string, description: string, tags: string) {
        await this.nameInput.fill(name);
        await this.descriptionTextarea.fill(description);
        await this.tagsInput.fill(tags);
    }

    async setImageUrl(imageUrl: string) {
        // Click the "Image URL" button to switch to URL mode
        await this.imageUrlButton.click();
        // Wait for the URL input field to appear and fill it
        await this.imageUrlInput.fill(imageUrl);
    }

    async setPrivate(isPrivate: boolean) {
        if (isPrivate) {
            await this.privateCheckbox.check();
        } else {
            await this.privateCheckbox.uncheck();
        }
    }

    async addItem(item: {
        name: string;
        category: string;
        description?: string;
        purchaseUrl?: string;
    }) {
        await this.addItemButton.click();

        // Wait for the item form to be visible and get the current item index
        await this.page.waitForSelector('[data-testid^="item-name-input-"]', { timeout: 10000 });
        const itemInputs = this.page.locator('[data-testid^="item-name-input-"]');
        const itemIndex = await itemInputs.count() - 1; // Get the index of the newly added item

        // Fill item name using data-testid
        const itemNameInput = this.page.locator(`[data-testid="item-name-input-${itemIndex}"]`);
        await itemNameInput.fill(item.name);

        // Select category using data-testid
        const categorySelect = this.page.locator(`[data-testid="item-category-select-${itemIndex}"]`);
        await categorySelect.click();
        await this.page.locator(`[data-testid="item-category-option-${itemIndex}-${item.category}"]`).click({ force: true });

        // Fill optional description
        if (item.description) {
            const descriptionInput = this.page.locator(`[data-testid="item-description-input-${itemIndex}"]`);
            await descriptionInput.fill(item.description);
        }

        // Fill optional purchase URL
        if (item.purchaseUrl) {
            const purchaseUrlInput = this.page.locator(`[data-testid="item-purchase-url-input-${itemIndex}"]`);
            await purchaseUrlInput.fill(item.purchaseUrl);
        }
    }

    async submit() {
        await this.submitButton.click();

        // Wait for navigation to complete, but be more flexible about the destination
        // The form might redirect to /my-outfits or stay on the current page
        try {
            // First try to wait for navigation to /my-outfits
            await this.page.waitForURL('/my-outfits', { timeout: 10000 });
        } catch (error) {
            // If that fails, wait for any navigation to complete
            await this.page.waitForLoadState('networkidle', { timeout: 10000 });

            // Log the current URL for debugging
            console.log('Form submitted, current URL:', this.page.url());
        }
    }
}

// Page Object for outfit editing
class EditOutfitFormPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly descriptionTextarea: Locator;
    readonly tagsInput: Locator;
    readonly imageUpload: Locator;
    readonly privateCheckbox: Locator;
    readonly addItemButton: Locator;
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly quickAddButton: Locator;
    readonly quickAddDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator('[data-testid="edit-outfit-name-input"]');
        this.descriptionTextarea = page.locator('[data-testid="edit-outfit-description-textarea"]');
        this.tagsInput = page.locator('[data-testid="edit-outfit-tags-input"]');
        this.imageUpload = page.locator('[data-testid="edit-outfit-image-upload"]');
        this.privateCheckbox = page.locator('[data-testid="edit-outfit-private-checkbox"]');
        this.addItemButton = page.locator('[data-testid="edit-add-item-button"]');
        this.saveButton = page.locator('[data-testid="save-edit-button"]'); // Fix this line
        this.cancelButton = page.locator('[data-testid="edit-outfit-cancel-button"]');
        this.quickAddButton = page.locator('[data-testid="edit-quick-add-button"]');
        this.quickAddDropdown = page.locator('[data-testid="edit-quick-add-dropdown"]');
    }

    async fillBasicInfo(name: string, description: string, tags: string) {
        await this.nameInput.fill(name);
        await this.descriptionTextarea.fill(description);
        await this.tagsInput.fill(tags);
    }

    async setImageUrl(imageUrl: string) {
        // Click the "Image URL" button to switch to URL mode
        const imageUrlButton = this.page.locator('button:has-text("Image URL")');
        await imageUrlButton.click();
        // Wait for the URL input field to appear and fill it
        const imageUrlInput = this.page.locator('input[id="imageUrl"]');
        await imageUrlInput.fill(imageUrl);
    }

    async setPrivate(isPrivate: boolean) {
        if (isPrivate) {
            await this.privateCheckbox.check();
        } else {
            await this.privateCheckbox.uncheck();
        }
    }

    async addItem(item: {
        name: string;
        category: string;
        description?: string;
        purchaseUrl?: string;
    }) {
        await this.addItemButton.click();

        // Wait for the item form to be visible and get the current item index
        await this.page.waitForSelector('[data-testid^="edit-item-name-input-"]', { timeout: 10000 });
        const itemInputs = this.page.locator('[data-testid^="edit-item-name-input-"]');
        const itemIndex = await itemInputs.count() - 1; // Get the index of the newly added item

        // Fill item name using data-testid
        const itemNameInput = this.page.locator(`[data-testid="edit-item-name-input-${itemIndex}"]`);
        await itemNameInput.fill(item.name);

        // Select category using Radix UI Select approach
        const categorySelect = this.page.locator(`[data-testid="edit-item-category-select-${itemIndex}"]`);
        await categorySelect.click();

        // Map the category value to its display label using our constants
        const categoryLabels: { [key: string]: string } = Object.fromEntries(
            ITEM_CATEGORIES.map(cat => [cat.value, cat.label])
        );

        const categoryLabel = categoryLabels[item.category] || item.category;

        // Wait for the dropdown to open and then click on the specific category option
        // Add a small wait to ensure the dropdown is fully open
        await this.page.waitForTimeout(500);

        // Try to find and click the option
        const option = this.page.locator(`[role="option"]:has-text("${categoryLabel}")`);
        await option.waitFor({ timeout: 5000 });
        await option.click();

        // Fill optional description
        if (item.description) {
            const descriptionInput = this.page.locator(`[data-testid="edit-item-description-input-${itemIndex}"]`);
            await descriptionInput.fill(item.description);
        }

        // Fill optional purchase URL
        if (item.purchaseUrl) {
            const purchaseUrlInput = this.page.locator(`[data-testid="edit-item-purchase-url-input-${itemIndex}"]`);
            await purchaseUrlInput.fill(item.purchaseUrl);
        }
    }

    async removeItem(index: number) {
        const removeButton = this.page.locator(`[data-testid="edit-remove-item-button-${index}"]`);
        await removeButton.click();
    }

    async save() {
        await this.saveButton.click();
        // Wait for the modal to close
        await this.page.waitForSelector('[data-testid="edit-outfit-form"]', { state: 'hidden' });
    }

    async cancel() {
        await this.cancelButton.click();
        // Wait for the modal to close
        await this.page.waitForSelector('[data-testid="edit-outfit-form"]', { state: 'hidden' });
    }

    async clickQuickAdd() {
        await this.quickAddButton.click();
    }

    async selectQuickAddItem(index: number) {
        await this.quickAddDropdown.locator(`[data-testid="edit-quick-add-item-${index}"]`).click();
    }
}

export async function registerAndLogin(page: Page) {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';
    const testName = 'Test User';

    const formPage = new FormPage(page);

    // Register a new user
    await page.goto('/register');
    await formPage.fillName(testName);
    await formPage.fillEmail(testEmail);
    await formPage.fillPassword(testPassword);
    await formPage.submit();
    await formPage.waitForNavigation();

    return { testEmail, testPassword, testName };
}

export async function loginWithTestAccount(page: Page) {
    // Use environment variables for production testing, fallback to local test account
    const testEmail = process.env.PROD_TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.PROD_TEST_PASSWORD || 'password123';
    const testName = process.env.PROD_TEST_NAME || 'Test User';

    console.log('Attempting login with:', { testEmail, testName });

    const formPage = new FormPage(page);

    // Login with existing test account
    await page.goto('/login');
    console.log('Navigated to login page, URL:', page.url());

    await formPage.fillEmail(testEmail);
    await formPage.fillPassword(testPassword);
    console.log('Filled login form');

    await formPage.submit();
    console.log('Login form submitted');

    // Wait for navigation
    await formPage.waitForNavigation();

    console.log('Login process completed, final URL:', page.url());

    return { testEmail, testPassword, testName };
}

export async function createTestAccount(page: Page) {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';
    const testName = 'Test User';

    const formPage = new FormPage(page);

    // Register the test account
    await page.goto('/register');
    await formPage.fillName(testName);
    await formPage.fillEmail(testEmail);
    await formPage.fillPassword(testPassword);
    await formPage.submit();
    await formPage.waitForNavigation();

    return { testEmail, testPassword, testName };
}

export async function loginWithCredentials(page: Page, email: string, password: string) {
    const formPage = new FormPage(page);

    await page.goto('/login');
    await formPage.fillEmail(email);
    await formPage.fillPassword(password);
    await formPage.submit();
    await formPage.waitForNavigation();
}



interface CreateOutfitOptions {
    name?: string;
    description?: string;
    tags?: string;
    isPrivate?: boolean;
    imageUrl?: string;
    items?: Array<{
        name: string;
        category: string;
        description?: string;
        purchaseUrl?: string;
    }>;
}

export async function createOutfit(page: Page, options: CreateOutfitOptions = {}) {
    const defaultData = getDefaultOutfitData();
    const {
        name = defaultData.name,
        description = defaultData.description,
        tags = defaultData.tags,
        isPrivate = defaultData.isPrivate || false,
        imageUrl = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
        items = defaultData.items
    } = options;

    const outfitForm = new OutfitFormPage(page);

    // Navigate to add outfit page
    await page.goto('/outfits/new');
    await page.waitForLoadState('domcontentloaded');

    // Fill in basic outfit information
    await outfitForm.fillBasicInfo(name, description, tags);

    // Add image URL
    if (imageUrl) {
        await outfitForm.setImageUrl(imageUrl);
    }

    // Set private status if needed
    await outfitForm.setPrivate(isPrivate);

    // Add outfit items
    for (const item of items) {
        await outfitForm.addItem(item);
    }

    // Submit the form
    await outfitForm.submit();

    // More robust navigation handling
    try {
        // First try to wait for the redirect
        await page.waitForURL('/my-outfits', { timeout: 15000 });
    } catch (error) {
        // If redirect fails, check if we're still on the form page
        const currentUrl = page.url();
        if (currentUrl.includes('/add-outfit') || currentUrl.includes('/outfits/new')) {
            // Form submission might have failed, check for errors
            const errorElement = page.locator('[data-testid="error-message"], .text-destructive');
            if (await errorElement.isVisible()) {
                const errorText = await errorElement.textContent();
                throw new Error(`Form submission failed: ${errorText}`);
            }

            // Try to navigate manually
            await page.goto('/my-outfits');
        } else {
            // We're on some other page, navigate to my-outfits
            await page.goto('/my-outfits');
        }
    }

    await page.waitForLoadState('networkidle');

    // Find the created outfit card and extract the ID from the href
    // Use an exact text match instead of hasText to avoid strict mode violations
    // where "Private Test" matches a search for "Test"
    const outfitCard = page.locator(`a[href*="/outfits/"][data-outfit-name="${name}"]`).first();
    await expect(outfitCard).toBeVisible();

    // Extract outfit ID from the href attribute
    const href = await outfitCard.getAttribute('href');
    const outfitId = href ? href.split('/').pop() : null;

    if (!outfitId || isNaN(parseInt(outfitId))) {
        throw new Error(`Failed to extract outfit ID from href: ${href}`);
    }

    return { id: parseInt(outfitId), name, isPrivate };
}

interface EditOutfitOptions {
    name?: string;
    description?: string;
    tags?: string;
    isPrivate?: boolean;
    imageUrl?: string;
    items?: Array<{
        name: string;
        category: string;
        description?: string;
        purchaseUrl?: string;
    }>;
}

export async function editOutfit(page: Page, outfitName: string, options: EditOutfitOptions = {}) {
    const {
        name,
        description,
        tags,
        isPrivate,
        imageUrl,
        items
    } = options;

    // Navigate to my outfits page
    await page.goto('/my-outfits');
    await page.waitForLoadState('networkidle');

    // Find and click on the outfit to go to detail page
    const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
    await outfitCard.click();
    await page.waitForLoadState('networkidle');

    // Click the edit button to open the modal
    const editButton = page.locator('[data-testid="edit-outfit-button"]');
    await editButton.click();

    // Wait for the edit form to be visible
    await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

    const editForm = new EditOutfitFormPage(page);

    // Update basic info if provided
    if (name || description || tags) {
        const currentName = name || await editForm.nameInput.inputValue();
        const currentDescription = description || await editForm.descriptionTextarea.inputValue();
        const currentTags = tags || await editForm.tagsInput.inputValue();
        await editForm.fillBasicInfo(currentName, currentDescription, currentTags);
    }

    // Update image if provided
    if (imageUrl) {
        await editForm.setImageUrl(imageUrl);
    }

    // Update private status if provided
    if (isPrivate !== undefined) {
        await editForm.setPrivate(isPrivate);
    }

    // Add new items if provided
    if (items) {
        for (const item of items) {
            await editForm.addItem(item);
        }
    }

    // Save the changes
    await editForm.save();

    return { name: name || outfitName };
}