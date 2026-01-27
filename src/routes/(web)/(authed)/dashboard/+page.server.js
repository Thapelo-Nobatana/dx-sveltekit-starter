import { redirect, fail } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma-instance";
import { de } from "date-fns/locale";

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(303, "/login");
  }

  const posts = await prisma.post.findMany({
    where: { deleted: false },
    include: {
      user_account: {
        select: { username: true }
      }
    },
    orderBy: { created_at: "desc" }
  });

  return { posts };
};

export const actions = {
  createPost: async ({ request, locals }) => {
    // if (!locals.user) {
    //   redirect(303, "/login");
    // }

    const formData = await request.formData();

     // check content
    const content = String(formData.get("content") ?? "").trim();

    if (!content) {
      return fail(400, { error: "Post cannot be empty" });
    }

    if (content.length > 255) {
      return fail(400, { error: "Post must be 255 characters or less" });
    }

    await prisma.post.create({
      data: {
        content,
        user_account_id: locals.user.id,
        deleted: false
      }
    });

    return { success: true };
  }, 

  editPost: async ({request}) => {

    const formData = await request.formData();
    const postId = Number (formData.get("postId"));
    const content = String(formData.get("content") ?? "").trim();

    if (!content) {
      return fail(400, { error: "Post cannot be empty" });
    }

    if (content.length > 255) {
      return fail(400, { error: "Post must be 255 characters or less" });
    }

    await prisma.post.update({
        where: { id: postId },
        data: { content }
    })

    return { success: true };
  },

  deletePost: async ({ request, locals }) => {

    console.log("Delete post action called");
 

    const formData = await request.formData();
    const postId = Number(formData.get("postId"));
   console.log("form data:", formData)
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    console.log("Post to be deleted:", post);

    if (!post) {
      return fail(404, { error: "Post not found" });
    }

    if (post.user_account_id !== locals.user.id) {
      return fail(403, { error: "You are not authorized to delete this post" });
    }

    console.log("Deleting post with ID:", postId);
     await prisma.post.update({
      where: { id: postId },
      data: {content: null, deleted: true }
    });
    // await prisma.post.update({
    //   where: { id: postId },
    //   data: { deleted: true }
    // });

    return { success: true };
  }
}