import { category } from "@/resources/category";
import { z } from "zod";

const many2many = z
  .array(z.object({ value: z.string(), label: z.string() }))
  .transform((arr) => {
    return arr.map((v) => Number(v.value));
  })
  .optional()
  .default([]);

const richText = z
  .object({ type: z.string(), content: z.array(z.any()) })
  .transform((obj) => {
    return JSON.stringify(obj);
  });

//const dateValue = z.coerce.date();
const stringValue = z.string().trim().min(1, "Field is required");
const emailValue = z.email();
const idValue = z.number().optional();
const numberValue = z.coerce.number();
const optionalString = z.string().optional();

export const LoginUser = z.object({
  email: z.string('Prosim zadajte "Meno"'),
  password: z.string('Prosim zadajte "Heslo"'),
});

export const RegisterUser = z.object({
  //firstName: stringValue,
  name: z.string('Prosim zadajte "Meno"'),
  email: z.string('Prosim zadajte "Email"'),
  dob: z.date('Prosim zadajte "Datum narodenia"'),
  gender: z.string('Prosim vyberte "Pohlavie"'),
  password: z.string('Prosim zadajte "Heslo"'),
});

export const ResetPasswordRequest = z.object({
  email: emailValue,
});

export const ResetPassword = z.object({
  password: emailValue,
});

export const ChangePassword = z.object({
  password: stringValue,
  confirmPassword: stringValue,
});

// Blog
export const CreatePost = z.object({
  id: idValue,
  title: stringValue,
  status: stringValue,
  summary: stringValue,
  views: numberValue,
  enableComments: z.boolean(),
  content: richText,
  authorId: z.string().min(1, "Author field is required"),
  categories: many2many,
  tags: many2many, //z.array(z.coerce.number()).optional().default([]),
  cover: z.any().optional().nullable(),
});

export const CreateCategory = z.object({
  id: idValue,
  title: stringValue,
  description: stringValue,
});

export const CreateTag = z.object({
  id: idValue,
  title: stringValue,
  description: stringValue,
});

// Events
export const CreateEvent = z.object({
  id: idValue,
  name: stringValue,
  description: stringValue,
  status: stringValue,
  contact: stringValue,
  color: stringValue,
  location: optionalString,
  venueId: z.coerce.number().nullable(),
  organizerId: z.coerce.number().nullable(),
  maxAttendees: z.coerce.number().nullable(),
  startDate: z.date(),
  endDate: z.date(),
});

export const CreateEventType = z.object({
  id: idValue,
  type: stringValue,
});

export const CreateRunCategory = z.object({
  id: idValue,
  category: stringValue,
  title: stringValue,
});

export const CreateOrganizer = z.object({
  id: idValue,
  name: stringValue,
});

/*export const CreateVenue = z.object({
  id: idValue,
  location: stringValue,
});*/

export const CreateRun = z.object({
  id: idValue,
  title: stringValue,
  distance: numberValue,
  //price: numberValue,
  elevation: numberValue,
  eventId: numberValue,
  runCategories: many2many, //z.array(z.coerce.number()).optional().default([]),
});

export const CreateRegistration = z.object({
  id: z.number().optional(),
  firstName: z.string('Prosim zadajte "Meno"'),
  lastName: z.string('Prosim zadajte "Priezvisko"'),
  dateOfBirth: z.coerce.date("Zadajte datum narodenia"),
  gender: z.enum(["MALE", "FEMALE"], "Vyberte pohlavie"),
  categoryId: z.coerce.number("Prosim vyberte kategoriu"),
  email: z.email("Zadajte email"),
  runId: z.coerce.number("Vyberte beh"),
  nation: z.string('Prosim zadajte "Narodnost"'),
  city: z.string().optional(),
  club: z.string('Prosim zadajte "Klub"'),
  //phone: z.coerce.number('Zadajte telefonne cislo'),
});

