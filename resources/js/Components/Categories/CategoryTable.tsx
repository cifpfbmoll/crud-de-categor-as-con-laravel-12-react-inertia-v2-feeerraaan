import { Category } from '@/types';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
    
    const translateStatus = (active: boolean): string => {
        return active ? 'Activa' : 'Inactiva';
    };

    const getStatusClasses = (active: boolean): string => {
        const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
        return active ? `${baseClasses} bg-green-100 text-green-800` : `${baseClasses} bg-red-100 text-red-800`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Color
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {category.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {category.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {category.description || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {category.color ? (
                                    <div className="flex items-center gap-2">
                                        <span 
                                            className="w-6 h-6 rounded-full border border-gray-200" 
                                            style={{ backgroundColor: category.color }}
                                        ></span>
                                        <span>{category.color}</span>
                                    </div>
                                ) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={getStatusClasses(category.active)}>
                                    {translateStatus(category.active)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <SecondaryButton onClick={() => onEdit(category)}>
                                    Editar
                                </SecondaryButton>
                                <DangerButton onClick={() => onDelete(category.id)}>
                                    Eliminar
                                </DangerButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
