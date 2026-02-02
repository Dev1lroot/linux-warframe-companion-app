<script setup>

import { reactive, provide, computed } from 'vue'
import { Icon } from '@iconify/vue'

var WorldState = reactive({
    VoidTraders: [],
    SyndicateMissions: [],
    VoidStorms: [],
    ActiveMissions: [],
	SyndicateMissions: [],
	VoidTraders: [],
	Tmp: ""
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
	CurrentMenuOption: 'Main',
	MenuOptions: [
		{
			title: 'Void Fissures',
			value: 'VoidFissures',
			icon: 'mdi:fire'
		},
		{
			title: 'World State',
			value: 'WorldState',
			icon: 'mdi:clock'
		},
	]
});

import CetusClock from './components/CetusClock.vue'
import VoidFissurePage from './components/VoidFissurePage.vue'
import VenusClock from './components/VenusClock.vue';
import DeimosClock from './components/DeimosClock.vue';
import VoidTraderClock from './components/VoidTraderClock.vue';

</script>

<template>
	<div class="page" v-if="Navigation.CurrentMenuOption == 'Main'">
		<a class="WaybackMenu"><Icon icon="mdi:home" width="32" height="32" /> Home</a>
		<div class="MainMenu">
			<a v-for="option in Navigation.MenuOptions" @click="Navigation.CurrentMenuOption = option.value">
				<Icon :icon="option.icon" width="64" height="64"/>
				{{ option.title }}
			</a>
		</div>
	</div>
	<div class="page" v-if="Navigation.CurrentMenuOption != 'Main'">
		<a class="WaybackMenu" @click="Navigation.CurrentMenuOption = 'Main'"><Icon icon="mdi:arrow-left-circle" width="32" height="32" />Back</a>
	</div>
	<div class="page" v-if="Navigation.CurrentMenuOption === 'VoidFissures'">
		<VoidFissurePage :WorldState="WorldState" :Locale="Locale"/>
	</div>
	<div class="page" v-if="Navigation.CurrentMenuOption === 'WorldState'" style="display: flex; gap: 10px;">
		<CetusClock :WorldState="WorldState"/>
		<VenusClock :WorldState="WorldState"/>
		<DeimosClock :WorldState="WorldState"/>
		<VoidTraderClock :WorldState="WorldState" :Locale="Locale"/>
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
.WaybackMenu{
	display: flex;
	align-items: center;
	height: 80px;
	cursor: pointer;
	font-size: 26px;
	opacity: 0.6;
}
.WaybackMenu:hover{
	opacity: 1;
}
.WaybackMenu svg{
	margin-right: 10px;
}
.WarframeCompanion{
	width: calc(100vw - 80px);
	margin: 0px auto;
	position: relative;
}
body{
	background-color: #222;
}
.MainMenu{
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
	gap: 10px;
}
.MainMenu a{
	cursor: pointer;
	border: 2px solid transparent;
	background-color: #FFFFFF10;
	border-radius: 10px;
	aspect-ratio: 1 / 1;
	text-align: center;
}
.MainMenu a svg{
	width: 100%;
	margin-top: 16px;
}
.MainMenu a:hover{
	background-color: #FFFFFF20;
}
.page{
	width: 100%;
}
.page > div{
	width: 100%;
}
</style>
