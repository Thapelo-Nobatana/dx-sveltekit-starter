// @ts-nocheck

import { prisma } from "$lib/server/prisma-instance";


export const load = async ()  =>{

    const posts = await prisma.post.findMany({
        where: { is_deleted: false },
        include: {
          user_account: {
            select: { username: true}

          }
        },
        orderBy: { created_at: "desc" },
        take: 5
     })

        return { posts };

}


export const actions = {

    limitPosts:  async ({request }) => {

        console.log("This is limit")

        const formData = await request.formData();
        const limit = Number (formData.get("limit"));
           console.log("Limit is:", limit);
        const posts = await prisma.post.findMany({
            where: { is_deleted: false },
            include: {
              user_account: {
                select: { username: true }
              }
            },
            orderBy: { created_at: "desc" },
            take: limit
          });

          return { posts, limit };

    },

    deletePost : async ({request }) => {

        const formData = await request.formData();
        const postId = Number (formData.get("postId"));

        await prisma.post.update({
            where: { id: postId },
            data: { content: null,  is_deleted: true },
        });

        return { success: true };
    },
}