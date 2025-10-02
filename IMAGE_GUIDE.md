# How to Add Images to Your Next.js Website

## Your Current Images
You already have many images in your project:
- **Blog images**: `public/images/blog-*.jpg`
- **Product images**: `public/products/*.png` and `public/products/*-label.png`
- **General images**: `public/logo.png`, `public/hero-video.mp4`, etc.

## How to Use Images in Next.js

### 1. Using Next.js Image Component (Recommended)

```tsx
import Image from 'next/image'

// For local images in public folder
<Image
  src="/images/blog-placeholder.jpg"
  alt="Blog placeholder"
  width={500}
  height={300}
  priority // For important above-the-fold images
/>

// For product images
<Image
  src="/products/bpc-157-tb500-10mg.png"
  alt="BPC-157 TB500 10mg"
  width={400}
  height={400}
/>
```

### 2. Using Regular IMG Tags (For SVGs or when needed)

```tsx
// For SVG files or when you don't need optimization
<img 
  src="/images/lightning-bg.svg" 
  alt="Lightning background"
  className="w-full h-auto"
/>
```

### 3. Adding New Images

#### Step 1: Add image files to the public folder
```
public/
├── images/
│   ├── your-new-image.jpg
│   └── another-image.png
└── products/
    └── new-product-image.jpg
```

#### Step 2: Use the image in your component
```tsx
import Image from 'next/image'

function YourComponent() {
  return (
    <div>
      <Image
        src="/images/your-new-image.jpg"
        alt="Description of your image"
        width={600}
        height={400}
      />
    </div>
  )
}
```

## Image Best Practices

### 1. Image Optimization
- Use Next.js Image component for automatic optimization
- Provide width and height for better performance
- Use `priority` for above-the-fold images
- Use appropriate image formats (WebP for photos, PNG for graphics)

### 2. Responsive Images
```tsx
<Image
  src="/products/bpc-157-tb500-10mg.png"
  alt="BPC-157 TB500"
  width={400}
  height={400}
  sizes="(max-width: 768px) 100vw, 50vw"
  style={{ maxWidth: '100%', height: 'auto' }}
/>
```

### 3. Image Fallbacks
```tsx
<Image
  src="/images/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  onError={(e) => {
    // Fallback image if main image fails
    e.currentTarget.src = "/images/fallback.jpg"
  }}
/>
```

## Common Image Issues and Solutions

### Issue: "dangerouslyAllowSVG is disabled"
**Solution**: For SVG files, use regular img tags instead of Next.js Image component:
```tsx
// ❌ This won't work for SVGs
<Image src="/images/icon.svg" alt="Icon" width={24} height={24} />

// ✅ Use this for SVGs
<img src="/images/icon.svg" alt="Icon" className="w-6 h-6" />
```

### Issue: Image not loading
**Check these:**
1. File path is correct (starts with `/`)
2. File exists in `public` folder
3. File name matches exactly (case-sensitive)
4. Alt text is provided

## Adding Product Images

Your product images should follow this pattern:
```
public/products/
├── product-name-bottle.png    // Product bottle image
├── Product Name Label.png     // Product label image
└── product-name-10mg.png      // Different dosage variants
```

Example usage:
```tsx
<div className="product-card">
  <Image
    src="/products/bpc-157-tb500-10mg.png"
    alt="BPC-157 TB500 10mg"
    width={300}
    height={300}
    className="product-image"
  />
  <h3>BPC-157 TB500</h3>
  <p>10mg - Premium Quality</p>
</div>
```

## Adding Blog Images

For blog posts, use:
```tsx
<div className="blog-post">
  <Image
    src="/images/blog-metabolic-health.jpg"
    alt="Metabolic health blog post"
    width={800}
    height={400}
    priority
    className="blog-hero-image"
  />
  <h2>Metabolic Health Benefits</h2>
  <p>Blog content here...</p>
</div>
```

## Quick Reference

| Image Type | Component | When to Use |
|------------|-----------|-------------|
| Photos (JPG/PNG) | `<Image>` | Always for photos |
| Product Images | `<Image>` | Always for products |
| SVG Icons | `<img>` | For SVG files |
| Logos | `<Image>` | For logos |
| Background Images | CSS | For decorative backgrounds |

## Testing Your Images

1. Start your dev server: `npm run dev`
2. Open http://localhost:8000
3. Check that all images load properly
4. Check browser console for any image errors

That's it! You now know how to add and use images in your Next.js website.