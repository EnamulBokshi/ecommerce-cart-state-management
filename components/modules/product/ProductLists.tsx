'use client';

import { useAppSelector } from "@/lib/hooks";
import ProductCard from "./ProductCard";
import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, X, ChevronDown, Package } from "lucide-react";
import { Product } from "@/interface/product.interface";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "name";
type ViewMode = "grid" | "list";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A → Z" },
];

function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.avgRating - a.avgRating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export default function ProductLists() {
  const products = useAppSelector((state) => state.product);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive categories from data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, [products]);

  // Filter & sort
  const filteredProducts = useMemo(() => {
    let result = products;

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    return sortProducts(result, sortBy);
  }, [products, activeCategory, searchQuery, sortBy]);

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Featured";

  return (
    <main className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-28 pb-20">
      {/* ── Hero header ── */}
      <header className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium tracking-wide mb-4 animate-fade-in">
              <Package className="w-3.5 h-3.5" />
              <span>{products.length} products available</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
              Our Collection
            </h1>
            <p className="text-on-surface-variant mt-2 font-body-md max-w-lg">
              Explore our curated selection of quality products across every
              category — from electronics to everyday essentials.
            </p>
          </div>

          {/* View mode + Sort */}
          <div className="flex items-center gap-3 shrink-0">
            {/* View toggle */}
            <div className="flex items-center bg-surface-container rounded-lg p-1 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                aria-label="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen((v) => !v)}
                className="flex items-center gap-2 pl-4 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface hover:bg-surface-container-low transition-all duration-200 group"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="font-label-sm text-label-sm text-on-surface">
                  {activeSortLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 ${
                    sortDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setSortDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-40 py-1.5 animate-slide-down bg-transparent backdrop-blur-md">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`cursor-pointer hover:text-accent-foreground w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === opt.value
                            ? "bg-surface-container text-on-surface font-medium"
                            : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="mt-8 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            placeholder="Search products by name or category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-container transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          )}
        </div>

        {/* ── Category pills ── */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ── Results bar ── */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-on-surface-variant">
          Showing{" "}
          <span className="font-semibold text-on-surface">
            {filteredProducts.length}
          </span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
          {activeCategory !== "All" && (
            <span>
              {" "}
              in{" "}
              <span className="font-semibold text-on-surface">
                {activeCategory}
              </span>
            </span>
          )}
          {searchQuery && (
            <span>
              {" "}
              for &ldquo;
              <span className="font-semibold text-on-surface">
                {searchQuery}
              </span>
              &rdquo;
            </span>
          )}
        </p>

        {(activeCategory !== "All" || searchQuery) && (
          <button
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="text-sm text-primary hover:underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Product Grid / List ── */}
      {filteredProducts.length > 0 ? (
        <section
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={mounted ? "animate-fade-in-up" : ""}
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: "both",
              }}
            >
              <ProductCard
                product={product}
                colors={["#f9f9f9ff", "#1a1b1cff", "#858484ff"]}
                viewMode={viewMode}
              />
            </div>
          ))}
        </section>
      ) : (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
            <Search className="w-8 h-8 text-on-surface-variant" />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            No products found
          </h3>
          <p className="text-on-surface-variant font-body-md max-w-sm mb-6">
            We couldn&apos;t find anything matching your search. Try adjusting
            your filters or search terms.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* ── Pagination ── */}
      {filteredProducts.length > 0 && (
        <div className="mt-16 flex justify-center items-center gap-3">
          <button className="w-11 h-11 flex items-center justify-center border border-outline-variant rounded-full hover:bg-surface-container-low transition-colors duration-200">
            ←
          </button>

          <div className="flex items-center gap-1.5">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-label-sm text-sm shadow-sm">
              1
            </button>
            <button disabled className="w-10 h-10 disabled:bg-disabled-container disabled:text-on-disabled-container flex items-center justify-center rounded-full hover:bg-surface-container-low font-label-sm text-sm transition-colors duration-200">
              2
            </button>
            <button disabled className="w-10 h-10 disabled:bg-disabled-container disabled:text-on-disabled-container flex items-center justify-center rounded-full hover:bg-surface-container-low font-label-sm text-sm transition-colors duration-200">
              3
            </button>
            <span className="px-1.5 text-on-surface-variant text-sm">…</span>
            <button disabled className="w-10 h-10 disabled:bg-disabled-container disabled:text-on-disabled-container flex items-center justify-center rounded-full hover:bg-surface-container-low font-label-sm text-sm transition-colors duration-200">
              12
            </button>
          </div>

          <button disabled className="w-11 h-11 disabled:bg-disabled-container disabled:text-on-disabled-container flex items-center justify-center border border-outline-variant rounded-full hover:bg-surface-container-low transition-colors duration-200">
            →
          </button>
        </div>
      )}
    </main>
  );
}