import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed, LogOut, LayoutGrid, Tag, Image, Star, Settings, Users,
  Plus, Pencil, Trash2, X, Check, Eye, EyeOff, ArrowUp, ArrowDown, Save, Shield
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useCategories, useGallery, useMenuItems, useReviews, useSiteSettings } from '@/lib/hooks';
import type { Category, GalleryImage, MenuItem, OpeningHours, Review, SiteSettings } from '@/lib/types';
import { StarRating } from '@/components/ui/StarRating';

type Tab = 'overview' | 'menu' | 'categories' | 'gallery' | 'reviews' | 'settings' | 'staff';

export function AdminDashboard() {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');

  const { categories, refresh: refreshCategories } = useCategories();
  const { items, refresh: refreshItems } = useMenuItems();
  const { reviews, refresh: refreshReviews } = useReviews();
  const { images, refresh: refreshGallery } = useGallery();
  const { settings, refresh: refreshSettings } = useSiteSettings();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const navItems: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'staff', label: 'Staff', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 bg-ink-950 text-ink-300 md:min-h-screen flex md:flex-col md:sticky md:top-0">
        <div className="p-6 border-b border-ink-800 hidden md:block">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-ember-600 flex items-center justify-center">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="font-serif text-lg font-bold text-white">Food Junction</span>
          </div>
          <p className="text-xs text-ink-500 mt-2">Management Dashboard</p>
        </div>

        <nav className="flex md:flex-col gap-1 p-3 md:p-4 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                tab === item.id ? 'bg-ember-600 text-white' : 'text-ink-300 hover:bg-ink-800'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="md:mt-auto p-4 border-t border-ink-800 hidden md:block">
          <p className="text-xs text-ink-500 mb-2 truncate">{session?.user?.email}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-ink-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {tab === 'overview' && <OverviewTab categories={categories} items={items} reviews={reviews} images={images} setTab={setTab} />}
        {tab === 'menu' && <MenuTab categories={categories} items={items} refresh={refreshItems} />}
        {tab === 'categories' && <CategoriesTab categories={categories} refresh={refreshCategories} />}
        {tab === 'gallery' && <GalleryTab images={images} refresh={refreshGallery} />}
        {tab === 'reviews' && <ReviewsTab reviews={reviews} refresh={refreshReviews} />}
        {tab === 'settings' && <SettingsTab settings={settings} refresh={refreshSettings} />}
        {tab === 'staff' && <StaffTab session={session} />}
      </main>
    </div>
  );
}

