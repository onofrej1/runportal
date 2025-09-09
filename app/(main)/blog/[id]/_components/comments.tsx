"use client";
import { addComment } from "@/actions/posts";
import Form_ from "@/components/form/form";
import { Comment, User } from "@/generated/prisma";
import { FormField } from "@/types/resources";
import React from "react";
import { CommentBox } from "./comment";

type CommentForm = {
  comment: string;
};

type CommentsProps = {
  postId: number;  
  comments: (Comment & { user: User; _count: { comments: number } })[];
  onAddComment: () => void;
};

export default function CommentsNew(props: CommentsProps) {
  const { postId, comments, onAddComment } = props;

  const fields: FormField[] = [
    {
      name: "comment",
      type: "textarea",
      rows: 7,
      placeholder: "Pridaj komentar...",
      className: "rounded-2xl",
    },
  ];

  const submit = async (data: CommentForm) => {
    console.log(data);
    await addComment(data.comment, postId);
    onAddComment();
    return {};
  };

  return (
    <div>
      <h3 className="font-semibold p-1">Discussion</h3>
      {comments.length === 0 && <p className="p-1 mt-1 mb-4">No comments.</p>}
      <div className="flex flex-col gap-5 m-3">
        {comments.map((comment) => (
          <CommentBox key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="h-80 px-7 w-[700px] rounded-[12px] bg-white p-4 shadow-md border">
        <p className="text-xl font-semibold text-black cursor-pointer transition-all hover:text-black">
          Novy komentár
        </p>
        <Form_<CommentForm> fields={fields} action={submit}>
          {({ fields }) => (
            <div>
              <div className="my-4">{fields.comment}</div>
              <div className="flex justify-end mt-2">
                <button className="h-12 w-[150px] bg-green-700 text-sm text-white rounded-lg transition-all cursor-pointer hover:bg-blue-600">
                  Pridať komentár
                </button>
              </div>
            </div>
          )}
        </Form_>
      </div>
    </div>
  );
}
