import Link from 'next/link'


export default function AdminSidebar({ slug }: { slug: string }) {
return (
<aside className="w-64 p-4 border-r h-screen sticky top-0 bg-white">
<div className="mb-6">
<h3 className="text-lg font-semibold">Panel — {slug}</h3>
<p className="text-sm text-muted-foreground">Administrador</p>
</div>


<nav className="space-y-2">
<Link href={`/${slug}/admin`} className="block p-2 rounded hover:bg-slate-50">
Dashboard
</Link>
<Link href={`/${slug}/admin/pedidos`} className="block p-2 rounded hover:bg-slate-50">
Pedidos
</Link>
<Link href={`/${slug}/admin/productos`} className="block p-2 rounded hover:bg-slate-50">
Productos
</Link>
<Link href={`/${slug}/admin/promociones`} className="block p-2 rounded hover:bg-slate-50">
Promociones
</Link>
<Link href={`/${slug}/admin/config`} className="block p-2 rounded hover:bg-slate-50">
Configuración
</Link>
</nav>
</aside>
)
}