/* ===== Overview ===== */
function OverviewTab({ categories, items, reviews, images, setTab }: {
  categories: Category[];
  items: MenuItem[];
  reviews: Review[];
  images: GalleryImage[];
  setTab: (t: Tab) => void;
}) {
  const pendingReviews = reviews.filter((r) => !r.is_approved).length;

  const stats = [
    { label: 'Menu Items', value: items.length, icon: UtensilsCrossed, tab: 'menu' as Tab, color: 'bg-ember-100 text-ember-600' },
    { label: 'Categories', value: categories.length, icon: Tag, tab: 'categories' as Tab, color: 'bg-blue-100 text-blue-600' },
    { label: 'Gallery Images', value: images.length, icon: Image, tab: 'gallery' as Tab, color: 'bg-forest-500/10 text-forest-600' },
    { label: 'Reviews', value: reviews.length, icon: Star, tab: 'reviews' as Tab, color: 'bg-amber-100 text-amber-600' },
    { label: 'Staff', value: 0, icon: Users, tab: 'staff' as Tab, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">Welcome back</h1>
      <p className="text-ink-500 mb-8">Here's what's happening at Food Junction.</p>

      {pendingReviews > 0 && (
        <button
          onClick={() => setTab('reviews')}
          className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center justify-between hover:bg-amber-100 transition-colors"
        >
          <span className="text-amber-800 font-medium">{pendingReviews} review{pendingReviews > 1 ? 's' : ''} pending approval</span>
          <span className="text-amber-600 text-sm font-semibold">Review now →</span>
        </button>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => setTab(stat.tab)}
            className="bg-white rounded-2xl p-6 border border-ink-100 text-left hover:shadow-lg hover:shadow-ink-900/5 transition-all"
          >
            <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={22} />
            </div>
            <p className="font-serif text-3xl font-bold text-ink-900">{stat.value}</p>
            <p className="text-ink-500 text-sm mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-ink-100">
        <h2 className="font-serif text-xl font-semibold text-ink-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setTab('menu')} className="bg-ember-600 hover:bg-ember-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Add Menu Item
          </button>
          <button onClick={() => setTab('gallery')} className="bg-ink-100 hover:bg-ink-200 text-ink-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Add Gallery Photo
          </button>
          <button onClick={() => setTab('settings')} className="bg-ink-100 hover:bg-ink-200 text-ink-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Edit Site Info
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Menu Items ===== */
function MenuTab({ categories, items, refresh }: {
  categories: Category[];
  items: MenuItem[];
  refresh: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    await refresh();
  };

  const handleToggle = async (item: MenuItem, field: 'is_available' | 'is_featured') => {
    await supabase.from('menu_items').update({ [field]: !item[field] }).eq('id', item.id);
    await refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Menu Items</h1>
          <p className="text-ink-500 text-sm mt-1">{items.length} items across {categories.length} categories</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-ember-600 hover:bg-ember-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Item</th>
                <th className="text-left px-6 py-3 font-medium">Category</th>
                <th className="text-left px-6 py-3 font-medium">Price</th>
                <th className="text-center px-6 py-3 font-medium">Available</th>
                <th className="text-center px-6 py-3 font-medium">Featured</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-ink-100" />
                      )}
                      <div>
                        <p className="font-medium text-ink-900">{item.name}</p>
                        {item.description && <p className="text-xs text-ink-400 line-clamp-1 max-w-xs">{item.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink-600 text-sm">{catName(item.category_id)}</td>
                  <td className="px-6 py-4 text-ink-700 font-medium text-sm">Rs. {Number(item.price).toFixed(0)}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleToggle(item, 'is_available')} className="p-1.5 rounded-lg hover:bg-ink-50 transition-colors">
                      {item.is_available ? <Eye size={18} className="text-forest-600" /> : <EyeOff size={18} className="text-ink-300" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleToggle(item, 'is_featured')} className="p-1.5 rounded-lg hover:bg-ink-50 transition-colors">
                      <Star size={18} className={item.is_featured ? 'fill-ember-500 text-ember-500' : 'text-ink-300'} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-ink-50 transition-colors">
                        <Pencil size={16} className="text-ink-500" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <p className="text-center text-ink-400 py-12">No menu items yet. Click "Add Item" to create one.</p>}
      </div>

      {showForm && (
        <MenuItemForm
          item={editing}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={async () => { setShowForm(false); await refresh(); }}
        />
      )}
    </div>
  );
}

function MenuItemForm({ item, categories, onClose, onSaved }: {
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: item?.name ?? '',
    description: item?.description ?? '',
    price: item?.price ?? 0,
    image_url: item?.image_url ?? '',
    category_id: item?.category_id ?? categories[0]?.id ?? '',
    is_available: item?.is_available ?? true,
    is_featured: item?.is_featured ?? false,
    sort_order: item?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (item) {
      await supabase.from('menu_items').update(form).eq('id', item.id);
    } else {
      await supabase.from('menu_items').insert(form);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Modal title={item ? 'Edit Menu Item' : 'Add Menu Item'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass} rows={2} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (NPR)">
            <input type="number" required min={0} step="1" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              className={inputClass} />
          </Field>
          <Field label="Category">
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className={inputClass}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Image URL">
          <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className={inputClass} placeholder="https://..." />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sort Order">
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className={inputClass} />
          </Field>
          <div className="flex items-end gap-4 pb-1">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
              Featured
            </label>
          </div>
        </div>
        <FormActions saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  );
}

/* ===== Categories ===== */
function CategoriesTab({ categories, refresh }: { categories: Category[]; refresh: () => Promise<void> }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? All menu items in it will also be deleted.')) return;
    await supabase.from('categories').delete().eq('id', id);
    await refresh();
  };

  const move = async (cat: Category, dir: -1 | 1) => {
    await supabase.from('categories').update({ sort_order: cat.sort_order + dir }).eq('id', cat.id);
    await refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Categories</h1>
          <p className="text-ink-500 text-sm mt-1">Organize your menu into sections</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-ember-600 hover:bg-ember-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="bg-white rounded-2xl p-5 border border-ink-100">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-serif text-lg font-semibold text-ink-900">{cat.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => move(cat, -1)} disabled={idx === 0} className="p-1 rounded hover:bg-ink-50 disabled:opacity-30">
                  <ArrowUp size={16} className="text-ink-400" />
                </button>
                <button onClick={() => move(cat, 1)} disabled={idx === categories.length - 1} className="p-1 rounded hover:bg-ink-50 disabled:opacity-30">
                  <ArrowDown size={16} className="text-ink-400" />
                </button>
              </div>
            </div>
            <p className="text-xs text-ink-400 mb-3">/{cat.slug}</p>
            {cat.description && <p className="text-sm text-ink-600 mb-4">{cat.description}</p>}
            <div className="flex gap-2">
              <button onClick={() => { setEditing(cat); setShowForm(true); }} className="flex-1 text-sm bg-ink-100 hover:bg-ink-200 text-ink-700 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(cat.id)} className="px-3 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <CategoryForm item={editing} onClose={() => setShowForm(false)} onSaved={async () => { setShowForm(false); await refresh(); }} />
      )}
    </div>
  );
}

