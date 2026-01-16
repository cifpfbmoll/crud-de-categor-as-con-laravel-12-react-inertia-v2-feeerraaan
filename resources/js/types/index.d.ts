export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

/**
 * Tipo para representar un Producto del CRUD.
 * Refleja la estructura de la tabla 'products' en la base de datos.
 */
export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'discontinued';
    category_id: number | null;
    category?: Category | null;
    created_at: string;
    updated_at: string;
}

/**
 * Props para las páginas con productos.
 */
export interface ProductsPageProps extends Record<string, unknown> {
    products: Product[];
    categories: Category[];
}

export interface Category {
    id: number;
    name: string;
    description: string | null;
    color: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CategoriesPageProps extends Record<string, unknown> {
    categories: Category[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
