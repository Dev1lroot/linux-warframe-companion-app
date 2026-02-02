<script setup>

import { reactive, provide } from 'vue'

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

var Navigation = reactive({
	CurrentMenuOption: 'VoidFissures',
	MenuOptions: [
		{
			title: 'Void Fissures',
			value: 'VoidFissures'
		},
		{
			title: 'World State',
			value: 'WorldState'
		},
	]
});

const RateVoidFissure = (storm) => {
    let score = 0;
    
    if (storm.MissionName === 'Survival') score += 50;
    if (storm.FissureCode === 'VoidT6') score += 100;
	if(storm.FactionName === 'Infested') score += 30;
	else if(storm.FactionName === 'Grineer') score += 10;
	if(['Capture','Defense'].includes(storm.MissionName)) score += 20;
	if(['Sabotage','Spy','Disruption','Interception'].includes(storm.MissionName)) score -= 50;

    return Math.min(Math.max(score, -100), 100);
};

provide('RateVoidFissure', RateVoidFissure);

import VoidStorms from './components/VoidStorms.vue'
import VoidFissures from './components/VoidFissures.vue'

</script>

<template>
	<nav>
		<a v-for="option in Navigation.MenuOptions" @click="Navigation.CurrentMenuOption = option.value">{{ option.title }}</a>
	</nav>
	<div class="page" v-if="Navigation.CurrentMenuOption === 'VoidFissures'">
		<VoidStorms :Title="'Void Storms (Railjack)'" :WorldState="WorldState" :Locale="Locale" />
		<VoidFissures :Title="'Void Fissures'" :WorldState="WorldState" :Locale="Locale" :IsSteelPath="false" />
		<VoidFissures :Title="'Void Fissures (The Steel Path)'" :WorldState="WorldState" :Locale="Locale" :IsSteelPath="true" />
	</div>
</template>

<style>
*{
	font-family: sans-serif;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	color: #FFF;
}
.WarframeCompanion{
	width: calc(100vw - 80px);
	margin: 0px auto;
}
body{
	background-color: #222;
}
nav{
	display: flex;
}
nav a{
	cursor: pointer;
	display: block;
	padding: 10px;
}
nav a:hover{
	background-color: #00000020;
}
.page{
	width: 100%;
}
.page > div{
	width: 100%;
}


.VoidFissureGridBox{
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 10px;
}
.VoidFissureTitle{
	margin-top: 20px;
	margin-bottom: 10px;
}
</style>
