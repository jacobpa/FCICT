<script>
export let hasTitle = true;
</script>

<style>
section {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #33302e;
  border: 1px solid black;
  box-shadow: 3px 4px 0 black;
}
</style>

<section>
{#if hasTitle}<h2 class='title'><slot name="title"></slot></h2>{/if}
<slot name="body"></slot>
</section>