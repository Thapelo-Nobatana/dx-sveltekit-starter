<script>
// @ts-nocheck

    import { enhance } from "$app/forms";
 import * as Card from "$lib/components/shadcn/ui/card";
 import AlertDialog from "$lib/components/shadcn/ui/alert-dialog/_alert-dialog.svelte";
import swal from "sweetalert2";

    export let data;

     let posts = data.posts;

     let limit = 5;

  function limitEnhance({ result, type } = {}) {
         console.log("This is limitEnhance");
    if (type === "success") {
      posts = result.data.posts;
      limit = result.data.limit;
      console.log("Posts loaded:", posts);
    }
  }

//     let isDeleting = false;
    
//  let deleteFormEl = data.posts;
//     let deletForm;
//      deleteFormEl.map((post) => {
//         deletForm = post.id;

//         confirmUserRole = post.user_account?.user_role?.role_name;
//     });

    // async function loadMorePosts() {
    //      limit += 5;

    //      const formData = new FormData();
    //      formData.append("limit", limit.toString());

    //      const  res = await fetch("?/limitPosts", {
    //             method: "POST",
    //             body: formData
    //      });

    //      const result = await res.json();
    //      posts = result.posts;
    // }
    async function  deletePost(post) {

             const result = await swal.fire({
                            title: "Delete post?",
                            text: "This action cannot be undone",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Delete",
                            confirmButtonColor: "#d33"
                            });

                            if (!result.isConfirmed) return;

                            const formData = new FormData();
                            formData.append("postId", post.id);

                            const response = await fetch("?/deletePost", {
                            method: "POST",
                            body: formData,
                            });

                            if (response.ok) {
                            location.reload();
                            } else {
                            swal.fire("Error", "Failed to delete post", "error");
                            }
  }
</script>

<div class=" flex flex-col w-full items-center">
    <h1 class="flex text-2xl font-bold   mb-4"> Posts Management</h1>

    <div class="flex flex-col items-center w-full @container">

        {#if posts === undefined || null}
            <p>No posts found.</p>
            {:else}
             <div class="w-full flex flex-col p-4 items-center">

               {#each posts as post}
                    <Card.Root class="mb-4 w-full max-w-2xl">
                        <Card.Header>
                            <div class="flex justify-between items-center">

                            <Card.Title>Post Number: {post.id}</Card.Title>
                            <button on:click={() => deletePost(post)} class="text-red-500" >Delete</button>

                            </div>
                        </Card.Header>
                        <Card.Content>
                            <p class="mb-2">{post.content}</p>
                            <p class="text-sm text-gray-500">By: {post.user_account.username}</p>
                        </Card.Content>
                    </Card.Root>
                {/each}
                
            <!-- <form method="POST" action={'?/deletePost'} bind:this={deletForm}  use:enhance>
                <input type="hidden" name="postId" value={post.id} />
                <button on:click={() => ( isDeleting = !isDeleting )}>Delete</button>
                <AlertDialog bind:open={isDeleting}  formToSubmit={deletForm} title="Are you sure?" description="This will permanently delete this post." />
            </form> -->

                 <div class="mt-4 mb-4 border-b w-full flex justify-center">
                            <form
                                    method="POST"
                                    action="?/limitPosts"
                                    use:enhance={limitEnhance}
                                    class="mt-4 flex justify-center"
                                >
                                    <input type="hidden" name="limit" value={limit + 1} />

                                    <button
                                    type="submit"
                                    class="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded"
                                    >
                                    Load More
                                    </button>
                                </form>
                  </div>
             </div>
        {/if}


    </div>

</div>
