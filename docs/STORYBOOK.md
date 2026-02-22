# Storybook Design System

unpacked uses Storybook to showcase and document our design system components. This provides an interactive way to explore, test, and develop our UI components.

## 🚀 Getting Started

### Running Storybook

```bash
# Start Storybook in development mode
npm run storybook

# Build Storybook for production
npm run build-storybook
```

Storybook will be available at `http://localhost:6006`

## 📚 Available Stories

### UI Components

#### 🧩 Button

- **Primary Button**: Main call-to-action buttons with gradient styling
- **Secondary Button**: Outline buttons for secondary actions
- **Destructive Button**: Red buttons for dangerous actions
- **Size Variants**: Small, default, and large button sizes
- **Interactive States**: Hover, focus, and disabled states
- **With Icons**: Buttons with embedded icons

#### 🃏 OutfitCard

- **Default Card**: Standard outfit card with image and details
- **Private Outfit**: Cards for private outfits with lock indicator
- **Long Content**: How cards handle long titles and descriptions
- **Tag Variations**: Cards with many tags or no tags
- **Loading States**: Cards without images
- **Grid Layout**: Multiple cards in responsive grid

#### ⚠️ ConfirmDialog

- **Default Dialog**: Standard confirmation dialog
- **Delete Confirmation**: Specific styling for delete actions
- **Long Messages**: How dialogs handle lengthy content
- **Custom Buttons**: Different button text variations
- **Interactive**: Working dialog with open/close functionality

### Design System Overview

#### 🎨 Colors

- **Brand Colors**: Royal blue gradient and variants
- **Color Palette**: Primary, secondary, and accent colors
- **Usage Examples**: How colors are applied in components

#### 🔤 Typography

- **Heading Hierarchy**: H1-H4 with proper sizing
- **Text Sizes**: Large, base, small, and extra small
- **Font Weights**: Bold, semibold, medium, and normal

#### 📝 Form Elements

- **Input Fields**: Text inputs with labels
- **Textareas**: Multi-line text inputs
- **Select Dropdowns**: Dropdown selection components
- **Checkboxes**: Boolean input controls

#### 🏷️ Badges & Tags

- **Badge Variants**: Default, secondary, destructive, outline
- **Usage Examples**: How badges are used in context

#### 🃏 Cards

- **Card Types**: Content cards, interactive cards
- **Responsive Grid**: How cards work in different layouts

## 🎯 Features

### Interactive Controls

- **Args Controls**: Modify component props in real-time
- **Background Switcher**: Test components on different backgrounds
- **Viewport Sizing**: Test responsive behavior
- **Accessibility**: Built-in a11y testing and reporting

### Development Tools

- **Hot Reload**: Changes reflect immediately
- **Component Documentation**: Auto-generated docs from stories
- **Testing Integration**: Vitest integration for component testing
- **Accessibility Testing**: Automated a11y checks

## 📖 Writing Stories

### Basic Story Structure

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive", "outline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    className: "bg-gradient-royal hover:bg-gradient-royal-light text-white",
  },
};
```

### Story Types

#### Component Stories

- Show individual component variants
- Include interactive controls
- Demonstrate different states

#### Composite Stories

- Show components working together
- Demonstrate real-world usage
- Test component interactions

#### Design System Stories

- Showcase the complete design system
- Demonstrate color usage and typography
- Provide usage guidelines

## 🧪 Testing

### Accessibility Testing

Storybook includes automatic accessibility testing:

- Color contrast checks
- Keyboard navigation testing
- Screen reader compatibility
- ARIA attribute validation

### Component Testing

- Unit tests for individual components
- Integration tests for component interactions
- Visual regression testing

## 🎨 Design Tokens

### Colors

```css
/* Primary Brand Colors */
--royal: #4f46e5;
--royal-light: #6366f1;
--royal-dark: #3730a3;

/* Gradients */
.bg-gradient-royal {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
}
```

### Typography

```css
/* Headings */
h1 {
  font-size: 1.875rem;
  font-weight: 700;
}
h2 {
  font-size: 1.5rem;
  font-weight: 600;
}
h3 {
  font-size: 1.25rem;
  font-weight: 600;
}
h4 {
  font-size: 1.125rem;
  font-weight: 600;
}

/* Body Text */
.text-lg {
  font-size: 1.125rem;
}
.text-base {
  font-size: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-xs {
  font-size: 0.75rem;
}
```

### Spacing

```css
/* Padding & Margin */
.p-1 {
  padding: 0.25rem;
}
.p-2 {
  padding: 0.5rem;
}
.p-4 {
  padding: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
.p-8 {
  padding: 2rem;
}
```

## 🔧 Configuration

### Storybook Configuration

- **Framework**: Next.js with Vite
- **Styling**: Tailwind CSS integration
- **Addons**: Accessibility, testing, documentation
- **Build**: Optimized for production deployment

### Custom Addons

- **A11y**: Accessibility testing and reporting
- **Vitest**: Component testing integration
- **Docs**: Auto-generated documentation

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Testing Responsive Behavior

- Use the viewport toolbar to test different screen sizes
- Test component behavior at various breakpoints
- Verify responsive grid layouts

## 🚀 Deployment

### Building for Production

```bash
npm run build-storybook
```

### Deployment Options

- **Static Hosting**: Deploy to Netlify, Vercel, or GitHub Pages
- **Internal Documentation**: Host on internal servers
- **Design Team Access**: Share with design and product teams

## 📚 Resources

- [Storybook Documentation](https://storybook.js.org/)
- [Component-Driven Development](https://www.componentdriven.org/)
- [Design System Best Practices](https://www.designsystem.digital/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

### Adding New Stories

1. Create a `.stories.tsx` file for your component
2. Include all relevant variants and states
3. Add proper TypeScript types
4. Include accessibility considerations
5. Test on different viewports

unpacked uses Storybook to showcase and document our design system components. This provides an interactive way to explore, test, and develop our UI components.

### Updating Existing Stories

1. Maintain backward compatibility
2. Update documentation as needed
3. Test all variants still work
4. Verify accessibility compliance

This Storybook setup provides a comprehensive way to develop, test, and document our design system components while ensuring consistency and accessibility across the unpacked application.
