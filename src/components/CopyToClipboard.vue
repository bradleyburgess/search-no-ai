<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-vue-next";
import { ref } from 'vue';

const { textToCopy } = defineProps<{ textToCopy: string }>();

const source = ref(textToCopy);

const { text, copy, copied, isSupported } = useClipboard({ source });
</script>

<template>
    <div v-if="isSupported">
        <Button @click="copy(source)">
            <Copy v-if="!copied" /> <span v-if="!copied">Copy to clipboard
            </span><span v-else>Copied!</span>
        </Button>
    </div>
</template>
