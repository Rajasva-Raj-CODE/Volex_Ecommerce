import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.schema";
export declare function listCategories(): Promise<({
    children: ({
        children: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            sortOrder: number;
            imageUrl: string | null;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
        imageUrl: string | null;
        parentId: string | null;
    })[];
} & {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    sortOrder: number;
    imageUrl: string | null;
    parentId: string | null;
})[]>;
export declare function listCategoriesFlat(): Promise<({
    parent: {
        name: string;
        id: string;
    } | null;
} & {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    sortOrder: number;
    imageUrl: string | null;
    parentId: string | null;
})[]>;
export declare function getCategory(idOrSlug: string): Promise<{
    parent: {
        name: string;
        id: string;
        slug: string;
    } | null;
    children: {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
        imageUrl: string | null;
        parentId: string | null;
    }[];
} & {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    sortOrder: number;
    imageUrl: string | null;
    parentId: string | null;
}>;
export declare function createCategory(input: CreateCategoryInput): Promise<{
    parent: {
        name: string;
        id: string;
    } | null;
} & {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    sortOrder: number;
    imageUrl: string | null;
    parentId: string | null;
}>;
export declare function updateCategory(id: string, input: UpdateCategoryInput): Promise<{
    parent: {
        name: string;
        id: string;
    } | null;
} & {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    sortOrder: number;
    imageUrl: string | null;
    parentId: string | null;
}>;
export declare function deleteCategory(id: string): Promise<void>;
//# sourceMappingURL=categories.service.d.ts.map