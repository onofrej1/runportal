import { Resource } from "@/types/resources";
import { CreateMediaCategory } from "@/validation";

const mediaCategory: Resource = {
    name: 'Media Category',
    name_plural: 'Media categories',
    model: 'mediaCategory',
    resource: 'mediaCategories',
    menuIcon: '',
    rules: CreateMediaCategory,    
    form: [
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'details', type: 'text', label: 'Details' },
    ],
    list: [
        { name: 'id', header: 'Id'},
        { name: 'name', header: 'Name' },
        { name: 'details', header: 'Details' },
    ],
};
export { mediaCategory };