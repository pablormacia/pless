import { supabase } from '@/lib/supabaseClient'


export default async function AdminDashboard({ params }: { params: { slug: string } }) {
// placeholder: puedes traer datos reales de supabase aquí
const { data: recentOrders } = await supabase.from('orders').select('*').limit(5)


return (
<div>
<header className="mb-6">
<h1 className="text-2xl font-bold">Dashboard</h1>
<p className="text-sm text-muted-foreground">Resumen rápido del negocio</p>
</header>


<section className="grid grid-cols-3 gap-4 mb-6">
<div className="p-4 bg-white rounded border">Pedidos hoy<br />12</div>
<div className="p-4 bg-white rounded border">Ingresos<br />$ 45.000</div>
<div className="p-4 bg-white rounded border">Pedidos abiertos<br />3</div>
</section>


<section>
<h2 className="text-lg font-medium mb-3">Pedidos recientes</h2>
<div className="space-y-3">
{recentOrders?.map((o: any) => (
<div key={o.id} className="p-3 bg-white border rounded flex justify-between">
<div>
<div className="font-medium">Pedido #{o.id}</div>
<div className="text-sm text-muted-foreground">{o.customer_name} — {o.status}</div>
</div>
<div className="text-sm">${o.total}</div>
</div>
))}
</div>
</section>
</div>
)
}