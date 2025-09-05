import { Resource } from "@/types/resources";
import { CreateMediaType } from "@/validation";

const mediaType: Resource = {
    name: 'MediaType',
    name_plural: 'MediaType',
    model: 'mediaType',
    resource: 'mediaTypes',
    menuIcon: '',
    rules: CreateMediaType,    
    form: [
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'slug', type: 'text', label: 'Slug' },
    ],
    list: [
        { name: 'id', header: 'Id'},
        { name: 'name', header: 'Name' },
    ],
};
export { mediaType };