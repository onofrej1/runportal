import { replaceInFileSync } from "replace-in-file";
import fs from "fs-extra";
import path from "path";
const __dirname = path.resolve();

type GenerateApiParams = {
  name: string;
  table: string;
  entity: string;
  optionField?: string;
};

const generateService = (params: GenerateApiParams) => {
  const { entity, table, optionField } = params;
  const templatePath = path.join(__dirname, "generator", "templates");
  const destinationPath = path.join(process.cwd(), "services");

  console.log(`Generating api for "${table}" resource:`);
  fs.copySync(templatePath, destinationPath);

  fs.rename(
    path.join(destinationPath, "service.ts.tpl"),
    path.join(destinationPath, table + ".ts")
  );

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[ENTITY\]/g,
    to: entity,
  });

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[MODEL\]/g,
    to: table,
  });

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[OPTION_FIELD\]/g,
    to: optionField,
  });
};

//const defaultModels = [{ model: "user", resource: "users", relations: [] }];

const models = [
  //{ name: "post", table: "post", entity: 'Post', optionField: 'title' },
  //{ name: "media", table: "media", entity: 'Media', optionField: 'name' },
  //{ name: "run", table: "run", entity: 'Run', optionField: 'title' },
  //{ name: "event", table: "event", entity: "Event", optionField: "name" },
  //{ name: "registration", table: "registration", entity: "Registration", optionField: "name" },
  //{ name: "gallery", table: "gallery", entity: "Gallery", optionField: "name" },
  {
    name: "partner",
    table: "partner",
    entity: "Partner",
    optionField: "name",
  },
  {
    name: "eventType",
    table: "eventType",
    entity: "EventType",
    optionField: "type",
  },
  { name: "location", table: "location", entity: "Location", optionField: "location" },
  {
    name: "organizer",
    table: "organizer",
    entity: "Organizer",
    optionField: "name",
  },
  {
    name: "category",
    table: "category",
    optionField: "title",
    entity: "Category",
  },
  { name: "tag", entity: "Tag", table: "tag", optionField: "title" },
  { name: "user", entity: "User", table: "user", optionField: "name" },
  
  {
    name: "comment",
    table: "comment",
    entity: "Comment",
    optionField: "title",
  },
  {
    name: "runCategory",
    table: "runCategory",
    entity: "RunCategory",
    optionField: "title",
  },
  {
    name: "mediaCategory",
    table: "mediaCategory",
    entity: "MediaCategory",
    optionField: "name",
  },
  {
    name: "mediaType",
    table: "mediaType",
    entity: "MediaType",
    optionField: "name",
  },
  {
    name: "mediaComment",
    table: "mediaComment",
    entity: "MediaComment",
    optionField: "comment",
  },  
  {
    name: "runResult",
    table: "runResult",
    entity: "RunResult",
    optionField: "name",
  },
];
for (const model of [...models /*, ...defaultModels*/]) {
  generateService(model);
}
