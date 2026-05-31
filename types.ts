export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  inStock: boolean;
  tags: string[];
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  publishedAt: Date;
  likes: number;
}


export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

export type UpdateUserInput = Partial<Omit<User, 'id'>> & { id: number };

export type ProductCard = Pick<Product, 'id' | 'title' | 'price' | 'inStock'>;

export type TagCountMap = Record<string, number>;

export type PostContent = Omit<Post, 'id' | 'publishedAt' | 'likes'>;


// типизированный fetch
export async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data as T; // продвинутая типизация ответа, как подстраховка
}

// утилита для обновления объекта (иммутабельно)
export function updateItem<T extends { id: number }>(
  items: T[],
  updatedItem: T
): T[] {
  return items.map(item => (item.id === updatedItem.id ? updatedItem : item ));
}


// тип для разных статусов загрузки
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: string };

export type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

// функция-редьюсер, использующая union
export function handleAsyncState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading': return 'Loading...';
    case 'success': return `Data: ${state.data}`;
    case 'error': return `Error: ${state.error}`;
  }
}