export const ManageRegistration = z.object({
  id: z.number().optional(),
  firstName: z.string('Prosim zadajte "Meno"'),
  lastName: z.string('Prosim zadajte "Priezvisko"'),
  dateOfBirth: z.coerce.date("Zadajte datum narodenia"),
  gender: z.enum(["MALE", "FEMALE"], "Vyberte pohlavie"),
  categoryId: z.coerce.number("Prosim vyberte kategoriu"),
  userId: z.string().nullable(),
  runId: z.coerce.number(),
  email: z.email("Zadajte email"),
  nation: z.string('Prosim zadajte "Narodnost"'),
  city: z.string().optional(),
  paid: z.boolean(),
  presented: z.boolean(),
  tshirtSize: z
    .string()
    .transform((value) => {
      if (value === "null") return null;
      return value;
    })
    .nullable(),
  club: z.string('Prosim zadajte "Klub"'),
  //phone: z.coerce.number('Zadajte telefonne cislo'),
});

export const ManageResults = z.object({
  id: z.number().optional(),
  rank: numberValue,
  bib: z.coerce.string(),
  name: stringValue,
  category: stringValue,
  time: numberValue, //stringValue,
  gender: z.enum(["MALE", "FEMALE"]),  
  club: stringValue,
  yearOfBirth: numberValue,
  userId: z.string().nullable(),
  runId: numberValue,
});

export const CreateRunResult = z.array(
  z.object({
    id: idValue,
    name: stringValue,
    club: stringValue,
    category: stringValue,
    bib: z.coerce.string(),
    rank: numberValue,
    time: numberValue,
    gender: z.enum(["MALE", "FEMALE"]),
    yearOfBirth: numberValue,    
    runId: numberValue,
  })
);

// Media
export const CreateMedia = z.object({
  id: idValue,
  name: stringValue,
  description: stringValue,
  file: stringValue,
  size: numberValue,
  orientation: stringValue,
  //likes: numberValue,
  //views: numberValue,
  //downloads: numberValue,
  userId: stringValue,
  categoryId: numberValue,
  mediaTypeId: numberValue,
  galleryId: numberValue,
});

export const CreateMediaCategory = z.object({
  id: idValue,
  name: stringValue,
  details: stringValue,
});

export const CreateMediaType = z.object({
  id: idValue,
  name: stringValue,
  slug: stringValue,
});

export const CreateMediaComment = z.object({
  id: idValue,
  comment: stringValue,
  status: stringValue,
  userId: stringValue,
  mediaId: stringValue,
});

export const createGallery = z
  .object({
    id: idValue,
    name: stringValue,
    description: stringValue,
    //views: numberValue,
    //downloads: numberValue,
    userId: z.string().min(1, "User field is required"),
    eventId: z.coerce.number().optional(),
    postId: z.coerce.number().optional(),
  })
  .check((ctx) => {
    if (!ctx.value.eventId && !ctx.value.postId) {
      ctx.issues.push({
        code: "custom",
        message: "Event or Post is required",
        input: ctx.value,
      });
    }
    if (ctx.value.eventId && ctx.value.postId) {
      ctx.issues.push({
        code: "custom",
        message: "Plese select either Event or Post",
        input: ctx.value,
      });
    }
    if (ctx.value.eventId === 0) {
      ctx.value.eventId = undefined;
    } else if (ctx.value.postId === 0) {
      ctx.value.postId = undefined;
    }
  });

// Others
export const ContactForm = z.object({
  email: emailValue,
  subject: stringValue,
  message: stringValue,
});

/*export const CreateQuestion = z.object({
  id: idValue,
  question: stringValue,
  questionType: stringValue,
});

export const CreateQuestionChoice = z.object({
  id: idValue,
  title: stringValue,
  displayOrder: numberValue,
  questionId: numberValue,
});*/

export type Rules =
  | typeof RegisterUser
  | typeof LoginUser
  | typeof ChangePassword
  | typeof ResetPasswordRequest
  | typeof ContactForm
  | typeof ResetPassword
  //| typeof CreateQuestion
  //| typeof CreateQuestionChoice
  //| typeof CreateVenue
  | typeof CreateRun
  | typeof CreateEvent
  | typeof CreateOrganizer
  | typeof CreateRunCategory
  | typeof CreateRun
  | typeof CreateTag
  | typeof CreateCategory
  | typeof CreateMedia
  | typeof CreateMediaComment
  | typeof CreateMediaCategory
  | typeof CreateMediaType
  | typeof CreateEventType
  | typeof CreatePost;
