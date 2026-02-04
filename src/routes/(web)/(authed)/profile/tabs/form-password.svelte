<script>
    import * as Form from "$lib/components/shadcn/ui/form";

    import SuperDebug, { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { passwordSchema } from "../schemas/password.schema";

    import { Button } from "$lib/components/shadcn/ui/button/index.js";
    import { Input } from "$lib/components/shadcn/ui/input/index.js";
    import { toast } from "svelte-sonner";

    import { handleFormActionToast, handleSuperFormUpdatedToast } from "$lib";
    import { ShowerHead } from "lucide-svelte";

    export let data;
     let isShow = false;
     let isConfirmed = false;
    export const basePath = "/admin/user-account";

    const form = superForm(data.passwordForm, {
        validators: zodClient(passwordSchema),
        invalidateAll: "force",
        resetForm: true,
        onUpdated: (event) => {
            handleSuperFormUpdatedToast(event?.form);
        }
    });

    const { form: formData, enhance, message, errors } = form;
</script>

<form method="POST" action={`?/confirmPasswordReset`} use:enhance class="flex max-w-full flex-grow flex-col">
    <input name="id" type="hidden" bind:value={$formData.id} />

    <Form.Field {form} name="password">
        <Form.Control let:attrs>
            <Form.Label>Password</Form.Label>
           
                 <div class="flex items-center">
                     <Input {...attrs} type={isShow ? "text" : "password"} bind:value={$formData.password} />
                   <button type="button"  class="ml-[-70px] w-half  p-2 cursor-pointer" on:click={() => isShow = !isShow}>
                     <p>{isShow ? "Hide" : "Show"}</p>
                    </button>
                </div>
        </Form.Control>
        <Form.FieldErrors class="relative" />
    </Form.Field>
    <Form.Field {form} name="confirm_password">
        <Form.Control let:attrs>
            <Form.Label>Confirm Password</Form.Label>
            <div class="flex items-center">
                 <Input {...attrs} type="password" bind:value={$formData.confirm_password} />
                 <button type="button" class="ml-[-70px] w-half p-2 cursor-pointer" on:click={() => isConfirmed = !isConfirmed}>
                    <p>{isConfirmed ? "Hide" : "Show"}</p>

                 </button>
            </div>
           
        </Form.Control>
        <Form.FieldErrors class="relative" />
    </Form.Field>

    <div class="mt-2 flex flex-row justify-end">
        <Button type="submit">Update Password</Button>
    </div>
</form>
