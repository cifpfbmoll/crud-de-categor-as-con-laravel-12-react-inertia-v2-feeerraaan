import { useState, useEffect, FormEventHandler } from 'react';
import { Category } from '@/types';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (category: Category) => void;
    mode: 'create' | 'edit';
    category?: Category | null;
}

interface FormData {
    name: string;
    description: string;
    color: string;
    active: boolean;
}

interface FormErrors {
    name?: string;
    description?: string;
    color?: string;
    active?: string;
}

export default function CategoryModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    mode, 
    category 
}: CategoryModalProps) {
    const initialFormData: FormData = {
        name: '',
        description: '',
        color: '#000000',
        active: true,
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                color: category.color || '#000000',
                active: category.active,
            });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [mode, category, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setProcessing(true);

        try {
            const url = mode === 'create' 
                ? '/categories' 
                : `/categories/${category?.id}`;
            
            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>(
                        'meta[name="csrf-token"]'
                    )?.content || '',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess(data.category);
                onClose();
                setFormData(initialFormData);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                }
            }
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {mode === 'create' ? 'Crear Nueva Categoría' : 'Editar Categoría'}
                </h2>

                <div className="mb-4">
                    <InputLabel htmlFor="name" value="Nombre *" />
                    <TextInput
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="mt-1 block w-full"
                        autoFocus
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="description" value="Descripción" />
                    <TextInput
                        id="description"
                        type="text"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="color" value="Color" />
                    <div className="flex gap-2">
                        <TextInput
                            id="color"
                            type="color"
                            value={formData.color}
                            onChange={(e) => handleChange('color', e.target.value)}
                            className="mt-1 block h-10 w-20 p-1"
                        />
                        <TextInput
                            type="text"
                            value={formData.color}
                            onChange={(e) => handleChange('color', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="#RRGGBB"
                        />
                    </div>
                    <InputError message={errors.color} className="mt-2" />
                </div>

                <div className="mb-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="active"
                            checked={formData.active}
                            onChange={(e) => handleChange('active', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Activa</span>
                    </label>
                    <InputError message={errors.active} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
