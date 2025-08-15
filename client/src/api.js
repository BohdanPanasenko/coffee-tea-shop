const API_URL = 'http://localhost:4000/api';

export async function fetchCategories()
{
    const r = await fetch(`${API_URL}/categories`);
    return r.json();
}

export async function fetchProducts({ category, query, page = 1 } = {})
{
    const qs = new URLSearchParams();
    if (category) qs.set('category', category);
    if (query) qs.set('query', query);
    qs.set('page', page);
    const r = await fetch(`${API_URL}/products?` + qs.toString());
    return r.json();
}

export async function fetchProduct(slug)
{
    const r = await fetch(`${API_URL}/products/${slug}`);
    return r.json();
}
