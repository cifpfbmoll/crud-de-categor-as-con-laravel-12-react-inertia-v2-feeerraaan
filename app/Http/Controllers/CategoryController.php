<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Muestra el listado de categorías.
     */
    public function index(): Response
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Almacena una nueva categoría.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'active' => 'boolean',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => '¡Categoría creada exitosamente!',
            'category' => $category,
        ], 201);
    }

    /**
     * Actualiza una categoría existente.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $id,
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'active' => 'boolean',
        ]);

        $category = Category::findOrFail($id);
        $category->update($validated);

        return response()->json([
            'message' => '¡Categoría actualizada exitosamente!',
            'category' => $category,
        ], 200);
    }

    /**
     * Elimina una categoría.
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->back()->with('success', '¡Categoría eliminada exitosamente!');
    }
}
