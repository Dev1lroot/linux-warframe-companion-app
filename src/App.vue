<script setup>

import { reactive } from 'vue'

var WorldState = reactive({
    VoidTraders: [],
    SyndicateMissions: [],
    VoidStorms: [],
    ActiveMissions: []
});
var Locale = reactive({
	solNodes: {},
	fissureModifiers: {},
	missionTypes: {}
});

fetch('/api/warframe/WorldState').then(res => res.json()).then(data => {
	WorldState.VoidTraders = data.VoidTraders;
	WorldState.SyndicateMissions = data.SyndicateMissions;
	WorldState.VoidStorms = data.VoidStorms;
	WorldState.ActiveMissions = data.ActiveMissions;
});
fetch('/api/json/solNodes.json').then(res => res.json()).then(data => {
	Locale.solNodes = data;
});
fetch('/api/json/fissureModifiers.json').then(res => res.json()).then(data => {
	Locale.fissureModifiers = data;
});
fetch('/api/json/missionTypes.json').then(res => res.json()).then(data => {
	Locale.missionTypes = data;
});


import VoidStorms from './components/VoidStorms.vue'
import VoidFissures from './components/VoidFissures.vue'

</script>

<template>
	<VoidStorms :WorldState="WorldState" :Locale="Locale" />
	<VoidFissures :WorldState="WorldState" :Locale="Locale" :IsSteelPath="false" />
	<VoidFissures :WorldState="WorldState" :Locale="Locale" :IsSteelPath="true" />
</template>

<style scoped>

</style>
