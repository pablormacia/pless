import './globals.css'
import AdminSidebar from '@/components/AdminSidebar'


export const revalidate = 0


export default function AdminLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
const { slug } = params
return (
<div className="min-h-screen bg-slate-50">
<div className="max-w-8xl mx-auto flex">
<AdminSidebar slug={slug} />
<main className="flex-1 p-6">{children}</main>
</div>
</div>
)
}