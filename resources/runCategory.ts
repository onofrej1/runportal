import { Resource } from "@/types/resources";
import { CreateRunCategory } from "@/validation";

const runCategory: Resource = {
    name: 'Category',
    name_plural: 'Categories',
    model: 'runCategory',
    resource: 'runCategories',    
    menuIcon: '',    
    rules: CreateRunCategory,    
    form: [
        { name: 'category', type: 'text', label: 'Category' },
        { name: 'title', type: 'text', label: 'Title' },
        { name: 'order', type: 'number', label: 'Display order' },
    ],
    list: [
        { name: 'category', header: 'Category' },
        { name: 'title', header: 'Title' },
        { name: 'order', header: 'Display order' },
    ],
};
export { runCategory };