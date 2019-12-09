<template>
    <div class="d-flex justify-content-between align-items-center p-0 m-0">
        <font-awesome-icon :class="{'invisible': !comment}" class="light" icon="envelope-square" size="lg"></font-awesome-icon>
        <font-awesome-icon class="complete" v-if="status === 'finished'" icon="check-circle" size="lg"></font-awesome-icon>
        <font-awesome-icon class="error" v-else-if="status === 'error'" icon="exclamation-circle" size="lg"></font-awesome-icon>
        <font-awesome-icon class="warning" v-else-if="warning" icon="exclamation-triangle" size="lg"></font-awesome-icon>
        <font-awesome-icon class="running" v-else-if="status === 'started'" icon="sync-alt" size="lg"></font-awesome-icon>
        <font-awesome-icon class="waiting" v-else-if="status === 'waiting'" icon="hourglass-start" size="lg"></font-awesome-icon>
        
        <font-awesome-icon class="light invisible" icon="envelope-square" size="lg"></font-awesome-icon>
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
    },
    warning: {
        type: Boolean,
        required: false,
        default: false
    }
  }
}
</script>

<style lang="scss" scoped>

@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

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
