import { supabase } from '@/lib/supabaseClient'


export default async function PedidoDetail({ params }: { params: { slug: string; id: string } }) {
const { data } = await supabase.from('orders').select('*').eq('id', params.id).single()
const order = data


if (!order) return <div>Pedido no encontrado</div>


return (
<div>
<h1 className="text-2xl font-bold mb-4">Pedido #{order.id}</h1>
<div className="bg-white p-4 rounded border max-w-2xl">
<div className="mb-2">Cliente: {order.customer_name}</div>
<div className="mb-2">Estado: {order.status}</div>
<div className="mb-2">Total: ${order.total}</div>
<div className="mt-4">
<h3 className="font-medium mb-2">Items</h3>
<ul className="list-disc pl-6">
{order.items?.map((it: any, i: number) => (
<li key={i}>{it.name} x{it.quantity}</li>
))}
</ul>
</div>
</div>
</div>
)
}