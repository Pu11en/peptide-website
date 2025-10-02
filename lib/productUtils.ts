/**
 * Type for product variants (sizes with prices)
 */
export interface ProductVariant {
  size: string;
  price: number;
}

/**
 * Type for the price display result
 */
export type PriceDisplay = string;

/**
 * Normalized product shape for consistent component usage
 */
export interface NormalizedProduct {
  id: string;
  title: string;
  image: string;
  description: string;
  variants: ProductVariant[];
  category: string;
}

/**
 * Enhanced Product interface with strict typing and validation
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: ProductVariant[];
}

/**
 * Category interface for product categorization
 */
export interface Category {
  id: string;
  name: string;
  description: string;
}

/**
 * Type for product validation errors
 */
export type ProductValidationError = {
  field: string;
  message: string;
};

/**
 * Type for validated product result
 */
export type ValidatedProduct = {
  isValid: boolean;
  errors: ProductValidationError[];
  product?: Product;
};

/**
 * Type for cart item with proper typing
 */
export interface CartItem {
  slug: string;
  name: string;
  size?: string;
  price: number;
  image?: string;
  quantity: number;
}

/**
 * Type for product search filters
 */
export interface ProductFilters {
  category?: string;
  searchTerm?: string;
  sortBy?: 'name' | 'price-low' | 'price-high';
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Type for product search results
 */
export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  filters: ProductFilters;
}


/**
 * Convert existing Product to NormalizedProduct
 */
export function normalizeProduct(product: Product): NormalizedProduct {
  return {
    id: product.id,
    title: product.name,
    image: product.image,
    description: product.description,
    variants: product.sizes,
    category: product.category,
  };
}

/**
 * Utility function to get price display for a product
 * @param variants Array of product variants (sizes with prices)
 * @returns Formatted price string - single price or price range
 */
export function getPriceDisplay(variants: ProductVariant[]): PriceDisplay {
  if (!variants || variants.length === 0) {
    return '';
  }

  if (variants.length === 1) {
    // Single variant - return single price
    return `$${variants[0].price}`;
  }

  // Multiple variants - calculate price range
  const prices = variants.map(variant => variant.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    // All variants have the same price
    return `$${minPrice}`;
  }

  // Return price range
  return `$${minPrice}–$${maxPrice}`;
}

/**
 * Alternative version that works with Product objects
 * @param product Product object with sizes array
 * @returns Formatted price string - single price or price range
 */
export function getProductPriceDisplay(product: Product): PriceDisplay {
  return getPriceDisplay(product.sizes);
}

/**
 * Validate a product object
 * @param product Product to validate
 * @returns Validation result with errors if any
 */
export function validateProduct(product: any): ValidatedProduct {
  const errors: ProductValidationError[] = [];
  
  // Check required fields
  if (!product.id || typeof product.id !== 'string') {
    errors.push({ field: 'id', message: 'Product ID is required and must be a string' });
  }
  
  if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
    errors.push({ field: 'name', message: 'Product name is required and must be a non-empty string' });
  }
  
  if (!product.description || typeof product.description !== 'string' || product.description.trim() === '') {
    errors.push({ field: 'description', message: 'Product description is required and must be a non-empty string' });
  }
  
  if (!product.image || typeof product.image !== 'string' || product.image.trim() === '') {
    errors.push({ field: 'image', message: 'Product image is required and must be a non-empty string' });
  }
  
  if (!product.category || typeof product.category !== 'string' || product.category.trim() === '') {
    errors.push({ field: 'category', message: 'Product category is required and must be a non-empty string' });
  }
  
  // Validate price
  if (typeof product.price !== 'number' || product.price <= 0) {
    errors.push({ field: 'price', message: 'Product price must be a positive number' });
  }
  
  // Validate variants
  if (!Array.isArray(product.sizes) || product.sizes.length === 0) {
    errors.push({ field: 'sizes', message: 'Product must have at least one size variant' });
  } else {
    product.sizes.forEach((variant: any, index: number) => {
      if (!variant.size || typeof variant.size !== 'string' || variant.size.trim() === '') {
        errors.push({ field: `sizes[${index}].size`, message: `Variant ${index} size is required and must be a non-empty string` });
      }
      
      if (typeof variant.price !== 'number' || variant.price <= 0) {
        errors.push({ field: `sizes[${index}].price`, message: `Variant ${index} price must be a positive number` });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    product: errors.length === 0 ? product : undefined
  };
}

/**
 * Check if a product can be rendered safely (has required fields)
 * @param product Product to check
 * @returns True if product can be rendered safely
 */
export function canRenderProduct(product: any): product is NormalizedProduct {
  return (
    product &&
    typeof product.id === 'string' &&
    typeof product.title === 'string' && product.title.trim() !== '' &&
    typeof product.image === 'string' && product.image.trim() !== '' &&
    Array.isArray(product.variants) && product.variants.length > 0
  );
}

/**
 * Filter products to only include those that can be rendered safely
 * @param products Array of products to filter
 * @returns Array of products that can be rendered safely
 */
export function getRenderableProducts(products: Product[]): Product[] {
  return products.filter(product => {
    const validation = validateProduct(product);
    return validation.isValid;
  });
}