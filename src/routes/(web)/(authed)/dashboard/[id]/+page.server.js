// @ts-nocheck

// export const load = async ({ locals }) => {
//   if (!locals.user) {
//     redirect(303, "/login");
//   }

//   const posts = await prisma.post.findMany({
//     where: {  is_deleted: false },
//     include: {
//       user_account: {
//         select: { username: true, user_role: true }
//       }
//     },
//     orderBy: { id: "desc" }
//   });

//   return { posts };
// };


export const actions = {


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