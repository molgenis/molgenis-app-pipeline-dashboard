<template>
  <div class="p-0 m-0">
    <font-awesome-icon class="complete icons" v-if="status === 'finished'" icon="check-circle" ></font-awesome-icon>
    <font-awesome-icon class="error icons" v-else-if="status === 'error'" icon="exclamation-circle"></font-awesome-icon>
    <font-awesome-icon class="warning icons" v-else-if="warning" icon="exclamation-triangle" ></font-awesome-icon>
    <font-awesome-icon class="running icons" v-else-if="status === 'started'" icon="sync-alt" spin></font-awesome-icon>
    <font-awesome-icon class="waiting icons" v-else-if="status === 'waiting'" icon="hourglass-start" ></font-awesome-icon>
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

font-awesome-icon {
    margin: 0;
}
.icons {
  height: 1vw;
  width: 1vw;
}

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
