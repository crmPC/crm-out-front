<script setup lang="ts">
    import _ from "lodash";

    const skeletonsArray = _.range(20);
</script>

<template>
    <a-skeleton v-for="sk in skeletonsArray" />
</template>
