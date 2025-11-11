import ProductCard from '@/components/ProductCard'
import { supabase } from '@/lib/supabaseClient'


export default async function ProductosPage({ params }: { params: { slug: string } }) {
const { data } = await supabase.from('products').select('*').order('name')
const products = data || []


return (
<div>
<div className="flex items-center justify-between mb-6">
<h1 className="text-2xl font-bold">Productos</h1>
<a href={`/${params.slug}/admin/productos/nuevo`} className="px-4 py-2 rounded bg-slate-900 text-white">Nuevo producto</a>
</div>


<div className="grid grid-cols-3 gap-4">
{products.map((p: any) => (
<ProductCard key={p.id} product={p} slug={params.slug} />
))}
</div>
</div>
)
}