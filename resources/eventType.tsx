import { Resource } from "@/types/resources";
import { CreateEventType } from "@/validation";

const eventType: Resource = {
    name: 'Event type',
    name_plural: 'Event types',
    model: 'eventType',
    resource: 'eventTypes',
    menuIcon: '',
    rules: CreateEventType,    
    form: [
        { name: 'type', type: 'text', label: 'Type' },        
    ],
    list: [
        { name: 'type', header: 'Type' },
    ],
};
export { eventType };