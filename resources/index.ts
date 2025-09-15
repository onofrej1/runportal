import { question } from "./guestion";
import { questionChoice } from "./questionChoice";
import { post } from "@/resources/post";
import { category } from "@/resources/category";
import { event } from "@/resources/event";
import { tag } from "@/resources/tag";
import { run } from "@/resources/run";
import { runCategory } from "@/resources/runCategory";
import { organizer } from "@/resources/organizer";
import { Resource } from "@/types/resources";
import { mediaComment } from "./mediaComment";
import { mediaCategory } from "./mediaCategory";
import { media } from "./media";
import { mediaType } from "./mediaType";
import { gallery } from "./gallery";
import { eventType } from "./eventType";
import { registration } from "./registration";
import { runResult } from "./runResult";
import { partner } from "./partner";

const resources: Resource[] = [
  registration,
  post,
  category,
  event,
  eventType,
  tag,
  run,
  runCategory,
  partner,
  organizer,
  question,
  questionChoice,
  gallery,
  media,
  mediaComment,
  mediaType,
  mediaCategory,
  runResult
];

export { resources };
