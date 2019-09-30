<template>
    <font-awesome-icon class="complete" v-if="status === 'finished'" icon="check-circle"></font-awesome-icon>
    <font-awesome-icon class="running" v-else-if="status === 'running'" icon="arrow-alt-circle-right"></font-awesome-icon>
    <font-awesome-icon class="waiting" v-else-if="status === 'waiting'" icon="hourglass-start"></font-awesome-icon>
    <font-awesome-icon class="error" v-else-if="status === 'error'" icon="exclamation-circle"></font-awesome-icon>
    <font-awesome-icon class="warning" v-else-if="status === 'warning'" icon="exclamation-triangle"></font-awesome-icon>
</template>

<script>
export default {
    name: 'status-icon',
    props: {
        status: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>

@import '../../../node_modules/bootstrap/scss/bootstrap';
@import '../../../node_modules/bootstrap-vue/src/index.scss';

.complete {
    color: $success;
    
}
.running {
    color: $primary
}
.waiting {
    color: $secondary
}
.warning {
    color: $warning
}
.error {
    color: $danger
}
</style>