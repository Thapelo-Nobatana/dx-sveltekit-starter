// @ts-nocheck
import { redirect, fail } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma-instance";
import { de, is } from "date-fns/locale";
import { FILE_CATEGORY } from "$lib/constants/constants";

export const load = async ({ locals }) => {
  if (!locals.user) {
    redirect(303, "/login");
  }


// const profilePicture = await prisma.file.findFirst({
//          where: { linked_entity: "userAccount", linked_entity_id: locals?.user?.id, category: FILE_CATEGORY.PROFILE_PICTURE }
//      });

//   const posts = await prisma.post.findMany({
//     where: {  is_deleted: false },
//     include: {
//       user_account: {
//         select: { username: true, user_role: true,  }
//       }
//     },
//     orderBy: { id: "desc" }
//   });

  // const postwithPhotos = posts.map( async post => {


  //     const photo = await prisma.file.findFirst({
  //       where: {
  //         linked_entity: "user_account",
  //         linked_entity_id: BigInt(post.user_account_id),
  //       }
  //     });

  // //     return { photo_file: photo}
  // // })
  // const photos = await prisma.$queryRaw`SELECT * FROM post 
  //           join file ON file.linked_entity_id = post.user_account_id
  //            where is_deleted != 1 AND 	linked_entity = 'userAccount';`

   const posts = await prisma.$queryRaw`
        SELECT 
        p.id              AS post_id,
        p.content,
        p.last_updated,
        p.user_account_id,

        ua.username,
        ur.role_name,

        f.object_identifier    AS profile_picture_url

      FROM post p

      JOIN user_account ua 
        ON ua.id = p.user_account_id

      LEFT JOIN user_role ur
        ON ur.id = ua.user_role_id

      LEFT JOIN file f
        ON f.linked_entity_id = ua.id
      AND f.linked_entity = 'userAccount'
      AND f.category = 'Profile Picture'

      WHERE p.is_deleted != 1

      ORDER BY p.id DESC;
   `
          const normalizedPosts = posts.map(post => ({
          id: post.post_id,
          content: post.content,
          last_updated: post.last_updated,

          user_account: {
            id: post.user_account_id,
            username: post.username,
            user_role: {
              role_name: post.role_name
            },
            profilePicture: {
              base_file_url: post.profile_picture_url
            }
          }
        }));



  return { posts: normalizedPosts };
};

export const actions = {
  createPost: async ({ request, locals }) => {
    // if (!locals.user) {
    //   redirect(303, "/login");
    // }

    const formData = await request.formData();

     // check content
    const content = String(formData.get("content") ?? "").trim();

    if (content=="") {
      return fail(400, { error: "Post cannot be empty" });
    }

    if (content.length > 255) {
      return fail(400, { error: "Post must be 255 characters or less" });
    }

    console.log("Creating post for user ID:", locals.user.id);

    await prisma.post.create({
      data: {
        content,
        user_account_id: locals.user.id,
        is_deleted: false
      }
    });

    console.log("Post created successfully");

    return { success: true };
  }, 

  editPost: async ({request}) => {
     console.log("Edit post action called");

    const formData = await request.formData();
    const postId = Number (formData.get("postId"));
    const content = String(formData.get("content") ?? "").trim();

    console.log("Content from this :", content)

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

  deletePost: async ({ request, locals, }) => {

    console.log("Delete post action called");

    console.log("request:", request, "locals:", locals);
 

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

    // if (post.user_account_id !== locals.user.id) {
    //   return fail(403, { error: "You are not authorized to delete this post" });
    // }

    console.log("Deleting post with ID:", postId);

    
    let deleteThis = await prisma.post.update({
      where: { id: postId },
      data: {is_deleted: true }
    });
    // await prisma.post.update({
    //   where: { id: postId },
    //   data: { deleted: true }
    
    // });
    console.log("Delete operation result:", deleteThis);
    console.log("Post deleted successfully:", postId);

    return { success: true };
  }
}