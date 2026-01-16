import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Category, PageProps, CategoriesPageProps } from '@/types';
import CategoryTable from '@/Components/Categories/CategoryTable';
import CategoryModal from '@/Components/Categories/CategoryModal';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, categories }: PageProps<CategoriesPageProps>) {
    const [data, setData] = useState<Category[]>(categories);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        setData(categories);
    }, [categories]);

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            router.delete(`/categories/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setData(prev => prev.filter(c => c.id !== id));
                },
            });
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleCategoryUpdate = (updatedCategory: Category) => {
        setData(prev => 
            prev.map(c => c.id === updatedCategory.id ? updatedCategory : c)
        );
    };

    const handleCategoryCreate = (newCategory: Category) => {
        setData(prev => [newCategory, ...prev]);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Gestión de Categorías
                    </h2>
                    <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                        + Nueva Categoría
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Categorías" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <CategoryTable 
                                categories={data}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                            
                            {data.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No hay categorías registradas. ¡Crea la primera!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CategoryModal
                isOpen={isCreateModalOpen}
                mode="create"
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCategoryCreate}
            />

            <CategoryModal
                isOpen={isEditModalOpen}
                mode="edit"
                category={selectedCategory}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategory(null);
                }}
                onSuccess={handleCategoryUpdate}
            />
        </AuthenticatedLayout>
    );
}
