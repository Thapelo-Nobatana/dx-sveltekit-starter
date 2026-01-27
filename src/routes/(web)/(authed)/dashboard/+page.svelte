<script>
    import * as Card from "$lib/components/shadcn/ui/card";
    import swal from "sweetalert2";

    import { getContext } from "svelte";
    import { enhance } from "$app/forms";
    import AlertDialog from "$lib/components/shadcn/ui/alert-dialog/_alert-dialog.svelte";
    import { de } from "date-fns/locale";

    // DX-NOTE: The pageTitle context store is used to update the page title in the top navigation bar
    const pageTitle = getContext("pageTitle");
    $pageTitle = "Dashboard";

    // DX-NOTE: A context store set in the (authed) layout, that can be used in any deeply nested component.
    // Alternatively, the same object is available at 'data.currentUser' - if you have access to the page data object
    const currentUser = getContext("currentUser");
      export let data;
     let content = "";
     let isDeleting = false;
     let deleteFormEl = data.posts;
      let deletForm;

       deleteFormEl.map((post) => {

         deletForm = post.id;
       });
      console.log("Delete form:", deletForm);

    function editButton(post) {
        return swal.fire({
            title: 'Edit Post',
            input: 'text',
            inputLabel: post?.content ?? 'Edit Post',
            inputValue: post?.content ?? '',
            showCancelButton: true,
            confirmButtonText: 'Save',
            confirmButtonColor: '#6E5C9B',
            preConfirm: (newContent) => {
                if (!newContent) {
                    swal.showValidationMessage('Content cannot be empty');
                }
                return newContent;
            }
        });
    }

    async function handleEdit(post) {

        const { value: newContent } = await editButton(post);
                if (newContent) {
                  const formData = new FormData();
                  formData.append("postId", post.id);
                  formData.append("content", newContent);

                  const response = await fetch("?/editPost", {
                    method: "POST",
                    body: formData,
                  });

                  if (response.ok) {
                    location.reload();
                  } else {
                    swal.fire("Error", "Failed to update post", "error");
                  }
                }
    }


  async function  deleteButton(post) {

             const result = await swal.fire({
                            title: "Delete post?",
                            text: "This action cannot be undone",
                            icon: "warning",
                            background: "#120E1B",
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

<!-- <div class="flex h-full w-full flex-col items-center overflow-y-auto @container">
    <div class="flex w-full flex-col gap-2 px-2 pt-4 text-center">
        <span class="text-3xl font-bold">Welcome, {$currentUser.first_name ?? "User"}!</span>
        <p>This starter project is built with the core technologies below.</p>
        <p>It already provides for database integration and an ORM as well as certain core functionalities such as User Authentication.</p>
    </div>
    <div class=" flex max-w-5xl flex-row flex-wrap justify-center gap-5 p-5 child:w-full child:sm:w-72">
        <Card.Root>
            <Card.Header>
                <Card.Title class="flex h-8 flex-row items-center gap-2">
                    <DivbloxLogo class="h-7"></DivbloxLogo>
                    Divblox
                </Card.Title>
                <Card.Description class="h-14">
                    A CLI for nodeJS that integrates Divblox (<a class="underline" href="https://web.divblox.app">
                        divblox.app <ExternalLink class="mx-0 inline-flex h-3 w-3"></ExternalLink></a
                    >) functionality into your project
                </Card.Description>
            </Card.Header>

            <Card.Content class="flex justify-center pb-2">
                <a href="https://github.com/divbloxjs/divblox/wiki" class={`${buttonVariants({ variant: "link" })}`} target="_blank">
                    Documentation
                    <ExternalLink class="ml-1 h-4"></ExternalLink></a>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title class="flex h-8 flex-row items-center gap-2">
                    <img src={SvelteLogo} alt="svelte logo" class="h-7" />
                    SvelteKit
                </Card.Title>
                <Card.Description class="h-14">Svelte meta framework for building web apps</Card.Description>
            </Card.Header>

            <Card.Content class="flex justify-center pb-2">
                <a href="https://kit.svelte.dev/docs" class={`${buttonVariants({ variant: "link" })}`} target="_blank">
                    Documentation
                    <ExternalLink class="ml-1 h-4"></ExternalLink></a>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title class="flex h-8 flex-row items-center gap-2">
                    <img src={LucideLogo} alt="lucide logo" class="h-5" />

                    Lucide
                </Card.Title>
                <Card.Description class="h-14">Icon pack bundled with ShadCN</Card.Description>
            </Card.Header>
            <Card.Content class="flex justify-center pb-2">
                <a href="https://lucide.dev/icons/" class={`${buttonVariants({ variant: "link" })}`} target="_blank">
                    Documentation<ExternalLink class="ml-1 h-4"></ExternalLink></a>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title class="flex h-8 flex-row items-center gap-2">
                    <img src={SuperformsLogo} alt="superforms logo" class="w-5" />
                    Superforms
                </Card.Title>
                <Card.Description class="h-14">Comprehensive solution for server and client form validation</Card.Description>
            </Card.Header>
            <Card.Content class="flex justify-center pb-2">
                <a href="https://superforms.rocks/" class={`${buttonVariants({ variant: "link" })}`} target="_blank">
                    Documentation<ExternalLink class="ml-1 h-4"></ExternalLink></a>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title class="flex h-8 flex-row items-center gap-2">
                    <svg viewBox="0 0 50 31" class="w-6">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"
                            fill="#38bdf8">
                        </path>
                    </svg>
                    tailwindCSS
                </Card.Title>
                <Card.Description class="h-14">A utility-first CSS framework</Card.Description>
            </Card.Header>
            <Card.Content class="flex justify-center pb-2">
                <a href="https://tailwindcss.com/docs" class={`${buttonVariants({ variant: "link" })}`} target="_blank">
                    Documentation<ExternalLink class="ml-1 h-4"></ExternalLink></a>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title class="flex h-8 flex-row items-center gap-2">
                    <img src={ShadcnSvelteLogo} alt="superforms logo" class="w-5" />
                    shadcn-svelte
                </Card.Title>

                <Card.Description class="h-14">UI Component library for TailwindCSS</Card.Description>
            </Card.Header>
            <Card.Content class="flex justify-center pb-2">
                <a href="https://www.shadcn-svelte.com/docs" class={`${buttonVariants({ variant: "link" })}`} target="_blank">
                    Documentation <ExternalLink class="ml-1 h-4"></ExternalLink></a>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title class="flex h-8 flex-row items-center gap-2">
                    <img src={ZodLogo} alt="zod logo" class="w-5" />
                    Zod
                </Card.Title>
                <Card.Description class="h-14">TypeScript-first schema validation with static type inference</Card.Description>
            </Card.Header>
            <Card.Content class="flex justify-center pb-2">
                <a href="https://zod.dev/" class={`${buttonVariants({ variant: "link" })}`} target="_blank">
                    Documentation <ExternalLink class="ml-1 h-4"></ExternalLink>
                </a>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title class="flex h-8 flex-row items-center gap-2">
                    <img src={PrismaLogo} alt="zod logo" class="w-5" />
                    Prisma
                </Card.Title>
                <Card.Description class="h-14">Core ORM implementation used by Divblox</Card.Description>
            </Card.Header>
            <Card.Content class="flex justify-center pb-2">
                <a href="https://www.prisma.io/docs" class={`${buttonVariants({ variant: "link" })}`} target="_blank">
                    Documentation <ExternalLink class="ml-1 h-4"></ExternalLink>
                </a>
            </Card.Content>
        </Card.Root>
    </div>
</div> -->

<div class="grid items-center h-full grid-cols-1 gap-4 items-center">

<div class="mx-auto w-full max-w-2xl p-4 space-y-6">
  <!-- Create Post -->
  <Card.Root class=" items-center shadow-xl">
    <Card.Header class="items-center">
      <Card.Title class="text-xl">Dashboard</Card.Title>
      <Card.Description>Create a own Post</Card.Description>
    </Card.Header>

    <Card.Content>
      <form method="POST" action="?/createPost" class="space-y-3" use:enhance>
        <textarea
          name="content"
          bind:value={content}
          placeholder="What’s on your mind?"
          class="min-h-[90px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">{content.length}/255</p>

          <button type="submit" disabled={content.trim().length === 0 || content.length > 280}>
            Post
        </button>
        </div>

        {#if data?.error}
          <p class="text-sm font-medium text-destructive">{data.error}</p>
        {/if}
      </form>
    </Card.Content>
  </Card.Root>

  <!-- Posts Feed -->
  <div class="space-y-4">
    {#each data.posts as post}
      <Card.Root class=" items-center shadow-md">
        <Card.Header>
            <div class="flex justify-between items-center">
                <div>
                  <Card.Title class="text-base">@ {post.user_account.username}</Card.Title>
                    <Card.Description class="text-xs">
                        {new Date(post.last_updated).toLocaleString()}
                    </Card.Description>

                </div>
             <button
               class="mt-2 self-end text-sm text-primary"
               on:click={async () => { await handleEdit(post)}}
            >
              Edit
            </button>

            </div>
        </Card.Header>

        <Card.Content class="flex justify-between ">
          <p class="whitespace-pre-wrap">{post.content}</p>
          <div class="flex flex-col w-full items-center border-l pl-4 ml-4">

                <button
                    class="mt-2 self-end text-sm text-red-600"
                    on:click={async () => {  await deleteButton(post)}}
                >
                  Delete
                </button>
<!-- 
            <form method="POST" action={'?/deletePost'} bind:this={deletForm}  use:enhance>
                <input type="hidden" name="postId" value={post.id} />
                <button on:click={() => ( isDeleting = !isDeleting )}>Delete</button>
                <AlertDialog bind:open={isDeleting}  formToSubmit={deletForm} title="Are you sure?" description="This will permanently delete this post." />
            </form> -->
          </div>

        </Card.Content>
      </Card.Root>
    {/each}

    {#if data.posts.length === 0}
      <Card.Root>
        <Card.Content class="py-10 text-center text-muted-foreground">
          No posts yet. Be the first to post
        </Card.Content>
      </Card.Root>
    {/if}
  </div>
</div>


</div>