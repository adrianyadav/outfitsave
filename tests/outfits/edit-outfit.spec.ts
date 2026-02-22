import { test, expect } from '@playwright/test';
import { loginWithTestAccount, createOutfit, editOutfit } from '../utils';
import { getDefaultOutfitData } from '../test-data';

test.describe('Edit Outfit', () => {
    // Increase timeout for reliable execution against dev server
    test.setTimeout(60000);

    const createdOutfits: string[] = [];

    test.beforeEach(async ({ page }) => {
        // Login with existing test account before each test
        await loginWithTestAccount(page);
    });


    test('should edit outfit description successfully', async ({ page }) => {
        // Create an outfit first
        const { id: outfitId, name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Edit the outfit description
        const newDescription = 'Updated description for testing';
        await editOutfit(page, outfitName, { description: newDescription });

        // Navigate to the outfit detail page to verify the description
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        // Use the specific data-testid selector for better reliability
        const outfitCard = page.locator(`[data-testid="outfit-card-${outfitId}"]`);
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Wait a bit more for the page to fully render
        await page.waitForTimeout(1000);

        // Debug: Log the current page content to see what's there
        const pageContent = await page.content();
        console.log('Page content:', pageContent);

        // Use a more specific selector for the description
        // Look for the description using the test ID
        const descriptionText = page.locator('[data-testid="outfit-description"]').filter({ hasText: 'Updated description for testing' });
        await expect(descriptionText).toBeVisible();
    });

    test('should edit outfit tags successfully', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Edit the outfit tags
        const newTags = 'updated, winter, formal';
        await editOutfit(page, outfitName, { tags: newTags });

        // Navigate to the outfit detail page to verify the tags
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Check that the new tags are visible - use more specific selectors
        // Look for tags within the tags section - tags are displayed as Badge components with test IDs
        await expect(page.locator('[data-testid="outfit-tag-0"]').filter({ hasText: 'updated' })).toBeVisible();
        await expect(page.locator('[data-testid="outfit-tag-1"]').filter({ hasText: 'winter' })).toBeVisible();
        await expect(page.locator('[data-testid="outfit-tag-2"]').filter({ hasText: 'formal' })).toBeVisible();
    });

    test('should toggle outfit privacy successfully', async ({ page }) => {
        // Create a public outfit first
        const { name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Make it private
        await editOutfit(page, outfitName, { isPrivate: true });

        // Navigate to the outfit detail page to verify it's private
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Check that the private checkbox is checked
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await editButton.click();
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

        const privateCheckbox = page.locator('[data-testid="edit-outfit-private-checkbox"]');
        await expect(privateCheckbox).toBeChecked();

        // Cancel the edit
        const cancelButton = page.locator('[data-testid="edit-outfit-cancel-button"]');
        await cancelButton.click();
    });

    test('should edit existing item in outfit successfully', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to the outfit detail page
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Click edit button
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await editButton.click();
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

        // Expand the first accordion item to access the form fields
        const firstAccordionTrigger = page.locator('[data-testid="edit-item-accordion-trigger-0"]');
        await firstAccordionTrigger.click();
        await page.waitForTimeout(500); // Wait for accordion to expand

        // Edit the first item's name
        const itemNameInput = page.locator('[data-testid="edit-item-name-input-0"]');
        await itemNameInput.fill('Updated Cotton T-Shirt');

        // Save the changes
        const saveButton = page.locator('[data-testid="save-edit-button"]');
        await saveButton.click();

        // Wait for the modal to close
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { state: 'hidden' });

        // Verify the item was updated - look for the updated name
        await expect(page.locator('[data-testid*="outfit-item-name"]').filter({ hasText: 'Updated Cotton T-Shirt' })).toBeVisible();
    });

    test('should remove item from outfit successfully', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to the outfit detail page
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Click edit button
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await editButton.click();
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

        // Expand the first accordion item to access the form fields
        const firstAccordionTrigger = page.locator('[data-testid="edit-item-accordion-trigger-0"]');
        await firstAccordionTrigger.click();
        await page.waitForTimeout(500); // Wait for accordion to expand

        // Remove the first item - fix the test ID
        const removeButton = page.locator('[data-testid="edit-item-remove-button-0"]');
        await removeButton.click();

        // Save the changes
        const saveButton = page.locator('[data-testid="save-edit-button"]');
        await saveButton.click();

        // Wait for the modal to close
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { state: 'hidden' });

        // Verify the item was removed (should not see the original item name)
        await expect(page.locator('text=Cotton T-Shirt')).not.toBeVisible();
    });

    test('should cancel edit without saving changes', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to the outfit detail page with better error handling
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        // Wait for outfits to load before proceeding
        await page.waitForSelector('a[href*="/outfits/"]', { timeout: 10000 });

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await expect(outfitCard).toBeVisible();
        await outfitCard.click();

        // Wait for navigation to complete
        await page.waitForLoadState('networkidle');

        // Click edit button
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await editButton.click();
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { timeout: 10000 });

        // Make some changes
        const nameInput = page.locator('[data-testid="edit-outfit-name-input"]');
        await nameInput.fill('This should not be saved');

        // Cancel the edit
        const cancelButton = page.locator('[data-testid="edit-outfit-cancel-button"]');
        await cancelButton.click();

        // Wait for the modal to close
        await page.waitForSelector('[data-testid="edit-outfit-form"]', { state: 'hidden' });

        // Verify the original name is still there
        await expect(page.locator(`text=${outfitName}`)).toBeVisible();
        await expect(page.locator('text=This should not be saved')).not.toBeVisible();
    });

    test('should show edit button only for owned outfits', async ({ page }) => {
        // Create an outfit first
        const { name: outfitName } = await createOutfit(page, getDefaultOutfitData(false));
        createdOutfits.push(outfitName);

        // Navigate to the outfit detail page
        await page.goto('/my-outfits');
        await page.waitForLoadState('networkidle');

        const outfitCard = page.locator('a[href*="/outfits/"]').filter({ hasText: outfitName });
        await outfitCard.click();
        await page.waitForLoadState('networkidle');

        // Verify edit button is visible for owned outfit
        const editButton = page.locator('[data-testid="edit-outfit-button"]');
        await expect(editButton).toBeVisible();

        // Navigate to a public outfit (not owned by current user)
        await page.goto('/outfits');
        await page.waitForLoadState('networkidle');

        // Find a public outfit and click on it
        const publicOutfitCard = page.locator('a[href*="/outfits/"]').first();
        await publicOutfitCard.click();
        await page.waitForLoadState('networkidle');

        // Verify edit button is not visible for non-owned outfit
        await expect(page.locator('[data-testid="edit-outfit-button"]')).not.toBeVisible();
    });
}); 