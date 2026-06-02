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



// ===== Advanced types 

// Mapped types
// сделать все поля Readonly
export type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Сделать все поля опциональными
export type MyPartial<T> = { [K in keyof T]?: T[K] };

// сделать все поля nullable (null | undefined)
export type Nullable<T> = { [K in keyof T]: T[K] | null };


// Confitional types + infer
// Определить, является ли тип функцией
export type IsFunction<T> = T extends (...args: unknown[]) => unknown ? true : false;

// Получить тип возвращаемого значения функции (аналог ReturnType)
export type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

// Получить тип элемента массива (если массив, иначе сам тип)
export type ArrayElement<T> = T extends (infer U)[] ? U : T;


// keyof + indexed access + conditional
// тип, который достаёт тип поля по его имени (с проверкой, что поле существует)
export type GetFieldType<T, K extends keyof T> = T[K];
// GetFieldType<User, 'email'> -> string

// тип, который делает поле опциональным, с оатльные оставляет как есть
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// MakeOptional<User, 'age' | 'isActive'>


// Трансформер API (snake_case -> camelCase)
// вспомогательный тип для преобразования строки из snake_case в camelCase
export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

// преобразование ключей всего объекта
export type SnakeToCamel<T> = {
  [K in keyof T as SnakeToCamelCase<K & string>]: T[K];
};

// пример:
type ApiUser = {
  user_id: number;
};

type NormilizedUser = SnakeToCamel<ApiUser>;
// NormilizedUser -> { userId: number }

// DeepReadonly<T>, который рекурсивно делает все вложенные объекты readonly
export type DeepReadonly<T> = T extends (infer U)[]
  ? readonly DeepReadonly<U>[]
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;