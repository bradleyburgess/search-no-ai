<script setup lang="ts">
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form, FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea'
import { toTypedSchema } from "@vee-validate/zod";
import { SendHorizontal } from 'lucide-vue-next';
import { ref } from "vue";
import DialogClose from "./ui/dialog/DialogClose.vue";
import type { SubmissionHandler } from "vee-validate";
import { contactFormSchema } from "@/lib/schemas";

type ContactFormValues = {
    name: string,
    email: string,
    subject: string,
    message: string,
};

const hasSubmitted = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const formSchema = toTypedSchema(contactFormSchema);

const onSubmit: SubmissionHandler<ContactFormValues> = async (values, actions) => {
    const { name, email, subject, message } = values;
    const tokenResponse = await fetch('/api/form-token')
    const token = await await tokenResponse.json();
    const contactResponse = await fetch('/api/communique', {
        method: "POST",
        body: JSON.stringify({ token, name, email, subject, message }),
    });
    const contactResponseMessage = await contactResponse.json();
    if (contactResponse.status == 200) {
        hasSubmitted.value = true;
        errorMessage.value = null;
        actions.resetForm();
        return;
    }
    errorMessage.value = contactResponseMessage.error;
}

</script>
<template>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
        <Dialog>
            <Button asChild variant="link" class="text-muted-foreground cursor-pointer p-0">
                <DialogTrigger>Contact</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contact</DialogTitle>
                    <DialogDescription>
                        Questions? Comment? I'd love to hear from you.
                    </DialogDescription>
                </DialogHeader>
                <template v-if="errorMessage">
                    <p class="text-destructive test-sm">{{ errorMessage }}</p>
                </template>
                <form v-if="!hasSubmitted" id="dialogForm"
                    @submit.prevent="handleSubmit($event, onSubmit as SubmissionHandler)">
                    <div class="overflow-y-auto space-y-6">
                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="I'm not a bot, promise" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="email">
                            <FormItem>
                                <FormLabel>Your Email</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="your@email.com" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="subject">
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="I have a question" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="message">
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="…" v-bind="componentField" class="resize-none h-36" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                </form>

                <p v-else>Thanks for your message! I'll be in touch soon.</p>
                <DialogFooter>
                    <DialogClose as-child>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button v-if="!hasSubmitted" type="submit" form="dialogForm">
                        <SendHorizontal /> Send
                    </Button>
                    <Button v-else type="button" @click="hasSubmitted = false">
                        Send another
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>