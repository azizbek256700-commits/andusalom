import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Flame, Minus, Plus, ShoppingCart, Send, X, Truck, Clock, Sparkles, Trash2 } from "lucide-react";
import burgerImg from "../assets/burger.jpg";
import pizzaImg from "../assets/pizza.jpg";
import lavashImg from "../assets/lavash.jpg";
import heroImg from "../assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  img: string;
  tag: string;
};

const PRODUCTS: Product[] = [
  {
    id: "burger",
    name: "Classic Cheeseburger",
    desc: "Juicy beef patty, melted cheddar, special sauce.",
    price: 5.99,
    img: burgerImg,
    tag: "Bestseller",
  },
  {
    id: "pizza",
    name: "Pepperoni Fusion Pizza",
    desc: "Mozzarella, premium pepperoni, hot honey drizzle.",
    price: 9.99,
    img: pizzaImg,
    tag: "Chef's Pick",
  },
  {
    id: "lavash",
    name: "Chef's Special Lavash",
    desc: "Grilled meat, crispy fries, signature garlic sauce inside flatbread.",
    price: 4.49,
    img: lavashImg,
    tag: "New",
  },
];

const TELEGRAM_USER = "abdujalilov_o4";

function Index() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, n: number) =>
    setQuantities((q) => ({ ...q, [id]: Math.max(1, n) }));

  const addToCart = (p: Product) => {
    const qty = getQty(p.id);
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + qty }));
    setQuantities((q) => ({ ...q, [p.id]: 1 }));
    setCartOpen(true);
  };

  const updateCart = (id: string, delta: number) => {
    setCart((c) => {
      const next = (c[id] ?? 0) + delta;
      const copy = { ...c };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  };

  const removeFromCart = (id: string) =>
    setCart((c) => {
      const copy = { ...c };
      delete copy[id];
      return copy;
    });

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const p = PRODUCTS.find((x) => x.id === id)!;
          return { ...p, qty, lineTotal: p.price * qty };
        })
        .filter(Boolean),
    [cart],
  );

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const grandTotal = cartItems.reduce((s, i) => s + i.lineTotal, 0);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const orderViaTelegram = () => {
    if (cartItems.length === 0) return;
    const lines = [
      "🔥 *Yangi Buyurtma — Abdusalom's Fast Food*",
      "",
      ...cartItems.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} × ${i.qty} — $${i.lineTotal.toFixed(2)}`,
      ),
      "",
      `💰 Jami: $${grandTotal.toFixed(2)}`,
      "",
      "Iltimos, buyurtmamni tasdiqlang. Rahmat!",
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://t.me/${TELEGRAM_USER}?text=${text}`, "_blank");
  };

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-mesh text-stone-100">
      <Navbar totalItems={totalItems} onOpenCart={() => setCartOpen(true)} />

      <main>
        <Hero onExplore={scrollToMenu} />
        <Menu
          products={PRODUCTS}
          getQty={getQty}
          setQty={setQty}
          onAdd={addToCart}
        />
        <About />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        grandTotal={grandTotal}
        onInc={(id) => updateCart(id, +1)}
        onDec={(id) => updateCart(id, -1)}
        onRemove={removeFromCart}
        onOrder={orderViaTelegram}
      />
    </div>
  );
}

