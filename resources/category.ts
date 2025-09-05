import { Resource } from "@/types/resources";
import { CreateCategory } from "@/validation";

const category: Resource = {
    name: 'Category',
    name_plural: 'Categories',
    model: 'category',
    resource: 'categories',
    menuIcon: '',
    rules: CreateCategory,
    form: [
        { name: 'title', type: 'text', label: 'Title' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'slug', type: 'text', label: 'Slug' },
    ],
    list: [
        { name: 'title', header: 'Title' },
        { name: 'description', header: 'Description' },        
    ],
};
export { category };