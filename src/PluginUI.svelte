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
		IconBlend,
		IconUpDown,
		Checkbox,
		SelectMenu,
	} from "figma-plugin-ds-svelte";

	var count = 10;
	var spacing = 100;
	let randomDegrees = true;

	// Menu for choosing mMde
	let menuItemArray = [
		{
			value: "item1",
			label: "Randomize Artboards",
			group: null,
			selected: false,
		},
		{
			value: "item2",
			label: "Combine Artboards",
			group: null,
			selected: false,
		},
	];
	var selectedItem = menuItemArray[0];

	// Deactivate Controls for Combine Artboards Mode
	function setCombineMode() {
		if (selectedItem === menuItemArray[1]) {
			spacing = 0;
			randomDegrees = false;
		} else {
			return;
		}
	}

	onmessage = (event) => {
		currentSelectionWidth =
			event.data.pluginMessage.value.currentSelectionWidth;
		currentSelectionHeight =
			event.data.pluginMessage.value.currentSelectionHeight;
	};

	// Set Height & Width
	var currentSelectionWidth = [];
	var currentSelectionHeight = [];

	function spacingWidth() {
		spacing = currentSelectionWidth;
	}
	function spacingHeight() {
		spacing = currentSelectionHeight;
	}

	// Send from UI to Code
	function createShapes() {
		count = parseInt(count);
		spacing = parseInt(spacing);
		parent.postMessage(
			{
				pluginMessage: {
					type: "create-shapes",
					count: count,
					spacing: spacing,
					randomDegrees: randomDegrees,
					selectedItem: selectedItem,
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
	<SelectMenu
		on:change={setCombineMode}
		bind:menuItems={menuItemArray}
		bind:value={selectedItem}
	/>

	<Label>Count</Label>
	<Input iconText="#" bind:value={count} class="mb-xxsmall" />

	<Label>Spacing</Label>
	<div class="flex p-xxsmall mb-xsmall">
		<Input
			disabled={selectedItem === menuItemArray[1]}
			iconText="#"
			bind:value={spacing}
			type="number"
			class="mb-xxsmall"
		/>
		{#if selectedItem === menuItemArray[0]}
			<IconButton on:click={spacingWidth} iconName={IconArrowLeftRight} />
			<IconButton on:click={spacingHeight} iconName={IconUpDown} />
		{/if}
	</div>

	<Checkbox
		bind:checked={randomDegrees}
		disabled={selectedItem === menuItemArray[1]}
		>Random Rotation (0°, 90°, 180°, 270°)</Checkbox
	>

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
