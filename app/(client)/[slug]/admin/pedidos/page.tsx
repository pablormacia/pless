import { supabase } from '@/lib/supabaseClient'


export default async function PedidosPage({ params }: { params: { slug: string } }) {
const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50)
const orders = data || []


return (
<div>
<h1 className="text-2xl font-bold mb-4">Pedidos</h1>
<div className="space-y-3">
{orders.map((o: any) => (
<div key={o.id} className="p-3 bg-white border rounded flex justify-between">
<div>
<div className="font-medium">#{o.id} — {o.customer_name}</div>
<div className="text-sm text-muted-foreground">{o.status}</div>
</div>
<div className="flex items-center gap-2">
<div className="text-sm">${o.total}</div>
<a href={`/${params.slug}/admin/pedidos/${o.id}`} className="px-3 py-1 border rounded text-sm">Ver</a>
</div>
</div>
))}
</div>
</div>
)
}