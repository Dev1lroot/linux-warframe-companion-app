<script setup>
	import { ref, computed, onMounted, onUnmounted } from 'vue'
	import VoidFissureCard from './VoidFissureCard.vue'

	const props = defineProps({
		WorldState: Object,
		Locale: Object,
		IsSteelPath: Boolean,
		Title: String
	});

	const now = ref(Date.now());
	let timer = null;

	const filteredMissions = computed(() =>
	{
		if (!props.WorldState?.VoidStorms) return [];
		
		return props.WorldState.VoidStorms.filter(storm =>
		{
			const isHard = !!storm?.Hard;
			
			storm.Location = props.Locale.solNodes?.[storm.Node]?.value || storm.Node;
			storm.FactionName = props.Locale.solNodes?.[storm.Node]?.enemy || 'Unknown';
			storm.MissionName = props.Locale.solNodes?.[storm.Node]?.type || 'Unknown';
			storm.FissureName = props.Locale.fissureModifiers?.[storm.ActiveMissionTier]?.value || storm.ActiveMissionTier;
			storm.FissureCode = storm.ActiveMissionTier;
			
			return props.IsSteelPath ? isHard : !isHard;
		});
	});
</script>

<template>
	<h2 class="VoidFissureTitle">{{ Title }}</h2>
	<div class="VoidFissureGridBox">
		<VoidFissureCard v-for="storm in filteredMissions" :key="storm._id.$oid" :MissionData="storm" :Locale="Locale" />
	</div>
</template>