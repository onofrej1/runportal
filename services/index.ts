import { Filter, Resource } from "@/lib/resources";
import { User } from "@/generated/prisma";
//import { userService } from "./user-service";
//import { questionService } from "./question-service";
//import { questionChoiceService } from "./question-choice-service";
//import { venueService } from "./venue";
import { organizerService } from "./organizer";
import { postService } from "./post";
import { categoryService } from "./category";
import { tagService } from "./tag";
import { eventService } from "./event";
import { eventTypeService } from "./eventType";
import { runCategoryService } from "./runCategory";
import { runService } from "./run";
import { mediaService } from "./media";
import { mediaTypeService } from "./mediaType";
import { mediaCategoryService } from "./mediaCategory";
import { mediaCommentService } from "./mediaComment";
import { galleryService } from "./gallery";
import { registrationService } from "./registration";
import { runResultService } from "./runResult";

export type Pagination = {
  limit: number;
  offset: number;
};

export type OrderBy = {
  id: string;
  desc: boolean;
};

export type Search = {
  filters: Filter[];
  operator: "and" | "or";
};

export type SearchParam = {
  filters: Filter[];
  operator: "and" | "or";
};

export type ResourceFormData = Record<string, unknown>;

export type Resources = 
| User;

export type UpsertData = UnionToIntersection<Resources>; 

export type UnionToIntersection<U> = 
  (U extends unknown ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never;

type Service =  
  //| typeof userService
  //| typeof questionService
  //| typeof questionChoiceService
  | typeof organizerService
  | typeof postService
  //| typeof venueService
  | typeof categoryService
  | typeof tagService
  | typeof eventService
  | typeof eventTypeService
  | typeof runCategoryService
  | typeof mediaService
  | typeof mediaCategoryService
  | typeof mediaTypeService
  | typeof mediaCommentService
  | typeof runService
  | typeof registrationService
  | typeof runResultService
  | typeof galleryService;

const services = new Map<Resource, Service>([
  //["users", userService],
  //["venues", venueService],
  ["events", eventService],
  ["eventTypes", eventTypeService],
  ["organizers", organizerService],
  ["posts", postService],
  ["categories", categoryService],
  ["tags", tagService],
  ["runCategories", runCategoryService],
  ["runs", runService],
  //["questions", questionService],
  //["questionChoices", questionChoiceService],
  ["media", mediaService],
  ["mediaTypes", mediaTypeService],
  ["mediaCategories", mediaCategoryService],
  ["mediaComments", mediaCommentService],
  ['galleries', galleryService],
  ['registrations', registrationService],
  ['runResults', runResultService]
]);

export function getDataService(resource: Resource) {
  if (services.has(resource)) {
    return services.get(resource)!;
  }
  throw new Error('Service not found');
}



