"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { products } from "@/app/data/products";
import { useCart } from "@/components/cart/CartContext";
import { Product, ProductVariant, CartItem } from "@/lib/productUtils";
import { useParams } from "next/navigation";

function imageForSlug(slug: string): string | undefined {
  switch (slug) {
    case "bpc-157-tb-500":
      return "/products/bpc 157 tb500 10mg.png";
    case "ghk":
      return "/products/ghk cu 50mg.png";
    case "triz":
      return "/products/tirz 15mg.png";
    case "mots-c":
      return "/products/Mots c 10mg bottle.png";
    case "melanotan-ii":
      return "/products/Melanotan II 10mg bottle.png";
    case "nad":
      return "/products/nad-100mg.png";
    case "reta":
      return "/products/reta 10mg bottle.png";
    case "tesamorelin":
      return "/products/tesamorlin 10mg bottle.png";
    case "igf-1":
      return "/products/IGF1 lr3 1mg bottle.png";
    default:
      return undefined;
  }
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = useParams();
  const id = param.id as string;

  const product = products.find((p) => p.id === id) as Product | undefined;
  const { addItem, openCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Product not found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const [defaultSize] = product.sizes;
  const defaultImage = imageForSlug(product.id) || product.image;
  
  // Debug log for NAD+ image
  if (product.id === 'nad') {
    console.log('ProductDetail NAD+ product.image:', product.image);
    console.log('ProductDetail NAD+ imageForSlug:', imageForSlug(product.id));
    console.log('ProductDetail NAD+ defaultImage:', defaultImage);
    console.log('ProductDetail NAD+ encoded:', encodeURIComponent(defaultImage));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-block mb-6 text-blue-400 hover:text-blue-300"
        >
          ← Home
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-800 rounded-lg p-6 border border-blue-900/40">
          <div
            className="relative h-80 bg-gray-900 rounded"
            style={{
              backgroundImage: defaultImage
                ? `url('${encodeURIComponent(defaultImage)}')`
                : undefined,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
            aria-label={product.name}
            onError={(e) => {
              console.error(`Failed to load background image: ${defaultImage}`);
              console.error('Encoded path:', encodeURIComponent(defaultImage));
            }}
          />
          <div>
            <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
            <p className="text-gray-300 text-sm mb-4">{product.description}</p>

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const size =
                  (form.elements.namedItem("size") as HTMLSelectElement)
                    ?.value || defaultSize?.size;
                const qty = Number(
                  (form.elements.namedItem("qty") as HTMLInputElement)?.value ||
                    1
                );
                const price =
                  product.sizes.find((s) => s.size === size)?.price ??
                  product.price;
                addItem({
                  slug: product.id,
                  name: product.name,
                  size,
                  price,
                  image: defaultImage,
                  quantity: qty,
                });
                openCart();
              }}
            >
              <div>
                <label
                  htmlFor="size"
                  className="block text-sm text-gray-300 mb-1"
                >
                  Size
                </label>
                <select
                  id="size"
                  name="size"
                  defaultValue={defaultSize?.size}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                >
                  {product.sizes.map((s) => (
                    <option key={s.size} value={s.size}>
                      {s.size} — ${s.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="qty"
                  className="block text-sm text-gray-300 mb-1"
                >
                  Quantity
                </label>
                <input
                  id="qty"
                  name="qty"
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-32 bg-gray-900 border border-gray-700 rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
              >
                Add to Cart
              </button>
            </form>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-300">
                First-time buyers: you’ll need supplies for reconstitution:
              </p>
              <ul className="text-sm list-disc list-inside">
                <li>
                  Syringes:{" "}
                  <a
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    href="https://a.co/d/3621bhc"
                    rel="noreferrer"
                  >
                    https://a.co/d/3621bhc
                  </a>
                </li>
                <li>
                  BAC water:{" "}
                  <a
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    href="https://www.amazon.com/s?k=bac+water+for+peptides&crid=1BU0WL466H73K&sprefix=bac+wa%2Caps%2C128&ref=nb_sb_ss_p13n-expert-pd-ops-ranker_2_6"
                    rel="noreferrer"
                  >
                    Amazon BAC water search
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/#research"
                className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2"
              >
                More Information
              </Link>
              <Link
                href="/#products"
                className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2"
              >
                Browse More Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