function Navbar({
  totalItems,
  onOpenCart,
}: {
  totalItems: number;
  onOpenCart: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto mt-3 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <a href="#" className="flex items-center gap-2 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FFB400] glow-orange">
              <Flame className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Abdusalom<span className="text-[#FF6B00]">'s</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 text-sm text-stone-300 md:flex">
            <a href="#menu" className="hover:text-[#FF6B00] transition-colors">Menu</a>
            <a href="#about" className="hover:text-[#FF6B00] transition-colors">About</a>
            <button onClick={onOpenCart} className="hover:text-[#FF6B00] transition-colors">
              Cart
            </button>
          </div>

          <button
            onClick={onOpenCart}
            aria-label="Open cart"
            className="relative grid h-11 w-11 place-items-center rounded-xl glass glow-orange-hover transition-all"
          >
            <ShoppingCart className="h-5 w-5 text-[#FF6B00]" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#FF6B00] px-1 text-[11px] font-bold text-black animate-pulse-glow">
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-stone-300">
            <Sparkles className="h-3.5 w-3.5 text-[#FF6B00]" />
            Fresh · Fast · Flame-grilled
          </div>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Premium Taste,{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FFB400] bg-clip-text text-transparent text-glow">
              Fast Delivery
            </span>
          </h1>
          <p className="mt-5 max-w-md text-stone-400">
            Hand-crafted burgers, wood-fired pizza & signature lavash —
            delivered hot, fast, and unforgettable.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onExplore}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-7 py-3.5 font-semibold text-black animate-pulse-glow transition-all hover:scale-[1.03]"
            >
              Explore Menu
              <Flame className="h-4 w-4 transition-transform group-hover:rotate-12" />
            </button>
            <div className="flex items-center gap-5 text-sm text-stone-400">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#FF6B00]" /> Free Delivery
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FF6B00]" /> 25 min
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-[#FF6B00]/30 blur-3xl" />
          <img
            src={heroImg}
            alt="Flame-grilled burger with fries"
            width={1600}
            height={1200}
            className="animate-float w-full rounded-3xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function Menu({
  products,
  getQty,
  setQty,
  onAdd,
}: {
  products: Product[];
  getQty: (id: string) => number;
  setQty: (id: string, n: number) => void;
  onAdd: (p: Product) => void;
}) {
  return (
    <section id="menu" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF6B00]">
            Our Menu
          </p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Crafted with <span className="text-[#FF6B00]">fire</span>.
          </h2>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const qty = getQty(p.id);
          return (
            <article
              key={p.id}
              className="glass group relative overflow-hidden rounded-3xl p-4 transition-all hover:-translate-y-1 hover:border-[#FF6B00]/40"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={p.img}
                  alt={p.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-[#FF6B00] backdrop-blur">
                  {p.tag}
                </span>
              </div>

              <div className="mt-4 px-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold leading-tight">{p.name}</h3>
                  <span className="whitespace-nowrap text-lg font-extrabold text-[#FF6B00]">
                    ${p.price.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-stone-400">{p.desc}</p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1 rounded-full glass p-1">
                    <button
                      onClick={() => setQty(p.id, qty - 1)}
                      aria-label="Decrease"
                      className="grid h-8 w-8 place-items-center rounded-full text-stone-300 transition-all hover:bg-[#FF6B00]/20 hover:text-[#FF6B00]"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(p.id, qty + 1)}
                      aria-label="Increase"
                      className="grid h-8 w-8 place-items-center rounded-full text-stone-300 transition-all hover:bg-[#FF6B00]/20 hover:text-[#FF6B00]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onAdd(p)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-4 py-2.5 text-sm font-semibold text-black transition-all glow-orange-hover"
                  >
                    <Plus className="h-4 w-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function About() {
  const stats = [
    { k: "10k+", v: "Happy Orders" },
    { k: "25min", v: "Avg Delivery" },
    { k: "4.9★", v: "Customer Rating" },
    { k: "100%", v: "Halal & Fresh" },
  ];
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
      <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#FF6B00]/20 blur-3xl" />
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#FF6B00]">
              About Us
            </p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight">
              Bold flavors, no compromise.
            </h2>
            <p className="mt-4 text-stone-400">
              At Abdusalom's, every burger is grilled to order, every pizza
              fired hot, and every lavash hand-rolled. We obsess over quality so
              you can obsess over taste.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.v}
                className="glass rounded-2xl p-5 transition-all hover:border-[#FF6B00]/40"
              >
                <div className="text-3xl font-extrabold text-[#FF6B00]">
                  {s.k}
                </div>
                <div className="mt-1 text-sm text-stone-400">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[#FF6B00] to-[#FFB400]">
            <Flame className="h-4 w-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold">
            Abdusalom's Fast Food
          </span>
        </div>
        <p className="text-xs text-stone-500">
          © {new Date().getFullYear()} Abdusalom's. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function CartDrawer({
  open,
  onClose,
  items,
  grandTotal,
  onInc,
  onDec,
  onRemove,
  onOrder,
}: {
  open: boolean;
  onClose: () => void;
  items: (Product & { qty: number; lineTotal: number })[];
  grandTotal: number;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onOrder: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#0D0D0C] border-l border-white/10 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FF6B00]/15">
              <ShoppingCart className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <h3 className="font-bold">Your Cart</h3>
              <p className="text-xs text-stone-400">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[#FF6B00]/10">
                <ShoppingCart className="h-9 w-9 text-[#FF6B00]" />
              </div>
              <p className="mt-4 font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-stone-400">
                Add something delicious from the menu.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="glass flex gap-3 rounded-2xl p-3"
                >
                  <img
                    src={i.img}
                    alt={i.name}
                    className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold leading-tight">
                        {i.name}
                      </h4>
                      <button
                        onClick={() => onRemove(i.id)}
                        aria-label="Remove"
                        className="text-stone-500 transition-colors hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-stone-400">
                      ${i.price.toFixed(2)} each
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1">
                        <button
                          onClick={() => onDec(i.id)}
                          aria-label="Decrease"
                          className="grid h-7 w-7 place-items-center rounded-full text-stone-300 transition-colors hover:bg-[#FF6B00]/20 hover:text-[#FF6B00]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold tabular-nums">
                          {i.qty}
                        </span>
                        <button
                          onClick={() => onInc(i.id)}
                          aria-label="Increase"
                          className="grid h-7 w-7 place-items-center rounded-full text-stone-300 transition-colors hover:bg-[#FF6B00]/20 hover:text-[#FF6B00]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#FF6B00]">
                        ${i.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-stone-400">Grand Total</span>
            <span className="text-2xl font-extrabold text-[#FF6B00]">
              ${grandTotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onOrder}
            disabled={items.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-6 py-4 font-semibold text-black transition-all animate-pulse-glow disabled:cursor-not-allowed disabled:opacity-40 disabled:animate-none"
          >
            <Send className="h-4 w-4" />
            Order via Telegram
          </button>
          <p className="mt-3 text-center text-xs text-stone-500">
            One click — your order opens in Telegram, ready to send.
          </p>
        </div>
      </aside>
    </>
  );
}