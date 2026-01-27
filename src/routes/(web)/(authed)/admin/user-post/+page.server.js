
import { prisma } from "$lib/server/prisma-instance";


export const load = async ()  =>{

    const posts = await prisma.post.findMany({
        where: { deleted: false },
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


const  actions = {

    limitPosts:  async ({request }) => {

        const formData = await request.formData();
        const limit = Number (formData.get("limit"));

        const posts = await prisma.post.findMany({
            where: { deleted: false },
            include: {
              user_account: {
                select: { username: true }
              }
            },
            orderBy: { created_at: "desc" },
            take: limit
          });

          return { posts };

    },

    deletePost : async ({request }) => {

        const formData = await request.formData();
        const postId = Number (formData.get("postId"));

        await prisma.post.update({
            where: { id: postId },
            data: { content: null,  deleted: true },
        });
    },
}