<script>
    import { buttonVariants } from "$lib/components/shadcn/ui/button";
    import * as Form from "$lib/components/shadcn/ui/form";
    import { Input } from "$lib/components/shadcn/ui/input";

    import { registerSchema } from "./register.schema";
    import { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import AppLogo from "$lib/components/app-images/app-logo.svelte";

    import * as Card from "$lib/components/shadcn/ui/card";
    import { env } from "$env/dynamic/public";

    export let data;
          let isShow = false;
          let isConfirmed = false;

    const form = superForm(data.registerForm, {
        validators: zodClient(registerSchema)
    });
    const { form: formData, enhance, message, errors, submitting } = form;
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
    <Card.Root class="w-fit bg-card shadow-2xl">
        <Card.Header class="mb-2 p-0 text-center">
            <AppLogo class="w-56 self-center py-8" />
            <Card.Title>Create your {env.PUBLIC_APP_DISPLAY_NAME || "Divblox" } account</Card.Title>
        </Card.Header>
        <Card.Content class="flex flex-col">
            <form action="?/register" method="POST" class="min-w-72" use:enhance>
                <Form.Field {form} name="email_address">
                    <Form.Control let:attrs>
                        <Form.Label>Email Address</Form.Label>
                        <Input {...attrs} bind:value={$formData.email_address} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="password">
                    <Form.Control let:attrs>
                        <Form.Label>Password</Form.Label>
                        <div class="flex items-center">
                                      <Input type={isShow ? "text" : "password"} {...attrs} bind:value={$formData.password} />
                                <button type="button"  class="ml-[-70px] w-half  p-2 cursor-pointer" on:click={() => isShow = !isShow}>
                                    <p>{isShow ? "Hide" : "Show"}</p>
                                </button>
                        </div>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="confirm_password">
                    <Form.Control let:attrs>
                        <Form.Label>Confirm Password</Form.Label>
                        <div class="flex items-center">
                               <Input type={isConfirmed ? "text" : "password"} {...attrs} bind:value={$formData.confirm_password} />
                                <button type="button"  class="ml-[-70px] w-half  p-2 cursor-pointer" on:click={() => isConfirmed = !isConfirmed}>
                                    <p>{isConfirmed ? "Hide" : "Show"}</p>
                                </button>
                        </div>
                    </Form.Control>
                    <Form.FieldErrors class="relative" />
                </Form.Field>
                {#if $message}
                    <span class="text-sm font-medium text-destructive">{$message}</span>
                {/if}

                <div class="mt-4 flex justify-between">
                    <a href="/login" class={`${buttonVariants({ variant: "link", size: "link" })} text-foreground/60`}> Cancel </a>

                    <Form.Button disabled={$submitting} loading={$submitting}>Register</Form.Button>
                </div>
            </form>
        </Card.Content>
    </Card.Root>
</div>
