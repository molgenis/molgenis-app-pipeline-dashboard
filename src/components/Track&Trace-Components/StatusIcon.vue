<template>
    <div class="d-flex justify-content-between align-items-center p-0 m-0">
        <font-awesome-icon :class="{'invisible': !comment}" class="light" icon="envelope-square"></font-awesome-icon>
        <font-awesome-icon class="complete" v-if="status === 'finished'" icon="check-circle"></font-awesome-icon>
        <font-awesome-icon class="running" v-else-if="status === 'running'" icon="arrow-alt-circle-right"></font-awesome-icon>
        <font-awesome-icon class="waiting" v-else-if="status === 'waiting'" icon="hourglass-start"></font-awesome-icon>
        <font-awesome-icon class="error" v-else-if="status === 'error'" icon="exclamation-circle"></font-awesome-icon>
        <font-awesome-icon class="warning" v-else-if="status === 'warning'" icon="exclamation-triangle"></font-awesome-icon>
        <font-awesome-icon class="light invisible" icon="envelope-square"></font-awesome-icon>
    </div>
</template>

<script>
export default {
    name: 'status-icon',
    props: {
        status: {
            type: String,
            required: true
        },
        comment: {
            type: Boolean,
            required: false,
            default: false
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
.light {
    color: $secondary
}
.invisible {
    visibility: hidden;
}
</style>