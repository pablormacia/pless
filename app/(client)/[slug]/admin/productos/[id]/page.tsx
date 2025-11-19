'use client'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'


export default function EditProduct({ params }: { params: { slug: string; id: string } }) {
const router = useRouter()
const [name, setName] = useState('')
const [price, setPrice] = useState<number | ''>('')
const [available, setAvailable] = useState(true)


async function save() {
// ejemplo simple: actualiza en supabase
await supabase.from('products').update({ name, price, available }).eq('id', params.id)
router.push(`/${params.slug}/admin/productos`)
}


return (
<div>
<h1 className="text-2xl font-bold mb-4">Editar producto</h1>
<div className="max-w-xl bg-white p-6 rounded border">
<label className="block mb-2">Nombre</label>
<input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2 mb-4" />


<label className="block mb-2">Precio</label>
<input type="number" value={price as any} onChange={(e) => setPrice(Number(e.target.value))} className="w-full border rounded p-2 mb-4" />


<label className="flex items-center gap-2 mb-4">
<input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} /> Disponible
</label>


<div className="flex gap-2">
<button onClick={() => router.back()} className="px-4 py-2 border rounded">Cancelar</button>
<button onClick={save} className="px-4 py-2 bg-slate-900 text-white rounded">Guardar</button>
</div>
</div>
</div>
)
}