<script lang="ts" setup>
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

const gl = {
    clearColor: '#82DBC5',
    shadows: true,
    alpha: false,
    shadowMapType: BasicShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
}
</script>

<template>
    <div style="width: 500px; height: 500px;">
        <TresCanvas v-bind="gl">
            <TresPerspectiveCamera :position="[9, 9, 9]" />
            <OrbitControls />
            <TresMesh :position="[-2, 2, 0]" :rotation="[0, Math.PI, 0]">
                <TresConeGeometry :args="[1, 1.5, 3]" />
                <TresMeshToonMaterial color="#82DBC5" />
            </TresMesh>
            <TresMesh :position="[0, 0, 0]" cast-shadow>
                <TresBoxGeometry :args="[1.5, 1.5, 1.5]" />
                <TresMeshToonMaterial color="#4F4F4F" />
            </TresMesh>
            <TresMesh :position="[2, -2, 0]">
                <TresSphereGeometry />
                <TresMeshToonMaterial color="#FBB03B" />
            </TresMesh>
            <TresDirectionalLight :intensity="1.2" :position="[0, 2, 4]" cast-shadow />
        </TresCanvas>
    </div>
</template>

<style>
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}

#app {
    height: 100%;
    width: 100%;
    background-color: #000;
}
</style>
