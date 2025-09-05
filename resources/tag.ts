import { Resource } from "@/types/resources";
import { CreateTag } from "@/validation";

const tag: Resource = {
    name: 'Tag',
    name_plural: 'Tags',
    model: 'tag',
    resource: 'tags',        
    menuIcon: '',
    rules: CreateTag,
    form: [
        { name: 'title', type: 'text', label: 'Title' },
        { name: 'description', type: 'text', label: 'Description' },
    ],
    list: [
        { name: 'title', header: 'Title' },
        { name: 'description', header: 'Description' },
    ],
};
export { tag };