'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Loader2, Minus, Plus, ShoppingBag, Truck } from 'lucide-react';
import { createPrintCheckout } from '@/actions/events';
import { STANDARD_SHIPPING_AMOUNT, formatMoney } from '@/lib/events/catalog';
import { GalleryHeader, GallerySteps } from './gallery-chrome';
import { DownloadShareDialog } from './gallery-share';

type Asset = { id: string; title: string; alt: string; previewUrl: string; downloadUrl: string };
type Product = { id: string; name: string; shortName: string; description: string; unitAmount: number };
type CartItem = { assetId: string; productId: string; quantity: number };

export default function PrintShop({
  token,
  eventTitle,
  currency,
  assets,
  products,
  cancelled,
}: {
  token: string;
  eventTitle: string;
  currency: string;
  assets: Asset[];
  products: Product[];
  cancelled: boolean;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadOpen, setDownloadOpen] = useState(false);
  const assetMap = useMemo(() => new Map(assets.map((asset) => [asset.id, asset])), [assets]);
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product?.unitAmount || 0) * item.quantity;
  }, 0), [cart, productMap]);
  const deliveryAmount = subtotal > 0 ? STANDARD_SHIPPING_AMOUNT : 0;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedAssets = useMemo(() => {
    const selectedIds = new Set(cart.map((item) => item.assetId));
    return assets.filter((asset) => selectedIds.has(asset.id));
  }, [assets, cart]);
  const productGridClass = products.length === 1 ? 'grid-cols-1' : products.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  function add(assetId: string, productId: string) {
    setError('');
    setCart((current) => {
      const existing = current.find((item) => item.assetId === assetId && item.productId === productId);
      if (!existing) return [...current, { assetId, productId, quantity: 1 }];
      return current.map((item) => item === existing ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item);
    });
  }

  function changeQuantity(assetId: string, productId: string, delta: number) {
    setCart((current) => current
      .map((item) => item.assetId === assetId && item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  async function checkout() {
    if (cart.length === 0) {
      setError('Choose at least one print first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await createPrintCheckout(token, { items: cart });
      if (!result.success) {
        setError(result.message);
        return;
      }
      window.location.assign(result.url);
    } catch {
      setError('We could not open checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`min-h-screen bg-[#F7F4F2] text-[#0F0F0F] ${cart.length > 0 ? 'pb-44' : ''}`}>
      <GalleryHeader token={token} eventTitle={eventTitle} backHref={`/gallery/${token}/prints`} backLabel="Print formats" />
      <GallerySteps active={3} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">03 · Choose photographs and sizes</p>
          <h1 className="mt-4 text-5xl font-bold leading-[0.9] tracking-[-0.055em] sm:text-7xl">Choose a moment.<br /><span className="font-serif font-normal italic text-[#C72C5B]">Make it tangible.</span></h1>
          <p className="mt-6 text-base text-black/50">Tap a size beneath any photograph. Adjust quantities in your basket, then continue to address and payment.</p>
          <Link href={`/gallery/${token}/prints`} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#C72C5B] underline decoration-[#C72C5B]/30 underline-offset-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Change print formats
          </Link>
        </div>

        {cancelled && <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">Nothing was charged. Your basket can be rebuilt below.</div>}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_370px] lg:items-start">
          <div className="grid gap-5 sm:grid-cols-2">
            {assets.map((asset) => (
              <article key={asset.id} className="overflow-hidden rounded-[1.6rem] bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-[#E9E2E0]"><Image src={asset.previewUrl} alt={asset.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" /></div>
                <div className="p-4 sm:p-5">
                  <p className="mb-4 text-sm font-bold">{asset.title}</p>
                  <div className={`grid ${productGridClass} gap-2`}>
                    {products.map((product) => {
                      const quantity = cart.find((item) => item.assetId === asset.id && item.productId === product.id)?.quantity || 0;
                      return (
                        <button key={product.id} type="button" onClick={() => add(asset.id, product.id)} className={`relative rounded-xl border px-2 py-3 text-center transition ${quantity > 0 ? 'border-[#C72C5B] bg-[#FFF2F6]' : 'border-black/10 hover:border-black/30'}`}>
                          <span className="block text-xs font-bold">{product.shortName}</span>
                          <span className="mt-1 block text-[10px] text-black/45">{formatMoney(product.unitAmount, currency)}</span>
                          {quantity > 0 && <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#C72C5B] text-[10px] font-bold text-white">{quantity}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-[1.8rem] bg-[#0F0F0F] p-6 text-white lg:sticky lg:top-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F08BAB]">Print basket</p><p className="mt-1 text-sm text-white/45">{itemCount} {itemCount === 1 ? 'print' : 'prints'}</p></div>
              <ShoppingBag className="h-5 w-5 text-white/45" />
            </div>

            <div className="max-h-[330px] space-y-4 overflow-y-auto py-5">
              {cart.length === 0 ? (
                <p className="py-8 text-center text-sm text-white/35">Your favourites will appear here.</p>
              ) : cart.map((item) => {
                const asset = assetMap.get(item.assetId);
                const product = productMap.get(item.productId);
                if (!asset || !product) return null;
                return (
                  <div key={`${item.assetId}:${item.productId}`} className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg"><Image src={asset.previewUrl} alt="" fill sizes="48px" className="object-cover" /></div>
                    <div className="min-w-0"><p className="truncate text-xs font-bold">{asset.title}</p><p className="mt-1 text-[11px] text-white/45">{product.shortName} · {formatMoney(product.unitAmount, currency)}</p></div>
                    <div className="flex items-center gap-2"><button type="button" aria-label="Decrease quantity" onClick={() => changeQuantity(item.assetId, item.productId, -1)} className="grid h-7 w-7 place-items-center rounded-full bg-white/10"><Minus className="h-3 w-3" /></button><span className="w-3 text-center text-xs font-bold">{item.quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => changeQuantity(item.assetId, item.productId, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white/10"><Plus className="h-3 w-3" /></button></div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-white/10 py-5 text-sm">
              <div className="flex justify-between text-white/55"><span>Subtotal</span><span>{formatMoney(subtotal, currency)}</span></div>
              <div className="flex justify-between text-white/55"><span>Tracked UK delivery</span><span>{formatMoney(deliveryAmount, currency)}</span></div>
              <div className="flex justify-between pt-2 text-lg font-bold"><span>Total</span><span>{formatMoney(subtotal + deliveryAmount, currency)}</span></div>
            </div>
            <p className="flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-center text-[11px] text-white/35"><Truck className="h-3.5 w-3.5" /> Address and payment are handled securely on the next screen</p>
          </aside>
        </div>
      </section>

      {cart.length > 0 && (
        <aside className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-5xl rounded-[1.6rem] border border-white/10 bg-[#12090D]/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-5">
          {error && <p role="alert" className="mb-3 rounded-xl bg-red-500/15 px-4 py-2.5 text-xs text-red-100">{error}</p>}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold">{itemCount} {itemCount === 1 ? 'frame' : 'frames'} · {formatMoney(subtotal, currency)} + {formatMoney(STANDARD_SHIPPING_AMOUNT, currency)} delivery</p>
              <p className="mt-1 hidden text-[11px] text-white/45 sm:block">Download these photos too, or continue to address and payment.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button type="button" onClick={() => setDownloadOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-black transition hover:bg-[#FFF0F4]">
                <Download className="h-4 w-4" /> <span className="sm:hidden">Download</span><span className="hidden sm:inline">Download photos</span>
              </button>
              <button type="button" onClick={checkout} disabled={loading} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-5 text-xs font-bold text-white transition hover:bg-[#E04472] disabled:cursor-wait disabled:opacity-60">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing…</> : <><span className="sm:hidden">Continue</span><span className="hidden sm:inline">Address &amp; payment</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
              </button>
            </div>
          </div>
        </aside>
      )}

      <DownloadShareDialog open={downloadOpen} onClose={() => setDownloadOpen(false)} token={token} eventTitle={eventTitle} assets={selectedAssets} />
    </main>
  );
}
