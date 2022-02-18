<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from "figma-plugin-ds-svelte";

	//import some Svelte Figma UI components
	import { Button, Input, Label } from "figma-plugin-ds-svelte";

	var count = 5;
	var spacing = 100;

	function createShapes() {
		parent.postMessage(
			{
				pluginMessage: {
					type: "create-shapes",
					count: count,
					spacing: spacing,
				},
			},
			"*"
		);
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
	}
</script>

<div class="wrapper p-xxsmall">
	<Label>Count</Label>
	<Input iconText="#" bind:value={count} class="mb-xxsmall" />
	<Label>Spacing</Label>
	<Input iconText="#" bind:value={spacing} class="mb-xxsmall" />

	<div class="flex p-xxsmall mb-xsmall">
		<Button on:click={cancel} variant="secondary" class="mr-xsmall"
			>Cancel</Button
		>
		<Button on:click={createShapes}>Create shapes</Button>
	</div>
</div>

<style>
	/* Add additional global or scoped styles here */
</style>
