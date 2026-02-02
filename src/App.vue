<script setup>

import { reactive, provide, computed } from 'vue'

var WorldState = reactive({
    VoidTraders: [],
    SyndicateMissions: [],
    VoidStorms: [],
    ActiveMissions: [],
	SyndicateMissions: []
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
setInterval(() => {
	fetch('/api/warframe/WorldState').then(res => res.json()).then(data => {
		WorldState.VoidTraders = data.VoidTraders;
		WorldState.SyndicateMissions = data.SyndicateMissions;
		WorldState.VoidStorms = data.VoidStorms;
		WorldState.ActiveMissions = data.ActiveMissions;
	});
},30000)
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

import CetusClock from './components/CetusClock.vue'
import VoidFissurePage from './components/VoidFissurePage.vue'

</script>

<template>
	<nav>
		<a v-for="option in Navigation.MenuOptions" @click="Navigation.CurrentMenuOption = option.value">{{ option.title }}</a>
	</nav>
	<div class="page" v-if="Navigation.CurrentMenuOption === 'VoidFissures'">
		<VoidFissurePage :WorldState="WorldState" :Locale="Locale"/>
	</div>
	<div class="page" v-if="Navigation.CurrentMenuOption === 'WorldState'">
		<CetusClock :WorldState="WorldState"/>
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
	position: relative;
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
</style>
