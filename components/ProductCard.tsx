import { Product } from '@/types'
import Link from 'next/link'


export default function ProductCard({ product, slug }: { product: Product; slug: string }) {
return (
<div className="border rounded p-4 flex flex-col gap-3">
<div className="flex items-center gap-4">
<div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-sm">img</div>
<div>
<h4 className="font-medium">{product.name}</h4>
<div className="text-sm text-muted-foreground">${product.price.toFixed(0)}</div>
</div>
</div>


<p className="text-sm text-muted-foreground">{product.description || '—'}</p>


<div className="flex items-center justify-between">
<div className="text-sm">{product.available ? 'Disponible' : 'No disponible'}</div>
<div className="flex gap-2">
<Link href={`/${slug}/admin/productos/${product.id}`} className="px-3 py-1 rounded border text-sm">Editar</Link>
</div>
</div>
</div>
)
}