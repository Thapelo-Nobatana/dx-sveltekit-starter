<script>
  import AlertDialog from "$lib/components/shadcn/ui/alert-dialog/_alert-dialog.svelte";
  import { Button } from "$lib/components/shadcn/ui/button";
  import { X } from "lucide-svelte";

  export let postId;

  let isDeleting = false;
  let deleteForm;
</script>

<form method="POST" action="?/deletePost" bind:this={deleteForm}>
  <input type="hidden" name="postId" value={postId} />

  <Button
    type="button"
    on:click={() => (isDeleting = true)}
    variant="destructive-outline"
    size="inline-icon"
    class="border-none"
  >
    <X class="h-4 w-4" />
  </Button>

  <AlertDialog
    bind:open={isDeleting}
    formToSubmit={deleteForm}
    title="Are you sure?"
    description="This will permanently delete this post."
  />
</form>