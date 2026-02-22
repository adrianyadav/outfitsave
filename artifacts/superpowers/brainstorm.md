# Superpowers Brainstorm

## Goal

Source and display 5 high-quality, editorial-style outfits on the homepage, complete with individual constituent pieces (items) so users can click into an outfit and see its components.

## Constraints

- Must match the dark, minimalist editorial aesthetic.
- Must include both the full outfit image and data for the individual items (name, category, description, and ideally an image).
- Needs to be reliable (no broken links/404s).

## Known context

- Currently, the homepage showcases 5 Unsplash images as `Outfits`, but their `items` arrays are completely empty.
- When a user clicks on these outfits, the details page looks empty because there are no pieces to display.
- Unsplash provides great lifestyle/editorial shots, but finding isolated product shots of the exact matching items in the photo is very difficult.

## Risks

- Image links breaking over time (as seen previously with Unsplash redirects).
- Mismatch between the editorial outfit image and the item images if we use generic stock photos for the pieces.
- Web scraping fashion retailers for complete outfit data is prone to breaking and often violates terms of service.

## Options (2–4)

1. **Synthetic Curation (Unsplash + Text Items):** Keep the current high-quality Unsplash editorial photos as the main outfit image. Manually curate 3-4 text-based items (e.g., "Oversized Wool Coat", "Relaxed Denim") for each outfit. Leave the item `imageUrl` blank, relying on the redesigned UI which elegantly handles text-only items.
2. **Synthetic Curation (Unsplash + Generic Unsplash Items):** Same as above, but source generic, minimalist Unsplash photos for the individual items (e.g., a standalone photo of a black boot, a hanger with a white shirt).
3. **AI Generation:** Use an AI image generation tool to create 5 cohesive editorial outfit photos, and then generate matching isolated product shots for each individual item.
4. **Hardcoded Retailer Data:** Manually curate 5 outfits from a premium retailer (e.g., SSENSE, MR PORTER) and hardcode their image URLs and item details into the seed script.

## Recommendation

**Option 1 (Synthetic Curation with Text Items)** is the most robust and immediate solution. It preserves the beautiful editorial photography we just set up, while populating the database with rich, descriptive text items. Since the redesigned UI gracefully handles items without images (it expands the text to full width), this avoids the jarring visual mismatch of pairing a stunning editorial street-style photo with generic stock photos of clothes on hangers.

_Alternative:_ If item images are strictly desired, **Option 2** combining the main Unsplash image with carefully selected minimalist Unsplash product shots is the next best approach.

## Acceptance criteria

- The database seed script and homepage fallback data are updated to include `items` arrays for all 5 showcase outfits.
- Clicking on any homepage outfit displays its constituent pieces on the detail page.
- The aesthetic remains dark, minimal, and premium.
