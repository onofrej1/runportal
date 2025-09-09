"use client";
import { addComment, getComments } from "@/actions/posts";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { User, Comment } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import { FormField } from "@/types/resources";
import React, { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

interface CommentBoxProps {
  className?: string;
  comment: Comment & { user: User; _count: { comments: number } };
}

export function CommentBox(props: CommentBoxProps) {
  const { comment, className } = props;
  const queryClient = useQueryClient();

  const [data, setData] = useState<Comment[]>([]);
  const [reply, setReply] = useState(false);

  const loadComments = async (parentId: number) => {
    const comments = await queryClient.fetchQuery({
      queryKey: ["getComments", parentId],
      queryFn: () => getComments(parentId),
    });
    //const comments = await getComments(parentId);
    console.log("set data", comments?.length);
    setData(comments as any);
  };

  const commentFields: FormField[] = [
    { type: "textarea", name: "comment", rows: 3 },
  ];

  const commentReply = async (commentId: number, data: { comment: string }) => {
    console.log(data);
    await addComment(data.comment, null, commentId);
    //loadComments(commentId);
    //queryClient.invalidateQueries({ queryKey: ["getComments", commentId] });
    loadComments(commentId);
    setReply(false);
    return {};
  };

  return (
    <div className={className} key={comment.id}>
      <div className="flex w-full justify-between border rounded-md">
        <div className="p-3">
          <div className="flex gap-3 items-center">
            <Image
              width={50}
              height={50}
              alt="user"
              src="https://avatars.githubusercontent.com/u/22263436?v=4"
              className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400"
            />
            <h3 className="font-bold">{comment.user.name}</h3>
          </div>
          <p className="text-gray-600 mt-2">{comment.comment}</p>
        </div>
      </div>
      {/*<div>
        <span className="font-bold">{comment.user.name}</span>{" "}
        {formatDate(comment.publishedAt, "LLL. d, yyyy")}
      </div>
      <div dangerouslySetInnerHTML={{ __html: comment.comment }}></div>*/}
      {comment._count.comments > 0 && data.length === 0 && (
        <button
          onClick={() => loadComments(comment.id)}
          className="ml-2 text-green-700"
        >
          Show replies
        </button>
      )}

      {data && data.length > 0 && (
        <div>
          {data.map((c) => (
            <CommentBox key={c.id} comment={c as any} className="pl-8 mt-3" />
          ))}
          <Form
            key={comment.id + "-form"}
            fields={commentFields}
            //validation={"CommentFeedPost"}
            action={commentReply.bind(null, comment.id)}
          >
            {({ fields }) => (
              <div className="pl-8 pb-4 mt-4">
                {fields.comment}
                <Button className="mt-2" type="submit">
                  Comment
                </Button>
              </div>
            )}
          </Form>
        </div>
      )}

      <div>
        {reply && (
          <div className="mt-4">
            <Form
              key={comment.id + "-reply_form"}
              fields={commentFields}
              //validation={"CommentFeedPost"}
              action={commentReply.bind(null, comment.id)}
            >
              {({ fields }) => (
                <div className="pl-8 pb-4">
                  <div>{fields.comment}</div>
                  <Button className="mt-2" type="submit">
                    Comment
                  </Button>
                </div>
              )}
            </Form>
          </div>
        )}

        {comment._count.comments === 0 && !reply && (
          <div>
            <button onClick={() => setReply(true)} className="text-green-700">
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
