<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from "figma-plugin-ds-svelte";

	//import some Svelte Figma UI components
	import {
		Button,
		Input,
		Label,
		Icon,
		IconButton,
		IconArrowLeftRight,
		IconUpDown,
	} from "figma-plugin-ds-svelte";

	var count = 10;
	var spacing = 100;

	var currentSelectionWidth = [];
	var currentSelectionHeight = [];

	onmessage = (event) => {
		currentSelectionWidth =
			event.data.pluginMessage.value.currentSelectionWidth;
		currentSelectionHeight =
			event.data.pluginMessage.value.currentSelectionHeight;
	};

	function spacingWidth() {
		spacing = currentSelectionWidth;
	}
	function spacingHeight() {
		spacing = currentSelectionHeight;
	}

	function createShapes() {
		count = parseInt(count);
		spacing = parseInt(spacing);
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
	<Label
		>Spacing (selection: ({currentSelectionWidth}*{currentSelectionHeight}))</Label
	>

	<div class="flex p-xxsmall mb-xsmall">
		<Input
			iconText="#"
			bind:value={spacing}
			type="number"
			class="mb-xxsmall"
		/>
		<IconButton on:click={spacingWidth} iconName={IconArrowLeftRight} />
		<IconButton on:click={spacingHeight} iconName={IconUpDown} />
	</div>

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
