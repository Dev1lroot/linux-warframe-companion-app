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

import VoidStorms from './components/VoidStorms.vue'
import VoidFissures from './components/VoidFissures.vue'

</script>

<template>
	<nav>
		<a v-for="option in Navigation.MenuOptions" @click="Navigation.CurrentMenuOption = option.value">{{ option.title }}</a>
	</nav>
	<div class="page" v-if="Navigation.CurrentMenuOption === 'VoidFissures'">
		<div>
			<h2>Void Storms (Railjack)</h2>
			<VoidStorms :WorldState="WorldState" :Locale="Locale" />
		</div>
		<div>
			<h2>Void Fissures</h2>
			<VoidFissures :WorldState="WorldState" :Locale="Locale" :IsSteelPath="false" />
		</div>
		<div>
			<h2>Void Fissures (The Steel Path)</h2>
			<VoidFissures :WorldState="WorldState" :Locale="Locale" :IsSteelPath="true" />
		</div>
	</div>
</template>

<style>
*{
	font-family: sans-serif;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
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
	display: flex;
}
.page > div{
	width: 100%;
}
</style>
