<script>
    // @ts-nocheck
    import defaultAvatar from "$lib/assets/images/default.png";
    
    import * as Card from "$lib/components/shadcn/ui/card";
    import swal from "sweetalert2";
     import Button from "$components/shadcn/ui/button/button.svelte";
    import { getContext } from "svelte";
    import { enhance } from "$app/forms";
    import AlertDialog from "$lib/components/shadcn/ui/alert-dialog/_alert-dialog.svelte";
    import { de } from "date-fns/locale";
    import { disable } from "effect/RuntimeFlagsPatch";
    import Page from "../admin/+page.svelte";
    import { Result } from "postcss";
    import { currentContext } from "effect/FiberRef";
    import AlertDialogAction from "$lib/components/shadcn/ui/alert-dialog/alert-dialog-action.svelte";

    // Icons
    import Pencil from "lucide-svelte/icons/pencil";
    import X from "lucide-svelte/icons/x";
    import DeletePostButton from "$lib/components/delete-button/DeletePostButton.svelte";
    import { env } from "$env/dynamic/public";

    // DX-NOTE: The pageTitle context store is used to update the page title in the top navigation bar
    const pageTitle = getContext("pageTitle");
    $pageTitle = "Dashboard";

    // DX-NOTE: A context store set in the (authed) layout, that can be used in any deeply nested component.
    // Alternatively, the same object is available at 'data.currentUser' - if you have access to the page data object
    const currentUser = getContext("currentUser");

    // console.log("Current user in dashboard:", $currentUser);
    export let data;
    let content = "";
    let isDeleting = false;
    // const FILE_BASE_URL = env.PUBLIC_BASE_URL;
    let showEditDialog = {};
    let deleteFormEl = data.posts;
    let deletForm;
    let confirmUserRole;
    let editedContent = {};
    // export let editFormRefs = {};
      let deleteFormRefs = {};

    data.posts.forEach((post) => {
        editedContent[post.id] = post.content;
    });

    // deleteFormEl.map((post) => {
    //     deletForm = post.id;

    //     confirmUserRole = post.user_account?.user_role?.role_name;
    // });


    
    //  console.log("user role:", confirmUserRole);

    // console.log("Delete form:", deletForm);

    // function editButton(post) {
    //     return swal.fire({
    //         title: 'Edit Post',
    //         input: 'text',
    //         inputLabel: post?.content ?? 'Edit Post',
    //         inputValue: post?.content ?? '',
    //         showCancelButton: true,
    //         confirmButtonText: 'Save',
    //         confirmButtonColor: '#6E5C9B',
    //         background: "#120E1B",
    //         preConfirm: (newContent) => {
    //             if (!newContent) {
    //                 swal.showValidationMessage('Content cannot be empty');
    //             }
    //             return newContent;
    //         }
    //     });
    // }

    // async function handleEdit(post) {

    //     const { value: newContent } = await editButton(post);
    //             if (newContent) {
    //               const formData = new FormData();
    //               formData.append("postId", post.id);
    //               formData.append("content", newContent);

    //               const response = await fetch("?/editPost", {
    //                 method: "POST",
    //                 body: formData,
    //               });

    //               if (response.ok) {
    //                 location.reload();
    //               } else {
    //                 swal.fire("Error", "Failed to update post", "error");
    //               }
    //             }
    // }

    // async function  deleteButton(post) {

    //            const result = await swal.fire({
    //                           title: "Delete post?",
    //                           text: "This action cannot be undone",
    //                           icon: "warning",
    //                           background: "#120E1B",
    //                           showCancelButton: true,
    //                           confirmButtonText: "Delete",
    //                           confirmButtonColor: "#d33"
    //                           });

    //                           if (!result.isConfirmed) return;

    //                           const formData = new FormData();
    //                           formData.append("postId", post.id);

    //                           const response = await fetch("?/deletePost", {
    //                           method: "POST",
    //                           body: formData,
    //                           });

    //                           if (response.ok) {
    //                           location.reload();
    //                           } else {
    //                           swal.fire("Error", "Failed to delete post", "error");
    //                           }
    // }

    //  async function handleClear() {

    //    content = ""
    //  }
    // const submitTest = async ({ formData, cancel }) => {
    //     submittingTest = true;
    //     return async ({ result, update }) => {
    //         submittingTest = false;
    //         testNotificationDialogOpen = false;
    //         update();

    //         handleFormActionToast(result);
    //     };

    // const submitTask =  async ({ formData, cancel })  => {

    //    return async () => {

    //        content = "";
    //    }
    // }
    let editValue = "test";
</script>

