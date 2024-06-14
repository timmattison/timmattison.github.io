---
title: "A counter for no reason"
date: 2024-06-13
---

# {{ $frontmatter.title }}

This was another sample I saw somewhere that I wanted to keep for reference.

The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>

<script setup>
import {ref} from 'vue'

const count = ref(0)
</script>

