<template>
    <font-awesome-icon v-if="status === 'finished'" icon="check-circle"></font-awesome-icon>
    <font-awesome-icon v-else-if="status === 'running'" icon="arrow-alt-circle-right"></font-awesome-icon>
    <font-awesome-icon v-else-if="status === 'waiting'" icon="hourglass-start"></font-awesome-icon>
    <font-awesome-icon v-else-if="status === 'error'" icon="exclamation-circle"></font-awesome-icon>
    <font-awesome-icon v-else-if="status === 'warning'" icon="exclamation-triangle"></font-awesome-icon>
</template>

<script>
export default {
    name: 'status-icon',
    props: {
        status: String
    }
}
</script>