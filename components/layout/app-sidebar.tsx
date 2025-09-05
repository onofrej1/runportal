"use client";

import { Calendar, ChevronDown, ChevronRight, File, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const events = [
  {
    title: "Events",
    url: "/resource/events",
  },
  {
    title: "Runs",
    url: "/resource/runs",
  },
  {
    title: "Run categories",
    url: "/resource/runCategories",
  },
  {
    title: "Event types",
    url: "/resource/eventTypes",
  },
  {
    title: "Organizers",
    url: "/resource/organizers",
  },
  {
    title: "Venues",
    url: "/resource/venues",
  },
];

const blog = [
  {
    title: "Posts",
    url: "/resource/posts",
  },
  {
    title: "Categories",
    url: "/resource/categories",
  },
  {
    title: "Tags",
    url: "/resource/tags",
  },
];

const media = [
  /*{
    title: "Calendar",
    url: "/calendar",
  },*/
  {
    title: "Media",
    url: "/resource/media",
  },
  {
    title: "Media categories",
    url: "/resource/mediaCategories",
  },
  {
    title: "Media types",
    url: "/resource/mediaTypes",
  },
  {
    title: "Media comments",
    url: "/resource/mediaComments",
  },
  {
    title: "Gallery",
    url: "/resource/galleries",
  },
  /*{
    title: "Questions",
    url: "/resource/questions",
  },
  {
    title: "Question choices",
    url: "/resource/questionChoices",
  },*/
];

const entities = [
  { category: "Blog", items: blog, icon: Home },
  { category: "Event management", items: events, icon: Calendar },
  { category: "Media files", items: media, icon: File },
];

const getCategory = (path: string) => {
  for (const entity of entities) {
    if (
      entity.items
        .map((i) => i.url)
        .flat()
        .includes(path)
    ) {
      return entity.category;
    }
  }
  return "";
};

export function AppSidebar() {
  const pathname = usePathname();
  console.log(getCategory(pathname));

  const [open, setOpen] = React.useState(getCategory(pathname));

  return (
    <Sidebar>
      <SidebarHeader className="p-3">
        <h3 className="flex gap-2 scroll-m-20 text-2xl font-semibold tracking-tight">
          <div className='z-10'>Admin page</div>
          <Image className="absolute right-[20px] -top-4 borderxx border-gray-300" src="/images/runner.jpg" width={100} height={100} alt="" />
        </h3>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Menu
            </h4>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {entities.map((entity) => (
                <Collapsible
                  key={entity.category}
                  open={open === entity.category}
                  onOpenChange={() => setOpen(entity.category)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          <entity.icon size="16" />
                          {entity.category}
                        </div>
                        {open === entity.category ? (
                          <ChevronDown />
                        ) : (
                          <ChevronRight />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {entity.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <a href={item.url}>
                                {/*<item.icon />*/}
                                <span>{item.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}

              {/*items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>                      
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))*/}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