function CategoryForm({ item, onClose, onSaved }: { item: Category | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: item?.name ?? '',
    slug: item?.slug ?? '',
    description: item?.description ?? '',
    sort_order: item?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (item) {
      await supabase.from('categories').update({ ...form, slug }).eq('id', item.id);
    } else {
      await supabase.from('categories').insert({ ...form, slug });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Modal title={item ? 'Edit Category' : 'Add Category'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Slug (leave blank to auto-generate)">
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder="e.g. momo" />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows={2} />
        </Field>
        <Field label="Sort Order">
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
        </Field>
        <FormActions saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  );
}

/* ===== Gallery ===== */
function GalleryTab({ images, refresh }: { images: GalleryImage[]; refresh: () => Promise<void> }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    await refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Gallery</h1>
          <p className="text-ink-500 text-sm mt-1">{images.length} images</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-ember-600 hover:bg-ember-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative rounded-xl overflow-hidden bg-ink-100">
            <img src={img.image_url} alt={img.caption ?? ''} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => { setEditing(img); setShowForm(true); }} className="p-2 bg-white/90 rounded-lg">
                <Pencil size={16} className="text-ink-700" />
              </button>
              <button onClick={() => handleDelete(img.id)} className="p-2 bg-white/90 rounded-lg">
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
            {img.caption && <p className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-ink-950/80 to-transparent text-white text-xs">{img.caption}</p>}
          </div>
        ))}
      </div>

      {images.length === 0 && <p className="text-center text-ink-400 py-12">No gallery images yet.</p>}

      {showForm && (
        <GalleryForm item={editing} onClose={() => setShowForm(false)} onSaved={async () => { setShowForm(false); await refresh(); }} />
      )}
    </div>
  );
}