<div class="grid h-full grid-cols-1 items-center items-center gap-4">
    <div class="mx-auto w-full max-w-2xl space-y-6 p-4">
        <!-- Create Post -->
        <Card.Root class=" items-center shadow-xl">
            <Card.Header class="items-center">
                <Card.Title class="text-xl">Not Twitter App</Card.Title>
                <Card.Description>Create a post</Card.Description>
            </Card.Header>

            <Card.Content>
                <form
                    method="POST"
                    action="?/createPost"
                    class="space-y-3"
                    use:enhance={() => {
                        return async ({ update, result }) => {
                            if (result.type === "success") {
                                content = "";
                            }
                            update();
                        };
                    }}>
                    <textarea
                        name="content"
                        bind:value={content}
                        placeholder="What’s on your mind?"
                        class="min-h-[90px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />

                    <div class="flex items-center justify-between">
                        <p class="text-sm text-muted-foreground">{content.length}/250</p>

                        <button type="submit" disabled={content.trim().length === 0 || content.length > 250} class="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer"> Post </button>
                    </div>
                    {#if content.length > 250}
                        <p class="text-sm font-medium text-destructive">Post cannot be longer than 250 characters</p>
                    {/if}
                </form>
            </Card.Content>
        </Card.Root>
           {console.log("whats in the base_file_url: ", )}
        <!-- Posts Feed -->
        <div class="space-y-4">
            {#each data.posts as post}

                { console.log("profile picture url:", post.user_account?.profilePicture?.base_file_url) }
                <Card.Root class=" items-center shadow-md">
                    <Card.Header>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            
                               <div>
                                   <img src={post.user_account?.profilePicture?.base_file_url ? `/uploads/thumbnail_${post.user_account?.profilePicture?.base_file_url}` : defaultAvatar} alt="User Avatar" class="h-8 w-8 rounded-full mr-2" /> 
                                </div>
                                <div>
                                  <Card.Title class="text-base">@ {post.user_account?.username}</Card.Title>
                                  <Card.Description class="text-xs">
                                    {new Date(post.last_updated).toLocaleString()}
                                  </Card.Description>
                              </div>
                          </div>


                            {#if $currentUser?.user_role?.role_name === "Admin" || $currentUser?.user_role?.role_name === "User"}
                                                <!-- <button
                                                  class="mt-2 self-end text-sm text-primary"
                                                  on:click={async () => { await handleEdit(post)}}
                                                >
                                                  Edit
                                                </button> -->

                                                <!--
                                                <form bind:this={editFormRefs[post.id]} method="POST" action="?/editPost">
                                                  <input type="hidden" name="postId" value={post.id} />
                                                  {#if showEditDialog[post.id]}
                                                  <input  name="content"  bind:value={post.content} />
                                                  {/if}
                                                </form> --> 
                                                <div>
                                                                <Button
                                                                    type="button"
                                                                    on:click={() => (showEditDialog[post.id] = true)}
                                                                    class="border-none" variant="outline" size="inline-icon"
                                                                >
                                                                      <Pencil class="h-4 w-4" />
                                                                </Button>
                                                                    <!-- {post.id}
                                                                <form method="POST" action={`?/deletePost`} bind:this={deletForm} >
                                                                    <input type="hidden" name="postId" value={post.id} />

                                                                      <Button type="button" on:click={() => isDeleting = !isDeleting} class="border-none" variant="destructive-outline" size="inline-icon">
                                                                          <X class="h-4 w-4" />
                                                                </Button>
                                                                           <AlertDialog
                                                                        bind:open={isDeleting}
                                                                        formToSubmit={deletForm}
                                                                        title="Are you sure?"
                                                                        description="This will permanently delete this post." />
                                                                </form> -->
                                                                <DeletePostButton postId={post.id} />
                                                </div>


                                                            <!-- <AlertDialog
                                                  bind:open={showEditDialog[post.id]}
                                                  title="Edit Post"
                                                  description="Update the content and click Confirm"
                                                  formToSubmit={editFormRefs[post.id]}
                                                  bind:value={post.content}
                                                  showCancelButton={true}
                                                  showActionButton={false}
                                                  showEditButton={true}
                                                /> -->
                            {/if}
                        </div>
                    </Card.Header>

                    <Card.Content class="flex justify-between w-full ">
                        {#if showEditDialog[post.id]}
                            <form method="POST"  action="?/editPost" class="w-full">
                              <div class="flex flex-col items-center w-full ">
                                    <input type="hidden" name="postId" value={post.id} />
                                    <div class="w-full">
                                             <textarea name="content"  class="h-10 w-full border border-gray-300 rounded px-2"  bind:value={post.content} />
                                    </div>
                               
                                    <div class="w-full ">
                                           <button class="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer">Update</button>
                                    </div>
                             
                              </div>
                
                            </form>
                        {:else}
                            <p class="w-full whitespace-pre-wrap truncate">{post.content}</p>
                        {/if}


                    </Card.Content>
                </Card.Root>
            {/each}

            {#if data.posts.length === 0}
                <Card.Root>
                    <Card.Content class="py-10 text-center text-muted-foreground">No posts yet. Be the first to post</Card.Content>
                </Card.Root>
            {/if}
        </div>
    </div>
</div>
