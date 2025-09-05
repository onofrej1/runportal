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

export const CreateVenue = z.object({
  id: idValue,
  location: stringValue,
});

export const CreateRun = z.object({
  id: idValue,
  title: stringValue,
  distance: numberValue,
  price: numberValue,
  elevation: numberValue,
  eventId: numberValue,
  runCategories: many2many, //z.array(z.coerce.number()).optional().default([]),
});

export const CreateRegistration = z.object({
  id: z.number().optional(),
  firstName: stringValue,
  lastName: stringValue,
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE"]),
  email: z.email(),
  runId: numberValue,
  nation: stringValue,
  city: stringValue,
  club: stringValue,
  phone: stringValue,
});

export const CreateRunResult = z.array(
  z.object({
    id: idValue,
    name: stringValue,
    club: stringValue,
    category: stringValue,
    bib: numberValue,
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

export const CreateQuestion = z.object({
  id: idValue,
  question: stringValue,
  questionType: stringValue,
});

export const CreateQuestionChoice = z.object({
  id: idValue,
  title: stringValue,
  displayOrder: numberValue,
  questionId: numberValue,
});

export type Rules =
  | typeof RegisterUser
  | typeof LoginUser
  | typeof ChangePassword
  | typeof ResetPasswordRequest
  | typeof ContactForm
  | typeof ResetPassword
  | typeof CreateQuestion
  | typeof CreateQuestionChoice
  | typeof CreateVenue
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