function GalleryForm({ item, onClose, onSaved }: { item: GalleryImage | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    image_url: item?.image_url ?? '',
    caption: item?.caption ?? '',
    sort_order: item?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (item) {
      await supabase.from('gallery').update(form).eq('id', item.id);
    } else {
      await supabase.from('gallery').insert(form);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Modal title={item ? 'Edit Image' : 'Add Image'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Image URL">
          <input type="url" required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
        </Field>
        {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-xl" />}
        <Field label="Caption">
          <input type="text" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Sort Order">
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
        </Field>
        <FormActions saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  );
}

/* ===== Reviews ===== */
function ReviewsTab({ reviews, refresh }: { reviews: Review[]; refresh: () => Promise<void> }) {
  const toggleApproval = async (review: Review) => {
    await supabase.from('reviews').update({ is_approved: !review.is_approved }).eq('id', review.id);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    await refresh();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-ink-900">Reviews</h1>
        <p className="text-ink-500 text-sm mt-1">{reviews.filter(r => r.is_approved).length} approved · {reviews.filter(r => !r.is_approved).length} pending</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-2xl p-6 border ${review.is_approved ? 'border-ink-100' : 'border-amber-300 bg-amber-50/50'}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ember-100 text-ember-700 font-semibold flex items-center justify-center">
                  {review.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-ink-900">{review.author_name}</p>
                  {review.author_location && <p className="text-xs text-ink-400">{review.author_location}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleApproval(review)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    review.is_approved ? 'bg-forest-500/10 text-forest-600 hover:bg-forest-500/20' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  {review.is_approved ? <span className="flex items-center gap-1"><Check size={14} /> Approved</span> : 'Pending'}
                </button>
                <button onClick={() => handleDelete(review.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
            <p className="text-ink-600 text-sm mb-3">{review.body}</p>
            <div className="flex flex-wrap gap-4 text-xs text-ink-400">
              <span className="flex items-center gap-1">Food: <StarRating value={review.rating_food} size={10} /></span>
              <span className="flex items-center gap-1">Service: <StarRating value={review.rating_service} size={10} /></span>
              <span className="flex items-center gap-1">Atmosphere: <StarRating value={review.rating_atmosphere} size={10} /></span>
              {review.visit_date && <span>· {review.visit_date}</span>}
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && <p className="text-center text-ink-400 py-12">No reviews yet.</p>}
    </div>
  );
}

/* ===== Settings ===== */
function SettingsTab({ settings, refresh }: { settings: SiteSettings | null; refresh: () => Promise<void> }) {
  const [form, setForm] = useState<SiteSettings | null>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync when settings loads
  if (settings && form?.id !== settings.id) setForm(settings);
  if (!form) return <p className="text-ink-400">Loading settings...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('site_settings').update({
      restaurant_name: form.restaurant_name,
      tagline: form.tagline,
      about: form.about,
      address: form.address,
      map_embed_url: form.map_embed_url,
      phone: form.phone,
      email: form.email,
      opening_hours: form.opening_hours,
      updated_at: new Date().toISOString(),
    }).eq('id', 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    await refresh();
  };

  const updateHour = (day: string, value: string) => {
    setForm({ ...form, opening_hours: { ...form.opening_hours!, [day]: value } });
  };

  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const dayLabels: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink-900 mb-6">Site Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-ink-100 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-ink-900">General</h2>
          <Field label="Restaurant Name">
            <input type="text" value={form.restaurant_name} onChange={(e) => setForm({ ...form, restaurant_name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Tagline">
            <input type="text" value={form.tagline ?? ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputClass} />
          </Field>
          <Field label="About / Story">
            <textarea value={form.about ?? ''} onChange={(e) => setForm({ ...form, about: e.target.value })} className={inputClass} rows={4} />
          </Field>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink-100 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-ink-900">Contact</h2>
          <Field label="Address">
            <input type="text" value={form.address ?? ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input type="text" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Google Maps Embed URL">
            <input type="url" value={form.map_embed_url ?? ''} onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })} className={inputClass} />
          </Field>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink-100 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-ink-900">Opening Hours</h2>
          <div className="grid grid-cols-2 gap-3">
            {days.map((day) => (
              <Field key={day} label={dayLabels[day]}>
                <input type="text" value={form.opening_hours?.[day as keyof OpeningHours] ?? ''} onChange={(e) => updateHour(day, e.target.value)} className={inputClass} placeholder="8:00 AM – 9:00 PM" />
              </Field>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-ember-600 hover:bg-ember-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-forest-600 text-sm font-medium">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

/* ===== Shared UI ===== */
const inputClass = 'w-full bg-cream-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-900 placeholder-ink-300 focus:border-ember-500 focus:outline-none focus:ring-1 focus:ring-ember-500 transition-colors text-sm';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-ink-600 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-ink-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-ink-100 sticky top-0 bg-white">
          <h2 className="font-serif text-xl font-semibold text-ink-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink-50 transition-colors">
            <X size={20} className="text-ink-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FormActions({ saving, onCancel }: { saving: boolean; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-ink-600 hover:bg-ink-50 transition-colors text-sm font-medium">
        Cancel
      </button>
      <button type="submit" disabled={saving} className="bg-ember-600 hover:bg-ember-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

/* ===== Staff ===== */
interface StaffMember {
  id: string;
  email: string;
  display_name: string;
  role: 'owner' | 'staff';
  created_at: string;
}

function StaffTab({ session }: { session: { user?: { id?: string } } | null }) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = session?.user?.id;

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.functions.invoke('manage-staff', {
      method: 'GET',
    });
    if (fetchError) {
      setError(fetchError.message);
    } else if (Array.isArray(data)) {
      setStaff(data as StaffMember[]);
    } else if (data?.error) {
      setError(data.error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this staff member? They will lose access immediately.')) return;
    const { error: delError } = await supabase.functions.invoke('manage-staff', {
      method: 'DELETE',
      body: { id },
    });
    if (delError) {
      setError(delError.message);
      return;
    }
    await fetchStaff();
  };

  const isOwner = staff.some((s) => s.id === currentUserId && s.role === 'owner');

  if (loading) {
    return <p className="text-ink-400">Loading staff...</p>;
  }

  if (!isOwner) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">Staff</h1>
        <div className="bg-white rounded-2xl p-8 border border-ink-100 text-center">
          <Shield className="mx-auto text-ink-300 mb-4" size={40} />
          <p className="text-ink-500">Only the owner can manage staff accounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Staff</h1>
          <p className="text-ink-500 text-sm mt-1">Manage who can access the dashboard</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-ember-600 hover:bg-ember-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-left px-6 py-3 font-medium">Email</th>
                <th className="text-left px-6 py-3 font-medium">Role</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-ember-100 text-ember-700 font-semibold flex items-center justify-center">
                        {member.display_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-ink-900">{member.display_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink-600 text-sm">{member.email}</td>
                  <td className="px-6 py-4">
                    {member.role === 'owner' ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-ember-100 text-ember-700 px-2.5 py-1 rounded-full font-medium">
                        <Shield size={12} /> Owner
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-ink-100 text-ink-600 px-2.5 py-1 rounded-full font-medium">
                        <Users size={12} /> Staff
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.id !== currentUserId && (
                      <button onClick={() => handleDelete(member.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    )}
                    {member.id === currentUserId && (
                      <span className="text-xs text-ink-400">You</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staff.length === 0 && <p className="text-center text-ink-400 py-12">No staff members found.</p>}
      </div>

      {showForm && (
        <StaffForm onClose={() => setShowForm(false)} onSaved={async () => { setShowForm(false); await fetchStaff(); }} />
      )}
    </div>
  );
}

function StaffForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    display_name: '',
    role: 'staff' as 'staff' | 'owner',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { data, error: invokeError } = await supabase.functions.invoke('manage-staff', {
      method: 'POST',
      body: form,
    });
    setSaving(false);
    if (invokeError) {
      setError(invokeError.message);
      return;
    }
    if (data?.error) {
      setError(data.error);
      return;
    }
    onSaved();
  };

  return (
    <Modal title="Add Staff Member" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}
        <Field label="Display Name">
          <input type="text" required value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            className={inputClass} placeholder="e.g. Ram Sharma" />
        </Field>
        <Field label="Email">
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass} placeholder="staff@foodjunction.com.np" />
        </Field>
        <Field label="Password">
          <input type="text" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputClass} placeholder="At least 6 characters" />
        </Field>
        <Field label="Role">
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'staff' | 'owner' })}
            className={inputClass}>
            <option value="staff">Staff — can manage menu, gallery, reviews</option>
            <option value="owner">Owner — full access including staff management</option>
          </select>
        </Field>
        <FormActions saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  );
}
