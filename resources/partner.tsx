import { Resource } from "@/types/resources";
import { CreateOrganizer } from "@/validation";

const partner: Resource = {
    name: 'Partner',
    name_plural: 'Partners',
    model: 'partner',
    resource: 'partners',    
    menuIcon: '',    
    rules: CreateOrganizer,
    form: [
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'logo', type: 'upload', label: 'Logo' },
        { name: 'contact', type: 'text', label: 'Contact' },
    ],
    list: [
        { name: 'id', header: 'Id'},
        { name: 'name', header: 'Name' },
        { name: 'contact', header: 'Contact' },
    ],
};
export { partner };