<script setup lang="ts">
import { ExternalLink, Search } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ref } from "vue";

const searchRef = ref<string | number | undefined>('');

function onSubmit() {
    window.location.href = `https://google.com/search?q=${encodeURIComponent(searchRef.value?.toString() ?? '')}&udm=14`;
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-6 w-full items-center p-4">
        <div class="relative w-full max-w-2xl items-center gap-4">
            <Input @update:model-value="(val) => searchRef = val" :model-value="searchRef" autofocus id="search"
                type="text" class="pl-10 h-12 rounded-full" placeholder="Search…" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-6">
                <Search
                    class="absolute h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100 opacity-75" />
            </span>
        </div>
        <div class="max-w-sm">
            <Button type="submit" class="rounded-full">Search Without AI
                <ExternalLink />
            </Button>
        </div>
    </form>
</template>